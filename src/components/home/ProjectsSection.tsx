import React from 'react';
import { ArrowRight, Trees } from 'lucide-react';
import { useStore } from '../../hooks/useStore';

interface ProjectsSectionProps {
  onSelectProject: (slug: string) => void;
  onViewAll: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onSelectProject,
  onViewAll,
}) => {
  const { projects } = useStore();

  return (
    <section id="projects" className="bg-[#F8F0D8] py-20 lg:py-24 border-b border-[#C9A24A]/20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal tracking-tight">
              Our <span className="text-[#0B4A36]">Projects</span>
            </h2>
            <p className="mt-2 text-sm text-[#26342D]/80 max-w-lg font-light leading-relaxed">
              Explore Velora's carefully planned developments, created for modern lifestyles and long-term value.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00291E] hover:text-[#C9A24A] transition-colors group self-start md:self-end"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#C9A24A]" />
          </button>
        </div>

        {/* Two Large Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#FFF8E7] rounded-lg overflow-hidden border border-[#C9A24A]/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group"
            >
              {/* Project Card Image */}
              <div className="sm:w-1/2 h-64 sm:h-auto relative overflow-hidden shrink-0">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
              </div>

              {/* Project Card Content */}
              <div className="p-6 sm:p-7 flex flex-col justify-between sm:w-1/2">
                <div>
                  {/* Decorative Leaf Icon */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 flex items-center justify-center text-[#0B4A36]">
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current">
                        <path
                          d="M12 2L15 8C19 9 21 13 19 17C17 21 12 22 12 22C12 22 7 21 5 17C3 13 5 9 9 8L12 2Z"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M12 2V22" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Title & Category */}
                  <h3 className="font-serif text-2xl font-normal text-[#00291E] tracking-wide">
                    {project.name}
                  </h3>
                  <p className="text-[11px] font-medium tracking-wide text-[#0B4A36] uppercase mt-1">
                    {project.category}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[#26342D]/80 leading-relaxed mt-4 font-light">
                    {project.shortDescription}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-4 border-t border-[#C9A24A]/20">
                  <button
                    onClick={() => onSelectProject(project.slug)}
                    className="w-full bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-medium text-xs tracking-wider uppercase py-2.5 px-4 rounded shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{project.ctaText || `Explore ${project.name} →`}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
