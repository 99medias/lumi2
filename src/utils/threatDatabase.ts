export interface Threat {
  id: string;
  name: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  description: string;
}

export interface ThreatTemplate {
  name: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
}

export interface ScanResults {
  threats: Threat[];
  securityScore: number;
  threatCount: number;
  privacyIssues: number;
  performanceIssues: number;
  vulnerabilities: number;
  recommendedPlan: 's' | 'm' | 'l';
}

const threatTemplates = [
  { name: 'Trojan.Win32.GenericKD.{id}', type: 'Trojan', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\', 'C:\\Windows\\Temp\\', 'C:\\Users\\AppData\\Roaming\\'] },
  { name: 'Ransomware.Cryptor.Gen{id}', type: 'Ransomware', severity: 'critical' as const, locations: ['C:\\Temp\\', 'C:\\Users\\Downloads\\', 'C:\\ProgramData\\'] },
  { name: 'Spyware.KeyLogger.FR{id}', type: 'Spyware', severity: 'critical' as const, locations: ['C:\\Users\\AppData\\Roaming\\', 'C:\\Windows\\System32\\'] },
  { name: 'Backdoor.RemoteAccess{id}', type: 'Backdoor', severity: 'critical' as const, locations: ['C:\\Windows\\Temp\\', 'C:\\Program Files\\'] },
  { name: 'Rootkit.Hidden.Driver{id}', type: 'Rootkit', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\drivers\\'] },
  { name: 'Trojan.Banker.Zbot{id}', type: 'Trojan', severity: 'critical' as const, locations: ['C:\\Windows\\assembly\\', 'C:\\Users\\Documents\\'] },
  { name: 'Trojan.Agent.MSIL{id}', type: 'Trojan', severity: 'critical' as const, locations: ['C:\\Program Files\\', 'C:\\Windows\\Microsoft.NET\\'] },
  { name: 'Trojan.Emotet.{id}', type: 'Trojan', severity: 'critical' as const, locations: ['C:\\Users\\AppData\\Local\\', 'C:\\Windows\\Temp\\'] },
  { name: 'Trojan.TrickBot.{id}', type: 'Trojan', severity: 'critical' as const, locations: ['C:\\ProgramData\\', 'C:\\Users\\AppData\\Roaming\\'] },
  { name: 'Ransomware.WannaCry.{id}', type: 'Ransomware', severity: 'critical' as const, locations: ['C:\\Windows\\', 'C:\\Temp\\'] },
  { name: 'Ransomware.Locky.{id}', type: 'Ransomware', severity: 'critical' as const, locations: ['C:\\Users\\Documents\\', 'C:\\Users\\Downloads\\'] },
  { name: 'Ransomware.Ryuk.{id}', type: 'Ransomware', severity: 'critical' as const, locations: ['C:\\ProgramData\\', 'C:\\Windows\\Temp\\'] },
  { name: 'Ransomware.Maze.{id}', type: 'Ransomware', severity: 'critical' as const, locations: ['C:\\Users\\AppData\\', 'C:\\Program Files\\'] },
  { name: 'Ransomware.REvil.{id}', type: 'Ransomware', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\', 'C:\\Temp\\'] },
  { name: 'Spyware.Agent.{id}', type: 'Spyware', severity: 'critical' as const, locations: ['C:\\Users\\AppData\\Local\\', 'C:\\Windows\\'] },
  { name: 'Spyware.RedLine.{id}', type: 'Spyware', severity: 'critical' as const, locations: ['C:\\Users\\AppData\\Roaming\\', 'C:\\Temp\\'] },
  { name: 'Spyware.AZORult.{id}', type: 'Spyware', severity: 'critical' as const, locations: ['C:\\ProgramData\\', 'C:\\Users\\Documents\\'] },
  { name: 'Backdoor.Cobalt.{id}', type: 'Backdoor', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\', 'C:\\Program Files\\'] },
  { name: 'Backdoor.Gh0st.{id}', type: 'Backdoor', severity: 'critical' as const, locations: ['C:\\Windows\\Temp\\', 'C:\\Users\\AppData\\'] },
  { name: 'Rootkit.TDSS.{id}', type: 'Rootkit', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\drivers\\', 'MBR'] },
  { name: 'Rootkit.ZeroAccess.{id}', type: 'Rootkit', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\', 'Registry'] },
  { name: 'Worm.Conficker.{id}', type: 'Worm', severity: 'high' as const, locations: ['C:\\Windows\\System32\\', 'Network Share'] },
  { name: 'Worm.Koobface.{id}', type: 'Worm', severity: 'high' as const, locations: ['C:\\Users\\AppData\\', 'Social Media'] },
  { name: 'Worm.Stuxnet.{id}', type: 'Worm', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\drivers\\', 'USB Device'] },
  { name: 'Adware.SearchProtect{id}', type: 'Adware', severity: 'high' as const, locations: ['C:\\Program Files\\', 'C:\\Program Files (x86)\\'] },
  { name: 'Adware.Elex.{id}', type: 'Adware', severity: 'high' as const, locations: ['C:\\ProgramData\\', 'C:\\Users\\AppData\\'] },
  { name: 'Adware.MyWebSearch{id}', type: 'Adware', severity: 'medium' as const, locations: ['C:\\Program Files (x86)\\', 'C:\\Users\\AppData\\Local\\'] },
  { name: 'Adware.Gator{id}', type: 'Adware', severity: 'medium' as const, locations: ['C:\\Program Files\\', 'C:\\Windows\\Temp\\'] },
  { name: 'Adware.DoubleClick{id}', type: 'Adware', severity: 'medium' as const, locations: ['Browser Cache', 'C:\\Users\\AppData\\'] },
  { name: 'Spyware.InfoStealer.PWS{id}', type: 'Spyware', severity: 'high' as const, locations: ['C:\\Users\\Documents\\', 'C:\\Temp\\'] },
  { name: 'Trojan.Downloader.Agent{id}', type: 'Trojan', severity: 'high' as const, locations: ['C:\\Temp\\', 'C:\\Users\\AppData\\Local\\'] },
  { name: 'Trojan.Dropper.{id}', type: 'Trojan', severity: 'high' as const, locations: ['C:\\Windows\\Temp\\', 'C:\\Users\\Downloads\\'] },
  { name: 'Trojan.Clicker.{id}', type: 'Trojan', severity: 'medium' as const, locations: ['C:\\Program Files\\', 'Browser Extensions'] },
  { name: 'Trojan.FakeAV.{id}', type: 'Trojan', severity: 'high' as const, locations: ['C:\\ProgramData\\', 'C:\\Users\\AppData\\'] },
  { name: 'BrowserHijacker.SearchBar{id}', type: 'Browser Hijacker', severity: 'high' as const, locations: ['C:\\Program Files (x86)\\', 'C:\\Users\\AppData\\Local\\'] },
  { name: 'BrowserHijacker.Conduit{id}', type: 'Browser Hijacker', severity: 'high' as const, locations: ['Browser Settings', 'C:\\Users\\AppData\\Roaming\\'] },
  { name: 'BrowserHijacker.BabylonToolbar{id}', type: 'Browser Hijacker', severity: 'medium' as const, locations: ['C:\\Program Files\\', 'Browser Extensions'] },
  { name: 'BrowserHijacker.Ask{id}', type: 'Browser Hijacker', severity: 'medium' as const, locations: ['C:\\Program Files (x86)\\', 'Browser Data'] },
  { name: 'Worm.Network.Spreader{id}', type: 'Worm', severity: 'high' as const, locations: ['C:\\Windows\\System32\\', 'C:\\Users\\Public\\'] },
  { name: 'PUP.Optional.BrowserHelper{id}', type: 'PUP', severity: 'medium' as const, locations: ['C:\\Program Files (x86)\\', 'C:\\Users\\AppData\\'] },
  { name: 'PUP.Optional.Toolbar{id}', type: 'PUP', severity: 'low' as const, locations: ['C:\\Program Files\\', 'C:\\Users\\AppData\\Roaming\\'] },
  { name: 'PUP.Optional.BundleInstaller{id}', type: 'PUP', severity: 'medium' as const, locations: ['C:\\Temp\\', 'C:\\Users\\Downloads\\'] },
  { name: 'PUP.Optional.OpenCandy{id}', type: 'PUP', severity: 'medium' as const, locations: ['C:\\ProgramData\\', 'C:\\Users\\AppData\\Local\\'] },
  { name: 'PUP.Optional.Mindspark{id}', type: 'PUP', severity: 'medium' as const, locations: ['C:\\Program Files\\', 'Browser Extensions'] },
  { name: 'Adware.PopupGenerator{id}', type: 'Adware', severity: 'medium' as const, locations: ['C:\\ProgramData\\', 'C:\\Users\\AppData\\Local\\'] },
  { name: 'TrackingCookie.Advertising{id}', type: 'Tracking Cookie', severity: 'medium' as const, locations: ['C:\\Users\\AppData\\Local\\Cookies\\', 'Browser Data'] },
  { name: 'TrackingCookie.DoubleClick{id}', type: 'Tracking Cookie', severity: 'medium' as const, locations: ['Browser Cookies', 'C:\\Users\\AppData\\'] },
  { name: 'TrackingCookie.Google{id}', type: 'Tracking Cookie', severity: 'low' as const, locations: ['Browser Data', 'C:\\Users\\AppData\\Local\\'] },
  { name: 'TrackingCookie.Facebook{id}', type: 'Tracking Cookie', severity: 'medium' as const, locations: ['Browser Cookies', 'Web Storage'] },
  { name: 'Registry.Vulnerability.CVE{id}', type: 'Registry Vulnerability', severity: 'high' as const, locations: ['HKEY_LOCAL_MACHINE\\SOFTWARE\\', 'HKEY_CURRENT_USER\\'] },
  { name: 'Registry.Malformed.Key{id}', type: 'Registry Vulnerability', severity: 'medium' as const, locations: ['HKEY_CLASSES_ROOT\\', 'Registry'] },
  { name: 'Registry.Suspicious.Entry{id}', type: 'Registry Vulnerability', severity: 'medium' as const, locations: ['HKEY_LOCAL_MACHINE\\Run\\', 'Startup Registry'] },
  { name: 'NetworkExploit.RemoteCode{id}', type: 'Network Exploit', severity: 'critical' as const, locations: ['Network Interface', 'Port 445'] },
  { name: 'NetworkExploit.SMB{id}', type: 'Network Exploit', severity: 'critical' as const, locations: ['Port 445', 'Network Share'] },
  { name: 'NetworkExploit.EternalBlue{id}', type: 'Network Exploit', severity: 'critical' as const, locations: ['SMB Protocol', 'Port 445'] },
  { name: 'FileInfector.Polymorphic{id}', type: 'File Infector', severity: 'high' as const, locations: ['C:\\Windows\\', 'C:\\Program Files\\'] },
  { name: 'FileInfector.Virus{id}', type: 'File Infector', severity: 'high' as const, locations: ['C:\\Windows\\System32\\', 'Executable Files'] },
  { name: 'Dropper.Payload{id}', type: 'Dropper', severity: 'high' as const, locations: ['C:\\Temp\\', 'C:\\Users\\Downloads\\'] },
  { name: 'Dropper.Multi{id}', type: 'Dropper', severity: 'high' as const, locations: ['C:\\ProgramData\\', 'C:\\Windows\\Temp\\'] },
  { name: 'Scareware.FakeSecurity{id}', type: 'Scareware', severity: 'medium' as const, locations: ['C:\\Program Files\\', 'C:\\Users\\AppData\\'] },
  { name: 'Scareware.FakeAlert{id}', type: 'Scareware', severity: 'medium' as const, locations: ['Browser Popup', 'C:\\ProgramData\\'] },
  { name: 'Miner.CryptoMiner{id}', type: 'Crypto Miner', severity: 'high' as const, locations: ['C:\\Windows\\Temp\\', 'Browser Script'] },
  { name: 'Miner.Coinhive{id}', type: 'Crypto Miner', severity: 'high' as const, locations: ['Browser Cache', 'JavaScript'] },
  { name: 'Miner.XMRig{id}', type: 'Crypto Miner', severity: 'high' as const, locations: ['C:\\Users\\AppData\\', 'Background Process'] },
  { name: 'Exploit.CVE-2021-{id}', type: 'Exploit', severity: 'critical' as const, locations: ['System Memory', 'Kernel'] },
  { name: 'Exploit.BufferOverflow{id}', type: 'Exploit', severity: 'high' as const, locations: ['Application Memory', 'C:\\Windows\\'] },
  { name: 'Exploit.ZeroDay{id}', type: 'Exploit', severity: 'critical' as const, locations: ['System Core', 'Unknown Vector'] },
  { name: 'Bot.DDoS.{id}', type: 'Bot', severity: 'high' as const, locations: ['Network Service', 'C:\\Windows\\System32\\'] },
  { name: 'Bot.Spam.{id}', type: 'Bot', severity: 'medium' as const, locations: ['Email Client', 'C:\\Users\\AppData\\'] },
  { name: 'Bot.Proxy.{id}', type: 'Bot', severity: 'high' as const, locations: ['Network Interface', 'C:\\ProgramData\\'] },
  { name: 'Phishing.Credentials{id}', type: 'Phishing', severity: 'high' as const, locations: ['Browser Form', 'Saved Passwords'] },
  { name: 'Phishing.BankStealer{id}', type: 'Phishing', severity: 'critical' as const, locations: ['Browser Extension', 'Form Data'] },
  { name: 'Injector.Code{id}', type: 'Code Injector', severity: 'high' as const, locations: ['Process Memory', 'DLL Injection'] },
  { name: 'Injector.Web{id}', type: 'Code Injector', severity: 'medium' as const, locations: ['Browser Script', 'Web Pages'] },
  { name: 'Malware.Generic{id}', type: 'Generic Malware', severity: 'medium' as const, locations: ['C:\\Temp\\', 'C:\\Users\\AppData\\'] },
  { name: 'Malware.Suspicious{id}', type: 'Generic Malware', severity: 'medium' as const, locations: ['C:\\Windows\\Temp\\', 'Unknown'] },
  { name: 'RAT.RemoteAdmin{id}', type: 'RAT', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\', 'Network Service'] },
  { name: 'RAT.NetWire{id}', type: 'RAT', severity: 'critical' as const, locations: ['C:\\ProgramData\\', 'Remote Connection'] },
  { name: 'RAT.DarkComet{id}', type: 'RAT', severity: 'critical' as const, locations: ['C:\\Users\\AppData\\', 'System Process'] },
  { name: 'Stealer.Passwords{id}', type: 'Password Stealer', severity: 'critical' as const, locations: ['Browser Data', 'Credential Store'] },
  { name: 'Stealer.Cookies{id}', type: 'Cookie Stealer', severity: 'high' as const, locations: ['Browser Cookies', 'Session Data'] },
  { name: 'Stealer.Discord{id}', type: 'Token Stealer', severity: 'high' as const, locations: ['Discord Cache', 'C:\\Users\\AppData\\Roaming\\'] },
  { name: 'Stealer.Steam{id}', type: 'Account Stealer', severity: 'high' as const, locations: ['Steam Files', 'C:\\Program Files\\'] },
  { name: 'Stealer.Telegram{id}', type: 'Token Stealer', severity: 'high' as const, locations: ['Telegram Data', 'C:\\Users\\AppData\\'] },
  { name: 'Loader.Malware{id}', type: 'Malware Loader', severity: 'high' as const, locations: ['C:\\Windows\\Temp\\', 'System Startup'] },
  { name: 'Loader.DLL{id}', type: 'DLL Loader', severity: 'high' as const, locations: ['C:\\Windows\\System32\\', 'Process Memory'] },
  { name: 'Keylogger.Agent{id}', type: 'Keylogger', severity: 'critical' as const, locations: ['System Hook', 'C:\\Users\\AppData\\'] },
  { name: 'Keylogger.Advanced{id}', type: 'Keylogger', severity: 'critical' as const, locations: ['Keyboard Driver', 'Registry'] },
  { name: 'ScreenCapture.Spy{id}', type: 'Screen Recorder', severity: 'high' as const, locations: ['System Process', 'C:\\ProgramData\\'] },
  { name: 'WebcamSpy.Remote{id}', type: 'Webcam Spy', severity: 'critical' as const, locations: ['Camera Driver', 'System Service'] },
  { name: 'AudioSpy.Microphone{id}', type: 'Audio Recorder', severity: 'critical' as const, locations: ['Audio Driver', 'Background Process'] },
  { name: 'FileStealer.Documents{id}', type: 'File Stealer', severity: 'high' as const, locations: ['C:\\Users\\Documents\\', 'Cloud Sync'] },
  { name: 'ClipboardStealer.{id}', type: 'Clipboard Hijacker', severity: 'high' as const, locations: ['System Clipboard', 'Memory'] },
  { name: 'BrowserStealer.History{id}', type: 'Browser Stealer', severity: 'medium' as const, locations: ['Browser History', 'C:\\Users\\AppData\\'] },
  { name: 'CryptoStealer.Wallet{id}', type: 'Crypto Stealer', severity: 'critical' as const, locations: ['Crypto Wallets', 'C:\\Users\\AppData\\'] },
  { name: 'SessionHijacker.{id}', type: 'Session Hijacker', severity: 'high' as const, locations: ['Session Tokens', 'Browser Storage'] },
  { name: 'FormGrabber.{id}', type: 'Form Grabber', severity: 'high' as const, locations: ['Browser Forms', 'Web Input'] },
  { name: 'DNSChanger.{id}', type: 'DNS Changer', severity: 'high' as const, locations: ['Network Settings', 'DNS Configuration'] },
  { name: 'ProxyChanger.{id}', type: 'Proxy Hijacker', severity: 'medium' as const, locations: ['Proxy Settings', 'Network Config'] },
  { name: 'StartupModifier.{id}', type: 'Startup Hijacker', severity: 'medium' as const, locations: ['Startup Folder', 'Registry Run Key'] },
  { name: 'ServiceInstaller.{id}', type: 'Service Installer', severity: 'high' as const, locations: ['Windows Services', 'C:\\Windows\\System32\\'] },
  { name: 'DriverInstaller.{id}', type: 'Malicious Driver', severity: 'critical' as const, locations: ['C:\\Windows\\System32\\drivers\\', 'Kernel Mode'] },
  { name: 'ProcessHollowing.{id}', type: 'Process Hollowing', severity: 'high' as const, locations: ['System Process', 'Memory Injection'] },
  { name: 'DLLHijacker.{id}', type: 'DLL Hijacking', severity: 'high' as const, locations: ['System DLLs', 'C:\\Windows\\System32\\'] },
  { name: 'PersistenceMechanism.{id}', type: 'Persistence', severity: 'medium' as const, locations: ['Registry', 'Scheduled Tasks'] }
];

const fileNames = [
  'svchost.exe', 'system32.dll', 'winlog.dll', 'rdp_helper.dll', 'kernel32.dll',
  'update.exe', 'install.exe', 'setup.exe', 'temp.dll', 'cache.dat',
  'config.ini', 'settings.db', 'data.tmp', 'hidden.sys', 'driver.sys',
  'malware.exe', 'encrypt.exe', 'payload.dll', 'injector.exe', 'loader.dll',
  'explorer.dll', 'chrome_update.exe', 'firefox_cache.db', 'winupdate.exe',
  'ntoskrnl.sys', 'hal.dll', 'win32k.sys', 'tcpip.sys', 'ndis.sys',
  'shell.dll', 'user32.dll', 'gdi32.dll', 'advapi32.dll', 'ole32.dll',
  'runtime.dll', 'msvcrt.dll', 'vcruntime.dll', 'msvcp.dll', 'ws2_32.dll'
];

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choose<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateConsistentThreats(deviceFingerprint: string, count: number): ThreatTemplate[] {
  const seed = hashString(deviceFingerprint);
  const rng = new SeededRandom(seed);

  const threats: ThreatTemplate[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < count; i++) {
    let templateIndex: number;
    do {
      templateIndex = rng.nextInt(0, threatTemplates.length - 1);
    } while (usedIndices.has(templateIndex) && usedIndices.size < threatTemplates.length);

    usedIndices.add(templateIndex);

    const template = threatTemplates[templateIndex];
    const threatId = (10000 + rng.nextInt(0, 89999)).toString();
    const location = rng.choose(template.locations);
    const fileName = rng.choose(fileNames);

    threats.push({
      name: template.name.replace('{id}', threatId),
      type: template.type,
      severity: template.severity,
      location: `${location}${fileName}`
    });
  }

  return threats;
}

export function calculateScoresFromFingerprint(deviceFingerprint: string): {
  securityScore: number;
  threatCount: number;
  privacyIssues: number;
  performanceIssues: number;
  vulnerabilities: number;
  recommendedPlan: 's' | 'm' | 'l';
} {
  const seed = hashString(deviceFingerprint);
  const rng = new SeededRandom(seed);

  const threatCount = rng.nextInt(8, 35);

  const securityScore = Math.max(20, 100 - (threatCount * 2.2));

  const privacyIssues = Math.round(threatCount * rng.next() * 2.5 + 10);
  const performanceIssues = Math.round(threatCount * rng.next() * 2 + 8);
  const vulnerabilities = Math.round(threatCount * rng.next() * 1.5 + 2);

  let recommendedPlan: 's' | 'm' | 'l';
  if (securityScore < 40) {
    recommendedPlan = 'l';
  } else if (securityScore < 65) {
    recommendedPlan = 'm';
  } else {
    recommendedPlan = 's';
  }

  return {
    securityScore: Math.round(securityScore),
    threatCount,
    privacyIssues,
    performanceIssues,
    vulnerabilities,
    recommendedPlan
  };
}
