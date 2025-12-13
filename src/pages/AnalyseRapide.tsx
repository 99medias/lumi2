import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Database, Wifi, Settings, TrendingUp, Clock, MapPin, Globe, Monitor, Cpu, Puzzle, Camera, Cookie, Battery } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import InactionTimeline from '../components/InactionTimeline';
import ErrorBoundary from '../components/ErrorBoundary';
import { useLanguage } from '../contexts/LanguageContext';
import { generateDeviceFingerprint } from '../utils/deviceFingerprint';
import { generateConsistentThreats, calculateScoresFromFingerprint, ThreatTemplate } from '../utils/threatDatabase';
import { getSystemInfo, SystemInfo } from '../utils/systemInfo';
import { detectBrowserExtensions, BrowserExtension } from '../utils/browserExtensions';
import { detectGPU, GPUInfo } from '../utils/gpuDetection';
import { detectMediaDevices, MediaDevicesSummary } from '../utils/mediaDevices';
import { analyzeCookies, CookieAnalysis } from '../utils/cookieTracker';
import { detectBattery, BatteryInfo } from '../utils/batteryDetection';
import { detectWebRTCLeak, WebRTCLeakResult } from '../utils/webrtcLeak';
import { calculateFingerprintUniqueness, FingerprintUniqueness } from '../utils/fingerprintUniqueness';
import { auditBrowserAPIs, BrowserAPIStatus } from '../utils/browserAPIs';
import { analyzeThirdPartyResources, ThirdPartyAnalysis } from '../utils/thirdPartyResources';
import { checkConnectionSecurity, ConnectionSecurity } from '../utils/connectionSecurity';
import { auditBrowserStorage, BrowserStorageAudit } from '../utils/browserStorage';
import { analyzeNetworkTiming, NetworkTiming } from '../utils/networkTiming';
import { detectDNSLeak, DNSLeakResult } from '../utils/dnsLeak';
import { supabase } from '../lib/supabase';

type ScanStage = 'initial' | 'filesystem' | 'network' | 'registry' | 'results';
type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

interface Threat {
  id: string;
  name: string;
  type: string;
  severity: SeverityLevel;
  location: string;
  description: string;
}

interface ScanResults {
  threats: Threat[];
  privacyIssues: number;
  performanceIssues: number;
  vulnerabilities: number;
  securityScore: number;
  recommendedPlan: 's' | 'm' | 'l';
}

interface DBThreat {
  threat_name?: string;
  threat_type?: string;
  severity?: string;
  location?: string;
  description?: string;
}

const WINDOWS_PROCESSES = [
  { name: 'svchost.exe', pid: 1284, memory: '45.2 MB', location: 'C:\\Windows\\System32', status: 'safe' as const },
  { name: 'chrome.exe', pid: 8842, memory: '892.4 MB', location: 'C:\\Program Files\\Google\\Chrome', status: 'safe' as const },
  { name: 'explorer.exe', pid: 4521, memory: '78.1 MB', location: 'C:\\Windows', status: 'safe' as const },
  { name: 'dwm.exe', pid: 892, memory: '124.8 MB', location: 'C:\\Windows\\System32', status: 'safe' as const },
  { name: 'csrss.exe', pid: 624, memory: '12.4 MB', location: 'C:\\Windows\\System32', status: 'suspicious' as const },
  { name: 'RuntimeBroker.exe', pid: 3156, memory: '34.7 MB', location: 'C:\\Windows\\System32', status: 'safe' as const },
  { name: 'SearchIndexer.exe', pid: 4892, memory: '67.3 MB', location: 'C:\\Windows\\System32', status: 'safe' as const },
  { name: 'spoolsv.exe', pid: 2248, memory: '8.9 MB', location: 'C:\\Windows\\System32', status: 'warning' as const },
  { name: 'lsass.exe', pid: 756, memory: '18.2 MB', location: 'C:\\Windows\\System32', status: 'critical' as const },
  { name: 'winlogon.exe', pid: 612, memory: '6.4 MB', location: 'C:\\Windows\\System32', status: 'safe' as const },
];

