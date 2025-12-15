import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, FileText, Zap, Clock } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

interface Stats {
  total_sources: number;
  active_sources: number;
  total_items: number;
  new_items: number;
  processing_items: number;
  published_items: number;
  total_tokens_month: number;
  estimated_cost_month: number;
  articles_generated_month: number;
  avg_cost_per_article: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    loadRecentPosts();
  }, []);

  const loadStats = async () => {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [
        { count: total_sources },
        { count: active_sources },
        { count: total_items },
        { count: new_items },
        { count: processing_items },
        { count: published_items },
        { data: logsMonth }
      ] = await Promise.all([
        supabase.from('content_sources').select('*', { count: 'exact', head: true }),
        supabase.from('content_sources').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('source_items').select('*', { count: 'exact', head: true }),
        supabase.from('source_items').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('source_items').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
        supabase.from('source_items').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase
          .from('ai_generation_logs')
          .select('total_tokens, estimated_cost_usd, operation_type')
          .gte('created_at', startOfMonth.toISOString())
      ]);

      const total_tokens_month = logsMonth?.reduce((sum, log) => sum + (log.total_tokens || 0), 0) || 0;
      const estimated_cost_month = logsMonth?.reduce((sum, log) => sum + (parseFloat(log.estimated_cost_usd) || 0), 0) || 0;
      const articles_generated_month = logsMonth?.filter(log => log.operation_type === 'article_generation').length || 0;
      const avg_cost_per_article = articles_generated_month > 0 ? estimated_cost_month / articles_generated_month : 0;

      setStats({
        total_sources: total_sources || 0,
        active_sources: active_sources || 0,
        total_items: total_items || 0,
        new_items: new_items || 0,
        processing_items: processing_items || 0,
        published_items: published_items || 0,
        total_tokens_month,
        estimated_cost_month,
        articles_generated_month,
        avg_cost_per_article
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentPosts = async () => {
    try {
      const { data: items, error } = await supabase
        .from('source_items')
        .select('id, title, relevance_score, updated_at, generated_post_id, content_sources(name)')
        .eq('status', 'published')
        .not('generated_post_id', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (items && items.length > 0) {
        const postIds = items.map(item => item.generated_post_id).filter(Boolean);
        const { data: posts } = await supabase
          .from('blog_posts')
          .select('id, slug, title')
          .in('id', postIds);

        const itemsWithPosts = items.map(item => ({
          ...item,
          blog_post: posts?.find(p => p.id === item.generated_post_id)
        }));

        setRecentPosts(itemsWithPosts);
      } else {
        setRecentPosts([]);
      }
    } catch (error) {
      console.error('Error loading recent posts:', error);
    }
  };

  if (loading) {
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
          title="Tableau de Bord AI"
          subtitle="Vue d'ensemble du système de génération automatique de contenu"
          icon={BarChart3}
        />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div
              onClick={() => navigate('/admin/sources')}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Sources Actives</h3>
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.active_sources}</p>
              <p className="text-xs text-gray-500 mt-1">sur {stats?.total_sources} sources totales</p>
            </div>

            <div
              onClick={() => navigate('/admin/content-queue')}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">En Attente</h3>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.new_items}</p>
              <p className="text-xs text-gray-500 mt-1">{stats?.total_items} éléments au total</p>
            </div>

            <div
              onClick={() => navigate('/admin/content-queue')}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Publiés</h3>
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.published_items}</p>
              <p className="text-xs text-gray-500 mt-1">articles générés</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Coût ce Mois</h3>
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                ${stats?.estimated_cost_month.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats?.articles_generated_month} articles générés</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Utilisation API ce Mois</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Articles générés</p>
                    <p className="text-2xl font-bold text-blue-600">{stats?.articles_generated_month}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Tokens utilisés</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats?.total_tokens_month.toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Coût moyen / article</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ${stats?.avg_cost_per_article.toFixed(3)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>

              <div className="space-y-3">
                <Link
                  to="/admin/generate"
                  className="block w-full px-4 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all text-center shadow-lg"
                >
                  🚀 Générer des Articles
                </Link>
                <Link
                  to="/admin/content-queue"
                  className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  File d'Attente
                </Link>
                <Link
                  to="/admin/sources"
                  className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Gérer les Sources
                </Link>
                <Link
                  to="/admin/settings"
                  className="block w-full px-4 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
                >
                  Paramètres
                </Link>
                <Link
                  to="/admin/schedule"
                  className="block w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <span>📅</span> Planification
                </Link>
                <Link
                  to="/admin/diagnostics"
                  className="block w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-center flex items-center justify-center gap-2"
                >
                  <span>🔍</span> Diagnostics
                </Link>

                <button
                  onClick={async () => {
                    setChecking(true);
                    setCheckResult(null);
                    try {
                      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-sources`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                          'Content-Type': 'application/json',
                        }
                      });

                      if (response.ok) {
                        const result = await response.json();
                        const newItems = result.newItemsCount || 0;
                        setCheckResult(`Vérification terminée: ${newItems} nouveau${newItems > 1 ? 'x' : ''} élément${newItems > 1 ? 's' : ''} détecté${newItems > 1 ? 's' : ''}`);
                        setTimeout(() => {
                          loadStats();
                          setCheckResult(null);
                        }, 5000);
                      } else {
                        setCheckResult('Erreur lors de la vérification');
                      }
                    } catch (error) {
                      console.error('Error checking sources:', error);
                      setCheckResult('Erreur lors de la vérification');
                    } finally {
                      setChecking(false);
                    }
                  }}
                  disabled={checking}
                  className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checking ? (
                    <>
                      <Zap className="w-5 h-5 animate-spin" />
                      Vérification en cours...
                    </>
                  ) : (
                    'Vérifier les Sources'
                  )}
                </button>
                {checkResult && (
                  <div className={`mt-2 p-3 rounded-lg text-sm font-semibold ${
                    checkResult.includes('Erreur') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {checkResult}
                  </div>
                )}
              </div>
            </div>
          </div>

          {recentPosts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Articles Récemment Générés</h2>

              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => post.blog_post?.slug && navigate(`/blog/${post.blog_post.slug}`)}
                    className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-200 ${
                      post.blog_post?.slug ? 'cursor-pointer hover:bg-gray-100 hover:shadow-md' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {post.blog_post?.title || post.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Source: {post.content_sources?.name}
                        {post.relevance_score && (
                          <span className="ml-3 text-green-600 font-semibold">
                            • Pertinence: {Math.round(post.relevance_score * 100)}%
                          </span>
                        )}
                      </p>
                    </div>
                    {post.blog_post?.slug && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/blog/${post.blog_post.slug}`, '_blank');
                        }}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
                      >
                        Voir l'article
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
