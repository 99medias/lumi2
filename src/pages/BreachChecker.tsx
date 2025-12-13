import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Search, Eye, EyeOff, AlertTriangle, CheckCircle, ExternalLink, Shield, Calendar, Users, Globe, FileWarning, Phone, CreditCard, Key, MapPin, Fingerprint, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

type TabType = 'email' | 'password' | 'darkweb';

interface PasswordResult {
  pwned: boolean;
  count: number;
}

interface BreachData {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  AddedDate: string;
  ModifiedDate: string;
  PwnCount: number;
  Description: string;
  LogoPath: string;
  DataClasses: string[];
  IsVerified: boolean;
  IsFabricated: boolean;
  IsSensitive: boolean;
  IsRetired: boolean;
  IsSpamList: boolean;
  IsMalware: boolean;
  IsSubscriptionFree: boolean;
  IsStealerLog: boolean;
}

interface EmailResult {
  found: boolean;
  breaches: BreachData[];
  totalBreaches?: number;
  totalExposedRecords?: number;
}

interface DehashedResult {
  found: boolean;
  records?: Array<{
    email?: string;
    username?: string;
    password?: string;
    name?: string;
    phone?: string;
    address?: string;
    source?: string;
  }>;
  count?: number;
}

const dataClassTranslations: Record<string, string> = {
  'Email addresses': 'Adresses e-mail',
  'Passwords': 'Mots de passe',
  'Usernames': 'Noms d\'utilisateur',
  'Names': 'Noms complets',
  'Phone numbers': 'Numéros de téléphone',
  'Physical addresses': 'Adresses postales',
  'Dates of birth': 'Dates de naissance',
  'IP addresses': 'Adresses IP',
  'Credit cards': 'Cartes bancaires',
  'Bank account numbers': 'Numéros de compte bancaire',
  'Social security numbers': 'Numéros de sécurité sociale',
  'Employers': 'Employeurs',
  'Job titles': 'Postes occupés',
  'Genders': 'Genres',
  'Locations': 'Localisations',
  'Geographic locations': 'Localisations géographiques',
  'Biometric data': 'Données biométriques',
  'Browser user agent details': 'Données de navigation',
  'Device information': 'Informations appareil',
  'Purchases': 'Historique d\'achats',
  'Payment histories': 'Historique de paiements',
  'Passport numbers': 'Numéros de passeport',
  'National IDs': 'Numéros d\'identité nationale',
  'Driver\'s licenses': 'Permis de conduire',
  'Security questions and answers': 'Questions de sécurité',
  'Security questions': 'Questions de sécurité',
  'Auth tokens': 'Jetons d\'authentification',
  'Education levels': 'Niveaux d\'éducation',
  'Family members\' names': 'Noms de famille',
  'Chat logs': 'Historique de conversations',
  'Private messages': 'Messages privés',
  'Photos': 'Photos',
  'Profile photos': 'Photos de profil',
  'Sexual preferences': 'Préférences personnelles',
  'Health records': 'Dossiers médicaux',
  'Income levels': 'Niveaux de revenus',
  'Government issued IDs': 'Documents d\'identité',
  'Ethnicities': 'Origines ethniques',
  'Religions': 'Religions',
  'Political views': 'Opinions politiques',
  'Password hints': 'Indices de mot de passe',
  'Website activity': 'Activité sur le site',
  'Age groups': 'Tranches d\'âge',
  'Avatars': 'Avatars',
  'Time zones': 'Fuseaux horaires',
  'Bios': 'Biographies',
  'Partial credit card data': 'Données bancaires partielles',
  'Personal descriptions': 'Descriptions personnelles',
  'Email messages': 'Messages email',
  'Homepage URLs': 'URLs de page d\'accueil',
  'Instant messenger identities': 'Identifiants de messagerie',
  'Spoken languages': 'Langues parlées',
  'Professional skills': 'Compétences professionnelles',
  'Years of professional experience': 'Années d\'expérience',
  'Living status': 'Situation de vie',
  'Family structure': 'Structure familiale',
  'Relationship statuses': 'Statuts relationnels',
  'Smoking habits': 'Habitudes tabagiques',
  'Drinking habits': 'Habitudes de consommation d\'alcool',
  'Vehicle details': 'Détails du véhicule',
  'Astrological signs': 'Signes astrologiques',
  'Personal interests': 'Intérêts personnels',
  'Marital statuses': 'Statuts matrimoniaux',
  'Occupations': 'Professions',
  'Physical attributes': 'Attributs physiques',
  'Reward program balances': 'Soldes de programmes de fidélité',
  'Travel habits': 'Habitudes de voyage',
  'Work habits': 'Habitudes de travail',
  'Races': 'Origines',
  'Clothing sizes': 'Tailles de vêtements',
  'Social connections': 'Connexions sociales',
  'MAC addresses': 'Adresses MAC',
  'IMEI numbers': 'Numéros IMEI',
  'IMSI numbers': 'Numéros IMSI',
};

