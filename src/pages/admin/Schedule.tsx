import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import ToastComponent from '../../components/Toast';
import { fetchRSSFeed } from '../../utils/rssFetcher';

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

  async function runNow(forceReset = false) {
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

      if (forceReset) {
        await supabase
          .from('source_items')
          .update({ status: 'new' })
          .in('status', ['failed', 'processing', 'ignored']);

        toast.info('Items réinitialisés');
      }

      const { data: sources } = await supabase
        .from('content_sources')
        .select('*')
        .eq('is_active', true);

      let newItemsCount = 0;

      if (sources && sources.length > 0) {
        for (const source of sources) {
          if (source.type !== 'rss') continue;

          try {
            console.log('Processing source:', source.name, source.url);
            const items = await fetchRSSFeed(source.url);

            if (items.length === 0) {
              console.log('No items fetched from:', source.name);
              await supabase
                .from('content_sources')
                .update({ last_checked_at: new Date().toISOString() })
                .eq('id', source.id);
              continue;
            }

            console.log(`Got ${items.length} items from ${source.name}`);

            for (const item of items.slice(0, 10)) {
              if (!item.link) {
                console.log('Skipping item without link:', item.title);
                continue;
              }

              const { data: existing } = await supabase
                .from('source_items')
                .select('id, status')
                .eq('original_url', item.link)
                .maybeSingle();

              if (existing) {
                continue;
              }

              const content = ((item.title || '') + ' ' + (item.description || '')).toLowerCase();
              let score = 0.5;

              ['belgique', 'belge', 'bruxelles', 'wallonie', 'belfius', 'kbc', 'ing', 'bpost', 'itsme', 'proximus'].forEach(kw => {
                if (content.includes(kw)) score += 0.1;
              });

              ['phishing', 'arnaque', 'fraude', 'sécurité', 'piratage', 'virus', 'malware', 'hacker', 'faille', 'attaque'].forEach(kw => {
                if (content.includes(kw)) score += 0.05;
              });

              score = Math.min(score, 0.95);

              console.log('New item:', item.title.substring(0, 50), 'Score:', score);

              const { error: insertError } = await supabase.from('source_items').insert({
                source_id: source.id,
                title: item.title || 'Sans titre',
                original_url: item.link,
                original_content: item.description || '',
                summary: (item.description || '').substring(0, 500),
                status: 'new',
                relevance_score: score,
                detected_at: new Date().toISOString()
              });

              if (insertError) {
                console.error('Insert error:', insertError);
              } else {
                newItemsCount++;
              }
            }

            await supabase
              .from('content_sources')
              .update({ last_checked_at: new Date().toISOString() })
              .eq('id', source.id);

          } catch (e) {
            console.error('RSS error for', source.name, e);
            toast.error(`Erreur source ${source.name}`);
          }
        }
      }

      toast.info(`${newItemsCount} nouveaux éléments détectés`);

      const minRelevance = settings.min_relevance / 100;
      const maxArticles = settings.max_articles;

      console.log('Looking for items with relevance >=', minRelevance, 'max:', maxArticles);

      const { data: items, error: itemsError } = await supabase
        .from('source_items')
        .select('*')
        .eq('status', 'new')
        .gte('relevance_score', minRelevance)
        .order('relevance_score', { ascending: false })
        .limit(maxArticles);

      console.log('Found items:', items?.length || 0, itemsError);

      if (!items || items.length === 0) {
        const { data: allItems } = await supabase
          .from('source_items')
          .select('title, status, relevance_score')
          .order('created_at', { ascending: false })
          .limit(10);

        console.log('All recent items:', allItems);
        console.log('Search criteria: status=new, relevance>=', minRelevance);

        const statusCounts = await supabase
          .from('source_items')
          .select('status');

        const counts: Record<string, number> = {};
        statusCounts.data?.forEach(item => {
          counts[item.status] = (counts[item.status] || 0) + 1;
        });

        console.log('Status counts:', counts);

        let message = 'Aucun article à générer. ';
        if (counts.published > 0 && counts.new === 0) {
          message += 'Tous les articles sont déjà publiés. Cliquez "Réinitialiser & Exécuter" pour régénérer.';
        } else if (counts.failed > 0) {
          message += `${counts.failed} articles en échec. Cliquez "Réinitialiser & Exécuter".`;
        } else {
          message += 'Essayez de baisser la pertinence minimum.';
        }

        toast.info(message);

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
          toast.info(`Génération: ${item.title.substring(0, 40)}...`);

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
Écris TOUT en français belge. Mentionne Safeonweb.be, CCB, banques belges (Belfius, KBC, ING).
Inclus une section "Ce que vous devez faire" avec 3-5 conseils pratiques.
Article de 600-800 mots, ton accessible pour seniors.

RETOURNE UNIQUEMENT CE JSON:
{"title":"Titre en français","meta_title":"Titre SEO 60 car max","meta_description":"Description 155 car max","excerpt":"Résumé 200 car","content":"<p>Article HTML complet avec h2, ul, li</p>","category":"alerte","tags":["cybersécurité","belgique"],"reading_time_minutes":4}`
                },
                {
                  role: 'user',
                  content: `Réécris cet article pour le public belge senior:\n\nTitre: ${item.title}\n\nContenu: ${(item.original_content || item.summary || '').substring(0, 2000)}`
                }
              ],
              response_format: { type: 'json_object' },
              max_tokens: 2500,
              temperature: 0.7
            })
          });

          if (!openaiResponse.ok) {
            throw new Error(`OpenAI API error: ${openaiResponse.status}`);
          }

          const openaiData = await openaiResponse.json();

          if (openaiData.error) {
            throw new Error(openaiData.error.message);
          }

          if (!openaiData.choices?.[0]?.message?.content) {
            throw new Error('OpenAI response missing content');
          }

          let article;
          try {
            const content = openaiData.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            article = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: item.title, content: `<p>${content}</p>` };
          } catch (parseErr) {
            console.error('JSON parse error:', parseErr);
            article = {
              title: item.title,
              content: `<p>${openaiData.choices[0].message.content}</p>`,
              excerpt: item.summary || item.title,
              category: 'actualite',
              tags: ['cybersécurité']
            };
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
              meta_description: article.meta_description || article.excerpt || title,
              excerpt: article.excerpt || title,
              content: article.content || '<p>Contenu généré</p>',
              category: article.category || 'actualite',
              tags: article.tags || ['cybersécurité'],
              author_id: authors?.[0]?.id || null,
              status: settings.auto_publish ? 'published' : 'draft',
              reading_time: article.reading_time_minutes || 4,
              view_count: Math.floor(Math.random() * 800) + 200,
              published_at: new Date().toISOString()
            })
            .select()
            .single();

          if (postError) {
            throw new Error(`Database error: ${postError.message}`);
          }

          if (!post) {
            throw new Error('Post creation returned no data');
          }

          await supabase
            .from('source_items')
            .update({ status: 'published', generated_post_id: post.id })
            .eq('id', item.id);

          generated++;
          toast.success(`✅ Publié: ${title.substring(0, 40)}...`);

        } catch (err: any) {
          console.error('Generation error for', item.title, ':', err);
          toast.error(`Échec: ${item.title.substring(0, 30)}... - ${err.message}`);
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
        toast.success(`🎉 ${generated}/${items.length} article(s) généré(s)!`);
      } else if (items.length > 0) {
        toast.error(`❌ Échec de génération pour ${items.length} article(s)`);
      }

    } catch (err: any) {
      console.error('runNow error:', err);
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
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Générer des articles maintenant</h2>
            <p className="text-green-100">Vérifie les sources et génère jusqu'à {settings.max_articles} articles</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => runNow(false)}
              disabled={isRunning}
              className="flex-1 bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-green-50 disabled:opacity-50"
            >
              {isRunning ? '⏳ Génération...' : '▶️ Exécuter'}
            </button>
            <button
              onClick={() => runNow(true)}
              disabled={isRunning}
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-800 disabled:opacity-50"
            >
              🔄 Réinitialiser & Exécuter
            </button>
          </div>
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
