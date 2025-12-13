import { Check, TrendingUp, Clock, Gift, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingTier {
  duration: number;
  monthlyPrice: number;
  totalPrice: number;
  bonusMonths?: number;
  savings?: number;
}

interface PricingCardProps {
  name: string;
  tiers: PricingTier[];
  features: string[];
  color: 'sky' | 'amber' | 'teal' | 'orange';
  popular?: boolean;
  bestValue?: boolean;
}

const colorClasses = {
  sky: {
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-500/10 to-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500',
    hover: 'hover:border-emerald-400'
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    border: 'border-amber-500/50',
    bg: 'from-amber-500/10 to-emerald-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500',
    hover: 'hover:border-amber-400'
  },
  teal: {
    gradient: 'from-emerald-500 to-emerald-600',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-500/10 to-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500',
    hover: 'hover:border-emerald-400'
  },
  orange: {
    gradient: 'from-emerald-500 to-red-600',
    border: 'border-emerald-500/50',
    bg: 'from-emerald-500/10 to-red-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500',
    hover: 'hover:border-emerald-400'
  }
};

function PricingCard({ name, tiers, features, color, popular = false, bestValue = false }: PricingCardProps) {
  const colors = colorClasses[color];
  const sortedTiers = [...tiers].sort((a, b) => b.duration - a.duration);
  const bestTier = sortedTiers[0];

  const calculateSavingsPercentage = (tier: PricingTier) => {
    const shortestTier = tiers.reduce((min, t) => t.duration < min.duration ? t : min);
    const regularTotal = shortestTier.monthlyPrice * tier.duration;
    const savings = ((regularTotal - tier.totalPrice) / regularTotal) * 100;
    return Math.round(savings);
  };

  return (
    <div className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm border-2 ${colors.border} rounded-3xl p-8 relative overflow-hidden transition-all duration-300 ${colors.hover} hover:shadow-2xl hover:shadow-${color}-500/20`}>
      {(popular || bestValue) && (
        <div className="absolute top-0 right-0">
          <div className={`${popular ? 'bg-[#f97316]' : 'bg-purple-500'} text-white px-6 py-2 text-sm font-bold rounded-bl-2xl flex items-center gap-2`}>
            {popular && <TrendingUp className="w-4 h-4" />}
            {popular ? 'PLUS POPULAIRE' : 'MEILLEURE VALEUR'}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-2">{name}</h3>
        {bestTier.savings && (
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold text-sm">
              ÉCONOMISEZ JUSQU'À {bestTier.savings}€
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {sortedTiers.map((tier, index) => {
          const savingsPercent = calculateSavingsPercentage(tier);
          const isRecommended = index === 0;

          return (
            <div
              key={tier.duration}
              className={`bg-slate-800/70 backdrop-blur-sm border-2 ${isRecommended ? colors.border : 'border-slate-700'} rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer group relative`}
            >
              {isRecommended && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${colors.badge} text-white px-4 py-1 text-xs font-bold rounded-full flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" />
                  RECOMMANDÉ
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-emerald-500">{tier.monthlyPrice.toFixed(2)}€</span>
                    <span className="text-sm text-gray-500">/mois</span>
                  </div>
                  <div className="text-base text-slate-200 mt-2 font-semibold">
                    {tier.duration} mois / {tier.totalPrice.toFixed(2)}€ HT
                  </div>
                </div>

                {savingsPercent > 0 && (
                  <div className={`${colors.text} font-bold text-right`}>
                    <div className="text-2xl">-{savingsPercent}%</div>
                    <div className="text-xs">économie</div>
                  </div>
                )}
              </div>

              {tier.bonusMonths && tier.bonusMonths > 0 && (
                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg px-3 py-2 flex items-center gap-2 mt-3">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold text-sm">
                    + {tier.bonusMonths} mois offerts
                  </span>
                </div>
              )}

              <Link
                to="/contact"
                className={`block w-full text-center mt-4 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:-translate-y-1`}
              >
                Commander maintenant
              </Link>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-700 pt-6 mb-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Check className={`w-5 h-5 ${colors.text}`} />
          Tout inclus :
        </h4>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-200">
              <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-bold text-sm mb-1">
              Offre limitée - Agissez maintenant !
            </p>
            <p className="text-slate-400 text-xs">
              Les prix peuvent augmenter à tout moment. Garantie satisfait ou remboursé 30 jours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingCard;
