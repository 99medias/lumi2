export interface SystemInfo {
  ipAddress: string;
  location: string;
  isp: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  screenResolution: string;
  cores: number;
  architecture: string;
  ram: string;
}

export async function getSystemInfo(): Promise<SystemInfo> {
  const userAgent = navigator.userAgent;

  const { name: browser, version: browserVersion } = detectBrowserWithVersion(userAgent);
  const { name: os, version: osVersion } = detectOSWithVersion(userAgent);
  const device = detectDevice(userAgent);
  const architecture = navigator.platform || 'Inconnu';

  let ipInfo = {
    ipAddress: 'Détection en cours...',
    location: 'Détection en cours...',
    isp: 'Détection en cours...'
  };

  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const data = await response.json();
      ipInfo = {
        ipAddress: data.ip || 'Non détecté',
        location: data.city && data.country_name ? `${data.city}, ${data.country_name}` : 'Non détecté',
        isp: data.org || 'Non détecté'
      };
    }
  } catch (error) {
    ipInfo = {
      ipAddress: 'Non disponible',
      location: 'Non disponible',
      isp: 'Non disponible'
    };
  }

  return {
    ...ipInfo,
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    screenResolution: `${screen.width}x${screen.height}`,
    cores: navigator.hardwareConcurrency || 0,
    architecture,
    ram: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Non détecté'
  };
}

function detectBrowserWithVersion(userAgent: string): { name: string; version: string } {
  let name = 'Navigateur inconnu';
  let version = '';

  if (userAgent.includes('Firefox')) {
    name = 'Firefox';
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (userAgent.includes('Edg')) {
    name = 'Edge';
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (userAgent.includes('Chrome')) {
    name = 'Chrome';
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    name = 'Safari';
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    name = 'Opera';
    const match = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/);
    version = match ? match[1] : '';
  }

  return { name, version };
}

function detectOSWithVersion(userAgent: string): { name: string; version: string } {
  let name = 'Système inconnu';
  let version = '';

  if (userAgent.includes('Windows NT 10.0')) {
    name = 'Windows';
    version = '10/11';
  } else if (userAgent.includes('Windows NT 6.3')) {
    name = 'Windows';
    version = '8.1';
  } else if (userAgent.includes('Windows NT 6.2')) {
    name = 'Windows';
    version = '8';
  } else if (userAgent.includes('Windows NT 6.1')) {
    name = 'Windows';
    version = '7';
  } else if (userAgent.includes('Mac OS X')) {
    name = 'macOS';
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    version = match ? match[1].replace('_', '.') : '';
  } else if (userAgent.includes('Android')) {
    name = 'Android';
    const match = userAgent.match(/Android (\d+\.\d+)/);
    version = match ? match[1] : '';
  } else if (userAgent.includes('Linux')) {
    name = 'Linux';
  } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    name = 'iOS';
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    version = match ? match[1].replace('_', '.') : '';
  }

  return { name, version };
}

function detectDevice(userAgent: string): string {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'Tablette';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    return 'Mobile';
  }
  return 'Ordinateur de bureau';
}
