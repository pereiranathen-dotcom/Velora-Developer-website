import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  Calendar,
  MessageCircle,
  ExternalLink,
  Tag,
  ShieldCheck,
  Gift,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ASSETS } from '../../data/initialData';

interface PromotionalModalProps {
  onNavigate?: (path: string) => void;
  onOpenSiteVisit?: (projectName?: string) => void;
  forcePreview?: boolean; // For admin preview mode
  onClosePreview?: () => void;
}

export const PromotionalModal: React.FC<PromotionalModalProps> = ({
  onNavigate,
  onOpenSiteVisit,
  forcePreview = false,
  onClosePreview,
}) => {
  const { popupSettings, projects, settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // If in admin preview mode, keep open
    if (forcePreview) {
      setIsOpen(true);
      return;
    }

    if (!popupSettings.enabled) {
      setIsOpen(false);
      return;
    }

    // Check frequency dismissal rules
    if (popupSettings.frequency === 'once-per-session') {
      const dismissed = sessionStorage.getItem('velora_popup_dismissed');
      if (dismissed === 'true') return;
    } else if (popupSettings.frequency === 'once-per-day') {
      const today = new Date().toISOString().slice(0, 10);
      const dismissedDate = localStorage.getItem('velora_popup_dismissed_day');
      if (dismissedDate === today) return;
    }

    // Set delay timer
    const delay = Math.max(1, popupSettings.delaySeconds || 2) * 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [popupSettings.enabled, popupSettings.delaySeconds, popupSettings.frequency, forcePreview]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (forcePreview) {
      if (onClosePreview) onClosePreview();
      return;
    }

    // Record dismissal
    if (popupSettings.frequency === 'once-per-session') {
      sessionStorage.setItem('velora_popup_dismissed', 'true');
    } else if (popupSettings.frequency === 'once-per-day') {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('velora_popup_dismissed_day', today);
    }
  };

  const handleCopyCode = () => {
    if (!popupSettings.discountCode) return;
    navigator.clipboard.writeText(popupSettings.discountCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Find linked project if configured
  const linkedProject = popupSettings.linkedProjectId
    ? projects.find(
        (p) =>
          p.id === popupSettings.linkedProjectId ||
          p.slug === popupSettings.linkedProjectId
      )
    : undefined;

  const handleAction = (actionType: string) => {
    handleDismiss();

    if (actionType === 'open-project') {
      if (linkedProject) {
        if (onNavigate) onNavigate(`/projects/${linkedProject.slug}`);
      } else if (projects.length > 0 && onNavigate) {
        onNavigate(`/projects/${projects[0].slug}`);
      }
    } else if (actionType === 'open-site-visit') {
      if (onOpenSiteVisit) {
        onOpenSiteVisit(linkedProject ? linkedProject.name : 'Amrutvan');
      }
    } else if (actionType === 'open-whatsapp') {
      const phone = (settings.whatsapp || '+91 93221 33592').replace(/[^0-9]/g, '');
      const projectRef = linkedProject ? linkedProject.name : 'Velora Estates';
      const offerMsg = encodeURIComponent(
        `Hello Velora Developers! I saw the "${popupSettings.headline}" promotion on your website${
          popupSettings.discountCode ? ` (Code: ${popupSettings.discountCode})` : ''
        } for ${projectRef}. Please share the current price sheet, brochure, and booking privileges.`
      );
      window.open(`https://wa.me/${phone}?text=${offerMsg}`, '_blank', 'noopener,noreferrer');
    } else if (actionType === 'custom-link' && popupSettings.customCtaUrl) {
      if (popupSettings.customCtaUrl.startsWith('/')) {
        if (onNavigate) onNavigate(popupSettings.customCtaUrl);
      } else {
        window.open(popupSettings.customCtaUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="fixed inset-0"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-2xl bg-[#FFF8E7] text-[#00291E] rounded-2xl shadow-2xl border-2 border-[#C9A24A]/40 overflow-hidden transform transition-all animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md"
          aria-label="Close Announcement"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. ONLY IMAGE LAYOUT */}
        {popupSettings.layout === 'only-image' && (
          <div className="relative group cursor-pointer" onClick={() => handleAction(popupSettings.primaryCtaAction)}>
            <img
              src={popupSettings.image || ASSETS.heroEntrance}
              alt={popupSettings.imageAlt || popupSettings.headline || 'Velora Announcement Flyer'}
              className="w-full h-auto max-h-[80vh] object-contain sm:object-cover bg-[#001D15]"
            />
            {/* Bottom Floating CTA banner if configured */}
            <div className="p-4 sm:p-5 bg-gradient-to-t from-[#001D15] via-[#001D15]/95 to-transparent text-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                {popupSettings.badgeText && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                    {popupSettings.badgeText}
                  </span>
                )}
                <h3 className="font-serif text-base sm:text-lg font-medium text-[#F8F0D8]">
                  {popupSettings.headline || 'Special Promotional Privilege'}
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(popupSettings.primaryCtaAction);
                }}
                className="w-full sm:w-auto bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded shadow-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{popupSettings.primaryCtaText || 'Explore Now →'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 2. ONLY TEXT LAYOUT */}
        {popupSettings.layout === 'only-text' && (
          <div className="p-6 sm:p-8 space-y-5 bg-[#00291E] text-white border-4 border-[#C9A24A]/30">
            {/* Top Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#00291E] bg-[#C9A24A] px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3 h-3 text-[#00291E]" />
                {popupSettings.badgeText || 'Exclusive Announcement'}
              </span>
              {linkedProject && (
                <span className="text-[11px] text-[#C9A24A] font-serif border border-[#C9A24A]/40 px-2.5 py-0.5 rounded-full">
                  {linkedProject.name}
                </span>
              )}
            </div>

            {/* Headline & Description */}
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F0D8] font-normal leading-tight">
                {popupSettings.headline}
              </h2>
              {popupSettings.subheadline && (
                <p className="text-xs sm:text-sm font-medium text-[#C9A24A]">
                  {popupSettings.subheadline}
                </p>
              )}
              {popupSettings.bodyText && (
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light pt-1">
                  {popupSettings.bodyText}
                </p>
              )}
            </div>

            {/* Bullet Highlights */}
            {popupSettings.highlightPoints && popupSettings.highlightPoints.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {popupSettings.highlightPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-[#FFF8E7]/5 border border-[#C9A24A]/20 p-2.5 rounded-lg text-xs text-[#F8F0D8]"
                  >
                    <Check className="w-4 h-4 text-[#C9A24A] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Discount Coupon Box */}
            {popupSettings.discountCode && (
              <div className="p-3 bg-[#001D15] rounded-xl border border-[#C9A24A]/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-[#C9A24A]" />
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                      Promo / Privilege Code
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#C9A24A] tracking-wider">
                      {popupSettings.discountCode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-[#C9A24A]/20 hover:bg-[#C9A24A]/30 text-[#C9A24A] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#C9A24A]/40"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => handleAction(popupSettings.primaryCtaAction)}
                className="w-full sm:flex-1 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>{popupSettings.primaryCtaText || 'Claim Offer & Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {popupSettings.secondaryCtaText && (
                <button
                  onClick={() => handleAction(popupSettings.secondaryCtaAction || 'close')}
                  className="w-full sm:w-auto text-xs text-white/70 hover:text-white px-4 py-3 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
                >
                  {popupSettings.secondaryCtaText}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. TEXT & IMAGE LAYOUT (Default & Most Popular) */}
        {popupSettings.layout === 'text-and-image' && (
          <div>
            {/* Top Media Banner */}
            <div className="relative aspect-[16/8] sm:aspect-[16/7] overflow-hidden bg-[#001D15]">
              <img
                src={popupSettings.image || ASSETS.heroEntrance}
                alt={popupSettings.imageAlt || popupSettings.headline}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8E7] via-transparent to-black/30" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00291E] bg-[#C9A24A] px-3 py-1 rounded-full shadow-lg">
                  <Sparkles className="w-3 h-3 text-[#00291E]" />
                  {popupSettings.badgeText || 'Exclusive Launch Privilege'}
                </span>
                {linkedProject && (
                  <span className="text-[11px] font-serif bg-[#00291E]/90 text-[#F8F0D8] border border-[#C9A24A]/40 px-3 py-1 rounded-full shadow-lg">
                    {linkedProject.name}
                  </span>
                )}
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-6 sm:p-7 space-y-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#00291E] font-normal leading-tight">
                  {popupSettings.headline}
                </h2>
                {popupSettings.subheadline && (
                  <p className="text-xs sm:text-sm font-semibold text-[#0B4A36] mt-1">
                    {popupSettings.subheadline}
                  </p>
                )}
                {popupSettings.bodyText && (
                  <p className="text-xs sm:text-sm text-[#26342D]/80 leading-relaxed font-light mt-1.5">
                    {popupSettings.bodyText}
                  </p>
                )}
              </div>

              {/* Bullet highlights */}
              {popupSettings.highlightPoints && popupSettings.highlightPoints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {popupSettings.highlightPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-[#F8F0D8] border border-[#C9A24A]/30 p-2.5 rounded-lg text-xs text-[#00291E] font-medium"
                    >
                      <Check className="w-4 h-4 text-[#0B4A36] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Discount code pill */}
              {popupSettings.discountCode && (
                <div className="p-3 bg-[#F8F0D8] rounded-xl border border-[#C9A24A]/50 flex items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#00291E] flex items-center justify-center text-[#C9A24A]">
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#26342D]/60 block font-semibold">
                        Exclusive Promo Code
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#00291E] tracking-wider">
                        {popupSettings.discountCode}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-[#00291E] hover:bg-[#0B4A36] text-[#C9A24A] rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction(popupSettings.primaryCtaAction)}
                  className="w-full sm:flex-1 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>{popupSettings.primaryCtaText || 'Explore & Claim Offer'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {popupSettings.secondaryCtaText && (
                  <button
                    onClick={() => handleAction(popupSettings.secondaryCtaAction || 'close')}
                    className="w-full sm:w-auto text-xs text-[#26342D]/70 hover:text-[#00291E] px-4 py-3 rounded-lg border border-[#C9A24A]/30 hover:border-[#C9A24A] transition-colors"
                  >
                    {popupSettings.secondaryCtaText}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
