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

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                {t('nav.ourServices')}
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <a href="/#pricing" className="block px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors">
                    <div className="font-medium">{t('nav.essentialProtection')}</div>
                    <div className="text-sm text-gray-500">{t('nav.essentialProtectionDesc')}</div>
                  </a>
                  <a href="/#pricing" className="block px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors">
                    <div className="font-medium">{t('nav.familyProtection')}</div>
                    <div className="text-sm text-gray-500">{t('nav.familyProtectionDesc')}</div>
                  </a>
                  <a href="/#pricing" className="block px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors">
                    <div className="font-medium">{t('nav.completeProtection')}</div>
                    <div className="text-sm text-gray-500">{t('nav.completeProtectionDesc')}</div>
                  </a>
                  <hr className="my-2 border-gray-100" />
                  <Link to="/verification" className="block px-4 py-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors">
                    <div className="font-medium flex items-center gap-2">
                      <span>🔍</span> {t('nav.checkMyData')}
                    </div>
                    <div className="text-sm text-gray-500">{t('nav.checkMyDataDesc')}</div>
                  </Link>
                </div>
              </div>
            </div>

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
                  <div className="ml-4 mt-2 space-y-1">
                    <a href="/#pricing" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.essentialProtection')}
                    </a>
                    <a href="/#pricing" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.familyProtection')}
                    </a>
                    <a href="/#pricing" className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.completeProtection')}
                    </a>
                    <hr className="my-2 border-gray-100" />
                    <Link to="/verification" className="block px-3 py-2 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      🔍 {t('nav.checkMyData')}
                    </Link>
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
