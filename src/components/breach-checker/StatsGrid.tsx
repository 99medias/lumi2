interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
  severity?: 'critical' | 'high' | 'danger' | 'safe' | 'neutral';
  warning?: string;
}

function StatCard({ icon, value, label, severity = 'neutral', warning }: StatCardProps) {
  const severityClasses = {
    critical: 'border-red-300 bg-red-50',
    danger: 'border-red-200 bg-red-50',
    high: 'border-orange-200 bg-orange-50',
    safe: 'border-green-200 bg-green-50',
    neutral: 'border-slate-200 bg-white',
  };

  return (
    <div className={`${severityClasses[severity]} border-2 rounded-xl p-6 text-center`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1 text-slate-900">{value}</div>
      <div className="text-sm text-slate-600 mb-2">{label}</div>
      {warning && <div className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">{warning}</div>}
    </div>
  );
}

interface StatsGridProps {
  breachCount: number;
  passwordCount: number;
  phoneCount: number;
  addressCount: number;
  hasPlaintextPasswords: boolean;
}

export default function StatsGrid({
  breachCount,
  passwordCount,
  phoneCount,
  addressCount,
  hasPlaintextPasswords,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon="📊"
        value={breachCount}
        label="Fuites détectées"
        severity={breachCount > 0 ? 'danger' : 'safe'}
      />
      <StatCard
        icon="🔑"
        value={passwordCount}
        label="Mots de passe exposés"
        severity={hasPlaintextPasswords ? 'critical' : passwordCount > 0 ? 'danger' : 'safe'}
        warning={hasPlaintextPasswords ? 'EN CLAIR!' : undefined}
      />
      <StatCard
        icon="📱"
        value={phoneCount}
        label="Numéros de téléphone"
        severity={phoneCount > 0 ? 'high' : 'neutral'}
      />
      <StatCard
        icon="🏠"
        value={addressCount}
        label="Adresses physiques"
        severity={addressCount > 0 ? 'high' : 'neutral'}
      />
    </div>
  );
}
