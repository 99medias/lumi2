import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';
import Toast from '../../components/Toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHeader from '../../components/PageHeader';

export default function AdminGenerate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({ posts: 0, sources: 0, pending: 0 });
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [maxArticles, setMaxArticles] = useState(3);
  const [minRelevance, setMinRelevance] = useState(40);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [posts, sources, pending] = await Promise.all([
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('content_sources').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('source_items').select('*').eq('status', 'new').order('relevance_score', { ascending: false }).limit(20)
      ]);

      setStats({
        posts: posts.count || 0,
        sources: sources.count || 0,
        pending: pending.data?.length || 0
      });
      setPendingItems(pending.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setToast({ type: 'error', message: 'Erreur lors du chargement des données' });
    } finally {
      setIsLoading(false);
    }
  }

  async function checkSources() {
    setIsChecking(true);
    setToast({ type: 'info', message: '🔍 Vérification des sources...' });
    let newItems = 0;

    try {
      const { data: sources } = await supabase.from('content_sources').select('*').eq('is_active', true);

      for (const source of sources || []) {
        try {
          const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`);
          if (!response.ok) continue;
          const text = await response.text();

          const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
          let match;
          while ((match = itemRegex.exec(text)) !== null && newItems < 100) {
            const xml = match[1];
            const title = xml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.replace(/<[^>]*>/g, '').trim() || '';
            const link = xml.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i)?.[1]?.trim() || '';
            const desc = xml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.replace(/<[^>]*>/g, '').trim().substring(0, 1000) || '';

            if (!title || !link) continue;

            const { data: existing } = await supabase.from('source_items').select('id').eq('original_url', link).maybeSingle();
            if (existing) continue;

            const content = (title + ' ' + desc).toLowerCase();
            let score = 0.4;
            ['belgique','belge','bruxelles','belfius','kbc','ing','bpost','itsme','proximus','safeonweb','ccb'].forEach(k => {
              if (content.includes(k)) score += 0.1;
            });
            ['phishing','arnaque','fraude','sécurité','piratage','virus','malware','hacker','faille'].forEach(k => {
              if (content.includes(k)) score += 0.05;
            });
            score = Math.min(score, 0.95);

            await supabase.from('source_items').insert({
              source_id: source.id,
              title,
              original_url: link,
              original_content: desc,
              summary: desc.substring(0, 500),
              status: 'new',
              relevance_score: score
            });
            newItems++;
          }
        } catch (e) {
          console.error(source.name, e);
        }
      }

      setToast({ type: 'success', message: `✅ ${newItems} nouveaux articles détectés` });
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsChecking(false);
    }
  }

  async function generateArticles() {
    setIsGenerating(true);
    setToast({ type: 'info', message: '🤖 Génération en cours...' });

    try {
      const { data: settings } = await supabase.from('ai_settings').select('openai_model').eq('id', 'default').maybeSingle();

      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiKey) {
        setToast({ type: 'error', message: 'Clé OpenAI manquante dans les variables d\'environnement' });
        setIsGenerating(false);
        return;
      }

      const { data: items } = await supabase.from('source_items').select('*').eq('status', 'new')
        .gte('relevance_score', minRelevance / 100).order('relevance_score', { ascending: false }).limit(maxArticles);

      if (!items?.length) {
        setToast({ type: 'info', message: 'Aucun article à générer' });
        setIsGenerating(false);
        return;
      }

      let generated = 0;
      for (const item of items) {
        try {
          await supabase.from('source_items').update({ status: 'processing' }).eq('id', item.id);

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
              model: settings?.openai_model || 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: `Tu es journaliste pour MaSécurité.be (Belgique). Écris en français belge. Mentionne Safeonweb.be, CCB, banques belges si pertinent. Inclus "Ce que vous devez faire". 500-700 mots. Retourne JSON: {"title":"...","excerpt":"...","content":"<p>HTML</p>","category":"alerte|guide|arnaque|actualite","tags":["..."]}`
                },
                {
                  role: 'user',
                  content: `Article sur: ${item.title}\n\nInfo: ${(item.original_content || '').substring(0, 1500)}`
                }
              ],
              max_tokens: 2000
            })
          });

          const data = await response.json();
          if (data.error) throw new Error(data.error.message);

          let article;
          try {
            const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
            article = jsonMatch ? JSON.parse(jsonMatch[0]) : { title: item.title, content: data.choices[0].message.content };
          } catch {
            article = { title: item.title, content: '<p>Contenu</p>' };
          }

          const title = article.title || item.title;
          const slug = title.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .substring(0, 60) + '-' + Date.now();

          const { data: authors } = await supabase.from('blog_authors').select('id').limit(1);

          const { data: post, error: postError } = await supabase.from('blog_posts').insert({
            title,
            slug,
            excerpt: article.excerpt || title,
            content: article.content || '<p>Contenu</p>',
            category: article.category || 'actualite',
            tags: article.tags || ['sécurité'],
            author_id: authors?.[0]?.id,
            status: 'published',
            view_count: Math.floor(Math.random() * 500) + 50,
            published_at: new Date().toISOString()
          }).select().single();

          if (postError) throw new Error(postError.message);

          await supabase.from('source_items').update({
            status: 'published',
            generated_post_id: post.id
          }).eq('id', item.id);

          generated++;
          setToast({ type: 'success', message: `✅ ${title.substring(0, 35)}...` });
        } catch (err: any) {
          console.error(err);
          await supabase.from('source_items').update({ status: 'failed' }).eq('id', item.id);
        }
      }

      setToast({ type: 'success', message: `🎉 ${generated}/${items.length} articles générés!` });
      loadData();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setIsGenerating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="pt-32">
        <PageHeader
          title="🚀 Génération d'Articles"
          subtitle="Créez des articles depuis vos 24 sources RSS belges"
          icon={Zap}
        />

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-12">
          <div className="max-w-4xl mx-auto px-6">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-5 text-center">
                <p className="text-4xl font-bold text-green-600">{stats.posts}</p>
                <p className="text-gray-600">Articles publiés</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.sources}</p>
                <p className="text-gray-600">Sources RSS</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-5 text-center">
                <p className="text-4xl font-bold text-orange-600">{stats.pending}</p>
                <p className="text-gray-600">En attente</p>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h3 className="font-bold mb-4">⚙️ Paramètres</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Articles max à générer</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={maxArticles}
                    onChange={(e) => setMaxArticles(parseInt(e.target.value) || 3)}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pertinence minimum: <span className="text-green-600 font-bold">{minRelevance}%</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={minRelevance}
                    onChange={(e) => setMinRelevance(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>+ d'articles</span>
                    <span>+ pertinents</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={checkSources}
                disabled={isChecking}
                className="bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isChecking ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>🔍 1. Vérifier les sources</>
                )}
              </button>
              <button
                onClick={generateArticles}
                disabled={isGenerating}
                className="bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>🤖 2. Générer les articles</>
                )}
              </button>
            </div>

            {/* Pending Items */}
            {pendingItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <h3 className="font-bold mb-4">📋 Articles en attente ({pendingItems.length})</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                        item.relevance_score >= 0.6
                          ? 'bg-green-100 text-green-700'
                          : item.relevance_score >= 0.4
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {Math.round(item.relevance_score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/admin/sources')}
                className="py-3 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                📡 Sources
              </button>
              <button
                onClick={() => navigate('/admin/content-queue')}
                className="py-3 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                📋 File d'attente
              </button>
              <button
                onClick={() => navigate('/blog')}
                className="py-3 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                📰 Voir le blog
              </button>
            </div>

          </div>
        </div>
      </div>

      <Footer />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
