interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'header' | 'footer' | 'icon' | 'compact';
}

function Logo({ className = '', variant = 'full' }: LogoProps) {
  if (variant === 'full' || variant === 'header') {
    return (
      <svg
        width="240"
        height="45"
        viewBox="0 0 240 45"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="26"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#1a202c"
        >
          MaSécurité
        </text>

        <rect x="142" y="8" width="32" height="22" rx="5" fill="#10b981" />
        <text
          x="146"
          y="24"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="13"
          fontWeight="700"
          fill="white"
        >
          .net
        </text>

        <g transform="translate(180, 3)">
          <path
            d="M14 2 L4 5 L4 17 Q4 27 14 32 Q24 27 24 17 L24 5 Z"
            fill="#10b981"
            opacity="0.15"
          />
          <path
            d="M14 2 L4 5 L4 17 Q4 27 14 32 Q24 27 24 17 L24 5 Z"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
          />
        </g>

        <text
          x="0"
          y="42"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="10"
          fontWeight="500"
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
        width="240"
        height="45"
        viewBox="0 0 240 45"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="26"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#ffffff"
        >
          MaSécurité
        </text>

        <rect x="142" y="8" width="32" height="22" rx="5" fill="#10b981" />
        <text
          x="146"
          y="24"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="13"
          fontWeight="700"
          fill="white"
        >
          .net
        </text>

        <g transform="translate(180, 3)">
          <path
            d="M14 2 L4 5 L4 17 Q4 27 14 32 Q24 27 24 17 L24 5 Z"
            fill="#10b981"
            opacity="0.15"
          />
          <path
            d="M14 2 L4 5 L4 17 Q4 27 14 32 Q24 27 24 17 L24 5 Z"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
          />
        </g>

        <text
          x="0"
          y="42"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="10"
          fontWeight="500"
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
        width="210"
        height="32"
        viewBox="0 0 210 32"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="22"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="20"
          fontWeight="700"
          fill="#1a202c"
        >
          MaSécurité
        </text>

        <rect x="120" y="6" width="28" height="18" rx="4" fill="#10b981" />
        <text
          x="123"
          y="20"
          fontFamily="Poppins, system-ui, sans-serif"
          fontSize="11"
          fontWeight="700"
          fill="white"
        >
          .net
        </text>

        <g transform="translate(154, 2)">
          <path
            d="M12 2 L4 4 L4 14 Q4 22 12 26 Q20 22 20 14 L20 4 Z"
            fill="#10b981"
            opacity="0.15"
          />
          <path
            d="M12 2 L4 4 L4 14 Q4 22 12 26 Q20 22 20 14 L20 4 Z"
            stroke="#10b981"
            strokeWidth="1.5"
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
