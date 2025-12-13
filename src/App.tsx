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

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100">
              🇧🇪 {t('hero.badges.belgian')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100">
              ⭐ 4.9/5 - {t('hero.badges.rating')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100">
              🛡️ {t('hero.badges.customers')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}<br />
            <span className="text-emerald-500">{t('hero.subtitle')}</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/analyse-rapide"
              className="px-8 py-4 bg-emerald-500 text-white rounded-full font-semibold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
            >
              🔍 {t('hero.cta')}
            </Link>
            <a
              href="tel:+3216186098"
              className="px-8 py-4 bg-white text-gray-700 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
            >
              📞 Appelez-nous: 016 18 60 98
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-gray-600">
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> {t('hero.trustPoints.noCommitment')}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> {t('hero.trustPoints.moneyBack')}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> {t('hero.trustPoints.support247')}
            </span>
          </div>

        </div>
      </section>

      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Nos services
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment pouvons-nous vous aider?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pas besoin d'être un expert en informatique. On s'occupe de votre sécurité, vous profitez de votre vie numérique en toute tranquillité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <article className="group p-8 bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💻</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Protection PC & Mac</h3>
              <p className="text-gray-600 mb-6">
                Votre ordinateur est lent ou se comporte bizarrement? On installe une protection complète contre les virus, malwares et autres cochonneries du web. Mises à jour automatiques, vous n'avez rien à faire!
              </p>
              <a href="/#pricing" className="text-emerald-600 font-medium hover:underline inline-flex items-center gap-1">
                En savoir plus <span>→</span>
              </a>
            </article>

            <article className="group p-8 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Pack Famille</h3>
              <p className="text-gray-600 mb-6">
                Vos enfants passent du temps sur internet? Protégez toute la famille avec notre pack complet. Contrôle parental inclus pour une navigation sécurisée. Jusqu'à 5 appareils couverts!
              </p>
              <a href="/#pricing" className="text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
                En savoir plus <span>→</span>
              </a>
            </article>

            <article className="group p-8 bg-gradient-to-br from-orange-50 to-white rounded-3xl border border-orange-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mes données sont-elles piratées?</h3>
              <p className="text-gray-600 mb-6">
                Vous recevez des emails bizarres? Des appels suspects? Vérifiez gratuitement si vos données personnelles circulent sur le dark web. On vous aide à reprendre le contrôle!
              </p>
              <a href="/verification" className="text-orange-600 font-medium hover:underline inline-flex items-center gap-1">
                Vérifier maintenant <span>→</span>
              </a>
            </article>

            <article className="group p-8 bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🆘</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Assistance d'urgence</h3>
              <p className="text-gray-600 mb-6">
                Vous pensez être victime d'un piratage ou d'une arnaque? Pas de panique! Notre équipe est disponible 24h/24 pour vous aider. On a déjà vu pire, on va trouver une solution.
              </p>
              <a href="https://masecu2025.getscreen.me/" target="_blank" rel="noopener noreferrer" className="text-red-600 font-medium hover:underline inline-flex items-center gap-1">
                Appeler maintenant <span>→</span>
              </a>
            </article>

          </div>

        </div>
      </section>

      <section className="py-20 bg-gray-50" id="pourquoi-nous">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Pourquoi nous choisir?
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce qui fait la différence
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              On n'est pas une grande boîte anonyme. Chez MaSécurité.be, vous parlez à de vraies personnes qui comprennent vos problèmes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🇧🇪</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">100% Belge</h3>
              <p className="text-gray-600">
                Une équipe locale qui connaît vos besoins. Pas de call center à l'étranger!
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">On parle simple</h3>
              <p className="text-gray-600">
                Pas de jargon technique incompréhensible. On vous explique tout clairement.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Prix honnêtes</h3>
              <p className="text-gray-600">
                Ce qu'on vous dit, c'est ce que vous payez. Pas de mauvaises surprises sur la facture.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Toujours dispo</h3>
              <p className="text-gray-600">
                Un problème un samedi soir? On répond. Urgences disponibles 24h/24.
              </p>
            </div>

          </div>

        </div>
      </section>

      <section className="py-20 bg-white" id="comment-ca-marche">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Simple comme bonjour
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En trois étapes, vous êtes protégé. Promis, c'est pas compliqué!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vous nous appelez</h3>
              <p className="text-gray-600">
                Racontez-nous votre situation. On écoute, on pose quelques questions, et on vous propose la solution adaptée.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">On s'occupe de tout</h3>
              <p className="text-gray-600">
                Installation à distance ou à domicile, c'est vous qui choisissez. On vous guide pas à pas, c'est super simple.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vous êtes tranquille!</h3>
              <p className="text-gray-600">
                Votre protection est active. Si jamais vous avez une question, on reste disponible. Vous n'êtes plus seul!
              </p>
            </div>

          </div>

        </div>
      </section>

      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Nos formules
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Des prix clairs, sans surprises
            </h2>
            <p className="text-gray-600">
              Choisissez la formule adaptée à vos besoins. Sans engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

            {/* Plan 1 - Essentielle */}
            <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🛡️</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">Protection Essentielle</h3>
              <p className="text-gray-500 text-sm mb-6">Pour un appareil</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">€9,99</span>
                <span className="text-gray-500">/mois</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-500">✓</span>
                  <span>1 appareil protégé</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-500">✓</span>
                  <span>Antivirus complet</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-500">✓</span>
                  <span>Protection web</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-emerald-500">✓</span>
                  <span>Support email</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <span>—</span>
                  <span>Contrôle parental</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <span>—</span>
                  <span>VPN inclus</span>
                </li>
              </ul>

              <Link to="/contact" className="block w-full py-3 px-6 text-center bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all">
                Choisir
              </Link>
            </div>

            {/* Plan 2 - Famille (POPULAR) */}
            <div className="relative bg-emerald-500 rounded-3xl p-8 text-white transform md:-translate-y-4 shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:-translate-y-5 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                  Le plus populaire
                </span>
              </div>

              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 mt-2">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>

              <h3 className="text-xl font-bold mb-1">Protection Famille</h3>
              <p className="text-emerald-100 text-sm mb-6">Jusqu'à 5 appareils</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">€19,99</span>
                <span className="text-emerald-200">/mois</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <span>✓</span>
                  <span>Jusqu'à 5 appareils</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✓</span>
                  <span>Antivirus complet</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✓</span>
                  <span>Protection web</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✓</span>
                  <span>Contrôle parental</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✓</span>
                  <span>VPN sécurisé</span>
                </li>
                <li className="flex items-center gap-3">
                  <span>✓</span>
                  <span>Support prioritaire 7j/7</span>
                </li>
              </ul>

              <Link to="/contact" className="block w-full py-3 px-6 text-center bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                Choisir
              </Link>
            </div>

            {/* Plan 3 - Complète */}
            <div className="relative bg-gradient-to-b from-purple-50 to-white rounded-3xl p-8 border border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">👑</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">Protection Complète</h3>
              <p className="text-gray-500 text-sm mb-6">Appareils illimités</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">€29,99</span>
                <span className="text-gray-500">/mois</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Appareils illimités</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Tout du Pack Famille</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Gestionnaire mots de passe</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Sauvegarde cloud 100GB</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Support VIP 24h/24</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="text-purple-500">✓</span>
                  <span>Formation personnalisée</span>
                </li>
              </ul>

              <Link to="/contact" className="block w-full py-3 px-6 text-center bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all">
                Choisir
              </Link>
            </div>

          </div>

          {/* Guarantee bar */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Sans engagement
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Satisfait ou remboursé 30 jours
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Paiement sécurisé
            </span>
          </div>

        </div>
      </section>

      <section className="py-20 bg-gray-50" id="services-autonomes">
        <div className="max-w-4xl mx-auto px-4">

          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Services à la carte
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Besoin d'un coup de main ponctuel?
            </h2>
            <p className="text-gray-600">
              Pas besoin d'abonnement. Payez uniquement ce dont vous avez besoin.
            </p>
          </div>

          <div className="space-y-4">

            {/* Service 1 - Diagnostic */}
            <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔍</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Diagnostic complet</h3>
                  <p className="text-gray-600 text-sm">Analyse complète de votre appareil avec rapport détaillé et recommandations.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:flex-shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">€29</span>
                  <span className="text-gray-500 text-sm block">une fois</span>
                </div>
                <Link to="/contact" className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                  Commander
                </Link>
              </div>
            </div>

            {/* Service 2 - Nettoyage virus */}
            <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🦠</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Nettoyage virus & malware</h3>
                  <p className="text-gray-600 text-sm">Suppression complète des virus, malwares et logiciels indésirables.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:flex-shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">€49</span>
                  <span className="text-gray-500 text-sm block">une fois</span>
                </div>
                <Link to="/contact" className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                  Commander
                </Link>
              </div>
            </div>

            {/* Service 3 - Installation */}
            <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚙️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Installation & configuration</h3>
                  <p className="text-gray-600 text-sm">On installe et configure vos logiciels de sécurité. Vous n'avez rien à faire!</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:flex-shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">€39</span>
                  <span className="text-gray-500 text-sm block">une fois</span>
                </div>
                <Link to="/contact" className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                  Commander
                </Link>
              </div>
            </div>

            {/* Service 4 - Formation */}
            <div className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎓</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Formation sécurité (1h)</h3>
                  <p className="text-gray-600 text-sm">Apprenez à reconnaître les arnaques et à protéger vos données. Session personnalisée.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:flex-shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">€59</span>
                  <span className="text-gray-500 text-sm block">1 heure</span>
                </div>
                <Link to="/contact" className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                  Commander
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section className="py-20 bg-white" id="options">
        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Options supplémentaires
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Boostez votre protection
            </h2>
            <p className="text-gray-600">
              Ajoutez ces options à n'importe quelle formule pour une protection renforcée.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Add-on 1 - VPN Premium */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">🌐</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">VPN Premium</h3>
              <p className="text-gray-600 text-sm mb-4">Navigation anonyme sur tous vos appareils</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-900">€4,99</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <Link to="/contact" className="block w-full py-2 px-4 text-center bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Ajouter
              </Link>
            </div>

            {/* Add-on 2 - Gestionnaire MDP */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">🔐</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Coffre-fort MDP</h3>
              <p className="text-gray-600 text-sm mb-4">Tous vos mots de passe sécurisés</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-900">€2,99</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <Link to="/contact" className="block w-full py-2 px-4 text-center bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
                Ajouter
              </Link>
            </div>

            {/* Add-on 3 - Sauvegarde Cloud */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">☁️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Sauvegarde Cloud</h3>
              <p className="text-gray-600 text-sm mb-4">100GB de stockage sécurisé</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-900">€3,99</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <Link to="/contact" className="block w-full py-2 px-4 text-center bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                Ajouter
              </Link>
            </div>

            {/* Add-on 4 - Support Premium */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-lg">⚡</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Support Express</h3>
              <p className="text-gray-600 text-sm mb-4">Réponse garantie en 1h max</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-900">€5,99</span>
                <span className="text-gray-500 text-sm">/mois</span>
              </div>
              <Link to="/contact" className="block w-full py-2 px-4 text-center bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                Ajouter
              </Link>
            </div>

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

      <section id="contact" className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à dire adieu aux soucis informatiques?
          </h2>
          <p className="text-emerald-100 text-xl mb-10">
            Faites un diagnostic gratuit en 2 minutes. On vous dit exactement si vous êtes à risque.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/analyse-rapide"
              className="px-8 py-4 bg-white text-emerald-600 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-lg"
            >
              🔍 Lancer le diagnostic gratuit
            </a>
            <a
              href="tel:+3216186098"
              className="px-8 py-4 bg-emerald-700 text-white rounded-full font-bold text-lg hover:bg-emerald-800 transition-all flex items-center justify-center gap-2"
            >
              📞 016 18 60 98
            </a>
          </div>

          <p className="mt-8 text-emerald-200 text-sm">
            Plus de 10 000 familles belges nous font déjà confiance
          </p>

        </div>
      </section>

      <Footer />

    </div>
  );
}

export default App;
