import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock } from 'lucide-react';
import Toast from '../../components/Toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHeader from '../../components/PageHeader';

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function AdminGenerate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({ posts: 0, sources: 0, pending: 0 });
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [maxArticles, setMaxArticles] = useState(2);
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
    setToast({ type: 'info', message: '🔍 Vérification des sources en cours...' });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-sources`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la vérification des sources');
      }

      const newItems = result.results?.filter((r: any) => r.status === 'added').length || 0;
      setToast({ type: 'success', message: `✅ ${newItems} nouveaux articles détectés sur ${result.processed} sources` });
      loadData();
    } catch (err: any) {
      console.error('Check sources error:', err);
      if (err.name === 'AbortError') {
        setToast({ type: 'error', message: 'Timeout: La vérification prend trop de temps. Réessayez.' });
      } else {
        setToast({ type: 'error', message: `Erreur: ${err.message}` });
      }
    } finally {
      setIsChecking(false);
    }
  }

  async function generateArticles() {
    setIsGenerating(true);
    setToast({ type: 'info', message: '🤖 Génération en cours...' });

    try {
      const { data: items } = await supabase.from('source_items').select('*').eq('status', 'new')
        .gte('relevance_score', minRelevance / 100).order('relevance_score', { ascending: false }).limit(maxArticles);

      if (!items?.length) {
        setToast({ type: 'info', message: 'Aucun article à générer' });
        setIsGenerating(false);
        return;
      }

      let generated = 0;
      let failed = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        try {
          // Add 3 second delay between API calls to avoid rate limits
          if (i > 0) {
            setToast({ type: 'info', message: `⏳ Attente pour éviter les limites API... (${i}/${items.length})` });
            await delay(3000);
          }

          setToast({ type: 'info', message: `🤖 Génération de l'article ${i + 1}/${items.length}...` });

          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-article`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ source_item_id: item.id })
          });

          const result = await response.json();

          if (!response.ok) {
            // Check for rate limit errors
            if (response.status === 429 || result.error?.includes('rate_limit') || result.error?.includes('Rate limit')) {
              setToast({ type: 'error', message: '⏳ Limite API atteinte. Attendez 1 minute et réessayez.' });
              throw new Error('Rate limit exceeded');
            }
            throw new Error(result.error || 'Generation failed');
          }

          generated++;
          setToast({ type: 'success', message: `✅ Article généré (${generated}/${items.length})` });
        } catch (err: any) {
          console.error('Generation error:', err);
          failed++;

          // Show specific error message for rate limits
          if (err.message.includes('rate_limit') || err.message.includes('Rate limit')) {
            setToast({ type: 'error', message: `⏳ Limite API atteinte. Attendez 1 minute et réessayez.` });
          } else {
            setToast({ type: 'error', message: `❌ Erreur: ${err.message}` });
          }
        }
      }

      if (generated > 0) {
        setToast({ type: 'success', message: `🎉 ${generated} article(s) généré(s)${failed > 0 ? `, ${failed} échec(s)` : ''}!` });
        loadData();
      } else {
        setToast({ type: 'error', message: 'Aucun article généré. Vérifiez la configuration OpenAI.' });
      }
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
