import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PricingTier {
  duration: string;
  totalPrice: number;
  monthlyPrice: number;
  isDefault?: boolean;
}

interface ModernPricingCardProps {
  title: string;
  subtitle: string;
  storage: string;
  tiers: PricingTier[];
  features: string[];
  popular?: boolean;
}

function ModernPricingCard({
  title,
  subtitle,
  storage,
  tiers,
  features,
  popular = false
}: ModernPricingCardProps) {
  const { t } = useLanguage();
  const defaultTier = tiers.find(t => t.isDefault) || tiers[0];
  const [selectedTier, setSelectedTier] = useState(defaultTier);

  const borderColor = popular ? 'border-orange-500' : 'border-slate-300';
  const bgColor = popular ? 'bg-gradient-to-br from-orange-50 to-white' : 'bg-white';

  return (
    <div className={`relative rounded-2xl border-2 ${borderColor} shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
      <div className={`flex flex-col items-center py-6 ${popular ? 'bg-orange-500 text-white' : 'bg-white text-slate-800'}`}>
        <h3 className="text-xl font-bold">{title}</h3>
        <span className={`text-sm ${popular ? 'text-orange-100' : 'text-gray-500'}`}>{subtitle}</span>
        {popular && (
          <span className="mt-2 px-3 py-1 bg-white text-orange-500 rounded-full text-xs font-medium">
            {t('pricingCard.popular')}
          </span>
        )}
      </div>

      <div className={`${bgColor} p-8`}>
        <div className="text-center mb-2">
          <div className="text-sm text-slate-600 max-w-xs mx-auto">{storage}</div>
        </div>

      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-orange-600">
            {selectedTier.totalPrice}€
            <span className="text-lg text-slate-600"> {t('pricingCard.priceLabel')}</span>
          </div>
        </div>

        <select
          value={tiers.indexOf(selectedTier)}
          onChange={(e) => setSelectedTier(tiers[parseInt(e.target.value)])}
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl bg-white text-slate-700 font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
        >
          {tiers.map((tier, index) => (
            <option key={index} value={index}>
              {tier.duration} - {tier.totalPrice}€ {t('pricingCard.priceLabel')}
            </option>
          ))}
        </select>

        <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-600 text-center mb-1">{t('pricingCard.monthlyPrice')}</div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-orange-500">{selectedTier.monthlyPrice}€</span>
            <span className="text-sm text-gray-500">/mois</span>
          </div>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-slate-700">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

        <Link
          to="/contact"
          className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
            popular
              ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg'
              : 'bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50'
          }`}
        >
          {t('pricingCard.ctaButton')}
        </Link>
      </div>
    </div>
  );
}

export default ModernPricingCard;
