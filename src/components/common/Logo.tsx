import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-sm tracking-[0.2em]',
    md: 'text-lg tracking-[0.25em]',
    lg: 'text-2xl tracking-[0.3em]',
  };

  const subSizes = {
    sm: 'text-[7px] tracking-[0.3em]',
    md: 'text-[9px] tracking-[0.35em]',
    lg: 'text-[11px] tracking-[0.4em]',
  };

  const taglineSizes = {
    sm: 'text-[6px] tracking-[0.25em]',
    md: 'text-[7.5px] tracking-[0.3em]',
    lg: 'text-[9px] tracking-[0.35em]',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Golden V-Crown Luxury Insignia */}
      <div className={`${iconSizes[size]} mb-1.5 flex items-center justify-center relative`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          {/* Outer faceted V wings */}
          <path d="M50 88L20 22H34L50 64L66 22H80L50 88Z" fill="url(#goldGradient1)" />
          {/* Inner spire needle */}
          <path d="M50 12L46 48L50 56L54 48L50 12Z" fill="url(#goldGradient2)" />
          {/* Side jewel facets */}
          <path d="M36 28L50 60L46 64L28 28H36Z" fill="#F0DC94" fillOpacity="0.8" />
          <path d="M64 28L50 60L54 64L72 28H64Z" fill="#B3862A" fillOpacity="0.9" />
          <defs>
            <linearGradient id="goldGradient1" x1="20" y1="22" x2="80" y2="88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9E8B2" />
              <stop offset="0.45" stopColor="#C9A24A" />
              <stop offset="1" stopColor="#8C6718" />
            </linearGradient>
            <linearGradient id="goldGradient2" x1="50" y1="12" x2="50" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF2CC" />
              <stop offset="0.6" stopColor="#DDB75C" />
              <stop offset="1" stopColor="#A07920" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Title: VELORA */}
      <div
        className={`font-serif font-semibold uppercase leading-none ${titleSizes[size]} ${
          isLight ? 'text-white' : 'text-[#00291E]'
        }`}
      >
        Velora
      </div>

      {/* Brand Subtitle: — DEVELOPERS — */}
      <div
        className={`uppercase font-sans font-medium mt-1 leading-none ${subSizes[size]} ${
          isLight ? 'text-[#C9A24A]' : 'text-[#0B4A36]'
        }`}
      >
        — Developers —
      </div>

      {/* Tagline: TURNING LAND INTO LANDMARKS */}
      {showTagline && (
        <div
          className={`uppercase font-sans font-normal mt-1 leading-none ${taglineSizes[size]} ${
            isLight ? 'text-white/70' : 'text-[#26342D]/70'
          }`}
        >
          Turning Land Into Landmarks
        </div>
      )}
    </div>
  );
};
