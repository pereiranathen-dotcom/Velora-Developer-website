import React, { useState } from 'react';
import { Save, CheckCircle2, Globe, Search, BarChart3 } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { SEOSettings } from '../../types';
import { ImageDimensionBadge } from '../../components/common/ImageDimensionBadge';

export const AdminSEOView: React.FC = () => {
  const { seo } = useStore();
  const [formData, setFormData] = useState<SEOSettings>({ ...seo });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StoreService.saveSEOSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">SEO & Meta Tags Management</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Optimize search engine rankings, OpenGraph social sharing previews, and tracking codes.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>SEO settings saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C9A24A]" />
            <span>Primary Search Engine Meta Tags</span>
          </h3>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">
              Homepage Title (&lt;title&gt;) *
            </label>
            <input
              type="text"
              required
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">
              Meta Description (recommended 150-160 characters)
            </label>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none"
            />
          </div>
        </div>

        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C9A24A]" />
            <span>Social Share Cards & Tracking</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#00291E] font-semibold">
                  OpenGraph Social Image URL
                </label>
                <ImageDimensionBadge
                  dimensions="1200 × 630 px"
                  aspectRatio="1.91:1 Social Share"
                  maxSize="1.0 MB"
                  formats="JPG, PNG"
                />
              </div>
              <input
                type="text"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
              <span className="text-[10px] text-[#26342D]/60 mt-0.5 block">
                Shown when the website link is shared on WhatsApp, Facebook, iMessage, and Twitter.
              </span>
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={formData.googleAnalyticsId}
                onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs tracking-wider uppercase px-8 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save SEO Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
