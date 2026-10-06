import React, { useState } from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { GalleryItem } from '../../types';
import { Lightbox } from '../common/Lightbox';

interface GallerySectionProps {
  onViewAllGallery: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  onViewAllGallery,
}) => {
  const { gallery, content } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<'project' | 'location' | 'lifestyle'>('project');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  // Filter gallery items by selected category or default project items
  const filteredItems = gallery.filter((item) => {
    if (!item.active) return false;
    return item.category === selectedCategory;
  });

  // Display top 5 items for the homepage strip as in screenshot
  const displayItems = (filteredItems.length > 0 ? filteredItems : gallery.filter((i) => i.active)).slice(0, 5);

  return (
    <section id="gallery" className="bg-[#FFF8E7] py-20 lg:py-24 border-b border-[#C9A24A]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal tracking-tight">
              {content.galleryHeading || 'Gallery'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#C9A24A] tracking-wider uppercase">
              {content.gallerySubheading || 'See the Vision. Experience the Space.'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filter Tabs matching screenshot */}
            <div className="flex items-center bg-[#F8F0D8] p-1 rounded-md border border-[#C9A24A]/30">
              {(['project', 'location', 'lifestyle'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-medium uppercase tracking-wider px-4 py-1.5 rounded transition-all capitalize ${
                    selectedCategory === cat
                      ? 'bg-[#003D2B] text-white shadow-sm'
                      : 'text-[#26342D]/70 hover:text-[#00291E]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Full Gallery Link */}
            <button
              onClick={onViewAllGallery}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00291E] hover:text-[#C9A24A] transition-colors group"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#C9A24A]" />
            </button>
          </div>
        </div>

        {/* 5-Image Horizontal Strip matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="relative aspect-[4/3] rounded-md overflow-hidden bg-[#00291E] shadow-sm hover:shadow-xl cursor-pointer group border border-[#C9A24A]/25"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#00291E]/30 group-hover:bg-transparent transition-colors" />

              {/* Hover overlay indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="w-8 h-8 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Subtle title bar on bottom */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-medium truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View Full Gallery Button */}
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={onViewAllGallery}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00291E] hover:text-[#C9A24A]"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A24A]" />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        item={activeLightboxItem}
        items={displayItems}
        onClose={() => setActiveLightboxItem(null)}
        onNavigate={(newItem) => setActiveLightboxItem(newItem)}
      />
    </section>
  );
};
