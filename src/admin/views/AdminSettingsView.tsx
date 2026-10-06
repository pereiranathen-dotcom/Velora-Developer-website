import React, { useState } from 'react';
import { Save, CheckCircle2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { ContactSettings } from '../../types';

export const AdminSettingsView: React.FC = () => {
  const { settings } = useStore();
  const [formData, setFormData] = useState<ContactSettings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StoreService.saveContactSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">Contact & Company Settings</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Modify official company phone numbers, WhatsApp concierge, corporate address, and social channels.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Numbers */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C9A24A]" />
            <span>Phone & Messaging</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Primary Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">WhatsApp Number *</label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
              />
              <span className="text-[10px] text-[#26342D]/60 mt-0.5 block">Used for Floating WhatsApp button</span>
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Alternate Numbers</label>
              <input
                type="text"
                value={formData.phoneAlt || ''}
                onChange={(e) => setFormData({ ...formData, phoneAlt: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Email & Web */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#C9A24A]" />
            <span>Email & Digital Presence</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Official Inquiries Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Website URL</label>
              <input
                type="text"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C9A24A]" />
            <span>Office & Site Addresses</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Site Office Address</label>
              <textarea
                rows={3}
                value={formData.siteAddress}
                onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Corporate Office Address</label>
              <textarea
                rows={3}
                value={formData.officeAddress}
                onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">Google Maps Direct Link</label>
            <input
              type="text"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none"
            />
          </div>
        </div>

        {/* Social & Legal */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C9A24A]" />
            <span>Social Media Channels & RERA Disclaimer</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#00291E] font-semibold mb-1">RERA Disclaimer Copy</label>
            <input
              type="text"
              value={formData.reraText}
              onChange={(e) => setFormData({ ...formData, reraText: e.target.value })}
              className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none"
            />
          </div>
        </div>

        {/* Supabase Cloud Database Status */}
        <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#C9A24A]/20 pb-2">
            <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#C9A24A]" />
              <span>Supabase Cloud Database Connection</span>
            </h3>
            <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-medium">
              Connected: bbgcvexhjvcvbowhxabc
            </span>
          </div>

          <p className="text-xs text-[#26342D]/75 leading-relaxed font-light">
            Your website is configured to communicate with your Supabase project (<strong>https://bbgcvexhjvcvbowhxabc.supabase.co</strong>).
            To enable cross-browser real-time photo &amp; data persistence, make sure the <code className="bg-[#F8F0D8] px-1.5 py-0.5 rounded text-[#00291E] font-mono">app_store</code> table is created in your Supabase SQL editor.
          </p>

          <div className="bg-[#00291E] text-white/90 p-4 rounded-lg font-mono text-[11px] space-y-2 overflow-x-auto border border-[#C9A24A]/30">
            <p className="text-[#C9A24A] font-semibold text-xs">Run this SQL in your Supabase Dashboard &gt; SQL Editor:</p>
            <pre className="text-emerald-300 leading-normal select-all">
{`CREATE TABLE IF NOT EXISTS public.app_store (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.app_store ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read and write" 
ON public.app_store 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);`}
            </pre>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs tracking-wider uppercase px-8 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Contact Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
