interface DarkWebPricesProps {
  estimatedValue: string;
}

export default function DarkWebPrices({ estimatedValue }: DarkWebPricesProps) {
  const prices = [
    { type: 'Identifiants e-mail', price: '0,50 € - 5 €' },
    { type: 'Compte bancaire', price: '50 € - 500 €' },
    { type: 'Carte de crédit', price: '5 € - 110 €' },
    { type: 'Identité complète', price: '30 € - 100 €' },
    { type: 'Dossier médical', price: '250 € - 1000 €' },
  ];

  return (
    <section className="my-12 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
        💰 Valeur de vos données sur le Dark Web
      </h3>
      <div className="space-y-3 mb-6">
        {prices.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border border-red-100">
            <span className="font-medium text-slate-900">{item.type}</span>
            <span className="font-bold text-red-600">{item.price}</span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
        <div className="text-sm text-red-800 font-semibold mb-1">Valeur estimée de vos données</div>
        <div className="text-3xl font-bold text-red-600">{estimatedValue} €</div>
      </div>
    </section>
  );
}
