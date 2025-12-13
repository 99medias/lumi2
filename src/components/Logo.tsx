interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'header' | 'footer' | 'icon' | 'compact';
}

function Logo({ className = '', variant = 'full' }: LogoProps) {
  if (variant === 'full' || variant === 'header') {
    return (
      <img
        src="/green_modern_marketing_logo.png"
        alt="MaSécurité.be - Votre tranquillité digitale"
        className={`logo-image ${variant === 'header' ? 'navbar-logo' : 'logo-full'} ${className}`}
        style={{
          height: variant === 'header' ? '65px' : '70px',
          width: 'auto',
          objectFit: 'contain',
          minHeight: variant === 'header' ? '60px' : '65px',
          maxHeight: variant === 'header' ? '70px' : '80px',
          maxWidth: '280px'
        }}
      />
    );
  }

  if (variant === 'footer') {
    return (
      <img
        src="/green_modern_marketing_logo.png"
        alt="MaSécurité.be"
        className={`logo-image ${className}`}
        style={{
          height: '50px',
          width: 'auto',
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)'
        }}
      />
    );
  }

  if (variant === 'compact') {
    return (
      <img
        src="/green_modern_marketing_logo.png"
        alt="MaSécurité.be"
        className={`logo-image ${className}`}
        style={{
          height: '40px',
          width: 'auto',
          objectFit: 'contain'
        }}
      />
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
