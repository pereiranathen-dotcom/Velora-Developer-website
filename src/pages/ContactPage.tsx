import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { StoreService } from '../services/store';

export const ContactPage: React.FC = () => {
  const { settings, projects } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState(projects[0]?.name || 'Amrutvan');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    StoreService.addLead({
      name,
      phone,
      email,
      project,
      preferredContact: 'Call',
      message,
      status: 'New',
      source: 'Website Form',
    });

    setSubmitted(true);
  };

  return (
    <main className="w-full bg-[#FFF8E7] pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
            GET IN TOUCH
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#00291E] font-normal mt-2">
            Contact Velora Developers
          </h1>
          <p className="mt-3 text-sm text-[#26342D]/80 font-light leading-relaxed">
            Our property advisors are ready to answer your questions regarding plot availability, payment plans, site visits, and registry processes.
          </p>
          <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8F0D8] p-7 rounded-xl border border-[#C9A24A]/30 shadow-md">
              <h3 className="font-serif text-xl text-[#00291E] font-medium mb-6">
                Official Inquiries
              </h3>

              <div className="space-y-5 text-xs text-[#26342D]">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#00291E] text-[#C9A24A] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[#0B4A36] block">
                      Direct Telephone
                    </span>
                    <a href={`tel:${settings.phone}`} className="text-sm font-bold text-[#00291E] hover:text-[#C9A24A]">
                      +91 {settings.phone}
                    </a>
                    {settings.phoneAlt && (
                      <p className="text-[11px] text-[#26342D]/70 mt-0.5">{settings.phoneAlt}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#00291E] text-[#C9A24A] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[#0B4A36] block">
                      Email Address
                    </span>
                    <a href={`mailto:${settings.email}`} className="text-sm text-[#00291E] hover:text-[#C9A24A] break-all">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#00291E] text-[#C9A24A] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[#0B4A36] block">
                      WhatsApp Concierge
                    </span>
                    <a
                      href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Velora%20Developers`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#00291E] hover:text-[#25D366]"
                    >
                      +91 {settings.whatsapp} (Chat Now)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-2 border-t border-[#C9A24A]/20">
                  <div className="w-9 h-9 rounded-full bg-[#00291E] text-[#C9A24A] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[#0B4A36] block">
                      Site Address
                    </span>
                    <p className="text-xs text-[#26342D]/80 leading-relaxed mt-0.5">
                      {settings.siteAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded map preview */}
            <div className="rounded-xl overflow-hidden border border-[#C9A24A]/30 shadow-md h-56">
              <iframe
                title="Mandangad Site Location"
                src="https://maps.google.com/maps?q=Mandangad,Ratnagiri,Maharashtra&t=&z=12&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#00291E] text-white p-8 sm:p-10 rounded-xl border border-[#C9A24A]/30 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-14 h-14 text-[#C9A24A] mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-[#F8F0D8]">Enquiry Sent!</h3>
                <p className="text-xs text-white/80 mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you, {name}. Our property advisor will reach out to you within a few hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 bg-[#C9A24A] text-[#00291E] font-medium text-xs uppercase px-6 py-2.5 rounded"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                  SEND AN INQUIRY
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1 mb-6">
                  Tell Us About Your Requirement
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/80 mb-1 font-medium">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white placeholder-white/40 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-medium">Mobile Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white placeholder-white/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-medium">Email Address</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white placeholder-white/40 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-medium">Project of Interest</label>
                    <select
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white outline-none"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.location ? p.location.split(',')[0] : 'Ratnagiri'})
                        </option>
                      ))}
                      <option value="General Consultation">General Plotted Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-medium">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Any specific plot size, budget, or visiting availability..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white placeholder-white/40 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-semibold text-xs tracking-wider uppercase py-3.5 rounded shadow-lg hover:brightness-105 active:scale-[0.99] transition-all"
                  >
                    Submit Enquiry →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
