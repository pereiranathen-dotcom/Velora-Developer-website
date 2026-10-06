import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { StoreService } from '../../services/store';
import { useStore } from '../../hooks/useStore';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProject?: string;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  isOpen,
  onClose,
  defaultProject = 'Amrutvan',
}) => {
  const { projects } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [project, setProject] = useState(defaultProject);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultProject) {
      setProject(defaultProject);
    }
  }, [defaultProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !preferredDate) return;

    setLoading(true);
    // Save to Site Visits & Leads
    StoreService.addSiteVisit({
      customerName,
      phone,
      email,
      project,
      preferredDate,
      preferredTime,
      notes,
    });

    StoreService.addLead({
      name: customerName,
      phone,
      email,
      project,
      preferredContact: 'Call',
      message: `Site visit requested for ${preferredDate} at ${preferredTime}. Notes: ${notes || 'None'}`,
      status: 'Site Visit',
      source: 'Website Form',
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  const handleReset = () => {
    setSubmitted(false);
    setCustomerName('');
    setPhone('');
    setEmail('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#00291E] border border-[#C9A24A]/40 rounded-lg shadow-2xl p-6 sm:p-8 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-14 h-14 text-[#C9A24A] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-normal text-[#F8F0D8] mb-2">
              Site Visit Scheduled
            </h3>
            <p className="text-sm text-white/80 max-w-md mx-auto mb-6 leading-relaxed">
              Thank you, <span className="text-[#C9A24A] font-medium">{customerName}</span>. Your site visit request for <span className="text-[#C9A24A] font-medium">{project}</span> on {preferredDate} at {preferredTime} has been recorded. Our property advisor will call you to confirm directions and travel assistance.
            </p>
            <button
              onClick={handleReset}
              className="bg-[#C9A24A] text-[#00291E] font-medium text-xs tracking-wider uppercase px-6 py-2.5 rounded shadow hover:brightness-105"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-[#C9A24A] text-xs font-semibold uppercase tracking-widest mb-1.5">
              <Calendar className="w-4 h-4" />
              <span>Exclusive Invitation</span>
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#F8F0D8] mb-1">
              Book a Site Visit
            </h3>
            <p className="text-xs text-white/70 mb-6 leading-relaxed">
              Experience the lush green valley and pristine planned plots in person. We provide guided walkthroughs of Amrutvan and Green Opulence.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 mb-1 font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2.5 text-white placeholder-white/40 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-1 font-medium">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2.5 text-white placeholder-white/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2.5 text-white placeholder-white/40 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">
                  Select Project *
                </label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2.5 text-white outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.location ? p.location.split(',')[0] : 'Ratnagiri'})
                    </option>
                  ))}
                  <option value="Both Projects">Both Amrutvan & Green Opulence</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-1 font-medium">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-1 font-medium">
                    Preferred Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2.5 text-white outline-none"
                  >
                    <option value="10:00 AM">Morning (10:00 AM)</option>
                    <option value="11:30 AM">Late Morning (11:30 AM)</option>
                    <option value="02:00 PM">Afternoon (02:00 PM)</option>
                    <option value="04:30 PM">Sunset / Evening (04:30 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">
                  Special Notes / Traveling from
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traveling from Mumbai with family of 3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white placeholder-white/40 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] text-[#00291E] font-semibold text-xs tracking-wider uppercase py-3 rounded shadow hover:brightness-105 active:scale-[0.99] transition-all"
                >
                  {loading ? 'Submitting...' : 'Confirm Site Visit Request →'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
