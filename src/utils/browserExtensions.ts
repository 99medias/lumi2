export interface BrowserExtension {
  id: string;
  name: string;
  detected: boolean;
  risk: 'safe' | 'moderate' | 'risky';
  category: string;
  permissions: string[];
}

const knownExtensions = [
  { id: 'gighmmpiobklfepjocnamgkkbiglidom', name: 'AdBlock', risk: 'safe' as const, category: 'Confidentialité' },
  { id: 'cjpalhdlnbpafiamejdnhcphjbkeiagm', name: 'uBlock Origin', risk: 'safe' as const, category: 'Confidentialité' },
  { id: 'cfhdojbkjhnklbpkdaibdccddilifddb', name: 'Adblock Plus', risk: 'safe' as const, category: 'Confidentialité' },
  { id: 'bkdgflcldnnnapblkhphbgpggdiikppg', name: 'DuckDuckGo Privacy Essentials', risk: 'safe' as const, category: 'Confidentialité' },
  { id: 'fhcgjolkccmbidfldomjliifgaodjagh', name: 'Cookie AutoDelete', risk: 'safe' as const, category: 'Confidentialité' },
  { id: 'gcbommkclmclpchllfjekcdonpmejbdp', name: 'HTTPS Everywhere', risk: 'safe' as const, category: 'Sécurité' },
  { id: 'pkehgijcmpdhfbdbbnkijodmdjhbjlgp', name: 'Privacy Badger', risk: 'safe' as const, category: 'Confidentialité' },
  { id: 'nngceckbapebfimnlniiiahkandclblb', name: 'Bitwarden', risk: 'safe' as const, category: 'Productivité' },
  { id: 'hdokiejnpimakedhajhdlcegeplioahd', name: 'LastPass', risk: 'safe' as const, category: 'Productivité' },
  { id: 'fdjamakpfbbddfjaooikfcpapjohcfmg', name: 'Dashlane', risk: 'safe' as const, category: 'Productivité' },
  { id: 'mlomiejdfkolichcflejclcbmpeaniij', name: 'Ghostery', risk: 'safe' as const, category: 'Confidentialité' },
  { id: 'aapbdbdomjkkjkaonfhkkikfgjllcleb', name: 'Google Translate', risk: 'moderate' as const, category: 'Productivité' },
  { id: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', name: 'Chrome PDF Viewer', risk: 'safe' as const, category: 'Utilitaires' },
  { id: 'felcaaldnbdncclmgdcncolpebgiejap', name: 'MetaMask', risk: 'moderate' as const, category: 'Finance' },
  { id: 'nkbihfbeogaeaoehlefnkodbefgpgknn', name: 'MetaMask', risk: 'moderate' as const, category: 'Finance' },
  { id: 'lmhkpmbekcpmknklioeibfkpmmfibljd', name: 'Requestly', risk: 'risky' as const, category: 'Développeur' },
  { id: 'fmkadmapgofadopljbjfkapdkoienihi', name: 'React Developer Tools', risk: 'safe' as const, category: 'Développeur' },
  { id: 'gppongmhjkpfnbhagpmjfkannfbllamg', name: 'Wappalyzer', risk: 'moderate' as const, category: 'Développeur' },
  { id: 'oldceeleldhonbafppcapldpdifcinji', name: 'Grammarly', risk: 'moderate' as const, category: 'Productivité' },
  { id: 'aghfnjkcakhmadgdomlmlhhaocbkloab', name: 'Honey', risk: 'risky' as const, category: 'Shopping' },
  { id: 'bfbmjmiodbnnpllbbbfblcplfjjepjdn', name: 'Rakuten', risk: 'risky' as const, category: 'Shopping' },
  { id: 'mbfcfcmghlelpnopaajjmmpmpkcpfhkn', name: 'Capital One Shopping', risk: 'risky' as const, category: 'Shopping' },
  { id: 'angjmncdicjedpjcapomhnjeinkhdddf', name: 'Avast Online Security', risk: 'moderate' as const, category: 'Sécurité' },
  { id: 'ghbmnnjooekpmoecnnnilnnbdlolhkhi', name: 'Google Docs Offline', risk: 'safe' as const, category: 'Productivité' },
  { id: 'blpcfgokakmgnkcojhhkbfbldkacnbeo', name: 'YouTube', risk: 'safe' as const, category: 'Multimédia' },
  { id: 'kmendfapggjehodndflmmgagdbamhnfd', name: 'CryptoTab', risk: 'risky' as const, category: 'Finance' },
  { id: 'hdhinadidafjejdhmfkjgnolgimiaplp', name: 'Hola VPN', risk: 'risky' as const, category: 'VPN' },
  { id: 'bhmmomiinigofkjcapegjjndpbikblnp', name: 'Hola Better Internet', risk: 'risky' as const, category: 'VPN' },
  { id: 'ngpampappnmepgilojfohadhhmbhlaek', name: 'Internet Download Manager', risk: 'moderate' as const, category: 'Utilitaires' },
  { id: 'dpjamkmjmigaoobjbekmfgabipmfilij', name: 'DownloadHelper', risk: 'moderate' as const, category: 'Utilitaires' }
];

export async function detectBrowserExtensions(): Promise<BrowserExtension[]> {
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);

  if (!isChrome) {
    return [];
  }

  const detected: BrowserExtension[] = [];

  for (const ext of knownExtensions) {
    const isDetected = await checkExtension(ext.id);
    detected.push({
      ...ext,
      detected: isDetected,
      permissions: []
    });
  }

  return detected.filter(ext => ext.detected);
}

async function checkExtension(extensionId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve(false);
    }, 100);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };

    img.src = `chrome-extension://${extensionId}/icon.png`;
  });
}

export function getExtensionRiskLevel(extensions: BrowserExtension[]): { level: string; message: string } {
  const riskyCount = extensions.filter(e => e.risk === 'risky').length;
  const moderateCount = extensions.filter(e => e.risk === 'moderate').length;

  if (riskyCount >= 2) {
    return {
      level: 'high',
      message: `${riskyCount} extensions à risque élevé détectées`
    };
  } else if (riskyCount >= 1 || moderateCount >= 3) {
    return {
      level: 'medium',
      message: `${riskyCount + moderateCount} extensions suspectes détectées`
    };
  } else if (extensions.length >= 10) {
    return {
      level: 'medium',
      message: `${extensions.length} extensions installées - surface d'attaque élevée`
    };
  } else {
    return {
      level: 'low',
      message: `${extensions.length} extensions détectées`
    };
  }
}
