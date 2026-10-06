import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  RotateCcw,
  Eye,
  Sliders,
  X,
  Check,
  Layers,
  Info,
  Loader2,
  Plus,
  Maximize2,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Clock,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { ASSETS } from '../../data/initialData';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { WebsiteContent, GalleryItem, HeroBannerMode, HeroSlide } from '../../types';
import { ImageDimensionBadge } from '../../components/common/ImageDimensionBadge';

// Curated high-res luxury photography presets
const HOMEPAGE_PRESET_LIBRARY = [
  {
    id: 'p-entrance',
    name: 'Amrutvan Grand Stone Entrance (Twilight)',
    category: 'Architecture / Entrance',
    url: ASSETS.heroEntrance,
    recommendedFor: 'Hero Banner',
  },
  {
    id: 'p-sunset',
    name: 'Family Overlooking Golden Mountain Sunset',
    category: 'Lifestyle / Nature',
    url: ASSETS.familySunset,
    recommendedFor: 'About Section',
  },
  {
    id: 'p-aerial',
    name: 'Rolling Lush Green Plotted Estate (Aerial)',
    category: 'Plotted Layout',
    url: ASSETS.aerialGreenEstate,
    recommendedFor: 'Hero or Featured Project',
  },
  {
    id: 'p-highway',
    name: 'Scenic Hillside Highway & Western Ghats',
    category: 'Connectivity / Nature',
    url: ASSETS.scenicRoad,
    recommendedFor: 'Hero or Inquiry Backdrop',
  },
  {
    id: 'p-clubhouse',
    name: 'Two-Story Clubhouse & Panoramic Deck',
    category: 'Clubhouse & Amenities',
    url: ASSETS.clubhouse,
    recommendedFor: 'Showcase / Features',
  },
  {
    id: 'p-gazebo',
    name: 'Central Garden Botanical Walkways & Gazebos',
    category: 'Gardens & Greenery',
    url: ASSETS.gazeboGarden,
    recommendedFor: 'Lifestyle / About Section',
  },
  {
    id: 'p-kids',
    name: 'Children Adventure & Play Park',
    category: 'Recreation',
    url: ASSETS.kidsPlay,
    recommendedFor: 'Amenities / Gallery',
  },
  {
    id: 'p-sports',
    name: 'Badminton Courts & Turf Sports Arena',
    category: 'Sports & Wellness',
    url: ASSETS.outdoorSports,
    recommendedFor: 'Amenities / Gallery',
  },
  {
    id: 'p-indoor',
    name: 'Indoor Games & Community Lounge',
    category: 'Indoor Activities',
    url: ASSETS.indoorGames,
    recommendedFor: 'Recreation',
  },
];

