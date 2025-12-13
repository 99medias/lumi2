interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'header' | 'footer' | 'icon' | 'compact';
}

function Logo({ className = '', variant = 'full' }: LogoProps) {
  if (variant === 'full' || variant === 'header') {
    return (
      <svg
        width="220"
        height="50"
        viewBox="0 0 280 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="28"
          fontFamily="Nunito, system-ui, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#2D3748"
        >
          masecurité.be
        </text>

        <g transform="translate(195, 0)">
          <path
            d="M3 4 L3 28 Q3 40 15 46 Q27 40 27 28 L27 4 Z"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15 10 L15 32 Q15 42 25 47 Q35 42 35 32 L35 10 Z"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
        </g>

        <text
          x="0"
          y="48"
          fontFamily="Nunito, system-ui, sans-serif"
          fontSize="11"
          fill="#10B981"
        >
          votre tranquillité digitale
        </text>
      </svg>
    );
  }

  if (variant === 'footer') {
    return (
      <svg
        width="220"
        height="50"
        viewBox="0 0 280 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="28"
          fontFamily="Nunito, system-ui, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#FFFFFF"
        >
          masecurité.be
        </text>

        <g transform="translate(195, 0)">
          <path
            d="M3 4 L3 28 Q3 40 15 46 Q27 40 27 28 L27 4 Z"
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15 10 L15 32 Q15 42 25 47 Q35 42 35 32 L35 10 Z"
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
          />
        </g>

        <text
          x="0"
          y="48"
          fontFamily="Nunito, system-ui, sans-serif"
          fontSize="11"
          fill="#FFFFFF"
        >
          votre tranquillité digitale
        </text>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg
        width="180"
        height="35"
        viewBox="0 0 280 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="28"
          fontFamily="Nunito, system-ui, sans-serif"
          fontSize="24"
          fontWeight="700"
          fill="#2D3748"
        >
          masecurité.be
        </text>

        <g transform="translate(195, 0)">
          <path
            d="M3 4 L3 28 Q3 40 15 46 Q27 40 27 28 L27 4 Z"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M15 10 L15 32 Q15 42 25 47 Q35 42 35 32 L35 10 Z"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M30 5 L30 5 C30 5 20 8 12 10 C9 11 7 13 7 16 L7 32 C7 42 16 50 30 55 C44 50 53 42 53 32 L53 16 C53 13 51 11 48 10 C40 8 30 5 30 5 Z"
        stroke="url(#shieldGradient)"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M20 28 L27 35 L40 22"
        stroke="url(#shieldGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default Logo;
