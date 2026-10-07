import React, { useState } from 'react';
import { Save, CheckCircle2, Camera, ArrowRight, Sparkles, Upload, Image as ImageIcon, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { WebsiteContent } from '../../types';
import { AdminViewType } from '../AdminLayout';
import { Logo } from '../../components/common/Logo';

interface AdminContentViewProps {
  onNavigateView?: (view: AdminViewType) => void;
}

export const AdminContentView: React.FC<AdminContentViewProps> = ({ onNavigateView }) => {
  const { content } = useStore();
  const [formData, setFormData] = useState<WebsiteContent>({
    ...content,
    logoMode: content.logoMode || 'svg-brand',
    customLogoImage: content.customLogoImage || '',
    customLogoHeight: content.customLogoHeight || 44,
    customLogoAlt: content.customLogoAlt || 'Velora Developers Logo',
    showLogoTagline: content.showLogoTagline !== false,
  });
  const [saved, setSaved] = useState(false);
  const [publishError, setPublishError] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, SVG, JPG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Image file size should be less than 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        logoMode: 'custom-image',
        customLogoImage: base64,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetToDefaultLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoMode: 'svg-brand',
      customLogoImage: '',
      customLogoHeight: 44,
      showLogoTagline: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishError('');
    const published = await StoreService.saveWebsiteContent(formData);
    if (!published) {
      setPublishError('Saved on this browser only. The live site did not update, so other visitors still see the previous content.');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">Website Content CMS</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Dynamically update website logo, hero headlines, promotional copy, featured project highlights, and lead form text.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Published. Every visitor will see this content.</span>
          </div>
        )}
        {publishError && (
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-red-300">
            <span>{publishError}</span>
          </div>
        )}
      </div>

      {/* Quick link banner to Homepage Photos */}
      {onNavigateView && (
        <div className="bg-[#00291E] text-white p-4 sm:p-5 rounded-xl border border-[#C9A24A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 border border-[#C9A24A]/40 text-[#C9A24A] flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-base text-[#F8F0D8]">Need to update website photos & banners?</h4>
                <span className="text-[10px] bg-[#C9A24A] text-[#00291E] font-bold px-2 py-0.5 rounded">NEW</span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Upload your own photos, choose from high-res presets, or tune overlays in the dedicated Homepage Photos manager.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateView('home-photos')}
            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs tracking-wider uppercase px-4 py-2.5 rounded shadow flex items-center gap-2 transition-all self-start sm:self-auto shrink-0"
          >
            <span>Update Homepage Photos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 0: Brand Logo & Website Identity */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border-2 border-[#C9A24A]/40 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C9A24A]/20 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-[#00291E] font-medium">
                  Website Brand Logo & Identity
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00291E] text-[#C9A24A] px-2 py-0.5 rounded border border-[#C9A24A]/40">
                  Header & Footer
                </span>
              </div>
              <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
                Upload your own official company logo image or use Velora's default luxury vector insignia.
              </p>
            </div>

            {formData.customLogoImage && (
              <button
                type="button"
                onClick={handleResetToDefaultLogo}
                className="self-start sm:self-auto text-xs text-red-700 hover:text-red-900 flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Logo</span>
              </button>
            )}
          </div>

          {/* Logo Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                formData.logoMode === 'svg-brand'
                  ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/40'
                  : 'bg-[#F8F0D8] text-[#26342D] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              <input
                type="radio"
                name="logoMode"
                value="svg-brand"
                checked={formData.logoMode === 'svg-brand'}
                onChange={() => setFormData({ ...formData, logoMode: 'svg-brand' })}
                className="mt-0.5 accent-[#C9A24A]"
              />
              <div>
                <span className="font-semibold block">Velora Official Master Emblem (Vector SVG)</span>
                <span className="text-[11px] opacity-75 mt-0.5 block">
                  Official Golden V with architectural skyscraper towers, VELORA wordmark with golden triangle, and tagline.
                </span>
              </div>
            </label>

            <label
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                formData.logoMode === 'custom-image'
                  ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/40'
                  : 'bg-[#F8F0D8] text-[#26342D] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              <input
                type="radio"
                name="logoMode"
                value="custom-image"
                checked={formData.logoMode === 'custom-image'}
                onChange={() => setFormData({ ...formData, logoMode: 'custom-image' })}
                className="mt-0.5 accent-[#C9A24A]"
              />
              <div>
                <span className="font-semibold block">Custom Uploaded Logo Image</span>
                <span className="text-[11px] opacity-75 mt-0.5 block">
                  Upload your PNG, SVG, or WebP logo file to display across header and footer.
                </span>
              </div>
            </label>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] text-[#26342D]/70 font-medium">Quick Presets:</span>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  logoMode: 'svg-brand',
                  customLogoImage: '',
                  showLogoTagline: true,
                })
              }
              className={`px-3 py-1 rounded border text-[11px] font-semibold transition-colors ${
                formData.logoMode === 'svg-brand' && !formData.customLogoImage
                  ? 'bg-[#C9A24A] text-[#00291E] border-[#C9A24A]'
                  : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              ★ Official Vector Artwork
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  logoMode: 'custom-image',
                  customLogoImage: '/assets/velora-logo-light.svg',
                  showLogoTagline: false,
                })
              }
              className={`px-3 py-1 rounded border text-[11px] font-semibold transition-colors ${
                formData.customLogoImage === '/assets/velora-logo-light.svg'
                  ? 'bg-[#C9A24A] text-[#00291E] border-[#C9A24A]'
                  : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              Dark Header SVG Asset
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  logoMode: 'custom-image',
                  customLogoImage: '/assets/velora-logo.svg',
                  showLogoTagline: false,
                })
              }
              className={`px-3 py-1 rounded border text-[11px] font-semibold transition-colors ${
                formData.customLogoImage === '/assets/velora-logo.svg'
                  ? 'bg-[#C9A24A] text-[#00291E] border-[#C9A24A]'
                  : 'bg-[#F8F0D8] text-[#00291E] border-[#C9A24A]/30 hover:border-[#C9A24A]'
              }`}
            >
              Light / Navy SVG Asset
            </button>
          </div>

          {/* Logo Upload & Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
            {/* Upload & Settings (7 cols) */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Upload Logo File from Computer
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-[#00291E] hover:bg-[#003D2B] text-[#C9A24A] font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer border border-[#C9A24A]/40 shadow-sm transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Choose Logo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#26342D]/60">
                    Supports transparent PNG, SVG, WebP, JPG
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Or Paste Logo Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/logo.png"
                  value={formData.customLogoImage || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customLogoImage: e.target.value,
                      logoMode: e.target.value.trim() ? 'custom-image' : formData.logoMode,
                    })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none focus:border-[#C9A24A]"
                />
              </div>

              {/* Logo Height & Tagline Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#00291E] font-semibold">
                      Logo Display Height: <span className="text-[#0B4A36] font-mono">{formData.customLogoHeight || 44}px</span>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="28"
                    max="72"
                    step="2"
                    value={formData.customLogoHeight || 44}
                    onChange={(e) =>
                      setFormData({ ...formData, customLogoHeight: Number(e.target.value) })
                    }
                    className="w-full accent-[#C9A24A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#26342D]/60 mt-0.5">
                    <span>Compact (28px)</span>
                    <span>Standard (44px)</span>
                    <span>Large (72px)</span>
                  </div>
                </div>

                <div>
                  <label className="text-[#00291E] font-semibold block mb-2">
                    Tagline Display
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#26342D]">
                    <input
                      type="checkbox"
                      checked={formData.showLogoTagline !== false}
                      onChange={(e) =>
                        setFormData({ ...formData, showLogoTagline: e.target.checked })
                      }
                      className="accent-[#C9A24A] w-4 h-4 rounded"
                    />
                    <span className="text-xs">Show "Turning Land Into Landmarks"</span>
                  </label>
                </div>
              </div>

              {/* Dimension Guidance */}
              <div className="p-3 bg-[#F8F0D8] rounded-lg border border-[#C9A24A]/25 text-[11px] text-[#26342D]/80 space-y-1">
                <span className="font-semibold text-[#00291E] block">
                  Recommended Logo Specifications:
                </span>
                <p>
                  • <strong>Dimensions:</strong> ~400 × 120 px horizontal (or ~200 × 200 px square/emblem).
                </p>
                <p>
                  • <strong>Format:</strong> Transparent PNG or vector SVG with white or gold accents for maximum contrast on the dark emerald header.
                </p>
              </div>
            </div>

            {/* Live Dual Preview (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <span className="text-xs font-semibold text-[#00291E] block">
                Live Logo Preview
              </span>

              {/* Preview 1: Dark Header Background */}
              <div className="p-4 rounded-xl bg-[#00291E] border border-[#C9A24A]/40 flex flex-col items-center justify-center text-center shadow-inner min-h-[110px] relative overflow-hidden">
                <span className="absolute top-2 left-2 text-[9px] font-mono text-[#C9A24A] uppercase tracking-wider bg-black/40 px-1.5 py-0.5 rounded">
                  Dark Header
                </span>
                {formData.logoMode === 'custom-image' && formData.customLogoImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={formData.customLogoImage}
                      alt="Logo preview"
                      style={{ height: `${formData.customLogoHeight || 44}px` }}
                      className="w-auto object-contain max-w-[220px]"
                    />
                    {formData.showLogoTagline !== false && (
                      <span className="text-[7.5px] uppercase tracking-[0.3em] text-white/70 mt-1">
                        Turning Land Into Landmarks
                      </span>
                    )}
                  </div>
                ) : (
                  <Logo variant="light" size="sm" showTagline={formData.showLogoTagline !== false} />
                )}
              </div>

              {/* Preview 2: Light Background */}
              <div className="p-4 rounded-xl bg-[#FFF8E7] border border-[#C9A24A]/30 flex flex-col items-center justify-center text-center shadow-inner min-h-[110px] relative overflow-hidden">
                <span className="absolute top-2 left-2 text-[9px] font-mono text-[#00291E]/70 uppercase tracking-wider bg-[#F8F0D8] px-1.5 py-0.5 rounded border border-[#C9A24A]/20">
                  Light Background
                </span>
                {formData.logoMode === 'custom-image' && formData.customLogoImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={formData.customLogoImage}
                      alt="Logo preview"
                      style={{ height: `${formData.customLogoHeight || 44}px` }}
                      className="w-auto object-contain max-w-[220px]"
                    />
                    {formData.showLogoTagline !== false && (
                      <span className="text-[7.5px] uppercase tracking-[0.3em] text-[#26342D]/70 mt-1">
                        Turning Land Into Landmarks
                      </span>
                    )}
                  </div>
                ) : (
                  <Logo variant="dark" size="sm" showTagline={formData.showLogoTagline !== false} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Hero Section */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
            1. Hero Section Content
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Heading Part 1</label>
              <input
                type="text"
                value={formData.heroHeadingPart1}
                onChange={(e) => setFormData({ ...formData, heroHeadingPart1: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Heading Part 2</label>
              <input
                type="text"
                value={formData.heroHeadingPart2}
                onChange={(e) => setFormData({ ...formData, heroHeadingPart2: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Gold Highlighted Text</label>
              <input
                type="text"
                value={formData.heroHeadingHighlight}
                onChange={(e) => setFormData({ ...formData, heroHeadingHighlight: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-bold text-[#C9A24A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">Hero Subtitle / Description</label>
            <textarea
              rows={2}
              value={formData.heroDescription}
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Primary CTA Button</label>
              <input
                type="text"
                value={formData.heroButton1Text}
                onChange={(e) => setFormData({ ...formData, heroButton1Text: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Secondary CTA Button</label>
              <input
                type="text"
                value={formData.heroButton2Text}
                onChange={(e) => setFormData({ ...formData, heroButton2Text: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: About Section */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
            2. About Velora Section
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Top Label</label>
              <input
                type="text"
                value={formData.aboutLabel}
                onChange={(e) => setFormData({ ...formData, aboutLabel: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Button Text</label>
              <input
                type="text"
                value={formData.aboutButtonText}
                onChange={(e) => setFormData({ ...formData, aboutButtonText: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">About Main Heading</label>
            <input
              type="text"
              value={formData.aboutHeading}
              onChange={(e) => setFormData({ ...formData, aboutHeading: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Paragraph 1</label>
              <textarea
                rows={3}
                value={formData.aboutPara1}
                onChange={(e) => setFormData({ ...formData, aboutPara1: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Paragraph 2</label>
              <textarea
                rows={3}
                value={formData.aboutPara2}
                onChange={(e) => setFormData({ ...formData, aboutPara2: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Featured Project (Amrutvan) */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
            3. Featured Project Marquee Strip (Amrutvan)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Subtitle Quote</label>
              <input
                type="text"
                value={formData.featuredProjectSubtitle}
                onChange={(e) => setFormData({ ...formData, featuredProjectSubtitle: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Plot Sizes Value</label>
              <input
                type="text"
                value={formData.featuredPlotSizes}
                onChange={(e) => setFormData({ ...formData, featuredPlotSizes: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">Featured Description</label>
            <textarea
              rows={2}
              value={formData.featuredProjectDescription}
              onChange={(e) => setFormData({ ...formData, featuredProjectDescription: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 4: Lead Form Section */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
            4. Lead Generation Form Copy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Form Heading</label>
              <input
                type="text"
                value={formData.leadHeading}
                onChange={(e) => setFormData({ ...formData, leadHeading: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Form Subheading</label>
              <input
                type="text"
                value={formData.leadSubheading}
                onChange={(e) => setFormData({ ...formData, leadSubheading: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs tracking-wider uppercase px-8 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Publish Content Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
