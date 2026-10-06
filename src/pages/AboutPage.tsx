import React from 'react';
import { Logo } from '../components/common/Logo';
import { ShieldCheck, Heart, Sparkles, Compass, CheckCircle } from 'lucide-react';
import { ASSETS } from '../data/initialData';

interface AboutPageProps {
  onBookSiteVisit: () => void;
  onExploreProjects: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBookSiteVisit,
  onExploreProjects,
}) => {
  return (
    <main className="w-full bg-[#FFF8E7] pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
            OUR STORY & VALUES
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#00291E] font-normal mt-2">
            Turning Land Into Landmarks
          </h1>
          <p className="mt-4 text-sm text-[#26342D]/85 font-light leading-relaxed">
            At Velora Developers, we believe that land is not just a commercial asset—it is the foundation of family legacies, wellness, and mindful future living.
          </p>
          <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-4" />
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-5 text-sm text-[#26342D]/85 leading-relaxed font-light">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#00291E] font-normal">
              More Than Development. We Create Possibilities.
            </h2>
            <p>
              Founded with an uncompromising focus on integrity and architectural stewardship, Velora Developers focuses on acquiring and master-planning pristine parcels across Maharashtra's most promising green corridors, specifically the scenic Sahyadri-Konkan belt of Ratnagiri and Mandangad.
            </p>
            <p>
              Every layout we present undergoes meticulous title due diligence, Collector NA sanctioning, and comprehensive infrastructural implementation—from 30ft asphalt roads to underground electricity and abundant water reserves.
            </p>
            <p>
              We pride ourselves on 100% transparent documentation, providing separate 7/12 extracts for every individual plot and clear demarcation before purchase.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden shadow-2xl aspect-[16/11]">
              <img
                src={ASSETS.familySunset}
                alt="Velora Developers Vision and Family"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Commitment matching Brochure Page 8 */}
        <div className="bg-[#00291E] text-white rounded-xl p-8 sm:p-12 mb-16 shadow-xl border border-[#C9A24A]/30">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
              OUR COMMITMENT
            </span>
            <h3 className="font-serif text-3xl text-white font-normal mt-1">
              The Four Pillars of Velora
            </h3>
            <p className="text-xs text-white/70 mt-2 font-light">
              Delivering value that lasts for generations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#001D15] p-6 rounded-lg border border-[#C9A24A]/25 text-center">
              <div className="w-12 h-12 rounded-full bg-[#C9A24A]/20 text-[#C9A24A] flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg text-white font-medium mb-1">Trust</h4>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Clear titles, government approvals, and absolute integrity in every transaction.
              </p>
            </div>

            <div className="bg-[#001D15] p-6 rounded-lg border border-[#C9A24A]/25 text-center">
              <div className="w-12 h-12 rounded-full bg-[#C9A24A]/20 text-[#C9A24A] flex items-center justify-center mx-auto mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg text-white font-medium mb-1">Transparency</h4>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Open communication, straightforward pricing, and complete legal documentation upfront.
              </p>
            </div>

            <div className="bg-[#001D15] p-6 rounded-lg border border-[#C9A24A]/25 text-center">
              <div className="w-12 h-12 rounded-full bg-[#C9A24A]/20 text-[#C9A24A] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg text-white font-medium mb-1">Quality</h4>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Premium infrastructure, robust engineering, and meticulously landscaped spaces.
              </p>
            </div>

            <div className="bg-[#001D15] p-6 rounded-lg border border-[#C9A24A]/25 text-center">
              <div className="w-12 h-12 rounded-full bg-[#C9A24A]/20 text-[#C9A24A] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg text-white font-medium mb-1">Commitment</h4>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Dedicated client guidance from your initial enquiry through registry and future possession.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={onBookSiteVisit}
            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded shadow-lg transition-all"
          >
            Plan Your Visit to Mandangad →
          </button>
        </div>
      </div>
    </main>
  );
};
