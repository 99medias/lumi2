export interface ConnectionSecurity {
  protocol: string;
  secure: boolean;
  warnings: string[];
  isSecureContext: boolean;
  mixedContent: boolean;
  riskLevel: 'high' | 'medium' | 'low';
}

export function checkConnectionSecurity(): ConnectionSecurity {
  const warnings: string[] = [];
  const protocol = window.location.protocol;
  const isSecureContext = window.isSecureContext;

  if (protocol !== 'https:') {
    warnings.push('Connexion non chiffrée - vos données peuvent être interceptées');
  }

  if (!isSecureContext) {
    warnings.push('Contexte non sécurisé - certaines APIs sont restreintes');
  }

  let mixedContent = false;
  try {
    if (document.referrer) {
      const referrerURL = new URL(document.referrer);
      if (referrerURL.protocol === 'http:' && protocol === 'https:') {
        warnings.push('Provient d\'une page non sécurisée');
        mixedContent = true;
      }
    }
  } catch (e) {
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  resources.forEach(resource => {
    try {
      const url = new URL(resource.name);
      if (url.protocol === 'http:' && protocol === 'https:') {
        if (!mixedContent) {
          warnings.push('Contenu mixte détecté - ressources HTTP sur page HTTPS');
          mixedContent = true;
        }
      }
    } catch (e) {
    }
  });

  if (protocol === 'https:' && !('crypto' in window)) {
    warnings.push('API de chiffrement non disponible');
  }

  const riskLevel: 'high' | 'medium' | 'low' =
    protocol !== 'https:' ? 'high' :
    mixedContent || !isSecureContext ? 'medium' :
    'low';

  return {
    protocol,
    secure: warnings.length === 0,
    warnings,
    isSecureContext,
    mixedContent,
    riskLevel
  };
}
