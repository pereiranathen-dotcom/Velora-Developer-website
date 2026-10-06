import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ProjectsSection } from '../components/home/ProjectsSection';
import { AboutSection } from '../components/home/AboutSection';
import { WhyChooseSection } from '../components/home/WhyChooseSection';
import { FeaturedProjectSection } from '../components/home/FeaturedProjectSection';
import { LocationSection } from '../components/home/LocationSection';
import { GallerySection } from '../components/home/GallerySection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LeadFormSection } from '../components/home/LeadFormSection';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenSiteVisit: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenSiteVisit,
}) => {
  const handleScrollToForm = () => {
    const el = document.getElementById('contact-form');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToProjects = () => {
    const el = document.getElementById('projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <HeroSection
        onExploreProjects={handleScrollToProjects}
        onBookSiteVisit={onOpenSiteVisit}
        onNavigate={onNavigate}
      />

      {/* 2. Our Projects */}
      <ProjectsSection
        onSelectProject={(slug) => onNavigate(`/projects/${slug}`)}
        onViewAll={() => onNavigate('/projects')}
      />

      {/* 3. About Velora */}
      <AboutSection onKnowMore={() => onNavigate('/about')} />

      {/* 4. Why Choose Velora */}
      <WhyChooseSection />

      {/* 5. Featured Project — Amrutvan */}
      <FeaturedProjectSection
        onViewProject={(slug) => onNavigate(`/projects/${slug}`)}
        onGetPrice={handleScrollToForm}
      />

      {/* 6. Strategic Location */}
      <LocationSection />

      {/* 7. Gallery */}
      <GallerySection onViewAllGallery={() => onNavigate('/gallery')} />

      {/* 8. What Our Customers Say */}
      <TestimonialsSection />

      {/* 9. Let's Find the Right Property for You (Lead Gen) */}
      <LeadFormSection />
    </main>
  );
};
