import { Link } from 'react-router-dom';
import { Check, Zap, Eye, Ban, TrendingUp, Lock, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import TrustSeals from '../../components/TrustSeals';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';

const AdBlockProduct = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ ads: 0, trackers: 0, time: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ads: Math.min(prev.ads + Math.floor(Math.random() * 3), 2847),
        trackers: Math.min(prev.trackers + Math.floor(Math.random() * 2), 1523),
        time: Math.min(prev.time + Math.floor(Math.random() * 5), 3600)
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const featureIcons = [Ban, Zap, Eye, Shield, Lock, TrendingUp];
  const features = (t('adBlockProduct.features.list') as Array<{title: string, description: string}>).map((feature, idx) => ({
    ...feature,
    icon: featureIcons[idx]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PageHeader />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl mb-6 shadow-xl shadow-emerald-500/50">
              <Ban className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
              {t('adBlockProduct.hero.title')}
            </h1>
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {t('adBlockProduct.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                {t('adBlockProduct.hero.ctaPrimary')}
              </a>
              <a href="#features" className="px-8 py-4 bg-slate-700/50 border-2 border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all duration-300">
                {t('adBlockProduct.hero.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('adBlockProduct.liveStats.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('adBlockProduct.liveStats.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/10 to-red-500/10 border-2 border-emerald-500/30 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Ban className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">{t('adBlockProduct.liveStats.adsBlocked')}</p>
                  <p className="text-4xl font-extrabold text-white">{stats.ads.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">{t('adBlockProduct.liveStats.adsHelper')}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-red-500/10 border-2 border-emerald-500/30 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">{t('adBlockProduct.liveStats.trackersStopped')}</p>
                  <p className="text-4xl font-extrabold text-white">{stats.trackers.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">{t('adBlockProduct.liveStats.trackersHelper')}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-red-500/10 border-2 border-emerald-500/30 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">{t('adBlockProduct.liveStats.timeSaved')}</p>
                  <p className="text-4xl font-extrabold text-white">{Math.floor(stats.time / 60)}min</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">{t('adBlockProduct.liveStats.timeHelper')}</p>
            </div>
          </div>

          <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-lg font-bold">!</span>
              </div>
              <div>
                <p className="text-amber-200 font-semibold mb-2 text-lg">{t('adBlockProduct.liveStats.warningTitle')}</p>
                <ul className="text-slate-300 space-y-2">
                  {(t('adBlockProduct.liveStats.warningItems') as string[]).map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('adBlockProduct.features.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('adBlockProduct.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 group">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('adBlockProduct.comparison.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('adBlockProduct.comparison.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Without AdBlock */}
            <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-red-500/30 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 text-2xl">✗</span>
                </div>
                <h3 className="text-2xl font-bold text-red-400">{t('adBlockProduct.comparison.without.title')}</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">{t('adBlockProduct.comparison.without.loadTime')}</span>
                    <span className="text-red-400 font-bold">4.8s</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">{t('adBlockProduct.comparison.without.dataDownloaded')}</span>
                    <span className="text-red-400 font-bold">8.4 MB</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '84%'}}></div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">{t('adBlockProduct.comparison.without.trackersActive')}</span>
                    <span className="text-red-400 font-bold">24</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>

                <ul className="space-y-2 pt-4">
                  {(t('adBlockProduct.comparison.without.issues') as string[]).map((issue, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-400">
                      <span className="text-red-400">✗</span>
                      <span className="text-sm">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* With AdBlock */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-red-500/10 backdrop-blur-sm border-2 border-emerald-500/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-400">{t('adBlockProduct.comparison.with.title')}</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">{t('adBlockProduct.comparison.without.loadTime')}</span>
                    <span className="text-green-400 font-bold">1.9s</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '38%'}}></div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">{t('adBlockProduct.comparison.without.dataDownloaded')}</span>
                    <span className="text-green-400 font-bold">3.2 MB</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '32%'}}></div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-400">{t('adBlockProduct.comparison.without.trackersActive')}</span>
                    <span className="text-green-400 font-bold">0</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>

                <ul className="space-y-2 pt-4">
                  {(t('adBlockProduct.comparison.with.benefits') as string[]).map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-200">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('adBlockProduct.pricing.title')}
            </h2>
            <p className="text-xl text-slate-400 mb-4">
              {t('adBlockProduct.pricing.subtitle')}
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-6 py-3 rounded-full">
              <span className="text-green-400 font-bold">{t('adBlockProduct.pricing.specialOffer')}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">{t('adBlockProduct.pricing.planTitle')}</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  {t('adBlockProduct.pricing.price')}
                  <span className="text-2xl text-slate-600"> {t('adBlockProduct.pricing.perMonth')}</span>
                </div>
                <p className="text-slate-500">{t('adBlockProduct.pricing.requirement')}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-slate-800 mb-4">{t('adBlockProduct.pricing.featuresTitle')}</h4>
              <ul className="space-y-3">
                {(t('adBlockProduct.pricing.featuresList') as string[]).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className="block w-full text-center py-4 bg-gradient-to-r from-emerald-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('adBlockProduct.pricing.ctaButton')}
            </Link>

            <p className="text-center text-slate-500 text-sm mt-6">
              {t('adBlockProduct.pricing.trial')}
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-4">{t('adBlockProduct.pricing.helpText')}</p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-red-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('adBlockProduct.pricing.expertButton')}
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-slate-900 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <TrustSeals variant="compact" showTitle={false} />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-red-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('adBlockProduct.finalCta.title')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {t('adBlockProduct.finalCta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {t('adBlockProduct.finalCta.button')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdBlockProduct;
