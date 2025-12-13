import { Shield, Lock, Award, CheckCircle, Globe, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TrustSealsProps {
  variant?: 'default' | 'compact' | 'footer';
  showTitle?: boolean;
}

const TrustSeals = ({ variant = 'default', showTitle = true }: TrustSealsProps) => {
  const { t } = useLanguage();

  const seals = [
    {
      icon: Shield,
      name: t('trustSeals.sslSecure'),
      description: t('trustSeals.sslDesc'),
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: ShieldCheck,
      name: t('trustSeals.rgpd'),
      description: t('trustSeals.rgpdDesc'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Lock,
      name: t('trustSeals.iso27001'),
      description: t('trustSeals.iso27001Desc'),
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: Award,
      name: t('trustSeals.soc2'),
      description: t('trustSeals.soc2Desc'),
      color: 'from-amber-500 to-emerald-600'
    },
    {
      icon: CheckCircle,
      name: t('trustSeals.pciDss'),
      description: t('trustSeals.pciDssDesc'),
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Globe,
      name: t('trustSeals.protection247'),
      description: t('trustSeals.protection247Desc'),
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6">
        {seals.slice(0, 4).map((seal, index) => (
          <div key={index} className="flex items-center gap-2 text-slate-600">
            <div className={`w-8 h-8 bg-gradient-to-br ${seal.color} rounded-lg flex items-center justify-center`}>
              <seal.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">{seal.name}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {seals.map((seal, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${seal.color} rounded-xl flex items-center justify-center mb-2 shadow-lg`}>
              <seal.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs font-semibold text-slate-300">{seal.name}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('trustSeals.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {t('trustSeals.subtitle')}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seals.map((seal, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${seal.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <seal.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{seal.name}</h3>
                  <p className="text-sm text-slate-400">{seal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-emerald-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {t('trustSeals.guaranteeTitle')}
                </h3>
                <p className="text-slate-400">
                  {t('trustSeals.guaranteeDesc')}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                ))}
              </div>
              <p className="text-green-400 font-semibold text-sm">{t('trustSeals.protectionActive')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {t('trustSeals.certificationText')}
            <br />
            {t('trustSeals.privacyText')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSeals;
