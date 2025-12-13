import { Link } from 'react-router-dom';
import { Check, Ban, HardDrive, Star, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import TrustSeals from '../../components/TrustSeals';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';

const TotalCareProduct = () => {
  const { t } = useLanguage();

  const vpnData = t('totalCareProduct.includedProducts.vpn') as {name: string, features: string[]};
  const adblockData = t('totalCareProduct.includedProducts.adblock') as {name: string, features: string[]};
  const cleanerData = t('totalCareProduct.includedProducts.cleaner') as {name: string, features: string[]};

  const includedProducts = [
    {
      icon: Shield,
      name: vpnData.name,
      color: 'from-orange-400 to-orange-600',
      features: vpnData.features
    },
    {
      icon: Ban,
      name: adblockData.name,
      color: 'from-orange-400 to-orange-600',
      features: adblockData.features
    },
    {
      icon: HardDrive,
      name: cleanerData.name,
      color: 'from-orange-400 to-orange-600',
      features: cleanerData.features
    }
  ];

  const allFeatures = t('totalCareProduct.allFeatures.list') as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PageHeader />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl mb-6 shadow-xl shadow-amber-500/50">
              <Star className="w-10 h-10 text-white" />
            </div>

            <div className="inline-block mb-6">
              <span className="px-6 py-3 bg-green-500 text-white text-lg font-bold rounded-full shadow-lg">
                {t('totalCareProduct.hero.badge')}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
              {t('totalCareProduct.hero.title')}
            </h1>
            <p className="text-2xl text-slate-300 mb-4 max-w-3xl mx-auto">
              {t('totalCareProduct.hero.subtitle')}
            </p>
            <p className="text-xl text-amber-300 mb-8 max-w-2xl mx-auto font-semibold">
              {t('totalCareProduct.hero.description')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">{t('totalCareProduct.hero.priceCompare.separate')}</p>
                <p className="text-3xl text-slate-500 line-through font-bold">{t('totalCareProduct.hero.priceCompare.separatePrice')}</p>
              </div>
              <div className="text-5xl text-amber-400">→</div>
              <div className="text-center">
                <p className="text-amber-300 text-sm mb-2">{t('totalCareProduct.hero.priceCompare.pack')}</p>
                <p className="text-5xl text-white font-extrabold">{t('totalCareProduct.hero.priceCompare.packPrice')}<span className="text-2xl">{t('totalCareProduct.hero.priceCompare.perMonth')}</span></p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                {t('totalCareProduct.hero.ctaPrimary')}
              </a>
              <a href="#compare" className="px-8 py-4 bg-slate-700/50 border-2 border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all duration-300">
                {t('totalCareProduct.hero.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Included Products Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('totalCareProduct.includedProducts.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('totalCareProduct.includedProducts.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {includedProducts.map((product, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-amber-500/50 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${product.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <product.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">{product.name}</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-slate-500 text-sm">{t('totalCareProduct.includedProducts.individualValue')}</p>
                  <p className="text-2xl font-bold text-white">{t('totalCareProduct.includedProducts.individualPrice')}<span className="text-base">{t('totalCareProduct.hero.priceCompare.perMonth')}</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-2 border-amber-500/50 rounded-2xl p-8">
              <p className="text-slate-300 text-lg mb-4">
                <span className="text-amber-400 font-bold text-2xl">{t('totalCareProduct.includedProducts.savings.title')}</span>
              </p>
              <p className="text-slate-400 mb-2">
                {t('totalCareProduct.includedProducts.savings.calculation')} <span className="line-through">{t('totalCareProduct.includedProducts.savings.originalPrice')}</span>
              </p>
              <p className="text-4xl font-extrabold text-amber-400">
                {t('totalCareProduct.includedProducts.savings.payOnly')}
              </p>
              <p className="text-green-400 text-xl font-bold mt-2">
                {t('totalCareProduct.includedProducts.savings.monthlySaving')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('totalCareProduct.allFeatures.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('totalCareProduct.allFeatures.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {allFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-amber-500/50 transition-all duration-300">
                <Check className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <span className="text-slate-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="compare" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('totalCareProduct.comparison.title')}
            </h2>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400">{t('totalCareProduct.comparison.tableHeaders.feature')}</th>
                    <th className="px-6 py-4 text-center text-slate-400">{t('totalCareProduct.comparison.tableHeaders.separate')}</th>
                    <th className="px-6 py-4 text-center bg-gradient-to-r from-amber-500/20 to-amber-600/20">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        <span className="text-amber-400 font-bold">{t('totalCareProduct.comparison.tableHeaders.totalCare')}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr>
                    <td className="px-6 py-4 text-slate-300">{t('totalCareProduct.comparison.rows.monthlyPrice')}</td>
                    <td className="px-6 py-4 text-center text-slate-400">29.97€</td>
                    <td className="px-6 py-4 text-center bg-amber-500/5">
                      <span className="text-amber-400 font-bold text-xl">24.99€</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-300">{t('totalCareProduct.comparison.rows.vpnPremium')}</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-6 h-6 text-orange-400 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-amber-500/5">
                      <Check className="w-6 h-6 text-amber-400 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-300">{t('totalCareProduct.comparison.rows.adBlocking')}</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-6 h-6 text-orange-400 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-amber-500/5">
                      <Check className="w-6 h-6 text-amber-400 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-300">{t('totalCareProduct.comparison.rows.systemCleaning')}</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-6 h-6 text-orange-400 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center bg-amber-500/5">
                      <Check className="w-6 h-6 text-amber-400 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-300">{t('totalCareProduct.comparison.rows.prioritySupport')}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-slate-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center bg-amber-500/5">
                      <Check className="w-6 h-6 text-amber-400 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-300">{t('totalCareProduct.comparison.rows.monthlySavings')}</td>
                    <td className="px-6 py-4 text-center text-slate-600">0€</td>
                    <td className="px-6 py-4 text-center bg-amber-500/5">
                      <span className="text-green-400 font-bold">4.98€</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-300">{t('totalCareProduct.comparison.rows.yearlySavings')}</td>
                    <td className="px-6 py-4 text-center text-slate-600">0€</td>
                    <td className="px-6 py-4 text-center bg-amber-500/5">
                      <span className="text-green-400 font-bold text-xl">59.76€</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('totalCareProduct.pricing.title')}
            </h2>
            <p className="text-xl text-slate-400 mb-4">
              {t('totalCareProduct.pricing.subtitle')}
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-6 py-3 rounded-full">
              <span className="text-green-400 font-bold">{t('totalCareProduct.pricing.specialOffer')}</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block px-6 py-2 bg-amber-500 text-white rounded-full font-bold mb-4">
                {t('totalCareProduct.pricing.badge')}
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-4">{t('totalCareProduct.pricing.planTitle')}</h3>
              <p className="text-lg text-slate-600 mb-6">{t('totalCareProduct.pricing.planSubtitle')}</p>

              <div className="mb-6">
                <div className="text-5xl font-bold text-amber-600 mb-2">
                  {t('totalCareProduct.pricing.price')}
                  <span className="text-2xl text-slate-600"> {t('totalCareProduct.pricing.perMonth')}</span>
                </div>
                <p className="text-slate-500">{t('totalCareProduct.pricing.requirement')}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-xl font-bold text-slate-800 mb-4">{t('totalCareProduct.pricing.featuresTitle')}</h4>
              <ul className="space-y-3">
                {(t('totalCareProduct.pricing.featuresList') as string[]).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className="block w-full text-center py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('totalCareProduct.pricing.ctaButton')}
            </Link>

            <p className="text-center text-slate-500 text-sm mt-6">
              {t('totalCareProduct.pricing.trial')}
            </p>
          </div>

          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">{t('totalCareProduct.pricing.included.title')}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{vpnData.name}</p>
                  <p className="text-slate-400 text-sm">{t('totalCareProduct.pricing.included.vpnValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Ban className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{adblockData.name}</p>
                  <p className="text-slate-400 text-sm">{t('totalCareProduct.pricing.included.adblockValue')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <HardDrive className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">{cleanerData.name}</p>
                  <p className="text-slate-400 text-sm">{t('totalCareProduct.pricing.included.cleanerValue')}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700 text-center">
              <p className="text-slate-400">{t('totalCareProduct.pricing.included.totalValue')} <span className="line-through">{t('totalCareProduct.pricing.included.totalPrice')}</span></p>
              <p className="text-2xl font-bold text-amber-400 mt-2">{t('totalCareProduct.pricing.included.packagePrice')}</p>
              <p className="text-green-400 font-bold mt-1">{t('totalCareProduct.pricing.included.savings')}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-4">{t('totalCareProduct.pricing.helpText')}</p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('totalCareProduct.pricing.expertButton')}
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
      <section className="py-20 bg-gradient-to-r from-amber-600 to-yellow-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Star className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('totalCareProduct.finalCta.title')}
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            {t('totalCareProduct.finalCta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-5 bg-white text-amber-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {t('totalCareProduct.finalCta.button')}
          </Link>
          <p className="text-amber-100 mt-6">
            {t('totalCareProduct.finalCta.footer')}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TotalCareProduct;