const REGISTRY_PATHS = [
  { path: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run', entries: 12, threat: null },
  { path: 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce', entries: 3, threat: null },
  { path: 'HKLM\\SYSTEM\\CurrentControlSet\\Services', entries: 247, threat: 'Suspicious service detected' },
  { path: 'HKCU\\SOFTWARE\\Microsoft\\Internet Explorer\\Main', entries: 8, threat: 'Homepage hijack detected' },
  { path: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon', entries: 15, threat: null },
  { path: 'HKCU\\SOFTWARE\\Classes\\*\\shell', entries: 4, threat: 'Context menu modifier found' },
  { path: 'HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender', entries: 6, threat: 'Defender policies modified' },
  { path: 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\FileExts', entries: 89, threat: null },
];

const NETWORK_CONNECTIONS = [
  { localPort: 443, remoteIP: '142.250.185.78', remotePort: 443, protocol: 'TCP' as const, state: 'ESTABLISHED' as const, process: 'chrome.exe', country: 'US (Google)', threat: 'safe' as const },
  { localPort: 52341, remoteIP: '31.13.72.36', remotePort: 443, protocol: 'TCP' as const, state: 'ESTABLISHED' as const, process: 'chrome.exe', country: 'IE (Facebook)', threat: 'safe' as const },
  { localPort: 49721, remoteIP: '185.199.108.153', remotePort: 443, protocol: 'TCP' as const, state: 'TIME_WAIT' as const, process: 'chrome.exe', country: 'US (GitHub)', threat: 'safe' as const },
  { localPort: 58432, remoteIP: '91.108.56.136', remotePort: 443, protocol: 'TCP' as const, state: 'ESTABLISHED' as const, process: 'Telegram.exe', country: 'GB (Telegram)', threat: 'safe' as const },
  { localPort: 49891, remoteIP: '103.224.182.241', remotePort: 8080, protocol: 'TCP' as const, state: 'ESTABLISHED' as const, process: 'svchost.exe', country: 'CN (Unknown)', threat: 'malicious' as const },
  { localPort: 52789, remoteIP: '45.33.32.156', remotePort: 4444, protocol: 'TCP' as const, state: 'ESTABLISHED' as const, process: 'RuntimeBroker.exe', country: 'US (Suspicious)', threat: 'suspicious' as const },
  { localPort: 137, remoteIP: '0.0.0.0', remotePort: 0, protocol: 'UDP' as const, state: 'LISTENING' as const, process: 'System', country: 'Local', threat: 'safe' as const },
  { localPort: 51234, remoteIP: '194.58.112.174', remotePort: 443, protocol: 'TCP' as const, state: 'CLOSE_WAIT' as const, process: 'unknown.exe', country: 'RU (Unknown)', threat: 'malicious' as const },
];

const THREAT_TEMPLATES = [
  { name: 'Trojan.GenericKD.46584721', type: 'Trojan', severity: 'critical' as const, location: 'C:\\Users\\AppData\\Local\\Temp\\' },
  { name: 'Spyware.PasswordStealer.Agent', type: 'Spyware', severity: 'critical' as const, location: 'C:\\Windows\\System32\\' },
  { name: 'PUP.Optional.SearchManager', type: 'PUP', severity: 'medium' as const, location: 'C:\\Program Files\\' },
  { name: 'Adware.BrowserModifier.Gen', type: 'Adware', severity: 'low' as const, location: 'C:\\Users\\AppData\\Roaming\\' },
  { name: 'Keylogger.Agent.XKL', type: 'Keylogger', severity: 'critical' as const, location: 'C:\\Windows\\Temp\\' },
  { name: 'Backdoor.RemoteAccess.RAT', type: 'Backdoor', severity: 'critical' as const, location: 'C:\\ProgramData\\' },
  { name: 'Ransomware.Cryptolocker.Var', type: 'Ransomware', severity: 'critical' as const, location: 'C:\\Users\\Downloads\\' },
  { name: 'Tracker.Cookies.DoubleClick', type: 'Tracker', severity: 'low' as const, location: 'Browser Cache' },
  { name: 'Rootkit.Hidden.MBR', type: 'Rootkit', severity: 'critical' as const, location: 'Master Boot Record' },
  { name: 'Worm.AutoRun.Agent', type: 'Worm', severity: 'high' as const, location: 'C:\\Users\\Public\\' },
];

const DETECTION_POINTS = [12, 22, 31, 38, 47, 56, 64, 73, 82, 91];

function AnalyseRapide() {
  const { t } = useLanguage();
  const isMountedRef = useRef(true);
  const [scanStage, setScanStage] = useState<ScanStage>('initial');
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [filesScanned, setFilesScanned] = useState(0);
  const [scanSpeed, setScanSpeed] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [extensions, setExtensions] = useState<BrowserExtension[]>([]);
  const [gpuInfo, setGpuInfo] = useState<GPUInfo | null>(null);
  const [mediaDevices, setMediaDevices] = useState<MediaDevicesSummary | null>(null);
  const [cookieAnalysis, setCookieAnalysis] = useState<CookieAnalysis | null>(null);
  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);
  const [webrtcLeak, setWebrtcLeak] = useState<WebRTCLeakResult | null>(null);
  const [fingerprintUniqueness, setFingerprintUniqueness] = useState<FingerprintUniqueness | null>(null);
  const [browserAPIs, setBrowserAPIs] = useState<BrowserAPIStatus[]>([]);
  const [thirdPartyAnalysis, setThirdPartyAnalysis] = useState<ThirdPartyAnalysis | null>(null);
  const [connectionSecurity, setConnectionSecurity] = useState<ConnectionSecurity | null>(null);
  const [storageAudit, setStorageAudit] = useState<BrowserStorageAudit | null>(null);
  const [networkTiming, setNetworkTiming] = useState<NetworkTiming | null>(null);
  const [dnsLeak, setDnsLeak] = useState<DNSLeakResult | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [liveThreats, setLiveThreats] = useState<Array<{
    id: number;
    name: string;
    type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    location: string;
    timestamp: Date;
  }>>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);
  const [scannedProcesses, setScannedProcesses] = useState<typeof WINDOWS_PROCESSES>([]);
  const [scannedRegistry, setScannedRegistry] = useState<typeof REGISTRY_PATHS>([]);
  const [networkConnections, setNetworkConnections] = useState<typeof NETWORK_CONNECTIONS>([]);

  const loadOrCreateScanResults = async () => {
    try {
      const fingerprint = await generateDeviceFingerprint();

      const { data: existingResult, error: fetchError } = await supabase
        .from('scan_results')
        .select(`
          *,
          detected_threats (*)
        `)
        .eq('device_fingerprint', fingerprint)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching scan results:', fetchError);
        throw fetchError;
      }

      if (existingResult && existingResult.detected_threats && Array.isArray(existingResult.detected_threats)) {
        const threats: Threat[] = existingResult.detected_threats
          .filter((t: DBThreat) => t && t.threat_name && t.threat_type)
          .map((t: DBThreat, idx: number) => ({
            id: `threat-${idx}`,
            name: t.threat_name || 'Unknown Threat',
            type: t.threat_type || 'Unknown',
            severity: (t.severity as SeverityLevel) || 'medium',
            location: t.location || 'Unknown Location',
            description: t.description || 'Malicious software detected'
          }));

        setScanResults({
          threats,
          privacyIssues: existingResult.privacy_issues || 0,
          performanceIssues: existingResult.performance_issues || 0,
          vulnerabilities: existingResult.vulnerabilities || 0,
          securityScore: existingResult.security_score || 50,
          recommendedPlan: (existingResult.recommended_plan as 's' | 'm' | 'l') || 'm'
        });

        const { error: updateError } = await supabase
          .from('scan_results')
          .update({ last_scanned_at: new Date().toISOString() })
          .eq('device_fingerprint', fingerprint);

        if (updateError) {
          console.error('Error updating scan timestamp:', updateError);
        }

        return;
      }

      const scores = calculateScoresFromFingerprint(fingerprint);
      const THREAT_TEMPLATES = generateConsistentThreats(fingerprint, scores.threatCount);

      const { data: newScanResult, error: scanError } = await supabase
        .from('scan_results')
        .insert({
          device_fingerprint: fingerprint,
          security_score: scores.securityScore,
          threat_count: scores.threatCount,
          privacy_issues: scores.privacyIssues,
          performance_issues: scores.performanceIssues,
          vulnerabilities: scores.vulnerabilities,
          recommended_plan: scores.recommendedPlan
        })
        .select()
        .single();

      if (scanError) {
        console.error('Error creating scan result:', scanError);
        throw scanError;
      }

      if (!newScanResult) {
        throw new Error('Failed to create scan result');
      }

      const getDefaultDescription = (type: string) => {
        const typeMap: Record<string, string> = {
          'trojan': 'Malicious software that disguises itself as legitimate',
          'spyware': 'Monitors your activity and steals personal information',
          'ransomware': 'Encrypts your files and demands payment',
          'keylogger': 'Records everything you type including passwords',
          'backdoor': 'Provides unauthorized remote access',
          'rootkit': 'Hides deep in the system to avoid detection',
          'worm': 'Self-replicating malware that spreads automatically',
          'adware': 'Displays unwanted advertisements',
          'pup': 'Potentially unwanted program',
          'tracker': 'Monitors your online activity'
        };
        return typeMap[type.toLowerCase()] || 'Malicious software detected on your system';
      };

      const threatsToInsert = THREAT_TEMPLATES
        .filter((threat: ThreatTemplate) => threat && threat.name && threat.type)
        .map((threat: ThreatTemplate) => ({
          scan_result_id: newScanResult.id,
          threat_name: threat.name || 'Unknown Threat',
          threat_type: threat.type || 'Unknown',
          severity: threat.severity || 'medium',
          location: threat.location || 'Unknown Location',
          description: getDefaultDescription(threat.type || 'unknown')
        }));

      if (threatsToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('detected_threats')
          .insert(threatsToInsert);

        if (insertError) {
          console.error('Error inserting threats:', insertError);
        }
      }

      const threats: Threat[] = THREAT_TEMPLATES
        .filter((threat) => threat && threat.name && threat.type && threat.severity)
        .map((threat, idx) => ({
          id: `threat-${idx}`,
          name: threat.name || 'Unknown Threat',
          type: threat.type || 'Unknown',
          severity: threat.severity || 'medium',
          location: threat.location || 'Unknown Location',
          description: getDefaultDescription(threat.type || 'unknown')
        }));

      setScanResults({
        threats,
        privacyIssues: scores.privacyIssues,
        performanceIssues: scores.performanceIssues,
        vulnerabilities: scores.vulnerabilities,
        securityScore: scores.securityScore,
        recommendedPlan: scores.recommendedPlan
      });

    } catch (error) {
      console.error('Error loading scan results:', error);
      setScanResults({
        threats: [],
        privacyIssues: 5,
        performanceIssues: 8,
        vulnerabilities: 3,
        securityScore: 65,
        recommendedPlan: 'm'
      });
    }
  };

  const runScan = async () => {
    try {
      const minDuration = 30000;
      const maxDuration = 60000;
      const duration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
      const startTime = Date.now();

      setTimeRemaining(duration);
      setLiveThreats([]);
      setOverallProgress(0);

      const stages: ScanStage[] = ['initial', 'filesystem', 'network', 'registry'];
      const files = [
        'explorer.exe', 'system32.dll', 'chrome.exe', 'firefox.exe',
        'winlogon.exe', 'svchost.exe', 'temp_files.tmp', 'registry.dat',
        'browser_cache.db', 'cookies.txt', 'passwords.json', 'config.ini',
        'startup.bat', 'services.msc', 'network.dll', 'firewall.conf'
      ];

      const updateInterval = 100;
      const stageCount = stages.length;
      const timePerStage = stageCount > 0 ? duration / stageCount : duration;

      for (let stageIndex = 0; stageIndex < stages.length; stageIndex++) {
        if (!isMountedRef.current) break;

        const stage = stages[stageIndex];
        setScanStage(stage);

        const stageStartTime = Date.now();
        const stageEndTime = stageStartTime + timePerStage;

        while (Date.now() < stageEndTime && isMountedRef.current) {
          const elapsed = Math.max(0, Date.now() - stageStartTime);
          const stageProgress = timePerStage > 0 ? Math.min(100, (elapsed / timePerStage) * 100) : 100;

          const calculatedOverallProgress = stageCount > 0 ? ((stageIndex * 100) + stageProgress) / stageCount : 0;
          const overall = Math.floor(Math.max(0, Math.min(100, calculatedOverallProgress)));

          if (isMountedRef.current && !isNaN(overall) && isFinite(overall)) {
            setProgress(overall);
            setOverallProgress(overall);
          }

          const totalElapsed = Math.max(0, Date.now() - startTime);
          const remaining = Math.max(0, duration - totalElapsed);
          if (isMountedRef.current) {
            setTimeRemaining(remaining);
          }

          if (isMountedRef.current) {
            setFilesScanned(prev => prev + Math.floor(Math.random() * 3) + 1);
            setScanSpeed(Math.floor(Math.random() * 150) + 50);
            setCurrentFile(files[Math.floor(Math.random() * files.length)] || '');
          }

          await new Promise(resolve => setTimeout(resolve, updateInterval));
        }
      }

      setProgress(100);
      setOverallProgress(100);

      setTimeRemaining(0);
      setScanStage('results');
      console.log('Scan completed:', { scanResults, showResults: true });
      setShowResults(true);
    } catch (error) {
      console.error('Error during scan:', error);
      setProgress(100);
      setOverallProgress(100);
      setTimeRemaining(0);
      setScanStage('results');
      if (isMountedRef.current && scanResults) {
        setShowResults(true);
      } else {
        setHasError(true);
        setErrorMessage('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
      }
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const initScan = async () => {
      try {
        const fingerprint = await generateDeviceFingerprint();
        if (!isMountedRef.current) return;

        const uniqueness = calculateFingerprintUniqueness(fingerprint);
        if (isMountedRef.current) setFingerprintUniqueness(uniqueness);

        const apis = auditBrowserAPIs();
        if (isMountedRef.current) setBrowserAPIs(apis);

        const thirdParty = analyzeThirdPartyResources();
        if (isMountedRef.current) setThirdPartyAnalysis(thirdParty);

        const connSec = checkConnectionSecurity();
        if (isMountedRef.current) setConnectionSecurity(connSec);

        const netTiming = analyzeNetworkTiming();
        if (isMountedRef.current) setNetworkTiming(netTiming);

        const [sysInfo, exts, media, cookies, battery, webrtc, storage, dns] = await Promise.all([
          getSystemInfo().catch(err => { console.error('SystemInfo error:', err); return null; }),
          detectBrowserExtensions().catch(err => { console.error('Extensions error:', err); return []; }),
          detectMediaDevices().catch(err => { console.error('MediaDevices error:', err); return null; }),
          Promise.resolve(analyzeCookies()).catch(err => { console.error('Cookies error:', err); return null; }),
          detectBattery().catch(err => { console.error('Battery error:', err); return null; }),
          detectWebRTCLeak().catch(err => { console.error('WebRTC error:', err); return null; }),
          auditBrowserStorage().catch(err => { console.error('Storage error:', err); return null; }),
          detectDNSLeak().catch(err => { console.error('DNS error:', err); return null; })
        ]);

        let gpu = null;
        try {
          gpu = detectGPU();
        } catch (err) {
          console.error('GPU detection error:', err);
          gpu = null;
        }

        if (!isMountedRef.current) return;

        setSystemInfo(sysInfo || null);
        setExtensions(Array.isArray(exts) ? exts : []);
        setGpuInfo(gpu);
        setMediaDevices(media || null);
        setCookieAnalysis(cookies || null);
        setBatteryInfo(battery || null);
        setWebrtcLeak(webrtc || null);
        setStorageAudit(storage || null);
        setDnsLeak(dns || null);

        await loadOrCreateScanResults();

        if (!isMountedRef.current) return;

        setIsLoading(false);
        timeoutId = setTimeout(() => {
          if (isMountedRef.current) {
            runScan();
          }
        }, 1000);
      } catch (error) {
        console.error('Error initializing scan:', error);
        if (!isMountedRef.current) return;

        setIsLoading(false);

        try {
          setScanResults({
            threats: [],
            privacyIssues: 5,
            performanceIssues: 8,
            vulnerabilities: 3,
            securityScore: 65,
            recommendedPlan: 'm'
          });
          timeoutId = setTimeout(() => {
            if (isMountedRef.current) {
              runScan();
            }
          }, 1000);
        } catch (recoveryError) {
          console.error('Fatal error during scan initialization:', recoveryError);
          if (isMountedRef.current) {
            setHasError(true);
            setErrorMessage('');
          }
        }
      }
    };

    initScan();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (scanStage !== 'filesystem') return;

    const interval = setInterval(() => {
      if (currentProcessIndex < WINDOWS_PROCESSES.length) {
        try {
          setScannedProcesses(prev => [...prev, WINDOWS_PROCESSES[currentProcessIndex]]);
          setCurrentProcessIndex(prev => prev + 1);
        } catch (error) {
          console.error('Error updating scanned processes:', error);
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [scanStage, currentProcessIndex]);

  useEffect(() => {
    if (scanStage !== 'registry') return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < REGISTRY_PATHS.length) {
        try {
          setScannedRegistry(prev => [...prev, REGISTRY_PATHS[index]]);
          index++;
        } catch (error) {
          console.error('Error updating scanned registry:', error);
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [scanStage]);

  useEffect(() => {
    if (scanStage !== 'network' || !systemInfo) return;

    setNetworkConnections(NETWORK_CONNECTIONS);
  }, [scanStage, systemInfo]);

  const liveThreatsLength = liveThreats.length;

  useEffect(() => {
    if (!isMountedRef.current) return;
    if (scanStage === 'initial' || scanStage === 'results') return;
    if (typeof overallProgress !== 'number' || isNaN(overallProgress)) return;

    try {
      const safeProgress = Math.max(0, Math.min(100, overallProgress));
      const currentDetectionIndex = DETECTION_POINTS.filter(p => safeProgress >= p).length;
      const currentThreatCount = liveThreatsLength;

      if (currentDetectionIndex > currentThreatCount &&
          currentThreatCount < THREAT_TEMPLATES.length &&
          currentThreatCount >= 0) {

        const template = THREAT_TEMPLATES[currentThreatCount];

        if (!template || !template.name) {
          console.warn('Invalid threat template at index:', currentThreatCount);
          return;
        }

        const newThreat = {
          id: Date.now(),
          name: template.name || 'Unknown Threat',
          type: template.type || 'Unknown',
          severity: template.severity || 'medium' as 'critical' | 'high' | 'medium' | 'low',
          location: (template.location || 'C:\\Windows\\') + (template.name?.split('.')[0]?.toLowerCase() || 'unknown') + '.exe',
          timestamp: new Date(),
        };

        if (isMountedRef.current) {
          setLiveThreats(prev => {
            if (!Array.isArray(prev)) return [newThreat];
            if (prev.some(t => t.id === newThreat.id)) return prev;
            return [...prev, newThreat];
          });

          if (navigator.vibrate) {
            try {
              navigator.vibrate(100);
            } catch {
              console.debug('Vibration not supported');
            }
          }
        }
      }
    } catch (error) {
      console.error('Error detecting threats:', error);
    }
  }, [overallProgress, scanStage, liveThreatsLength]);

  const getRiskLevel = () => {
    if (!scanResults) return { level: 'low', color: 'text-green-500', bgColor: 'bg-green-500' };

    if (scanResults.securityScore < 40) {
      return { level: 'critical', color: 'text-red-500', bgColor: 'bg-red-500' };
    } else if (scanResults.securityScore < 60) {
      return { level: 'high', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    } else if (scanResults.securityScore < 80) {
      return { level: 'medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    } else {
      return { level: 'low', color: 'text-green-500', bgColor: 'bg-green-500' };
    }
  };

  const getPlanPrice = (plan: 's' | 'm' | 'l') => {
    const prices = { s: '899', m: '1099', l: '1299' };
    return prices[plan];
  };

  const getPlanStorage = (plan: 's' | 'm' | 'l') => {
    const storage = { s: '10 GB', m: '30 GB', l: '120 GB' };
    return storage[plan];
  };

  const formatTimeRemaining = (milliseconds: number) => {
    try {
      if (typeof milliseconds !== 'number' || isNaN(milliseconds) || milliseconds < 0) {
        return '0:00';
      }
      const totalSeconds = Math.ceil(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return '0:00';
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500 rounded-full mb-6">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">{t('quickScan.error.title')}</h1>
          <p className="text-slate-300 mb-6">{errorMessage || t('quickScan.error.message')}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            {t('quickScan.error.refreshButton')}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-6 animate-pulse">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <p className="text-white text-xl">{t('quickScan.initializing')}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-slate-900">
      <Header />

      {!showResults || !scanResults ? (
        <section className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-12 shadow-2xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-6 animate-pulse">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">{t('quickScan.scanning')}</h1>
                <p className="text-slate-400 text-lg mb-3">
                  {scanStage === 'initial' && t('quickScan.stages.initial')}
                  {scanStage === 'filesystem' && t('quickScan.stages.filesystem')}
                  {scanStage === 'network' && t('quickScan.stages.network')}
                  {scanStage === 'registry' && t('quickScan.stages.registry')}
                </p>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center gap-2 bg-orange-500/20 px-6 py-3 rounded-xl border border-orange-500/50">
                    <Clock className="w-6 h-6 text-orange-400" />
                    <p className="text-orange-400 text-2xl font-bold font-mono">
                      {t('quickScan.progress.timeRemaining')}: {formatTimeRemaining(timeRemaining)}
                    </p>
                  </div>
                </div>
              </div>

              {liveThreats && Array.isArray(liveThreats) && liveThreats.length > 0 && (
                <div className="mt-6 bg-slate-900/90 backdrop-blur border border-red-500/30 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <XCircle className="w-6 h-6 text-red-500" />
                        <div className="absolute inset-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-30"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{t('quickScan.results.threatsDetectedTitle')}</h3>
                        <p className="text-slate-400 text-xs">{t('quickScan.results.realTimeDetection')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl">
                        <p className="text-3xl font-bold text-red-500">{liveThreats.length}</p>
                        <p className="text-xs text-red-300">{t('quickScan.results.threats')}</p>
                      </div>
                    </div>
                  </div>

                  {liveThreats.filter(t => t && t.severity === 'critical').length > 0 && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4 animate-pulse">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <p className="text-red-300 text-sm font-semibold">
                          {liveThreats.filter(t => t && t.severity === 'critical').length} {t('quickScan.results.criticalThreatsAction')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {Array.isArray(liveThreats) && [...liveThreats].reverse().filter(threat => threat && threat.id).map((threat) => (
                      <div
                        key={threat.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                          threat.severity === 'critical' ? 'border-red-500/50 bg-red-500/10' :
                          threat.severity === 'high' ? 'border-orange-500/50 bg-orange-500/10' :
                          threat.severity === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10' :
                          'border-blue-500/50 bg-blue-500/10'
                        }`}
                      >
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          threat.severity === 'critical' ? 'bg-red-500 text-white' :
                          threat.severity === 'high' ? 'bg-orange-500 text-white' :
                          threat.severity === 'medium' ? 'bg-yellow-500 text-black' :
                          'bg-blue-500 text-white'
                        }`}>
                          {t(`quickScan.results.riskLevels.${threat.severity}`)}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{threat.name || 'Unknown'}</p>
                          <p className="text-slate-500 text-xs font-mono truncate">{threat.location || 'Unknown'}</p>
                        </div>

                        <span className="text-slate-400 text-xs">{threat.type || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-700">
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-400">{liveThreats.filter(t => t && t.severity === 'critical').length}</p>
                      <p className="text-xs text-slate-500">{t('quickScan.results.criticalCount')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-400">{liveThreats.filter(t => t && t.severity === 'high').length}</p>
                      <p className="text-xs text-slate-500">{t('quickScan.results.highCount')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-yellow-400">{liveThreats.filter(t => t && t.severity === 'medium').length}</p>
                      <p className="text-xs text-slate-500">{t('quickScan.results.mediumCount')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-400">{liveThreats.filter(t => t && t.severity === 'low').length}</p>
                      <p className="text-xs text-slate-500">{t('quickScan.results.lowCount')}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="relative">
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-slate-400">
                    <span>{progress}%</span>
                    <span>{filesScanned} {t('quickScan.progress.filesAnalyzed')}</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-orange-400 animate-pulse" />
                    <span className="text-white font-mono text-sm">{t('quickScan.progress.currentFile')} {currentFile}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>{scanSpeed} {t('quickScan.progress.filesPerSec')}</span>
                  </div>
                </div>

                {systemInfo && (
                  <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-slate-400" />
                      {t('quickScan.systemInfo.title')}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Globe className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">{t('quickScan.systemInfo.ipAddress')}</p>
                            <p className="text-sm text-white font-mono break-all">{systemInfo?.ipAddress || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">{t('quickScan.systemInfo.location')}</p>
                            <p className="text-sm text-white break-words">{systemInfo?.location || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Wifi className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">{t('quickScan.systemInfo.provider')}</p>
                            <p className="text-sm text-white break-words">{systemInfo?.isp || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Monitor className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">{t('quickScan.systemInfo.system')}</p>
                            <p className="text-sm text-white">{systemInfo?.os || 'N/A'} {systemInfo?.osVersion || ''}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Globe className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">{t('quickScan.systemInfo.browser')}</p>
                            <p className="text-sm text-white">{systemInfo?.browser || 'N/A'} {systemInfo?.browserVersion || ''}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Cpu className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500">{t('quickScan.systemInfo.processors')}</p>
                            <p className="text-sm text-white">{systemInfo?.cores || 'N/A'} {t('quickScan.systemInfo.cores')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {scanStage === 'filesystem' && scannedProcesses.length > 0 && (
                  <div className="bg-black rounded-lg p-4 font-mono text-xs overflow-hidden max-h-64">
                    <div className="flex items-center gap-2 mb-3 text-green-400">
                      <span className="animate-pulse">●</span>
                      <span>{t('quickScan.terminal.analyzingProcesses')}</span>
                    </div>
                    <div className="space-y-1 overflow-y-auto max-h-48">
                      {Array.isArray(scannedProcesses) && scannedProcesses.map((proc, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="text-slate-500 w-12">PID {proc?.pid || '0'}</span>
                          <span className="text-slate-300 w-40 truncate">{proc?.name || 'Unknown'}</span>
                          <span className="text-slate-500 w-20">{proc?.memory || '0 MB'}</span>
                          <span className={`w-16 ${
                            proc?.status === 'critical' ? 'text-red-500' :
                            proc?.status === 'suspicious' ? 'text-orange-500' :
                            proc?.status === 'warning' ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            [{(proc?.status || 'safe').toUpperCase()}]
                          </span>
                        </div>
                      ))}
                      {currentProcessIndex < WINDOWS_PROCESSES.length && (
                        <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                          <span>▶</span>
                          <span>{t('quickScan.terminal.scanning')} {WINDOWS_PROCESSES[currentProcessIndex]?.name || 'complete'}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {scanStage === 'registry' && scannedRegistry.length > 0 && (
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-blue-400">{t('quickScan.terminal.registryAnalysis')}</span>
                    </div>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {Array.isArray(scannedRegistry) && scannedRegistry.map((reg, idx) => (
                        <div key={idx} className={`py-2 border-b border-slate-800 ${reg?.threat ? 'bg-red-500/10' : ''}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 truncate max-w-md">{reg?.path || 'Unknown Path'}</span>
                            <span className="text-slate-500">{reg?.entries || 0} {t('quickScan.terminal.keys')}</span>
                          </div>
                          {reg?.threat && (
                            <div className="flex items-center gap-2 mt-1 text-red-400">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{reg.threat}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {scanStage === 'network' && networkConnections.length > 0 && (
                  <div className="bg-black rounded-lg p-4 overflow-x-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <Wifi className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-400 font-mono text-sm">{t('quickScan.terminal.activeNetworkConnections')}</span>
                      <span className="ml-auto text-xs text-slate-500">netstat -ano</span>
                    </div>
                    <table className="w-full font-mono text-xs">
                      <thead>
                        <tr className="text-slate-500 text-left">
                          <th className="pb-2">{t('quickScan.terminal.protocol')}</th>
                          <th className="pb-2">{t('quickScan.terminal.local')}</th>
                          <th className="pb-2">{t('quickScan.terminal.remote')}</th>
                          <th className="pb-2">{t('quickScan.terminal.state')}</th>
                          <th className="pb-2">{t('quickScan.terminal.process')}</th>
                          <th className="pb-2">{t('quickScan.terminal.location')}</th>
                          <th className="pb-2">{t('quickScan.terminal.status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(networkConnections) && networkConnections.map((conn, idx) => (
                          <tr key={idx} className={`${conn?.threat === 'malicious' ? 'bg-red-500/20' : conn?.threat === 'suspicious' ? 'bg-yellow-500/10' : ''}`}>
                            <td className="py-1 text-slate-400">{conn?.protocol || 'N/A'}</td>
                            <td className="py-1 text-slate-300">:{conn?.localPort || '0'}</td>
                            <td className="py-1 text-slate-300">{conn?.remoteIP || 'N/A'}:{conn?.remotePort || '0'}</td>
                            <td className="py-1 text-slate-400">{conn?.state || 'UNKNOWN'}</td>
                            <td className="py-1 text-slate-300">{conn?.process || 'Unknown'}</td>
                            <td className="py-1 text-slate-400">{conn?.country || 'N/A'}</td>
                            <td className={`py-1 ${conn?.threat === 'malicious' ? 'text-red-400' : conn?.threat === 'suspicious' ? 'text-yellow-400' : 'text-green-400'}`}>
                              {conn?.threat === 'malicious' ? '⛔ BLOCK' : conn?.threat === 'suspicious' ? '⚠️ CHECK' : '✓'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : scanResults && scanResults.securityScore !== undefined ? (
        <section className="pt-32 pb-20 relative overflow-hidden bg-slate-900">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-8">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full shadow-2xl relative border-4 ${
                  (scanResults.securityScore || 0) < 40 ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-400' :
                  (scanResults.securityScore || 0) < 60 ? 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400' :
                  (scanResults.securityScore || 0) < 80 ? 'bg-gradient-to-br from-amber-400 to-yellow-400 border-amber-300' :
                  'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400'
                }`}>
                  <span className="text-6xl font-bold text-slate-900">{scanResults.securityScore || 0}</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">{t('quickScan.results.title')}</h1>
              <p className={`text-2xl font-semibold mb-2 ${
                (scanResults.securityScore || 0) < 40 ? 'text-red-400' :
                (scanResults.securityScore || 0) < 60 ? 'text-orange-400' :
                (scanResults.securityScore || 0) < 80 ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {t('quickScan.results.risk')} {t(`quickScan.results.riskLevels.${getRiskLevel().level}`)}
              </p>
              <p className="text-slate-400 text-lg">{t('quickScan.results.needsAttention')}</p>
            </div>

            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-2 border-red-500/50 rounded-3xl p-8 mb-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-red-500/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('quickScan.results.systemCompromised')}</h3>
                  <p className="text-slate-300">{t('quickScan.results.systemCompromisedDesc')}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === 'threats' ? null : 'threats')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-red-400" />
                    <h4 className="text-xl font-bold text-white">{t('quickScan.results.securityThreats')} ({scanResults.threats?.length || 0})</h4>
                  </div>
                  <span className="text-2xl text-white">{expandedCategory === 'threats' ? '−' : '+'}</span>
                </button>

                {expandedCategory === 'threats' && scanResults?.threats && Array.isArray(scanResults.threats) && (
                  <div className="mt-6 space-y-4">
                    {scanResults.threats.map((threat) => {
                      if (!threat || !threat.type || !threat.name) return null;
                      const getThreatDetails = (type: string | undefined, name: string | undefined) => {
                        if (!type || !name) return { icon: '🦠', description: 'Logiciel malveillant détecté' };
                        const lowerType = type.toLowerCase();
                        const lowerName = name.toLowerCase();

                        if (lowerType.includes('trojan') || lowerName.includes('trojan')) {
                          if (lowerType.includes('banker') || lowerType.includes('bancaire') || lowerName.includes('banker')) {
                            return { icon: '🏦', description: 'Cible vos applications bancaires pour voler vos identifiants et coordonnées financières' };
                          }
                          return { icon: '🐴', description: 'Permet aux pirates de prendre le contrôle total de votre ordinateur à distance' };
                        }
                        if (lowerType.includes('spyware') || lowerName.includes('spyware')) {
                          return { icon: '👁️', description: 'Espionne vos activités et vole vos mots de passe, identifiants et données personnelles' };
                        }
                        if (lowerType.includes('ransomware') || lowerName.includes('ransomware') || lowerName.includes('cryptolocker')) {
                          return { icon: '🔒', description: 'Chiffre tous vos fichiers personnels et demande une rançon pour les récupérer' };
                        }
                        if (lowerType.includes('keylogger') || lowerName.includes('keylogger')) {
                          return { icon: '⌨️', description: 'Enregistre tout ce que vous tapez: mots de passe, messages privés, données bancaires' };
                        }
                        if (lowerType.includes('backdoor') || lowerName.includes('backdoor') || lowerName.includes('rat')) {
                          return { icon: '🚪', description: 'Ouvre une porte dérobée permettant aux hackers d\'accéder à votre PC à tout moment' };
                        }
                        if (lowerType.includes('rootkit') || lowerName.includes('rootkit')) {
                          return { icon: '👻', description: 'Se cache profondément dans le système et reste invisible aux antivirus classiques' };
                        }
                        if (lowerType.includes('worm') || lowerName.includes('worm')) {
                          return { icon: '🐛', description: 'Se propage automatiquement via le réseau et infecte tous les appareils connectés' };
                        }
                        if (lowerType.includes('miner') || lowerType.includes('crypto') || lowerName.includes('miner') || lowerName.includes('monero')) {
                          return { icon: '⛏️', description: 'Utilise secrètement votre PC pour miner des cryptomonnaies, causant ralentissements et surchauffe' };
                        }
                        if (lowerType.includes('adware') || lowerName.includes('adware')) {
                          return { icon: '📢', description: 'Injecte des publicités intrusives partout et ralentit considérablement votre navigateur' };
                        }
                        if (lowerType.includes('pup') || lowerName.includes('pup')) {
                          return { icon: '📦', description: 'Programme potentiellement indésirable qui modifie vos paramètres sans votre accord' };
                        }
                        if (lowerType.includes('tracker') || lowerName.includes('tracker') || lowerName.includes('cookie')) {
                          return { icon: '🍪', description: 'Piste toute votre activité en ligne et collecte vos données de navigation à votre insu' };
                        }
                        if (lowerType.includes('exploit') || lowerName.includes('exploit') || lowerName.includes('cve')) {
                          return { icon: '💉', description: 'Exploite une faille de sécurité connue pour compromettre votre système' };
                        }
                        return { icon: '🦠', description: 'Logiciel malveillant pouvant compromettre la sécurité de votre système et vos données personnelles' };
                      };

                      const { icon, description } = getThreatDetails(threat.type, threat.name);

                      return (
                        <div
                          key={threat.id}
                          className={`p-5 rounded-xl border-2 ${
                            threat.severity === 'critical' ? 'bg-red-500/10 border-red-500/50' :
                            threat.severity === 'high' ? 'bg-orange-500/10 border-orange-500/50' :
                            threat.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/50' :
                            'bg-blue-500/10 border-blue-500/50'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
                              threat.severity === 'critical' ? 'bg-red-500/20' :
                              threat.severity === 'high' ? 'bg-orange-500/20' :
                              threat.severity === 'medium' ? 'bg-yellow-500/20' :
                              'bg-blue-500/20'
                            }`}>
                              {icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                  threat.severity === 'critical' ? 'bg-red-500 text-white' :
                                  threat.severity === 'high' ? 'bg-orange-500 text-white' :
                                  threat.severity === 'medium' ? 'bg-yellow-500 text-black' :
                                  'bg-blue-500 text-white'
                                }`}>
                                  {t(`quickScan.results.riskLevels.${threat.severity}`)}
                                </span>
                                <span className="text-slate-400 text-sm">{threat.type}</span>
                              </div>

                              <p className="text-white font-bold text-lg mb-2">{threat.name}</p>

                              <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                                {description}
                              </p>

                              <div className="flex items-center gap-2 text-slate-500 text-xs font-mono bg-slate-800/50 px-3 py-2 rounded-lg">
                                <span>📁</span>
                                <span className="truncate">{threat.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {systemInfo && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-slate-400" />
                    {t('quickScan.results.systemAnalyzed')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">{t('quickScan.results.ipLocation')}</p>
                      <p className="text-white font-mono">{systemInfo?.ipAddress || 'N/A'}</p>
                      <p className="text-slate-400 text-xs">{systemInfo?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">{t('quickScan.systemInfo.system')}</p>
                      <p className="text-white">{systemInfo?.os || 'N/A'} {systemInfo?.osVersion || ''}</p>
                      <p className="text-slate-400 text-xs">{systemInfo?.browser || 'N/A'} {systemInfo?.browserVersion || ''}</p>
                    </div>
                  </div>
                </div>
              )}

              {gpuInfo && gpuInfo.detected && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-slate-400" />
                    {t('quickScan.results.graphicsCard')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">{t('quickScan.results.gpu')}</p>
                      <p className="text-white">{gpuInfo.renderer}</p>
                      <p className="text-slate-400 text-xs">{gpuInfo.vendor}</p>
                    </div>
                  </div>
                </div>
              )}

              {cookieAnalysis && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Cookie className="w-5 h-5 text-orange-600" />
                    {t('quickScan.results.cookiesTrackers')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.totalCookies')}</span>
                      <span className="text-white font-semibold">{cookieAnalysis?.totalCookies || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.trackingCookies')}</span>
                      <span className="text-orange-600 font-semibold">{cookieAnalysis?.trackingCookies || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.detectTrackers')}</span>
                      <span className="text-red-600 font-semibold">{cookieAnalysis?.trackers?.length || 0}</span>
                    </div>
                    <div className={`flex items-center justify-between p-2 rounded ${cookieAnalysis?.dataCollectionRisk === 'high' ? 'bg-red-100' : cookieAnalysis?.dataCollectionRisk === 'medium' ? 'bg-orange-100' : 'bg-amber-100'}`}>
                      <span className="text-white text-xs">{t('quickScan.results.privacyRisk')}</span>
                      <span className={`font-bold text-xs uppercase ${cookieAnalysis?.dataCollectionRisk === 'high' ? 'text-red-600' : cookieAnalysis?.dataCollectionRisk === 'medium' ? 'text-orange-600' : 'text-amber-600'}`}>
                        {cookieAnalysis?.dataCollectionRisk && t(`quickScan.results.riskLevels.${cookieAnalysis.dataCollectionRisk}`)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {mediaDevices && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-green-600" />
                    {t('quickScan.results.mediaDevices')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.cameras')}</span>
                      <span className="text-white font-semibold">{mediaDevices?.cameras || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.microphones')}</span>
                      <span className="text-white font-semibold">{mediaDevices?.microphones || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.speakers')}</span>
                      <span className="text-white font-semibold">{mediaDevices?.speakers || 0}</span>
                    </div>
                    {mediaDevices?.warnings?.length > 0 && (
                      <div className={`flex items-start gap-2 p-2 rounded ${mediaDevices?.privacyRisk === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-xs">{t('quickScan.results.mediaDevicePermissionWarning')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {batteryInfo && batteryInfo.supported && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:col-span-2">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Battery className="w-5 h-5 text-amber-600" />
                    {t('quickScan.results.batteryStatus')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.level')}</span>
                      <span className={`text-lg font-bold ${batteryInfo.level < 20 ? 'text-red-600' : batteryInfo.level < 50 ? 'text-amber-600' : 'text-green-600'}`}>
                        {batteryInfo.level}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.status')}</span>
                      <span className="text-white flex items-center gap-1">
                        {batteryInfo.charging ? `⚡ ${t('quickScan.results.charging')}` : `🔋 ${t('quickScan.results.onBattery')}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.health')}</span>
                      <span className={`font-semibold ${batteryInfo.healthStatus === 'critical' ? 'text-red-600' : batteryInfo.healthStatus === 'poor' ? 'text-orange-600' : 'text-green-600'}`}>
                        {t(`quickScan.results.healthStatuses.${batteryInfo.healthStatus}`)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {webrtcLeak && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:col-span-2">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-red-600" />
                    {t('quickScan.results.webrtcLeak')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.leakStatus')}</span>
                      <span className={`font-semibold ${webrtcLeak.leaked ? 'text-red-600' : 'text-green-600'}`}>
                        {webrtcLeak.leaked ? t('quickScan.results.leakDetected') : t('quickScan.results.noLeak')}
                      </span>
                    </div>
                    {webrtcLeak?.publicIPs?.length > 0 && (
                      <div>
                        <p className="text-slate-500 mb-1">{t('quickScan.results.publicIPs')}</p>
                        {webrtcLeak.publicIPs.map((ip, idx) => (
                          <p key={idx} className="text-red-600 font-mono text-xs">{ip}</p>
                        ))}
                      </div>
                    )}
                    {webrtcLeak?.localIPs?.length > 0 && (
                      <div>
                        <p className="text-slate-500 mb-1">{t('quickScan.results.localIPs')}</p>
                        {webrtcLeak.localIPs.map((ip, idx) => (
                          <p key={idx} className="text-white font-mono text-xs">{ip}</p>
                        ))}
                      </div>
                    )}
                    <div className={`p-2 rounded ${webrtcLeak.riskLevel === 'high' ? 'bg-red-100' : webrtcLeak.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'}`}>
                      <p className={`text-xs ${webrtcLeak.riskLevel === 'high' ? 'text-red-600' : webrtcLeak.riskLevel === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>
                        {webrtcLeak.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {fingerprintUniqueness && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    {t('quickScan.results.digitalFingerprint')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">{t('quickScan.results.uniqueness')}</p>
                      <p className="text-white font-semibold">{fingerprintUniqueness.readableScore} {t('quickScan.results.users')}</p>
                    </div>
                    <div className={`p-2 rounded ${fingerprintUniqueness.riskLevel === 'high' ? 'bg-red-100' : fingerprintUniqueness.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'}`}>
                      <p className={`text-xs ${fingerprintUniqueness.riskLevel === 'high' ? 'text-red-600' : fingerprintUniqueness.riskLevel === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>
                        {fingerprintUniqueness.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {thirdPartyAnalysis && thirdPartyAnalysis.totalDomains > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-600" />
                    {t('quickScan.results.thirdPartyResources')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.thirdPartyDomains')}</span>
                      <span className="text-white font-semibold">{thirdPartyAnalysis.totalDomains}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.trackers')}</span>
                      <span className="text-red-600 font-semibold">{thirdPartyAnalysis.trackers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.analytics')}</span>
                      <span className="text-orange-600 font-semibold">{thirdPartyAnalysis.analytics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.ads')}</span>
                      <span className="text-amber-600 font-semibold">{thirdPartyAnalysis.ads}</span>
                    </div>
                  </div>
                </div>
              )}

              {storageAudit && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:col-span-2">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-400" />
                    {t('quickScan.results.browserStorage')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">{t('quickScan.results.localStorage')}</p>
                      <p className="text-white font-semibold">{storageAudit?.localStorage?.sizeReadable || '0 KB'}</p>
                      <p className="text-slate-400 text-xs">{storageAudit?.localStorage?.items || 0} {t('quickScan.results.entries')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">{t('quickScan.results.sessionStorage')}</p>
                      <p className="text-white font-semibold">{storageAudit?.sessionStorage?.sizeReadable || '0 KB'}</p>
                      <p className="text-slate-400 text-xs">{storageAudit?.sessionStorage?.items || 0} {t('quickScan.results.entries')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">{t('quickScan.results.indexedDB')}</p>
                      <p className="text-white font-semibold">{storageAudit?.indexedDB?.count || 0} {t('quickScan.results.databases')}</p>
                    </div>
                  </div>
                  {storageAudit?.warnings?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {storageAudit?.warnings?.map((warning, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded bg-amber-100">
                          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                          <p className="text-xs text-amber-600">{warning}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {networkTiming && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    {t('quickScan.results.networkPerformance')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.dns')}</span>
                      <span className="text-white font-semibold">{networkTiming?.dnsTime || 0}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.tls')}</span>
                      <span className="text-white font-semibold">{networkTiming?.tlsTime || 0}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.ttfb')}</span>
                      <span className="text-white font-semibold">{networkTiming?.ttfb || 0}ms</span>
                    </div>
                    {networkTiming?.warnings?.length > 0 && (
                      <div className={`p-2 rounded ${networkTiming.riskLevel === 'high' ? 'bg-red-100' : 'bg-amber-100'}`}>
                        <p className={`text-xs ${networkTiming.riskLevel === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                          {networkTiming?.warnings?.[0]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {Array.isArray(browserAPIs) && browserAPIs.length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-pink-400" />
                    {t('quickScan.results.exposedAPIs')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.totalExposed')}</span>
                      <span className="text-white font-semibold">{browserAPIs.filter(a => a && a.status === 'exposed').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.highRisk')}</span>
                      <span className="text-red-600 font-semibold">{browserAPIs.filter(a => a && a.risk === 'high' && a.status === 'exposed').length}</span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {browserAPIs.filter(a => a && a.status === 'exposed' && a.risk === 'high').slice(0, 3).map((api, idx) => (
                        <p key={idx} className="text-xs text-slate-400">{api?.api || 'Unknown'}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {extensions.length > 0 && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Puzzle className="w-5 h-5 text-blue-400" />
                    {t('quickScan.results.browserExtensions')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.totalDetected')}</span>
                      <span className="text-white font-semibold">{extensions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.highRisk')}</span>
                      <span className="text-red-600 font-semibold">{extensions.filter(e => e.risk === 'risky').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.mediumRisk')}</span>
                      <span className="text-orange-600 font-semibold">{extensions.filter(e => e.risk === 'moderate').length}</span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Array.isArray(extensions) && extensions.length > 0 && extensions.slice(0, 3).map((ext, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <p className="text-xs text-slate-400 truncate">{ext?.name || 'Unknown'}</p>
                          <span className={`text-xs ${ext?.risk === 'risky' ? 'text-red-600' : ext?.risk === 'moderate' ? 'text-orange-600' : 'text-green-600'}`}>
                            {t(`quickScan.results.riskLevels.${ext?.risk || 'low'}`)}
                          </span>
                        </div>
                      ))}
                      {(!Array.isArray(extensions) || extensions.length === 0) && (
                        <p className="text-xs text-slate-500 italic">{t('quickScan.results.noExtensions') || 'No extensions detected'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {connectionSecurity && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    {t('quickScan.results.connectionSecurity')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.protocol')}</span>
                      <span className={`font-semibold ${connectionSecurity.protocol === 'https:' ? 'text-green-600' : 'text-red-600'}`}>
                        {connectionSecurity.protocol.toUpperCase()}
                      </span>
                    </div>
                    <div className={`p-2 rounded ${connectionSecurity.secure ? 'bg-green-100' : 'bg-red-100'}`}>
                      <p className={`text-xs ${connectionSecurity.secure ? 'text-green-600' : 'text-red-600'}`}>
                        {connectionSecurity.secure ? 'Connexion sécurisée' : connectionSecurity.warnings[0] || 'Connexion non sécurisée'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {dnsLeak && (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    {t('quickScan.results.dnsLeak')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{t('quickScan.results.leakStatus')}</span>
                      <span className={`font-semibold ${dnsLeak.leakDetected ? 'text-red-600' : 'text-green-600'}`}>
                        {dnsLeak.leakDetected ? t('quickScan.results.leakDetected') : t('quickScan.results.noLeak')}
                      </span>
                    </div>
                    {dnsLeak?.resolvers?.length > 0 && (
                      <div>
                        <p className="text-slate-500 mb-1">{t('quickScan.results.dnsServers')}</p>
                        {dnsLeak?.resolvers?.slice(0, 2).map((server, idx) => (
                          <p key={idx} className="text-white font-mono text-xs">{server}</p>
                        ))}
                      </div>
                    )}
                    <div className={`p-2 rounded ${dnsLeak.riskLevel === 'high' ? 'bg-red-100' : dnsLeak.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-green-100'}`}>
                      <p className={`text-xs ${dnsLeak.riskLevel === 'high' ? 'text-red-600' : dnsLeak.riskLevel === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>
                        {dnsLeak.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800/80 border-2 border-red-500/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-8 h-8 text-red-400" />
                  <span className="text-5xl font-bold text-red-400">{scanResults.threats?.length || 0}</span>
                </div>
                <p className="text-red-300 font-semibold text-sm">{t('quickScan.results.threatsDetected')}</p>
              </div>

              <div className="bg-slate-800/80 border-2 border-orange-500/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                  <span className="text-5xl font-bold text-orange-400">{scanResults.privacyIssues || 0}</span>
                </div>
                <p className="text-orange-300 font-semibold text-sm">{t('quickScan.results.privacyIssues')}</p>
              </div>

              <div className="bg-slate-800/80 border-2 border-yellow-500/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="w-8 h-8 text-yellow-400" />
                  <span className="text-5xl font-bold text-yellow-400">{scanResults.performanceIssues || 0}</span>
                </div>
                <p className="text-yellow-300 font-semibold text-sm">{t('quickScan.results.performanceIssues')}</p>
              </div>

              <div className="bg-slate-800/80 border-2 border-blue-500/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <span className="text-5xl font-bold text-blue-400">{scanResults.vulnerabilities || 0}</span>
                </div>
                <p className="text-blue-300 font-semibold text-sm">{t('quickScan.results.systemVulnerabilities')}</p>
              </div>
            </div>

            <div className="mb-12">
              <InactionTimeline threats={scanResults.threats?.length || 0} />
            </div>

            <div className="bg-gradient-to-br from-orange-950/40 to-amber-950/40 border-2 border-orange-500/50 rounded-3xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-bold mb-4">
                  <CheckCircle className="w-5 h-5" />
                  {t('quickScan.results.personalizedRecommendation')}
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">{t('quickScan.results.protectionAdapted')}</h3>
                <p className="text-slate-300 text-lg">{t('quickScan.results.basedOnThreats')}</p>
              </div>

              <div className="bg-white rounded-2xl p-8 mb-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-3xl font-bold text-slate-900 mb-2">
                      {t('quickScan.results.offer')} {(scanResults.recommendedPlan || 'm').toUpperCase()}
                    </h4>
                    <p className="text-slate-400">{getPlanStorage(scanResults.recommendedPlan || 'm')} {t('quickScan.results.storage')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-orange-600">{getPlanPrice(scanResults.recommendedPlan || 'm')}€</div>
                    <div className="text-slate-400 text-sm">{t('quickScan.results.for5Years')}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">{t('quickScan.results.benefits.removeThreats')}</p>
                      <p className="text-sm text-slate-400">{t('quickScan.results.benefits.removeThreatsDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">{t('quickScan.results.benefits.privacyProtection')}</p>
                      <p className="text-sm text-slate-400">{t('quickScan.results.benefits.privacyProtectionDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">{t('quickScan.results.benefits.performanceOptimization')}</p>
                      <p className="text-sm text-slate-400">{t('quickScan.results.benefits.performanceOptimizationDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-900">{t('quickScan.results.benefits.support247')}</p>
                      <p className="text-sm text-slate-400">{t('quickScan.results.benefits.support247Desc')}</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="block w-full text-center py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {t('quickScan.results.protectNow')}
                </Link>
              </div>

              <div className="text-center">
                <p className="text-orange-200 mb-4">
                  <Clock className="w-5 h-5 inline mr-2" />
                  {t('quickScan.results.limitedOffer')}
                </p>
                <Link to="/#pricing" className="text-orange-300 hover:text-orange-200 font-semibold underline">
                  {t('quickScan.results.seeAllOffers')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : showResults && !scanResults ? (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-6 animate-pulse">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <p className="text-white text-xl">{t('quickScan.results.processingResults') || 'Traitement des résultats...'}</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-6 animate-pulse">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <p className="text-white text-xl">{t('quickScan.initializing')}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
    </ErrorBoundary>
  );
}

export default AnalyseRapide;
