export interface DNSLeakResult {
  provider: string;
  secure: boolean;
  leakDetected: boolean;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
  resolvers: string[];
}

export async function detectDNSLeak(): Promise<DNSLeakResult> {
  try {
    const response = await fetch('https://dns.google/resolve?name=whoami.cloudflare.com&type=TXT', {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return {
        provider: 'Impossible de détecter',
        secure: true,
        leakDetected: false,
        riskLevel: 'low',
        description: 'Test DNS non disponible',
        resolvers: []
      };
    }

    const data = await response.json();

    if (data.Answer && data.Answer.length > 0) {
      const resolverInfo = data.Answer[0].data.replace(/"/g, '');
      const resolvers = resolverInfo.split(',').map((s: string) => s.trim());

      const googleDNS = resolvers.some((r: string) =>
        r.includes('8.8.8.8') || r.includes('8.8.4.4') || r.includes('google')
      );

      const cloudflareDNS = resolvers.some((r: string) =>
        r.includes('1.1.1.1') || r.includes('cloudflare')
      );

      const customDNS = !googleDNS && !cloudflareDNS;

      let provider = 'DNS personnalisé';
      if (googleDNS) provider = 'Google Public DNS';
      if (cloudflareDNS) provider = 'Cloudflare DNS';

      const leakDetected = customDNS && resolvers.length > 1;

      return {
        provider,
        secure: !leakDetected,
        leakDetected,
        riskLevel: leakDetected ? 'high' : 'low',
        description: leakDetected
          ? 'Fuite DNS détectée - vos requêtes DNS peuvent être interceptées'
          : 'Aucune fuite DNS détectée',
        resolvers
      };
    }

    return {
      provider: 'Non détecté',
      secure: true,
      leakDetected: false,
      riskLevel: 'low',
      description: 'Impossible de déterminer le fournisseur DNS',
      resolvers: []
    };
  } catch (error) {
    console.error('DNS leak detection error:', error);
    return {
      provider: 'Test échoué',
      secure: true,
      leakDetected: false,
      riskLevel: 'low',
      description: 'Impossible d\'effectuer le test de fuite DNS',
      resolvers: []
    };
  }
}
