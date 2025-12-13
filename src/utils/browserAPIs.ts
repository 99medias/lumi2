export interface BrowserAPIStatus {
  api: string;
  status: 'exposed' | 'protected' | 'unavailable';
  risk: 'high' | 'medium' | 'low';
  description: string;
}

export function auditBrowserAPIs(): BrowserAPIStatus[] {
  const results: BrowserAPIStatus[] = [];

  if ('clipboard' in navigator) {
    results.push({
      api: 'Clipboard API',
      status: 'exposed',
      risk: 'medium',
      description: 'Les sites peuvent demander l\'accès au presse-papiers'
    });
  }

  if ('geolocation' in navigator) {
    results.push({
      api: 'Géolocalisation',
      status: 'exposed',
      risk: 'high',
      description: 'Votre position géographique peut être demandée'
    });
  }

  if ('mediaDevices' in navigator) {
    results.push({
      api: 'Caméra/Microphone',
      status: 'exposed',
      risk: 'high',
      description: 'Énumération des périphériques média possible'
    });
  }

  if ('DeviceOrientationEvent' in window) {
    results.push({
      api: 'Capteurs de mouvement',
      status: 'exposed',
      risk: 'medium',
      description: 'Le suivi des mouvements de l\'appareil est possible'
    });
  }

  if ('bluetooth' in navigator) {
    results.push({
      api: 'Bluetooth',
      status: 'exposed',
      risk: 'high',
      description: 'Scan des appareils Bluetooth à proximité possible'
    });
  }

  if ('serial' in navigator) {
    results.push({
      api: 'Ports série',
      status: 'exposed',
      risk: 'high',
      description: 'Accès aux ports série matériels possible'
    });
  }

  if ('usb' in navigator) {
    results.push({
      api: 'USB',
      status: 'exposed',
      risk: 'high',
      description: 'Accès aux périphériques USB possible'
    });
  }

  if ('storage' in navigator && 'estimate' in (navigator as any).storage) {
    results.push({
      api: 'Storage Estimation',
      status: 'exposed',
      risk: 'low',
      description: 'Estimation de l\'espace de stockage disponible'
    });
  }

  if ('contacts' in navigator) {
    results.push({
      api: 'Contacts',
      status: 'exposed',
      risk: 'high',
      description: 'Accès potentiel aux contacts de l\'appareil'
    });
  }

  if ('wakeLock' in navigator) {
    results.push({
      api: 'Wake Lock',
      status: 'exposed',
      risk: 'low',
      description: 'Peut empêcher la mise en veille de l\'écran'
    });
  }

  if ('deviceMemory' in navigator) {
    results.push({
      api: 'Device Memory',
      status: 'exposed',
      risk: 'medium',
      description: 'Quantité de RAM détectable pour le fingerprinting'
    });
  }

  if ('connection' in navigator) {
    results.push({
      api: 'Network Information',
      status: 'exposed',
      risk: 'medium',
      description: 'Type de connexion et vitesse réseau détectables'
    });
  }

  return results;
}

export function getAPIsRiskSummary(apis: BrowserAPIStatus[]): {
  high: number;
  medium: number;
  low: number;
  totalExposed: number;
} {
  return {
    high: apis.filter(a => a.risk === 'high' && a.status === 'exposed').length,
    medium: apis.filter(a => a.risk === 'medium' && a.status === 'exposed').length,
    low: apis.filter(a => a.risk === 'low' && a.status === 'exposed').length,
    totalExposed: apis.filter(a => a.status === 'exposed').length
  };
}
