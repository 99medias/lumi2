export async function generateDeviceFingerprint(): Promise<string> {
  const components: string[] = [];

  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    components.push(ipData.ip);
  } catch (e) {
    components.push('no-ip');
  }

  components.push(navigator.userAgent);
  components.push(navigator.language);
  components.push(new Date().getTimezoneOffset().toString());
  components.push(screen.width + 'x' + screen.height);
  components.push(screen.colorDepth.toString());

  if (navigator.hardwareConcurrency) {
    components.push(navigator.hardwareConcurrency.toString());
  }

  if ((navigator as any).deviceMemory) {
    components.push((navigator as any).deviceMemory.toString());
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    components.push(canvas.toDataURL());
  }

  try {
    const webgl = document.createElement('canvas').getContext('webgl');
    if (webgl) {
      const debugInfo = webgl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(webgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
        components.push(webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch (e) {
  }

  const combined = components.join('|');
  const hash = await simpleHash(combined);
  return hash;
}

async function simpleHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
