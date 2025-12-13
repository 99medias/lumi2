export interface WebRTCLeakResult {
  leaked: boolean;
  localIPs: string[];
  publicIPs: string[];
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
}

export async function detectWebRTCLeak(): Promise<WebRTCLeakResult> {
  const ips: string[] = [];
  const publicIPs: string[] = [];
  const localIPs: string[] = [];

  try {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    pc.createDataChannel('');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        pc.close();
        const leaked = publicIPs.length > 0;
        resolve({
          leaked,
          localIPs,
          publicIPs,
          riskLevel: leaked ? 'high' : localIPs.length > 0 ? 'medium' : 'low',
          description: leaked
            ? 'Votre adresse IP réelle est exposée via WebRTC'
            : 'Aucune fuite WebRTC détectée'
        });
      }, 3000);

      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          clearTimeout(timeout);
          pc.close();
          const leaked = publicIPs.length > 0;
          resolve({
            leaked,
            localIPs,
            publicIPs,
            riskLevel: leaked ? 'high' : localIPs.length > 0 ? 'medium' : 'low',
            description: leaked
              ? 'Votre adresse IP réelle est exposée via WebRTC'
              : 'Aucune fuite WebRTC détectée'
          });
          return;
        }

        const candidateStr = e.candidate.candidate;
        const ipMatch = candidateStr.match(/(\d{1,3}\.){3}\d{1,3}/);

        if (ipMatch && ipMatch[0]) {
          const ip = ipMatch[0];
          if (!ips.includes(ip)) {
            ips.push(ip);

            if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
              localIPs.push(ip);
            } else if (!ip.startsWith('0.') && !ip.startsWith('127.')) {
              publicIPs.push(ip);
            }
          }
        }
      };
    });
  } catch (error) {
    console.error('WebRTC leak detection error:', error);
    return {
      leaked: false,
      localIPs: [],
      publicIPs: [],
      riskLevel: 'low',
      description: 'Impossible de tester les fuites WebRTC'
    };
  }
}
