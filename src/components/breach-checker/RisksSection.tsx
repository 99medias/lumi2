export default function RisksSection() {
  const risks = [
    { icon: '🔓', title: 'Accès à vos comptes', desc: 'Les pirates testent automatiquement vos identifiants sur des centaines de sites.' },
    { icon: '💳', title: 'Fraude financière', desc: 'Achats frauduleux, virements, demandes de crédit en votre nom.' },
    { icon: '🎭', title: "Usurpation d'identité", desc: 'Création de faux profils, arnaques à vos proches, chantage.' },
    { icon: '📧', title: 'Phishing ciblé', desc: 'E-mails frauduleux personnalisés avec vos vraies informations.' },
    { icon: '📱', title: 'Harcèlement téléphonique', desc: 'Appels de démarchage, arnaques au faux support technique.' },
    { icon: '🏠', title: 'Risques physiques', desc: 'Votre adresse peut être utilisée pour du vol ou du harcèlement.' },
  ];

  return (
    <section className="my-12">
      <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
        🎯 Ce que les pirates peuvent faire avec vos données
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {risks.map((risk, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-3">{risk.icon}</div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">{risk.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{risk.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
