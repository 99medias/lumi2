import { Link } from 'react-router-dom';
import { Check, Sparkles, MessageSquare, Bot, Zap, Shield, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import TrustSeals from '../../components/TrustSeals';
import SimplePricingCard from '../../components/SimplePricingCard';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';

const AIAssistantProduct = () => {
  const { t } = useLanguage();

  const featureIcons = [Bot, MessageSquare, Zap, Shield, Globe];
  const featuresList = t('aiAssistantProduct.features.list') as Array<{title: string, description: string}>;
  const features = featuresList.map((feature, idx) => ({
    ...feature,
    icon: featureIcons[idx]
  }));

  const useCases = t('aiAssistantProduct.useCases.list') as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PageHeader />

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-400 to-violet-600 rounded-3xl mb-6 shadow-xl shadow-violet-500/50">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
              {t('aiAssistantProduct.hero.title')}
            </h1>
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {t('aiAssistantProduct.hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300 text-sm font-medium">
                {t('aiAssistantProduct.hero.badges.powered')}
              </span>
              <span className="px-4 py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300 text-sm font-medium">
                {t('aiAssistantProduct.hero.badges.instant')}
              </span>
              <span className="px-4 py-2 bg-violet-500/20 border border-violet-500/50 rounded-full text-violet-300 text-sm font-medium">
                {t('aiAssistantProduct.hero.badges.available')}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-violet-500/50 transition-all duration-300">
                <feature.icon className="w-12 h-12 text-violet-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-3xl p-12 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('aiAssistantProduct.useCases.title')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-violet-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300 text-lg">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('aiAssistantProduct.pricing.title')}</h2>


            <div className="grid lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
              <SimplePricingCard
                name={t('aiAssistantProduct.pricing.name')}
                price={t('aiAssistantProduct.pricing.price')}
                period={t('aiAssistantProduct.pricing.period')}
                description={t('aiAssistantProduct.pricing.description')}
                features={t('aiAssistantProduct.pricing.features') as string[]}
                highlighted={true}
                ctaText={t('aiAssistantProduct.pricing.ctaText')}
                ctaLink="/contact"
                color="violet"
              />
            </div>
          </div>

          <TrustSeals />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-violet-900 via-violet-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Bot className="w-20 h-20 text-white mx-auto mb-8" />
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8">
            {t('aiAssistantProduct.finalCta.title')}
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('aiAssistantProduct.finalCta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-block px-12 py-5 bg-white text-violet-600 rounded-2xl text-xl font-bold hover:bg-violet-50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            {t('aiAssistantProduct.finalCta.button')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIAssistantProduct;
