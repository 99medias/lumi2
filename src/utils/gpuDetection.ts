export interface GPUInfo {
  renderer: string;
  vendor: string;
  detected: boolean;
  isIntegrated: boolean;
  isDedicated: boolean;
  vulnerabilityRisk: 'low' | 'medium' | 'high';
  driverWarning: string | null;
}

export function detectGPU(): GPUInfo {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;

    if (!gl) {
      return {
        renderer: 'Non détecté',
        vendor: 'Non détecté',
        detected: false,
        isIntegrated: false,
        isDedicated: false,
        vulnerabilityRisk: 'medium',
        driverWarning: 'Impossible de détecter le GPU'
      };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      return {
        renderer: 'Non détecté',
        vendor: 'Non détecté',
        detected: false,
        isIntegrated: false,
        isDedicated: false,
        vulnerabilityRisk: 'medium',
        driverWarning: 'Extension WebGL non disponible'
      };
    }

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

    const isIntegrated = /Intel.*HD|Intel.*UHD|Intel.*Iris|AMD.*Radeon.*Vega|Apple/i.test(renderer);
    const isDedicated = /NVIDIA|GeForce|Radeon RX|Radeon R[579]|RTX|GTX/i.test(renderer);

    let vulnerabilityRisk: 'low' | 'medium' | 'high' = 'low';
    let driverWarning: string | null = null;

    if (/Intel.*HD Graphics [34]000/i.test(renderer)) {
      vulnerabilityRisk = 'high';
      driverWarning = 'GPU obsolète avec vulnérabilités connues';
    } else if (/Intel.*HD Graphics [56]000/i.test(renderer)) {
      vulnerabilityRisk = 'medium';
      driverWarning = 'GPU ancien - mise à jour des pilotes recommandée';
    } else if (isIntegrated) {
      vulnerabilityRisk = 'medium';
      driverWarning = 'GPU intégré - performance limitée';
    }

    return {
      renderer,
      vendor,
      detected: true,
      isIntegrated,
      isDedicated,
      vulnerabilityRisk,
      driverWarning
    };
  } catch (error) {
    return {
      renderer: 'Erreur de détection',
      vendor: 'Non disponible',
      detected: false,
      isIntegrated: false,
      isDedicated: false,
      vulnerabilityRisk: 'medium',
      driverWarning: 'Erreur lors de la détection du GPU'
    };
  }
}
