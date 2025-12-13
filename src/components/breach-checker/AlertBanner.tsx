import { AlertOctagon, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface AlertBannerProps {
  severity: 'critical' | 'high' | 'medium' | 'safe';
  title: string;
  subtitle: string;
  breachCount?: number;
  recordCount?: number;
}

export default function AlertBanner({
  severity,
  title,
  subtitle,
  breachCount = 0,
  recordCount = 0,
}: AlertBannerProps) {
  const severityConfig = {
    critical: {
      bg: 'bg-gradient-to-r from-red-600 to-red-700',
      emoji: '🚨',
    },
    high: {
      bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      emoji: '⚠️',
    },
    medium: {
      bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
      emoji: '⚡',
    },
    safe: {
      bg: 'bg-gradient-to-r from-green-500 to-green-600',
      emoji: '✅',
    },
  };

  const config = severityConfig[severity];

  return (
    <div className={`${config.bg} rounded-2xl p-8 mb-8 text-white shadow-xl flex items-center gap-6`}>
      <div className="text-4xl flex-shrink-0">{config.emoji}</div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-white/90">
          {subtitle}
          {breachCount > 0 && (
            <>
              <br />
              <strong>{breachCount}</strong> fuites détectées
              {recordCount > 0 && <> avec <strong>{recordCount}</strong> enregistrements exposés</>}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
