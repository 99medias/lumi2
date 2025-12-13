import { Link } from 'react-router-dom';
import { Check, HardDrive, Trash2, Gauge, Settings, RefreshCw, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import TrustSeals from '../../components/TrustSeals';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';

const SystemCleanerProduct = () => {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(true);
  const [scanResults, setScanResults] = useState({
    tempFiles: 0,
    registryIssues: 0,
    diskSpace: 0,
    startupItems: 0
  });

  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        setScanResults({
          tempFiles: 2847,
          registryIssues: 156,
          diskSpace: 8.4,
          startupItems: 23
        });
        setScanning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [scanning]);

  const featureIcons = [Trash2, Settings, Gauge, HardDrive, RefreshCw, Shield];
  const features = (t('systemCleanerProduct.features.list') as Array<{title: string, description: string}>).map((feature, idx) => ({
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
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl mb-6 shadow-xl shadow-emerald-500/50">
              <HardDrive className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
              {t('systemCleanerProduct.hero.title')}
            </h1>
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {t('systemCleanerProduct.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                {t('systemCleanerProduct.hero.ctaPrimary')}
              </a>
              <button
                onClick={() => setScanning(true)}
                className="px-8 py-4 bg-slate-700/50 border-2 border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all duration-300"
              >
                {t('systemCleanerProduct.hero.ctaSecondary')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* System Scan Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {scanning ? t('systemCleanerProduct.scan.scanning.title') : t('systemCleanerProduct.scan.results.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {scanning ? t('systemCleanerProduct.scan.scanning.subtitle') : t('systemCleanerProduct.scan.results.subtitle')}
            </p>
          </div>

          {scanning ? (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-12">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 border-8 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-8"></div>
                <p className="text-slate-300 text-lg">{t('systemCleanerProduct.scan.scanning.analyzing')}</p>
                <p className="text-slate-500 text-sm mt-2">{t('systemCleanerProduct.scan.scanning.wait')}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-500/10 to-emerald-500/10 border-2 border-amber-500/30 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('systemCleanerProduct.scan.results.tempFiles')}</h3>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-slate-700 rounded-full h-3 mr-4">
                        <div className="bg-gradient-to-r from-amber-500 to-emerald-500 h-3 rounded-full" style={{width: '87%'}}></div>
                      </div>
                      <span className="text-3xl font-bold text-amber-400">{scanResults.tempFiles}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400">{t('systemCleanerProduct.scan.results.tempFilesDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-2 border-red-500/30 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('systemCleanerProduct.scan.results.registryIssues')}</h3>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-slate-700 rounded-full h-3 mr-4">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 h-3 rounded-full" style={{width: '62%'}}></div>
                      </div>
                      <span className="text-3xl font-bold text-red-400">{scanResults.registryIssues}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400">{t('systemCleanerProduct.scan.results.registryIssuesDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-yellow-500/10 border-2 border-emerald-500/30 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('systemCleanerProduct.scan.results.diskSpace')}</h3>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-slate-700 rounded-full h-3 mr-4">
                        <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-3 rounded-full" style={{width: '84%'}}></div>
                      </div>
                      <span className="text-3xl font-bold text-emerald-400">{scanResults.diskSpace} GB</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400">{t('systemCleanerProduct.scan.results.diskSpaceDesc')}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-2 border-purple-500/30 rounded-3xl p-8 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('systemCleanerProduct.scan.results.startupItems')}</h3>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-slate-700 rounded-full h-3 mr-4">
                        <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full" style={{width: '92%'}}></div>
                      </div>
                      <span className="text-3xl font-bold text-purple-400">{scanResults.startupItems}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400">{t('systemCleanerProduct.scan.results.startupItemsDesc')}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-200 font-semibold mb-2 text-lg">
                      {t('systemCleanerProduct.scan.results.solution')}
                    </p>
                    <p className="text-slate-300">
                      {t('systemCleanerProduct.scan.results.solutionDesc').replace('{space}', scanResults.diskSpace.toString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('systemCleanerProduct.features.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('systemCleanerProduct.features.subtitle')}
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

      {/* Performance Comparison */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('systemCleanerProduct.comparison.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('systemCleanerProduct.comparison.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 text-center">
              <Gauge className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">{t('systemCleanerProduct.comparison.bootTime')}</p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-red-400 text-2xl font-bold line-through">95s</p>
                  <p className="text-slate-500 text-xs">{t('systemCleanerProduct.comparison.before')}</p>
                </div>
                <span className="text-slate-600">→</span>
                <div>
                  <p className="text-green-400 text-2xl font-bold">38s</p>
                  <p className="text-slate-500 text-xs">{t('systemCleanerProduct.comparison.after')}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 text-center">
              <HardDrive className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">{t('systemCleanerProduct.comparison.diskSpace')}</p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-red-400 text-2xl font-bold">12 GB</p>
                  <p className="text-slate-500 text-xs">{t('systemCleanerProduct.comparison.before')}</p>
                </div>
                <span className="text-slate-600">→</span>
                <div>
                  <p className="text-green-400 text-2xl font-bold">28 GB</p>
                  <p className="text-slate-500 text-xs">{t('systemCleanerProduct.comparison.after')}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 text-center">
              <RefreshCw className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">{t('systemCleanerProduct.comparison.performance')}</p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-red-400 text-2xl font-bold">58%</p>
                  <p className="text-slate-500 text-xs">{t('systemCleanerProduct.comparison.before')}</p>
                </div>
                <span className="text-slate-600">→</span>
                <div>
                  <p className="text-green-400 text-2xl font-bold">94%</p>
                  <p className="text-slate-500 text-xs">{t('systemCleanerProduct.comparison.after')}</p>
                </div>
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
              {t('systemCleanerProduct.pricing.title')}
            </h2>
            <p className="text-xl text-slate-400 mb-4">
              {t('systemCleanerProduct.pricing.subtitle')}
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-6 py-3 rounded-full">
              <span className="text-green-400 font-bold">{t('systemCleanerProduct.pricing.specialOffer')}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">{t('systemCleanerProduct.pricing.planTitle')}</h3>
              <div className="mb-6">
                <div className="text-5xl font-bold text-emerald-600 mb-2">
                  {t('systemCleanerProduct.pricing.price')}
                  <span className="text-2xl text-slate-600"> {t('systemCleanerProduct.pricing.perMonth')}</span>
                </div>
                <p className="text-slate-500">{t('systemCleanerProduct.pricing.requirement')}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-slate-800 mb-4">{t('systemCleanerProduct.pricing.featuresTitle')}</h4>
              <ul className="space-y-3">
                {(t('systemCleanerProduct.pricing.featuresList') as string[]).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className="block w-full text-center py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('systemCleanerProduct.pricing.ctaButton')}
            </Link>

            <p className="text-center text-slate-500 text-sm mt-6">
              {t('systemCleanerProduct.pricing.trial')}
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-4">{t('systemCleanerProduct.pricing.helpText')}</p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('systemCleanerProduct.pricing.expertButton')}
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
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('systemCleanerProduct.finalCta.title')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {t('systemCleanerProduct.finalCta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {t('systemCleanerProduct.finalCta.button')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SystemCleanerProduct;
