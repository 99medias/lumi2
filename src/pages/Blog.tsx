import { useState, useEffect } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ArticleCard from '../components/blog/ArticleCard';
import BlogSidebar from '../components/blog/BlogSidebar';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { getOrganizationSchema, getWebSiteSchema } from '../utils/structuredData';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string;
  category: 'alerte' | 'guide' | 'actualite' | 'arnaque';
  reading_time: number;
  view_count: number;
  published_at: string;
  updated_at?: string;
  is_featured: boolean;
  blog_authors?: {
    name: string;
  };
}

type CategoryFilter = 'all' | 'alerte' | 'guide' | 'actualite' | 'arnaque';

const categories: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'alerte', label: 'Alertes Belgique' },
  { value: 'guide', label: 'Guides Pratiques' },
  { value: 'actualite', label: 'Actualités' },
  { value: 'arnaque', label: 'Arnaques Signalées' },
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  useEffect(() => {
    fetchPosts();
    fetchPopularPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          slug,
          title,
          excerpt,
          featured_image,
          category,
          reading_time,
          view_count,
          published_at,
          updated_at,
          is_featured,
          blog_authors!inner(name)
        `)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      if (activeCategory !== 'all') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, title, view_count')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('view_count', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPopularPosts(data || []);
    } catch (error) {
      console.error('Error fetching popular posts:', error);
    }
  };

  const featuredPost = posts.find((post) => post.is_featured);
  const regularPosts = posts.filter((post) => !post.is_featured);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      getOrganizationSchema(),
      getWebSiteSchema(),
      {
        "@type": "Blog",
        "name": "Centre de Ressources Cybersécurité - MaSécurité.be",
        "description": "Actualités, guides et alertes pour votre sécurité numérique en Belgique",
        "url": "https://masecurite.be/blog",
        "publisher": {
          "@type": "Organization",
          "name": "MaSécurité.be"
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Blog Cybersécurité Belgique | Guides & Alertes"
        description="Actualités, guides pratiques et alertes de sécurité pour vous protéger en ligne. Conseils d'experts belges en cybersécurité."
        keywords="blog cybersécurité, guides sécurité belgique, alertes phishing, arnaques belgique"
        structuredData={structuredData}
      />

      <PageHeader
        title="Centre de Ressources Cybersécurité"
        subtitle="Actualités, guides et alertes pour votre sécurité numérique en Belgique"
        icon={Shield}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                <strong>Nouveau :</strong> Abonnez-vous à notre newsletter pour recevoir les alertes de sécurité en temps réel
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
                    activeCategory === category.value
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 shadow-sm'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 order-2 lg:order-1">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Chargement des articles...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
                  <p className="text-gray-600">Essayez une autre catégorie ou revenez plus tard.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {featuredPost && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-green-600">⭐</span> Article à la une
                      </h2>
                      <ArticleCard
                        slug={featuredPost.slug}
                        title={featuredPost.title}
                        excerpt={featuredPost.excerpt}
                        featuredImage={featuredPost.featured_image}
                        category={featuredPost.category}
                        readingTime={featuredPost.reading_time}
                        viewCount={featuredPost.view_count}
                        publishedAt={featuredPost.published_at}
                        updatedAt={featuredPost.updated_at}
                        authorName={featuredPost.blog_authors?.name || 'Équipe MaSécurité'}
                        isFeatured
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {regularPosts.map((post) => (
                      <ArticleCard
                        key={post.id}
                        slug={post.slug}
                        title={post.title}
                        excerpt={post.excerpt}
                        featuredImage={post.featured_image}
                        category={post.category}
                        readingTime={post.reading_time}
                        viewCount={post.view_count}
                        publishedAt={post.published_at}
                        updatedAt={post.updated_at}
                        authorName={post.blog_authors?.name || 'Équipe MaSécurité'}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="order-1 lg:order-2">
              <BlogSidebar popularArticles={popularPosts} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
