export function maskEmail(email: string): string {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!domain) return email.slice(0, 3) + '***';
  const domainParts = domain.split('.');
  return `${user.slice(0, 3)}***@${domainParts[0].slice(0, 3)}***.${domainParts.slice(1).join('.')}`;
}

export function maskPassword(password: string): string {
  if (!password) return '';
  if (password.length <= 4) return '****';
  return password.slice(0, 2) + '*'.repeat(Math.min(password.length - 4, 8)) + password.slice(-2);
}

export function maskPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 8) return '***' + cleaned.slice(-4);
  return cleaned.slice(0, 4) + '****' + cleaned.slice(-4);
}

export function translateField(field: string): string {
  const translations: Record<string, string> = {
    username: "Nom d'utilisateur",
    password: 'Mot de passe',
    first_name: 'Prénom',
    last_name: 'Nom de famille',
    name: 'Nom complet',
    email: 'E-mail',
    phone: 'Téléphone',
    address: 'Adresse',
    dob: 'Date de naissance',
    zip: 'Code postal',
    ip: 'Adresse IP',
    hash: 'Hash de mot de passe',
  };
  return translations[field] || field.replace('_', ' ');
}

export function getFieldIcon(field: string): string {
  const icons: Record<string, string> = {
    username: '👤',
    password: '🔑',
    first_name: '🏷️',
    last_name: '🏷️',
    name: '🏷️',
    email: '📧',
    phone: '📱',
    address: '🏠',
    dob: '🎂',
    zip: '📍',
    ip: '🌐',
    hash: '🔐',
  };
  return icons[field] || '📋';
}

export function getFieldSeverity(field: string): string {
  const critical = ['password', 'hash'];
  const high = ['phone', 'address', 'dob', 'ssn', 'credit_card'];
  const medium = ['username', 'first_name', 'last_name', 'name', 'ip'];

  if (critical.includes(field)) return 'critical';
  if (high.includes(field)) return 'high';
  if (medium.includes(field)) return 'medium';
  return 'low';
}

export function formatBreachDate(dateStr: string): string {
  if (!dateStr) return 'Date inconnue';
  const [year, month] = dateStr.split('-');
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];
  const monthIndex = parseInt(month) - 1;
  const monthName = months[monthIndex] || '';
  return monthName ? `${monthName} ${year}` : year;
}
