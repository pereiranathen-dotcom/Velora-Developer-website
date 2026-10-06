import React, { useState } from 'react';
import {
  MapPin,
  Building2,
  Navigation,
  Factory,
  ArrowRight,
  TrendingUp,
  Heart,
  X,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ASSETS } from '../../data/initialData';

export const LocationSection: React.FC = () => {
  const { locations, content, settings } = useStore();
  const [mapModalOpen, setMapModalOpen] = useState(false);

  const getMilestoneIcon = (icon: string) => {
    switch (icon) {
      case 'map-pin':
        return <MapPin className="w-4 h-4 text-[#C9A24A]" />;
      case 'building':
        return <Building2 className="w-4 h-4 text-[#C9A24A]" />;
      case 'highway':
        return <Navigation className="w-4 h-4 text-[#C9A24A]" />;
      case 'factory':
        return <Factory className="w-4 h-4 text-[#C9A24A]" />;
      default:
        return <MapPin className="w-4 h-4 text-[#C9A24A]" />;
    }
  };

  return (
    <section className="bg-[#F8F0D8] py-20 lg:py-24 border-b border-[#C9A24A]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Location Details (5 Cols) */}
          <div className="lg:col-span-5 pr-0 lg:pr-6">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal tracking-tight">
                {content.locationHeading || 'Strategic Location'}
              </h2>
              <span className="w-12 h-[2px] bg-[#C9A24A] shrink-0" />
            </div>

            <p className="text-sm font-medium text-[#C9A24A] mb-8 tracking-wide uppercase">
              {content.locationSubheading || 'Well Connected. Well Positioned.'}
            </p>

            {/* Location Distances List */}
            <div className="space-y-4 mb-8">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-3.5 p-3 rounded-lg bg-[#FFF8E7] border border-[#C9A24A]/25 shadow-sm hover:border-[#C9A24A] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00291E] flex items-center justify-center shrink-0">
                    {getMilestoneIcon(loc.icon)}
                  </div>
                  <div className="flex items-center justify-between w-full text-xs sm:text-sm font-medium text-[#00291E]">
                    <span>{loc.name}</span>
                    <span className="text-[#0B4A36] font-bold">
                      — {loc.distance}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Map CTA */}
            <div>
              <button
                onClick={() => setMapModalOpen(true)}
                className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-medium text-xs tracking-wider uppercase px-6 py-3 rounded shadow transition-all flex items-center gap-2"
              >
                <span>View Location on Map →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Scenic Winding Mountain Road with Dark Overlay (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl aspect-[16/10] bg-[#00291E] group">
              <img
                src={content.locationImage || ASSETS.scenicRoad}
                alt={content.locationImageAlt || "Scenic winding mountain highway during sunset with white car driving to Mandangad Ratnagiri"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent" />
            </div>

            {/* Dark Forest Green Overlay Box matching screenshot */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 bg-[#00291E]/95 backdrop-blur-md border border-[#C9A24A]/30 p-6 rounded-lg text-white shadow-2xl max-w-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0">
                  <Navigation className="w-3.5 h-3.5 text-[#C9A24A]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Easy Connectivity
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C9A24A]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  Growth Potential
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5 text-[#C9A24A]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                  A Brighter Tomorrow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps Modal */}
      {mapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-[#00291E] border border-[#C9A24A]/40 rounded-lg overflow-hidden shadow-2xl text-white">
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#001D15]">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C9A24A]" />
                <h3 className="font-serif text-lg text-[#F8F0D8]">
                  Amrutvan & Mandangad Connectivity Map
                </h3>
              </div>
              <button
                onClick={() => setMapModalOpen(false)}
                className="text-white/70 hover:text-white p-1.5"
                aria-label="Close Map"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-[450px] bg-slate-900 relative">
              <iframe
                title="Mandangad Ratnagiri Map Location"
                src="https://maps.google.com/maps?q=Mandangad,Ratnagiri,Maharashtra&t=&z=11&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="p-4 bg-[#001D15] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-white/70">
                Direct highway access on Pandharpur Highway, 2 km from Mandangad town center.
              </span>
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#C9A24A] hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
