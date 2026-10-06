import React from 'react';
import {
  MapPin,
  Settings,
  FileText,
  Compass,
  User,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export const WhyChooseSection: React.FC = () => {
  const { content } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'map-pin':
        return <MapPin className="w-5 h-5 text-[#003D2B]" />;
      case 'settings':
        return <Settings className="w-5 h-5 text-[#003D2B]" />;
      case 'file-text':
        return <FileText className="w-5 h-5 text-[#003D2B]" />;
      case 'leaf':
      case 'compass':
        return <Compass className="w-5 h-5 text-[#003D2B]" />;
      case 'user':
        return <User className="w-5 h-5 text-[#003D2B]" />;
      case 'trending-up':
      default:
        return <TrendingUp className="w-5 h-5 text-[#003D2B]" />;
    }
  };

  const items = content.whyVeloraItems || [];

  return (
    <section id="why-velora" className="bg-[#F8F0D8] py-20 lg:py-24 border-b border-[#C9A24A]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal tracking-tight">
            Why <span className="text-[#0B4A36]">Choose Velora?</span>
          </h2>
          <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-3" />
        </div>

        {/* 6 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-4 lg:gap-6">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-[#FFF8E7]/80 hover:bg-[#FFF8E7] rounded-lg p-5 border border-[#C9A24A]/20 hover:border-[#C9A24A]/60 transition-all duration-300 flex flex-col items-center text-center shadow-sm hover:shadow-md group"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-full bg-[#C9A24A]/15 group-hover:bg-[#C9A24A]/30 flex items-center justify-center mb-4 transition-colors">
                {getIcon(item.icon)}
              </div>

              {/* Title */}
              <h3 className="font-serif text-sm font-semibold text-[#00291E] mb-2 tracking-wide">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] text-[#26342D]/75 leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
