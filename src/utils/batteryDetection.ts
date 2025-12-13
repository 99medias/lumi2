export interface BatteryInfo {
  supported: boolean;
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  warnings: string[];
}

export async function detectBattery(): Promise<BatteryInfo> {
  try {
    if (!('getBattery' in navigator)) {
      return {
        supported: false,
        level: 0,
        charging: false,
        chargingTime: 0,
        dischargingTime: 0,
        healthStatus: 'good',
        warnings: ['API Batterie non disponible (appareil de bureau?)']
      };
    }

    const battery = await (navigator as any).getBattery();

    const level = Math.floor(battery.level * 100);
    const charging = battery.charging;
    const chargingTime = battery.chargingTime;
    const dischargingTime = battery.dischargingTime;

    let healthStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'good';
    const warnings: string[] = [];

    if (level < 10) {
      healthStatus = 'critical';
      warnings.push('Batterie critique - rechargez immédiatement');
    } else if (level < 20) {
      healthStatus = 'poor';
      warnings.push('Batterie faible - rechargez bientôt');
    } else if (level < 50) {
      healthStatus = 'fair';
      warnings.push('Niveau de batterie moyen');
    } else if (level >= 80 && !charging) {
      healthStatus = 'excellent';
    }

    if (charging) {
      warnings.push('En charge');
    }

    if (dischargingTime !== Infinity && dischargingTime < 7200) {
      warnings.push(`Autonomie restante: ${Math.floor(dischargingTime / 60)} minutes`);
    }

    return {
      supported: true,
      level,
      charging,
      chargingTime,
      dischargingTime,
      healthStatus,
      warnings
    };
  } catch (error) {
    return {
      supported: false,
      level: 0,
      charging: false,
      chargingTime: 0,
      dischargingTime: 0,
      healthStatus: 'good',
      warnings: ['Impossible de détecter la batterie']
    };
  }
}
