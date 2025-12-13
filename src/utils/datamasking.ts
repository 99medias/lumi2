export function maskEmail(email: string | null | undefined): string {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email;
  const domainParts = domain.split('.');
  return `${user.slice(0, 3)}***@${domainParts[0].slice(0, 3)}***.${domainParts.slice(1).join('.')}`;
}

export function maskPassword(password: string | null | undefined): string {
  if (!password) return '';
  if (password.length <= 4) return '****';
  return password.slice(0, 2) + '*'.repeat(Math.max(1, password.length - 4)) + password.slice(-2);
}

export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 8) return '***' + cleaned.slice(-4);
  return cleaned.slice(0, 4) + '****' + cleaned.slice(-4);
}

export function maskName(name: string | null | undefined): string {
  if (!name) return '';
  return name.split(' ').map((part) => (part ? part[0] + '***' : '***')).join(' ');
}

export function maskAddress(address: string | null | undefined): string {
  if (!address) return '';
  if (address.length <= 15) return address.slice(0, 8) + '***';
  return address.slice(0, 12) + '***' + (address.length > 25 ? ', ' + address.slice(-5) : '');
}

export function calculateDataValue(hibpData: any[] = [], dehashedData: any[] = []): string {
  let value = 0;

  if (hibpData.length > 0) {
    value += 1;
  }

  const hasPasswords = dehashedData.some((r) => r.password);
  if (hasPasswords) {
    value += 50;
  }

  const hasPhone = dehashedData.some((r) => r.phone);
  if (hasPhone) {
    value += 30;
  }

  const hasAddress = dehashedData.some((r) => r.address);
  if (hasAddress) {
    value += 25;
  }

  const hasUsername = dehashedData.some((r) => r.username);
  if (hasUsername) {
    value += 10;
  }

  return value.toLocaleString('fr-FR');
}

export function calculateSeverity(data: {
  breaches: number;
  plaintextPasswords: boolean;
  personalInfo: boolean;
}): 'critical' | 'high' | 'medium' | 'safe' {
  if (data.plaintextPasswords) return 'critical';
  if (data.breaches > 5 || data.personalInfo) return 'high';
  if (data.breaches > 0) return 'medium';
  return 'safe';
}

export function formatNumber(num: number): string {
  return num.toLocaleString('fr-FR');
}

export function translateDataClass(dataClass: string): string {
  const translations: Record<string, string> = {
    'Email addresses': 'Adresses e-mail',
    Passwords: 'Mots de passe',
    Usernames: "Noms d'utilisateur",
    Names: 'Noms',
    'Phone numbers': 'Numéros de téléphone',
    'Physical addresses': 'Adresses physiques',
    'IP addresses': 'Adresses IP',
    'Dates of birth': 'Dates de naissance',
    'Credit cards': 'Cartes de crédit',
    'Bank account numbers': 'Numéros de compte bancaire',
    'Social security numbers': 'Numéros de sécurité sociale',
    Genders: 'Genres',
    Employers: 'Employeurs',
    'Job titles': 'Titres de poste',
    'Geographic locations': 'Localisations géographiques',
  };
  return translations[dataClass] || dataClass;
}

export function getDataClassSeverity(dataClass: string): string {
  const criticalClasses = ['Passwords', 'Credit cards', 'Bank account numbers', 'Social security numbers'];
  const highClasses = ['Email addresses', 'Phone numbers', 'Physical addresses', 'Names', 'Dates of birth'];

  if (criticalClasses.includes(dataClass)) return 'critical';
  if (highClasses.includes(dataClass)) return 'high';
  return 'medium';
}
