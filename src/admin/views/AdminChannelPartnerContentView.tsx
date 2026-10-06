import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  ExternalLink,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  Building2,
  Users,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  Phone,
  MessageCircle,
  Mail,
  Camera,
  Check,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { ChannelPartnerContent } from '../../types';
import { ASSETS } from '../../data/initialData';

export const AdminChannelPartnerContentView: React.FC = () => {
  const { channelPartnerContent, projects } = useStore();
  const [formData, setFormData] = useState<ChannelPartnerContent>({ ...channelPartnerContent });
  const [activeTab, setActiveTab] = useState<
    'hero' | 'trust-why' | 'how-who' | 'provide-amrutvan' | 'benefits-reviews' | 'faqs-desk'
  >('hero');
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    StoreService.saveChannelPartnerContent(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size should be less than 5 MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, heroImage: base64 }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: 'New Question for Channel Partners?',
      answer: 'Detailed response regarding partnership terms, lead registration, or project availability.',
    };
    setFormData((prev) => ({
      ...prev,
      faqsList: [...prev.faqsList, newFaq],
    }));
  };

  const handleRemoveFaq = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      faqsList: prev.faqsList.filter((f) => f.id !== id),
    }));
  };

  const handleFaqChange = (id: string, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => ({
      ...prev,
      faqsList: prev.faqsList.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
    }));
  };

  const heroPresets = [
    {
      name: 'Luxury Clubhouse Estate',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    },
    {
      name: 'Amrutvan Grand Entrance Gate',
      url: ASSETS.heroEntrance,
    },
    {
      name: 'Scenic Verdant Plotted Layout',
      url: ASSETS.aerialGreenEstate,
    },
    {
      name: 'Modern Architecture Consultation',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-2xl text-[#00291E]">Channel Partner Page CMS</h2>
            <span className="bg-[#00291E] text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#C9A24A]/40">
              /channel-partner
            </span>
          </div>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Manage all copy, hero photography, benefits, enablement checklists, FAQs, and partner desk contact info.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <a
            href="/channel-partner"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-[#F8F0D8] hover:bg-[#C9A24A]/20 text-[#00291E] border border-[#C9A24A]/30 font-medium text-xs rounded flex items-center gap-1.5 transition-colors"
          >
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C9A24A]" />
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded shadow hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-[#00291E]" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {saved && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>✓ Channel Partner page changes successfully saved & published live!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#C9A24A]/20 text-xs">
        {[
          { id: 'hero', label: '1. Hero & Visual' },
          { id: 'trust-why', label: '2. Value Strip & Why Partner' },
          { id: 'how-who', label: '3. Process & Target Audience' },
          { id: 'provide-amrutvan', label: '4. What We Provide & Amrutvan' },
          { id: 'benefits-reviews', label: '5. Benefits & Testimonials' },
          { id: 'faqs-desk', label: '6. FAQs & Partner Desk' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-t-lg font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#00291E] text-[#C9A24A] border-t-2 border-[#C9A24A]'
                : 'bg-[#FFF8E7] text-[#26342D]/70 hover:bg-[#F8F0D8] hover:text-[#00291E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANELS */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ========================================================= */}
        {/* TAB 1: HERO & VISUAL BANNER */}
        {/* ========================================================= */}
        {activeTab === 'hero' && (
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#C9A24A]/20 pb-3">
              <div>
                <h3 className="font-serif text-lg text-[#00291E] font-medium">
                  1. Channel Partner Hero Banner & Headlines
                </h3>
                <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
                  Set the primary headline, supporting narrative, button labels, and background photo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Badge Tagline</label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Headline (Part 1)</label>
                <input
                  type="text"
                  value={formData.heroHeading}
                  onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="block text-[#00291E] font-semibold mb-1">
                  Gold Highlight Text
                </label>
                <input
                  type="text"
                  value={formData.heroHeadingHighlight}
                  onChange={(e) =>
                    setFormData({ ...formData, heroHeadingHighlight: e.target.value })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[#00291E] font-semibold mb-1">
                Supporting Headline / Narrative Description
              </label>
              <textarea
                rows={3}
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none focus:border-[#C9A24A]"
              />
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Primary CTA Label</label>
                <input
                  type="text"
                  value={formData.heroPrimaryCtaText}
                  onChange={(e) => setFormData({ ...formData, heroPrimaryCtaText: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Secondary CTA Label</label>
                <input
                  type="text"
                  value={formData.heroSecondaryCtaText}
                  onChange={(e) => setFormData({ ...formData, heroSecondaryCtaText: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">WhatsApp Button Text</label>
                <input
                  type="text"
                  value={formData.heroWhatsAppText}
                  onChange={(e) => setFormData({ ...formData, heroWhatsAppText: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Trust Badge 1</label>
                <input
                  type="text"
                  value={formData.heroTrustBadge1}
                  onChange={(e) => setFormData({ ...formData, heroTrustBadge1: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Trust Badge 2</label>
                <input
                  type="text"
                  value={formData.heroTrustBadge2}
                  onChange={(e) => setFormData({ ...formData, heroTrustBadge2: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Trust Badge 3</label>
                <input
                  type="text"
                  value={formData.heroTrustBadge3}
                  onChange={(e) => setFormData({ ...formData, heroTrustBadge3: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
            </div>

            {/* Hero Image Settings & Dimension Guidance */}
            <div className="p-5 bg-[#001D15] text-white rounded-xl border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                    HERO BACKGROUND PHOTO
                  </span>
                  <h4 className="font-serif text-base text-[#F8F0D8]">
                    Channel Partner Hero Image Settings
                  </h4>
                </div>

                {/* Sizing badge */}
                <div className="inline-flex items-center gap-2 bg-[#00291E] border border-[#C9A24A]/40 px-3 py-1.5 rounded-lg text-[11px] text-[#C9A24A]">
                  <span className="font-mono font-bold">1920 × 1080 px</span>
                  <span className="opacity-75">• 16:9 Landscape • Max 3.0 MB</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Image Preview */}
                <div className="md:col-span-5 relative aspect-[16/9] rounded-lg overflow-hidden bg-black/50 border border-white/20">
                  <img
                    src={formData.heroImage}
                    alt="Channel Partner Hero Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-2 text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded">
                    Live Preview
                  </span>
                </div>

                {/* Input & Upload */}
                <div className="md:col-span-7 space-y-3 text-xs">
                  <div>
                    <label className="text-white/80 block mb-1 font-semibold">Image URL</label>
                    <input
                      type="text"
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-[#00291E] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 block mb-1 font-semibold">
                      Or Upload from Computer
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full bg-[#00291E] border border-white/20 rounded p-1.5 text-white/80 file:bg-[#C9A24A] file:text-[#00291E] file:border-0 file:rounded file:px-3 file:py-1 file:font-bold file:text-xs file:mr-3 cursor-pointer"
                    />
                  </div>

                  {/* Presets */}
                  <div>
                    <span className="text-[11px] text-white/60 block mb-1.5">
                      Or select a curated real-estate visual preset:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {heroPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, heroImage: preset.url })}
                          className={`p-2 rounded border text-left text-[11px] truncate transition-colors ${
                            formData.heroImage === preset.url
                              ? 'bg-[#C9A24A] text-[#00291E] font-bold border-[#C9A24A]'
                              : 'bg-white/5 border-white/10 hover:border-[#C9A24A]/50 text-white/80'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TRUST STRIP & WHY PARTNER */}
        {/* ========================================================= */}
        {activeTab === 'trust-why' && (
          <div className="space-y-6">
            {/* Value Strip */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                2. Trust / Value Proposition Strip (5 Items)
              </h3>
              <p className="text-xs text-[#26342D]/70 font-light">
                Displayed in the gold & green horizontal banner immediately beneath the hero section.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {formData.valueStrip.map((item, index) => (
                  <div key={item.id} className="p-3 bg-[#F8F0D8] rounded-lg border border-[#C9A24A]/30 space-y-2">
                    <span className="text-[10px] font-bold text-[#C9A24A] uppercase">
                      Value Item {index + 1}
                    </span>
                    <div>
                      <label className="text-[11px] text-[#00291E] font-semibold block mb-0.5">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...formData.valueStrip];
                          updated[index].title = e.target.value;
                          setFormData({ ...formData, valueStrip: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#00291E] font-semibold block mb-0.5">Subtitle</label>
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={(e) => {
                          const updated = [...formData.valueStrip];
                          updated[index].subtitle = e.target.value;
                          setFormData({ ...formData, valueStrip: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Partner Cards */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                Why Partner With Velora? (6 Cards)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.whyPartnerHeading}
                    onChange={(e) => setFormData({ ...formData, whyPartnerHeading: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={formData.whyPartnerBadge}
                    onChange={(e) => setFormData({ ...formData, whyPartnerBadge: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#00291E] font-semibold mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={formData.whyPartnerDescription}
                  onChange={(e) => setFormData({ ...formData, whyPartnerDescription: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>

              {/* 6 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
                {formData.whyPartnerCards.map((card, idx) => (
                  <div key={card.id} className="p-4 bg-[#F8F0D8] rounded-xl border border-[#C9A24A]/30 space-y-2.5">
                    <span className="text-[10px] font-bold text-[#C9A24A] uppercase">
                      Card 0{idx + 1}
                    </span>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => {
                          const updated = [...formData.whyPartnerCards];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, whyPartnerCards: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Description</label>
                      <textarea
                        rows={3}
                        value={card.description}
                        onChange={(e) => {
                          const updated = [...formData.whyPartnerCards];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, whyPartnerCards: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Footer Badge</label>
                      <input
                        type="text"
                        value={card.badge}
                        onChange={(e) => {
                          const updated = [...formData.whyPartnerCards];
                          updated[idx].badge = e.target.value;
                          setFormData({ ...formData, whyPartnerCards: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="pt-2 text-xs">
                <label className="block text-[#00291E] font-semibold mb-1">
                  Legal / Regulatory Disclaimer Note
                </label>
                <textarea
                  rows={2}
                  value={formData.whyPartnerDisclaimer}
                  onChange={(e) => setFormData({ ...formData, whyPartnerDisclaimer: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: HOW IT WORKS & WHO CAN PARTNER */}
        {/* ========================================================= */}
        {activeTab === 'how-who' && (
          <div className="space-y-6">
            {/* How It Works (4 Steps) */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                3. How the Channel Partnership Works (4 Steps)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.howItWorksHeading}
                    onChange={(e) => setFormData({ ...formData, howItWorksHeading: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.howItWorksDescription}
                    onChange={(e) => setFormData({ ...formData, howItWorksDescription: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {formData.howItWorksSteps.map((step, idx) => (
                  <div key={step.id} className="p-4 bg-[#F8F0D8] rounded-xl border border-[#C9A24A]/30 space-y-2">
                    <span className="font-serif text-2xl font-bold text-[#C9A24A] block">
                      {step.stepNumber}
                    </span>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Title</label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...formData.howItWorksSteps];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, howItWorksSteps: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Description</label>
                      <textarea
                        rows={3}
                        value={step.description}
                        onChange={(e) => {
                          const updated = [...formData.howItWorksSteps];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, howItWorksSteps: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Badge</label>
                      <input
                        type="text"
                        value={step.badge}
                        onChange={(e) => {
                          const updated = [...formData.howItWorksSteps];
                          updated[idx].badge = e.target.value;
                          setFormData({ ...formData, howItWorksSteps: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Who Can Partner */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                Who Can Partner With Us?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.whoCanPartnerHeading}
                    onChange={(e) => setFormData({ ...formData, whoCanPartnerHeading: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Territories Note</label>
                  <input
                    type="text"
                    value={formData.whoCanPartnerTerritories}
                    onChange={(e) =>
                      setFormData({ ...formData, whoCanPartnerTerritories: e.target.value })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#00291E] font-semibold mb-1">Intro Message</label>
                <textarea
                  rows={2}
                  value={formData.whoCanPartnerDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, whoCanPartnerDescription: e.target.value })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>

              {/* 8 Audience Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {formData.whoCanPartnerAudiences.map((aud, idx) => (
                  <div key={aud.id} className="p-3 bg-[#F8F0D8] rounded-lg border border-[#C9A24A]/30 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#C9A24A] uppercase">
                      Category 0{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={aud.title}
                      onChange={(e) => {
                        const updated = [...formData.whoCanPartnerAudiences];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, whoCanPartnerAudiences: updated });
                      }}
                      className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs font-semibold outline-none"
                    />
                    <textarea
                      rows={2}
                      value={aud.description}
                      onChange={(e) => {
                        const updated = [...formData.whoCanPartnerAudiences];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, whoCanPartnerAudiences: updated });
                      }}
                      className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: WHAT WE PROVIDE & AMRUTVAN FEATURE */}
        {/* ========================================================= */}
        {activeTab === 'provide-amrutvan' && (
          <div className="space-y-6">
            {/* What We Provide (10 items) */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                4. Everything You Need to Sell With Confidence (10 Checklist Items)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.whatWeProvideHeading}
                    onChange={(e) => setFormData({ ...formData, whatWeProvideHeading: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.whatWeProvideDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, whatWeProvideDescription: e.target.value })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {formData.whatWeProvideItems.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-[#F8F0D8] rounded-lg border border-[#C9A24A]/30 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#C9A24A] uppercase">
                      Item {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...formData.whatWeProvideItems];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, whatWeProvideItems: updated });
                      }}
                      className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs font-semibold outline-none"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...formData.whatWeProvideItems];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, whatWeProvideItems: updated });
                      }}
                      className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Project Section */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                Featured Project Section (Start With Amrutvan)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={formData.featuredProjectBadge}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredProjectBadge: e.target.value })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.featuredProjectHeading}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredProjectHeading: e.target.value })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Featured Project Link / Slug
                  </label>
                  <select
                    value={formData.featuredProjectSlug}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredProjectSlug: e.target.value })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#00291E] font-semibold mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={formData.featuredProjectDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredProjectDescription: e.target.value })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BENEFITS & TESTIMONIALS */}
        {/* ========================================================= */}
        {activeTab === 'benefits-reviews' && (
          <div className="space-y-6">
            {/* Built Around Partner Success */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                5. Partner Benefits (Built Around Partner Success)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.benefitsHeading}
                    onChange={(e) => setFormData({ ...formData, benefitsHeading: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={formData.benefitsBadge}
                    onChange={(e) => setFormData({ ...formData, benefitsBadge: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {formData.benefitsList.map((ben, idx) => (
                  <div key={ben.id} className="p-4 bg-[#F8F0D8] rounded-xl border border-[#C9A24A]/30 space-y-2">
                    <span className="font-serif text-2xl font-bold text-[#C9A24A] block">
                      {ben.number}
                    </span>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Benefit Title</label>
                      <input
                        type="text"
                        value={ben.title}
                        onChange={(e) => {
                          const updated = [...formData.benefitsList];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, benefitsList: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#00291E] block mb-0.5">Description</label>
                      <textarea
                        rows={3}
                        value={ben.description}
                        onChange={(e) => {
                          const updated = [...formData.benefitsList];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, benefitsList: updated });
                        }}
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Empty State & Notice */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                Partner Testimonials (Verified Partners Notice)
              </h3>
              <p className="text-xs text-[#26342D]/70 font-light">
                Per user instructions, no fake reviews or names are published. You can edit the authenticity note or placeholder text below.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.testimonialsHeading}
                    onChange={(e) =>
                      setFormData({ ...formData, testimonialsHeading: e.target.value })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={formData.testimonialsBadge}
                    onChange={(e) =>
                      setFormData({ ...formData, testimonialsBadge: e.target.value })
                    }
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[#00291E] font-semibold mb-1">
                  Placeholder / Authenticity Quote
                </label>
                <input
                  type="text"
                  value={formData.testimonialsEmptyNotice}
                  onChange={(e) =>
                    setFormData({ ...formData, testimonialsEmptyNotice: e.target.value })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>

              <div className="text-xs">
                <label className="block text-[#00291E] font-semibold mb-1">Supporting Clarification</label>
                <textarea
                  rows={2}
                  value={formData.testimonialsSubNotice}
                  onChange={(e) =>
                    setFormData({ ...formData, testimonialsSubNotice: e.target.value })
                  }
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: FAQS & PARTNER DESK */}
        {/* ========================================================= */}
        {activeTab === 'faqs-desk' && (
          <div className="space-y-6">
            {/* FAQs Management */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#C9A24A]/20 pb-2">
                <div>
                  <h3 className="font-serif text-lg text-[#00291E] font-medium">
                    6. Frequently Asked Questions (Accordion)
                  </h3>
                  <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
                    Add, edit, or reword FAQs shown to potential Channel Partners.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="bg-[#00291E] hover:bg-[#003D2B] text-[#C9A24A] px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Title</label>
                  <input
                    type="text"
                    value={formData.faqsHeading}
                    onChange={(e) => setFormData({ ...formData, faqsHeading: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={formData.faqsDescription}
                    onChange={(e) => setFormData({ ...formData, faqsDescription: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  />
                </div>
              </div>

              {/* FAQ List */}
              <div className="space-y-3 pt-2">
                {formData.faqsList.map((faq, index) => (
                  <div key={faq.id} className="p-4 bg-[#F8F0D8] rounded-xl border border-[#C9A24A]/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C9A24A]">
                        Question {String(index + 1).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(faq.id)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                        placeholder="Question..."
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-2 text-xs font-semibold outline-none"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                        placeholder="Answer..."
                        className="w-full bg-white border border-[#C9A24A]/30 rounded p-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Partner Desk Direct Contact Information */}
            <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
                Channel Partner Relations Desk Direct Contacts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Direct Partner Desk Phone
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <input
                      type="text"
                      value={formData.deskPhone}
                      onChange={(e) => setFormData({ ...formData, deskPhone: e.target.value })}
                      placeholder="92409 53403"
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    WhatsApp Desk Mobile
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2">
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <input
                      type="text"
                      value={formData.deskWhatsApp}
                      onChange={(e) => setFormData({ ...formData, deskWhatsApp: e.target.value })}
                      placeholder="92409 53403"
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">
                    Official Partner Email
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2">
                    <Mail className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <input
                      type="email"
                      value={formData.deskEmail}
                      onChange={(e) => setFormData({ ...formData, deskEmail: e.target.value })}
                      placeholder="partners@veloradevelopers.com"
                      className="bg-transparent outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button in form */}
        <div className="flex items-center justify-between pt-4 border-t border-[#C9A24A]/20">
          <span className="text-xs text-[#26342D]/60 italic">
            Changes publish immediately across the public /channel-partner route.
          </span>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#00291E]" />
            <span>Save & Publish All Channel Partner Content</span>
          </button>
        </div>
      </form>
    </div>
  );
};
