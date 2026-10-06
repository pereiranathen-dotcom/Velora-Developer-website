import React, { useState } from 'react';
import { ArrowRight, MapPin, Grid, Trees, Milestone, FileCheck, CheckCircle, Download, Loader2 } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ASSETS } from '../../data/initialData';
import { BrochureService } from '../../utils/brochureService';

interface FeaturedProjectProps {
  onViewProject: (slug: string) => void;
  onGetPrice: () => void;
}

export const FeaturedProjectSection: React.FC<FeaturedProjectProps> = ({
  onViewProject,
  onGetPrice,
}) => {
  const { content, projects } = useStore();
  const featuredProj = projects.find((p) => p.featured) || projects.find((p) => p.slug === 'amrutvan') || projects[0];
  const [downloadingBrochure, setDownloadingBrochure] = useState(false);

  const handleDownloadBrochure = async () => {
    if (!featuredProj) return;
    setDownloadingBrochure(true);
    try {
      await BrochureService.downloadProjectBrochure(featuredProj);
    } catch (err) {
      console.warn('Brochure download error:', err);
    } finally {
      setDownloadingBrochure(false);
    }
  };

  return (
    <section className="relative w-full py-20 lg:py-24 bg-[#00291E] text-white overflow-hidden border-b border-[#C9A24A]/30">
      {/* Background with dark green overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.featuredProjectImage || featuredProj?.heroImage || ASSETS.heroEntrance}
          alt={featuredProj?.name || 'Featured Plotted Development'}
          className="w-full h-full object-cover opacity-25 filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00291E] via-[#00291E]/90 to-[#00291E]/70" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Marquee Details (7 Cols) */}
          <div className="lg:col-span-7">
            {/* Small Label */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                FEATURED PROJECT
              </span>
              <span className="w-8 h-[1px] bg-[#C9A24A]" />
            </div>

            {/* Gold leaf emblem */}
            <div className="flex items-center gap-2 my-2 text-[#C9A24A]">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 stroke-current">
                <path
                  d="M12 2L15 8C19 9 21 13 19 17C17 21 12 22 12 22C12 22 7 21 5 17C3 13 5 9 9 8L12 2Z"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 2V22" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Large Heading */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight">
              {featuredProj?.name || 'AMRUTVAN'}
              {featuredProj?.marathiName && (
                <span className="block text-2xl sm:text-3xl text-[#C9A24A] font-serif font-normal mt-1">
                  {featuredProj.marathiName}
                </span>
              )}
            </h2>

            {/* Subtitle */}
            <p className="font-serif text-lg sm:text-xl text-[#F8F0D8] mt-2 italic font-light">
              "{featuredProj?.tagline || content.featuredProjectSubtitle || 'Your Space. Your Nature. Your Future.'}"
            </p>

            {/* Description */}
            <p className="mt-5 text-sm text-white/80 leading-relaxed font-light max-w-xl">
              {featuredProj?.shortDescription ||
                content.featuredProjectDescription ||
                'A thoughtfully planned plotted development created for those looking to own a piece of land surrounded by nature while staying connected to the essentials of modern life.'}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onViewProject(featuredProj?.slug || 'amrutvan')}
                className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-medium text-xs sm:text-sm tracking-wider uppercase px-7 py-3 rounded shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>View {featuredProj?.name || 'Amrutvan'} →</span>
              </button>

              <button
                onClick={handleDownloadBrochure}
                disabled={downloadingBrochure}
                className="bg-white/10 hover:bg-white/20 border border-[#C9A24A]/60 hover:border-[#C9A24A] text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-6 py-3 rounded backdrop-blur-sm transition-all flex items-center gap-2"
                title="Download Official Project Brochure"
              >
                {downloadingBrochure ? (
                  <Loader2 className="w-4 h-4 text-[#C9A24A] animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-[#C9A24A]" />
                )}
                <span>Download Brochure</span>
              </button>

              <button
                onClick={onGetPrice}
                className="bg-transparent hover:bg-white/10 border border-white/50 hover:border-[#C9A24A] text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-6 py-3 rounded transition-all"
              >
                Get Price & Availability
              </button>
            </div>
          </div>

          {/* Right Column: 5 Info Blocks (5 Cols) - Perfectly spaced, non-overlapping layout */}
          <div className="lg:col-span-5 bg-[#001D15]/85 backdrop-blur-md border border-[#C9A24A]/35 rounded-xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[#C9A24A]/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9A24A]">
                Key Property Highlights
              </span>
              <span className="text-[10px] text-white/50 font-mono">
                {featuredProj?.status || 'Ready Possession'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Info 1: Location */}
              <div className="flex items-start gap-2.5 p-3 bg-[#00291E]/60 rounded-lg border border-[#C9A24A]/20 hover:border-[#C9A24A]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center shrink-0 text-[#C9A24A] mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24A] block">
                    Location
                  </span>
                  <span className="text-xs text-white/95 font-medium leading-tight block mt-0.5">
                    {featuredProj?.location ? featuredProj.location.split(',')[0] + ', Ratnagiri' : 'Mandangad, Ratnagiri'}
                  </span>
                </div>
              </div>

              {/* Info 2: Plot Sizes */}
              <div className="flex items-start gap-2.5 p-3 bg-[#00291E]/60 rounded-lg border border-[#C9A24A]/20 hover:border-[#C9A24A]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center shrink-0 text-[#C9A24A] mt-0.5">
                  <Grid className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24A] block">
                    Plot Sizes
                  </span>
                  <span className="text-xs text-white/95 font-medium leading-tight block mt-0.5">
                    {featuredProj?.plotSizes || '3 to 6 Guntha (3,267 - 6,534 sq.ft)'}
                  </span>
                </div>
              </div>

              {/* Info 3: Surroundings */}
              <div className="flex items-start gap-2.5 p-3 bg-[#00291E]/60 rounded-lg border border-[#C9A24A]/20 hover:border-[#C9A24A]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center shrink-0 text-[#C9A24A] mt-0.5">
                  <Trees className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24A] block">
                    Surroundings
                  </span>
                  <span className="text-xs text-white/95 font-medium leading-tight block mt-0.5">
                    {content.featuredSurroundings || 'Lush Natural Environment'}
                  </span>
                </div>
              </div>

              {/* Info 4: Connectivity */}
              <div className="flex items-start gap-2.5 p-3 bg-[#00291E]/60 rounded-lg border border-[#C9A24A]/20 hover:border-[#C9A24A]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center shrink-0 text-[#C9A24A] mt-0.5">
                  <Milestone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24A] block">
                    Connectivity
                  </span>
                  <span className="text-xs text-white/95 font-medium leading-tight block mt-0.5">
                    {content.featuredConnectivity || 'Well Connected & Highway Access'}
                  </span>
                </div>
              </div>

              {/* Info 5: Documentation (Spans full width) */}
              <div className="sm:col-span-2 flex items-start gap-2.5 p-3 bg-[#00291E]/60 rounded-lg border border-[#C9A24A]/20 hover:border-[#C9A24A]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/15 border border-[#C9A24A]/30 flex items-center justify-center shrink-0 text-[#C9A24A] mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A24A] block">
                    Documentation & Title
                  </span>
                  <span className="text-xs text-white/95 font-medium leading-tight block mt-0.5">
                    {featuredProj?.sanctionApproval ? `${featuredProj.sanctionApproval} • Separate 7/12 for each plot` : 'Collector Approved NA Layout with Clear Title'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
