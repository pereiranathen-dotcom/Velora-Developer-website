import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, content } = useStore();

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-[#C9A24A]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <button
              onClick={() => handleLinkClick('/')}
              className="text-left mb-4 focus:outline-none hover:opacity-95"
            >
              <Logo variant="light" size="md" showTagline={true} />
            </button>
            <p className="text-xs text-white/60 leading-relaxed max-w-xs mt-2">
              Turning Land Into Landmarks. Delivering visionary, nature-inspired plotted developments with clear titles and long-term appreciation in Konkan Maharashtra.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#C9A24A] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <button
                  onClick={() => handleLinkClick('/')}
                  className="hover:text-[#DDB75C] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/about')}
                  className="hover:text-[#DDB75C] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/projects')}
                  className="hover:text-[#DDB75C] transition-colors"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/gallery')}
                  className="hover:text-[#DDB75C] transition-colors"
                >
                  Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/channel-partner')}
                  className="hover:text-[#DDB75C] text-[#C9A24A] font-medium transition-colors"
                >
                  Channel Partner
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/contact')}
                  className="hover:text-[#DDB75C] transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Us */}
          <div className="lg:col-span-1">
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#C9A24A] mb-4">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-white/70">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2.5 hover:text-[#DDB75C] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A24A] shrink-0" />
                <span>+91 {settings.phone}</span>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 hover:text-[#DDB75C] transition-colors break-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#C9A24A] shrink-0" />
                <span>{settings.email}</span>
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A24A] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.siteAddress}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#C9A24A] mb-4">
              Follow Us
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[#00291E] hover:bg-[#C9A24A] hover:border-[#C9A24A] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[#00291E] hover:bg-[#C9A24A] hover:border-[#C9A24A] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/91${settings.whatsapp}?text=Hi%20Velora%20Developers`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-[#00291E] hover:bg-[#25D366] hover:border-[#25D366] transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Stay updated with our latest development milestones, site photos and investment launches.
            </p>
          </div>

          {/* Col 5: RERA Information */}
          <div>
            <h4 className="font-serif text-sm tracking-wider uppercase text-[#C9A24A] mb-4">
              RERA Information
            </h4>
            <p className="text-xs text-white/60 leading-relaxed mb-4">
              {content.footerDisclaimer || 'RERA Information (As applicable for each project)'}
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-white/50">
              <span className="hover:text-white/80 transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-white/80 transition-colors cursor-pointer">
                Terms & Conditions
              </span>
              <button
                onClick={() => handleLinkClick('/admin')}
                className="text-left text-[#C9A24A]/80 hover:text-[#C9A24A] transition-colors mt-2 flex items-center gap-1 text-[11px]"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Admin CMS Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-3">
          <p>© 2026 Velora Developers. All Rights Reserved.</p>
          <p className="text-center sm:text-right">
            Designed for refined living & sustainable nature plotted development.
          </p>
        </div>
      </div>
    </footer>
  );
};
