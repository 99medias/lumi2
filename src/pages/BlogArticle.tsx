import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Share2, Facebook, Linkedin, Twitter, Mail, Link as LinkIcon, ChevronRight, ExternalLink, User, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import BlogSidebar from '../components/blog/BlogSidebar';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  reading_time: number;
  view_count: number;
  published_at: string;
  updated_at: string;
  sources: any[];
  author: {
    id: string;
    name: string;
    slug: string;
    title: string;
    credentials: string;
    bio: string;
    years_experience: number;
    former_positions: string[];
  };
}

interface Comment {
  id: string;
  author_name: string;
  author_location: string;
  content: string;
  created_at: string;
}

const categoryLabels: Record<string, string> = {
  alerte: 'Alerte',
  guide: 'Guide',
  actualite: 'Actualité',
  arnaque: 'Arnaque Signalée',
};

const categoryColors: Record<string, string> = {
  alerte: 'bg-red-500',
  guide: 'bg-blue-500',
  actualite: 'bg-green-500',
  arnaque: 'bg-orange-500',
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
      incrementViewCount();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:blog_authors(*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (postError) throw postError;
      setPost(postData);

      const { data: commentsData } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postData.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      setComments(commentsData || []);

      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('id, slug, title, featured_image, reading_time, category')
        .eq('status', 'published')
        .eq('category', postData.category)
        .neq('id', postData.id)
        .limit(3);

      setRelatedPosts(relatedData || []);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_post_views', { post_slug: slug });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = post?.title || '';

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setShareMessage('Lien copié !');
        setTimeout(() => setShareMessage(''), 2000);
      } catch (error) {
        console.error('Error copying link:', error);
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article introuvable</h1>
          <Link to="/blog" className="text-green-600 hover:text-green-700 font-semibold">
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-BE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.title,
      "url": `https://masecurite.net/auteurs/${post.author.slug}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "MaSécurité.net",
      "logo": {
        "@type": "ImageObject",
        "url": "https://masecurite.net/green_modern_marketing_logo.png"
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://masecurite.net/blog/${post.slug}`
    }
  };

  return (
    <>
      <SEO
        title={post.meta_title}
        description={post.meta_description}
        keywords={post.tags.join(', ')}
        ogImage={post.featured_image}
        ogType="article"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
            <Link to="/" className="hover:text-green-600">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-green-600">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{categoryLabels[post.category]}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 truncate max-w-xs">{post.title}</span>
          </nav>

          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className={`${categoryColors[post.category]} h-2`}></div>

                <div className="p-8">
                  <div className="mb-6">
                    <span className={`${categoryColors[post.category]} text-white text-sm font-semibold px-4 py-1 rounded-full inline-block`}>
                      {categoryLabels[post.category]}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

                  <div className="flex items-center justify-between flex-wrap gap-4 pb-6 mb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Par <strong>{post.author.name}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.reading_time} min de lecture
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.view_count} lectures
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Partager:
                      </span>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Partager sur Facebook"
                      >
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Partager sur LinkedIn"
                      >
                        <Linkedin className="w-5 h-5 text-blue-700" />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Partager sur Twitter"
                      >
                        <Twitter className="w-5 h-5 text-blue-400" />
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Partager par email"
                      >
                        <Mail className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                        aria-label="Copier le lien"
                      >
                        <LinkIcon className="w-5 h-5 text-gray-600" />
                        {shareMessage && (
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {shareMessage}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-600 p-6 rounded-lg mb-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {post.author.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{post.author.name}</h3>
                        <p className="text-sm text-green-600 font-semibold">{post.author.title}</p>
                        <p className="text-sm text-gray-700 mt-1">{post.author.credentials}</p>
                        <p className="text-sm text-gray-600 mt-2">{post.author.bio}</p>
                        {post.author.former_positions && post.author.former_positions.length > 0 && (
                          <div className="mt-2">
                            {post.author.former_positions.map((position, index) => (
                              <span key={index} className="text-xs text-gray-500 italic block">
                                • {position}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {post.featured_image && (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-96 object-cover rounded-lg mb-8"
                      loading="eager"
                    />
                  )}

                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

                  {post.sources && post.sources.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        📚 Sources et Références
                      </h3>
                      <div className="space-y-3 bg-gray-50 p-6 rounded-lg">
                        {post.sources.map((source: any, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-gray-500 font-semibold">[{index + 1}]</span>
                            <div>
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
                              >
                                {source.title}
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div className="space-y-2 text-sm">
                        <p><strong>✓</strong> Article vérifié par notre équipe éditoriale</p>
                        <p><strong>✓</strong> Sources officielles belges citées</p>
                        <p><strong>✓</strong> Dernière mise à jour: {formatDate(post.updated_at)}</p>
                      </div>
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {comments.length > 0 && (
                <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Commentaires ({comments.length})</h3>
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold flex-shrink-0">
                            {comment.author_name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">{comment.author_name}</span>
                              {comment.author_location && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-600">{comment.author_location}</span>
                                </>
                              )}
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Continuez votre lecture</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.slug}`}
                        className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
                      >
                        {relatedPost.featured_image && (
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                            {relatedPost.title}
                          </h4>
                          <span className="text-sm text-gray-500">{relatedPost.reading_time} min de lecture</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
