import { Link } from 'react-router-dom';
import { Check, Smartphone, Shield, Eye, Lock, Wifi, MapPin, Bell } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import TrustSeals from '../../components/TrustSeals';
import SimplePricingCard from '../../components/SimplePricingCard';
import PageHeader from '../../components/PageHeader';
import Footer from '../../components/Footer';

const MobileSecurityProduct = () => {
  const { t } = useLanguage();

  const icons = [Shield, Eye, Bell, Lock, Wifi, MapPin];
  const productData = t('products.mobileSecurity') as any;
  const commonData = t('products.common') as any;

  const features = productData.features.map((feature: any, index: number) => ({
    icon: icons[index],
    ...feature
  }));

  const compatibleBrowsers = [
    'Chrome', 'Firefox', 'Brave', 'Opera', 'Edge',
    'Samsung Internet', 'DuckDuckGo', 'Yandex', 'Huawei Browser'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PageHeader />

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl mb-6 shadow-xl shadow-emerald-500/50">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
              {productData.title}
            </h1>
            <p className="text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {productData.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-sm font-medium">
                {productData.badges.powered}
              </span>
              <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-sm font-medium">
                {productData.badges.platform}
              </span>
              <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-sm font-medium">
                {productData.badges.price}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature: any, index: number) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300">
                <feature.icon className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-3xl p-12 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{productData.completeTitle}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {productData.categories.map((section: any, index: number) => (
                <div key={index}>
                  <h3 className="text-xl font-bold text-emerald-400 mb-4">{section.name}</h3>
                  <ul className="space-y-3">
                    {section.items.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/10 backdrop-blur-lg border border-emerald-500/30 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">{productData.browsersTitle}</h3>
            <p className="text-slate-300 text-center mb-6">
              {productData.browsersSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {compatibleBrowsers.map((browser, index) => (
                <span key={index} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
                  {browser}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{productData.pricingTitle}</h2>


            <div className="grid lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
              <SimplePricingCard
                name={productData.packageName}
                price={productData.price}
                period={productData.period}
                description={productData.description}
                features={productData.packageFeatures}
                highlighted={true}
                ctaText={commonData.ctaText}
                ctaLink="/contact"
                color="emerald"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 to-emerald-500/10 backdrop-blur-lg border border-amber-500/30 rounded-3xl p-8 mb-16">
            <div className="flex items-start gap-4">
              <Shield className="w-12 h-12 text-amber-400 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">{productData.wearonTitle}</h3>
                <p className="text-slate-300 mb-4">
                  {productData.wearonDescription}
                </p>
                <ul className="space-y-2">
                  {productData.wearonFeatures.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <TrustSeals />
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Smartphone className="w-20 h-20 text-white mx-auto mb-8" />
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8">
            {productData.finalCtaTitle}
          </h2>
          <p className="text-2xl md:text-3xl text-white mb-12 max-w-3xl mx-auto leading-relaxed">
            {productData.finalCtaSubtitle}
          </p>
          <Link
            to="/contact"
            className="inline-block px-12 py-5 bg-white text-emerald-600 rounded-2xl text-xl font-bold hover:bg-emerald-50 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          >
            {commonData.startNow}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MobileSecurityProduct;
