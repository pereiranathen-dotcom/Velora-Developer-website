import React, { useState } from 'react';
import { CheckCircle2, Send, PhoneCall, MessageSquare } from 'lucide-react';
import { StoreService } from '../../services/store';
import { useStore } from '../../hooks/useStore';

export const LeadFormSection: React.FC = () => {
  const { content, projects } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState(projects[0]?.name || 'Amrutvan');
  const [contactMethod, setContactMethod] = useState<'Call' | 'WhatsApp'>('Call');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setLoading(true);

    StoreService.addLead({
      name,
      phone,
      email,
      project,
      preferredContact: contactMethod,
      message,
      status: 'New',
      source: 'Website Form',
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <section id="contact-form" className="relative bg-[#00291E] text-white py-20 lg:py-24 overflow-hidden">
      {/* Background image if configured */}
      {content.leadFormBackgroundImage && (
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img
            src={content.leadFormBackgroundImage}
            alt="Velora Inquiry Section"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Background leaf vignette */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#003D2B]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Subtitle (5 Cols) */}
          <div className="lg:col-span-5 pr-0 lg:pr-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-[1.2] text-balance">
              {content.leadHeading || "Let's Find the Right Property for You"}
            </h2>

            <p className="mt-6 text-sm text-white/80 leading-relaxed font-light max-w-md">
              {content.leadSubheading ||
                "Tell us what you're looking for and our property advisor will get in touch with you."}
            </p>

            <div className="mt-8 pt-8 border-t border-white/10 hidden lg:block">
              <div className="flex items-center gap-4 text-xs text-white/70">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A24A]" />
                <span>Verified Collector Approved NA Plots</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/70 mt-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A24A]" />
                <span>Immediate 7/12 Transfer & Ready Possession</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container (7 Cols) */}
          <div className="lg:col-span-7 bg-[#001D15]/80 backdrop-blur-md border border-[#C9A24A]/30 rounded-lg p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-14 h-14 text-[#C9A24A] mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-normal text-[#F8F0D8] mb-2">
                  Thank You, {name}!
                </h3>
                <p className="text-sm text-white/80 max-w-md mx-auto mb-6 leading-relaxed">
                  Our dedicated property advisor for <span className="text-[#C9A24A] font-medium">{project}</span> will contact you via {contactMethod} shortly with detailed brochures, pricing sheets, and site visit options.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setPhone('');
                    setEmail('');
                    setMessage('');
                  }}
                  className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-medium text-xs tracking-wider uppercase px-6 py-2.5 rounded"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-medium">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter your mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-1 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-medium">
                      Project Interested In *
                    </label>
                    <select
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2.5 text-white outline-none transition-colors"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.location ? p.location.split(',')[0] : 'Ratnagiri'})
                        </option>
                      ))}
                      <option value="Other / General">Other / General Plotted Enquiry</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div>
                  <label className="block text-white/80 mb-1.5 font-medium">
                    Preferred Contact Method
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="Call"
                        checked={contactMethod === 'Call'}
                        onChange={() => setContactMethod('Call')}
                        className="accent-[#C9A24A]"
                      />
                      <span className="text-white/90">Call</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="WhatsApp"
                        checked={contactMethod === 'WhatsApp'}
                        onChange={() => setContactMethod('WhatsApp')}
                        className="accent-[#C9A24A]"
                      />
                      <span className="text-white/90">WhatsApp</span>
                    </label>
                  </div>
                </div>

                {/* Message (Optional) */}
                <div>
                  <label className="block text-white/80 mb-1 font-medium">
                    Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us more about your requirement"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3.5 py-2 text-white placeholder-white/40 outline-none transition-colors resize-none"
                  />
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-medium text-xs sm:text-sm tracking-wider uppercase px-7 py-3 rounded shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-2"
                  >
                    <span>{loading ? 'Submitting...' : 'Request Project Details →'}</span>
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-white/40 leading-snug pt-1">
                  Your information will only be used to contact you regarding your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
