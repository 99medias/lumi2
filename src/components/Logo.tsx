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
        height="55"
        viewBox="0 0 350 80"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="38"
          fontFamily="Nunito, system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="700"
          fill="#2D3748"
        >
          masecurité.be
        </text>

        <g transform="translate(270, 2)">
          <path
            d="M5 5 L5 32 Q5 46 20 54 Q35 46 35 32 L35 5 Q20 5 5 5 Z"
            stroke="#10B981"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12 L20 38 Q20 50 33 56 Q46 50 46 38 L46 12 Q33 12 20 12 Z"
            stroke="#10B981"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <text
          x="45"
          y="60"
          fontFamily="Nunito, system-ui, -apple-system, sans-serif"
          fontSize="13"
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
        width="240"
        height="60"
        viewBox="0 0 350 80"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="38"
          fontFamily="Nunito, system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="700"
          fill="#FFFFFF"
        >
          masecurité.be
        </text>

        <g transform="translate(270, 2)">
          <path
            d="M5 5 L5 32 Q5 46 20 54 Q35 46 35 32 L35 5 Q20 5 5 5 Z"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12 L20 38 Q20 50 33 56 Q46 50 46 38 L46 12 Q33 12 20 12 Z"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <text
          x="45"
          y="60"
          fontFamily="Nunito, system-ui, -apple-system, sans-serif"
          fontSize="13"
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
        height="40"
        viewBox="0 0 350 80"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text
          x="0"
          y="38"
          fontFamily="Nunito, system-ui, -apple-system, sans-serif"
          fontSize="32"
          fontWeight="700"
          fill="#2D3748"
        >
          masecurité.be
        </text>

        <g transform="translate(270, 2)">
          <path
            d="M5 5 L5 32 Q5 46 20 54 Q35 46 35 32 L35 5 Q20 5 5 5 Z"
            stroke="#10B981"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 12 L20 38 Q20 50 33 56 Q46 50 46 38 L46 12 Q33 12 20 12 Z"
            stroke="#10B981"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
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
