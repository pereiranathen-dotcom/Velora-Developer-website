import React, { useState } from 'react';
import { Save, CheckCircle2, Camera, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { WebsiteContent } from '../../types';
import { AdminViewType } from '../AdminLayout';

interface AdminContentViewProps {
  onNavigateView?: (view: AdminViewType) => void;
}

export const AdminContentView: React.FC<AdminContentViewProps> = ({ onNavigateView }) => {
  const { content } = useStore();
  const [formData, setFormData] = useState<WebsiteContent>({ ...content });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StoreService.saveWebsiteContent(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">Website Content CMS</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Dynamically update hero headlines, promotional copy, featured project highlights, and lead form text.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes successfully published to website!</span>
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
