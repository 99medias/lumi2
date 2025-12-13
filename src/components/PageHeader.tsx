import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';

interface PageHeaderProps {
  showLanguageSelector?: boolean;
}

const PageHeader = ({ showLanguageSelector = true }: PageHeaderProps) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center transition-all duration-300 hover:scale-105">
            <Logo variant="header" />
          </Link>

          <div className="flex items-center gap-4">
            <ul className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 lg:gap-6 items-center absolute md:relative top-full left-0 right-0 md:top-0 bg-white md:bg-transparent p-6 md:p-0 shadow-lg md:shadow-none`}>
              <li><Link to="/" className="text-slate-700 hover:text-emerald-500 font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">{t('nav.home')}</Link></li>
              <li><a href="/#services" className="text-slate-700 hover:text-emerald-500 font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">{t('nav.services')}</a></li>
              <li><a href="/#pricing" className="text-slate-700 hover:text-emerald-500 font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">{t('nav.pricing')}</a></li>
              <li><a href="/#features" className="text-slate-700 hover:text-emerald-500 font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">{t('nav.features')}</a></li>
              <li><Link to="/analyse-rapide" className="text-slate-700 hover:text-emerald-500 font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">{t('nav.quickAnalysis')}</Link></li>
              <li><Link to="/about" className="text-slate-700 hover:text-emerald-500 font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-slate-700 hover:text-emerald-500 font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap">{t('nav.contact')}</Link></li>
              <li><a href="https://masecu2025.getscreen.me/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-full font-bold hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl transform whitespace-nowrap">{t('nav.quickSupport')}</a></li>
            </ul>

            {showLanguageSelector && (
              <div className="hidden md:block">
                <LanguageSelector />
              </div>
            )}

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              <div className="w-6 h-0.5 bg-emerald-600 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-emerald-600 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-emerald-600"></div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default PageHeader;
