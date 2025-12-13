export interface BrowserStorageAudit {
  localStorage: {
    size: number;
    items: number;
    sizeReadable: string;
  };
  sessionStorage: {
    size: number;
    items: number;
    sizeReadable: string;
  };
  indexedDB: {
    databases: string[];
    count: number;
  };
  cookies: {
    count: number;
    domains: string[];
  };
  totalSize: number;
  totalSizeReadable: string;
  riskLevel: 'high' | 'medium' | 'low';
  warnings: string[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 octets';
  const k = 1024;
  const sizes = ['octets', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export async function auditBrowserStorage(): Promise<BrowserStorageAudit> {
  const warnings: string[] = [];

  const localStorageSize = Object.keys(localStorage).reduce((acc, key) => {
    return acc + key.length + (localStorage[key]?.length || 0);
  }, 0);

  const sessionStorageSize = Object.keys(sessionStorage).reduce((acc, key) => {
    return acc + key.length + (sessionStorage[key]?.length || 0);
  }, 0);

  let indexedDBList: string[] = [];
  try {
    if ('indexedDB' in window && indexedDB.databases) {
      const databases = await indexedDB.databases();
      indexedDBList = databases.map(db => db.name || 'unnamed');
    }
  } catch (e) {
    indexedDBList = [];
  }

  const cookieList = document.cookie.split(';').filter(c => c.trim());
  const cookieDomains = new Set<string>();

  cookieList.forEach(cookie => {
    try {
      const parts = cookie.trim().split('=');
      if (parts.length > 0) {
        cookieDomains.add(window.location.hostname);
      }
    } catch (e) {
    }
  });

  const totalSize = localStorageSize + sessionStorageSize;

  if (localStorageSize > 1024 * 1024) {
    warnings.push(`LocalStorage volumineux (${formatBytes(localStorageSize)}) - peut ralentir le navigateur`);
  }

  if (Object.keys(localStorage).length > 50) {
    warnings.push(`${Object.keys(localStorage).length} entrées localStorage - risque de tracking`);
  }

  if (indexedDBList.length > 5) {
    warnings.push(`${indexedDBList.length} bases de données IndexedDB - stockage excessif`);
  }

  if (cookieList.length > 50) {
    warnings.push(`${cookieList.length} cookies - nombreux trackers potentiels`);
  }

  const riskLevel: 'high' | 'medium' | 'low' =
    warnings.length >= 3 ? 'high' :
    warnings.length >= 1 ? 'medium' :
    'low';

  return {
    localStorage: {
      size: localStorageSize,
      items: Object.keys(localStorage).length,
      sizeReadable: formatBytes(localStorageSize)
    },
    sessionStorage: {
      size: sessionStorageSize,
      items: Object.keys(sessionStorage).length,
      sizeReadable: formatBytes(sessionStorageSize)
    },
    indexedDB: {
      databases: indexedDBList,
      count: indexedDBList.length
    },
    cookies: {
      count: cookieList.length,
      domains: Array.from(cookieDomains)
    },
    totalSize,
    totalSizeReadable: formatBytes(totalSize),
    riskLevel,
    warnings
  };
}
