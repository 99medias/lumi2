import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check, AlertCircle, Loader } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { supabase } from '../../lib/supabase';

interface AISettings {
  id: string;
  openai_api_key: string | null;
  openai_model: 'gpt-4o' | 'gpt-4o-mini';
  auto_post_enabled: boolean;
  auto_post_min_relevance: number;
  auto_post_max_per_day: number;
  auto_post_allowed_sources: string[];
  default_author_id: string | null;
  notification_email: string | null;
}

export default function Settings() {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [authors, setAuthors] = useState<any[]>([]);

  useEffect(() => {
    loadSettings();
    loadAuthors();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        const { data: newSettings, error: createError } = await supabase
          .from('ai_settings')
          .insert({
            openai_model: 'gpt-4o-mini',
            auto_post_enabled: false,
            auto_post_min_relevance: 0.85,
            auto_post_max_per_day: 2
          })
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuthors = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_authors')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setAuthors(data || []);
    } catch (error) {
      console.error('Error loading authors:', error);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('ai_settings')
        .update(settings)
        .eq('id', settings.id);

      if (error) throw error;
      alert('Paramètres sauvegardés avec succès');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!settings?.openai_api_key) {
      setTestResult({ success: false, message: 'Veuillez entrer une clé API' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-openai-connection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: settings.openai_api_key,
          model: settings.openai_model
        })
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: 'Erreur de connexion' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Impossible de charger les paramètres</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Paramètres AI"
        subtitle="Configuration du système de génération automatique de contenu"
        icon={SettingsIcon}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Configuration OpenAI</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Clé API OpenAI
                  </label>
                  <input
                    type="password"
                    value={settings.openai_api_key || ''}
                    onChange={(e) => setSettings({ ...settings, openai_api_key: e.target.value })}
                    placeholder="sk-..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Obtenez votre clé sur <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">platform.openai.com</a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modèle
                  </label>
                  <select
                    value={settings.openai_model}
                    onChange={(e) => setSettings({ ...settings, openai_model: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="gpt-4o-mini">GPT-4o Mini (Économique - ~0.09€/article)</option>
                    <option value="gpt-4o">GPT-4o (Performant - ~0.25€/article)</option>
                  </select>
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={testing || !settings.openai_api_key}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {testing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Test en cours...
                    </>
                  ) : (
                    'Tester la connexion'
                  )}
                </button>

                {testResult && (
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${
                    testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    {testResult.success ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResult.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Publication Automatique</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="auto-post"
                    checked={settings.auto_post_enabled}
                    onChange={(e) => setSettings({ ...settings, auto_post_enabled: e.target.checked })}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="auto-post" className="text-sm font-semibold text-gray-700">
                    Activer la publication automatique
                  </label>
                </div>

                {settings.auto_post_enabled && (
                  <div className="ml-8 space-y-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-4">
                      ⚠️ Les articles seront publiés automatiquement sans validation humaine
                    </p>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Score de pertinence minimum
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.auto_post_min_relevance}
                        onChange={(e) => setSettings({ ...settings, auto_post_min_relevance: parseFloat(e.target.value) })}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Seuls les articles avec un score ≥ {settings.auto_post_min_relevance} seront publiés
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Maximum par jour
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={settings.auto_post_max_per_day}
                        onChange={(e) => setSettings({ ...settings, auto_post_max_per_day: parseInt(e.target.value) })}
                        className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Auteur par défaut
                      </label>
                      <select
                        value={settings.default_author_id || ''}
                        onChange={(e) => setSettings({ ...settings, default_author_id: e.target.value || null })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner un auteur</option>
                        {authors.map((author) => (
                          <option key={author.id} value={author.id}>{author.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email de notification
                      </label>
                      <input
                        type="email"
                        value={settings.notification_email || ''}
                        onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                        placeholder="admin@masecurite.be"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  'Sauvegarder les paramètres'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
