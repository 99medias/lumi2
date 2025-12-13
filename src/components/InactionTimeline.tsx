import { Link } from 'react-router-dom';

interface InactionTimelineProps {
  threats: number;
}

function InactionTimeline({ threats }: InactionTimelineProps) {
  const events = [
    {
      time: 'Maintenant',
      title: 'Menaces actives sur votre PC',
      description: `${threats} processus malveillants en cours d'exécution`,
      severity: 'warning' as const
    },
    {
      time: '1 heure',
      title: 'Mots de passe potentiellement compromis',
      description: 'Keylogger actif - Tous vos mots de passe à risque',
      severity: 'high' as const
    },
    {
      time: '24 heures',
      title: 'Données personnelles possiblement volées',
      description: 'Documents, photos et fichiers sensibles exposés',
      severity: 'high' as const
    },
    {
      time: '1 semaine',
      title: 'Risque élevé de ransomware',
      description: 'Tous vos fichiers pourraient être chiffrés contre rançon',
      severity: 'critical' as const
    },
    {
      time: '1 mois',
      title: 'Identité possiblement usurpée',
      description: 'Vos données vendues sur le dark web - Fraude bancaire possible',
      severity: 'critical' as const
    },
  ];

  return (
    <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-8 border border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
        <span className="text-3xl">⚠️</span>
        Si vous ne faites rien...
      </h3>
      <p className="text-slate-400 mb-8">Voici ce qui risque d'arriver à votre système</p>

      <div className="relative">
        <div className="absolute left-[6.5rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500 via-emerald-500 to-red-500"></div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center gap-6 animate-fade-in"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="w-24 text-right">
                <span className={`font-mono font-bold text-sm ${
                  event.severity === 'critical' ? 'text-red-400' :
                  event.severity === 'high' ? 'text-emerald-400' : 'text-yellow-400'
                }`}>
                  {event.time}
                </span>
              </div>

              <div className={`w-4 h-4 rounded-full border-4 border-slate-800 z-10 shadow-lg ${
                event.severity === 'critical' ? 'bg-red-500 shadow-red-500/50 animate-pulse' :
                event.severity === 'high' ? 'bg-emerald-500 shadow-emerald-500/50' :
                'bg-yellow-500 shadow-yellow-500/50'
              }`}></div>

              <div className={`flex-1 rounded-xl p-4 border ${
                event.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                event.severity === 'high' ? 'bg-emerald-500/10 border-emerald-500/30' :
                'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                <p className={`font-semibold ${
                  event.severity === 'critical' ? 'text-red-200' :
                  event.severity === 'high' ? 'text-emerald-200' : 'text-yellow-200'
                }`}>
                  {event.title}
                </p>
                <p className={`text-sm mt-1 ${
                  event.severity === 'critical' ? 'text-red-200/60' :
                  event.severity === 'high' ? 'text-emerald-200/60' : 'text-yellow-200/60'
                }`}>
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gradient-to-r from-red-600/20 to-emerald-600/20 border border-red-500/50 rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🛡️</span>
            <div>
              <p className="text-white font-bold">Évitez ce scénario catastrophe</p>
              <p className="text-slate-400 text-sm">Protection complète en moins de 30 minutes</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
          >
            Protéger maintenant →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InactionTimeline;
