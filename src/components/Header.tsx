import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePhoneByLocation } from '../hooks/usePhoneByLocation';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { t } = useLanguage();
  const { phoneInfo, loading } = usePhoneByLocation();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-emerald-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span>🇧🇪</span>
              <span className="hidden sm:inline">{t('nav.belgianCompany')}</span>
            </span>
            <a href={`tel:${phoneInfo?.number.replace(/\s+/g, '') || ''}`} className="flex items-center gap-2 hover:underline">
              <span>📞</span> {phoneInfo?.localNumber || '01 618 60 98'}
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>{t('nav.businessHours')}</span>
            <span className="font-semibold">{t('nav.emergency247')}</span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0 mr-8">
            <Logo variant="header" />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors whitespace-nowrap">
              {t('nav.home')}
            </Link>

            <a href="/#pricing" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors whitespace-nowrap">
              {t('nav.ourServices')}
            </a>

            <a href="/#pricing" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors whitespace-nowrap">
              {t('nav.pricing')}
            </a>
            <Link to="/blog" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors whitespace-nowrap">
              Blog
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors whitespace-nowrap">
              {t('nav.whoAreWe')}
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors whitespace-nowrap">
              {t('nav.contact')}
            </Link>
          </div>

          <div className="flex items-center gap-4 ml-8 flex-shrink-0">
            {/* Vérifier mes données - Orange accent button */}
            <Link
              to="/verification"
              className="hidden xl:flex items-center gap-1.5 px-4 py-2 text-orange-600 font-medium border border-orange-200 rounded-full hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              <span>🔍</span>
              <span>{t('nav.checkMyData')}</span>
            </Link>

            {/* Diagnostic Rapide - Green text button */}
            <Link
              to="/analyse-rapide"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-emerald-600 font-medium hover:bg-emerald-50 rounded-full transition-colors whitespace-nowrap"
            >
              <span>⚡</span>
              <span>{t('nav.quickScan')}</span>
            </Link>

            {/* Main CTA - Besoin d'aide */}
            <a
              href="https://masecu2025.getscreen.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">{t('nav.needHelp')}</span>
              <span className="sm:hidden">🆘</span>
            </a>

            <div className="hidden lg:block">
              <LanguageSelector />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <Link to="/" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.home')}
              </Link>

              {/* Mobile Services Dropdown */}
              <div>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium"
                >
                  {t('nav.ourServices')}
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    <a href="/#pricing" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.essentialProtection')}
                    </a>
                    <a href="/#pricing" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.familyProtection')}
                    </a>
                    <a href="/#pricing" className="block px-3 py-2 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.completeProtection')}
                    </a>
                  </div>
                )}
              </div>

              <a href="/#pricing" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.pricing')}
              </a>
              <Link to="/about" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.whoAreWe')}
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.contact')}
              </Link>

              {/* Mobile CTA Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <Link to="/verification" className="flex items-center gap-2 px-3 py-2 text-orange-600 font-medium bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  🔍 {t('nav.checkMyData')}
                </Link>
                <Link to="/analyse-rapide" className="flex items-center gap-2 px-3 py-2 text-emerald-600 font-medium bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  ⚡ {t('nav.quickScan')}
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <LanguageSelector />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