const dataClassSeverity: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
  'Passwords': 'critical',
  'Credit cards': 'critical',
  'Bank account numbers': 'critical',
  'Social security numbers': 'critical',
  'Passport numbers': 'critical',
  'National IDs': 'critical',
  'Health records': 'critical',
  'Biometric data': 'critical',
  'Government issued IDs': 'critical',
  'Driver\'s licenses': 'critical',
  'Partial credit card data': 'critical',
  'Email addresses': 'high',
  'Phone numbers': 'high',
  'Physical addresses': 'high',
  'Dates of birth': 'high',
  'Security questions and answers': 'high',
  'Security questions': 'high',
  'Auth tokens': 'high',
  'Password hints': 'high',
  'Private messages': 'high',
  'Email messages': 'high',
  'Payment histories': 'high',
  'Names': 'medium',
  'Usernames': 'medium',
  'IP addresses': 'medium',
  'Employers': 'medium',
  'Locations': 'medium',
  'Geographic locations': 'medium',
  'Job titles': 'medium',
  'Income levels': 'medium',
  'Purchases': 'medium',
  'Website activity': 'medium',
  'Chat logs': 'medium',
  'Genders': 'low',
  'Photos': 'low',
  'Profile photos': 'low',
  'Education levels': 'low',
  'Avatars': 'low',
  'Time zones': 'low',
  'Bios': 'low',
  'Personal descriptions': 'low',
  'Spoken languages': 'low',
  'Personal interests': 'low',
  'Astrological signs': 'low',
};

const dataClassIcons: Record<string, string> = {
  'Email addresses': 'email',
  'Passwords': 'key',
  'Names': 'user',
  'Phone numbers': 'phone',
  'Physical addresses': 'location',
  'Dates of birth': 'calendar',
  'Credit cards': 'credit',
  'Bank account numbers': 'credit',
  'IP addresses': 'globe',
  'Locations': 'location',
  'Geographic locations': 'location',
  'Photos': 'photo',
  'Profile photos': 'photo',
  'Usernames': 'user',
  'Biometric data': 'fingerprint',
  'Social security numbers': 'id',
  'Passport numbers': 'id',
  'Government issued IDs': 'id',
  'National IDs': 'id',
  'Driver\'s licenses': 'id',
};

async function checkPassword(password: string): Promise<PasswordResult> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const text = await response.text();

  const lines = text.split('\n');
  for (const line of lines) {
    const [hashSuffix, count] = line.split(':');
    if (hashSuffix.trim() === suffix) {
      return { pwned: true, count: parseInt(count.trim()) };
    }
  }
  return { pwned: false, count: 0 };
}

async function checkEmailBreach(email: string): Promise<EmailResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(`${supabaseUrl}/functions/v1/check-email-breach`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to check email');
  }

  return response.json();
}

async function checkDehashedBreach(email: string): Promise<DehashedResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const response = await fetch(`${supabaseUrl}/functions/v1/dehashed-checker`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Failed to check dark web');
  }

  return response.json();
}

