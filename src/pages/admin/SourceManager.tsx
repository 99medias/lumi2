import { useState, useEffect } from 'react';
import { Rss, Plus, Trash2, RefreshCw, Eye, EyeOff, Loader } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabase';

interface ContentSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'scrape';
  priority: 'high' | 'medium' | 'low';
  default_category: 'alerte' | 'guide' | 'actualite' | 'arnaque';
  filter_keywords: string | null;
  is_active: boolean;
  last_checked_at: string | null;
  check_frequency_minutes: number;
}

export default function SourceManager() {
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSource, setNewSource] = useState<Partial<ContentSource>>({
    type: 'rss',
    priority: 'medium',
    default_category: 'actualite',
    is_active: true,
    check_frequency_minutes: 30
  });

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sources')
        .select('*')
        .order('priority', { ascending: true })
        .order('name');

      if (error) throw error;
      setSources(data || []);
    } catch (error) {
      console.error('Error loading sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content_sources')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadSources();
    } catch (error) {
      console.error('Error toggling source:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette source ?')) return;

    try {
      const { error } = await supabase
        .from('content_sources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSources();
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  const handleCheckNow = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-sources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source_id: id })
      });

      if (!response.ok) throw new Error('Failed to check source');

      alert('Vérification lancée');
      setTimeout(loadSources, 2000);
    } catch (error) {
      console.error('Error checking source:', error);
      alert('Erreur lors de la vérification');
    }
  };

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.url) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase
        .from('content_sources')
        .insert([newSource]);

      if (error) throw error;

      setShowAddForm(false);
      setNewSource({
        type: 'rss',
        priority: 'medium',
        default_category: 'actualite',
        is_active: true,
        check_frequency_minutes: 30
      });
      loadSources();
    } catch (error) {
      console.error('Error adding source:', error);
      alert('Erreur lors de l\'ajout');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alerte': return 'bg-red-100 text-red-700';
      case 'guide': return 'bg-blue-100 text-blue-700';
      case 'actualite': return 'bg-green-100 text-green-700';
      case 'arnaque': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatLastChecked = (timestamp: string | null) => {
    if (!timestamp) return 'Jamais';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffMinutes / 1440)} j`;
  };

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
        title="Gestion des Sources"
        subtitle="Configurez les sources de contenu pour la génération automatique"
        icon={Rss}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {sources.filter(s => s.is_active).length} sources actives sur {sources.length}
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter une source
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Nouvelle Source</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={newSource.name || ''}
                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
                  <input
                    type="url"
                    value={newSource.url || ''}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={newSource.type}
                    onChange={(e) => setNewSource({ ...newSource, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="rss">RSS Feed</option>
                    <option value="scrape">Web Scraping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priorité</label>
                  <select
                    value={newSource.priority}
                    onChange={(e) => setNewSource({ ...newSource, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie par défaut</label>
                  <select
                    value={newSource.default_category}
                    onChange={(e) => setNewSource({ ...newSource, default_category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="alerte">Alerte</option>
                    <option value="guide">Guide</option>
                    <option value="actualite">Actualité</option>
                    <option value="arnaque">Arnaque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mots-clés de filtrage (optionnel)</label>
                  <input
                    type="text"
                    value={newSource.filter_keywords || ''}
                    onChange={(e) => setNewSource({ ...newSource, filter_keywords: e.target.value })}
                    placeholder="cybersécurité,phishing,belgique"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddSource}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priorité</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dernière Vérif.</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sources.map((source) => (
                  <tr key={source.id} className={!source.is_active ? 'opacity-50 bg-gray-50' : ''}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{source.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{source.url}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {source.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(source.priority)}`}>
                        {source.priority === 'high' ? 'Haute' : source.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(source.default_category)}`}>
                        {source.default_category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatLastChecked(source.last_checked_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(source.id, source.is_active)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title={source.is_active ? 'Désactiver' : 'Activer'}
                        >
                          {source.is_active ? (
                            <Eye className="w-5 h-5 text-green-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCheckNow(source.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Vérifier maintenant"
                        >
                          <RefreshCw className="w-5 h-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
