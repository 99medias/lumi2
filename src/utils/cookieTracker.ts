export interface TrackerInfo {
  name: string;
  type: 'analytics' | 'advertising' | 'social' | 'functional';
  risk: 'low' | 'medium' | 'high';
  description: string;
}

export interface CookieAnalysis {
  totalCookies: number;
  trackingCookies: number;
  thirdPartyCookies: number;
  localStorageItems: number;
  sessionStorageItems: number;
  trackers: TrackerInfo[];
  privacyScore: number;
  dataCollectionRisk: 'low' | 'medium' | 'high';
}

const knownTrackers: Record<string, TrackerInfo> = {
  '_ga': { name: 'Google Analytics', type: 'analytics', risk: 'medium', description: 'Suit votre navigation sur le site' },
  '_gid': { name: 'Google Analytics', type: 'analytics', risk: 'medium', description: 'Identifiant de session Google' },
  '_gat': { name: 'Google Analytics', type: 'analytics', risk: 'medium', description: 'Limite le taux de requêtes' },
  '__utma': { name: 'Google Analytics', type: 'analytics', risk: 'medium', description: 'Cookie de suivi classique' },
  '__utmz': { name: 'Google Analytics', type: 'analytics', risk: 'medium', description: 'Source de trafic' },
  '_fbp': { name: 'Facebook Pixel', type: 'advertising', risk: 'high', description: 'Suit vos actions pour la publicité Facebook' },
  'fr': { name: 'Facebook', type: 'advertising', risk: 'high', description: 'Cookie publicitaire Facebook' },
  '_gcl_au': { name: 'Google Ads', type: 'advertising', risk: 'high', description: 'Conversion publicitaire Google' },
  'IDE': { name: 'DoubleClick', type: 'advertising', risk: 'high', description: 'Publicités ciblées Google' },
  'test_cookie': { name: 'DoubleClick', type: 'advertising', risk: 'medium', description: 'Teste les cookies' },
  '__stripe': { name: 'Stripe', type: 'functional', risk: 'low', description: 'Paiement sécurisé' },
  'intercom': { name: 'Intercom', type: 'functional', risk: 'medium', description: 'Support client' },
  '__hstc': { name: 'HubSpot', type: 'analytics', risk: 'medium', description: 'Analyse de trafic HubSpot' },
  '__hssc': { name: 'HubSpot', type: 'analytics', risk: 'medium', description: 'Session HubSpot' },
  '_hjid': { name: 'Hotjar', type: 'analytics', risk: 'high', description: 'Enregistre votre comportement sur le site' },
  'mp_': { name: 'Mixpanel', type: 'analytics', risk: 'high', description: 'Analyse comportementale détaillée' },
  'ajs_': { name: 'Segment', type: 'analytics', risk: 'medium', description: 'Plateforme de données client' },
  '_twitter': { name: 'Twitter', type: 'social', risk: 'medium', description: 'Intégration Twitter' },
  'li_': { name: 'LinkedIn', type: 'social', risk: 'medium', description: 'Suivi LinkedIn' },
  '_pin': { name: 'Pinterest', type: 'social', risk: 'medium', description: 'Tag Pinterest' },
  'VISITOR_INFO': { name: 'YouTube', type: 'advertising', risk: 'medium', description: 'Préférences YouTube' },
  'amplitude': { name: 'Amplitude', type: 'analytics', risk: 'high', description: 'Analyse produit approfondie' }
};

export function analyzeCookies(): CookieAnalysis {
  const cookies = document.cookie.split(';').filter(c => c.trim());
  const totalCookies = cookies.length;

  const trackerSet = new Set<string>();
  let trackingCookies = 0;

  cookies.forEach(cookie => {
    const cookieName = cookie.split('=')[0].trim();

    for (const [pattern, tracker] of Object.entries(knownTrackers)) {
      if (cookieName.includes(pattern)) {
        trackerSet.add(tracker.name);
        if (tracker.type === 'analytics' || tracker.type === 'advertising') {
          trackingCookies++;
        }
      }
    }
  });

  const trackers = Array.from(trackerSet).map(name => {
    const entry = Object.entries(knownTrackers).find(([_, t]) => t.name === name);
    return entry ? entry[1] : { name, type: 'analytics' as const, risk: 'medium' as const, description: 'Tracker inconnu' };
  });

  const localStorageItems = localStorage.length;
  const sessionStorageItems = sessionStorage.length;

  const thirdPartyCookies = Math.floor(totalCookies * 0.6);

  let privacyScore = 100;
  privacyScore -= Math.min(totalCookies * 2, 40);
  privacyScore -= Math.min(trackingCookies * 5, 30);
  privacyScore -= Math.min(trackerSet.size * 3, 20);
  privacyScore -= trackers.filter(t => t.risk === 'high').length * 5;
  privacyScore = Math.max(0, privacyScore);

  let dataCollectionRisk: 'low' | 'medium' | 'high' = 'low';
  if (privacyScore < 30) {
    dataCollectionRisk = 'high';
  } else if (privacyScore < 60) {
    dataCollectionRisk = 'medium';
  }

  return {
    totalCookies,
    trackingCookies,
    thirdPartyCookies,
    localStorageItems,
    sessionStorageItems,
    trackers,
    privacyScore,
    dataCollectionRisk
  };
}
