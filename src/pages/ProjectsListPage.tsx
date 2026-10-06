import React, { useState } from 'react';
import { ArrowRight, CheckCircle, MapPin, Download, Loader2 } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { BrochureService } from '../utils/brochureService';
import { Project } from '../types';

interface ProjectsListPageProps {
  onSelectProject: (slug: string) => void;
  onBookSiteVisit: () => void;
}

export const ProjectsListPage: React.FC<ProjectsListPageProps> = ({
  onSelectProject,
  onBookSiteVisit,
}) => {
  const { projects } = useStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (project: Project) => {
    setDownloadingId(project.id);
    try {
      await BrochureService.downloadProjectBrochure(project);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <main className="w-full bg-[#FFF8E7] pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A24A]">
            PORTFOLIO
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#00291E] font-normal mt-2">
            Velora Developments
          </h1>
          <p className="mt-4 text-sm text-[#26342D]/80 font-light leading-relaxed">
            Carefully curated, nature-embracing plotted communities planned with top-tier connectivity, legal clarity, and enduring value.
          </p>
          <div className="w-16 h-[2px] bg-[#C9A24A] mx-auto mt-4" />
        </div>

        {/* Project Cards */}
        <div className="space-y-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#F8F0D8] rounded-xl overflow-hidden border border-[#C9A24A]/30 shadow-lg hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Image side (5 cols) */}
              <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#00291E]/90 text-[#C9A24A] text-xs font-semibold px-3 py-1 rounded">
                  {project.status}
                </div>
              </div>

              {/* Content side (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#0B4A36] uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A24A]" />
                    <span>{project.location}</span>
                  </div>

                  <h2 className="font-serif text-3xl text-[#00291E] font-normal">
                    {project.name}
                  </h2>
                  <p className="font-serif text-sm text-[#0B4A36] italic mt-0.5">
                    "{project.tagline}"
                  </p>

                  <p className="mt-4 text-xs sm:text-sm text-[#26342D]/80 leading-relaxed font-light">
                    {project.shortDescription}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {project.keyHighlights.slice(0, 4).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[#00291E]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#C9A24A] shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-[#C9A24A]/20 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onSelectProject(project.slug)}
                    className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-medium text-xs tracking-wider uppercase px-6 py-2.5 rounded shadow transition-all flex items-center gap-2"
                  >
                    <span>View Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDownload(project)}
                    disabled={downloadingId === project.id}
                    className="border border-[#00291E] hover:bg-[#00291E] hover:text-white text-[#00291E] font-medium text-xs tracking-wider uppercase px-5 py-2.5 rounded transition-all flex items-center gap-1.5"
                    title="Download Official Project Brochure"
                  >
                    {downloadingId === project.id ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#C9A24A] animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5 text-[#C9A24A]" />
                    )}
                    <span>Brochure (PDF)</span>
                  </button>

                  <button
                    onClick={onBookSiteVisit}
                    className="text-[#00291E]/70 hover:text-[#00291E] font-medium text-xs tracking-wider uppercase px-3 py-2.5 transition-all"
                  >
                    Book Site Visit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
