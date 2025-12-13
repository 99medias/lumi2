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
      <div className="bg-emerald-50 py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-gray-600">
              <span>🇧🇪</span> {t('nav.belgianCompany')}
            </span>
            <a href={`tel:${phoneInfo?.number.replace(/\s+/g, '') || ''}`} className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors">
              <span>📞</span> {phoneInfo?.number || '+32 2 808 94 47'}
            </a>
            <span className="flex items-center gap-1 text-gray-600">
              <span>💬</span> {t('nav.frenchSupport')}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 font-medium">{t('nav.businessHours')}</span>
            <span className="text-gray-400">|</span>
            <span className="text-emerald-600 font-medium">{t('nav.emergency247')}</span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="header" />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium">
              {t('nav.home')}
            </Link>
            <a href="/#services" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium">
              {t('nav.ourServices')}
            </a>
            <a href="/#pricing" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium">
              {t('nav.pricing')}
            </a>
            <Link to="/about" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-medium">
              {t('nav.whoAreWe')}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/verification"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium border border-emerald-200"
            >
              <span>🔍</span>
              <span>{t('nav.freeScan')}</span>
            </Link>

            <Link
              to="/contact"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              {t('nav.contact')}
            </Link>

            <a
              href="https://masecu2025.getscreen.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5"
            >
              <span>🆘</span>
              <span className="hidden sm:inline">{t('nav.needHelp')}</span>
              <span className="sm:hidden">{t('nav.help')}</span>
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
