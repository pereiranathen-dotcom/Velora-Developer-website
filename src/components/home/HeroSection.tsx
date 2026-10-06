import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Compass,
  MapPin,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ASSETS } from '../../data/initialData';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onBookSiteVisit: () => void;
  onNavigate?: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onBookSiteVisit,
  onNavigate,
}) => {
  const { content } = useStore();
  const heroMode = content.heroMode || 'text-and-image';

  // Slideshow State
  const slides = content.heroSlides && content.heroSlides.length > 0
    ? content.heroSlides
    : [
        {
          id: 'slide-1',
          image: ASSETS.heroEntrance,
          caption: 'Amrutvan — Nature-Inspired Plotted Development, Mandangad',
          linkUrl: '/projects/amrutvan',
        },
        {
          id: 'slide-2',
          image: ASSETS.aerialGreenEstate,
          caption: 'Clear Title Collector NA Sanctioned Plots with Separate 7/12',
          linkUrl: '/projects',
        },
        {
          id: 'slide-3',
          image: ASSETS.greenOpulenceVilla,
          caption: 'Green Opulence — Exclusive Luxury Estate Living',
          linkUrl: '/projects/green-opulence',
        },
      ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play slideshow interval
  useEffect(() => {
    if (heroMode !== 'slideshow-image' || isPaused || slides.length <= 1) return;

    const intervalSeconds = Math.max(2, content.heroSlideshowInterval || 5);
    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, intervalSeconds * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroMode, isPaused, slides.length, content.heroSlideshowInterval]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handleSlideClick = (url?: string) => {
    if (!url) return;
    if (url.startsWith('/')) {
      if (onNavigate) onNavigate(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  /* ========================================================
     1. MODE: SINGLE HERO BANNER (IMAGE ONLY)
     ======================================================== */
  if (heroMode === 'single-image') {
    const singleImage =
      content.heroSingleImage || content.heroBackgroundImage || ASSETS.heroEntrance;
    const link = content.heroSingleImageLink;

    return (
      <section className="relative w-full overflow-hidden bg-[#001D15]">
        {/* Top spacer for fixed header */}
        <div className="h-20 sm:h-24 bg-[#001D15]" />

        <div
          onClick={() => link && handleSlideClick(link)}
          className={`relative w-full min-h-[420px] sm:min-h-[550px] lg:h-[700px] overflow-hidden ${
            link ? 'cursor-pointer group' : ''
          }`}
        >
          <img
            src={singleImage}
            alt={content.heroSingleImageAlt || 'Velora Developers Hero Banner'}
            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />

          {/* Subtle bottom gradient to blend smoothly with next section */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-transparent to-black/30 pointer-events-none" />

          {/* Optional Click Prompt if linked */}
          {link && (
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-10">
              <span className="inline-flex items-center gap-2 bg-[#00291E]/80 hover:bg-[#00291E] text-[#F8F0D8] border border-[#C9A24A]/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold shadow-lg transition-transform group-hover:scale-105">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Explore Project & Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A24A]" />
              </span>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ========================================================
     2. MODE: SLIDESHOW BANNER (IMAGE ONLY SLIDER)
     ======================================================== */
  if (heroMode === 'slideshow-image') {
    return (
      <section
        className="relative w-full overflow-hidden bg-[#001D15]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top spacer for fixed header */}
        <div className="h-20 sm:h-24 bg-[#001D15]" />

        <div className="relative w-full min-h-[420px] sm:min-h-[550px] lg:h-[700px] overflow-hidden">
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.id || idx}
                onClick={() => slide.linkUrl && handleSlideClick(slide.linkUrl)}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                } ${slide.linkUrl ? 'cursor-pointer' : ''}`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt || slide.caption || `Velora Slide ${idx + 1}`}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00291E]/90 via-transparent to-black/30 pointer-events-none" />

                {/* Optional slide caption & action link */}
                {(slide.caption || slide.linkUrl) && (
                  <div className="absolute bottom-8 left-6 sm:bottom-10 sm:left-10 max-w-xl z-20 pointer-events-auto">
                    {slide.caption && (
                      <p className="font-serif text-base sm:text-xl lg:text-2xl text-white font-medium drop-shadow-md bg-[#00291E]/75 backdrop-blur-md px-4 py-2 rounded-lg border border-[#C9A24A]/30 inline-block mb-2">
                        {slide.caption}
                      </p>
                    )}
                    {slide.linkUrl && (
                      <div className="block">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#C9A24A] bg-[#00291E]/90 border border-[#C9A24A]/40 px-3 py-1 rounded-full font-semibold shadow">
                          <span>Explore Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Left Arrow */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handlePrevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#00291E]/75 hover:bg-[#00291E] border border-[#C9A24A]/40 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg hover:scale-105"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-6 h-6 text-[#C9A24A]" />
            </button>
          )}

          {/* Right Arrow */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#00291E]/75 hover:bg-[#00291E] border border-[#C9A24A]/40 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg hover:scale-105"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-6 h-6 text-[#C9A24A]" />
            </button>
          )}

          {/* Slide Indicator Dots at Bottom */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(dotIdx)}
                  className={`transition-all rounded-full ${
                    dotIdx === currentSlideIndex
                      ? 'w-7 h-2 bg-[#C9A24A]'
                      : 'w-2 h-2 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  /* ========================================================
     3. MODE: TEXT & IMAGE (AS IT IS NOW - DEFAULT)
     ======================================================== */
  return (
    <section className="relative w-full min-h-[660px] lg:h-[720px] flex flex-col justify-between overflow-hidden">
      {/* Background Image: Configurable from Admin Panel */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.heroBackgroundImage || ASSETS.heroEntrance}
          alt="Velora Developers Luxury Plotted Development"
          className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic dark forest-green gradient overlay (left to right) */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#00291E]/95 via-[#00291E]/80 to-[#00291E]/40"
          style={{
            opacity:
              content.heroOverlayDarkness !== undefined
                ? content.heroOverlayDarkness / 100
                : 0.85,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-transparent to-black/40" />
      </div>

      {/* Top spacer for fixed header */}
      <div className="h-24 sm:h-28" />

      {/* Hero Central Content Container */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="max-w-2xl">
          {/* Main Display Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-normal leading-[1.12] text-white text-balance drop-shadow-sm">
            {content.heroHeadingPart1 || 'Where Vision'}{' '}
            <span className="block">
              {(content.heroHeadingPart2 || 'Meets the Future').replace(/\bof\s*$/i, '').trim()}
            </span>
            <span className="block">
              of{' '}
              <span className="text-[#C9A24A] font-medium italic underline decoration-[#C9A24A]/40 underline-offset-8">
                {content.heroHeadingHighlight || 'Real Estate'}
              </span>
            </span>
          </h1>

          {/* Subheading / Description */}
          <p className="mt-6 text-sm sm:text-base text-white/85 font-light leading-relaxed max-w-xl">
            {content.heroDescription ||
              'Discover thoughtfully planned properties in promising locations, developed with a focus on quality, connectivity and long-term value.'}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {/* CTA 1: Gold Button */}
            <button
              onClick={onExploreProjects}
              className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-medium text-xs sm:text-sm tracking-wider uppercase px-7 py-3.5 rounded shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>{content.heroButton1Text || 'Explore Our Projects →'}</span>
            </button>

            {/* CTA 2: Dark Transparent with Border */}
            <button
              onClick={onBookSiteVisit}
              className="bg-[#00291E]/70 hover:bg-[#00291E] border border-white/40 hover:border-[#C9A24A] text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 rounded backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#C9A24A]" />
              <span>{content.heroButton2Text || 'Book a Site Visit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Information Strip */}
      <div className="relative z-10 w-full border-t border-white/15 bg-[#00291E]/80 backdrop-blur-md py-4">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/15 text-white/90">
            {/* Item 1 */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:justify-start">
              <div className="w-7 h-7 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-[#C9A24A]" />
              </div>
              <span className="text-xs font-medium tracking-wide">
                Thoughtfully Planned
              </span>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:justify-center">
              <div className="w-7 h-7 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#C9A24A]" />
              </div>
              <span className="text-xs font-medium tracking-wide">
                Strategically Located
              </span>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:justify-end">
              <div className="w-7 h-7 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-[#C9A24A]" />
              </div>
              <span className="text-xs font-medium tracking-wide">
                Built for Tomorrow
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
