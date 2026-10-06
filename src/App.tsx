import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { SiteVisitModal } from './components/common/SiteVisitModal';
import { PromotionalModal } from './components/common/PromotionalModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { ChannelPartnerPage } from './pages/ChannelPartnerPage';

// Admin Pages
import { AdminLayout, AdminViewType } from './admin/AdminLayout';
import { AdminDashboardView } from './admin/views/AdminDashboardView';
import { AdminProjectsView } from './admin/views/AdminProjectsView';
import { AdminLeadsView } from './admin/views/AdminLeadsView';
import { AdminPartnerLeadsView } from './admin/views/AdminPartnerLeadsView';
import { AdminSiteVisitsView } from './admin/views/AdminSiteVisitsView';
import { AdminGalleryView } from './admin/views/AdminGalleryView';
import { AdminTestimonialsView } from './admin/views/AdminTestimonialsView';
import { AdminLocationsView } from './admin/views/AdminLocationsView';
import { AdminContentView } from './admin/views/AdminContentView';
import { AdminChannelPartnerContentView } from './admin/views/AdminChannelPartnerContentView';
import { AdminSettingsView } from './admin/views/AdminSettingsView';
import { AdminSEOView } from './admin/views/AdminSEOView';
import { AdminUsersView } from './admin/views/AdminUsersView';
import { AdminHomePagePhotosView } from './admin/views/AdminHomePagePhotosView';
import { AdminPopupView } from './admin/views/AdminPopupView';
import { AdminLoginPage } from './admin/views/AdminLoginPage';

import { useStore } from './hooks/useStore';
import { StoreService } from './services/store';

export function App() {
  const { isAdmin, seo } = useStore();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [adminView, setAdminView] = useState<AdminViewType>('dashboard');
  const [siteVisitModalOpen, setSiteVisitModalOpen] = useState(false);
  const [defaultProjectForVisit, setDefaultProjectForVisit] = useState('Amrutvan');

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync title and SEO
  useEffect(() => {
    if (seo?.metaTitle) {
      document.title = seo.metaTitle;
    }
  }, [seo]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSiteVisit = (project = 'Amrutvan') => {
    setDefaultProjectForVisit(project);
    setSiteVisitModalOpen(true);
  };

  const handleLogout = () => {
    StoreService.logoutAdmin();
    handleNavigate('/admin/login');
  };

  // Check if we are on an admin route
  const isAdminRoute = currentPath.startsWith('/admin');

  // Handle Admin routing
  if (isAdminRoute) {
    if (currentPath === '/admin/login' && !isAdmin) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => handleNavigate('/admin')}
          onNavigateHome={() => handleNavigate('/')}
        />
      );
    }

    if (!isAdmin) {
      // Redirect unauthenticated admin access to /admin/login
      return (
        <AdminLoginPage
          onLoginSuccess={() => handleNavigate('/admin')}
          onNavigateHome={() => handleNavigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentView={adminView}
        onSelectView={(view) => setAdminView(view)}
        onNavigateHome={() => handleNavigate('/')}
        onLogout={handleLogout}
      >
        {adminView === 'dashboard' && (
          <AdminDashboardView onNavigateView={(v) => setAdminView(v)} />
        )}
        {adminView === 'projects' && <AdminProjectsView />}
        {adminView === 'home-photos' && <AdminHomePagePhotosView />}
        {adminView === 'popup' && <AdminPopupView />}
        {adminView === 'gallery' && <AdminGalleryView />}
        {adminView === 'leads' && <AdminLeadsView />}
        {adminView === 'partner-leads' && <AdminPartnerLeadsView />}
        {adminView === 'site-visits' && <AdminSiteVisitsView />}
        {adminView === 'testimonials' && <AdminTestimonialsView />}
        {adminView === 'locations' && <AdminLocationsView />}
        {adminView === 'content' && (
          <AdminContentView onNavigateView={(v) => setAdminView(v)} />
        )}
        {adminView === 'channel-partner-content' && <AdminChannelPartnerContentView />}
        {adminView === 'settings' && <AdminSettingsView />}
        {adminView === 'seo' && <AdminSEOView />}
        {adminView === 'users' && <AdminUsersView />}
      </AdminLayout>
    );
  }

  // Handle Public routes
  const renderPublicPage = () => {
    if (currentPath.startsWith('/projects/')) {
      const slug = currentPath.replace('/projects/', '');
      return (
        <ProjectDetailPage
          slug={slug}
          onBack={() => handleNavigate('/projects')}
          onBookSiteVisit={() => handleOpenSiteVisit(slug === 'green-opulence' ? 'Green Opulence' : 'Amrutvan')}
        />
      );
    }

    switch (currentPath) {
      case '/projects':
        return (
          <ProjectsListPage
            onSelectProject={(slug) => handleNavigate(`/projects/${slug}`)}
            onBookSiteVisit={() => handleOpenSiteVisit('Amrutvan')}
          />
        );
      case '/about':
        return (
          <AboutPage
            onBookSiteVisit={() => handleOpenSiteVisit('Amrutvan')}
            onExploreProjects={() => handleNavigate('/projects')}
          />
        );
      case '/gallery':
        return <GalleryPage />;
      case '/channel-partner':
        return (
          <ChannelPartnerPage
            onNavigate={handleNavigate}
            onOpenSiteVisit={handleOpenSiteVisit}
          />
        );
      case '/contact':
        return <ContactPage />;
      case '/':
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenSiteVisit={() => handleOpenSiteVisit('Amrutvan')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F0D8] text-[#26342D]">
      {/* Sticky Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSiteVisit={() => handleOpenSiteVisit('Amrutvan')}
      />

      {/* Main Content View */}
      <div className="flex-1">{renderPublicPage()}</div>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Advisor button */}
      <WhatsAppButton />

      {/* Global Book a Site Visit modal */}
      <SiteVisitModal
        isOpen={siteVisitModalOpen}
        onClose={() => setSiteVisitModalOpen(false)}
        defaultProject={defaultProjectForVisit}
      />

      {/* Promotional / Announcement Welcome Popup for Visitors */}
      <PromotionalModal
        onNavigate={handleNavigate}
        onOpenSiteVisit={handleOpenSiteVisit}
      />
    </div>
  );
}

export default App;