export const AdminHomePagePhotosView: React.FC = () => {
  const { content, gallery, projects } = useStore();

  const [formData, setFormData] = useState<WebsiteContent>({
    ...content,
    heroMode: content.heroMode || 'text-and-image',
    heroSingleImage: content.heroSingleImage || content.heroBackgroundImage || ASSETS.heroEntrance,
    heroSingleImageAlt: content.heroSingleImageAlt || 'Velora Developers Luxury Estate Banner',
    heroSingleImageLink: content.heroSingleImageLink || '',
    heroSlides:
      content.heroSlides && content.heroSlides.length > 0
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
          ],
    heroSlideshowInterval: content.heroSlideshowInterval || 5,
    heroBackgroundImage: content.heroBackgroundImage || ASSETS.heroEntrance,
    heroOverlayDarkness: content.heroOverlayDarkness !== undefined ? content.heroOverlayDarkness : 75,
    aboutImage: content.aboutImage || ASSETS.familySunset,
    aboutImageCaption: content.aboutImageCaption || 'Family looking over sunset hills at Velora Estates',
    featuredProjectImage: content.featuredProjectImage || ASSETS.heroEntrance,
    whyVeloraImage: content.whyVeloraImage || ASSETS.aerialGreenEstate,
    leadFormBackgroundImage: content.leadFormBackgroundImage || ASSETS.scenicRoad,
    locationImage: content.locationImage || ASSETS.scenicRoad,
    locationImageAlt:
      content.locationImageAlt ||
      'Scenic winding mountain highway during sunset with white car driving to Mandangad Ratnagiri',
  });

  const [compressingTarget, setCompressingTarget] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [presetTargetField, setPresetTargetField] = useState<keyof WebsiteContent | null>(null);
  const [presetTargetGalleryId, setPresetTargetGalleryId] = useState<string | null>(null);
  const [presetTargetProjectId, setPresetTargetProjectId] = useState<string | null>(null);
  const [presetTargetSlideIndex, setPresetTargetSlideIndex] = useState<number | null>(null);
  const [adminPreviewSlide, setAdminPreviewSlide] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Image compressor & uploader
  const handleOptimizedUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: keyof WebsiteContent,
    maxWidth = 1920,
    maxHeight = 1080
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingTarget(fieldKey as string);
    try {
      const optimized = await optimizeImageFile(file, maxWidth, maxHeight, 0.78);
      setFormData((prev) => ({ ...prev, [fieldKey]: optimized }));
      const sizeKb = Math.round(optimized.length / 1024);
      showToast(`✓ Image optimized & uploaded (${sizeKb} KB)`);
    } catch (err: any) {
      console.warn('Fallback reader for upload:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          setFormData((prev) => ({ ...prev, [fieldKey]: res }));
          showToast('✓ Photo uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressingTarget(null);
      e.target.value = '';
    }
  };

  // Swap photo for project card (Amrutvan or Green Opulence) directly
  const handleProjectThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    projectId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingTarget(`project-${projectId}`);
    try {
      const optimized = await optimizeImageFile(file, 1000, 650, 0.78);
      const proj = projects.find((p) => p.id === projectId || p.slug === projectId);
      if (proj) {
        StoreService.saveProject({
          ...proj,
          thumbnail: optimized,
        });
        showToast(`✓ Photo saved for "${proj.name}"! Changes are live across the website.`);
      }
    } catch (err: any) {
      console.error('Project thumbnail upload error:', err);
      showToast('Could not process project photo.');
    } finally {
      setCompressingTarget(null);
      e.target.value = '';
    }
  };

  // Swap photo in the Homepage Gallery strip directly
  const handleGalleryPhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    galleryItemId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingTarget(`gallery-${galleryItemId}`);
    try {
      const optimized = await optimizeImageFile(file, 1000, 650, 0.78);
      const item = gallery.find((g) => g.id === galleryItemId);
      if (item) {
        StoreService.saveGalleryItem({
          ...item,
          image: optimized,
        });
        showToast(`✓ Gallery photo updated in homepage strip!`);
      }
    } catch {
      showToast('Could not process image.');
    } finally {
      setCompressingTarget(null);
      e.target.value = '';
    }
  };

  const handleApplyPreset = (url: string) => {
    if (presetTargetField) {
      setFormData((prev) => ({ ...prev, [presetTargetField]: url }));
      showToast('✓ Preset photo applied!');
      setPresetTargetField(null);
    } else if (presetTargetProjectId) {
      const proj = projects.find((p) => p.id === presetTargetProjectId || p.slug === presetTargetProjectId);
      if (proj) {
        StoreService.saveProject({
          ...proj,
          thumbnail: url,
        });
        showToast(`✓ Photo updated for "${proj.name}"!`);
      }
      setPresetTargetProjectId(null);
    } else if (presetTargetGalleryId) {
      const item = gallery.find((g) => g.id === presetTargetGalleryId);
      if (item) {
        StoreService.saveGalleryItem({
          ...item,
          image: url,
        });
        showToast(`✓ Preset photo applied to homepage gallery strip!`);
      }
      setPresetTargetGalleryId(null);
    } else if (presetTargetSlideIndex !== null) {
      const slides = [...(formData.heroSlides || [])];
      if (slides[presetTargetSlideIndex]) {
        slides[presetTargetSlideIndex] = {
          ...slides[presetTargetSlideIndex],
          image: url,
        };
        setFormData((prev) => ({ ...prev, heroSlides: slides }));
        showToast(`✓ Preset photo applied to Slide #${presetTargetSlideIndex + 1}!`);
      }
      setPresetTargetSlideIndex(null);
    }
  };

  const handleSlideImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingTarget(`slide-${index}`);
    try {
      const optimized = await optimizeImageFile(file, 1920, 1080, 0.80);
      const slides = [...(formData.heroSlides || [])];
      if (slides[index]) {
        slides[index] = { ...slides[index], image: optimized };
        setFormData((prev) => ({ ...prev, heroSlides: slides }));
        showToast(`✓ Photo uploaded for Slide #${index + 1}!`);
      }
    } catch {
      showToast('Could not process slide image.');
    } finally {
      setCompressingTarget(null);
      e.target.value = '';
    }
  };

  const handleAddSlide = () => {
    const current = formData.heroSlides || [];
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      image: ASSETS.heroEntrance,
      caption: 'New Scenic Estate View',
      linkUrl: '/projects',
    };
    setFormData({
      ...formData,
      heroSlides: [...current, newSlide],
    });
    showToast('✓ New slide added to slideshow!');
  };

  const handleRemoveSlide = (idx: number) => {
    const current = [...(formData.heroSlides || [])];
    if (current.length <= 1) {
      showToast('Slideshow must have at least 1 slide.');
      return;
    }
    current.splice(idx, 1);
    setFormData({ ...formData, heroSlides: current });
    showToast('Slide removed.');
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    const current = [...(formData.heroSlides || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[idx];
    current[idx] = current[targetIdx];
    current[targetIdx] = temp;
    setFormData({ ...formData, heroSlides: current });
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    StoreService.saveWebsiteContent(formData);
    showToast('✓ All home page photos & settings published live to website!');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all home page photos to the authentic Velora estate defaults?')) {
      const resetData: WebsiteContent = {
        ...formData,
        heroMode: 'text-and-image',
        heroSingleImage: ASSETS.heroEntrance,
        heroSingleImageAlt: 'Amrutvan Luxury Plotted Development Entrance at Dusk',
        heroSingleImageLink: '/projects/amrutvan',
        heroSlideshowInterval: 5,
        heroSlides: [
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
        ],
        heroBackgroundImage: ASSETS.heroEntrance,
        heroOverlayDarkness: 75,
        aboutImage: ASSETS.familySunset,
        aboutImageCaption: 'Family looking over sunset hills at Velora Estates',
        featuredProjectImage: ASSETS.heroEntrance,
        whyVeloraImage: ASSETS.aerialGreenEstate,
        leadFormBackgroundImage: ASSETS.scenicRoad,
        locationImage: ASSETS.scenicRoad,
        locationImageAlt:
          'Scenic winding mountain highway during sunset with white car driving to Mandangad Ratnagiri',
      };
      setFormData(resetData);
      StoreService.saveWebsiteContent(resetData);
      showToast('Home page photography restored to factory defaults.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#00291E] border-2 border-[#C9A24A] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#C9A24A] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-2xl text-[#00291E]">Home Page Photos & Banners</h2>
            <span className="bg-[#C9A24A]/20 text-[#00291E] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-[#C9A24A]/40 flex items-center gap-1">
              <Camera className="w-3 h-3 text-[#C9A24A]" />
              Live Website Photos
            </span>
          </div>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Upload new photos from your computer or pick from the luxury photography library to customize every photo on the website homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>View Live Home Page</span>
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-white/80 hover:bg-white text-[#00291E] border border-gray-300 text-xs font-semibold rounded shadow-sm flex items-center gap-1.5 transition-colors"
            title="Restore original photography defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
            <span>Restore Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-5 py-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.98] text-[#00291E] font-bold text-xs uppercase tracking-wider rounded shadow flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Photos</span>
          </button>
        </div>
      </div>

      {/* MASTER PHOTO DIMENSIONS CHEAT SHEET */}
      <div className="bg-[#00291E] text-white p-5 rounded-2xl border-2 border-[#C9A24A]/50 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#C9A24A]" />
            <h3 className="font-serif text-sm font-semibold text-[#F8F0D8]">
              Website Photo Dimensions & Resolution Guide
            </h3>
          </div>
          <span className="text-[10px] text-[#C9A24A] bg-[#C9A24A]/10 border border-[#C9A24A]/30 px-2.5 py-0.5 rounded-full font-mono">
            High-Resolution Retina Ready • Auto-Optimized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">1. Hero Banners</span>
            <span className="font-mono text-white font-semibold">1920 × 1080 px</span>
            <span className="text-white/60 block text-[10px]">16:9 Landscape • &lt; 2.5 MB</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">2. Project Cards</span>
            <span className="font-mono text-white font-semibold">1200 × 800 px</span>
            <span className="text-white/60 block text-[10px]">3:2 Landscape • &lt; 1.2 MB</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">3. About Lifestyle</span>
            <span className="font-mono text-white font-semibold">1200 × 900 px</span>
            <span className="text-white/60 block text-[10px]">4:3 / 16:10 • &lt; 1.5 MB</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">4. Featured Backdrop</span>
            <span className="font-mono text-white font-semibold">1920 × 1080 px</span>
            <span className="text-white/60 block text-[10px]">16:9 Full Bleed • &lt; 2.5 MB</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">5. Location Highway</span>
            <span className="font-mono text-white font-semibold">1600 × 1000 px</span>
            <span className="text-white/60 block text-[10px]">16:10 Ratio • &lt; 1.5 MB</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">6. Master Plan Blueprint</span>
            <span className="font-mono text-white font-semibold">1600 × 1000 px</span>
            <span className="text-white/60 block text-[10px]">16:10 Schematic • &lt; 2.0 MB</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">7. Architecture Gallery</span>
            <span className="font-mono text-white font-semibold">1200 × 800 px</span>
            <span className="text-white/60 block text-[10px]">3:2 Landscape • &lt; 1.5 MB</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">8. Popup Banner / Flyer</span>
            <span className="font-mono text-white font-semibold">1200×600 / 1080×1350</span>
            <span className="text-white/60 block text-[10px]">Banner / Vertical Flyer</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg">
            <span className="text-[#C9A24A] font-bold block text-[10px] uppercase">9. Brand Logo Image</span>
            <span className="font-mono text-white font-semibold">400 × 120 px</span>
            <span className="text-white/60 block text-[10px]">Transparent PNG/SVG • &lt; 2.0 MB</span>
          </div>
        </div>
      </div>

      {/* BRAND LOGO CARD */}
      <div className="bg-[#00291E] text-white p-5 rounded-xl border border-[#C9A24A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 border border-[#C9A24A]/40 text-[#C9A24A] flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif text-base text-[#F8F0D8]">Need to change or upload the Website Logo?</h4>
              <span className="text-[10px] bg-[#C9A24A] text-[#00291E] font-bold px-2 py-0.5 rounded">NEW</span>
            </div>
            <p className="text-xs text-white/70 mt-0.5">
              Upload your custom logo image (PNG, SVG), adjust display height (28-72px), or restore the Velora luxury vector emblem in Website Content CMS.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            window.location.hash = '';
            // Dispatches or triggers navigation to Website Content
            const btn = document.querySelector('[data-nav-view="content"]') as HTMLButtonElement;
            if (btn) btn.click();
          }}
          className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded shadow flex items-center gap-2 transition-all self-start sm:self-auto shrink-0"
        >
          <span>Manage Logo in Website CMS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* PHOTO SECTION 1: HERO BANNER & DISPLAY MODES */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border-2 border-[#C9A24A]/40 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
              TOP OF HOMEPAGE
            </span>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <span>1. Hero Section Display Mode & Photography</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              Choose your hero format: Full text & image banner, single image-only promotional banner, or an auto-rotating slideshow carousel.
            </p>
          </div>
        </div>

        {/* HERO DISPLAY MODE SELECTOR (3 OPTIONS) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#00291E] mb-2">
            Select Hero Display Format
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Mode 1: Text & Image (Default) */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, heroMode: 'text-and-image' })}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all ${
                (formData.heroMode || 'text-and-image') === 'text-and-image'
                  ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                  : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C9A24A]/20 text-[#C9A24A]">
                  Option 1
                </span>
                {(formData.heroMode || 'text-and-image') === 'text-and-image' && (
                  <Check className="w-4 h-4 text-[#C9A24A]" />
                )}
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold">Text & Image Banner</h4>
                <p className={`text-[10px] mt-0.5 leading-relaxed ${
                  (formData.heroMode || 'text-and-image') === 'text-and-image' ? 'text-white/70' : 'text-[#26342D]/70'
                }`}>
                  Current style: Grand headline, subtitle, dual CTA buttons, and bottom 3-pillar feature strip over photo.
                </p>
                <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                  (formData.heroMode || 'text-and-image') === 'text-and-image' ? 'border-white/15 text-[#C9A24A]' : 'border-[#C9A24A]/20 text-[#00291E]'
                }`}>
                  <span className="font-mono font-semibold">1920 × 1080 px</span>
                  <span className="opacity-75">16:9 • Max 2.5 MB</span>
                </div>
              </div>
            </button>

            {/* Mode 2: Single Hero Banner (Image Only) */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, heroMode: 'single-image' })}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all ${
                formData.heroMode === 'single-image'
                  ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                  : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C9A24A]/20 text-[#C9A24A]">
                  Option 2
                </span>
                {formData.heroMode === 'single-image' && (
                  <Check className="w-4 h-4 text-[#C9A24A]" />
                )}
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold">Single Banner (Image Only)</h4>
                <p className={`text-[10px] mt-0.5 leading-relaxed ${
                  formData.heroMode === 'single-image' ? 'text-white/70' : 'text-[#26342D]/70'
                }`}>
                  Clean, full-bleed graphic poster or launch banner without text overlays. Clickable with optional project link.
                </p>
                <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                  formData.heroMode === 'single-image' ? 'border-white/15 text-[#C9A24A]' : 'border-[#C9A24A]/20 text-[#00291E]'
                }`}>
                  <span className="font-mono font-semibold">1920 × 1080 px</span>
                  <span className="opacity-75">16:9 • Max 2.5 MB</span>
                </div>
              </div>
            </button>

            {/* Mode 3: Slide Show Banner (Image Only) */}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, heroMode: 'slideshow-image' })}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all ${
                formData.heroMode === 'slideshow-image'
                  ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                  : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C9A24A]/20 text-[#C9A24A]">
                  Option 3
                </span>
                {formData.heroMode === 'slideshow-image' && (
                  <Check className="w-4 h-4 text-[#C9A24A]" />
                )}
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold">Slide Show Banner (Multi-Image)</h4>
                <p className={`text-[10px] mt-0.5 leading-relaxed ${
                  formData.heroMode === 'slideshow-image' ? 'text-white/70' : 'text-[#26342D]/70'
                }`}>
                  Auto-rotating carousel of multiple promotional banners with smooth transitions, arrows, and dot indicators.
                </p>
                <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                  formData.heroMode === 'slideshow-image' ? 'border-white/15 text-[#C9A24A]' : 'border-[#C9A24A]/20 text-[#00291E]'
                }`}>
                  <span className="font-mono font-semibold">1920 × 1080 px / slide</span>
                  <span className="opacity-75">16:9 • Max 2.5 MB</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* DIMENSION SPECIFICATION BANNER FOR HERO */}
        <ImageDimensionBadge
          variant="banner"
          context={
            formData.heroMode === 'single-image'
              ? 'Single Hero Banner'
              : formData.heroMode === 'slideshow-image'
              ? 'Slideshow Banner Slides'
              : 'Hero Background Photo'
          }
          dimensions="1920 × 1080 px"
          aspectRatio="16:9 (Widescreen Landscape)"
          maxSize="2.5 MB"
          formats="JPG, PNG, WebP"
        />

        {/* ========================================================
            SUB-SECTION A: TEXT & IMAGE MODE CONTROLS
            ======================================================== */}
        {(formData.heroMode || 'text-and-image') === 'text-and-image' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#00291E]">
                Hero Background Photo & Text Contrast
              </span>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
                  {compressingTarget === 'heroBackgroundImage' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={compressingTarget === 'heroBackgroundImage'}
                    onChange={(e) => handleOptimizedUpload(e, 'heroBackgroundImage', 1920, 1080)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setPresetTargetField('heroBackgroundImage')}
                  className="text-xs bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Presets</span>
                </button>
              </div>
            </div>

            {/* Live Preview Box with Headline Overlay simulation */}
            <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[16/7] bg-[#00291E] border border-[#C9A24A]/40 shadow-inner">
              <img
                src={formData.heroBackgroundImage}
                alt="Hero Banner Live Preview"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#00291E]/95 via-[#00291E]/80 to-[#00291E]/40"
                style={{
                  opacity: (formData.heroOverlayDarkness || 75) / 100,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-transparent to-black/30" />

              <div className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 max-w-lg text-white pointer-events-none pr-4">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24A] block mb-1">
                  LIVE PREVIEW: TEXT & IMAGE MODE
                </span>
                <h4 className="font-serif text-lg sm:text-3xl font-normal leading-tight">
                  Where Vision <span className="block">Meets the Future of <span className="text-[#C9A24A] italic">Real Estate</span></span>
                </h4>
                <p className="text-[11px] sm:text-xs text-white/80 mt-2 line-clamp-2 font-light">
                  {formData.heroDescription || 'Discover thoughtfully planned properties in promising locations.'}
                </p>
              </div>

              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                1920 × 1080 px (16:9)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1 text-xs">
              <div className="sm:col-span-7">
                <label className="block text-[#00291E] font-semibold mb-1">
                  Hero Photo URL or Base64 Data
                </label>
                <input
                  type="text"
                  value={formData.heroBackgroundImage || ''}
                  onChange={(e) => setFormData({ ...formData, heroBackgroundImage: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
                />
              </div>

              <div className="sm:col-span-5 bg-[#F8F0D8] p-3 rounded-lg border border-[#C9A24A]/25">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#00291E] font-semibold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>Text Contrast / Dark Overlay</span>
                  </label>
                  <span className="font-mono text-xs font-bold text-[#00291E]">
                    {formData.heroOverlayDarkness || 75}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="95"
                  step="5"
                  value={formData.heroOverlayDarkness || 75}
                  onChange={(e) => setFormData({ ...formData, heroOverlayDarkness: parseInt(e.target.value, 10) })}
                  className="w-full accent-[#00291E] cursor-pointer"
                />
                <span className="text-[10px] text-[#26342D]/60 block mt-0.5">
                  Adjust darkness so white headline text stays readable over lighter photos.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-SECTION B: SINGLE HERO BANNER (IMAGE ONLY)
            ======================================================== */}
        {formData.heroMode === 'single-image' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#00291E] block">
                  Single Hero Banner Image
                </span>
                <span className="text-[11px] text-[#26342D]/70 font-light">
                  Displays full-width on the homepage without text overlay.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
                  {compressingTarget === 'heroSingleImage' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload Banner</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={compressingTarget === 'heroSingleImage'}
                    onChange={(e) => handleOptimizedUpload(e, 'heroSingleImage', 1920, 1080)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setPresetTargetField('heroSingleImage')}
                  className="text-xs bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Presets</span>
                </button>
              </div>
            </div>

            {/* Single Banner Live Preview */}
            <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[16/7] bg-[#00291E] border border-[#C9A24A]/40 shadow-inner">
              <img
                src={formData.heroSingleImage || ASSETS.heroEntrance}
                alt={formData.heroSingleImageAlt || 'Hero Banner'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00291E]/60 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute top-3 left-3 bg-[#00291E]/90 text-[#C9A24A] border border-[#C9A24A]/40 text-[10px] font-bold px-2.5 py-1 rounded shadow">
                SINGLE BANNER (IMAGE ONLY)
              </div>

              {formData.heroSingleImageLink && (
                <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Links to: {formData.heroSingleImageLink}</span>
                </div>
              )}

              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                1920 × 1080 px (16:9)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Banner Image URL / Data
                </label>
                <input
                  type="text"
                  value={formData.heroSingleImage || ''}
                  onChange={(e) => setFormData({ ...formData, heroSingleImage: e.target.value })}
                  placeholder="https://... or upload photo"
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Click Destination (Optional Link)
                </label>
                <select
                  value={formData.heroSingleImageLink || ''}
                  onChange={(e) => setFormData({ ...formData, heroSingleImageLink: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] outline-none"
                >
                  <option value="">No Link (Display Only)</option>
                  <option value="/projects/amrutvan">Amrutvan Project Page (/projects/amrutvan)</option>
                  <option value="/projects/green-opulence">Green Opulence Project Page (/projects/green-opulence)</option>
                  <option value="/projects">All Projects Listing (/projects)</option>
                  <option value="/contact">Contact Page (/contact)</option>
                  <option value="/about">About Us (/about)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SUB-SECTION C: SLIDESHOW BANNER (MULTI-IMAGE CAROUSEL)
            ======================================================== */}
        {formData.heroMode === 'slideshow-image' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F0D8] p-4 rounded-xl border border-[#C9A24A]/30">
              <div>
                <span className="text-xs font-semibold text-[#00291E] block">
                  Slideshow Rotation Timer & Controls
                </span>
                <span className="text-[11px] text-[#26342D]/70 font-light">
                  Banners auto-advance smoothly with left/right arrows and dot indicators.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A24A]" />
                  <span className="text-xs font-medium text-[#00291E]">Interval:</span>
                  <select
                    value={formData.heroSlideshowInterval || 5}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        heroSlideshowInterval: Number(e.target.value) || 5,
                      })
                    }
                    className="bg-white border border-[#C9A24A]/40 rounded px-2.5 py-1 text-xs text-[#00291E] outline-none"
                  >
                    <option value={3}>3 seconds (Fast)</option>
                    <option value={4}>4 seconds</option>
                    <option value={5}>5 seconds (Recommended)</option>
                    <option value={7}>7 seconds</option>
                    <option value={10}>10 seconds</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs px-3.5 py-1.5 rounded shadow flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>
            </div>

            {/* Slideshow Live Preview Simulator */}
            {formData.heroSlides && formData.heroSlides.length > 0 && (
              <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[16/7] bg-[#00291E] border border-[#C9A24A]/40 shadow-inner group">
                {(() => {
                  const activeIndex = adminPreviewSlide % formData.heroSlides.length;
                  const slide = formData.heroSlides[activeIndex];
                  return (
                    <>
                      <img
                        src={slide.image}
                        alt={slide.caption || 'Slide Preview'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00291E]/80 via-transparent to-black/20 pointer-events-none" />

                      <div className="absolute top-3 left-3 bg-[#00291E]/90 text-[#C9A24A] border border-[#C9A24A]/40 text-[10px] font-bold px-2.5 py-1 rounded shadow">
                        SLIDESHOW PREVIEW: SLIDE #{activeIndex + 1} OF {formData.heroSlides.length}
                      </div>

                      {slide.caption && (
                        <div className="absolute bottom-5 left-6 bg-[#00291E]/90 border border-[#C9A24A]/30 text-white font-serif text-xs sm:text-sm px-3.5 py-1.5 rounded-lg shadow-lg">
                          {slide.caption}
                        </div>
                      )}

                      {/* Left / Right preview controls */}
                      <button
                        type="button"
                        onClick={() =>
                          setAdminPreviewSlide((prev) =>
                            prev === 0 ? formData.heroSlides!.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20"
                      >
                        <ChevronLeft className="w-4 h-4 text-[#C9A24A]" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAdminPreviewSlide((prev) => (prev + 1) % formData.heroSlides!.length)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20"
                      >
                        <ChevronRight className="w-4 h-4 text-[#C9A24A]" />
                      </button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-white/10">
                        {formData.heroSlides.map((_, dotI) => (
                          <span
                            key={dotI}
                            className={`rounded-full transition-all ${
                              dotI === activeIndex ? 'w-5 h-1.5 bg-[#C9A24A]' : 'w-1.5 h-1.5 bg-white/50'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                        1920 × 1080 px (16:9)
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Individual Slides Editor List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#00291E] uppercase tracking-wider block">
                Manage Slides ({formData.heroSlides?.length || 0})
              </span>

              {(formData.heroSlides || []).map((slide, sIdx) => (
                <div
                  key={slide.id || sIdx}
                  className="bg-[#F8F0D8] p-4 rounded-xl border border-[#C9A24A]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3.5 w-full md:w-auto">
                    {/* Slide Thumbnail */}
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-black border border-[#C9A24A]/40 shrink-0">
                      <img
                        src={slide.image}
                        alt={`Slide ${sIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/80 text-[#C9A24A] text-[9px] font-mono px-1 rounded">
                        #{sIdx + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                      <div>
                        <input
                          type="text"
                          value={slide.caption || ''}
                          onChange={(e) => {
                            const updated = [...(formData.heroSlides || [])];
                            updated[sIdx] = { ...updated[sIdx], caption: e.target.value };
                            setFormData({ ...formData, heroSlides: updated });
                          }}
                          placeholder="Optional slide caption / subtitle..."
                          className="w-full bg-white border border-[#C9A24A]/30 rounded px-2.5 py-1 text-xs text-[#00291E] outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={slide.linkUrl || ''}
                          onChange={(e) => {
                            const updated = [...(formData.heroSlides || [])];
                            updated[sIdx] = { ...updated[sIdx], linkUrl: e.target.value };
                            setFormData({ ...formData, heroSlides: updated });
                          }}
                          className="w-full bg-white border border-[#C9A24A]/30 rounded px-2 py-1 text-[11px] text-[#00291E] outline-none"
                        >
                          <option value="">No Click Link</option>
                          <option value="/projects/amrutvan">Amrutvan (/projects/amrutvan)</option>
                          <option value="/projects/green-opulence">Green Opulence (/projects/green-opulence)</option>
                          <option value="/projects">All Projects (/projects)</option>
                          <option value="/contact">Contact Page (/contact)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] font-mono font-semibold text-[#00291E] bg-[#C9A24A]/25 px-2 py-0.5 rounded border border-[#C9A24A]/30">
                          1920 × 1080 px (16:9)
                        </span>
                        <span className="text-[10px] text-[#26342D]/60 font-light">
                          Max 2.5 MB • JPG/PNG/WebP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for slide */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <label className="cursor-pointer text-[11px] bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-2.5 py-1.5 rounded shadow flex items-center gap-1 transition-all">
                      {compressingTarget === `slide-${sIdx}` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={compressingTarget === `slide-${sIdx}`}
                        onChange={(e) => handleSlideImageUpload(e, sIdx)}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setPresetTargetSlideIndex(sIdx)}
                      className="text-[11px] bg-white border border-[#C9A24A]/40 text-[#00291E] px-2.5 py-1.5 rounded hover:bg-[#FFF8E7] flex items-center gap-1 font-semibold"
                    >
                      <Sparkles className="w-3 h-3 text-[#C9A24A]" />
                      <span>Preset</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveSlide(sIdx, 'up')}
                      disabled={sIdx === 0}
                      className="p-1.5 bg-white border border-gray-300 rounded text-gray-700 disabled:opacity-30 hover:bg-gray-100"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveSlide(sIdx, 'down')}
                      disabled={sIdx === (formData.heroSlides?.length || 0) - 1}
                      className="p-1.5 bg-white border border-gray-300 rounded text-gray-700 disabled:opacity-30 hover:bg-gray-100"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(sIdx)}
                      className="p-1.5 bg-red-100 border border-red-200 text-red-600 rounded hover:bg-red-200"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PHOTO SECTION 2: OUR PROJECTS CARDS (AMRUTVAN & GREEN OPULENCE) */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border-2 border-[#C9A24A]/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
              SECTION 2 ON HOMEPAGE
            </span>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <span>2. Project Showcase Cards (Amrutvan & Green Opulence)</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              Upload photos from your computer or pick from the asset library for Green Opulence and Amrutvan cards on the homepage.
            </p>
          </div>
        </div>

        {/* Dimension Specification Badge */}
        <ImageDimensionBadge
          variant="banner"
          context="Project Showcase Cards"
          dimensions="1200 × 800 px"
          aspectRatio="3:2 (Landscape)"
          maxSize="1.2 MB"
          formats="JPG, PNG, WebP"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#F8F0D8] p-4 rounded-xl border border-[#C9A24A]/30 space-y-3 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-base text-[#00291E] font-medium">{proj.name}</h4>
                    {proj.slug === 'green-opulence' && (
                      <span className="text-[10px] bg-[#00291E] text-[#C9A24A] font-bold px-2 py-0.5 rounded">
                        Green Opulence
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#0B4A36] font-medium">{proj.status}</span>
                </div>

                <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black border border-[#C9A24A]/30">
                  <img
                    src={proj.thumbnail || proj.heroImage}
                    alt={proj.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#00291E]/90 text-[#C9A24A] text-[10px] font-bold px-2 py-0.5 rounded">
                    Homepage Card Cover
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#C9A24A]/20 flex flex-wrap items-center gap-2">
                <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
                  {compressingTarget === `project-${proj.id}` ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload {proj.slug === 'green-opulence' ? 'Green Opulence' : proj.name} Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={compressingTarget === `project-${proj.id}`}
                    onChange={(e) => handleProjectThumbnailUpload(e, proj.id)}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setPresetTargetProjectId(proj.id)}
                  className="text-xs bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Choose Preset</span>
                </button>

                <a
                  href={`/projects/${proj.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#00291E] hover:text-[#C9A24A] underline font-medium ml-auto"
                >
                  View Live Page →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO SECTION 3: ABOUT VELORA SECTION */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
              SECTION 3 ON HOMEPAGE
            </span>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <span>3. About Velora Section Lifestyle Photo</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              The featured image in the "About Velora" section showcasing the serene mountain lifestyle and land ownership vision.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
              {compressingTarget === 'aboutImage' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Upload Photo from Computer</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={compressingTarget === 'aboutImage'}
                onChange={(e) => handleOptimizedUpload(e, 'aboutImage', 1400, 900)}
              />
            </label>

            <button
              type="button"
              onClick={() => setPresetTargetField('aboutImage')}
              className="text-xs bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Pick Preset</span>
            </button>
          </div>
        </div>

        {/* Dimension Specification Badge */}
        <ImageDimensionBadge
          variant="banner"
          context="About Section Photo"
          dimensions="1200 × 900 px"
          aspectRatio="4:3 or 16:10 (Landscape)"
          maxSize="1.5 MB"
          formats="JPG, PNG, WebP"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#00291E] border border-[#C9A24A]/40 shadow-md">
            <img
              src={formData.aboutImage}
              alt="About Section Live Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
              Current Live Image
            </div>
          </div>

          <div className="md:col-span-7 space-y-3 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Image Link / Data
              </label>
              <input
                type="text"
                value={formData.aboutImage || ''}
                onChange={(e) => setFormData({ ...formData, aboutImage: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Photo Caption / Alt Description (SEO)
              </label>
              <input
                type="text"
                value={formData.aboutImageCaption || ''}
                onChange={(e) => setFormData({ ...formData, aboutImageCaption: e.target.value })}
                placeholder="e.g. Family looking over sunset hills at Velora Estates"
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] outline-none"
              />
            </div>

            <div className="p-3 bg-[#F8F0D8] rounded-lg border border-[#C9A24A]/20 text-[11px] text-[#26342D]/70">
              💡 <strong>Tip:</strong> Photos showing families, scenic Konkan valley sunsets, or lush green estates perform best here as they create an emotional connection with buyers looking for weekend retreat villas.
            </div>
          </div>
        </div>
      </div>

      {/* PHOTO SECTION 3: FEATURED PROJECT (AMRUTVAN) SECTION */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
              SECTION 5 ON HOMEPAGE
            </span>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <span>4. Featured Project (Amrutvan) Background Photo</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              The full-bleed atmosphere backdrop image behind the marquee Amrutvan section with specs & connectivity icons.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
              {compressingTarget === 'featuredProjectImage' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Upload Photo from Computer</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={compressingTarget === 'featuredProjectImage'}
                onChange={(e) => handleOptimizedUpload(e, 'featuredProjectImage', 1920, 1080)}
              />
            </label>

            <button
              type="button"
              onClick={() => setPresetTargetField('featuredProjectImage')}
              className="text-xs bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Pick Preset</span>
            </button>
          </div>
        </div>

        {/* Dimension Specification Badge */}
        <ImageDimensionBadge
          variant="banner"
          context="Featured Project Backdrop"
          dimensions="1920 × 1080 px"
          aspectRatio="16:9 (Widescreen Full-Bleed)"
          maxSize="2.5 MB"
          formats="JPG, PNG, WebP"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#00291E] border border-[#C9A24A]/40 shadow-md">
            <img
              src={formData.featuredProjectImage}
              alt="Featured Project Backdrop Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00291E]/90 via-[#00291E]/70 to-[#00291E]/50" />
            <div className="absolute bottom-3 left-3 text-white text-xs font-serif">
              Amrutvan Marquee Background
            </div>
          </div>

          <div className="md:col-span-7 space-y-3 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Featured Background Image Link
              </label>
              <input
                type="text"
                value={formData.featuredProjectImage || ''}
                onChange={(e) => setFormData({ ...formData, featuredProjectImage: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
              />
            </div>

            <p className="text-[11px] text-[#26342D]/70 font-light">
              By default, this shows the Amrutvan grand entrance or panoramic estate views with a subtle dark emerald overlay, allowing the plot specifications to stand out crisply.
            </p>
          </div>
        </div>
      </div>

      {/* PHOTO SECTION 5: STRATEGIC LOCATION & HIGHWAY CONNECTIVITY */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border-2 border-[#C9A24A]/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
              SECTION 6 ON HOMEPAGE
            </span>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <span>5. Strategic Location Highway & Connectivity Photo</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              The prominent scenic mountain highway photo showing road connectivity to Mandangad and Ratnagiri next to the travel distance milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
              {compressingTarget === 'locationImage' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Upload Location Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={compressingTarget === 'locationImage'}
                onChange={(e) => handleOptimizedUpload(e, 'locationImage', 1600, 1000)}
              />
            </label>

            <button
              type="button"
              onClick={() => setPresetTargetField('locationImage')}
              className="text-xs bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Pick Preset</span>
            </button>
          </div>
        </div>

        {/* Dimension Specification Badge */}
        <ImageDimensionBadge
          variant="banner"
          context="Highway & Connectivity Photo"
          dimensions="1600 × 1000 px"
          aspectRatio="16:10 (Scenic Landscape)"
          maxSize="1.5 MB"
          formats="JPG, PNG, WebP"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#00291E] border border-[#C9A24A]/40 shadow-md group">
            <img
              src={formData.locationImage || ASSETS.scenicRoad}
              alt="Strategic Location Live Preview"
              className="w-full h-full object-cover"
            />
            {/* Live badge simulation */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00291E]/95 border border-[#C9A24A]/40 p-2.5 rounded-lg text-white max-w-[180px] shadow-xl pointer-events-none">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#C9A24A] block">Highways</span>
              <span className="text-[10px] text-white/90 font-medium block">Mumbai-Goa Highway (NH-66)</span>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
              Current Live Highway Photo
            </div>
          </div>

          <div className="md:col-span-7 space-y-3 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Location Image Link / Base64 Data
              </label>
              <input
                type="text"
                value={formData.locationImage || ''}
                onChange={(e) => setFormData({ ...formData, locationImage: e.target.value })}
                placeholder="Image URL or upload from your computer"
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
              />
            </div>

            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Image Alt Tag (SEO & Accessibility)
              </label>
              <input
                type="text"
                value={formData.locationImageAlt || ''}
                onChange={(e) => setFormData({ ...formData, locationImageAlt: e.target.value })}
                placeholder="e.g. Scenic winding mountain highway during sunset with white car driving to Mandangad Ratnagiri"
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] outline-none"
              />
            </div>

            <p className="text-[11px] text-[#26342D]/70 font-light">
              This photo displays prominently on the homepage right next to the Mandangad, Pune, and Mumbai travel distance milestones.
            </p>
          </div>
        </div>
      </div>

      {/* PHOTO SECTION 6: HOMEPAGE GALLERY SHOWCASE STRIP */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
              SECTION 7 ON HOMEPAGE
            </span>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <span>6. Homepage Gallery Showcase Photos</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              These photos are featured in the interactive strip on the homepage with category tabs (Project, Location, Lifestyle). Click "Change Photo" on any item below to replace it.
            </p>
          </div>

          <a
            href="/admin"
            onClick={(e) => {
              // Can navigate directly to gallery view
            }}
            className="text-xs text-[#00291E] hover:text-[#C9A24A] underline font-medium self-start sm:self-auto"
          >
            Manage All Gallery Items →
          </a>
        </div>

        {/* Dimension Specification Badge */}
        <ImageDimensionBadge
          variant="banner"
          context="Gallery Showcase Photos"
          dimensions="1200 × 800 px"
          aspectRatio="3:2 or 4:3 (Landscape)"
          maxSize="1.0 MB"
          formats="JPG, PNG, WebP"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {gallery.slice(0, 5).map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#F8F0D8] rounded-lg overflow-hidden border border-[#C9A24A]/30 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] bg-[#00291E]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-[#00291E]/90 text-[#C9A24A] text-[9px] font-bold uppercase px-1.5 py-0.5 rounded capitalize">
                    {item.category}
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                </div>

                <div className="p-2.5">
                  <span className="font-serif text-xs text-[#00291E] font-medium block truncate">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#26342D]/60 block truncate">
                    {item.project || 'Velora Project'}
                  </span>
                </div>
              </div>

              <div className="p-2 border-t border-[#C9A24A]/20 flex items-center gap-1.5">
                <label className="cursor-pointer text-[10px] flex-1 bg-white hover:bg-white/80 text-[#00291E] border border-[#C9A24A]/30 font-semibold py-1 rounded text-center transition-colors">
                  {compressingTarget === `gallery-${item.id}` ? (
                    <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                  ) : (
                    <span>Upload</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={compressingTarget === `gallery-${item.id}`}
                    onChange={(e) => handleGalleryPhotoUpload(e, item.id)}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setPresetTargetGalleryId(item.id)}
                  className="text-[10px] px-2 py-1 bg-[#C9A24A]/20 hover:bg-[#C9A24A]/30 text-[#00291E] rounded font-medium border border-[#C9A24A]/40"
                  title="Pick preset image"
                >
                  Preset
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHOTO SECTION 5: INQUIRY / LEAD FORM BACKDROP */}
      <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
              SECTION 9 (FOOTER INQUIRY)
            </span>
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <span>7. Lead Inquiry Form Backdrop Photo</span>
            </h3>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              The optional subtle background photo behind the "Let's Find the Right Property for You" section.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
              {compressingTarget === 'leadFormBackgroundImage' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Upload Photo from Computer</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={compressingTarget === 'leadFormBackgroundImage'}
                onChange={(e) => handleOptimizedUpload(e, 'leadFormBackgroundImage', 1920, 1080)}
              />
            </label>

            <button
              type="button"
              onClick={() => setPresetTargetField('leadFormBackgroundImage')}
              className="text-xs bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Pick Preset</span>
            </button>
          </div>
        </div>

        {/* Dimension Specification Badge */}
        <ImageDimensionBadge
          variant="banner"
          context="Inquiry Form Backdrop"
          dimensions="1920 × 1080 px"
          aspectRatio="16:9 (Widescreen Landscape)"
          maxSize="2.0 MB"
          formats="JPG, PNG, WebP"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#00291E] border border-[#C9A24A]/40 shadow-md">
            <img
              src={formData.leadFormBackgroundImage}
              alt="Lead Backdrop Preview"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-[#00291E]/70" />
            <div className="absolute bottom-3 left-3 text-white text-xs font-serif">
              Lead Section Ambient Visual
            </div>
          </div>

          <div className="md:col-span-7 space-y-3 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Image Link
              </label>
              <input
                type="text"
                value={formData.leadFormBackgroundImage || ''}
                onChange={(e) => setFormData({ ...formData, leadFormBackgroundImage: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
              />
            </div>

            <p className="text-[11px] text-[#26342D]/70 font-light">
              Renders with high transparency and an emerald blur to add depth to the bottom contact form without distracting from the input fields.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM FIXED SAVE BAR */}
      <div className="sticky bottom-4 z-20 bg-[#00291E] text-white p-4 rounded-xl shadow-2xl border border-[#C9A24A]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-[#C9A24A]" />
          <div>
            <span className="text-xs font-semibold block text-white">Save Home Page Photos</span>
            <span className="text-[11px] text-white/70">Updates take effect across the live website immediately.</span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium transition-colors"
          >
            Preview Live Website
          </a>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.98] text-[#00291E] font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded shadow-lg flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Publish All Home Page Photos</span>
          </button>
        </div>
      </div>

      {/* PRESET PHOTOGRAPHY PICKER MODAL */}
      {(presetTargetField || presetTargetGalleryId || presetTargetProjectId) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#001D15] text-white rounded-2xl max-w-4xl w-full border-2 border-[#C9A24A]/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#00241A]">
              <div>
                <h3 className="font-serif text-lg text-[#F8F0D8] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A24A]" />
                  <span>Velora Estate Photography Presets</span>
                </h3>
                <p className="text-xs text-white/60">
                  Select any high-resolution photo below to instantly assign it to{' '}
                  <strong className="text-[#C9A24A]">
                    {presetTargetSlideIndex !== null
                      ? `Hero Slideshow Slide #${presetTargetSlideIndex + 1}`
                      : presetTargetField === 'heroSingleImage'
                      ? 'Single Hero Banner'
                      : presetTargetProjectId
                      ? projects.find((p) => p.id === presetTargetProjectId || p.slug === presetTargetProjectId)?.name || 'Project Card'
                      : presetTargetField === 'heroBackgroundImage'
                      ? 'Hero Banner'
                      : presetTargetField === 'aboutImage'
                      ? 'About Section'
                      : presetTargetField === 'featuredProjectImage'
                      ? 'Featured Project'
                      : presetTargetField === 'locationImage'
                      ? 'Strategic Location & Highway Section'
                      : presetTargetField === 'leadFormBackgroundImage'
                      ? 'Inquiry Section'
                      : 'Gallery Showcase'}
                  </strong>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPresetTargetField(null);
                  setPresetTargetGalleryId(null);
                  setPresetTargetProjectId(null);
                  setPresetTargetSlideIndex(null);
                }}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {HOMEPAGE_PRESET_LIBRARY.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.url)}
                  className="bg-[#00291E] rounded-xl overflow-hidden border border-white/10 hover:border-[#C9A24A] cursor-pointer group transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] bg-black">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:brightness-105 transition-all"
                    />
                    <div className="absolute top-2 left-2 bg-[#00291E]/90 text-[#C9A24A] text-[9px] font-bold px-2 py-0.5 rounded">
                      {preset.category}
                    </div>
                  </div>

                  <div className="p-3">
                    <h5 className="font-serif text-xs text-white font-medium group-hover:text-[#C9A24A] transition-colors leading-snug">
                      {preset.name}
                    </h5>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-white/60">
                      <span>Best for: {preset.recommendedFor}</span>
                      <span className="text-[#C9A24A] font-semibold group-hover:translate-x-0.5 transition-transform">
                        Select →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#00241A] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setPresetTargetField(null);
                  setPresetTargetGalleryId(null);
                  setPresetTargetProjectId(null);
                }}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
