import React from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();

  const phoneNumber = settings.whatsapp || '9322133592';
  const prefilledText = encodeURIComponent(
    'Hi Velora Developers, I would like to know more about your projects.'
  );
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${prefilledText}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#00291E]/95 hover:bg-[#003D2B] border border-[#C9A24A]/40 text-white pl-3.5 pr-2 py-2 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#C9A24A]"
        aria-label="Chat with a Property Advisor on WhatsApp"
      >
        {/* WhatsApp Icon Circle */}
        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm shrink-0">
          <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        </div>

        {/* Text Tooltip / Pill */}
        <div className="hidden sm:flex items-center gap-1.5 pr-1">
          <span className="text-xs font-medium tracking-wide">
            Chat with a Property Advisor
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C9A24A]" />
        </div>
      </a>
    </aside>
  );
};
