import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchForm from '../components/breach-checker/SearchForm';
import AlertBanner from '../components/breach-checker/AlertBanner';
import StatsGrid from '../components/breach-checker/StatsGrid';
import CombinedResults from '../components/breach-checker/CombinedResults';
import RisksSection from '../components/breach-checker/RisksSection';
import DarkWebPrices from '../components/breach-checker/DarkWebPrices';
import { calculateSeverity, calculateDataValue } from '../utils/datamasking';

interface SearchResults {
  breaches: any[];
  count: number;
  leakCheck?: any;
}

export default function BreachCheckerPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searchedEmail, setSearchedEmail] = useState('');

  const handleEmailSearch = async (email: string) => {
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const [hibpResponse, leakCheckResponse] = await Promise.all([
        fetch(`${supabaseUrl}/functions/v1/breach-checker-hibp`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }),
        fetch(`${supabaseUrl}/functions/v1/leakcheck`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: email }),
        }),
      ]);

      const [hibpData, leakCheckData] = await Promise.all([
        hibpResponse.json(),
        leakCheckResponse.json(),
      ]);

      const combinedResults = {
        ...hibpData,
        leakCheck: leakCheckData,
      };

      setSearchedEmail(email);
      setResults(combinedResults);
      return combinedResults;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCheck = async (hash: string) => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/breach-checker-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passwordHash: hash }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const breachCount = results?.count || 0;
  const severity = calculateSeverity({
    breaches: breachCount,
    plaintextPasswords: false,
    personalInfo: false,
  });

  const estimatedValue = calculateDataValue(results?.breaches || []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white flex flex-col">
      <Header />
      <section className="pt-32 pb-12 px-4 flex-1">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-emerald-100 px-6 py-3 rounded-full mb-8">
            <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
            <span className="font-semibold text-emerald-700">{t('breachChecker.hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            {t('breachChecker.hero.title')}{' '}
            <span className="bg-gradient-to-r from-red-600 to-emerald-600 bg-clip-text text-transparent">{t('breachChecker.hero.titleHighlight')}</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t('breachChecker.hero.subtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-full px-6 py-3">
              <span className="text-xl">🔒</span>
              <span className="font-semibold text-slate-700">Have I Been Pwned</span>
            </div>
            <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-full px-6 py-3">
              <span className="text-xl">🛡️</span>
              <span className="font-semibold text-slate-700">{t('breachChecker.badges.confidential') || 'Analyse 100% confidentielle'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-full px-6 py-3">
              <span className="text-xl">⚡</span>
              <span className="font-semibold text-slate-700">{t('breachChecker.badges.instant') || 'Résultats instantanés'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-3xl mx-auto">
          <SearchForm
            onEmailSearch={handleEmailSearch}
            onPasswordCheck={handlePasswordCheck}
            loading={loading}
          />
        </div>
      </section>

      {results && (
        <section className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <CombinedResults
              hibpBreaches={results.breaches || []}
              leakCheckData={results.leakCheck || null}
              email={searchedEmail}
            />

            <div className="mt-12">
              <RisksSection />
            </div>

            <div className="mt-12">
              <DarkWebPrices estimatedValue={estimatedValue} />
            </div>

            <section className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-red-300">{t('breachChecker.cta.badge')}</span>
              </div>

              <h3 className="text-4xl font-bold mb-6">🛡️ {t('breachChecker.cta.title')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                {(t('breachChecker.cta.features') as string[]).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-left">
                    <span className="text-2xl flex-shrink-0">✓</span>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <a
                  href="/tarifs"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>{t('breachChecker.cta.button')}</span>
                  <span>→</span>
                </a>
                <a
                  href="tel:0189712866"
                  className="px-8 py-4 bg-white/10 border-2 border-white text-white rounded-xl font-bold hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>📞</span>
                  <span>{t('breachChecker.cta.call')} : {t('breachChecker.cta.phone')}</span>
                </a>
              </div>

              <div className="text-white/80 flex items-center justify-center gap-2">
                <span>⏰</span>
                <span>{t('breachChecker.cta.urgency')}</span>
              </div>
            </section>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
