import React, { useState } from 'react';
import {
  Sparkles,
  Save,
  CheckCircle2,
  Upload,
  Loader2,
  Eye,
  Smartphone,
  Monitor,
  ExternalLink,
  Plus,
  Trash2,
  Tag,
  Gift,
  ArrowRight,
  Image as ImageIcon,
  FileText,
  Layers,
  Clock,
  Repeat,
  Check,
  X,
  Maximize2,
  Ruler,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import {
  PromotionalPopupSettings,
  PopupLayoutType,
  PopupActionType,
} from '../../types';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { ASSETS } from '../../data/initialData';
import { PromotionalModal } from '../../components/common/PromotionalModal';
import { ImageDimensionBadge } from '../../components/common/ImageDimensionBadge';

const PRESET_PHOTOS = [
  { id: 'gate', name: 'Grand Entrance Gate', url: ASSETS.heroEntrance },
  { id: 'estate', name: 'Lush Green Plotted Estate', url: ASSETS.aerialGreenEstate },
  { id: 'sunset', name: 'Scenic Mountain Sunset', url: ASSETS.familySunset },
  { id: 'highway', name: 'Mountain Highway Connectivity', url: ASSETS.scenicRoad },
  { id: 'clubhouse', name: 'Luxury 2-Story Clubhouse', url: ASSETS.clubhouse },
  { id: 'garden', name: 'Manicured Gazebo Garden', url: ASSETS.gazeboGarden },
  { id: 'villa', name: 'Green Opulence Luxury Villa', url: ASSETS.greenOpulenceVilla },
];

export const AdminPopupView: React.FC = () => {
  const { popupSettings, projects } = useStore();
  const [formData, setFormData] = useState<PromotionalPopupSettings>({
    ...popupSettings,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [interactiveModalOpen, setInteractiveModalOpen] = useState(false);
  const [presetModalOpen, setPresetModalOpen] = useState(false);
  const [newHighlightText, setNewHighlightText] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    StoreService.savePopupSettings(formData);
    showToast('✓ Promotional popup settings published live to website!');
  };

  const handleToggleEnabled = () => {
    const updated = { ...formData, enabled: !formData.enabled };
    setFormData(updated);
    StoreService.savePopupSettings(updated);
    showToast(
      updated.enabled
        ? '✓ Promotional popup enabled! Visitors will see it on the website.'
        : 'Promotional popup disabled. Hidden from website visitors.'
    );
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const optimized = await optimizeImageFile(file, 1600, 1000, 0.78);
      const updated = { ...formData, image: optimized };
      setFormData(updated);
      StoreService.savePopupSettings(updated);
      showToast('✓ Promotional flyer/photo uploaded and saved!');
    } catch {
      showToast('Could not process image file. Please try another.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) return;
    const current = formData.highlightPoints || [];
    setFormData({
      ...formData,
      highlightPoints: [...current, newHighlightText.trim()],
    });
    setNewHighlightText('');
  };

  const handleRemoveHighlight = (idx: number) => {
    const current = [...(formData.highlightPoints || [])];
    current.splice(idx, 1);
    setFormData({ ...formData, highlightPoints: current });
  };

  const handleApplyPreset = (url: string) => {
    setFormData({ ...formData, image: url });
    setPresetModalOpen(false);
    showToast('Applied curated estate photo preset.');
  };

  const linkedProject = formData.linkedProjectId
    ? projects.find(
        (p) => p.id === formData.linkedProjectId || p.slug === formData.linkedProjectId
      )
    : undefined;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#00291E] border-2 border-[#C9A24A] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#C9A24A] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Master Enable Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFF8E7] p-6 rounded-2xl border-2 border-[#C9A24A]/40 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00291E] bg-[#C9A24A] px-2.5 py-0.5 rounded-full">
              Visitor Conversion Tool
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                formData.enabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {formData.enabled ? 'ACTIVE ON WEBSITE' : 'DISABLED / INACTIVE'}
            </span>
          </div>
          <h2 className="font-serif text-2xl text-[#00291E] font-medium">
            Promotional & Announcement Popup Manager
          </h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Configure the welcome popup for discounts, festive privileges, and new project launches with text, image, or combined flyer layouts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Enable / Disable Switch */}
          <button
            type="button"
            onClick={handleToggleEnabled}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
              formData.enabled
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-zinc-300 hover:bg-zinc-400 text-zinc-800'
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                formData.enabled ? 'bg-white animate-pulse' : 'bg-zinc-500'
              }`}
            />
            <span>{formData.enabled ? 'Popup Enabled (Showing)' : 'Popup Disabled (Hidden)'}</span>
          </button>

          {/* Interactive Test Preview Button */}
          <button
            type="button"
            onClick={() => setInteractiveModalOpen(true)}
            className="bg-[#00291E] hover:bg-[#0B4A36] text-[#C9A24A] border border-[#C9A24A]/40 font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Test Visitor Popup</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={() => handleSave()}
            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left (7 Cols), Live Preview Right (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. LAYOUT SELECTOR */}
          <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                STEP 1: FORMAT & DISPLAY TYPE
              </span>
              <h3 className="font-serif text-lg text-[#00291E] font-medium">
                Popup Layout Mode
              </h3>
              <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
                Choose whether your announcement features both text & image, only text, or a graphic promotional flyer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option A: Text & Image */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, layout: 'text-and-image' })}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  formData.layout === 'text-and-image'
                    ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                    : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center text-[#C9A24A]">
                    <Layers className="w-4 h-4" />
                  </div>
                  {formData.layout === 'text-and-image' && (
                    <Check className="w-4 h-4 text-[#C9A24A]" />
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold">Text & Image</h4>
                  <p className={`text-[10px] mt-0.5 ${formData.layout === 'text-and-image' ? 'text-white/70' : 'text-[#26342D]/70'}`}>
                    Banner photo on top with headline, offer highlights, discount code, and CTA.
                  </p>
                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                    formData.layout === 'text-and-image' ? 'border-white/15 text-[#C9A24A]' : 'border-[#C9A24A]/20 text-[#00291E]'
                  }`}>
                    <span className="font-mono font-semibold">1200 × 600 px</span>
                    <span className="opacity-75">16:8 • Max 2 MB</span>
                  </div>
                </div>
              </button>

              {/* Option B: Only Text */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, layout: 'only-text' })}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  formData.layout === 'only-text'
                    ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                    : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center text-[#C9A24A]">
                    <FileText className="w-4 h-4" />
                  </div>
                  {formData.layout === 'only-text' && (
                    <Check className="w-4 h-4 text-[#C9A24A]" />
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold">Only Text</h4>
                  <p className={`text-[10px] mt-0.5 ${formData.layout === 'only-text' ? 'text-white/70' : 'text-[#26342D]/70'}`}>
                    Luxury royal card with gold borders, badge, bold headline, and bullet points.
                  </p>
                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                    formData.layout === 'only-text' ? 'border-white/15 text-[#C9A24A]' : 'border-[#C9A24A]/20 text-[#00291E]'
                  }`}>
                    <span className="font-mono font-semibold">No Photo</span>
                    <span className="opacity-75">Typography Only</span>
                  </div>
                </div>
              </button>

              {/* Option C: Only Image */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, layout: 'only-image' })}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  formData.layout === 'only-image'
                    ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                    : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A24A]/20 flex items-center justify-center text-[#C9A24A]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  {formData.layout === 'only-image' && (
                    <Check className="w-4 h-4 text-[#C9A24A]" />
                  )}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold">Only Image (Flyer)</h4>
                  <p className={`text-[10px] mt-0.5 ${formData.layout === 'only-image' ? 'text-white/70' : 'text-[#26342D]/70'}`}>
                    Full graphic promotional flyer / poster graphic with quick close and click-to-open.
                  </p>
                  <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] ${
                    formData.layout === 'only-image' ? 'border-white/15 text-[#C9A24A]' : 'border-[#C9A24A]/20 text-[#00291E]'
                  }`}>
                    <span className="font-mono font-semibold">1080 × 1350 px</span>
                    <span className="opacity-75">4:5 Poster / 1:1 Square</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. PROJECT LINKING & ACTION */}
          <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                STEP 2: PROJECT LINKING & CTA
              </span>
              <h3 className="font-serif text-lg text-[#00291E] font-medium">
                Link to Project & Customer Action
              </h3>
              <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
                Connect this promotion directly to one of your real estate developments so interested buyers can inspect it immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Linked Project Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#00291E] mb-1.5">
                  Link with Project
                </label>
                <select
                  value={formData.linkedProjectId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      linkedProjectId: e.target.value || undefined,
                    })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded-lg px-3 py-2 text-xs text-[#00291E] font-medium outline-none focus:border-[#00291E]"
                >
                  <option value="">None (General Brand Promotion)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.slug || p.id}>
                      {p.name} ({p.location})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#26342D]/60 mt-1">
                  Selecting a project displays a project badge and directs clicks to that project.
                </p>
              </div>

              {/* Primary Action Type */}
              <div>
                <label className="block text-xs font-semibold text-[#00291E] mb-1.5">
                  Primary Button Click Action
                </label>
                <select
                  value={formData.primaryCtaAction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryCtaAction: e.target.value as PopupActionType,
                    })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded-lg px-3 py-2 text-xs text-[#00291E] font-medium outline-none focus:border-[#00291E]"
                >
                  <option value="open-project">Open Linked Project Details Page</option>
                  <option value="open-site-visit">Open "Book a Site Visit" Modal</option>
                  <option value="open-whatsapp">Open Direct WhatsApp Chat with Offer Code</option>
                  <option value="custom-link">Open Custom Internal / External URL</option>
                </select>
              </div>
            </div>

            {/* Custom URL Input if selected */}
            {formData.primaryCtaAction === 'custom-link' && (
              <div>
                <label className="block text-xs font-semibold text-[#00291E] mb-1">
                  Custom Destination URL
                </label>
                <input
                  type="text"
                  value={formData.customCtaUrl || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, customCtaUrl: e.target.value })
                  }
                  placeholder="https://... or /projects"
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-xs text-[#00291E] outline-none"
                />
              </div>
            )}

            {/* Button Labels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#00291E] mb-1">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={formData.primaryCtaText}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryCtaText: e.target.value })
                  }
                  placeholder="e.g. Explore Amrutvan & Claim Offer →"
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-xs text-[#00291E] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#00291E] mb-1">
                  Secondary Action Label (Optional)
                </label>
                <input
                  type="text"
                  value={formData.secondaryCtaText || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, secondaryCtaText: e.target.value })
                  }
                  placeholder="e.g. Book a Free Site Visit"
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-xs text-[#00291E] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. MEDIA UPLOAD (FOR TEXT+IMAGE & ONLY IMAGE) */}
          {formData.layout !== 'only-text' && (
            <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C9A24A]/20 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                    STEP 3: PROMOTIONAL MEDIA
                  </span>
                  <h3 className="font-serif text-lg text-[#00291E] font-medium">
                    Popup Banner / Flyer Photo
                  </h3>
                  <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
                    Upload an eye-catching photo or banner flyer from your computer or pick from the curated Velora estate library.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-2 rounded shadow flex items-center gap-1.5 transition-all">
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading}
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setPresetModalOpen(true)}
                    className="text-xs bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold px-3 py-2 rounded shadow-sm hover:bg-[#F8F0D8] flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>Pick Preset</span>
                  </button>
                </div>
              </div>

              {/* RECOMMENDED SIZE & DIMENSION BANNER */}
              <ImageDimensionBadge
                variant="banner"
                context={formData.layout === 'only-image' ? 'Promotional Flyer Poster' : 'Popup Banner'}
                dimensions={formData.layout === 'only-image' ? '1080 × 1350 px (or 1200 × 1200 px)' : '1200 × 600 px'}
                aspectRatio={formData.layout === 'only-image' ? '4:5 Portrait / 1:1 Square' : '16:8 (2:1 Widescreen)'}
                maxSize={formData.layout === 'only-image' ? '2.5 MB' : '2.0 MB'}
                formats="JPG, PNG, WebP"
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className={`md:col-span-5 relative rounded-xl overflow-hidden bg-[#001D15] border border-[#C9A24A]/40 shadow-md ${
                  formData.layout === 'only-image' ? 'aspect-[4/5] max-h-80 mx-auto w-full' : 'aspect-[16/8]'
                }`}>
                  <img
                    src={formData.image || ASSETS.heroEntrance}
                    alt={formData.imageAlt || 'Popup Media Preview'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#00291E]/90 text-[#C9A24A] border border-[#C9A24A]/40 text-[10px] font-mono px-2 py-0.5 rounded font-bold shadow">
                    {formData.layout === 'only-image' ? '1080 × 1350 px (4:5)' : '1200 × 600 px (16:8)'}
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                    Current {formData.layout === 'only-image' ? 'Flyer Poster' : 'Banner Photo'}
                  </span>
                </div>

                <div className="md:col-span-7 space-y-3 text-xs">
                  <div>
                    <label className="block text-[#00291E] font-semibold mb-1">
                      Image URL / Base64 String
                    </label>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://... or upload photo from computer"
                      className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#00291E] font-semibold mb-1">
                      Image Alt Text (SEO)
                    </label>
                    <input
                      type="text"
                      value={formData.imageAlt || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, imageAlt: e.target.value })
                      }
                      placeholder="e.g. Amrutvan Phase 2 Festive Launch Privilege"
                      className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. HEADLINES & COPY (FOR TEXT+IMAGE & ONLY TEXT) */}
          {formData.layout !== 'only-image' && (
            <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                  STEP 4: PROMOTIONAL COPY & OFFER DETAILS
                </span>
                <h3 className="font-serif text-lg text-[#00291E] font-medium">
                  Headlines, Badge & Discount Highlights
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Top Badge / Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) =>
                      setFormData({ ...formData, badgeText: e.target.value })
                    }
                    placeholder="e.g. Festive Launch Privilege or Limited Period Offer"
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Main Headline (Title)
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) =>
                      setFormData({ ...formData, headline: e.target.value })
                    }
                    placeholder="e.g. Special ₹2,00,000 Early Bird Privilege"
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] font-semibold text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Subheadline
                  </label>
                  <input
                    type="text"
                    value={formData.subheadline || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, subheadline: e.target.value })
                    }
                    placeholder="e.g. Celebrate the new launch of Phase 2 at Amrutvan, Mandangad"
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Body Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bodyText || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, bodyText: e.target.value })
                    }
                    placeholder="Brief compelling description of the privilege, validity, or project specifications..."
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] outline-none"
                  />
                </div>

                {/* Highlight Points */}
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Offer Highlights / Bullet Points
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {(formData.highlightPoints || []).map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-[#F8F0D8] border border-[#C9A24A]/30 px-3 py-1.5 rounded-lg"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="flex-1 text-xs text-[#00291E]">{point}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlightText}
                      onChange={(e) => setNewHighlightText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      placeholder="Add bullet highlight (e.g. Zero Stamp Duty Registration)"
                      className="flex-1 bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-1.5 text-xs text-[#00291E] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-3 py-1.5 bg-[#00291E] hover:bg-[#0B4A36] text-[#C9A24A] font-semibold rounded text-xs flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Promo / Discount Code */}
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Discount / Promo Code (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#C9A24A]" />
                    <input
                      type="text"
                      value={formData.discountCode || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountCode: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g. FESTIVE2026 or EARLYBIRD"
                      className="flex-1 bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] font-mono text-xs uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. DISPLAY RULES & FREQUENCY */}
          <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                STEP 5: VISITOR TRIGGER RULES
              </span>
              <h3 className="font-serif text-lg text-[#00291E] font-medium">
                Popup Timing & Frequency
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Delay Before Appearing (Seconds)
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C9A24A]" />
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.delaySeconds}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        delaySeconds: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#26342D]/60 mt-1">
                  Recommended: 2 to 3 seconds after page loads.
                </p>
              </div>

              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Display Frequency
                </label>
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-[#C9A24A]" />
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded px-3 py-2 text-[#00291E] outline-none"
                  >
                    <option value="once-per-session">
                      Once per browser session (Recommended)
                    </option>
                    <option value="once-per-day">Once per day</option>
                    <option value="always">Every page visit (Testing)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Real-Time Preview */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-[#FFF8E7] rounded-xl p-5 border-2 border-[#C9A24A]/40 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#C9A24A]/20 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                  REAL-TIME PREVIEW
                </span>
                <h4 className="font-serif text-base text-[#00291E] font-medium">
                  How Customers See It
                </h4>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center bg-[#F8F0D8] border border-[#C9A24A]/30 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                    previewDevice === 'desktop'
                      ? 'bg-[#00291E] text-white shadow-sm'
                      : 'text-[#00291E] hover:text-[#C9A24A]'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                    previewDevice === 'mobile'
                      ? 'bg-[#00291E] text-white shadow-sm'
                      : 'text-[#00291E] hover:text-[#C9A24A]'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Simulated Modal Card Container */}
            <div
              className={`mx-auto bg-black/60 p-3 sm:p-4 rounded-xl border border-black/20 ${
                previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'
              }`}
            >
              <div className="bg-[#FFF8E7] rounded-xl overflow-hidden shadow-2xl border border-[#C9A24A]/50 text-[#00291E] text-xs">
                {/* 1. Only Image Preview */}
                {formData.layout === 'only-image' && (
                  <div className="relative group">
                    <img
                      src={formData.image || ASSETS.heroEntrance}
                      alt="Flyer Preview"
                      className="w-full aspect-[4/3] object-cover bg-[#001D15]"
                    />
                    <div className="p-3 bg-[#001D15] text-white flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#C9A24A] font-bold uppercase block">
                          {formData.badgeText || 'Special Offer'}
                        </span>
                        <span className="font-serif text-xs text-[#F8F0D8] font-medium truncate block max-w-[180px]">
                          {formData.headline || 'Promotional Flyer'}
                        </span>
                      </div>
                      <span className="bg-[#C9A24A] text-[#00291E] text-[10px] font-bold px-2 py-1 rounded">
                        {formData.primaryCtaText || 'Explore'}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Only Text Preview */}
                {formData.layout === 'only-text' && (
                  <div className="p-5 bg-[#00291E] text-white space-y-3 border-2 border-[#C9A24A]/40">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#00291E] bg-[#C9A24A] px-2 py-0.5 rounded-full">
                        {formData.badgeText || 'Announcement'}
                      </span>
                      {linkedProject && (
                        <span className="text-[9px] text-[#C9A24A] border border-[#C9A24A]/40 px-2 py-0.5 rounded-full">
                          {linkedProject.name}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-[#F8F0D8] font-normal leading-snug">
                        {formData.headline}
                      </h4>
                      {formData.subheadline && (
                        <p className="text-[10px] text-[#C9A24A] mt-0.5">
                          {formData.subheadline}
                        </p>
                      )}
                    </div>
                    {formData.discountCode && (
                      <div className="p-2 bg-[#001D15] rounded border border-[#C9A24A]/40 text-[10px] flex items-center justify-between">
                        <span className="text-white/70">Code:</span>
                        <span className="font-mono text-[#C9A24A] font-bold">
                          {formData.discountCode}
                        </span>
                      </div>
                    )}
                    <button className="w-full bg-[#C9A24A] text-[#00291E] font-bold text-[10px] uppercase py-2 rounded">
                      {formData.primaryCtaText || 'Claim Offer'}
                    </button>
                  </div>
                )}

                {/* 3. Text and Image Preview */}
                {formData.layout === 'text-and-image' && (
                  <div>
                    <div className="relative aspect-[16/8] overflow-hidden bg-[#001D15]">
                      <img
                        src={formData.image || ASSETS.heroEntrance}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="text-[9px] font-bold uppercase text-[#00291E] bg-[#C9A24A] px-2 py-0.5 rounded-full shadow">
                          {formData.badgeText}
                        </span>
                        {linkedProject && (
                          <span className="text-[9px] font-serif bg-[#00291E]/90 text-white px-2 py-0.5 rounded-full border border-[#C9A24A]/40">
                            {linkedProject.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#00291E] leading-snug">
                          {formData.headline}
                        </h4>
                        {formData.subheadline && (
                          <p className="text-[10px] text-[#0B4A36] font-medium mt-0.5">
                            {formData.subheadline}
                          </p>
                        )}
                      </div>

                      {formData.highlightPoints && formData.highlightPoints.length > 0 && (
                        <div className="space-y-1">
                          {formData.highlightPoints.slice(0, 3).map((p, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#00291E]">
                              <Check className="w-3 h-3 text-[#0B4A36] shrink-0" />
                              <span className="truncate">{p}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {formData.discountCode && (
                        <div className="p-2 bg-[#F8F0D8] rounded border border-[#C9A24A]/40 text-[10px] flex items-center justify-between">
                          <span className="text-[#26342D]/70 font-semibold">Promo:</span>
                          <span className="font-mono text-[#00291E] font-bold">
                            {formData.discountCode}
                          </span>
                        </div>
                      )}

                      <button className="w-full bg-[#C9A24A] text-[#00291E] font-bold text-[10px] uppercase py-2 rounded shadow">
                        {formData.primaryCtaText || 'Explore'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setInteractiveModalOpen(true)}
                className="text-xs text-[#00291E] hover:text-[#C9A24A] underline font-medium"
              >
                Click to open full interactive screen modal →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Photo Selection Modal */}
      {presetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#001D15] text-white rounded-2xl max-w-2xl w-full border-2 border-[#C9A24A]/50 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#00241A]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A24A]" />
                <h3 className="font-serif text-base text-[#F8F0D8]">
                  Select Velora Estate Photography
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPresetModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRESET_PHOTOS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.url)}
                  className="group cursor-pointer rounded-lg overflow-hidden border border-white/20 hover:border-[#C9A24A] transition-all bg-black/40"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2 text-center text-xs text-white/80 group-hover:text-[#C9A24A]">
                    {preset.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Testing Modal */}
      {interactiveModalOpen && (
        <PromotionalModal
          forcePreview={true}
          onClosePreview={() => setInteractiveModalOpen(false)}
        />
      )}
    </div>
  );
};
