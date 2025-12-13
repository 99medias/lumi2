import { Lock, CheckCircle2, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PaymentBadgesProps {
  variant?: 'compact' | 'full';
  title?: string;
}

const paymentMethods = [
  {
    name: 'Bancontact',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Bancontact_logo_2021.svg/langfr-250px-Bancontact_logo_2021.svg.png'
  },
  {
    name: 'Visa',
    logo: 'https://cdn.worldvectorlogo.com/logos/visa-2.svg'
  },
  {
    name: 'Mastercard',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
  },
  {
    name: 'Maestro',
    logo: 'https://cdn.worldvectorlogo.com/logos/maestro-2.svg'
  },
  {
    name: 'PayPal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg'
  }
];

export default function PaymentBadges({ variant = 'full', title }: PaymentBadgesProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <h3 className="text-lg font-semibold text-gray-800">{title || t('paymentBadges.title')}</h3>

      <div className="flex items-center gap-6 flex-wrap justify-center">
        {paymentMethods.map((method) => (
          <div
            key={method.name}
            className="h-10 w-auto px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <img
              src={method.logo}
              alt={method.name}
              className="h-6 w-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {variant === 'full' && (
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-500" />
            <span>{t('paymentBadges.sslEncrypted')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>{t('paymentBadges.gdprCompliant')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>{t('paymentBadges.satisfaction')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
