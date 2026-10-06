import React, { useState } from 'react';
import {
  Building2,
  Users,
  Megaphone,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Send,
  Sparkles,
  Layers,
  Compass,
  FileCheck,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { StoreService } from '../services/store';
import { ASSETS } from '../data/initialData';

interface ChannelPartnerPageProps {
  onNavigate: (path: string) => void;
  onOpenSiteVisit?: (project?: string) => void;
}

export const ChannelPartnerPage: React.FC<ChannelPartnerPageProps> = ({
  onNavigate,
  onOpenSiteVisit,
}) => {
  const { settings, projects, channelPartnerContent } = useStore();
  const cp = channelPartnerContent;

  // Find Featured Project data
  const featuredProject =
    projects.find((p) => p.slug === cp.featuredProjectSlug) ||
    projects.find((p) => p.slug === 'amrutvan') ||
    projects[0];

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [customCity, setCustomCity] = useState('');
  const [partnerType, setPartnerType] = useState('Real Estate Broker');
  const [customPartnerType, setCustomPartnerType] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Call'>('WhatsApp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleScrollToRegister = () => {
    const el = document.getElementById('partner-register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);

    const finalCity = city === 'Other' && customCity ? customCity : city;
    const finalPartnerType = partnerType === 'Other' && customPartnerType ? customPartnerType : partnerType;

    const notesSummary = [
      agencyName ? `Agency: ${agencyName}` : null,
      reraNumber ? `RERA: ${reraNumber}` : null,
      `Category: ${finalPartnerType}`,
      `Operating City: ${finalCity}`,
    ]
      .filter(Boolean)
      .join(' | ');

    StoreService.addLead({
      name: agencyName ? `${fullName} (${agencyName})` : fullName,
      phone,
      email,
      project: 'Channel Partner Program',
      preferredContact,
      message: message ? `${message} [${notesSummary}]` : notesSummary,
      status: 'New',
      source: 'Channel Partner',
      city: finalCity,
      partnerType: finalPartnerType,
      reraNumber: reraNumber || undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const deskPhone = cp.deskPhone || settings.phone;
  const deskWhatsApp = cp.deskWhatsApp || settings.whatsapp;
  const deskEmail = cp.deskEmail || settings.email;

  return (
    <main className="w-full bg-[#FFF8E7] text-[#26342D] pt-20">
      {/* 4. HERO SECTION */}
      <section className="relative w-full bg-[#001D15] overflow-hidden min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center">
        {/* Background Image with subtle gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={cp.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85'}
            alt={cp.heroImageAlt || 'Velora Developers Channel Partner Network'}
            className="w-full h-full object-cover object-center brightness-90 filter"
          />
          {/* Deep Forest Green Gradient Overlay for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001D15]/95 via-[#00291E]/90 to-[#001D15]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001D15] via-transparent to-black/40" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00291E]/80 border border-[#C9A24A]/40 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A24A]">
                {cp.heroBadge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#F8F0D8] font-normal leading-[1.15] tracking-tight">
              {cp.heroHeading}{' '}
              <span className="text-[#C9A24A] italic font-serif">{cp.heroHeadingHighlight}</span>
            </h1>

            {/* Supporting Headline */}
            <p className="mt-6 text-base sm:text-lg text-white/85 font-light leading-relaxed max-w-2xl">
              {cp.heroDescription}
            </p>

            {/* Conversion CTA Group */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleScrollToRegister}
                className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold text-xs sm:text-sm tracking-wider uppercase px-7 py-4 rounded-lg shadow-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
              >
                <span>{cp.heroPrimaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-[#00291E]" />
              </button>

              <a
                href={`tel:${deskPhone}`}
                className="border border-[#C9A24A]/70 text-[#F8F0D8] hover:bg-[#00291E]/80 hover:text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-6 py-4 rounded-lg backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C9A24A]" />
                <span>{cp.heroSecondaryCtaText}</span>
              </a>

              <a
                href={`https://wa.me/91${deskWhatsApp}?text=Hi%20Velora%20Developers%2C%20I%20am%20interested%20in%20joining%20as%20a%20Channel%20Partner.`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-white font-medium text-xs sm:text-sm tracking-wider uppercase px-5 py-4 rounded-lg backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{cp.heroWhatsAppText}</span>
              </a>
            </div>

            {/* Trust Micro-Metrics */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A24A]" />
                <span>{cp.heroTrustBadge1}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#C9A24A]" />
                <span>{cp.heroTrustBadge2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C9A24A]" />
                <span>{cp.heroTrustBadge3}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST / VALUE STRIP */}
      <section className="bg-[#00291E] border-y border-[#C9A24A]/30 py-6 sm:py-7">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 text-center">
            {cp.valueStrip.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`flex flex-col sm:flex-row items-center justify-center gap-3 p-2 ${
                  idx === 4 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#001D15] border border-[#C9A24A]/40 flex items-center justify-center text-[#C9A24A] shrink-0">
                  {idx === 0 && <Building2 className="w-5 h-5" />}
                  {idx === 1 && <Users className="w-5 h-5" />}
                  {idx === 2 && <Megaphone className="w-5 h-5" />}
                  {idx === 3 && <ShieldCheck className="w-5 h-5" />}
                  {idx === 4 && <TrendingUp className="w-5 h-5" />}
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-xs sm:text-sm font-semibold text-[#F8F0D8] block">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-white/60">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY BECOME A VELORA CHANNEL PARTNER? */}
      <section className="py-20 sm:py-24 bg-[#FFF8E7]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {cp.whyPartnerBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#00291E] font-normal mt-2">
              {cp.whyPartnerHeading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#26342D]/80 font-light leading-relaxed">
              {cp.whyPartnerDescription}
            </p>
            <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-5" />
          </div>

          {/* 6 Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cp.whyPartnerCards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="bg-[#F8F0D8] p-8 rounded-2xl border border-[#C9A24A]/30 shadow-md hover:shadow-xl hover:border-[#C9A24A] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#00291E] text-[#C9A24A] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {idx === 0 && <TrendingUp className="w-6 h-6" />}
                    {idx === 1 && <Building2 className="w-6 h-6" />}
                    {idx === 2 && <Megaphone className="w-6 h-6" />}
                    {idx === 3 && <Users className="w-6 h-6" />}
                    {idx === 4 && <ShieldCheck className="w-6 h-6" />}
                    {idx === 5 && <Award className="w-6 h-6" />}
                  </div>
                  <h3 className="font-serif text-xl text-[#00291E] font-semibold mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#26342D]/80 leading-relaxed font-light">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#C9A24A]/20 flex items-center gap-2 text-[11px] font-semibold text-[#0B4A36]">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A24A]" />
                  <span>{card.badge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance note */}
          <p className="mt-10 text-center text-[11px] text-[#26342D]/60 max-w-2xl mx-auto italic">
            {cp.whyPartnerDisclaimer}
          </p>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="py-20 sm:py-24 bg-[#001D15] text-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {cp.howItWorksBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F8F0D8] font-normal mt-2">
              {cp.howItWorksHeading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/70 font-light leading-relaxed">
              {cp.howItWorksDescription}
            </p>
            <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {cp.howItWorksSteps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="bg-[#00291E] p-7 rounded-2xl border border-white/10 relative hover:border-[#C9A24A]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl font-bold text-[#C9A24A]">
                      {step.stepNumber}
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#C9A24A] bg-[#001D15] px-2.5 py-1 rounded border border-[#C9A24A]/30">
                      Step {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-[#C9A24A] flex items-center gap-1.5">
                  <span>{step.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHO CAN BECOME A CHANNEL PARTNER? */}
      <section className="py-20 sm:py-24 bg-[#F8F0D8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading and Narrative */}
            <div className="lg:col-span-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                {cp.whoCanPartnerBadge}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#00291E] font-normal mt-2 leading-tight">
                {cp.whoCanPartnerHeading}
              </h2>
              <div className="w-16 h-[2px] bg-[#C9A24A] my-5" />

              <p className="text-sm sm:text-base text-[#26342D]/85 font-light leading-relaxed mb-6">
                {cp.whoCanPartnerDescription}
              </p>

              <div className="p-5 rounded-xl bg-[#FFF8E7] border border-[#C9A24A]/40 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#00291E]">
                  <Sparkles className="w-4 h-4 text-[#C9A24A]" />
                  <span>Key Operating Territories</span>
                </div>
                <p className="text-xs text-[#26342D]/80 leading-relaxed">
                  {cp.whoCanPartnerTerritories}
                </p>
              </div>
            </div>

            {/* Right Column: Audience Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cp.whoCanPartnerAudiences.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 bg-white rounded-xl border border-[#C9A24A]/25 shadow-sm hover:shadow-md hover:border-[#C9A24A] transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#00291E]/10 text-[#00291E] flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A24A]" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#00291E]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#26342D]/70 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. WHAT WE PROVIDE */}
      <section className="py-20 sm:py-24 bg-[#FFF8E7] border-y border-[#C9A24A]/20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {cp.whatWeProvideBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#00291E] font-normal mt-2">
              {cp.whatWeProvideHeading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#26342D]/80 font-light leading-relaxed">
              {cp.whatWeProvideDescription}
            </p>
            <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {cp.whatWeProvideItems.map((feature, i) => (
              <div
                key={feature.id || i}
                className="bg-[#F8F0D8] p-5 rounded-xl border border-[#C9A24A]/30 shadow-sm flex flex-col justify-between hover:border-[#C9A24A] hover:bg-white transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#00291E] text-[#C9A24A] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-[#00291E] group-hover:text-[#0B4A36]">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-[11px] text-[#26342D]/70 pl-11">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FEATURED PROJECT (AMRUTVAN) */}
      {featuredProject && (
        <section className="py-20 sm:py-24 bg-[#00291E] text-white relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Image with badges */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C9A24A]/40 aspect-[16/10] group">
                  <img
                    src={featuredProject.heroImage || ASSETS.heroEntrance}
                    alt={featuredProject.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 bg-[#001D15]/90 border border-[#C9A24A]/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A]">
                      Featured Project for Partners
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs uppercase tracking-widest text-[#C9A24A] font-semibold block">
                      {featuredProject.category}
                    </span>
                    <h3 className="font-serif text-2xl text-white font-normal mt-0.5">
                      {featuredProject.name}{' '}
                      {featuredProject.marathiName && (
                        <span className="text-lg text-[#C9A24A]">({featuredProject.marathiName})</span>
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Right Column: Project Details & Action */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                    {cp.featuredProjectBadge}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#F8F0D8] font-normal mt-1">
                    {cp.featuredProjectHeading}
                  </h2>
                  <p className="mt-3 text-sm text-white/80 font-light leading-relaxed">
                    {cp.featuredProjectDescription}
                  </p>
                </div>

                {/* Key Facts pulled from project data */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                  <div className="bg-[#001D15] p-3.5 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Location</span>
                    <span className="text-xs font-semibold text-[#F8F0D8] mt-1 block">
                      {featuredProject.location}
                    </span>
                  </div>

                  <div className="bg-[#001D15] p-3.5 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Plot Offering</span>
                    <span className="text-xs font-semibold text-[#F8F0D8] mt-1 block">
                      {featuredProject.plotSizes}
                    </span>
                  </div>

                  <div className="bg-[#001D15] p-3.5 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Status</span>
                    <span className="text-xs font-semibold text-[#C9A24A] mt-1 block">
                      {featuredProject.status}
                    </span>
                  </div>
                </div>

                {/* Project Highlights Checklist */}
                <div className="space-y-2 pt-1 text-xs text-white/85">
                  {featuredProject.keyHighlights && featuredProject.keyHighlights.slice(0, 4).map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A24A] shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => onNavigate(`/projects/${featuredProject.slug}`)}
                    className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Explore {featuredProject.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleScrollToRegister}
                    className="border border-[#C9A24A]/60 text-[#F8F0D8] hover:bg-white/10 font-semibold text-xs uppercase tracking-wider px-5 py-3.5 rounded transition-all flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-[#C9A24A]" />
                    <span>Refer a Client</span>
                  </button>

                  {onOpenSiteVisit && (
                    <button
                      onClick={() => onOpenSiteVisit(featuredProject.name)}
                      className="text-xs text-white/70 hover:text-[#C9A24A] transition-colors underline underline-offset-4 flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C9A24A]" />
                      <span>Schedule Partner Site Visit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 11. PARTNER BENEFITS */}
      <section className="py-20 sm:py-24 bg-[#FFF8E7]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {cp.benefitsBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#00291E] font-normal mt-2">
              {cp.benefitsHeading}
            </h2>
            <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-5" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cp.benefitsList.map((ben, idx) => (
              <div
                key={ben.id || idx}
                className="p-8 rounded-2xl bg-[#F8F0D8] border border-[#C9A24A]/30 shadow-md relative overflow-hidden group hover:border-[#C9A24A] transition-all"
              >
                <span className="font-serif text-5xl font-light text-[#C9A24A]/30 absolute top-4 right-4">
                  {ben.number}
                </span>
                <div className="w-11 h-11 rounded-lg bg-[#00291E] text-[#C9A24A] flex items-center justify-center mb-6">
                  {idx === 0 && <Users className="w-5 h-5" />}
                  {idx === 1 && <Compass className="w-5 h-5" />}
                  {idx === 2 && <Layers className="w-5 h-5" />}
                  {idx === 3 && <TrendingUp className="w-5 h-5" />}
                </div>
                <h3 className="font-serif text-xl text-[#00291E] font-semibold mb-2">
                  {ben.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#26342D]/80 leading-relaxed font-light">
                  {ben.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. PARTNER TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-[#F8F0D8] border-t border-[#C9A24A]/25">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {cp.testimonialsBadge}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#00291E] font-normal mt-2">
              {cp.testimonialsHeading}
            </h2>
            <div className="w-12 h-[2px] bg-[#C9A24A] mx-auto mt-3" />
          </div>

          {/* Genuine Admin-managed placeholder as instructed (no fake testimonials) */}
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-[#FFF8E7] border border-[#C9A24A]/30 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#00291E]/10 text-[#00291E] flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-[#C9A24A]" />
            </div>
            <p className="font-serif text-base sm:text-lg text-[#00291E] italic">
              {cp.testimonialsEmptyNotice}
            </p>
            <p className="text-xs text-[#26342D]/60 mt-3 font-light">
              {cp.testimonialsSubNotice}
            </p>
          </div>
        </div>
      </section>

      {/* 14. REGISTRATION / CHANNEL PARTNER ENQUIRY FORM */}
      <section id="partner-register" className="py-20 sm:py-24 bg-[#001D15] text-white relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Direct Call & Context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                START COLLABORATING TODAY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F8F0D8] font-normal leading-tight">
                Join the Velora Channel Partner Network
              </h2>
              <div className="w-16 h-[2px] bg-[#C9A24A] my-4" />

              <p className="text-sm text-white/80 font-light leading-relaxed">
                Fill out the application form with your details. Our Partner Desk will review your application and provide you with our complete project kits, pricing structures, and partner agreements.
              </p>

              {/* Direct Partner Desk Contact Cards */}
              <div className="space-y-4 pt-2">
                <a
                  href={`tel:${deskPhone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#00291E] border border-white/10 hover:border-[#C9A24A] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#001D15] text-[#C9A24A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#C9A24A] block">
                      Direct Partner Desk Call
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-[#DDB75C]">
                      +91 {deskPhone}
                    </span>
                  </div>
                </a>

                <a
                  href={`https://wa.me/91${deskWhatsApp}?text=Hi%20Velora%20Developers%2C%20I%20would%20like%20to%20register%20as%20a%20Channel%20Partner.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#00291E] border border-white/10 hover:border-[#25D366] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#001D15] text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#25D366] block">
                      Instant WhatsApp Enquiry
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-[#25D366]">
                      Chat with Channel Partner Manager
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${deskEmail}?subject=Channel%20Partner%20Enquiry%20-%20Velora%20Developers`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#00291E] border border-white/10 hover:border-[#C9A24A] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#001D15] text-[#C9A24A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#C9A24A] block">
                      Official Partner Correspondence
                    </span>
                    <span className="text-xs font-medium text-white/90 break-all group-hover:text-[#DDB75C]">
                      {deskEmail}
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column: High-Conversion Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#00291E] p-8 sm:p-10 rounded-2xl border border-[#C9A24A]/40 shadow-2xl relative">
                {submitted ? (
                  <div className="text-center py-12 px-4 space-y-5 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-[#C9A24A]/20 border-2 border-[#C9A24A] text-[#C9A24A] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl text-white font-medium">
                      Thank You for Registering!
                    </h3>
                    <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                      We have received your partner application. Our dedicated Channel Partner Manager will connect with you shortly with project kits, sales collateral, and commission details.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a
                        href={`https://wa.me/91${deskWhatsApp}?text=Hi%20Velora%20Developers%2C%20I%20just%20submitted%20my%20Channel%20Partner%20application.`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded shadow hover:brightness-105 transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Connect on WhatsApp Now</span>
                      </a>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFullName('');
                          setPhone('');
                          setEmail('');
                          setReraNumber('');
                          setMessage('');
                        }}
                        className="text-xs text-[#C9A24A] hover:underline"
                      >
                        Submit another enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block mb-1">
                        {cp.formBadge}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-4">
                        {cp.formHeading}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-white/80 font-medium mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition-colors"
                        />
                      </div>

                      {/* Agency Name */}
                      <div>
                        <label className="block text-white/80 font-medium mb-1">
                          Agency / Firm Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="e.g. Landmark Properties"
                          className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Mobile Number */}
                      <div>
                        <label className="block text-white/80 font-medium mb-1">
                          Mobile Number *
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-lg bg-[#001D15] border border-r-0 border-white/20 text-white/60 text-xs">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit mobile number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="98765 43210"
                            className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-r-lg px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-white/80 font-medium mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="rajesh@example.com"
                          className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Primary Operating Market */}
                      <div>
                        <label className="block text-white/80 font-medium mb-1">
                          Primary Operating Market *
                        </label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3.5 py-2.5 text-white outline-none transition-colors"
                        >
                          <option value="Mumbai">Mumbai</option>
                          <option value="Navi Mumbai">Navi Mumbai</option>
                          <option value="Thane">Thane</option>
                          <option value="Pune">Pune</option>
                          <option value="Konkan (Raigad / Ratnagiri)">Konkan (Raigad / Ratnagiri)</option>
                          <option value="Other">Other City</option>
                        </select>
                        {city === 'Other' && (
                          <input
                            type="text"
                            placeholder="Specify your city / territory"
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            className="mt-2 w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3 py-2 text-white placeholder-white/30 outline-none text-xs"
                          />
                        )}
                      </div>

                      {/* Partner Category */}
                      <div>
                        <label className="block text-white/80 font-medium mb-1">
                          Profession / Partner Category *
                        </label>
                        <select
                          value={partnerType}
                          onChange={(e) => setPartnerType(e.target.value)}
                          className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3.5 py-2.5 text-white outline-none transition-colors"
                        >
                          <option value="Real Estate Broker">Real Estate Broker</option>
                          <option value="Property Consultant">Property Consultant</option>
                          <option value="Independent Real Estate Agent">Independent Agent</option>
                          <option value="Freelance Property Advisor">Freelance Property Advisor</option>
                          <option value="Referral Partner">Referral Partner</option>
                          <option value="Local Network Professional">Local Network Professional</option>
                          <option value="Marketing Professional">Marketing Professional</option>
                          <option value="Other">Other</option>
                        </select>
                        {partnerType === 'Other' && (
                          <input
                            type="text"
                            placeholder="Specify your profession"
                            value={customPartnerType}
                            onChange={(e) => setCustomPartnerType(e.target.value)}
                            className="mt-2 w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3 py-2 text-white placeholder-white/30 outline-none text-xs"
                          />
                        )}
                      </div>
                    </div>

                    {/* MahaRERA Registration No. (Optional) */}
                    <div>
                      <label className="block text-white/80 font-medium mb-1">
                        MahaRERA Registration Number (Optional / If applicable)
                      </label>
                      <input
                        type="text"
                        value={reraNumber}
                        onChange={(e) => setReraNumber(e.target.value)}
                        placeholder="e.g. A52800012345"
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3.5 py-2.5 text-white placeholder-white/30 outline-none transition-colors"
                      />
                    </div>

                    {/* Message / Remarks */}
                    <div>
                      <label className="block text-white/80 font-medium mb-1">
                        Message / Client Interests (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your client focus, past transactions, or specific projects you are interested in..."
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded-lg px-3.5 py-2 text-white placeholder-white/30 outline-none transition-colors"
                      />
                    </div>

                    {/* Preferred Contact Mode */}
                    <div className="flex items-center gap-6 pt-1">
                      <span className="text-white/80 font-medium">Preferred Contact:</span>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-white/90">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="WhatsApp"
                          checked={preferredContact === 'WhatsApp'}
                          onChange={() => setPreferredContact('WhatsApp')}
                          className="accent-[#C9A24A]"
                        />
                        <span>WhatsApp</span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer text-white/90">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="Call"
                          checked={preferredContact === 'Call'}
                          onChange={() => setPreferredContact('Call')}
                          className="accent-[#C9A24A]"
                        />
                        <span>Phone Call</span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-bold text-xs sm:text-sm tracking-wider uppercase py-4 rounded-lg shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-[#00291E]" />
                        <span>{isSubmitting ? 'Submitting Application...' : 'JOIN AS CHANNEL PARTNER'}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-white/50 text-center leading-normal pt-1">
                      Your details are private and securely tagged with Velora Developers. No spam.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ SECTION */}
      <section className="py-20 sm:py-24 bg-[#FFF8E7]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              {cp.faqsBadge}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal mt-2">
              {cp.faqsHeading}
            </h2>
            <p className="mt-3 text-sm text-[#26342D]/80 font-light leading-relaxed">
              {cp.faqsDescription}
            </p>
            <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-4" />
          </div>

          <div className="space-y-3.5">
            {cp.faqsList.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.id || idx}
                  className="rounded-xl border border-[#C9A24A]/30 bg-[#F8F0D8] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-white/60 transition-colors"
                  >
                    <span className="font-serif text-base text-[#00291E] font-semibold flex items-center gap-2">
                      <span className="text-xs text-[#C9A24A] font-sans font-bold">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      {item.question}
                    </span>
                    <span className="text-[#C9A24A] shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#26342D]/85 leading-relaxed font-light border-t border-[#C9A24A]/15 bg-white/50 animate-fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Help Note */}
          <div className="mt-12 p-6 rounded-xl bg-[#00291E] text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-serif text-base text-[#F8F0D8]">Have Additional Questions?</h4>
              <p className="text-xs text-white/70 font-light mt-0.5">
                Our Channel Partner Relations Desk is available from 10:00 AM to 7:00 PM (Mon-Sat).
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`tel:${deskPhone}`}
                className="bg-[#C9A24A] text-[#00291E] px-4 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#DDB75C] transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/91${deskWhatsApp}?text=Hi%20Velora%20Developers%2C%20I%20have%20a%20question%20regarding%20the%20Channel%20Partner%20program.`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white px-4 py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