function BreachChecker() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordResult, setPasswordResult] = useState<PasswordResult | null>(null);
  const [emailResult, setEmailResult] = useState<EmailResult | null>(null);
  const [dehashedResult, setDehashedResult] = useState<DehashedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordCheck = async () => {
    if (!password.trim()) return;

    setLoading(true);
    setError(null);
    setPasswordResult(null);

    try {
      const result = await checkPassword(password);
      setPasswordResult(result);
    } catch {
      setError(t('breachChecker.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailCheck = async () => {
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setEmailResult(null);

    try {
      const result = await checkEmailBreach(email);
      setEmailResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('breachChecker.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDehashedCheck = async () => {
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setDehashedResult(null);

    try {
      const result = await checkDehashedBreach(email);
      setDehashedResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('breachChecker.error'));
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + ' Mrd';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + ' M';
    if (num >= 1000) return (num / 1000).toFixed(1) + ' K';
    return num.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US');
  };

  const formatDateFr = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (language === 'fr') {
      const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const translateDataClass = (dataClass: string): string => {
    if (language !== 'fr') return dataClass;
    return dataClassTranslations[dataClass] || dataClass;
  };

  const getDataClassSeverity = (dataClass: string): 'critical' | 'high' | 'medium' | 'low' => {
    return dataClassSeverity[dataClass] || 'low';
  };

  const getDataIcon = (dataClass: string) => {
    const iconType = dataClassIcons[dataClass] || 'default';
    const iconClass = "w-3.5 h-3.5";

    switch (iconType) {
      case 'email': return <Mail className={iconClass} />;
      case 'key': return <Key className={iconClass} />;
      case 'user': return <Users className={iconClass} />;
      case 'phone': return <Phone className={iconClass} />;
      case 'location': return <MapPin className={iconClass} />;
      case 'calendar': return <Calendar className={iconClass} />;
      case 'credit': return <CreditCard className={iconClass} />;
      case 'globe': return <Globe className={iconClass} />;
      case 'fingerprint': return <Fingerprint className={iconClass} />;
      case 'id': return <Shield className={iconClass} />;
      default: return <FileWarning className={iconClass} />;
    }
  };

  const getBreachSeverity = (breach: BreachData): 'critical' | 'high' | 'medium' | 'low' => {
    const criticalData = ['Passwords', 'Credit cards', 'Bank account numbers', 'Social security numbers', 'Passport numbers', 'National IDs', 'Health records', 'Biometric data'];
    const highData = ['Email addresses', 'Phone numbers', 'Physical addresses', 'Dates of birth', 'Security questions and answers', 'Auth tokens'];

    if (breach.DataClasses.some(d => criticalData.includes(d))) return 'critical';
    if (breach.DataClasses.some(d => highData.includes(d))) return 'high';
    return 'medium';
  };

  const getSeverityLabel = (severity: string): string => {
    const labels: Record<string, Record<string, string>> = {
      fr: { critical: 'CRITIQUE', high: 'ELEVE', medium: 'MODERE', low: 'FAIBLE' },
      en: { critical: 'CRITICAL', high: 'HIGH', medium: 'MODERATE', low: 'LOW' },
      es: { critical: 'CRITICO', high: 'ALTO', medium: 'MODERADO', low: 'BAJO' },
    };
    return labels[language]?.[severity] || labels.en[severity];
  };

  const hasHighRiskData = (breach: BreachData): boolean => {
    const highRisk = ['Passwords', 'Credit cards', 'Bank account numbers', 'Social security numbers', 'Passport numbers', 'Biometric data', 'Health records'];
    return breach.DataClasses.some(d => highRisk.includes(d));
  };

  const hasPasswordsExposed = (breaches: BreachData[]): boolean => {
    return breaches.some(b => b.DataClasses.includes('Passwords'));
  };

  const hasFinancialData = (breaches: BreachData[]): boolean => {
    const financial = ['Credit cards', 'Bank account numbers', 'Partial credit card data', 'Payment histories'];
    return breaches.some(b => b.DataClasses.some(d => financial.includes(d)));
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          badge: 'bg-red-600 text-white',
          tag: 'bg-red-50 text-red-700 border border-red-200',
        };
      case 'high':
        return {
          badge: 'bg-emerald-500 text-white',
          tag: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        };
      case 'medium':
        return {
          badge: 'bg-amber-500 text-white',
          tag: 'bg-amber-50 text-amber-700 border border-amber-200',
        };
      default:
        return {
          badge: 'bg-slate-400 text-white',
          tag: 'bg-slate-100 text-slate-600 border border-slate-200',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl mb-6 shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              {t('breachChecker.title')}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('breachChecker.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-3 border-b border-slate-100">
              <button
                onClick={() => { setActiveTab('email'); setPasswordResult(null); setEmailResult(null); setDehashedResult(null); setError(null); }}
                className={`flex items-center justify-center gap-2 py-5 px-4 font-semibold transition-all duration-300 ${
                  activeTab === 'email'
                    ? 'text-emerald-500 bg-emerald-50 border-b-4 border-emerald-500'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Mail className="w-5 h-5" />
                <span className="hidden xs:inline text-sm">{t('breachChecker.tabs.email')}</span>
              </button>
              <button
                onClick={() => { setActiveTab('password'); setPasswordResult(null); setEmailResult(null); setDehashedResult(null); setError(null); }}
                className={`flex items-center justify-center gap-2 py-5 px-4 font-semibold transition-all duration-300 ${
                  activeTab === 'password'
                    ? 'text-emerald-500 bg-emerald-50 border-b-4 border-emerald-500'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="hidden xs:inline text-sm">{t('breachChecker.tabs.password')}</span>
              </button>
              <button
                onClick={() => { setActiveTab('darkweb'); setPasswordResult(null); setEmailResult(null); setDehashedResult(null); setError(null); }}
                className={`flex items-center justify-center gap-2 py-5 px-4 font-semibold transition-all duration-300 ${
                  activeTab === 'darkweb'
                    ? 'text-emerald-500 bg-emerald-50 border-b-4 border-emerald-500'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="hidden xs:inline text-sm">{language === 'fr' ? 'Dark Web' : 'Dark Web'}</span>
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'email' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t('breachChecker.emailChecker.label')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('breachChecker.emailChecker.placeholder')}
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-700"
                        onKeyDown={(e) => e.key === 'Enter' && handleEmailCheck()}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleEmailCheck}
                    disabled={loading || !email.trim()}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('breachChecker.loading')}
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        {t('breachChecker.emailChecker.button')}
                      </>
                    )}
                  </button>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-emerald-800 text-sm">
                        {t('breachChecker.emailChecker.privacy')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'password' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t('breachChecker.passwordChecker.label')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('breachChecker.passwordChecker.placeholder')}
                        className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-700"
                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordCheck()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePasswordCheck}
                    disabled={loading || !password.trim()}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('breachChecker.loading')}
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        {t('breachChecker.passwordChecker.button')}
                      </>
                    )}
                  </button>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-emerald-800 text-sm">
                        {t('breachChecker.passwordChecker.privacy')}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {language === 'fr' ? 'Adresse Email' : 'Email Address'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={language === 'fr' ? 'votre@email.com' : 'your@email.com'}
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-slate-700"
                        onKeyDown={(e) => e.key === 'Enter' && handleDehashedCheck()}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleDehashedCheck}
                    disabled={loading || !email.trim()}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('breachChecker.loading')}
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        {language === 'fr' ? 'Rechercher' : 'Search'}
                      </>
                    )}
                  </button>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-emerald-800 text-sm">
                        {language === 'fr'
                          ? 'Vérifiez si vos données circulent sur le dark web en utilisant la base de données Dehashed.'
                          : 'Check if your data is circulating on the dark web using the Dehashed database.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {emailResult && (
                <div className="mt-8 space-y-6 animate-fade-in">
                  {emailResult.found && emailResult.breaches.length > 0 ? (
                    <>
                      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

                        <div className="relative">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                              <AlertOctagon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                {language === 'fr' ? 'ALERTE SÉCURITÉ : Vos données sont compromises !' : 'SECURITY ALERT: Your data has been compromised!'}
                              </h3>
                              <p className="text-red-100 text-lg">
                                {language === 'fr'
                                  ? `Votre adresse e-mail a été trouvée dans ${emailResult.totalBreaches} fuite(s) de données.`
                                  : `Your email address was found in ${emailResult.totalBreaches} data breach(es).`}
                              </p>
                              <p className="text-red-200 mt-2">
                                {language === 'fr'
                                  ? 'Des cybercriminels ont potentiellement accès à vos informations personnelles.'
                                  : 'Cybercriminals may have access to your personal information.'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold">{emailResult.totalBreaches}</div>
                              <div className="text-red-200 text-sm mt-1">
                                {language === 'fr' ? 'Fuites détectées' : 'Breaches detected'}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold">
                                {formatNumber(emailResult.totalExposedRecords || 0)}
                              </div>
                              <div className="text-red-200 text-sm mt-1">
                                {language === 'fr' ? 'Comptes exposés' : 'Exposed accounts'}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold">
                                {hasPasswordsExposed(emailResult.breaches)
                                  ? (language === 'fr' ? 'OUI' : 'YES')
                                  : (language === 'fr' ? 'NON' : 'NO')}
                              </div>
                              <div className="text-red-200 text-sm mt-1">
                                {language === 'fr' ? 'Mots de passe' : 'Passwords exposed'}
                              </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                              <div className="text-3xl font-bold">
                                {hasFinancialData(emailResult.breaches)
                                  ? (language === 'fr' ? 'OUI' : 'YES')
                                  : (language === 'fr' ? 'NON' : 'NO')}
                              </div>
                              <div className="text-red-200 text-sm mt-1">
                                {language === 'fr' ? 'Données bancaires' : 'Financial data'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          <FileWarning className="w-6 h-6 text-red-500" />
                          {language === 'fr' ? 'Détails des fuites de données' : 'Breach Details'}
                        </h4>

                        {emailResult.breaches.map((breach, index) => {
                          const severity = getBreachSeverity(breach);
                          const severityStyles = getSeverityStyles(severity);

                          return (
                            <div
                              key={breach.Name}
                              className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden hover:border-red-200 transition-all duration-300 hover:shadow-lg hover:shadow-red-100"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                  <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                      {breach.LogoPath ? (
                                        <img
                                          src={breach.LogoPath.startsWith('http') ? breach.LogoPath : `https://haveibeenpwned.com/Content/Images/PwnedLogos/${breach.LogoPath}`}
                                          alt={breach.Title}
                                          className="w-12 h-12 object-contain"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center"><span class="text-slate-500 font-bold text-xl">' + breach.Title.charAt(0) + '</span></div>';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                                          <span className="text-slate-500 font-bold text-xl">{breach.Title.charAt(0)}</span>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h5 className="text-xl font-bold text-slate-800">{breach.Title}</h5>
                                        {breach.IsVerified && (
                                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            {language === 'fr' ? 'Vérifié' : 'Verified'}
                                          </span>
                                        )}
                                        {breach.IsMalware && (
                                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                                            Malware
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                        <span className="flex items-center gap-1">
                                          <Globe className="w-4 h-4" />
                                          {breach.Domain || 'N/A'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-4 h-4" />
                                          {formatDateFr(breach.BreachDate)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Users className="w-4 h-4" />
                                          {formatNumber(breach.PwnCount)} {language === 'fr' ? 'comptes' : 'accounts'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${severityStyles.badge} flex-shrink-0`}>
                                    {getSeverityLabel(severity)}
                                  </span>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                  <p className="text-slate-700 text-sm">
                                    <strong>{language === 'fr' ? 'Ce qui s\'est passé :' : 'What happened:'}</strong>{' '}
                                    {language === 'fr'
                                      ? `Le ${formatDateFr(breach.BreachDate)}, une fuite de données chez ${breach.Title} a exposé les informations de ${formatNumber(breach.PwnCount)} utilisateurs, dont potentiellement les vôtres.`
                                      : `On ${formatDateFr(breach.BreachDate)}, a data breach at ${breach.Title} exposed the information of ${formatNumber(breach.PwnCount)} users, potentially including yours.`}
                                  </p>
                                </div>

                                <div className="mb-4">
                                  <p className="text-sm font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {language === 'fr' ? 'Vos données exposées :' : 'Your exposed data:'}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {breach.DataClasses.map((dataClass) => {
                                      const tagSeverity = getDataClassSeverity(dataClass);
                                      const tagStyles = getSeverityStyles(tagSeverity);
                                      return (
                                        <span
                                          key={dataClass}
                                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${tagStyles.tag}`}
                                        >
                                          {getDataIcon(dataClass)}
                                          {translateDataClass(dataClass)}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                                {hasHighRiskData(breach) && (
                                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-red-800 font-semibold text-sm">
                                        {language === 'fr' ? 'Risque élevé détecté' : 'High risk detected'}
                                      </p>
                                      <p className="text-red-700 text-sm mt-1">
                                        {language === 'fr'
                                          ? 'Cette fuite contient des données sensibles (mots de passe, données personnelles). Changez immédiatement vos identifiants sur ce site et tous les sites où vous utilisez le même mot de passe.'
                                          : 'This breach contains sensitive data (passwords, personal data). Change your credentials immediately on this site and all sites where you use the same password.'}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
                                  {breach.Domain && (
                                    <a
                                      href={`https://${breach.Domain}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      {language === 'fr' ? `Visiter ${breach.Domain}` : `Visit ${breach.Domain}`}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full translate-y-24 -translate-x-24" />

                        <div className="relative">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                              <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white">
                                {language === 'fr' ? 'Protégez-vous immédiatement' : 'Protect yourself immediately'}
                              </h3>
                              <p className="text-slate-400">
                                {language === 'fr'
                                  ? 'Vos données circulent sur le dark web. Nos experts peuvent vous aider.'
                                  : 'Your data is circulating on the dark web. Our experts can help.'}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 text-slate-300">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <span>{language === 'fr' ? 'Surveiller vos données 24h/24' : 'Monitor your data 24/7'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <span>{language === 'fr' ? 'Alerter en cas de nouvelle fuite' : 'Alert on new breaches'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <span>{language === 'fr' ? 'Sécuriser tous vos comptes' : 'Secure all your accounts'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <span>{language === 'fr' ? 'Supprimer vos données exposées' : 'Remove your exposed data'}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            <Link
                              to="/#pricing"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                            >
                              {language === 'fr' ? 'Voir nos offres de protection' : 'View protection plans'}
                            </Link>
                            <a
                              href="tel:0189712866"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                            >
                              <Phone className="w-5 h-5" />
                              {language === 'fr' ? 'Parler a un expert' : 'Talk to an expert'}
                            </a>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {language === 'fr' ? 'Bonne nouvelle !' : 'Good news!'}
                          </h3>
                          <p className="text-emerald-100 text-lg">
                            {language === 'fr'
                              ? 'Votre adresse e-mail n\'a été trouvée dans aucune fuite de données connue.'
                              : 'Your email address was not found in any known data breaches.'}
                          </p>
                          <p className="text-emerald-200 mt-2">
                            {language === 'fr'
                              ? 'Nous vous recommandons néanmoins de rester vigilant et de vérifier régulièrement.'
                              : 'We still recommend staying vigilant and checking regularly.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {dehashedResult && (
                <div className="mt-8 space-y-6 animate-fade-in">
                  {dehashedResult.found && dehashedResult.records && dehashedResult.records.length > 0 ? (
                    <>
                      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

                        <div className="relative">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                              <AlertOctagon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                {language === 'fr' ? 'Alerte Dark Web' : 'Dark Web Alert'}
                              </h3>
                              <p className="text-red-100 text-lg">
                                {language === 'fr'
                                  ? `Vos données ont été trouvées sur le dark web (${dehashedResult.count} occurrence${dehashedResult.count !== 1 ? 's' : ''}).`
                                  : `Your data was found on the dark web (${dehashedResult.count} occurrence${dehashedResult.count !== 1 ? 's' : ''}).`}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-3xl font-bold mb-2">{dehashedResult.count}</div>
                            <div className="text-red-200">
                              {language === 'fr' ? 'Résultat(s) sur le dark web' : 'Result(s) on the dark web'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                          <FileWarning className="w-6 h-6 text-red-500" />
                          {language === 'fr' ? 'Informations trouvées' : 'Found Information'}
                        </h4>

                        {dehashedResult.records.map((record, index) => (
                          <div
                            key={index}
                            className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-red-200 transition-all duration-300 hover:shadow-lg hover:shadow-red-100"
                          >
                            <div className="space-y-3">
                              {record.email && (
                                <div className="flex items-start justify-between">
                                  <span className="text-slate-600 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {language === 'fr' ? 'Email' : 'Email'}
                                  </span>
                                  <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded text-slate-700">{record.email}</span>
                                </div>
                              )}
                              {record.username && (
                                <div className="flex items-start justify-between">
                                  <span className="text-slate-600 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {language === 'fr' ? 'Utilisateur' : 'Username'}
                                  </span>
                                  <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded text-slate-700">{record.username}</span>
                                </div>
                              )}
                              {record.password && (
                                <div className="flex items-start justify-between bg-red-50 -mx-6 px-6 py-3 border-t border-red-100">
                                  <span className="text-red-600 font-semibold flex items-center gap-2">
                                    <Key className="w-4 h-4" />
                                    {language === 'fr' ? 'Mot de passe' : 'Password'}
                                  </span>
                                  <span className="font-mono text-sm bg-red-100 px-3 py-1 rounded text-red-700">●●●●●●●●</span>
                                </div>
                              )}
                              {record.name && (
                                <div className="flex items-start justify-between">
                                  <span className="text-slate-600 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    {language === 'fr' ? 'Nom' : 'Name'}
                                  </span>
                                  <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded text-slate-700">{record.name}</span>
                                </div>
                              )}
                              {record.phone && (
                                <div className="flex items-start justify-between">
                                  <span className="text-slate-600 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {language === 'fr' ? 'Téléphone' : 'Phone'}
                                  </span>
                                  <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded text-slate-700">{record.phone}</span>
                                </div>
                              )}
                              {record.address && (
                                <div className="flex items-start justify-between">
                                  <span className="text-slate-600 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {language === 'fr' ? 'Adresse' : 'Address'}
                                  </span>
                                  <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded text-slate-700">{record.address}</span>
                                </div>
                              )}
                              {record.source && (
                                <div className="flex items-start justify-between border-t border-slate-200 pt-3 mt-3">
                                  <span className="text-slate-600 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    {language === 'fr' ? 'Source' : 'Source'}
                                  </span>
                                  <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded text-slate-700">{record.source}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 font-semibold text-sm">
                            {language === 'fr' ? 'Action recommandée' : 'Recommended Action'}
                          </p>
                          <p className="text-red-700 text-sm mt-1">
                            {language === 'fr'
                              ? 'Vos données personnelles circulent sur le dark web. Nous vous recommandons de changer immédiatement tous vos mots de passe et de contacter nos experts.'
                              : 'Your personal data is circulating on the dark web. We recommend immediately changing all your passwords and contacting our experts.'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {language === 'fr' ? 'Pas de données trouvées' : 'No data found'}
                          </h3>
                          <p className="text-emerald-100 text-lg">
                            {language === 'fr'
                              ? 'Bonne nouvelle! Vos données n\'ont pas été trouvées sur le dark web.'
                              : 'Good news! Your data was not found on the dark web.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {passwordResult && (
                <div className="mt-8 space-y-6 animate-fade-in">
                  {passwordResult.pwned ? (
                    <>
                      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                            <AlertTriangle className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">
                              {t('breachChecker.results.passwordPwned.title')}
                            </h3>
                            <p className="text-red-100">
                              {t('breachChecker.results.passwordPwned.text')}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-600">{t('breachChecker.results.passwordPwned.foundCount')}</span>
                          <span className="text-2xl font-bold text-red-600">
                            {formatNumber(passwordResult.count)} {t('breachChecker.results.passwordPwned.times')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-slate-200">
                          <span className="text-slate-600">{t('breachChecker.results.passwordPwned.riskLevel')}</span>
                          <span className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="font-bold text-red-600">{t('breachChecker.results.passwordPwned.critical')}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                          <span className="text-slate-600">{t('breachChecker.results.passwordPwned.recommendation')}</span>
                          <span className="font-bold text-emerald-600">{t('breachChecker.results.passwordPwned.changeNow')}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {t('breachChecker.results.passwordSafe.title')}
                          </h3>
                          <p className="text-emerald-100">
                            {t('breachChecker.results.passwordSafe.text')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-800 rounded-2xl p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {t('breachChecker.cta.title')}
                        </h3>
                        <p className="text-slate-300 mb-4">
                          {t('breachChecker.cta.text')}
                        </p>
                        <Link
                          to="/#pricing"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30"
                        >
                          {t('breachChecker.cta.button')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              {t('breachChecker.attribution')}{' '}
              <a
                href="https://haveibeenpwned.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500 hover:text-emerald-600 font-medium inline-flex items-center gap-1"
              >
                Have I Been Pwned
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default BreachChecker;
