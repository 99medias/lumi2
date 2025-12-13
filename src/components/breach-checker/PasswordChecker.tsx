import { useState } from 'react';

interface PasswordCheckerProps {
  onCheck: (hash: string) => Promise<any>;
  loading: boolean;
}

export default function PasswordChecker({ onCheck, loading }: PasswordCheckerProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const hashPassword = async (pwd: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const handleCheck = async () => {
    if (!password) {
      setError('Veuillez entrer un mot de passe');
      return;
    }

    try {
      setError('');
      const hash = await hashPassword(password);
      const res = await onCheck(hash);
      setResult(res);
    } catch (err) {
      setError('Erreur lors de la vérification');
    }
  };

  return (
    <div>
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 mb-6">
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-4 text-2xl">🔑</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Entrez un mot de passe à vérifier"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-12 py-4 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-xl text-slate-500 hover:text-slate-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
        >
          {loading ? '⏳ Vérification...' : 'Vérifier ce mot de passe'}
        </button>

        <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="text-sm text-green-700 flex items-center gap-2">
            <span>🔒</span>
            <span>
              Votre mot de passe n'est <strong>jamais envoyé</strong> - nous utilisons un hash sécurisé (k-anonymity)
            </span>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 mb-4">{error}</div>}

      {result && (
        <div
          className={`border-2 rounded-xl p-6 ${
            result.pwned ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}
        >
          {result.pwned ? (
            <>
              <div className="text-3xl mb-3">⚠️</div>
              <h4 className="font-bold text-lg text-red-700 mb-2">Ce mot de passe a été compromis</h4>
              <p className="text-red-600">
                Ce mot de passe a été vu <strong>{result.count.toLocaleString('fr-FR')}</strong> fois dans des fuites de
                données. Nous vous recommandons de changer ce mot de passe immédiatement sur tous les sites où vous
                l'utilisez.
              </p>
            </>
          ) : (
            <>
              <div className="text-3xl mb-3">✅</div>
              <h4 className="font-bold text-lg text-green-700 mb-2">Mot de passe sécurisé</h4>
              <p className="text-green-600">Ce mot de passe n'apparaît dans aucune fuite de données connue.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
