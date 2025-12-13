import { useState } from 'react';
import PasswordChecker from './PasswordChecker';
import { LeakCheckResult } from '../../types/leakcheck';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchFormProps {
  onEmailSearch: (email: string) => Promise<any>;
  onPasswordCheck: (hash: string) => Promise<any>;
  loading: boolean;
  userCredits?: number;
}

export default function SearchForm({
  onEmailSearch,
  onPasswordCheck,
  loading,
  userCredits = 0,
}: SearchFormProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailResult, setEmailResult] = useState<any>(null);
  const [leakCheckResult, setLeakCheckResult] = useState<LeakCheckResult | null>(null);

  const handleEmailSearch = async () => {
    if (!email) {
      setError('Veuillez entrer une adresse e-mail');
      return;
    }

    try {
      setError('');
      const result = await onEmailSearch(email);
      setEmailResult(result);

      const leakCheckUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/leakcheck`;
      const leakCheckResponse = await fetch(leakCheckUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: email, type: 'email' }),
      });
      const leakCheckData = await leakCheckResponse.json();
      setLeakCheckResult(leakCheckData);
    } catch (err) {
      setError('Erreur lors de la recherche');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
      <div className="flex border-b-2 border-slate-200">
        <button
          onClick={() => {
            setActiveTab('email');
            setError('');
            setEmailResult(null);
            setLeakCheckResult(null);
          }}
          className={`flex-1 py-6 px-4 font-bold text-center transition-all ${
            activeTab === 'email'
              ? 'bg-emerald-50 text-emerald-700 border-b-4 border-emerald-600'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="text-2xl mb-1">��</div>
          <div>{t('breachChecker.tabs.email')}</div>
          <div className="text-xs font-normal text-green-600">{t('breachChecker.tabs.free')}</div>
        </button>
        <button
          onClick={() => {
            setActiveTab('password');
            setError('');
          }}
          className={`flex-1 py-6 px-4 font-bold text-center transition-all ${
            activeTab === 'password'
              ? 'bg-emerald-50 text-emerald-700 border-b-4 border-emerald-600'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <div className="text-2xl mb-1">🔑</div>
          <div>{t('breachChecker.tabs.password')}</div>
          <div className="text-xs font-normal text-green-600">{t('breachChecker.tabs.free')}</div>
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'email' && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('breachChecker.search.emailTitle') || 'Vérifiez si votre e-mail a été piraté'}</h3>

            <div className="mb-6">
              <div className="relative">
                <span className="absolute left-4 top-4 text-2xl">📧</span>
                <input
                  type="email"
                  placeholder={t('breachChecker.search.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleEmailSearch}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all text-lg"
            >
              {loading ? '⏳ ' + (t('breachChecker.search.searching') || 'Recherche en cours...') : t('breachChecker.search.emailButton')}
            </button>

            {!emailResult && !leakCheckResult && (
              <div className="mt-4 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg">
                <div className="text-sm text-slate-600 flex items-center gap-2">
                  <span>🔒</span>
                  <span>{t('breachChecker.privacy.email') || "Votre adresse n'est jamais stockée ni partagée"}</span>
                </div>
              </div>
            )}

            {error && <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">{error}</div>}

            {(emailResult || leakCheckResult) && (
              <div className="mt-8 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {emailResult && (
                    <div className={`bg-gradient-to-br ${
                      emailResult.count > 0
                        ? 'from-red-50 to-red-100 border-red-300'
                        : 'from-green-50 to-green-100 border-green-300'
                    } border-2 rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-3xl">🛡️</span>
                        <h4 className="font-bold text-slate-900 text-lg">Have I Been Pwned</h4>
                      </div>
                      <div className="space-y-3">
                        {emailResult.count > 0 ? (
                          <>
                            <div className="text-3xl font-bold text-red-600">{emailResult.count}</div>
                            <p className="text-slate-700 text-sm">Fuites de données détectées</p>
                          </>
                        ) : (
                          <>
                            <div className="text-3xl font-bold text-green-600">✅</div>
                            <p className="text-slate-700 text-sm font-semibold">Aucune fuite détectée</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {leakCheckResult && (
                    <>
                      <div className={`bg-gradient-to-br ${
                        !leakCheckResult.success ? 'from-slate-50 to-slate-100 border-slate-300'
                          : leakCheckResult.found > 0 ? 'from-red-50 to-red-100 border-red-300'
                          : 'from-green-50 to-green-100 border-green-300'
                      } border-2 rounded-2xl p-6 hover:shadow-lg transition-shadow`}>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-3xl">🔍</span>
                          <h4 className="font-bold text-slate-900 text-lg">LeakCheck</h4>
                        </div>
                        <div className="space-y-3">
                          {!leakCheckResult.success ? (
                            <>
                              <div className="text-3xl font-bold text-gray-500">?</div>
                              <p className="text-slate-700 text-sm font-semibold">Non disponible</p>
                            </>
                          ) : leakCheckResult.found > 0 ? (
                            <>
                              <div className="text-3xl font-bold text-red-600">{leakCheckResult.found}</div>
                              <p className="text-slate-700 text-sm">Enregistrements trouvés</p>
                            </>
                          ) : (
                            <>
                              <div className="text-3xl font-bold text-green-600">✅</div>
                              <p className="text-slate-700 text-sm font-semibold">Non détecté</p>
                            </>
                          )}
                        </div>
                      </div>

                      {leakCheckResult.passwordCount > 0 && (
                        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🔑</span>
                            <h4 className="font-bold text-slate-900 text-lg">Mots de passe</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="text-3xl font-bold text-red-600">{leakCheckResult.passwordCount}</div>
                            <p className="text-slate-700 text-sm">Exposés en clair</p>
                            <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mt-2">
                              CRITIQUE
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

        {activeTab === 'password' && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('breachChecker.search.passwordTitle') || 'Vérifiez un mot de passe'}</h3>
            <PasswordChecker onCheck={onPasswordCheck} loading={loading} />
          </div>
        )}
      </div>
    </div>
  );
}
