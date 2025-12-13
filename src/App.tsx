import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, Crown } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import SectionHeader from './components/SectionHeader';
import TestimonialsSection from './components/TestimonialsSection';
import TrustSeals from './components/TrustSeals';
import TrustBadges from './components/TrustBadges';
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

      <section id="accueil" className="pt-32 pb-20 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-emerald-200 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-8 flex justify-center lg:justify-start">
            <TrustBadges />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                {t('hero.title')} <br /> {t('hero.subtitle')}
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href="#pricing" className="px-10 py-4 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full text-lg font-bold hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl transform text-center">
                  {t('hero.cta')}
                </a>
                <a href="#services" className="px-10 py-4 bg-white border-3 border-emerald-400 text-emerald-600 rounded-full text-lg font-bold hover:bg-emerald-50 transition-all duration-300 hover:shadow-xl text-center">
                  {t('hero.ctaSecondary')}
                </a>
              </div>
              <div className="flex flex-wrap gap-6 text-slate-700">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">✓</span>
                  </div>
                  {t('hero.simpleToUse')}
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">✓</span>
                  </div>
                  {t('hero.secure')}
                </div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600">✓</span>
                  </div>
                  {t('hero.support247')}
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-emerald-200 rounded-3xl opacity-50 blur-2xl"></div>
                <img
                  src="https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Senior customer using computer with satisfaction"
                  className="relative rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-gradient-to-b from-white to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeader
            title={t('services.title')}
            subtitle={t('services.subtitle')}
          />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="relative bg-white p-10 rounded-3xl shadow-xl border-2 border-emerald-100 hover:shadow-2xl hover:-translate-y-3 hover:border-emerald-400 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-100/0 group-hover:to-emerald-100/50 transition-all duration-500"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 10H22L12 2L2 10H6M18 10V20C18 20.5304 17.7893 21.0391 17.4142 21.4142C17.0391 21.7893 16.5304 22 16 22H8C7.46957 22 6.96086 21.7893 6.58579 21.4142C6.21071 21.0391 6 20.5304 6 20V10M18 10H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('services.cloudServer.title')}</h3>
              <p className="relative text-slate-600 mb-6 leading-relaxed text-lg">
                {t('services.cloudServer.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.cloudServer.feature1')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.cloudServer.feature2')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.cloudServer.feature3')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.cloudServer.feature4')}</li>
              </ul>
            </div>

            <div className="relative bg-white p-10 rounded-3xl shadow-xl border-2 border-emerald-100 hover:shadow-2xl hover:-translate-y-3 hover:border-emerald-400 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-100/0 group-hover:to-emerald-100/50 transition-all duration-500"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('services.security.title')}</h3>
              <p className="relative text-slate-600 mb-6 leading-relaxed text-lg">
                {t('services.security.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.security.feature1')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.security.feature2')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.security.feature3')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.security.feature4')}</li>
              </ul>
            </div>

            <div className="relative bg-white p-10 rounded-3xl shadow-xl border-2 border-emerald-100 hover:shadow-2xl hover:-translate-y-3 hover:border-emerald-400 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-100/0 group-hover:to-emerald-100/50 transition-all duration-500"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('services.phone.title')}</h3>
              <p className="relative text-slate-600 mb-6 leading-relaxed text-lg">
                {t('services.phone.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.phone.feature1')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.phone.feature2')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.phone.feature3')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.phone.feature4')}</li>
              </ul>
            </div>

            <div className="relative bg-white p-10 rounded-3xl shadow-xl border-2 border-emerald-100 hover:shadow-2xl hover:-translate-y-3 hover:border-emerald-400 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-100/0 group-hover:to-emerald-100/50 transition-all duration-500"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8C12.5304 8 13.0391 8.21071 13.4142 8.58579C13.7893 8.96086 14 9.46957 14 10C14 10.39 13.85 10.75 13.62 11.03L12 13.5L10.38 11.03C10.15 10.75 10 10.39 10 10C10 9.46957 10.2107 8.96086 10.5858 8.58579C10.9609 8.21071 11.4696 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <ellipse cx="12" cy="16" rx="2" ry="1" fill="currentColor"/>
                  <ellipse cx="10" cy="14.5" rx="1.5" ry="0.8" fill="currentColor"/>
                  <ellipse cx="14" cy="14.5" rx="1.5" ry="0.8" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="relative text-2xl font-bold text-emerald-700 mb-4 group-hover:text-emerald-600 transition-colors">{t('services.identityProtection.title')}</h3>
              <p className="relative text-slate-600 mb-6 leading-relaxed text-lg">
                {t('services.identityProtection.description')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.identityProtection.feature1')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.identityProtection.feature2')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.identityProtection.feature3')}</li>
                <li className="flex items-start gap-3 text-slate-700 text-lg"><span className="text-emerald-500 font-bold text-xl">✓</span> {t('services.identityProtection.feature4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-300 rounded-full filter blur-3xl animate-float"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-emerald-200 rounded-3xl opacity-50 blur-2xl"></div>
                <img
                  src="https://images.pexels.com/photos/7640412/pexels-photo-7640412.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Senior woman video calling with family"
                  className="relative rounded-3xl shadow-2xl w-full h-auto transform hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-emerald-700 mb-6">{t('services.family.title')}</h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                {t('services.family.description')}
              </p>
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
                className={`px-10 py-4 rounded-xl font-bold transition-all duration-300 ${customerType === 'particulier' ? 'bg-gradient-to-r from-emerald-400 to-[#f97316] text-white shadow-lg' : 'text-[#1e293b] hover:text-[#f97316]'}`}
              >
                {t('pricing.customerType.individual')}
              </button>
              <button
                onClick={() => setCustomerType('professionnel')}
                className={`px-10 py-4 rounded-xl font-bold transition-all duration-300 ${customerType === 'professionnel' ? 'bg-gradient-to-r from-emerald-400 to-[#f97316] text-white shadow-lg' : 'text-[#1e293b] hover:text-[#f97316]'}`}
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
                <div className="p-4 text-center bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white border-r border-[#ea580c] popular-glow relative hover:scale-[1.01] transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Star className="w-7 h-7 text-white fill-white" />
                    <h3 className="text-xl font-bold">{(t('pricing.offers.m') as any).name}</h3>
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      {t('pricing.mostPopular')}
                    </span>
                  </div>
                </div>
                <div className="p-4 text-center rounded-tr-3xl hover:bg-emerald-50 transition-all duration-200">
                  <div className="flex flex-col items-center gap-1.5">
                    <Crown className="w-7 h-7 text-emerald-600 fill-emerald-600" />
                    <h3 className="text-xl font-bold text-[#1e293b]">{(t('pricing.offers.l') as any).name}</h3>
                    <span className="text-xs text-gray-500 font-medium">{t('pricing.complete')}</span>
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
                            <span className="text-[#f97316] text-base leading-none">•</span>
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
                    <span className={feature.values[0] === '✓' ? 'text-[#f97316] text-2xl font-bold checkmark-animate checkmark-hover cursor-pointer' : feature.values[0] === '—' ? 'text-[#94a3b8] text-xl' : 'whitespace-pre-line'} style={feature.values[0] === '✓' ? {animationDelay: `${idx * 0.05}s`} : {}}>{feature.values[0]}</span>
                  </div>
                  <div className="p-4 text-center bg-emerald-50/30 text-[#1e293b] font-semibold border-r border-emerald-200/50 flex items-center justify-center popular-glow transition-all duration-200">
                    <span className={feature.values[1] === '✓' ? 'text-[#f97316] text-2xl font-bold checkmark-animate checkmark-hover cursor-pointer' : feature.values[1] === '—' ? 'text-[#94a3b8] text-xl' : 'whitespace-pre-line'} style={feature.values[1] === '✓' ? {animationDelay: `${idx * 0.05}s`} : {}}>{feature.values[1]}</span>
                  </div>
                  <div className="p-4 text-center text-[#1e293b] flex items-center justify-center transition-all duration-200">
                    <span className={feature.values[2] === '✓' ? 'text-[#f97316] text-2xl font-bold checkmark-animate checkmark-hover cursor-pointer' : feature.values[2] === '—' ? 'text-[#94a3b8] text-xl' : 'whitespace-pre-line'} style={feature.values[2] === '✓' ? {animationDelay: `${idx * 0.05}s`} : {}}>{feature.values[2]}</span>
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
                <div className="p-4 text-center bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white border-r border-[#ea580c] relative popular-glow hover:scale-[1.01] transition-all duration-200">
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
                  badgeColor: 'bg-[#f97316]',
                  note: `(${t('pricing.onlyAfterFreeVerification')})`,
                  prices: ['€19,98', '€22,48', '€29,98'],
                  totals: [`60 ${t('pricing.monthsShort')} / €1199`, `60 ${t('pricing.monthsShort')} / €1349`, `60 ${t('pricing.monthsShort')} / €1799`]
                },
                {
                  duration: t('pricing.tableRows.duration24'),
                  sublabel: t('pricing.inAdvancePlus12Free'),
                  badge: t('pricing.recommended'),
                  badgeColor: 'bg-[#f97316]',
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
                  <div className="p-5 text-center flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-105">
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
                    className="inline-block w-full px-6 py-4 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl ring-2 ring-emerald-200 hover:ring-emerald-300"
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
              {t('pricing.installation.description')} <strong className="text-[#f97316] bg-emerald-100 px-2 py-1 rounded-lg">{t('pricing.installation.priceAmount')}</strong>
            </p>
            <PaymentBadges variant="full" title={t('pricing.installation.paymentMethodsTitle')} />
          </div>
        </div>
      </section>

      {/* Standalone Products Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-6">
            <span className="inline-block px-6 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-slate-300 text-sm font-medium mb-8">
              {t('standaloneProducts.badge')}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-white mb-6">
            {t('standaloneProducts.title')}
          </h2>
          <p className="text-center text-slate-400 text-xl mb-16 max-w-3xl mx-auto">
            {t('standaloneProducts.subtitle')}
          </p>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* AI Assistant Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-violet-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3l9 4.5v5.25c0 5.25-3.75 9.75-9 11.25-5.25-1.5-9-6-9-11.25V7.5L12 3z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  <path d="M12 9v6M9 12h6" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('standaloneProducts.aiAssistant.name')}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{t('standaloneProducts.aiAssistant.description')}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{t('standaloneProducts.aiAssistant.price')}</span>
                <span className="text-slate-400">{t('standaloneProducts.aiAssistant.period')}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {(t('standaloneProducts.aiAssistant.features') as string[]).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/products/ai-assistant" className="block w-full text-center py-3.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-semibold transition-all duration-300">
                {t('standaloneProducts.aiAssistant.button')}
              </Link>
            </div>

            {/* Mobile Security Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('standaloneProducts.mobileSecurity.name')}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{t('standaloneProducts.mobileSecurity.description')}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{t('standaloneProducts.mobileSecurity.price')}</span>
                <span className="text-slate-400">{t('standaloneProducts.mobileSecurity.period')}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {(t('standaloneProducts.mobileSecurity.features') as string[]).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/products/mobile-security" className="block w-full text-center py-3.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-semibold transition-all duration-300">
                {t('standaloneProducts.mobileSecurity.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Addons Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl animate-float-delayed"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-6">
            <span className="inline-block px-6 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-slate-300 text-sm font-medium mb-8">
              {t('pricing.addons.title')}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-white mb-6">
            {t('addons.title')}
          </h2>
          <p className="text-center text-slate-400 text-xl mb-12 max-w-3xl mx-auto">
            {t('addons.subtitle')}
          </p>

          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold">{t('addons.requirement')}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* VPN Pro Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('addons.vpnPro.name')}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{t('pricing.addons.vpn.description')}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{t('addons.vpnPro.price')}</span>
                <span className="text-slate-400">{t('addons.vpnPro.period')}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {(t('addons.vpnPro.features') as string[]).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/products/vpn" className="block w-full text-center py-3.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-semibold transition-all duration-300">
                {t('addons.vpnPro.button')}
              </Link>
            </div>

            {/* AdBlock Plus Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('addons.adblock.name')}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{t('pricing.addons.scam.description')}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{t('addons.adblock.price')}</span>
                <span className="text-slate-400">{t('addons.adblock.period')}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {(t('addons.adblock.features') as string[]).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/products/adblock" className="block w-full text-center py-3.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-semibold transition-all duration-300">
                {t('addons.adblock.button')}
              </Link>
            </div>

            {/* System Cleaner Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 9h6M9 13h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('addons.systemCleaner.name')}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{t('addons.systemCleaner.description')}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{t('addons.systemCleaner.price')}</span>
                <span className="text-slate-400">{t('addons.systemCleaner.period')}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {(t('addons.systemCleaner.features') as string[]).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/products/system-cleaner" className="block w-full text-center py-3.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-semibold transition-all duration-300">
                {t('addons.systemCleaner.button')}
              </Link>
            </div>

            {/* Total Care Bundle Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-sm border-2 border-amber-500/50 rounded-3xl p-8 hover:border-amber-400 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-[#f97316] text-white text-xs font-bold rounded-full">{t('addons.totalCare.badge')}</span>
              </div>

              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l2 7h7l-5.5 4.5L17 21l-5-4-5 4 1.5-7.5L3 9h7z" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{t('addons.totalCare.name')}</h3>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">{t('addons.totalCare.description')}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{t('addons.totalCare.price')}</span>
                <span className="text-slate-400">{t('addons.totalCare.period')}</span>
                <div className="text-slate-500 text-sm line-through mt-1">{t('addons.totalCare.oldPrice')}</div>
              </div>

              <div className="space-y-3 mb-6">
                {(t('addons.totalCare.includes') as string[]).map((service, idx) => {
                  const icons = [
                    <path key="vpn" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2"/>,
                    <><circle key="adblock1" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path key="adblock2" d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
                    <rect key="cleaner" x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  ];
                  const colors = ['from-emerald-400 to-emerald-600', 'from-emerald-400 to-emerald-600', 'from-emerald-400 to-emerald-600'];

                  return (
                    <div key={idx} className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                      <div className={`w-10 h-10 bg-gradient-to-br ${colors[idx]} rounded-lg flex items-center justify-center`}>
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                          {icons[idx]}
                        </svg>
                      </div>
                      <span className="text-white font-medium text-sm">{service}</span>
                    </div>
                  );
                })}
              </div>

              <Link to="/products/total-care" className="block w-full text-center py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60">
                {t('addons.totalCare.button')}
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

      <section id="contact" className="py-20 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-500 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-extrabold mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-white/90 mb-10">
            {t('cta.subtitle')}
          </p>
          <a href="#pricing" className="inline-block px-10 py-4 bg-white text-emerald-600 rounded-full text-lg font-bold hover:bg-slate-50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl transform">
            {t('cta.button')}
          </a>
          <p className="mt-8 text-white/80">
            {t('faq.helpText')}
          </p>
        </div>
      </section>

      <Footer />

    </div>
  );
}

export default App;
