import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface SimplePricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  ctaLink: string;
  color?: 'violet' | 'emerald' | 'sky' | 'amber' | 'teal' | 'orange';
}

const colorClasses = {
  violet: {
    gradient: 'from-violet-500 to-violet-600',
    border: 'border-violet-500/50',
    bg: 'from-violet-500/10 to-purple-500/10',
    text: 'text-violet-400',
    hover: 'hover:border-violet-400',
    button: 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-violet-500/50'
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-500/10 to-emerald-500/10',
    text: 'text-emerald-400',
    hover: 'hover:border-emerald-400',
    button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/50'
  },
  sky: {
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-500/10 to-emerald-500/10',
    text: 'text-emerald-400',
    hover: 'hover:border-emerald-400',
    button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/50'
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    border: 'border-amber-500/50',
    bg: 'from-amber-500/10 to-emerald-500/10',
    text: 'text-amber-400',
    hover: 'hover:border-amber-400',
    button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/50'
  },
  teal: {
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-500/10 to-emerald-500/10',
    text: 'text-emerald-400',
    hover: 'hover:border-emerald-400',
    button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/50'
  },
  orange: {
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-500/10 to-red-500/10',
    text: 'text-emerald-400',
    hover: 'hover:border-emerald-400',
    button: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/50'
  }
};

const SimplePricingCard = ({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  ctaText,
  ctaLink,
  color = 'violet'
}: SimplePricingCardProps) => {
  const colors = colorClasses[color];
  const { t } = useLanguage();

  return (
    <div className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-lg border-2 ${colors.border} ${colors.hover} rounded-3xl p-8 shadow-xl transition-all duration-300 ${highlighted ? 'scale-105' : ''}`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className={`bg-gradient-to-r ${colors.gradient} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg`}>
            {t('pricing.recommended')}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-3">{name}</h3>
        <p className="text-slate-300 text-sm mb-6">{description}</p>

        <div className="mb-6 flex items-baseline justify-center gap-1">
          <span className="text-2xl font-bold text-emerald-500">{price}€</span>
          <span className="text-sm text-gray-500">{period}</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className={`w-6 h-6 ${colors.text} flex-shrink-0 mt-0.5`} />
            <span className="text-slate-200">{feature}</span>
          </div>
        ))}
      </div>

      <Link
        to={ctaLink}
        className={`block w-full text-center py-4 ${colors.button} text-white rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
      >
        {ctaText}
      </Link>
    </div>
  );
};

export default SimplePricingCard;
