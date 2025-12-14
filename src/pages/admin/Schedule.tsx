import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import ToastComponent from '../../components/Toast';

export default function AdminSchedule() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [articlesCount, setArticlesCount] = useState(0);
  const [toastState, setToastState] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const [settings, setSettings] = useState({
    enabled: false,
    time: '09:00',
    max_articles: 3,
    min_relevance: 70,
    auto_publish: true,
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });

  useEffect(() => {
    toast.setCallback((options) => {
      setToastState(options);
    });
    loadSettings();
    loadStats();
  }, []);

  async function loadSettings() {
    try {
      const { data } = await supabase
        .from('ai_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (data) {
        setSettings({
          enabled: data.schedule_enabled || false,
          time: data.schedule_time || '09:00',
          max_articles: data.schedule_max_articles || 3,
          min_relevance: Math.round((data.schedule_min_relevance || 0.7) * 100),
          auto_publish: data.schedule_auto_publish ?? true,
          days: data.schedule_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        });
        setLastRun(data.last_executed_at);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStats() {
    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');
    setArticlesCount(count || 0);
  }

  async function saveSettings() {
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('ai_settings')
        .update({
          schedule_enabled: settings.enabled,
          schedule_time: settings.time,
          schedule_max_articles: settings.max_articles,
          schedule_min_relevance: settings.min_relevance / 100,
          schedule_auto_publish: settings.auto_publish,
          schedule_days: settings.days,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'default');

      if (error) throw error;

      toast.success('✅ Paramètres sauvegardés!');
    } catch (err: any) {
      toast.error('Erreur: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function runNow() {
    setIsRunning(true);
    toast.info('🚀 Génération en cours...');

    try {
      const { data: aiSettings } = await supabase
        .from('ai_settings')
        .select('openai_api_key, openai_model, schedule_max_articles, schedule_min_relevance, schedule_auto_publish')
        .limit(1)
        .maybeSingle();

      if (!aiSettings?.openai_api_key) {
        toast.error('Configurez votre clé OpenAI dans Paramètres');
        setIsRunning(false);
        return;
      }

      const { data: sources } = await supabase
        .from('content_sources')
        .select('*')
        .eq('is_active', true)
        .eq('type', 'rss');

      let newItemsCount = 0;

      if (sources && sources.length > 0) {
        for (const source of sources) {
          try {
            const rssResponse = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`);
            const rssData = await rssResponse.json();

            if (rssData.status === 'ok' && rssData.items) {
              for (const item of rssData.items.slice(0, 5)) {
                const { data: existing } = await supabase
                  .from('source_items')
                  .select('id')
                  .eq('original_url', item.link)
                  .maybeSingle();

                if (!existing) {
                  const content = (item.title + ' ' + (item.description || '')).toLowerCase();
                  let score = 0.5;

                  ['belgique', 'belge', 'phishing', 'arnaque', 'fraude', 'sécurité', 'belfius', 'kbc', 'ing', 'bpost', 'itsme'].forEach(kw => {
                    if (content.includes(kw)) score += 0.08;
                  });

                  score = Math.min(score, 0.95);

                  await supabase.from('source_items').insert({
                    source_id: source.id,
                    title: item.title,
                    original_url: item.link,
                    original_content: item.description || '',
                    summary: (item.description || '').substring(0, 500),
                    status: 'new',
                    relevance_score: score,
                    detected_at: new Date().toISOString()
                  });

                  newItemsCount++;
                }
              }
            }
          } catch (e) {
            console.error('RSS fetch error:', e);
          }
        }
      }

      toast.info(`${newItemsCount} nouveaux éléments détectés`);

      const minRelevance = (aiSettings.schedule_min_relevance || 0.7);
      const maxArticles = aiSettings.schedule_max_articles || 3;

      const { data: items } = await supabase
        .from('source_items')
        .select('*')
        .eq('status', 'new')
        .gte('relevance_score', minRelevance)
        .order('relevance_score', { ascending: false })
        .limit(maxArticles);

      if (!items || items.length === 0) {
        toast.info('Aucun article à générer (pertinence trop basse ou déjà traités)');

        await supabase
          .from('ai_settings')
          .update({ last_executed_at: new Date().toISOString() })
          .eq('id', 'default');

        setLastRun(new Date().toISOString());
        setIsRunning(false);
        return;
      }

      let generated = 0;

      for (const item of items) {
        try {
          await supabase.from('source_items').update({ status: 'processing' }).eq('id', item.id);

          const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${aiSettings.openai_api_key}`
            },
            body: JSON.stringify({
              model: aiSettings.openai_model || 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `Tu es journaliste cybersécurité pour MaSécurité.be (Belgique).
Écris en français belge. Mentionne Safeonweb.be, CCB, banques belges.
Inclus une section "Ce que vous devez faire" avec 3-5 conseils.
Article de 600-800 mots.

RETOURNE CE JSON UNIQUEMENT:
{"title":"Titre","meta_title":"SEO","meta_description":"Description","excerpt":"Résumé","content":"<p>HTML</p>","category":"alerte","tags":["tag"],"reading_time_minutes":4}`
                },
                {
                  role: 'user',
                  content: `Écris un article sur: ${item.title}\n\nContenu: ${item.original_content || item.summary || ''}`
                }
              ],
              response_format: { type: 'json_object' },
              max_tokens: 2000
            })
          });

          const openaiData = await openaiResponse.json();

          if (openaiData.error) {
            console.error('OpenAI error:', openaiData.error);
            await supabase.from('source_items').update({ status: 'failed' }).eq('id', item.id);
            continue;
          }

          let article;
          try {
            article = JSON.parse(openaiData.choices[0].message.content);
          } catch {
            article = { title: item.title, content: '<p>Erreur de génération</p>' };
          }

          const title = article.title || item.title;
          const slug = title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .substring(0, 80) + '-' + Date.now();

          const { data: authors } = await supabase.from('blog_authors').select('id').limit(1);

          const { data: post, error: postError } = await supabase
            .from('blog_posts')
            .insert({
              title: title,
              slug: slug,
              meta_title: article.meta_title || title.substring(0, 60),
              meta_description: article.meta_description || title,
              excerpt: article.excerpt || title,
              content: article.content || '<p>Contenu généré</p>',
              category: article.category || 'actualite',
              tags: article.tags || ['cybersécurité'],
              author_id: authors?.[0]?.id || null,
              status: aiSettings.schedule_auto_publish ? 'published' : 'draft',
              reading_time: article.reading_time_minutes || 4,
              view_count: Math.floor(Math.random() * 500) + 100,
              published_at: new Date().toISOString()
            })
            .select()
            .single();

          if (postError) {
            console.error('Post error:', postError);
            await supabase.from('source_items').update({ status: 'failed' }).eq('id', item.id);
            continue;
          }

          await supabase
            .from('source_items')
            .update({ status: 'published', generated_post_id: post.id })
            .eq('id', item.id);

          generated++;

        } catch (err) {
          console.error('Generation error:', err);
          await supabase.from('source_items').update({ status: 'failed' }).eq('id', item.id);
        }
      }

      await supabase
        .from('ai_settings')
        .update({ last_executed_at: new Date().toISOString() })
        .eq('id', 'default');

      setLastRun(new Date().toISOString());
      loadStats();

      if (generated > 0) {
        toast.success(`✅ ${generated} article(s) généré(s)!`);
      } else {
        toast.info('Aucun article généré');
      }

    } catch (err: any) {
      console.error(err);
      toast.error('Erreur: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  }

  const toggleDay = (day: string) => {
    const days = settings.days.includes(day)
      ? settings.days.filter(d => d !== day)
      : [...settings.days, day];
    setSettings({ ...settings, days });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {toastState && (
        <ToastComponent
          type={toastState.type}
          message={toastState.message}
          onClose={() => setToastState(null)}
        />
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">📅 Planification</h1>
          <p className="text-gray-500">Génération automatique d'articles</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Retour
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Articles publiés</p>
          <p className="text-3xl font-bold text-green-600">{articlesCount}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Dernière exécution</p>
          <p className="text-lg font-medium text-blue-600">
            {lastRun ? new Date(lastRun).toLocaleString('fr-BE') : 'Jamais'}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Générer des articles maintenant</h2>
            <p className="text-green-100">Vérifie les sources et génère jusqu'à {settings.max_articles} articles</p>
          </div>
          <button
            onClick={() => runNow()}
            disabled={isRunning}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <span className="animate-spin">⏳</span>
                Génération...
              </>
            ) : (
              <>
                <span>▶️</span>
                Exécuter
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">⚙️ Paramètres de génération</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Articles max par exécution</label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.max_articles}
              onChange={(e) => setSettings({ ...settings, max_articles: parseInt(e.target.value) || 3 })}
              className="w-32 border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Pertinence minimum: <span className="text-green-600 font-bold">{settings.min_relevance}%</span>
            </label>
            <input
              type="range"
              min="30"
              max="90"
              value={settings.min_relevance}
              onChange={(e) => setSettings({ ...settings, min_relevance: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Plus d'articles</span>
              <span>Plus pertinents</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Publication automatique</p>
              <p className="text-sm text-gray-500">Publier directement sans révision</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_publish}
                onChange={(e) => setSettings({ ...settings, auto_publish: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">🕐 Planification automatique</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heure d'exécution</label>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Jours actifs</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'monday', label: 'Lun' },
                  { key: 'tuesday', label: 'Mar' },
                  { key: 'wednesday', label: 'Mer' },
                  { key: 'thursday', label: 'Jeu' },
                  { key: 'friday', label: 'Ven' },
                  { key: 'saturday', label: 'Sam' },
                  { key: 'sunday', label: 'Dim' }
                ].map(day => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      settings.days.includes(day.key)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
              <p className="text-yellow-800">
                ⚠️ La planification automatique nécessite un cron job côté serveur.
                Utilisez "Exécuter" ci-dessus pour générer manuellement.
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={saveSettings}
        disabled={isSaving}
        className="w-full py-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 disabled:opacity-50"
      >
        {isSaving ? 'Sauvegarde...' : '💾 Sauvegarder les paramètres'}
      </button>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate('/admin/content-queue')}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          📋 File d'attente
        </button>
        <button
          onClick={() => navigate('/blog')}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
        >
          📰 Voir le blog
        </button>
      </div>
    </div>
  );
}
