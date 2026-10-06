import React, { useState } from 'react';
import { useStore } from '../../hooks/useStore';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  customLogoImage?: string;
  customLogoHeight?: number;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  className = '',
  size = 'md',
  showTagline = true,
  customLogoImage: propLogoImage,
  customLogoHeight: propLogoHeight,
}) => {
  const { content } = useStore();
  const [imageError, setImageError] = useState(false);

  const isLight = variant === 'light';

  // Determine if a custom logo image should be displayed
  const customImage =
    propLogoImage ||
    (content?.logoMode === 'custom-image' && content?.customLogoImage
      ? content.customLogoImage
      : content?.customLogoImage);

  const baseHeight = propLogoHeight || content?.customLogoHeight || 58;

  const heightBySizes = {
    sm: Math.max(50, Math.min(baseHeight, 64)),
    md: Math.max(64, Math.min(Math.round(baseHeight * 1.22), 82)),
    lg: Math.max(90, Math.min(Math.round(baseHeight * 1.55), 120)),
  };

  const taglineSizes = {
    sm: 'text-[6.5px] tracking-[0.25em]',
    md: 'text-[8px] tracking-[0.3em]',
    lg: 'text-[10px] tracking-[0.35em]',
  };

  // If a valid custom logo image is provided and hasn't errored
  if (customImage && !imageError) {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <img
          src={customImage}
          alt={content?.customLogoAlt || 'Velora Developers Logo'}
          style={{ height: `${heightBySizes[size]}px` }}
          className="w-auto object-contain max-w-[280px] sm:max-w-[340px] drop-shadow-md transition-all duration-200"
          onError={() => setImageError(true)}
        />
        {showTagline && content?.showLogoTagline !== false && (
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
  }

  // EXACT OFFICIAL EMBLEM & TYPOGRAPHY MATCHING USER ATTACHMENT
  const emblemWidths = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const wordmarkSizes = {
    sm: 'text-[17px] tracking-[0.24em]',
    md: 'text-[22px] tracking-[0.26em]',
    lg: 'text-[30px] tracking-[0.3em]',
  };

  const developersSizes = {
    sm: 'text-[8.5px] tracking-[0.32em]',
    md: 'text-[10.5px] tracking-[0.36em]',
    lg: 'text-[13px] tracking-[0.42em]',
  };

  const taglineFontSizes = {
    sm: 'text-[6.5px] tracking-[0.22em]',
    md: 'text-[8px] tracking-[0.26em]',
    lg: 'text-[10px] tracking-[0.3em]',
  };

  return (
    <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
      {/* 1. Official Golden V-Chevron with Architectural Skyscraper Towers */}
      <div className={`${emblemWidths[size]} mb-1 flex items-center justify-center relative drop-shadow-md`}>
        <svg viewBox="0 0 200 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="vGold1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2CE" />
              <stop offset="35%" stopColor="#E0BD65" />
              <stop offset="70%" stopColor="#C9A24A" />
              <stop offset="100%" stopColor="#8C6415" />
            </linearGradient>
            <linearGradient id="vGold2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="50%" stopColor="#C9A24A" />
              <stop offset="100%" stopColor="#78530C" />
            </linearGradient>
            <linearGradient id="vNavyTower" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B1724" />
              <stop offset="50%" stopColor="#182A3A" />
              <stop offset="100%" stopColor="#08121D" />
            </linearGradient>
          </defs>

          {/* BACK NAVY SKYSCRAPERS */}
          {/* Far-left navy tower */}
          <polygon points="68,76 78,66 78,118 68,110" fill="url(#vNavyTower)" />
          {/* Main left navy tower */}
          <polygon points="78,66 94,48 94,128 78,118" fill="url(#vNavyTower)" />
          {/* Far-right navy tower */}
          <polygon points="122,66 132,76 132,110 122,118" fill="url(#vNavyTower)" />
          {/* Main right navy tower */}
          <polygon points="106,44 122,66 122,128 106,138" fill="url(#vNavyTower)" />
          {/* Pinstripe vertical window accents */}
          <line x1="112" y1="58" x2="112" y2="132" stroke="#253A4E" strokeWidth="1" />
          <line x1="117" y1="64" x2="117" y2="126" stroke="#253A4E" strokeWidth="1" />

          {/* CENTER TALLEST GOLDEN SKYSCRAPER */}
          {/* Left facet */}
          <polygon points="94,22 100,10 100,142 94,132" fill="url(#vGold1)" />
          {/* Right facet */}
          <polygon points="100,10 106,22 106,142 100,142" fill="url(#vGold2)" />
          {/* Stepped foreground gold tower */}
          <polygon points="96,72 100,66 100,146 96,142" fill="#FFEBB2" />
          <polygon points="100,66 104,72 104,142 100,146" fill="url(#vGold2)" />

          {/* INNER GOLDEN CHEVRON */}
          <polygon points="100,154 70,88 78,82 100,134 122,82 130,88" fill="url(#vGold1)" />

          {/* OUTER FACETED GOLDEN V WITH SHARP FLARED WINGS */}
          {/* Left wing barb */}
          <path d="M16,74 C30,72 45,68 58,60 L62,68 C49,76 34,80 20,82 Z" fill="url(#vGold1)" />
          {/* Right wing barb */}
          <path d="M184,74 C170,72 155,68 142,60 L138,68 C151,76 166,80 180,82 Z" fill="url(#vGold2)" />

          {/* Left main arm */}
          <polygon points="58,60 100,166 94,166 50,70" fill="url(#vGold1)" />
          <polygon points="58,60 70,58 100,154 94,166" fill="#FFF2CC" opacity="0.9" />

          {/* Right main arm */}
          <polygon points="142,60 100,166 106,166 150,70" fill="url(#vGold2)" />
          <polygon points="142,60 130,58 100,154 106,166" fill="url(#vGold1)" opacity="0.9" />

          {/* Bottom triangle tip */}
          <polygon points="100,172 94,158 106,158" fill="url(#vGold1)" />
        </svg>
      </div>

      {/* 2. Official Wordmark: VELORA with Gold Triangle inside 'A' */}
      <div
        className={`font-serif font-bold uppercase leading-none relative flex items-center justify-center ${wordmarkSizes[size]} ${
          isLight ? 'text-[#F8F0D8]' : 'text-[#0B1B2B]'
        }`}
      >
        <span>VELOR</span>
        {/* The 'A' with the golden triangle counter */}
        <span className="relative inline-block ml-0.5">
          <span>A</span>
          {/* Exact Golden Equilateral Triangle placed in the center counter of 'A' */}
          <span
            className="absolute left-1/2 -translate-x-1/2 top-[34%] w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-[#C9A24A]"
            style={{
              filter: 'drop-shadow(0 0.5px 0.5px rgba(0,0,0,0.3))',
            }}
          />
        </span>
      </div>

      {/* 3. Subtitle: — DEVELOPERS — with Golden Divider Lines */}
      <div className="flex items-center justify-center gap-1.5 mt-1 w-full max-w-[210px]">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C9A24A]" />
        <span
          className={`uppercase font-sans font-semibold text-[#C9A24A] leading-none ${developersSizes[size]}`}
        >
          DEVELOPERS
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C9A24A]" />
      </div>

      {/* 4. Tagline: TURNING LAND INTO LANDMARKS with Central Golden Diamond */}
      {showTagline && (
        <div className="mt-1 w-full flex flex-col items-center">
          {/* Hairline with center diamond */}
          <div className="flex items-center justify-center w-full max-w-[190px] mb-0.5">
            <div className="h-[0.5px] flex-1 bg-gradient-to-r from-transparent via-[#C9A24A]/60 to-[#C9A24A]" />
            <div className="w-1.5 h-1.5 bg-[#C9A24A] rotate-45 mx-1 shrink-0" />
            <div className="h-[0.5px] flex-1 bg-gradient-to-l from-transparent via-[#C9A24A]/60 to-[#C9A24A]" />
          </div>

          <span
            className={`uppercase font-sans font-medium leading-none ${taglineFontSizes[size]} ${
              isLight ? 'text-[#E2EBE5]' : 'text-[#26342D]/80'
            }`}
          >
            TURNING LAND INTO LANDMARKS
          </span>
        </div>
      )}
    </div>
  );
};
