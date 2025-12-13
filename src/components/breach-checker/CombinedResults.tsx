import { useState } from 'react';
import { translateDataClass, getDataClassSeverity, formatNumber } from '../../utils/datamasking';

interface LeakCheckEntry {
  source: string;
  breachDate: string | null;
  email: string;
  password: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  dob: string | null;
  fields: string[];
}

interface LeakCheckResult {
  success: boolean;
  found: number;
  quota: number;
  entries: LeakCheckEntry[];
}

interface Breach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  PwnCount: number;
  DataClasses: string[];
  IsVerified: boolean;
}

interface CombinedResultsProps {
  hibpBreaches: Breach[];
  leakCheckData: LeakCheckResult | null;
  email: string;
}

function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name}***@${domain}`;
  return `${name.substring(0, 2)}***@${domain}`;
}

function maskPassword(password: string): string {
  if (!password) return '';
  if (password.length <= 3) return '***';
  return `${password.substring(0, 2)}***${password.substring(password.length - 1)}`;
}

function maskPhone(phone: string): string {
  if (!phone) return '';
  if (phone.length <= 3) return '***';
  return `**${phone.substring(phone.length - 4)}`;
}

function formatBreachDate(dateStr: string): string {
  if (!dateStr) return 'Date inconnue';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
    });
  } catch {
    return dateStr;
  }
}

function getFieldIcon(field: string): string {
  const icons: Record<string, string> = {
    email: '📧',
    password: '🔑',
    username: '👤',
    phone: '📱',
    address: '🏠',
    dob: '📅',
    name: '🏷️',
    ip: '🌐',
  };
  return icons[field.toLowerCase()] || '📋';
}

function getFieldSeverity(field: string): string {
  const critical = ['password'];
  const high = ['phone', 'address', 'dob', 'email'];
  const medium = ['username', 'name'];
  const low = ['ip'];

  if (critical.some(f => field.toLowerCase().includes(f))) return 'critical';
  if (high.some(f => field.toLowerCase().includes(f))) return 'high';
  if (medium.some(f => field.toLowerCase().includes(f))) return 'medium';
  return 'low';
}

export default function CombinedResults({
  hibpBreaches,
  leakCheckData,
  email,
}: CombinedResultsProps) {
  const [expandedLeakCheck, setExpandedLeakCheck] = useState(false);
  const [expandedHIBP, setExpandedHIBP] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());

  const hibpCount = hibpBreaches?.length || 0;
  const leakCheckCount = leakCheckData?.found || 0;
  const passwordCount = leakCheckData?.entries?.filter(e => e.password).length || 0;

  if (hibpCount === 0 && leakCheckCount === 0) return null;

  const leakCheckEntries = leakCheckData?.entries || [];
  const displayedLeakCheckEntries = expandedLeakCheck ? leakCheckEntries : leakCheckEntries.slice(0, 5);
  const displayedHIBPBreaches = expandedHIBP ? hibpBreaches : hibpBreaches.slice(0, 5);

  const toggleEntryExpanded = (idx: number) => {
    const newSet = new Set(expandedEntries);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedEntries(newSet);
  };

  return (
    <div className="space-y-6 w-full" style={{ width: '100%' }}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`bg-white rounded-xl p-4 md:p-6 text-center border-2 ${hibpCount > 0 ? 'border-red-200 bg-gradient-to-b from-white to-red-50' : 'border-green-200 bg-gradient-to-b from-white to-green-50'}`}>
          <div className="text-xl md:text-2xl mb-2">📊</div>
          <div className={`text-2xl md:text-3xl font-bold ${hibpCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {hibpCount}
          </div>
          <div className="text-xs md:text-sm text-slate-600 mt-1">Fuites détectées</div>
          <div className="text-xs text-slate-500 mt-2">HIBP</div>
        </div>

        <div className={`bg-white rounded-xl p-4 md:p-6 text-center border-2 ${passwordCount > 0 ? 'border-red-600 bg-gradient-to-b from-red-600 to-red-500 text-white' : 'border-green-200 bg-gradient-to-b from-white to-green-50'}`}>
          <div className="text-xl md:text-2xl mb-2">🔑</div>
          <div className="text-2xl md:text-3xl font-bold">
            {passwordCount}
          </div>
          <div className={`text-xs md:text-sm mt-1 ${passwordCount > 0 ? 'text-white' : 'text-slate-600'}`}>
            Mots de passe</div>
          {passwordCount > 0 && (
            <div className="text-xs mt-2 bg-white/20 px-2 py-1 rounded-full inline-block">
              EN CLAIR
            </div>
          )}
        </div>

        <div className={`bg-white rounded-xl p-4 md:p-6 text-center border-2 border-slate-200`}>
          <div className="text-xl md:text-2xl mb-2">📱</div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">
            {leakCheckData?.entries?.filter(e => e.phone)?.length || 0}
          </div>
          <div className="text-xs md:text-sm text-slate-600 mt-1">Téléphones</div>
          <div className="text-xs text-slate-500 mt-2">LeakCheck</div>
        </div>

        <div className={`bg-white rounded-xl p-4 md:p-6 text-center border-2 border-slate-200`}>
          <div className="text-xl md:text-2xl mb-2">🏠</div>
          <div className="text-2xl md:text-3xl font-bold text-slate-900">
            {leakCheckData?.entries?.filter(e => e.address)?.length || 0}
          </div>
          <div className="text-xs md:text-sm text-slate-600 mt-1">Adresses</div>
          <div className="text-xs text-slate-500 mt-2">LeakCheck</div>
        </div>
      </div>

      {/* Main Alert */}
      {(hibpCount > 0 || leakCheckCount > 0) && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white flex gap-6">
          <div className="text-3xl flex-shrink-0 bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center">
            ⚠️
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">
              Votre adresse a été trouvée dans {hibpCount} fuite(s)
            </h2>
            <p className="text-white/90 leading-relaxed">
              Votre adresse e-mail {maskEmail(email)} apparaît dans des fuites de données.<br />
              <strong>{hibpCount}</strong> fuites détectées • <strong>{leakCheckCount}</strong> enregistrements Dark Web
              {passwordCount > 0 && <> • <strong>{passwordCount}</strong> mots de passe exposés</>}
            </p>
          </div>
        </div>
      )}

      {/* Side by Side Results */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '24px',
        width: '100%',
        minWidth: '100%'
      }} className="w-full">
        {/* LeakCheck Column */}
        <div style={{
          flex: '1 1 50%',
          minWidth: '50%',
          maxWidth: '50%'
        }} className="bg-white rounded-2xl border-t-4 border-red-600 p-6 shadow-lg">
          <div className="mb-6 pb-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🔓</span>
              <h3 className="text-xl font-bold text-slate-900">Dark Web Results</h3>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                {leakCheckCount} enregistrements
              </span>
              {passwordCount > 0 && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {passwordCount} mots de passe
                </span>
              )}
            </div>
            <div className="text-xs text-slate-600">
              Crédits restants: {leakCheckData?.quota || 0}
            </div>
          </div>

          {/* Exposed Fields */}
          {leakCheckData?.entries?.length > 0 && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Données exposées</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(leakCheckData.entries.flatMap(e => e.fields || []))).map((field, i) => (
                  <span key={i} className={`text-xs font-semibold px-3 py-1 rounded-full
                    ${getFieldSeverity(field) === 'critical' ? 'bg-red-100 text-red-700' : ''}
                    ${getFieldSeverity(field) === 'high' ? 'bg-orange-100 text-orange-700' : ''}
                    ${getFieldSeverity(field) === 'medium' ? 'bg-amber-100 text-amber-700' : ''}
                    ${getFieldSeverity(field) === 'low' ? 'bg-slate-200 text-slate-700' : ''}
                  `}>
                    {getFieldIcon(field)} {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayedLeakCheckEntries.length > 0 ? (
              displayedLeakCheckEntries.map((entry, idx) => {
                const isExpanded = expandedEntries.has(idx);
                return (
                  <div
                    key={idx}
                    className={`border rounded-lg overflow-hidden ${
                      entry.password ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'
                    }`}
                  >
                    <button
                      onClick={() => toggleEntryExpanded(idx)}
                      className="w-full flex items-start justify-between p-4 hover:opacity-75 transition text-left"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{entry.source}</div>
                        {entry.breachDate && (
                          <div className="text-xs text-slate-600">{formatBreachDate(entry.breachDate)}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          entry.password ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                        }`}>
                          {entry.password ? 'CRITIQUE' : 'EXPOSÉ'}
                        </span>
                        <span className="text-slate-600">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-slate-200 bg-white/40">
                        <div className="space-y-2 text-sm pt-3">
                          {entry.email && (
                            <div className="flex gap-2">
                              <span className="text-slate-600 w-16">📧</span>
                              <span className="font-mono bg-white px-2 py-1 rounded">{maskEmail(entry.email)}</span>
                            </div>
                          )}
                          {entry.password && (
                            <div className="flex gap-2">
                              <span className="text-slate-600 w-16">🔑</span>
                              <span className="font-mono bg-red-600 text-white px-2 py-1 rounded">{maskPassword(entry.password)}</span>
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">EN CLAIR</span>
                            </div>
                          )}
                          {entry.username && (
                            <div className="flex gap-2">
                              <span className="text-slate-600 w-16">👤</span>
                              <span className="font-mono bg-white px-2 py-1 rounded">{entry.username}</span>
                            </div>
                          )}
                          {entry.phone && (
                            <div className="flex gap-2">
                              <span className="text-slate-600 w-16">📱</span>
                              <span className="font-mono bg-white px-2 py-1 rounded">{maskPhone(entry.phone)}</span>
                            </div>
                          )}
                          {(entry.firstName || entry.lastName || entry.name) && (
                            <div className="flex gap-2">
                              <span className="text-slate-600 w-16">🏷️</span>
                              <span className="font-mono bg-white px-2 py-1 rounded">
                                {entry.name || `${entry.firstName || ''} ${entry.lastName || ''}`.trim()}
                              </span>
                            </div>
                          )}
                        </div>

                        {entry.password && (
                          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
                            ⚠️ Changez ce mot de passe immédiatement
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-600">
                ✅ Aucun identifiant trouvé sur le Dark Web
              </div>
            )}
          </div>

          {leakCheckEntries.length > 5 && !expandedLeakCheck && (
            <button
              onClick={() => setExpandedLeakCheck(true)}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-700 transition"
            >
              Voir {leakCheckEntries.length - 5} enregistrements de plus
            </button>
          )}

          <div className="mt-4 pt-4 border-t text-xs text-slate-600 text-center">
            Powered by <a href="https://leakcheck.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LeakCheck</a>
          </div>
        </div>

        {/* HIBP Column */}
        <div style={{
          flex: '1 1 50%',
          minWidth: '50%',
          maxWidth: '50%'
        }} className="bg-white rounded-2xl border-t-4 border-amber-500 p-6 shadow-lg">
          <div className="mb-6 pb-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📋</span>
              <h3 className="text-xl font-bold text-slate-900">Détail des fuites</h3>
            </div>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
              {hibpCount} services compromis
            </span>
          </div>

          {/* Breaches */}
          <div className="space-y-3">
            {displayedHIBPBreaches.length > 0 ? (
              displayedHIBPBreaches.map((breach, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{breach.Title}</h4>
                      <p className="text-xs text-slate-600">
                        {new Date(breach.BreachDate).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                    {breach.IsVerified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                        ✓ Vérifié
                      </span>
                    )}
                  </div>

                  <div className="mb-3 bg-slate-50 rounded p-2 text-sm">
                    <div className="text-slate-600 text-xs">Comptes affectés</div>
                    <div className="font-bold text-orange-600">{formatNumber(breach.PwnCount)}</div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 font-semibold block mb-2">Données exposées :</label>
                    <div className="flex flex-wrap gap-2">
                      {breach.DataClasses.map((dataClass, i) => {
                        const severity = getDataClassSeverity(dataClass);
                        return (
                          <span
                            key={i}
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              severity === 'critical' ? 'bg-red-100 text-red-700' : ''
                            }${severity === 'high' ? 'bg-orange-100 text-orange-700' : ''}${
                              severity === 'medium' ? 'bg-amber-100 text-amber-700' : ''
                            }${severity === 'low' ? 'bg-slate-200 text-slate-700' : ''}`}
                          >
                            {translateDataClass(dataClass)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-600">
                ✅ Aucune fuite détectée
              </div>
            )}
          </div>

          {hibpBreaches.length > 5 && !expandedHIBP && (
            <button
              onClick={() => setExpandedHIBP(true)}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-700 transition"
            >
              Voir {hibpBreaches.length - 5} fuites de plus
            </button>
          )}

          <div className="mt-4 pt-4 border-t text-xs text-slate-600 text-center">
            Powered by <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Have I Been Pwned</a>
          </div>
        </div>
      </div>
    </div>
  );
}
