import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Calendar,
  Grid,
  Shield,
  FileCheck,
  Building,
  Trees,
  Maximize2,
  Phone,
  MessageCircle,
  Download,
  ExternalLink,
  Navigation,
  Layers,
  Zap,
  Droplet,
  Sun,
  ShieldCheck,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { ASSETS } from '../data/initialData';
import { Lightbox } from '../components/common/Lightbox';
import { GalleryItem, HeroSlide } from '../types';
import { BrochureService } from '../utils/brochureService';

interface ProjectDetailPageProps {
  slug: string;
  onBack: () => void;
  onBookSiteVisit: () => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  slug,
  onBack,
  onBookSiteVisit,
}) => {
  const { projects, settings } = useStore();
  const project = projects.find((p) => p.slug === slug || p.id === slug) || projects[0];

  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
  const [isDownloadingBrochure, setIsDownloadingBrochure] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  // Hero Display Modes & Slideshow State for Project
  const heroMode = project?.heroMode || 'text-and-image';
  const slides: HeroSlide[] =
    project?.heroSlides && project.heroSlides.length > 0
      ? project.heroSlides
      : [
          {
            id: `ps-1`,
            image: project?.heroImage || ASSETS.heroEntrance,
            caption: project ? `${project.name} — ${project.tagline}` : 'Velora Estate',
          },
          ...(project?.galleryPhotos?.slice(0, 3).map((gp, i) => ({
            id: `ps-${i + 2}`,
            image: gp.image,
            caption: gp.title,
          })) || []),
        ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (heroMode !== 'slideshow-image' || isPaused || slides.length <= 1) return;
    const intervalSeconds = Math.max(2, project?.heroSlideshowInterval || 5);
    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, intervalSeconds * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [heroMode, isPaused, slides.length, project?.heroSlideshowInterval]);

  const handleDownloadBrochure = async () => {
    if (!project) return;
    setIsDownloadingBrochure(true);
    setDownloadFeedback('Preparing official brochure PDF...');
    try {
      const res = await BrochureService.downloadProjectBrochure(project);
      setDownloadFeedback(res.message);
      setTimeout(() => setDownloadFeedback(null), 4000);
    } catch (err: any) {
      console.error('Download brochure error:', err);
      setDownloadFeedback('Starting brochure download...');
      setTimeout(() => setDownloadFeedback(null), 3000);
    } finally {
      setIsDownloadingBrochure(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 text-center bg-[#F8F0D8]">
        <h2 className="font-serif text-2xl text-[#00291E]">Project Not Found</h2>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-[#00291E] text-white rounded text-xs uppercase"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  // Aggregate all photos for this project for Lightbox navigation
  const allProjectPhotos: GalleryItem[] = [];

  // 1. Add dedicated gallery photos
  if (project.galleryPhotos && project.galleryPhotos.length > 0) {
    project.galleryPhotos.forEach((gp, idx) => {
      allProjectPhotos.push({
        id: gp.id || `gp-${idx}`,
        title: gp.title,
        category: 'project',
        project: project.name,
        alt: gp.alt || gp.title,
        image: gp.image,
        displayOrder: idx + 1,
        active: true,
      });
    });
  }

  // 2. Add lifestyle spaces
  if (project.lifestyleSpaces && project.lifestyleSpaces.length > 0) {
    project.lifestyleSpaces.forEach((ls) => {
      allProjectPhotos.push({
        id: ls.id,
        title: `${ls.number}. ${ls.title}`,
        category: 'lifestyle',
        project: project.name,
        alt: ls.title,
        image: ls.image,
        displayOrder: ls.number,
        active: true,
      });
    });
  }

  // 3. Add Master plan
  const masterPlanImg = project.masterPlanImage || ASSETS.masterPlan;
  allProjectPhotos.push({
    id: `mp-${project.id}`,
    title: project.masterPlanTitle || `${project.name} Master Layout`,
    category: 'master-plan',
    project: project.name,
    alt: 'Master Layout Plan',
    image: masterPlanImg,
    displayOrder: 99,
    active: true,
  });

  const getInfraIcon = (iconName: string) => {
    switch (iconName) {
      case 'road':
        return <Navigation className="w-5 h-5 text-[#C9A24A]" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-[#C9A24A]" />;
      case 'droplet':
        return <Droplet className="w-5 h-5 text-[#C9A24A]" />;
      case 'lamp':
        return <Sun className="w-5 h-5 text-[#C9A24A]" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-[#C9A24A]" />;
      case 'trees':
        return <Trees className="w-5 h-5 text-[#C9A24A]" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-[#C9A24A]" />;
      default:
        return <CheckCircle className="w-5 h-5 text-[#C9A24A]" />;
    }
  };

  return (
    <article className="w-full bg-[#FFF8E7] text-[#26342D] pt-20 relative">
      {/* Toast Feedback for customer download */}
      {downloadFeedback && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-[#00291E] border-2 border-[#C9A24A] text-white px-5 py-3.5 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
          <Download className="w-5 h-5 text-[#C9A24A] shrink-0" />
          <div>
            <span className="text-xs font-semibold block text-white">{downloadFeedback}</span>
            <span className="text-[10px] text-[#C9A24A]">Velora Developers • Official Document</span>
          </div>
        </div>
      )}

      {/* 1. Project Hero Banner */}

      {/* MODE 1: SINGLE BANNER (IMAGE ONLY) */}
      {heroMode === 'single-image' && (
        <section aria-label="Hero Banner" className="relative w-full overflow-hidden bg-[#001D15]">
          <div className="relative w-full min-h-[460px] sm:min-h-[540px] lg:h-[620px] overflow-hidden group">
            <img
              src={project.heroSingleImage || project.heroImage}
              alt={project.heroSingleImageAlt || project.name}
              className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            {/* Top gradient for back button readability and bottom gradient for actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-transparent to-black/50 pointer-events-none" />

            {/* Floating Top Nav: Back to All Projects */}
            <div className="absolute top-6 left-4 sm:top-8 sm:left-8 z-20">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F8F0D8] bg-[#00291E]/85 hover:bg-[#00291E] border border-[#C9A24A]/50 px-4 py-2 rounded-full backdrop-blur-md shadow-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#C9A24A]" />
                <span>Back to All Projects</span>
              </button>
            </div>

            {/* Bottom floating project badge & action buttons */}
            <div className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-xl">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24A] bg-[#00291E]/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#C9A24A]/40">
                    {project.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#C9A24A] text-[#00291E] shadow">
                    {project.status}
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal drop-shadow-md">
                  {project.name}
                  {project.marathiName && (
                    <span className="ml-3 text-xl sm:text-2xl text-[#C9A24A] font-serif font-normal">
                      ({project.marathiName})
                    </span>
                  )}
                </h1>
                {project.tagline && (
                  <p className="text-white/90 text-sm sm:text-base font-light italic mt-1 drop-shadow">
                    "{project.tagline}"
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onBookSiteVisit}
                  className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3 rounded shadow-xl hover:brightness-105 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{project.primaryCtaText || 'Schedule Site Visit'}</span>
                </button>

                <button
                  onClick={handleDownloadBrochure}
                  disabled={isDownloadingBrochure}
                  className="bg-[#00291E]/85 hover:bg-[#00291E] border border-[#C9A24A]/70 text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-5 py-3 rounded backdrop-blur-md transition-all flex items-center gap-2 shadow-xl"
                >
                  {isDownloadingBrochure ? (
                    <Loader2 className="w-4 h-4 text-[#C9A24A] animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 text-[#C9A24A]" />
                  )}
                  <span>Brochure</span>
                </button>

                <a
                  href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Velora%20Developers,%20I%20am%20interested%20in%20${project.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-[#00291E] font-bold text-xs px-4 py-3 rounded shadow-xl transition-all flex items-center gap-1.5"
                  title="WhatsApp Enquiry"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODE 2: SLIDESHOW BANNER (MULTI-IMAGE CAROUSEL) */}
      {heroMode === 'slideshow-image' && (
        <section
          aria-label="Hero Banner"
          className="relative w-full overflow-hidden bg-[#001D15]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="relative w-full min-h-[460px] sm:min-h-[540px] lg:h-[620px] overflow-hidden">
            {slides.map((slide, sIdx) => {
              const isActive = sIdx === currentSlideIndex;
              return (
                <div
                  key={slide.id || sIdx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt || slide.caption || `${project.name} Slide ${sIdx + 1}`}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-transparent to-black/50 pointer-events-none" />

                  {slide.caption && (
                    <div className="absolute bottom-24 left-4 sm:bottom-28 sm:left-8 max-w-xl z-20">
                      <span className="font-serif text-sm sm:text-lg text-white font-medium drop-shadow bg-[#00291E]/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#C9A24A]/30 inline-block">
                        {slide.caption}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Floating Top Nav: Back to All Projects */}
            <div className="absolute top-6 left-4 sm:top-8 sm:left-8 z-30">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F8F0D8] bg-[#00291E]/85 hover:bg-[#00291E] border border-[#C9A24A]/50 px-4 py-2 rounded-full backdrop-blur-md shadow-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#C9A24A]" />
                <span>Back to All Projects</span>
              </button>
            </div>

            {/* Left / Right arrows */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#00291E]/75 hover:bg-[#00291E] border border-[#C9A24A]/40 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg hover:scale-105"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-6 h-6 text-[#C9A24A]" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-[#00291E]/75 hover:bg-[#00291E] border border-[#C9A24A]/40 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg hover:scale-105"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-6 h-6 text-[#C9A24A]" />
                </button>
              </>
            )}

            {/* Slide Dot Indicators */}
            {slides.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
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

            {/* Bottom floating project badge & action buttons */}
            <div className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="max-w-xl">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24A] bg-[#00291E]/85 backdrop-blur-md px-3 py-1 rounded-full border border-[#C9A24A]/40">
                    {project.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#C9A24A] text-[#00291E] shadow">
                    {project.status}
                  </span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl text-white font-normal drop-shadow-md">
                  {project.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onBookSiteVisit}
                  className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3 rounded shadow-xl hover:brightness-105 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{project.primaryCtaText || 'Schedule Site Visit'}</span>
                </button>

                <button
                  onClick={handleDownloadBrochure}
                  disabled={isDownloadingBrochure}
                  className="bg-[#00291E]/85 hover:bg-[#00291E] border border-[#C9A24A]/70 text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-5 py-3 rounded backdrop-blur-md transition-all flex items-center gap-2 shadow-xl"
                >
                  {isDownloadingBrochure ? (
                    <Loader2 className="w-4 h-4 text-[#C9A24A] animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 text-[#C9A24A]" />
                  )}
                  <span>Brochure</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODE 3: TEXT & IMAGE (AS IT IS NOW - DEFAULT) */}
      {heroMode === 'text-and-image' && (
        <section aria-label="Hero Banner" className="relative min-h-[500px] lg:h-[580px] bg-[#00291E] text-white flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={project.heroImage}
              alt={project.name}
              className="w-full h-full object-cover"
              style={{
                opacity: 1 - ((project.heroOverlayDarkness !== undefined ? project.heroOverlayDarkness : 75) / 100 * 0.65),
              }}
              referrerPolicy="no-referrer"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#00291E] via-[#00291E]/90 to-transparent"
              style={{
                opacity: (project.heroOverlayDarkness !== undefined ? project.heroOverlayDarkness : 75) / 100,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-transparent to-black/30" />
          </div>

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C9A24A] hover:text-[#DDB75C] mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Projects</span>
            </button>

            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                  {project.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C9A24A]/20 text-[#DDB75C] border border-[#C9A24A]/40">
                  {project.status}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight">
                {project.name}
                {project.marathiName && (
                  <span className="block text-2xl sm:text-3xl text-[#C9A24A] font-serif mt-1 font-normal">
                    {project.marathiName}
                  </span>
                )}
              </h1>

              <p className="font-serif text-lg text-[#F8F0D8] mt-3 italic font-light">
                "{project.tagline}"
              </p>

              <p className="mt-4 text-sm text-white/80 font-light leading-relaxed">
                {project.longDescription}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onBookSiteVisit}
                  className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-medium text-xs sm:text-sm tracking-wider uppercase px-7 py-3 rounded shadow-lg hover:brightness-105 transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{project.primaryCtaText || 'Schedule Private Site Visit'}</span>
                </button>

                <button
                  onClick={handleDownloadBrochure}
                  disabled={isDownloadingBrochure}
                  className="bg-white/10 hover:bg-white/20 border border-[#C9A24A]/70 hover:border-[#C9A24A] text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-6 py-3 rounded backdrop-blur-sm transition-all flex items-center gap-2 shadow"
                >
                  {isDownloadingBrochure ? (
                    <Loader2 className="w-4 h-4 text-[#C9A24A] animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 text-[#C9A24A]" />
                  )}
                  <span>
                    {project.brochureDownloadText || project.masterPlanDownloadText || 'Download Brochure (PDF)'}
                  </span>
                  {(project.brochureFileSize || project.masterPlanPdfFileSize) && (
                    <span className="text-[10px] bg-[#C9A24A]/30 text-[#F8F0D8] px-1.5 py-0.5 rounded font-mono font-normal">
                      {project.brochureFileSize || project.masterPlanPdfFileSize}
                    </span>
                  )}
                </button>

                <a
                  href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Velora%20Developers,%20I%20am%20interested%20in%20${project.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#00291E]/80 hover:bg-[#00291E] border border-white/40 text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-6 py-3 rounded backdrop-blur-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>{project.secondaryCtaText || 'Instant WhatsApp Inquiry'}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Key Specs Bar */}
      <section aria-label="Key Specifications" className="bg-[#003D2B] text-white py-6 border-y border-[#C9A24A]/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-white/15">
            <div className="p-2">
              <span className="block text-[10px] uppercase tracking-wider text-[#C9A24A] font-semibold">
                Plot Sizes
              </span>
              <span className="font-serif text-lg text-white font-medium mt-0.5 block">
                {project.plotSizes}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[10px] uppercase tracking-wider text-[#C9A24A] font-semibold">
                Sanction & Approval
              </span>
              <span className="font-serif text-lg text-white font-medium mt-0.5 block">
                {project.sanctionApproval || 'Collector Approved NA'}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[10px] uppercase tracking-wider text-[#C9A24A] font-semibold">
                Possession Status
              </span>
              <span className="font-serif text-lg text-white font-medium mt-0.5 block">
                {project.possessionStatus}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[10px] uppercase tracking-wider text-[#C9A24A] font-semibold">
                Title & Registration
              </span>
              <span className="font-serif text-lg text-white font-medium mt-0.5 block">
                {project.titleRegistration || 'Separate 7/12 Extract'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Highlights */}
      <section aria-label="Project Highlights" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
            {project.highlightsEyebrow || 'WHY INVEST'}
          </span>
          <h2 className="font-serif text-3xl text-[#00291E] font-normal mt-1">
            {project.highlightsTitle || 'Project Highlights'}
          </h2>
          <div className="w-12 h-[2px] bg-[#C9A24A] mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {project.keyHighlights.map((highlight, idx) => (
            <div
              key={idx}
              className="bg-[#F8F0D8] p-5 rounded-lg border border-[#C9A24A]/25 flex items-start gap-3.5 shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-[#00291E] text-[#C9A24A] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#00291E] leading-relaxed">
                {highlight}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Master Layout Section */}
      <section aria-label="Master Layout" className="bg-[#F8F0D8] py-16 border-y border-[#C9A24A]/20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                {project.masterPlanEyebrow || 'PLANNED INFRASTRUCTURE'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal mt-1 leading-tight">
                {project.masterPlanTitle || 'Master Layout'}
              </h2>
              <p className="font-serif text-sm text-[#0B4A36] italic mt-1">
                {project.masterPlanSubtitle || 'Well Connected. Well Positioned.'}
              </p>

              <p className="mt-4 text-xs sm:text-sm text-[#26342D]/80 leading-relaxed font-light">
                {project.masterPlanDescription ||
                  'Each plot has been master-planned to maximize natural ventilation, scenic hill vistas, and direct frontage on wide asphalt internal roads with street lights, underground cabling, and landscaped borders.'}
              </p>

              {/* Master Plan Features */}
              <div className="mt-6 space-y-2.5 text-xs text-[#00291E] font-medium">
                {(project.masterPlanFeatures && project.masterPlanFeatures.length > 0
                  ? project.masterPlanFeatures
                  : [
                      '30ft Wide Main Internal Roads & Arterials',
                      'Individual Water Supply & Power Points to Each Plot',
                      'Central Clubhouse with Swimming Pool & Indoor Lounge',
                      '5 Themed Landscaped Gardens & Stargazing Gazebos',
                    ]
                ).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#C9A24A]" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadBrochure}
                  disabled={isDownloadingBrochure}
                  className="bg-[#00291E] hover:bg-[#003D2B] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded shadow-lg transition-all flex items-center gap-2.5 border border-[#C9A24A]/40 hover:border-[#C9A24A]"
                >
                  {isDownloadingBrochure ? (
                    <Loader2 className="w-4 h-4 text-[#C9A24A] animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 text-[#C9A24A]" />
                  )}
                  <span>
                    {project.brochureDownloadText ||
                      project.masterPlanDownloadText ||
                      'Download Master Plan Brochure'}
                  </span>
                  {(project.brochureFileSize || project.masterPlanPdfFileSize) && (
                    <span className="text-[10px] bg-[#C9A24A]/20 text-[#C9A24A] px-2 py-0.5 rounded font-mono font-normal">
                      {project.brochureFileSize || project.masterPlanPdfFileSize}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div
                onClick={() =>
                  setActiveLightboxItem({
                    id: `ml-${project.id}`,
                    title: project.masterPlanTitle || `${project.name} Master Layout`,
                    category: 'master-plan',
                    project: project.name,
                    alt: 'Master Layout Plan',
                    image: masterPlanImg,
                    displayOrder: 1,
                    active: true,
                  })
                }
                className="relative aspect-[16/11] rounded-lg overflow-hidden border-2 border-[#C9A24A]/40 shadow-2xl bg-black cursor-pointer group"
              >
                <img
                  src={masterPlanImg}
                  alt={`${project.name} Master Layout Aerial View`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-3 right-3 bg-[#00291E]/90 text-white px-3 py-1.5 rounded text-[11px] font-medium flex items-center gap-1.5 shadow">
                  <Maximize2 className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Click to Enlarge Layout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Project Photo Showcase Gallery (If photos uploaded by admin) */}
      {project.galleryPhotos && project.galleryPhotos.length > 0 && (
        <section aria-label="Project Photos" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {project.galleryEyebrow || 'GALLERY SHOWCASE'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal mt-1">
              {project.galleryTitle || 'Project Photos & Architecture'}
            </h2>
            <p className="font-serif text-sm text-[#0B4A36] italic mt-1">
              {project.gallerySubtitle || 'Real glimpses of development progress, landscape and lifestyle.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.galleryPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() =>
                  setActiveLightboxItem({
                    id: photo.id,
                    title: photo.title,
                    category: 'project',
                    project: project.name,
                    alt: photo.alt || photo.title,
                    image: photo.image,
                    displayOrder: 1,
                    active: true,
                  })
                }
                className="bg-[#F8F0D8] rounded-lg overflow-hidden border border-[#C9A24A]/25 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="aspect-[16/10] overflow-hidden relative bg-[#00291E]">
                  <img
                    src={photo.image}
                    alt={photo.alt || photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-3.5">
                  <h4 className="font-serif text-sm text-[#00291E] font-medium truncate">
                    {photo.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Lifestyle Spaces (Matching Brochure Page 5) */}
      {project.lifestyleSpaces && project.lifestyleSpaces.length > 0 && (
        <section aria-label="Lifestyle Spaces" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {project.lifestyleEyebrow || 'GREEN RETREAT'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal mt-1">
              {project.lifestyleTitle || 'Lifestyle Spaces'}
            </h2>
            <p className="font-serif text-sm text-[#0B4A36] italic mt-1">
              {project.lifestyleSubtitle || 'Green Spaces for a Healthy, Happy & Harmonious Life.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.lifestyleSpaces.map((space) => (
              <div
                key={space.id}
                onClick={() =>
                  setActiveLightboxItem({
                    id: space.id,
                    title: `${space.number}. ${space.title}`,
                    category: 'lifestyle',
                    project: project.name,
                    alt: space.title,
                    image: space.image,
                    displayOrder: space.number,
                    active: true,
                  })
                }
                className="bg-[#F8F0D8] rounded-lg overflow-hidden border border-[#C9A24A]/30 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={space.image}
                    alt={space.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#00291E]/90 text-[#C9A24A] text-xs font-semibold px-2.5 py-1 rounded">
                    {space.number}. {space.title}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-serif text-base text-[#00291E] font-medium">
                    {space.title}
                  </h4>
                  {space.subtitle && (
                    <p className="text-xs text-[#0B4A36] font-light mt-0.5">
                      {space.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Games Facilities (Matching Brochure Page 6) */}
      {project.gamesFacilities && project.gamesFacilities.length > 0 && (
        <section aria-label="Games Facilities" className="bg-[#00291E] text-white py-16 border-t border-[#C9A24A]/30">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                {project.facilitiesEyebrow || 'RECREATION & WELLNESS'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mt-1">
                {project.facilitiesTitle || 'Games & Club Facilities'}
              </h2>
              <p className="font-serif text-sm text-[#F8F0D8] italic mt-1 font-light">
                {project.facilitiesSubtitle || 'For Recreation. For Community. For You.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.gamesFacilities.map((group) => (
                <div
                  key={group.id}
                  className="bg-[#001D15] rounded-lg overflow-hidden border border-[#C9A24A]/25 shadow-lg flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={group.image}
                      alt={group.categoryName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg text-[#C9A24A] font-medium mb-3">
                        {group.categoryName}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-white/80 font-light">
                        {group.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24A]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Quality Infrastructure (Brochure Page 7) */}
      {project.infrastructure && project.infrastructure.length > 0 && (
        <section aria-label="Quality Infrastructure" className="bg-[#FFF8E7] py-16 border-t border-[#C9A24A]/25">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                {project.infraEyebrow || 'INFRASTRUCTURE'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal mt-1">
                {project.infraTitle || 'Quality Infrastructure'}
              </h2>
              <p className="font-serif text-sm text-[#0B4A36] italic mt-1 font-light">
                {project.infraSubtitle || 'Hassle Free Living. Built for a Better Tomorrow.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6">
              {project.infrastructure.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F8F0D8] p-5 rounded-lg border border-[#C9A24A]/25 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-[#00291E] flex items-center justify-center mb-3">
                    {getInfraIcon(item.icon)}
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#00291E]">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Location Advantages & Connectivity */}
      <section aria-label="Location Advantages" className="bg-[#F8F0D8] py-16 border-t border-[#C9A24A]/25">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                {project.locationEyebrow || 'STRATEGIC LOCATION'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal mt-1">
                {project.locationTitle || 'Location Advantages'}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#0B4A36] mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C9A24A]" />
                <span>{project.location}</span>
              </p>

              <div className="mt-6 space-y-3">
                {(project.locationBenefits && project.locationBenefits.length > 0
                  ? project.locationBenefits
                  : [
                      'Just 2 km from Mandangad Town center',
                      'Direct touch to Pandharpur Highway (0 km)',
                      'Close to Upcoming PAT MIDC (2 km)',
                      '170 km scenic drive from Pune',
                      '190 km smooth connectivity from Mumbai',
                    ]
                ).map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-[#FFF8E7] rounded-lg border border-[#C9A24A]/25">
                    <div className="w-6 h-6 rounded-full bg-[#00291E] text-[#C9A24A] flex items-center justify-center shrink-0 text-xs">
                      ✓
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#00291E]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-[#C9A24A]/40 shadow-xl h-80 bg-slate-900">
                <iframe
                  title={`${project.name} Location Map`}
                  src={project.mapUrl || "https://maps.google.com/maps?q=Mandangad,Ratnagiri,Maharashtra&t=&z=11&ie=UTF8&iwloc=&output=embed"}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Bottom CTA Banner */}
      <section aria-label="Booking CTA" className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#00291E]/80">
              {project.ctaBannerTag || 'LIMITED PLOTS AVAILABLE'}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium mt-1">
              {project.ctaBannerTitle || `Build Your Dream Home in ${project.name}`}
            </h3>
            <p className="text-xs sm:text-sm text-[#00291E]/90 mt-1 max-w-xl">
              {project.ctaBannerText || `Plots ranging from ${project.plotSizes} with ${project.sanctionApproval || 'Collector NA approval'} and ${project.possessionStatus}.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadBrochure}
              disabled={isDownloadingBrochure}
              className="bg-white/90 hover:bg-white text-[#00291E] font-semibold text-xs uppercase tracking-wider px-5 py-3.5 rounded shadow transition-all flex items-center gap-1.5"
            >
              {isDownloadingBrochure ? (
                <Loader2 className="w-4 h-4 text-[#00291E] animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-[#00291E]" />
              )}
              <span>Brochure (PDF)</span>
            </button>
            <button
              onClick={onBookSiteVisit}
              className="bg-[#00291E] hover:bg-[#003D2B] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded shadow-lg transition-all"
            >
              {project.ctaBannerButtonText || 'Book a Site Visit →'}
            </button>
            <a
              href={`tel:${settings.phone}`}
              className="bg-white/80 hover:bg-white text-[#00291E] text-xs font-semibold uppercase tracking-wider px-5 py-3.5 rounded shadow transition-all flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4 text-[#00291E]" />
              <span>Call Advisor</span>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox for gallery photos */}
      <Lightbox
        item={activeLightboxItem}
        items={allProjectPhotos}
        onClose={() => setActiveLightboxItem(null)}
        onNavigate={(newItem) => setActiveLightboxItem(newItem)}
      />
    </article>
  );
};
