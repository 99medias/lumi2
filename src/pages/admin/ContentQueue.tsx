import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Eye, Trash2, Sparkles, X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabase';

interface SourceItem {
  id: string;
  title: string;
  original_url: string;
  original_content: string | null;
  summary: string | null;
  detected_at: string;
  status: 'new' | 'processing' | 'published' | 'ignored' | 'failed';
  relevance_score: number | null;
  relevance_reason: string | null;
  suggested_angle: string | null;
  suggested_category: string | null;
  content_sources: {
    name: string;
  };
}

type StatusFilter = 'new' | 'processing' | 'published' | 'ignored' | 'failed' | 'all';

export default function ContentQueue() {
  const [items, setItems] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusFilter>('new');
  const [selectedItem, setSelectedItem] = useState<SourceItem | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('source_items')
        .select(`
          *,
          content_sources!inner(name)
        `)
        .order('detected_at', { ascending: false })
        .limit(50);

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateArticle = async (itemId: string) => {
    setProcessing(itemId);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-article`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source_item_id: itemId })
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Generation failed');

      alert('Article généré avec succès');
      loadItems();
    } catch (error) {
      console.error('Error generating article:', error);
      alert('Erreur lors de la génération');
    } finally {
      setProcessing(null);
    }
  };

  const handleIgnore = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('source_items')
        .update({ status: 'ignored' })
        .eq('id', itemId);

      if (error) throw error;
      loadItems();
    } catch (error) {
      console.error('Error ignoring item:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const { error } = await supabase
        .from('source_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      new: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Nouveau' },
      processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En cours' },
      published: { bg: 'bg-green-100', text: 'text-green-700', label: 'Publié' },
      ignored: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Ignoré' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Échec' },
    };

    const badge = badges[status as keyof typeof badges] || badges.new;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-100 text-gray-700';

    const colors = {
      alerte: 'bg-red-100 text-red-700',
      guide: 'bg-blue-100 text-blue-700',
      actualite: 'bg-green-100 text-green-700',
      arnaque: 'bg-orange-100 text-orange-700',
    };

    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
    if (diffMinutes < 1440) return `il y a ${Math.floor(diffMinutes / 60)} h`;
    return `il y a ${Math.floor(diffMinutes / 1440)} j`;
  };

  const getRelevanceColor = (score: number | null) => {
    if (!score) return 'text-gray-600';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { value: 'new' as StatusFilter, label: 'Nouveau', count: items.filter(i => i.status === 'new').length },
    { value: 'processing' as StatusFilter, label: 'En cours', count: items.filter(i => i.status === 'processing').length },
    { value: 'published' as StatusFilter, label: 'Publié', count: items.filter(i => i.status === 'published').length },
    { value: 'ignored' as StatusFilter, label: 'Ignoré', count: items.filter(i => i.status === 'ignored').length },
    { value: 'all' as StatusFilter, label: 'Tous', count: items.length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="File d'Attente de Contenu"
        subtitle="Gérez les articles détectés et générez du contenu automatiquement"
        icon={FileText}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.value
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun élément trouvé</h3>
                  <p className="text-gray-600">Aucun contenu dans cette catégorie pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(item.status)}
                            {item.suggested_category && (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.suggested_category)}`}>
                                {item.suggested_category}
                              </span>
                            )}
                            {item.relevance_score !== null && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className={`w-4 h-4 ${getRelevanceColor(item.relevance_score)}`} />
                                <span className={`text-sm font-semibold ${getRelevanceColor(item.relevance_score)}`}>
                                  {Math.round(item.relevance_score * 100)}%
                                </span>
                              </div>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {item.title}
                          </h3>

                          {item.relevance_reason && (
                            <p className="text-sm text-gray-600 mb-2">
                              💡 {item.relevance_reason}
                            </p>
                          )}

                          {item.suggested_angle && (
                            <p className="text-sm text-blue-600 mb-2">
                              📝 Angle suggéré: {item.suggested_angle}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Source: {item.content_sources.name}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(item.detected_at)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {item.status === 'new' && (
                            <>
                              <button
                                onClick={() => handleGenerateArticle(item.id)}
                                disabled={processing === item.id}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                              >
                                {processing === item.id ? (
                                  <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Génération...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4" />
                                    Générer
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleIgnore(item.id)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                              >
                                Ignorer
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setSelectedItem(item)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Aperçu
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Aperçu de l'article source</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span>Source: {selectedItem.content_sources.name}</span>
                  <span>•</span>
                  <a
                    href={selectedItem.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Lien original
                  </a>
                </div>
              </div>

              {selectedItem.relevance_score !== null && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-900">
                      Pertinence: {Math.round(selectedItem.relevance_score * 100)}%
                    </span>
                  </div>
                  {selectedItem.relevance_reason && (
                    <p className="text-sm text-blue-800">{selectedItem.relevance_reason}</p>
                  )}
                  {selectedItem.suggested_angle && (
                    <p className="text-sm text-blue-800 mt-2">
                      <strong>Angle suggéré:</strong> {selectedItem.suggested_angle}
                    </p>
                  )}
                </div>
              )}

              {selectedItem.summary && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Résumé</h4>
                  <p className="text-gray-700">{selectedItem.summary}</p>
                </div>
              )}

              {selectedItem.original_content && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Contenu Original</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedItem.original_content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
