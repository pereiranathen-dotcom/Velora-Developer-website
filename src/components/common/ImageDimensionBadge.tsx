import React from 'react';
import { Maximize2, FileCheck, Info } from 'lucide-react';

interface ImageDimensionBadgeProps {
  dimensions: string; // e.g. "1920 × 1080 px"
  aspectRatio: string; // e.g. "16:9"
  maxSize?: string; // e.g. "2.5 MB"
  formats?: string; // e.g. "JPG, WebP, PNG"
  context?: string; // e.g. "Hero Banner"
  variant?: 'dark' | 'light' | 'banner';
  className?: string;
}

export const ImageDimensionBadge: React.FC<ImageDimensionBadgeProps> = ({
  dimensions,
  aspectRatio,
  maxSize = '2 MB',
  formats = 'JPG, PNG, WebP',
  context,
  variant = 'light',
  className = '',
}) => {
  if (variant === 'banner') {
    return (
      <div
        className={`bg-[#00291E] text-white p-3 sm:p-3.5 rounded-xl border border-[#C9A24A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-sm ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C9A24A]/20 text-[#C9A24A] flex items-center justify-center shrink-0">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-[#F8F0D8] text-[11px] block">
              {context ? `${context} Specifications` : 'Recommended Photo Specifications'}
            </span>
            <span className="text-[10px] text-white/70">
              Optimal resolution prevents cropping and keeps the website ultra-sharp.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-[#C9A24A] text-[#00291E] font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {dimensions}
          </span>
          <span className="bg-white/10 text-[#C9A24A] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#C9A24A]/30">
            {aspectRatio}
          </span>
          <span className="bg-black/40 text-white/80 text-[10px] px-2 py-0.5 rounded">
            Max: {maxSize}
          </span>
          <span className="bg-black/40 text-white/60 text-[9px] px-1.5 py-0.5 rounded">
            {formats}
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div
        className={`inline-flex items-center gap-2 bg-[#001D15] border border-[#C9A24A]/40 rounded-lg px-2.5 py-1 text-[11px] text-white/90 shadow-sm ${className}`}
      >
        <Maximize2 className="w-3 h-3 text-[#C9A24A] shrink-0" />
        <span className="font-mono font-bold text-[#C9A24A] text-[11px]">
          {dimensions}
        </span>
        <span className="text-white/40">•</span>
        <span className="text-white/75 font-medium text-[10px]">{aspectRatio}</span>
        <span className="text-white/40">•</span>
        <span className="text-white/60 text-[10px]">Max {maxSize}</span>
      </div>
    );
  }

  // Default 'light'
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#F8F0D8] border border-[#C9A24A]/40 rounded-lg px-2.5 py-1 text-[11px] text-[#00291E] shadow-sm flex-wrap ${className}`}
    >
      <Maximize2 className="w-3 h-3 text-[#0B4A36] shrink-0" />
      <span className="font-mono font-bold text-[#00291E] text-[11px]">
        {dimensions}
      </span>
      <span className="text-[#C9A24A]">•</span>
      <span className="bg-[#00291E] text-[#C9A24A] font-semibold text-[9px] px-1.5 py-0.5 rounded">
        {aspectRatio}
      </span>
      <span className="text-[#26342D]/60 text-[10px]">
        Max: {maxSize} ({formats})
      </span>
    </div>
  );
};
