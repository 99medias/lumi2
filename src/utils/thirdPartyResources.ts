export interface ThirdPartyResource {
  domain: string;
  type: string;
  risk: 'tracker' | 'cdn' | 'analytics' | 'ads' | 'social' | 'unknown';
  count: number;
}

export interface ThirdPartyAnalysis {
  resources: ThirdPartyResource[];
  totalDomains: number;
  trackers: number;
  analytics: number;
  ads: number;
  social: number;
  riskLevel: 'high' | 'medium' | 'low';
}

const trackerDomains = [
  'doubleclick', 'google-analytics', 'googletagmanager', 'facebook', 'fbcdn',
  'twitter', 'linkedin', 'pinterest', 'tiktok', 'snapchat',
  'hotjar', 'mixpanel', 'segment', 'amplitude', 'intercom',
  'hubspot', 'drift', 'zendesk', 'clarity', 'mouseflow'
];

const adDomains = [
  'googlesyndication', 'adservice', 'advertising', 'adsystem', 'adnxs',
  'criteo', 'outbrain', 'taboola', 'pubmatic', 'rubiconproject'
];

const analyticsDomains = [
  'analytics', 'tracking', 'stats', 'metrics', 'telemetry'
];

const socialDomains = [
  'facebook', 'twitter', 'linkedin', 'instagram', 'youtube',
  'pinterest', 'tiktok', 'snapchat', 'reddit'
];

function categorizeDomain(domain: string): ThirdPartyResource['risk'] {
  const lower = domain.toLowerCase();

  if (trackerDomains.some(t => lower.includes(t))) return 'tracker';
  if (adDomains.some(a => lower.includes(a))) return 'ads';
  if (analyticsDomains.some(a => lower.includes(a))) return 'analytics';
  if (socialDomains.some(s => lower.includes(s))) return 'social';
  if (lower.includes('cdn') || lower.includes('cloudflare') || lower.includes('akamai')) return 'cdn';

  return 'unknown';
}

export function analyzeThirdPartyResources(): ThirdPartyAnalysis {
  try {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const currentDomain = window.location.hostname;
    const domainMap = new Map<string, { type: string; count: number; risk: ThirdPartyResource['risk'] }>();

    entries.forEach(entry => {
      try {
        const url = new URL(entry.name);
        if (url.hostname !== currentDomain && !url.hostname.includes(currentDomain)) {
          const risk = categorizeDomain(url.hostname);
          const existing = domainMap.get(url.hostname);

          if (existing) {
            existing.count++;
          } else {
            domainMap.set(url.hostname, {
              type: entry.initiatorType,
              count: 1,
              risk
            });
          }
        }
      } catch (e) {
      }
    });

    const resources: ThirdPartyResource[] = Array.from(domainMap.entries()).map(([domain, data]) => ({
      domain,
      type: data.type,
      risk: data.risk,
      count: data.count
    }));

    const trackers = resources.filter(r => r.risk === 'tracker').length;
    const analytics = resources.filter(r => r.risk === 'analytics').length;
    const ads = resources.filter(r => r.risk === 'ads').length;
    const social = resources.filter(r => r.risk === 'social').length;

    const riskScore = (trackers * 3) + (ads * 2) + (analytics * 2) + social;
    const riskLevel: 'high' | 'medium' | 'low' =
      riskScore > 10 ? 'high' : riskScore > 5 ? 'medium' : 'low';

    return {
      resources: resources.sort((a, b) => b.count - a.count),
      totalDomains: resources.length,
      trackers,
      analytics,
      ads,
      social,
      riskLevel
    };
  } catch (error) {
    console.error('Third-party resource analysis error:', error);
    return {
      resources: [],
      totalDomains: 0,
      trackers: 0,
      analytics: 0,
      ads: 0,
      social: 0,
      riskLevel: 'low'
    };
  }
}
