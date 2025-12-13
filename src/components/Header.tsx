import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePhoneByLocation } from '../hooks/usePhoneByLocation';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
              <span>📞</span> {phoneInfo?.localNumber || '016 18 60 98'}
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>{t('nav.businessHours')}</span>
            <span className="font-semibold">{t('nav.emergency247')}</span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0">
            <Logo variant="header" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              {t('nav.home')}
            </Link>
            <a href="/#services" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              {t('nav.ourServices')}
            </a>
            <a href="/#pricing" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              {t('nav.pricing')}
            </a>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              {t('nav.whoAreWe')}
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">
              {t('nav.contact')}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/verification"
              className="hidden md:flex items-center gap-2 text-emerald-600 font-medium hover:underline"
            >
              <span>🔍</span>
              <span>{t('nav.freeScan')}</span>
            </Link>

            <a
              href="https://masecu2025.getscreen.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors"
            >
              <span className="hidden sm:inline">{t('nav.needHelp')}</span>
              <span className="sm:hidden">🆘</span>
            </a>

            <div className="hidden lg:block">
              <LanguageSelector />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
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
              <a href="/#services" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.ourServices')}
              </a>
              <a href="/#pricing" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.pricing')}
              </a>
              <Link to="/about" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.whoAreWe')}
              </Link>
              <Link to="/verification" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                🔍 {t('nav.freeScan')}
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.contact')}
              </Link>
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
