import { Link } from 'react-router-dom';
import { Check, Globe, Lock, Zap, Server, Eye, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import IPDetector from '../../components/IPDetector';
import TrustSeals from '../../components/TrustSeals';
import ModernPricingCard from '../../components/ModernPricingCard';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';

const VPNProduct = () => {
  const { t } = useLanguage();

  const featureIcons = [Lock, Server, Zap, Eye, Shield, Globe];
  const features = (t('vpnProduct.featuresSection.features') as Array<{title: string, description: string}>).map((f, i) => ({
    icon: featureIcons[i],
    title: f.title,
    description: f.description
  }));

  const countries = t('vpnProduct.serversSection.countries') as string[];

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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
              {t('vpnProduct.hero.title')}
            </h1>
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {t('vpnProduct.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#pricing" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                {t('vpnProduct.hero.ctaPrimary')}
              </a>
              <a href="#features" className="px-8 py-4 bg-slate-700/50 border-2 border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all duration-300">
                {t('vpnProduct.hero.ctaSecondary')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* IP Detection Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('vpnProduct.ipSection.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('vpnProduct.ipSection.subtitle')}
            </p>
          </div>
          <IPDetector />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('vpnProduct.featuresSection.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('vpnProduct.featuresSection.subtitle')}
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

      {/* Server Locations */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('vpnProduct.serversSection.title')}
            </h2>
            <p className="text-xl text-slate-400">
              {t('vpnProduct.serversSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {countries.map((country, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 text-center hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-300">
                <span className="text-2xl mb-2 block">{country.split(' ')[0]}</span>
                <span className="text-slate-300 text-sm font-medium">{country.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('vpnProduct.comparisonSection.title')}
            </h2>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Without VPN */}
              <div className="p-8 border-r border-slate-700">
                <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span className="text-red-400">✗</span>
                  </div>
                  {t('vpnProduct.comparisonSection.without.title')}
                </h3>
                <ul className="space-y-4">
                  {(t('vpnProduct.comparisonSection.without.items') as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-400">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* With VPN */}
              <div className="p-8 bg-gradient-to-br from-emerald-500/10 to-emerald-500/10">
                <h3 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  {t('vpnProduct.comparisonSection.with.title')}
                </h3>
                <ul className="space-y-4">
                  {(t('vpnProduct.comparisonSection.with.items') as string[]).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-200">
                      <Check className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              {t('vpnProduct.pricingSection.title')}
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ModernPricingCard
              title="Offre S"
              subtitle="Essentiel"
              storage="10 GB de stockage"
              tiers={[
                { duration: '24 mois + 12 offerts (3 ans)', totalPrice: 949, monthlyPrice: 39.54, isDefault: true },
                { duration: '36 mois + 24 offerts (5 ans)', totalPrice: 1199, monthlyPrice: 33.31 },
                { duration: '12 mois + 3 offerts', totalPrice: 699, monthlyPrice: 58.25 },
                { duration: '6 mois', totalPrice: 449, monthlyPrice: 74.83 }
              ]}
              features={[
                'Espace Cloud 10GB',
                'MaSecuSecurity Software',
                'MaSecuIntelligard',
                '3h d\'assistance/mois',
                'Retour sous 24h',
                'Mises à jour annuelles',
                'Abonnement transférable'
              ]}
            />

            <ModernPricingCard
              title="Offre M"
              subtitle="Populaire"
              storage="30 GB de stockage"
              popular={true}
              tiers={[
                { duration: '24 mois + 12 offerts (3 ans)', totalPrice: 1149, monthlyPrice: 47.88, isDefault: true },
                { duration: '36 mois + 24 offerts (5 ans)', totalPrice: 1349, monthlyPrice: 37.47 },
                { duration: '12 mois + 3 offerts', totalPrice: 799, monthlyPrice: 66.58 },
                { duration: '6 mois', totalPrice: 549, monthlyPrice: 91.50 }
              ]}
              features={[
                'Tout de l\'offre S',
                'Espace Cloud 30GB',
                '5h d\'assistance/mois',
                'Retour sous 3h',
                'Suivi personnalisé',
                'Mises à jour bimestrielles',
                'Nettoyage inclus',
                'Optimisation incluse'
              ]}
            />

            <ModernPricingCard
              title="Offre L"
              subtitle="Complet"
              storage="120 GB de stockage"
              tiers={[
                { duration: '24 mois + 12 offerts (3 ans)', totalPrice: 1249, monthlyPrice: 52.04, isDefault: true },
                { duration: '36 mois + 24 offerts (5 ans)', totalPrice: 1799, monthlyPrice: 49.97 },
                { duration: '12 mois + 3 offerts', totalPrice: 949, monthlyPrice: 79.08 },
                { duration: '6 mois', totalPrice: 649, monthlyPrice: 108.16 }
              ]}
              features={[
                'Tout de l\'offre M',
                'Espace Cloud 120GB',
                'Assistance illimitée',
                'Temps de retour illimité',
                'Mises à jour trimestrielles',
                'Actualisation de l\'OS',
                'Support prioritaire'
              ]}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">{t('vpnProduct.pricingSection.helpText')}</p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t('vpnProduct.pricingSection.ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('vpnProduct.faqSection.title')}
            </h2>
          </div>

          <div className="space-y-6">
            {(t('vpnProduct.faqSection.faqs') as Array<{q: string, a: string}>).map((faq, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-3">{faq.q}</h3>
                <p className="text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
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
            {t('vpnProduct.ctaSection.title')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {t('vpnProduct.ctaSection.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-block px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            {t('vpnProduct.ctaSection.button')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VPNProduct;
