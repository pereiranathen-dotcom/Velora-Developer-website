import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, content } = useStore();
  const activeTestimonials = testimonials.filter((t) => t.active);
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  // Reorder testimonials so that 3 cards are displayed starting at startIndex
  const visibleCards = [];
  for (let i = 0; i < Math.min(3, activeTestimonials.length); i++) {
    const idx = (startIndex + i) % activeTestimonials.length;
    visibleCards.push(activeTestimonials[idx]);
  }

  return (
    <section className="bg-[#F8F0D8] py-20 lg:py-24 border-b border-[#C9A24A]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row with arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal tracking-tight">
                {content.testimonialsHeading || 'What Our Customers Say'}
              </h2>
              <span className="w-12 h-[2px] bg-[#C9A24A] shrink-0" />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#26342D]/75 font-light leading-relaxed">
              {content.testimonialsSubheading ||
                'Hear from people who have visited our projects and experienced the difference.'}
            </p>
          </div>

          {/* Carousel Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full border border-[#C9A24A]/50 bg-[#FFF8E7] hover:bg-[#C9A24A] hover:text-[#00291E] text-[#00291E] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full border border-[#C9A24A]/50 bg-[#FFF8E7] hover:bg-[#C9A24A] hover:text-[#00291E] text-[#00291E] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleCards.map((test) => (
            <div
              key={test.id}
              className="bg-[#FFF8E7] rounded-lg p-7 border border-[#C9A24A]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                {/* Gold Quotes Icon */}
                <div className="text-[#C9A24A] mb-3">
                  <span className="font-serif text-3xl font-bold leading-none select-none">
                    ““
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-[13px] text-[#26342D]/85 leading-relaxed font-light italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Customer Name */}
              <div className="mt-6 pt-4 border-t border-[#C9A24A]/15 flex items-center justify-between text-xs">
                <span className="font-medium text-[#00291E]">
                  — {test.customerName}
                </span>
                <span className="text-[11px] text-[#0B4A36] font-medium">
                  {test.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
