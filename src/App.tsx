import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, Crown } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import SectionHeader from './components/SectionHeader';
import TestimonialsSection from './components/TestimonialsSection';
import TrustSeals from './components/TrustSeals';
import PaymentBadges from './components/PaymentBadges';
import Footer from './components/Footer';
import './index.css';

function App() {
  const { t } = useLanguage();
  const [customerType, setCustomerType] = useState<'particulier' | 'professionnel'>('particulier');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = t('faq.questions') as Array<{ question: string; answer: string }>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .animate-on-scroll {
          opacity: 0;
        }
        .animated {
          opacity: 1;
        }
      `}</style>

      <Header />

      <section id="accueil" className="hero-new bg-gradient-to-b from-emerald-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">

          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">
              🇧🇪 {t('nav.belgianCompany')}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">
              ⭐ 4.9/5
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm">
              🛡️ +10 000 clients
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}<br />
            <span className="text-emerald-500">{t('hero.subtitle')}</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#services"
              className="px-8 py-4 bg-emerald-500 text-white rounded-full font-semibold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
            >
              {t('hero.ctaSecondary')}
            </a>
            <a
              href="tel:+3216186098"
              className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              <span>📞</span> 016 18 60 98
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('hero.secure')}</h3>
              <p className="text-gray-600 text-sm">Antivirus, pare-feu et surveillance 24/7</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Intervention à domicile</h3>
              <p className="text-gray-600 text-sm">Un technicien se déplace chez vous</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{t('nav.frenchSupport')}</h3>
              <p className="text-gray-600 text-sm">Équipe belge disponible 7j/7</p>
            </div>
          </div>

        </div>
      </section>

      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              {t('services.title')}
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment pouvons-nous vous aider?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="group p-8 bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💻</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Protection PC & Mac</h3>
              <p className="text-gray-600 mb-6">
                Antivirus professionnel, pare-feu intelligent et mises à jour automatiques pour une protection complète.
              </p>
              <div className="flex items-center justify-end">
                <a href="/#pricing" className="text-emerald-600 font-medium group-hover:underline">
                  En savoir plus →
                </a>
              </div>
            </div>

            <div className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Pack Famille</h3>
              <p className="text-gray-600 mb-6">
                Protégez jusqu'à 5 appareils. Contrôle parental inclus pour une navigation sécurisée pour vos enfants.
              </p>
              <div className="flex items-center justify-end">
                <a href="/#pricing" className="text-blue-600 font-medium group-hover:underline">
                  En savoir plus →
                </a>
              </div>
            </div>

            <div className="group p-8 bg-gradient-to-br from-cyan-50 to-white rounded-3xl border border-cyan-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Dépannage à domicile</h3>
              <p className="text-gray-600 mb-6">
                Un technicien se déplace chez vous pour résoudre vos problèmes informatiques rapidement.
              </p>
              <div className="flex items-center justify-end">
                <a href="/contact" className="text-cyan-600 font-medium group-hover:underline">
                  En savoir plus →
                </a>
              </div>
            </div>

            <div className="group p-8 bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🆘</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Assistance d'urgence</h3>
              <p className="text-gray-600 mb-6">
                Victime d'un virus ou d'une arnaque? Notre équipe intervient rapidement pour vous aider.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-semibold">Disponible 24h/24</span>
                <a href="https://masecu2025.getscreen.me/" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-medium group-hover:underline">
                  Appeler maintenant →
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Pourquoi nous?
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce qui nous rend différents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% Belge</h3>
              <p className="text-gray-600">Équipe locale basée en Belgique</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sans jargon</h3>
              <p className="text-gray-600">On vous explique tout simplement</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Prix honnêtes</h3>
              <p className="text-gray-600">Pas de frais cachés, jamais</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Toujours là</h3>
              <p className="text-gray-600">Support disponible 7j/7</p>
            </div>

          </div>

        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Notre équipe de support"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                Notre engagement
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Une équipe belge à votre écoute
              </h2>
              <p className="text-gray-600 mb-6">
                Pas de call center à l'étranger, pas de robot. Quand vous nous appelez,
                vous parlez à de vraies personnes qui comprennent vos problèmes et parlent votre langue.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-500 text-xl">✓</span>
                  <span>Support en français</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-500 text-xl">✓</span>
                  <span>Réponse rapide garantie</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-500 text-xl">✓</span>
                  <span>Disponible 7j/7</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 bg-[#fef7f0] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300 to-emerald-300 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300 to-emerald-300 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title={t('pricing.title')}
            subtitle={t('pricing.subtitle')}
          />

          <div className="flex justify-center mb-12">
            <div className="bg-white p-1.5 rounded-2xl shadow-xl inline-flex border-2 border-emerald-200">
              <button
                onClick={() => setCustomerType('particulier')}
                className={`px-10 py-4 rounded-xl font-bold transition-all duration-300 ${customerType === 'particulier' ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-lg' : 'text-[#1e293b] hover:text-cyan-600'}`}
              >
                {t('pricing.customerType.individual')}
              </button>
              <button
                onClick={() => setCustomerType('professionnel')}
                className={`px-10 py-4 rounded-xl font-bold transition-all duration-300 ${customerType === 'professionnel' ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-lg' : 'text-[#1e293b] hover:text-cyan-600'}`}
              >
                {t('pricing.customerType.professional')}
              </button>
            </div>
          </div>

          {/* Payment Trust Badges */}
          <div className="mb-12 max-w-4xl mx-auto">
            <PaymentBadges variant="full" title={t('paymentBadges.title')} />
          </div>

          {/* Feature Comparison Table */}
          <div className="mb-12 overflow-x-auto">
            <div className="max-w-[1000px] mx-auto bg-gradient-to-b from-white to-emerald-50/20 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-emerald-200/50 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 bg-gradient-to-b from-slate-50 to-slate-100/50 sticky top-0 z-10">
                <div className="p-5 font-bold text-lg text-[#1e293b] border-r border-[#e2e8f0] rounded-tl-3xl">
                  {t('pricing.features')}
                </div>
                <div className="p-4 text-center border-r border-[#e2e8f0] hover:bg-emerald-50 transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Shield className="w-7 h-7 text-emerald-400" strokeWidth={2} />
                    <h3 className="text-xl font-bold text-[#1e293b]">{(t('pricing.offers.s') as any).name}</h3>
                    <span className="text-xs text-gray-500 font-medium">{t('pricing.essential')}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300 text-emerald-600 bg-emerald-50 mt-0.5">
                      {t('pricing.bestPrice')}
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-r border-cyan-600 popular-glow relative hover:scale-[1.01] transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Star className="w-7 h-7 text-white fill-white" />
                    <h3 className="text-xl font-bold">{(t('pricing.offers.m') as any).name}</h3>
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      {t('pricing.mostPopular')}
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center rounded-tr-3xl bg-purple-50/20 hover:bg-purple-50/40 transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Crown className="w-7 h-7 text-purple-600 fill-purple-600" />
                    <h3 className="text-xl font-bold text-[#1e293b]">{(t('pricing.offers.l') as any).name}</h3>
                    <span className="text-xs text-purple-600 font-medium">{t('pricing.complete')}</span>
                  </div>
                </div>
              </div>

              {/* Feature Rows */}
              {(t('pricing.featureTable') as any[]).map((feature, idx) => (
                <div key={idx} className={`grid grid-cols-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'} border-t border-emerald-100/50 hover:bg-emerald-100/40 transition-all duration-200 group`}>
                  <div className="p-4 border-r border-emerald-100/50 row-hover-slide">
                    <div className="font-bold text-[#1e293b] text-[0.9rem] mb-2">{feature.name}</div>
                    {feature.bullets ? (
                      <ul className="flex flex-col gap-1 list-none p-0 m-0">
                        {feature.bullets.map((bullet: string, bulletIdx: number) => (
                          <li key={bulletIdx} className="flex items-center gap-1.5 text-[0.8rem] text-[#64748b] leading-snug">
                            <span className="text-cyan-500 text-base leading-none">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[0.8rem] text-[#64748b] leading-relaxed">{feature.description}</div>
                    )}
                    {feature.badge && (
                      <div className="mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          feature.badgeColor === 'red' ? 'bg-red-50 text-red-600' :
                          feature.badgeColor === 'green' ? 'bg-green-50 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {feature.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center text-[#1e293b] border-r border-emerald-100/50 flex items-center justify-center transition-all duration-200">
                    <span className={feature.values[0] === '✓' ? 'text-emerald-500 text-2xl font-bold checkmark-animate checkmark-hover cursor-pointer' : feature.values[0] === '—' ? 'text-[#94a3b8] text-xl' : 'whitespace-pre-line'} style={feature.values[0] === '✓' ? {animationDelay: `${idx * 0.05}s`} : {}}>{feature.values[0]}</span>
                  </div>
                  <div className="p-4 text-center bg-emerald-50/30 text-[#1e293b] font-semibold border-r border-emerald-200/50 flex items-center justify-center popular-glow transition-all duration-200">
                    <span className={feature.values[1] === '✓' ? 'text-emerald-600 text-2xl font-bold checkmark-animate checkmark-hover cursor-pointer' : feature.values[1] === '—' ? 'text-[#94a3b8] text-xl' : 'whitespace-pre-line'} style={feature.values[1] === '✓' ? {animationDelay: `${idx * 0.05}s`} : {}}>{feature.values[1]}</span>
                  </div>
                  <div className="p-4 text-center bg-purple-50/30 text-[#1e293b] flex items-center justify-center transition-all duration-200">
                    <span className={feature.values[2] === '✓' ? 'text-purple-600 text-2xl font-bold checkmark-animate checkmark-hover cursor-pointer' : feature.values[2] === '—' ? 'text-[#94a3b8] text-xl' : 'whitespace-pre-line'} style={feature.values[2] === '✓' ? {animationDelay: `${idx * 0.05}s`} : {}}>{feature.values[2]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Table */}
          <div className="mb-12 overflow-x-auto">
            <div className="max-w-[1000px] mx-auto bg-gradient-to-b from-white to-emerald-50/20 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-emerald-200/50 overflow-hidden">
              {/* Light Title Header */}
              <div className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 text-[#1e293b] p-5 text-center border-b border-emerald-200/50">
                <h3 className="text-xl font-bold">{t('pricing.bestMonthlyValue')}</h3>
              </div>

              {/* Column Headers */}
              <div className="grid grid-cols-4 bg-gradient-to-b from-slate-50 to-slate-100/50 border-b border-emerald-200/50 sticky top-0 z-10">
                <div className="p-5 font-bold text-lg text-[#1e293b] border-r border-emerald-100/50">
                  {t('pricing.durationHeader')}
                </div>
                <div className="p-4 text-center border-r border-emerald-100/50 hover:bg-emerald-50 transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Shield className="w-7 h-7 text-emerald-400" strokeWidth={2} />
                    <h3 className="text-xl font-bold text-[#1e293b]">{(t('pricing.offers.s') as any).name}</h3>
                    <span className="text-xs text-gray-500 font-medium">{t('pricing.essential')}</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300 text-emerald-600 bg-emerald-50 mt-0.5">
                      {t('pricing.bestPrice')}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{t('pricing.from')} €19,98{t('pricing.perMonthShort')}</span>
                  </div>
                </div>
                <div className="p-4 text-center bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-r border-cyan-600 relative popular-glow hover:scale-[1.01] transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Star className="w-7 h-7 text-white fill-white" />
                    <h3 className="text-xl font-bold">{(t('pricing.offers.m') as any).name}</h3>
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      {t('pricing.mostPopular')}
                    </span>
                    <span className="text-[10px] text-emerald-100 mt-0.5">{t('pricing.from')} €22,48{t('pricing.perMonthShort')}</span>
                  </div>
                </div>
                <div className="p-4 text-center hover:bg-emerald-50 transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Crown className="w-7 h-7 text-emerald-600 fill-emerald-600" />
                    <h3 className="text-xl font-bold text-[#1e293b]">{(t('pricing.offers.l') as any).name}</h3>
                    <span className="text-xs text-gray-500 font-medium">{t('pricing.complete')}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{t('pricing.from')} €29,98{t('pricing.perMonthShort')}</span>
                  </div>
                </div>
              </div>

              {/* Duration Rows */}
              {[
                {
                  duration: t('pricing.tableRows.duration36'),
                  sublabel: t('pricing.inAdvancePlus24Free'),
                  badge: t('pricing.bestValue'),
                  badgeColor: 'bg-cyan-500',
                  note: `(${t('pricing.onlyAfterFreeVerification')})`,
                  prices: ['€19,98', '€22,48', '€29,98'],
                  totals: [`60 ${t('pricing.monthsShort')} / €1199`, `60 ${t('pricing.monthsShort')} / €1349`, `60 ${t('pricing.monthsShort')} / €1799`]
                },
                {
                  duration: t('pricing.tableRows.duration24'),
                  sublabel: t('pricing.inAdvancePlus12Free'),
                  badge: t('pricing.recommended'),
                  badgeColor: 'bg-cyan-500',
                  prices: ['€26,36', '€31,92', '€34,69'],
                  totals: [`36 ${t('pricing.monthsShort')} / €949`, `36 ${t('pricing.monthsShort')} / €1149`, `36 ${t('pricing.monthsShort')} / €1249`]
                },
                {
                  duration: t('pricing.tableRows.duration12'),
                  sublabel: t('pricing.inAdvancePlus3Free'),
                  prices: ['€46,60', '€53,27', '€63,27'],
                  totals: [`15 ${t('pricing.monthsShort')} / €699`, `15 ${t('pricing.monthsShort')} / €799`, `15 ${t('pricing.monthsShort')} / €949`]
                },
                {
                  duration: t('pricing.tableRows.duration6'),
                  sublabel: '',
                  prices: ['€74,83', '€91,50', '€108,17'],
                  totals: [`6 ${t('pricing.monthsShort')} / €449`, `6 ${t('pricing.monthsShort')} / €549`, `6 ${t('pricing.monthsShort')} / €649`]
                }
              ].map((row, idx) => (
                <div key={idx} className={`grid grid-cols-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/20'} border-t border-emerald-100/50 hover:bg-emerald-100/40 transition-all duration-200 group`}>
                  <div className="p-5 border-r border-emerald-100/50 row-hover-slide">
                    <div className="font-extrabold text-emerald-600 text-xl">{row.duration}</div>
                    {row.sublabel && (
                      <div className="text-base text-green-600 font-bold mt-1.5">{row.sublabel}</div>
                    )}
                    {row.badge && (
                      <div className="mt-3">
                        <span className={`${row.badgeColor} text-white text-xs font-bold px-4 py-2 rounded-full shadow-md inline-flex items-center gap-1.5`}>
                          <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          {row.badge}
                        </span>
                      </div>
                    )}
                    {row.note && (
                      <div className="text-xs text-[#64748b] mt-2 italic">{row.note}</div>
                    )}
                  </div>
                  <div className="p-5 text-center border-r border-emerald-100/50 flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-105">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-emerald-500">{row.prices[0]}</span>
                      <span className="text-base font-semibold text-slate-600">{t('pricing.perMonthShort')}</span>
                    </div>
                    <div className="text-base text-[#1e293b] mt-2 font-semibold">{row.totals[0]}</div>
                  </div>
                  <div className="p-5 text-center bg-emerald-50/30 border-r border-emerald-200/50 flex flex-col items-center justify-center popular-glow transition-all duration-200 group-hover:scale-105">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-emerald-500">{row.prices[1]}</span>
                      <span className="text-base font-semibold text-slate-600">{t('pricing.perMonthShort')}</span>
                    </div>
                    <div className="text-base text-[#1e293b] mt-2 font-bold">{row.totals[1]}</div>
                  </div>
                  <div className="p-5 text-center bg-purple-50/30 flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-105">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-emerald-500">{row.prices[2]}</span>
                      <span className="text-base font-semibold text-slate-600">{t('pricing.perMonthShort')}</span>
                    </div>
                    <div className="text-base text-[#1e293b] mt-2 font-semibold">{row.totals[2]}</div>
                  </div>
                </div>
              ))}

              {/* CTA Row */}
              <div className="grid grid-cols-4 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 border-t-2 border-emerald-200/50">
                <div className="p-5"></div>
                <div className="p-5 text-center">
                  <Link
                    to="/contact"
                    className="inline-block w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t('pricing.choose')}
                  </Link>
                </div>
                <div className="p-5 text-center bg-emerald-50/30 popular-glow">
                  <Link
                    to="/contact"
                    className="inline-block w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:from-cyan-600 hover:to-cyan-700 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl ring-2 ring-cyan-200 hover:ring-cyan-300"
                  >
                    {t('pricing.choose')}
                  </Link>
                </div>
                <div className="p-5 text-center">
                  <Link
                    to="/contact"
                    className="inline-block w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold hover:from-emerald-600 hover:to-emerald-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t('pricing.choose')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Installation Fees Section */}
          <div className="bg-gradient-to-br from-white via-emerald-50/20 to-white rounded-3xl shadow-2xl border-2 border-emerald-200/50 p-10 mb-8 hover:shadow-3xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-[#1e293b] mb-4 text-center">{t('pricing.installation.title')}</h3>
            <p className="text-[#1e293b] text-center leading-relaxed mb-6 max-w-3xl mx-auto">
              {t('pricing.installation.description')} <strong className="text-cyan-600 bg-emerald-100 px-2 py-1 rounded-lg">{t('pricing.installation.priceAmount')}</strong>
            </p>
            <PaymentBadges variant="full" title={t('pricing.installation.paymentMethodsTitle')} />
          </div>
        </div>
      </section>

      {/* Standalone Products Section */}
      <section className="py-20 bg-gradient-to-b from-emerald-900 to-gray-900 relative overflow-hidden" id="services-autonomes">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-4 border border-emerald-500/30">
              Solutions Indépendantes
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Services Autonomes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Pas besoin d'abonnement. Choisissez uniquement ce dont vous avez besoin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Card 1 - MaSecu AI Assistant */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-emerald-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">MaSecu Assistant IA</h3>
              <p className="text-gray-400 mb-6">
                Assistant intelligent disponible 24/7 pour répondre à toutes vos questions de sécurité.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">19,99€</span>
                <span className="text-gray-400">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-emerald-400">✓</span> Réponses instantanées
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-emerald-400">✓</span> Support 24/7
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-emerald-400">✓</span> Conseils personnalisés
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-emerald-400">✓</span> Multilingue
                </li>
              </ul>
              <Link to="/products/ai-assistant" className="block w-full py-3 text-center bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors">
                En savoir plus
              </Link>
            </div>

            {/* Card 2 - MaSecu Mobile */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">MaSecu Mobile</h3>
              <p className="text-gray-400 mb-6">
                Protection complète pour vos smartphones et tablettes Android & iOS.
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">9,99€</span>
                <span className="text-gray-400">/appareil</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-blue-400">✓</span> Scanner malware auto
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-blue-400">✓</span> Protection web
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-blue-400">✓</span> Alerte arnaque SMS
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <span className="text-blue-400">✓</span> VPN & Anti-vol
                </li>
              </ul>
              <Link to="/products/mobile-security" className="block w-full py-3 text-center bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                En savoir plus
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Addons Section */}
      <section className="py-20 bg-gray-900" id="addons">
        <div className="max-w-6xl mx-auto px-4">

          {/* Notice Banner */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium border border-emerald-500/20">
              <span>✓</span>
              Nécessite un abonnement actif (Protection Essentielle, Famille ou Complète)
            </span>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Boostez votre protection
            </h2>
            <p className="text-gray-400">
              Ajoutez ces options à votre abonnement pour une sécurité renforcée.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* VPN Pro */}
            <div className="bg-gradient-to-b from-blue-500/10 to-transparent rounded-3xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                <span className="text-xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">MaSecu VPN Pro</h3>
              <p className="text-gray-400 text-sm mb-4">
                Naviguez anonymement dans 30+ pays
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-white">9,99€</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-blue-400">✓</span> 50+ serveurs
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-blue-400">✓</span> Bande passante illimitée
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-blue-400">✓</span> Chiffrement AES-256
                </li>
              </ul>
              <Link to="/products/vpn" className="block w-full py-2.5 text-center bg-blue-500/20 text-blue-400 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-all">
                Ajouter
              </Link>
            </div>

            {/* AdBlock Plus */}
            <div className="bg-gradient-to-b from-red-500/10 to-transparent rounded-3xl p-6 border border-red-500/20 hover:border-red-500/50 transition-all">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/30">
                <span className="text-xl">🛑</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">MaSecu AdBlock</h3>
              <p className="text-gray-400 text-sm mb-4">
                Bloquez pubs, trackers et phishing
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-white">9,99€</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-red-400">✓</span> Blocage pubs & pop-ups
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-red-400">✓</span> Anti-trackers avancé
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-red-400">✓</span> Navigation 40% plus rapide
                </li>
              </ul>
              <Link to="/products/adblock" className="block w-full py-2.5 text-center bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all">
                Ajouter
              </Link>
            </div>

            {/* System Cleaner */}
            <div className="bg-gradient-to-b from-amber-500/10 to-transparent rounded-3xl p-6 border border-amber-500/20 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
                <span className="text-xl">🧹</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">MaSecu Cleaner</h3>
              <p className="text-gray-400 text-sm mb-4">
                Optimisez les performances de votre PC
              </p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-white">9,99€</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-amber-400">✓</span> Nettoyage fichiers temp
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-amber-400">✓</span> Optimisation registre
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <span className="text-amber-400">✓</span> Défragmentation auto
                </li>
              </ul>
              <Link to="/products/system-cleaner" className="block w-full py-2.5 text-center bg-amber-500/20 text-amber-400 rounded-lg font-medium hover:bg-amber-500 hover:text-white transition-all">
                Ajouter
              </Link>
            </div>

            {/* Total Care - HIGHLIGHTED */}
            <div className="bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 rounded-3xl p-6 border-2 border-emerald-500/50 relative">
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  ÉCONOMISEZ 17%
                </span>
              </div>

              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 mt-2 shadow-lg shadow-emerald-500/30">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">MaSecu Total Care</h3>
              <p className="text-gray-400 text-sm mb-4">
                Le pack complet : VPN + AdBlock + Cleaner
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-white">24,99€</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <p className="text-emerald-400 text-xs mb-4">au lieu de 29,97€</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center text-xs">🌐</span>
                  VPN Pro
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="w-6 h-6 bg-red-500/20 rounded-md flex items-center justify-center text-xs">🛑</span>
                  AdBlock Plus
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="w-6 h-6 bg-amber-500/20 rounded-md flex items-center justify-center text-xs">🧹</span>
                  System Cleaner
                </div>
              </div>

              <Link to="/products/total-care" className="block w-full py-2.5 text-center bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-all">
                Choisir le pack
              </Link>
            </div>

          </div>

        </div>
      </section>

      <section id="features" className="py-24 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200 to-emerald-200 rounded-full filter blur-3xl animate-float"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('features.cards.completeProtection.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('features.cards.completeProtection.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('features.cards.preventiveMaintenance.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('features.cards.preventiveMaintenance.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12.55C5 15.49 6.5 18.38 9.5 19.5C12.5 20.62 15.5 19.5 17 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.22 8.39C20.74 10.91 20.74 15.04 18.22 17.56C15.7 20.08 11.57 20.08 9.05 17.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('features.cards.performantConnections.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('features.cards.performantConnections.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1V4M12 20V23M4.22 4.22L6.34 6.34M17.66 17.66L19.78 19.78M1 12H4M20 12H23M4.22 19.78L6.34 17.66M17.66 6.34L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('features.cards.softwareApplications.title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('features.cards.softwareApplications.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-slate-900 mb-4">{t('faq.title')}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                  <span className={`text-2xl text-emerald-600 transition-transform ${activeFaq === idx ? 'rotate-45' : ''}`}>+</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <TrustSeals />

      <section id="contact" className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à sécuriser votre vie numérique?
          </h2>
          <p className="text-emerald-100 text-xl mb-10">
            Commencez par un scan gratuit. C'est rapide et sans engagement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/verification"
              className="px-8 py-4 bg-white text-emerald-600 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all"
            >
              🔍 Lancer le scan gratuit
            </a>
            <a
              href="tel:+3216186098"
              className="px-8 py-4 bg-emerald-700 text-white rounded-full font-bold text-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-2"
            >
              📞 016 18 60 98
            </a>
          </div>

        </div>
      </section>

      <Footer />

    </div>
  );
}

export default App;
