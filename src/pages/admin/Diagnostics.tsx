import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { fetchRSSFeed } from '../../utils/rssFetcher';

interface DiagnosticResult {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function Diagnostics() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const addResult = (step: string, status: DiagnosticResult['status'], message: string, details?: any) => {
    setResults(prev => {
      const existing = prev.findIndex(r => r.step === step);
      const newResult = { step, status, message, details };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newResult;
        return updated;
      }
      return [...prev, newResult];
    });
  };

  async function runDiagnostics() {
    setIsRunning(true);
    setResults([]);

    // Step 1: Check Database Connection
    addResult('database', 'running', 'Vérification de la connexion à la base de données...');
    try {
      const { error } = await supabase.from('ai_settings').select('id').limit(1);
      if (error) throw error;
      addResult('database', 'success', 'Connexion à la base de données OK');
    } catch (err: any) {
      addResult('database', 'error', `Erreur de connexion: ${err.message}`);
      setIsRunning(false);
      return;
    }

    // Step 2: Check AI Settings
    addResult('settings', 'running', 'Vérification des paramètres AI...');
    let model = 'gpt-4o-mini';
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('openai_model, schedule_max_articles, schedule_min_relevance')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      model = data?.openai_model || 'gpt-4o-mini';
      addResult('settings', 'success', `Paramètres OK (Modèle: ${model})`, {
        max_articles: data?.schedule_max_articles,
        min_relevance: data?.schedule_min_relevance
      });
    } catch (err: any) {
      addResult('settings', 'error', `Erreur: ${err.message}`);
      setIsRunning(false);
      return;
    }

    // Step 3: Check Content Sources
    addResult('sources', 'running', 'Vérification des sources de contenu...');
    let rssSources: any[] = [];
    try {
      const { data, error } = await supabase
        .from('content_sources')
        .select('*')
        .eq('is_active', true)
        .eq('type', 'rss');

      if (error) throw error;
      if (!data || data.length === 0) {
        addResult('sources', 'error', 'Aucune source RSS active trouvée');
        setIsRunning(false);
        return;
      }

      rssSources = data;
      addResult('sources', 'success', `${data.length} source(s) RSS active(s) trouvée(s)`, { sources: data.map(s => s.name) });
    } catch (err: any) {
      addResult('sources', 'error', `Erreur: ${err.message}`);
      setIsRunning(false);
      return;
    }

    // Step 4: Test RSS Fetching
    addResult('rss', 'running', 'Test de récupération RSS...');
    try {
      const testSource = rssSources[0];
      console.log('Testing RSS from:', testSource.name, testSource.url);

      const items = await fetchRSSFeed(testSource.url);

      if (items.length === 0) {
        addResult('rss', 'error', `Aucun article récupéré de ${testSource.name}`, {
          url: testSource.url,
          hint: 'Vérifiez que votre ad blocker est désactivé'
        });
      } else {
        addResult('rss', 'success', `${items.length} articles récupérés de ${testSource.name}`, {
          first_item: items[0]?.title,
          total: items.length
        });
      }
    } catch (err: any) {
      addResult('rss', 'error', `Erreur RSS: ${err.message}`, {
        hint: 'Erreur réseau - vérifiez ad blocker ou connexion internet'
      });
    }

    // Step 5: Check Existing Items
    addResult('items', 'running', 'Vérification des éléments en file d\'attente...');
    try {
      const { data, error } = await supabase
        .from('source_items')
        .select('*')
        .eq('status', 'new')
        .order('relevance_score', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (!data || data.length === 0) {
        addResult('items', 'error', 'Aucun élément avec status "new" trouvé', {
          hint: 'Exécutez d\'abord le check RSS pour créer des items'
        });
      } else {
        addResult('items', 'success', `${data.length} élément(s) prêt(s) à générer`, {
          items: data.map(i => ({ title: i.title, score: i.relevance_score }))
        });
      }
    } catch (err: any) {
      addResult('items', 'error', `Erreur: ${err.message}`);
    }

    // Step 6: Test OpenAI Connection
    addResult('openai', 'running', 'Test de connexion OpenAI...');
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-openai-connection`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model
        })
      });

      const result = await response.json();

      if (result.success) {
        addResult('openai', 'success', result.message, {
          model: result.model
        });
      } else {
        addResult('openai', 'error', result.message);
      }
    } catch (err: any) {
      addResult('openai', 'error', `Erreur de connexion OpenAI: ${err.message}`, {
        hint: 'Vérifiez votre clé API et la connexion internet'
      });
    }

    // Step 7: Test Article Generation
    addResult('generation', 'running', 'Test de génération d\'article...');
    try {
      const { data: testItem } = await supabase
        .from('source_items')
        .select('*')
        .eq('status', 'new')
        .limit(1)
        .maybeSingle();

      if (!testItem) {
        addResult('generation', 'error', 'Pas d\'item de test disponible');
      } else {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: `Tu es journaliste pour MaSécurité.be. RETOURNE UNIQUEMENT CE JSON:
{"title":"Titre","meta_title":"Titre SEO","meta_description":"Description","excerpt":"Résumé","content":"<p>Article</p>","category":"alerte","tags":["sécurité"],"reading_time_minutes":4}`
              },
              {
                role: 'user',
                content: `Article sur: ${testItem.title}`
              }
            ],
            response_format: { type: 'json_object' },
            max_tokens: 500
          })
        });

        const data = await response.json();

        if (data.error) {
          addResult('generation', 'error', `Erreur génération: ${data.error.message}`);
        } else if (data.choices?.[0]?.message?.content) {
          try {
            const article = JSON.parse(data.choices[0].message.content);
            addResult('generation', 'success', 'Article généré avec succès', {
              title: article.title,
              content_length: article.content?.length
            });
          } catch {
            addResult('generation', 'error', 'Réponse OpenAI n\'est pas du JSON valide');
          }
        } else {
          addResult('generation', 'error', 'Pas de contenu dans la réponse OpenAI');
        }
      }
    } catch (err: any) {
      addResult('generation', 'error', `Erreur: ${err.message}`);
    }

    setIsRunning(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">🔍 Diagnostics du Système</h1>
          <p className="text-gray-500">Test complet du processus de génération</p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Retour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold text-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? '⏳ Diagnostic en cours...' : '▶️ Lancer les diagnostics'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                result.status === 'success' ? 'bg-green-50 border-green-200' :
                result.status === 'error' ? 'bg-red-50 border-red-200' :
                result.status === 'running' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {result.status === 'success' ? '✅' :
                   result.status === 'error' ? '❌' :
                   result.status === 'running' ? '⏳' : '⏸️'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">{result.step.toUpperCase()}</h3>
                  <p className={`text-sm ${
                    result.status === 'success' ? 'text-green-800' :
                    result.status === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {result.message}
                  </p>
                  {result.details && (
                    <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && !isRunning && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold mb-2">📝 Actions recommandées</h3>
          <ul className="text-sm space-y-1 text-yellow-800">
            {results.find(r => r.step === 'rss' && r.status === 'error') && (
              <li>• Désactivez votre ad blocker pour ce site</li>
            )}
            {results.find(r => r.step === 'settings' && r.status === 'error') && (
              <li>• Vérifiez les paramètres AI dans Paramètres</li>
            )}
            {results.find(r => r.step === 'items' && r.status === 'error') && (
              <li>• Exécutez d'abord le check RSS dans l'onglet Planification</li>
            )}
            {results.find(r => r.step === 'openai' && r.status === 'error') && (
              <li>• Vérifiez votre clé API OpenAI et votre crédit</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
