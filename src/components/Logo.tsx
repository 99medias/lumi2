interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'header' | 'footer' | 'icon';
}

function Logo({ className = '', size = 48, variant = 'icon' }: LogoProps) {
  if (variant === 'full') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 140" width="250" height="70" className={className}>
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#047857', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="deepBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#047857', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#A7F3D0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#D1FAE5', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="shieldInner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.25 }} />
            <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
          </linearGradient>

          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
          </linearGradient>

          <filter id="dropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#10B981" floodOpacity="0.35"/>
          </filter>

          <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feFlood floodColor="#10B981" floodOpacity="0.5"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(15, 10)">

          <g filter="url(#dropShadow)">
            <path d="M60 8 C60 8 40 14 25 18 C20 19.5 17 24 17 29 L17 65 C17 85 35 102 60 115 C85 102 103 85 103 65 L103 29 C103 24 100 19.5 95 18 C80 14 60 8 60 8 Z"
                  fill="url(#primaryGradient)"/>
          </g>

          <path d="M60 12 C60 12 42 17.5 28 21 C24 22 22 25.5 22 29.5 L22 64 C22 81 38 96 60 107 C82 96 98 81 98 64 L98 29.5 C98 25.5 96 22 92 21 C78 17.5 60 12 60 12 Z"
                fill="url(#shieldInner)"/>

          <path d="M60 18 C60 18 45 22.5 33 25.5 C29.5 26.5 27 29.5 27 33 L27 62 C27 76 40 88 60 98 C80 88 93 76 93 62 L93 33 C93 29.5 90.5 26.5 87 25.5 C75 22.5 60 18 60 18 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                strokeOpacity="0.4"/>

          <g transform="translate(32, 38)">
            <path d="M45 32 L12 32 C5.4 32 0 26.6 0 20 C0 14.2 4.2 9.3 9.8 8.2 C10.5 3.5 14.7 0 19.8 0 C23.2 0 26.2 1.6 28 4.1 C29.8 1.6 32.8 0 36.2 0 C41.3 0 45.5 3.5 46.2 8.2 C51.8 9.3 56 14.2 56 20 C56 26.6 50.6 32 44 32 Z"
                  fill="#FFFFFF"
                  fillOpacity="0.95"/>
          </g>

          <g transform="translate(48, 48)">
            <rect x="0" y="10" width="24" height="18" rx="3" ry="3" fill="url(#primaryGradient)"/>
            <path d="M5 10 L5 7 C5 3 8 0 12 0 C16 0 19 3 19 7 L19 10"
                  fill="none"
                  stroke="url(#primaryGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"/>
            <circle cx="12" cy="18" r="3" fill="#FFFFFF"/>
            <rect x="10.5" y="18" width="3" height="5" rx="1" fill="#FFFFFF"/>
          </g>

          <g stroke="url(#circuitGradient)" strokeWidth="1.5" fill="none" opacity="0.7">
            <path d="M10 45 L-5 45"/>
            <path d="M10 55 L-10 55 L-10 70"/>
            <path d="M15 75 L5 85"/>
            <path d="M110 45 L125 45"/>
            <path d="M110 55 L130 55 L130 70"/>
            <path d="M105 75 L115 85"/>
            <path d="M60 5 L60 -5"/>
          </g>

          <g fill="#10B981">
            <circle cx="-5" cy="45" r="3"/>
            <circle cx="-10" cy="70" r="3"/>
            <circle cx="5" cy="85" r="3"/>
            <circle cx="125" cy="45" r="3"/>
            <circle cx="130" cy="70" r="3"/>
            <circle cx="115" cy="85" r="3"/>
            <circle cx="60" cy="-5" r="3"/>
          </g>

          <g fill="#10B981" opacity="0.8">
            <circle cx="0" cy="50" r="1.5">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="120" cy="50" r="1.5">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="60" cy="0" r="1.5">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          </g>

        </g>

        <g transform="translate(160, 0)">
          <text x="0" y="68"
                fontFamily="'Inter', 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
                fontSize="36"
                fontWeight="700"
                letterSpacing="-0.5">
            <tspan fill="#1A3D5C">Ma</tspan>
            <tspan fill="#10B981">Sécurité</tspan>
            <tspan fill="#1A3D5C">.be</tspan>
          </text>

          <text x="2" y="92"
                fontFamily="'Inter', 'Segoe UI', -apple-system, sans-serif"
                fontSize="12"
                fontWeight="400"
                fill="#5A7A94"
                letterSpacing="2">
            VOTRE TRANQUILLITÉ DIGITALE
          </text>

          <rect x="2" y="100" width="60" height="2" rx="1" fill="url(#primaryGradient)"/>
        </g>
      </svg>
    );
  }

  if (variant === 'footer') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 45" width="180" height="29" className={className}>
        <defs>
          <linearGradient id="primaryGradientFooter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#047857', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="shieldInnerFooter" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
          </linearGradient>

          <filter id="dropShadowFooter" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#10B981" floodOpacity="0.25"/>
          </filter>
        </defs>

        <g transform="translate(2, 2)">
          <g filter="url(#dropShadowFooter)">
            <path d="M20 2 C20 2 13 5 7 7 C5 7.5 4 9 4 11 L4 24 C4 33 12 40 20 45 C28 40 36 33 36 24 L36 11 C36 9 35 7.5 33 7 C27 5 20 2 20 2 Z"
                  fill="url(#primaryGradientFooter)"/>
          </g>

          <path d="M20 4 C20 4 14 6.5 8.5 8.5 C7 9 6 10.5 6 12 L6 24 C6 31.5 13 37.5 20 42 C27 37.5 34 31.5 34 24 L34 12 C34 10.5 33 9 31.5 8.5 C26 6.5 20 4 20 4 Z"
                fill="url(#shieldInnerFooter)"/>

          <g transform="translate(8, 14)">
            <path d="M20 14 L5 14 C2.5 14 0.5 12 0.5 9.5 C0.5 7.2 2 5.3 4 4.8 C4.2 2.5 6 0.5 8.5 0.5 C9.9 0.5 11.1 1.1 12 2 C12.9 1.1 14.1 0.5 15.5 0.5 C18 0.5 19.8 2.5 20 4.8 C22 5.3 23.5 7.2 23.5 9.5 C23.5 12 21.5 14 19 14 Z"
                  fill="#FFFFFF"
                  fillOpacity="0.95"/>
          </g>

          <g transform="translate(15, 18)">
            <rect x="0" y="4" width="10" height="7" rx="1.5" ry="1.5" fill="url(#primaryGradientFooter)"/>
            <path d="M2 4 L2 3 C2 1.5 3.5 0 5 0 C6.5 0 8 1.5 8 3 L8 4"
                  fill="none"
                  stroke="url(#primaryGradientFooter)"
                  strokeWidth="1.5"
                  strokeLinecap="round"/>
            <circle cx="5" cy="7" r="1.2" fill="#FFFFFF"/>
          </g>

          <g fill="#10B981" opacity="0.7">
            <circle cx="1" cy="16" r="1.5"/>
            <circle cx="39" cy="16" r="1.5"/>
            <circle cx="20" cy="0" r="1"/>
          </g>
        </g>

        <text x="48" y="30"
              fontFamily="'Inter', 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
              fontSize="22"
              fontWeight="600"
              letterSpacing="-0.3">
          <tspan fill="#FFFFFF">Ma</tspan>
          <tspan fill="#10B981">Sécurité</tspan>
          <tspan fill="#FFFFFF">.be</tspan>
        </text>
      </svg>
    );
  }

  if (variant === 'header') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 45" width="210" height="34" className={className}>
        <defs>
          <linearGradient id="primaryGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#047857', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id="shieldInnerHeader" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
          </linearGradient>

          <filter id="dropShadowHeader" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#10B981" floodOpacity="0.25"/>
          </filter>
        </defs>

        <g transform="translate(2, 2)">

          <g filter="url(#dropShadowHeader)">
            <path d="M20 2 C20 2 13 5 7 7 C5 7.5 4 9 4 11 L4 24 C4 33 12 40 20 45 C28 40 36 33 36 24 L36 11 C36 9 35 7.5 33 7 C27 5 20 2 20 2 Z"
                  fill="url(#primaryGradientHeader)"/>
          </g>

          <path d="M20 4 C20 4 14 6.5 8.5 8.5 C7 9 6 10.5 6 12 L6 24 C6 31.5 13 37.5 20 42 C27 37.5 34 31.5 34 24 L34 12 C34 10.5 33 9 31.5 8.5 C26 6.5 20 4 20 4 Z"
                fill="url(#shieldInnerHeader)"/>

          <g transform="translate(8, 14)">
            <path d="M20 14 L5 14 C2.5 14 0.5 12 0.5 9.5 C0.5 7.2 2 5.3 4 4.8 C4.2 2.5 6 0.5 8.5 0.5 C9.9 0.5 11.1 1.1 12 2 C12.9 1.1 14.1 0.5 15.5 0.5 C18 0.5 19.8 2.5 20 4.8 C22 5.3 23.5 7.2 23.5 9.5 C23.5 12 21.5 14 19 14 Z"
                  fill="#FFFFFF"
                  fillOpacity="0.95"/>
          </g>

          <g transform="translate(15, 18)">
            <rect x="0" y="4" width="10" height="7" rx="1.5" ry="1.5" fill="url(#primaryGradientHeader)"/>
            <path d="M2 4 L2 3 C2 1.5 3.5 0 5 0 C6.5 0 8 1.5 8 3 L8 4"
                  fill="none"
                  stroke="url(#primaryGradientHeader)"
                  strokeWidth="1.5"
                  strokeLinecap="round"/>
            <circle cx="5" cy="7" r="1.2" fill="#FFFFFF"/>
          </g>

          <g fill="#10B981" opacity="0.7">
            <circle cx="1" cy="16" r="1.5"/>
            <circle cx="39" cy="16" r="1.5"/>
            <circle cx="20" cy="0" r="1"/>
          </g>

        </g>

        <text x="48" y="30"
              fontFamily="'Inter', 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
              fontSize="22"
              fontWeight="600"
              letterSpacing="-0.3">
          <tspan fill="#1A3D5C">Ma</tspan>
          <tspan fill="#10B981">Sécurité</tspan>
          <tspan fill="#1A3D5C">.be</tspan>
        </text>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="primaryGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#047857', stopOpacity: 1 }} />
        </linearGradient>

        <linearGradient id="shieldInnerIcon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.25 }} />
          <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0 }} />
        </linearGradient>

        <linearGradient id="circuitGradientIcon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
        </linearGradient>

        <filter id="dropShadowIcon" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#10B981" floodOpacity="0.35"/>
        </filter>
      </defs>

      <g transform="translate(10, 5)">

        <g filter="url(#dropShadowIcon)">
          <path d="M50 5 C50 5 32 12 18 16 C13 17.5 10 22 10 27 L10 60 C10 82 28 100 50 112 C72 100 90 82 90 60 L90 27 C90 22 87 17.5 82 16 C68 12 50 5 50 5 Z"
                fill="url(#primaryGradientIcon)"/>
        </g>

        <path d="M50 10 C50 10 34 16 21 19.5 C17 20.5 15 24 15 28 L15 59 C15 78 31 93 50 104 C69 93 85 78 85 59 L85 28 C85 24 83 20.5 79 19.5 C66 16 50 10 50 10 Z"
              fill="url(#shieldInnerIcon)"/>

        <path d="M50 16 C50 16 36 21 25 24 C21.5 25 19 28 19 31.5 L19 57 C19 73 32 85 50 95 C68 85 81 73 81 57 L81 31.5 C81 28 78.5 25 75 24 C64 21 50 16 50 16 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeOpacity="0.4"/>

        <g transform="translate(22, 36)">
          <path d="M45 30 L12 30 C6 30 1 25 1 19 C1 13.5 5 9 10 8 C10.5 3.5 14.5 0 19.5 0 C22.8 0 25.7 1.5 27.5 4 C29.3 1.5 32.2 0 35.5 0 C40.5 0 44.5 3.5 45 8 C50 9 54 13.5 54 19 C54 25 49 30 43 30 Z"
                fill="#FFFFFF"
                fillOpacity="0.95"/>
        </g>

        <g transform="translate(38, 46)">
          <rect x="0" y="9" width="22" height="16" rx="3" ry="3" fill="url(#primaryGradientIcon)"/>
          <path d="M4 9 L4 6 C4 2.5 7 0 11 0 C15 0 18 2.5 18 6 L18 9"
                fill="none"
                stroke="url(#primaryGradientIcon)"
                strokeWidth="2.5"
                strokeLinecap="round"/>
          <circle cx="11" cy="16" r="2.5" fill="#FFFFFF"/>
          <rect x="9.5" y="16" width="3" height="4.5" rx="1" fill="#FFFFFF"/>
        </g>

        <g fill="#10B981">
          <circle cx="0" cy="40" r="3"/>
          <circle cx="5" cy="80" r="2.5"/>
          <circle cx="100" cy="40" r="3"/>
          <circle cx="95" cy="80" r="2.5"/>
          <circle cx="50" cy="0" r="2.5"/>
        </g>

        <g stroke="url(#circuitGradientIcon)" strokeWidth="1.5" fill="none" opacity="0.6">
          <path d="M5 35 L0 40"/>
          <path d="M10 72 L5 80"/>
          <path d="M95 35 L100 40"/>
          <path d="M90 72 L95 80"/>
          <path d="M50 5 L50 0"/>
        </g>

      </g>
    </svg>
  );
}

export default Logo;
