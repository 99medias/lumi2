import { useEffect, useState } from 'react';
import { Globe, MapPin, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface IPData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  org: string;
}

const IPDetector = () => {
  const { t } = useLanguage();
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setIpData(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">{t('ipDetector.loading')}</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !ipData) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">{t('ipDetector.error.title')}</h3>
        </div>
        <p className="text-slate-300 mb-4">
          {t('ipDetector.error.message')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{t('ipDetector.main.title')}</h3>
            <p className="text-red-300 text-sm">{t('ipDetector.main.subtitle')}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-red-400" />
              <span className="text-slate-400 text-sm font-medium">{t('ipDetector.labels.ipAddress')}</span>
            </div>
            <p className="text-2xl font-bold text-white font-mono">{ipData.ip}</p>
            <p className="text-slate-500 text-xs mt-2">{t('ipDetector.labels.ipHelper')}</p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-red-400" />
              <span className="text-slate-400 text-sm font-medium">{t('ipDetector.labels.location')}</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {ipData.city}, {ipData.country_name}
            </p>
            <p className="text-slate-500 text-xs mt-2">{ipData.region}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <p className="text-slate-400 text-sm mb-2">{t('ipDetector.labels.isp')}</p>
          <p className="text-lg font-semibold text-white">{ipData.org || t('ipDetector.labels.notAvailable')}</p>
        </div>

        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-amber-200 font-semibold mb-1">{t('ipDetector.warning.title')}</p>
              <ul className="text-slate-300 text-sm space-y-1">
                {(t('ipDetector.warning.items') as string[]).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPDetector;
