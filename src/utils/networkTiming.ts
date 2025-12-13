export interface NetworkTiming {
  dnsTime: number;
  tlsTime: number;
  ttfb: number;
  downloadTime: number;
  totalTime: number;
  warnings: string[];
  riskLevel: 'high' | 'medium' | 'low';
  metrics: {
    redirectTime: number;
    cacheTime: number;
    requestTime: number;
    responseTime: number;
  };
}

export function analyzeNetworkTiming(): NetworkTiming {
  const warnings: string[] = [];

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    if (!navigation) {
      return {
        dnsTime: 0,
        tlsTime: 0,
        ttfb: 0,
        downloadTime: 0,
        totalTime: 0,
        warnings: ['Impossible de récupérer les métriques de navigation'],
        riskLevel: 'low',
        metrics: {
          redirectTime: 0,
          cacheTime: 0,
          requestTime: 0,
          responseTime: 0
        }
      };
    }

    const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart;
    const tlsTime = navigation.secureConnectionStart > 0
      ? navigation.connectEnd - navigation.secureConnectionStart
      : 0;
    const ttfb = navigation.responseStart - navigation.requestStart;
    const downloadTime = navigation.responseEnd - navigation.responseStart;
    const totalTime = navigation.loadEventEnd - navigation.fetchStart;

    const redirectTime = navigation.redirectEnd - navigation.redirectStart;
    const cacheTime = navigation.domainLookupStart - navigation.fetchStart;
    const requestTime = navigation.responseStart - navigation.requestStart;
    const responseTime = navigation.responseEnd - navigation.responseStart;

    if (dnsTime > 150) {
      warnings.push(`Résolution DNS lente (${Math.round(dnsTime)}ms) - possible problème DNS ou hijacking`);
    }

    if (tlsTime > 250) {
      warnings.push(`Handshake TLS lent (${Math.round(tlsTime)}ms) - chaîne de certificats longue`);
    }

    if (ttfb > 600) {
      warnings.push(`Temps de réponse serveur élevé (${Math.round(ttfb)}ms)`);
    }

    if (navigation.secureConnectionStart === 0 && window.location.protocol === 'https:') {
      warnings.push('Connexion sécurisée non détectée - possible problème SSL');
    }

    if (redirectTime > 100) {
      warnings.push(`Redirections multiples détectées (${Math.round(redirectTime)}ms)`);
    }

    const riskLevel: 'high' | 'medium' | 'low' =
      dnsTime > 200 || ttfb > 800 ? 'high' :
      warnings.length >= 2 ? 'medium' :
      'low';

    return {
      dnsTime: Math.round(dnsTime),
      tlsTime: Math.round(tlsTime),
      ttfb: Math.round(ttfb),
      downloadTime: Math.round(downloadTime),
      totalTime: Math.round(totalTime),
      warnings,
      riskLevel,
      metrics: {
        redirectTime: Math.round(redirectTime),
        cacheTime: Math.round(cacheTime),
        requestTime: Math.round(requestTime),
        responseTime: Math.round(responseTime)
      }
    };
  } catch (error) {
    console.error('Network timing analysis error:', error);
    return {
      dnsTime: 0,
      tlsTime: 0,
      ttfb: 0,
      downloadTime: 0,
      totalTime: 0,
      warnings: ['Erreur lors de l\'analyse du réseau'],
      riskLevel: 'low',
      metrics: {
        redirectTime: 0,
        cacheTime: 0,
        requestTime: 0,
        responseTime: 0
      }
    };
  }
}
