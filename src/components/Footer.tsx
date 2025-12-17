import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, Shield, Lock, Facebook, Linkedin, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePhoneByLocation } from '../hooks/usePhoneByLocation';
import { formatPhoneForTel } from '../utils/phoneNumber';
import Logo from './Logo';

const Footer = () => {
  const { t } = useLanguage();
  const { phoneInfo } = usePhoneByLocation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 - Brand & Contact */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo variant="footer" />
              <p className="text-sm text-gray-500 mt-2">{t('footer.tagline')}</p>
            </div>

            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {phoneInfo && (
                <a
                  href={`tel:${formatPhoneForTel(phoneInfo)}`}
                  className="flex items-center gap-3 text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span className="font-medium">{phoneInfo.localNumber}</span>
                </a>
              )}
              <a
                href="mailto:info@masecurite.net"
                className="flex items-center gap-3 text-gray-300 hover:text-emerald-400 transition-colors"
              >
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </span>
                <span>info@masecurite.net</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-sm">{t('footer.hours')}</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">{t('footer.services')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="/#pricing" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.essentialProtection')}
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.familyProtection')}
                </a>
              </li>
              <li>
                <a href="/#pricing" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.completeProtection')}
                </a>
              </li>
              <li>
                <Link to="/analyse-rapide" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.freeDiagnostic')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.emergencySupport')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Information */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">{t('footer.information')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <a href="/#pricing" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.pricing')}
                </a>
              </li>
              <li>
                <a href="/#faq" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal & Trust */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/legal/legal-notice" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.legalNotice')}
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy-policy" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/legal/cookie-policy" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.cookiePolicy')}
                </Link>
              </li>
              <li>
                <Link to="/legal/refund-policy" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  {t('footer.refundPolicy')}
                </Link>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>{t('footer.securePayment')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>{t('footer.gdprProtected')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Methods & Social */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-gray-500 text-sm">{t('footer.acceptedPayments')}</span>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300 font-medium">Bancontact</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300">Visa</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300">Mastercard</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-sm text-gray-300">PayPal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">{t('footer.followUs')}</span>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright & Belgian Identity */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">

            {/* Copyright */}
            <div className="text-gray-500 text-center md:text-left">
              <span>© 2025 MaSécurité SRL · {t('footer.rights')}</span>
            </div>

            {/* Made in Belgium */}
            <div className="flex items-center gap-2 text-gray-400">
              <span>🇧🇪</span>
              <span>{t('footer.proudlyBelgian')}</span>
              <span className="text-emerald-500">❤️</span>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
