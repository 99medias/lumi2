export interface MediaDevicesSummary {
  cameras: number;
  microphones: number;
  speakers: number;
  devices: MediaDeviceInfo[];
  permissionGranted: boolean;
  privacyRisk: 'low' | 'medium' | 'high';
  warnings: string[];
}

export async function detectMediaDevices(): Promise<MediaDevicesSummary> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return {
        cameras: 0,
        microphones: 0,
        speakers: 0,
        devices: [],
        permissionGranted: false,
        privacyRisk: 'low',
        warnings: ['API MediaDevices non disponible']
      };
    }

    const devices = await navigator.mediaDevices.enumerateDevices();

    const cameras = devices.filter(d => d.kind === 'videoinput').length;
    const microphones = devices.filter(d => d.kind === 'audioinput').length;
    const speakers = devices.filter(d => d.kind === 'audiooutput').length;

    const permissionGranted = devices.some(d => d.label !== '');

    let privacyRisk: 'low' | 'medium' | 'high' = 'low';
    const warnings: string[] = [];

    if (cameras > 0 && microphones > 0) {
      privacyRisk = 'high';
      warnings.push('Caméra et microphone présents - cible de choix pour les logiciels espions');
    } else if (cameras > 0) {
      privacyRisk = 'medium';
      warnings.push('Caméra détectée - risque de surveillance visuelle');
    } else if (microphones > 1) {
      privacyRisk = 'medium';
      warnings.push('Plusieurs microphones détectés - risque d\'écoute');
    }

    if (permissionGranted) {
      warnings.push('Permissions média accordées - accès possible par les sites web');
    }

    return {
      cameras,
      microphones,
      speakers,
      devices,
      permissionGranted,
      privacyRisk,
      warnings
    };
  } catch (error) {
    return {
      cameras: 0,
      microphones: 0,
      speakers: 0,
      devices: [],
      permissionGranted: false,
      privacyRisk: 'low',
      warnings: ['Erreur lors de la détection des périphériques']
    };
  }
}
