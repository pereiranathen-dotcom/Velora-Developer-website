import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { GalleryItem } from '../types';
import { Lightbox } from '../components/common/Lightbox';
import { Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'project', label: 'Project' },
    { id: 'location', label: 'Location & Scenic' },
    { id: 'lifestyle', label: 'Lifestyle & Parks' },
    { id: 'amenities', label: 'Clubhouse & Games' },
    { id: 'master-plan', label: 'Master Layout' },
  ];

  const filteredItems = gallery.filter((item) => {
    if (!item.active) return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <main className="w-full bg-[#FFF8E7] pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
            VISUAL SHOWCASE
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#00291E] font-normal mt-2">
            Experience the Space
          </h1>
          <p className="mt-3 text-sm text-[#26342D]/80 font-light leading-relaxed">
            Explore authentic photographs of Amrutvan, Green Opulence, the scenic Konkan landscape, and planned community amenities.
          </p>
          <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-4" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-medium uppercase tracking-wider px-5 py-2 rounded-full transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#00291E] text-white shadow-md'
                  : 'bg-[#F8F0D8] text-[#00291E] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-[#F8F0D8] rounded-lg overflow-hidden border border-[#C9A24A]/25 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="aspect-[16/10] overflow-hidden relative bg-[#00291E]">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-[#00291E]/90 text-[#C9A24A] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                  {item.project}
                </div>
              </div>

              <div className="p-4">
                <span className="text-[10px] text-[#0B4A36] font-semibold uppercase tracking-wider block">
                  {item.category}
                </span>
                <h3 className="font-serif text-base text-[#00291E] font-medium mt-0.5">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        item={activeItem}
        items={filteredItems}
        onClose={() => setActiveItem(null)}
        onNavigate={(newItem) => setActiveItem(newItem)}
      />
    </main>
  );
};
