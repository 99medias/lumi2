import { translateDataClass, getDataClassSeverity, formatNumber } from '../../utils/datamasking';

interface Breach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  PwnCount: number;
  DataClasses: string[];
  IsVerified: boolean;
}

interface BreachResultsProps {
  breaches: Breach[];
}

export default function BreachResults({ breaches }: BreachResultsProps) {
  if (!breaches || breaches.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-2xl font-bold text-slate-900">📋 Détail des fuites de données</h3>
        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          {breaches.length} services compromis
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breaches.map((breach, index) => (
          <div key={index} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h4 className="font-bold text-lg text-slate-900 mb-1">{breach.Title}</h4>
              <span className="text-sm text-slate-500">
                {new Date(breach.BreachDate).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Comptes affectés</div>
              <div className="text-2xl font-bold text-orange-600">{formatNumber(breach.PwnCount)}</div>
            </div>

            <div>
              <div className="text-sm text-slate-600 mb-2 font-semibold">Données exposées :</div>
              <div className="flex flex-wrap gap-2">
                {breach.DataClasses.map((dataClass, i) => {
                  const severity = getDataClassSeverity(dataClass);
                  const severityClasses = {
                    critical: 'bg-red-100 text-red-700 border-red-200',
                    high: 'bg-orange-100 text-orange-700 border-orange-200',
                    medium: 'bg-amber-100 text-amber-700 border-amber-200',
                  };

                  return (
                    <span
                      key={i}
                      className={`text-xs font-medium px-3 py-1 rounded-full border ${severityClasses[severity]}`}
                    >
                      {translateDataClass(dataClass)}
                    </span>
                  );
                })}
              </div>
            </div>

            {breach.IsVerified && (
              <div className="mt-4 text-xs text-green-600 flex items-center gap-1">
                <span>✓</span> Fuite vérifiée
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
