interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'header' | 'footer' | 'icon' | 'compact';
}

function Logo({ className = '', variant = 'full' }: LogoProps) {
  if (variant === 'full' || variant === 'header') {
    return (
      <svg
        width="280"
        height="50"
        viewBox="0 0 300 55"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="35"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="30"
          fontWeight="700"
          fill="#1a202c"
        >
          MaSécurité
        </text>

        <rect x="188" y="12" width="40" height="28" rx="6" fill="#10b981" />
        <text
          x="193"
          y="32"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="white"
        >
          .be
        </text>

        <g transform="translate(240, 8)">
          <path
            d="M18 2 L4 7 L4 20 Q4 34 18 40 Q32 34 32 20 L32 7 Z"
            stroke="#10b981"
            strokeWidth="2.5"
            fill="none"
          />
        </g>

        <text
          x="0"
          y="50"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="11"
          fontWeight="400"
          fill="#10b981"
        >
          votre tranquillité digitale
        </text>
      </svg>
    );
  }

  if (variant === 'footer') {
    return (
      <svg
        width="280"
        height="50"
        viewBox="0 0 300 55"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="35"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="30"
          fontWeight="700"
          fill="#ffffff"
        >
          MaSécurité
        </text>

        <rect x="188" y="12" width="40" height="28" rx="6" fill="#10b981" />
        <text
          x="193"
          y="32"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="white"
        >
          .be
        </text>

        <g transform="translate(240, 8)">
          <path
            d="M18 2 L4 7 L4 20 Q4 34 18 40 Q32 34 32 20 L32 7 Z"
            stroke="#10b981"
            strokeWidth="2.5"
            fill="none"
          />
        </g>

        <text
          x="0"
          y="50"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="11"
          fontWeight="400"
          fill="#9ca3af"
        >
          votre tranquillité digitale
        </text>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg
        width="260"
        height="38"
        viewBox="0 0 280 40"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="28"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="26"
          fontWeight="700"
          fill="#1a202c"
        >
          MaSécurité
        </text>

        <rect x="165" y="8" width="36" height="24" rx="5" fill="#10b981" />
        <text
          x="170"
          y="26"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="white"
        >
          .be
        </text>

        <g transform="translate(212, 5)">
          <path
            d="M15 2 L4 6 L4 17 Q4 28 15 33 Q26 28 26 17 L26 6 Z"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="5" y="5" width="50" height="50" rx="12" fill="#10b981" />
      <text
        x="30"
        y="42"
        textAnchor="middle"
        fontFamily="Poppins, system-ui, sans-serif"
        fontSize="32"
        fontWeight="800"
        fill="white"
      >
        M
      </text>
    </svg>
  );
}

export default Logo;
