interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'header' | 'footer' | 'icon' | 'compact';
}

function Logo({ className = '', variant = 'full' }: LogoProps) {
  if (variant === 'full' || variant === 'header') {
    return (
      <div className={`flex items-center gap-2 ${className}`} style={{ height: variant === 'header' ? '55px' : '60px' }}>
        <svg
          width={variant === 'header' ? '48' : '55'}
          height={variant === 'header' ? '48' : '55'}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M30 5 L30 5 C30 5 20 8 12 10 C9 11 7 13 7 16 L7 32 C7 42 16 50 30 55 C44 50 53 42 53 32 L53 16 C53 13 51 11 48 10 C40 8 30 5 30 5 Z"
            fill="url(#shieldGradient)"
            stroke="url(#shieldGradient)"
            strokeWidth="2"
          />
          <path
            d="M20 28 L27 35 L40 22"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span style={{
          fontSize: variant === 'header' ? '26px' : '28px',
          fontWeight: '700',
          color: '#1F2937',
          letterSpacing: '-0.5px',
          whiteSpace: 'nowrap'
        }}>
          MaSécurité.be
        </span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 5 L30 5 C30 5 20 8 12 10 C9 11 7 13 7 16 L7 32 C7 42 16 50 30 55 C44 50 53 42 53 32 L53 16 C53 13 51 11 48 10 C40 8 30 5 30 5 Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M20 28 L27 35 L40 22"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span style={{
          fontSize: '22px',
          fontWeight: '700',
          color: 'white',
          letterSpacing: '-0.5px',
          whiteSpace: 'nowrap'
        }}>
          MaSécurité.be
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M30 5 L30 5 C30 5 20 8 12 10 C9 11 7 13 7 16 L7 32 C7 42 16 50 30 55 C44 50 53 42 53 32 L53 16 C53 13 51 11 48 10 C40 8 30 5 30 5 Z"
            fill="url(#compactGradient)"
            stroke="url(#compactGradient)"
            strokeWidth="2"
          />
          <path
            d="M20 28 L27 35 L40 22"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#1F2937',
          letterSpacing: '-0.3px',
          whiteSpace: 'nowrap'
        }}>
          MaSécurité.be
        </span>
      </div>
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
