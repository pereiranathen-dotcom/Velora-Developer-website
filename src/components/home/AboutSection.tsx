import React from 'react';
import { ArrowRight, MapPin, Settings, TrendingUp } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { ASSETS } from '../../data/initialData';

interface AboutSectionProps {
  onKnowMore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onKnowMore }) => {
  const { content } = useStore();

  return (
    <section id="about" className="bg-[#FFF8E7] py-20 lg:py-24 border-b border-[#C9A24A]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (5 Cols) */}
          <div className="lg:col-span-5 pr-0 lg:pr-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
                {content.aboutLabel || 'ABOUT VELORA'}
              </span>
              <span className="w-10 h-[1px] bg-[#C9A24A]" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal leading-tight">
              {content.aboutHeading || 'More Than Development. We Create Possibilities.'}
            </h2>

            <p className="mt-6 text-sm text-[#26342D]/85 leading-relaxed font-light">
              {content.aboutPara1 ||
                'Velora Developers is committed to creating thoughtfully planned real-estate developments that bring together location, accessibility, quality and long-term value.'}
            </p>

            <p className="mt-4 text-sm text-[#26342D]/85 leading-relaxed font-light">
              {content.aboutPara2 ||
                'Our approach goes beyond simply developing property. We focus on creating spaces that people can confidently invest in, build upon and make part of their future.'}
            </p>

            <div className="mt-8">
              <button
                onClick={onKnowMore}
                className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-medium text-xs tracking-wider uppercase px-6 py-3 rounded shadow transition-all flex items-center gap-2"
              >
                <span>{content.aboutButtonText || 'Know More About Us →'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Lifestyle Image with Floating Dark Card (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl aspect-[16/10] bg-[#00291E]">
              <img
                src={content.aboutImage || ASSETS.familySunset}
                alt={content.aboutImageCaption || "Velora Developers Lifestyle and Vision"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Floating Information Card matching screenshot */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 bg-[#00291E]/95 backdrop-blur-md border border-[#C9A24A]/30 p-6 rounded-lg text-white shadow-2xl max-w-sm">
              <div className="space-y-5 text-left">
                {/* Item 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#C9A24A]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      Strategic Locations
                    </h4>
                    <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                      Properties selected with connectivity and future potential in mind.
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Settings className="w-4 h-4 text-[#C9A24A]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      Thoughtful Planning
                    </h4>
                    <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                      Development designed around usability, accessibility and the environment.
                    </p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#C9A24A]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-[#C9A24A]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      Long-Term Vision
                    </h4>
                    <p className="text-[11px] text-white/70 mt-0.5 leading-snug">
                      Creating opportunities designed to remain valuable for years to come.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
