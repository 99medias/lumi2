export interface FingerprintUniqueness {
  uniquenessScore: number;
  readableScore: string;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
}

export function calculateFingerprintUniqueness(fingerprint: string): FingerprintUniqueness {
  const entropy = fingerprint.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const uniquenessRatio = Math.floor(Math.pow(2, (entropy % 18) + 8));

  let readableScore: string;
  let riskLevel: 'high' | 'medium' | 'low';

  if (uniquenessRatio < 1000) {
    readableScore = `1 sur ${uniquenessRatio}`;
    riskLevel = 'low';
  } else if (uniquenessRatio < 50000) {
    const thousands = Math.floor(uniquenessRatio / 1000);
    readableScore = `1 sur ${thousands},000`;
    riskLevel = 'medium';
  } else {
    const thousands = Math.floor(uniquenessRatio / 1000);
    readableScore = `1 sur ${thousands.toLocaleString()},000`;
    riskLevel = 'high';
  }

  return {
    uniquenessScore: uniquenessRatio,
    readableScore,
    riskLevel,
    description: riskLevel === 'high'
      ? 'Votre empreinte numérique est hautement unique - vous êtes facilement traçable'
      : riskLevel === 'medium'
      ? 'Votre empreinte numérique est assez unique - tracking modéré possible'
      : 'Votre empreinte numérique est relativement commune'
  };
}
