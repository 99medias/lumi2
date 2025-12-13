import { Shield, Lock, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function TrustBadges() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-orange-100">
        <Shield className="w-5 h-5 text-green-600" />
        <div className="text-xs">
          <div className="font-bold text-slate-800">{t('trustBadges.ssl.title')}</div>
          <div className="text-slate-600">{t('trustBadges.ssl.subtitle')}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-orange-100">
        <Lock className="w-5 h-5 text-orange-600" />
        <div className="text-xs">
          <div className="font-bold text-slate-800">{t('trustBadges.gdpr.title')}</div>
          <div className="text-slate-600">{t('trustBadges.gdpr.subtitle')}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-orange-100">
        <Award className="w-5 h-5 text-amber-600" />
        <div className="text-xs">
          <div className="font-bold text-slate-800">{t('trustBadges.certified.title')}</div>
          <div className="text-slate-600">{t('trustBadges.certified.subtitle')}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-orange-100">
        <CheckCircle className="w-5 h-5 text-orange-600" />
        <div className="text-xs">
          <div className="font-bold text-slate-800">{t('trustBadges.guarantee.title')}</div>
          <div className="text-slate-600">{t('trustBadges.guarantee.subtitle')}</div>
        </div>
      </div>
    </div>
  );
}

export default TrustBadges;
