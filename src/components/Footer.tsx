import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from './Logo';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Logo variant="footer" />
            <p className="text-slate-400 mt-6 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">{t('footer.services')}</h4>
            <ul className="space-y-3">
              <li><a href="/#services" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.cloudServer')}</a></li>
              <li><a href="/#services" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.securitySuite')}</a></li>
              <li><a href="/#services" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.support')}</a></li>
              <li><a href="/#services" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.identityProtection')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">{t('footer.information')}</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.about')}</Link></li>
              <li><a href="/#pricing" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.pricing')}</a></li>
              <li><a href="/#faq" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.faq')}</a></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              <li><Link to="/legal/legal-notice" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.legalNotice')}</Link></li>
              <li><Link to="/legal/privacy-policy" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/legal/terms" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/legal/cookie-policy" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.cookiePolicy')}</Link></li>
              <li><Link to="/legal/refund-policy" className="text-slate-400 hover:text-orange-400 transition-colors">{t('footer.refundPolicy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 MySafeSecurity. {t('footer.rights')}
            </p>
            <div className="flex gap-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400 transition-colors">
                Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400 transition-colors">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-orange-400 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
