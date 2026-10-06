import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
  onOpenSiteVisit: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = '/',
  onNavigate,
  onOpenSiteVisit,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Why Velora', path: '/#why-velora' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Channel Partner', path: '/channel-partner' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.getElementById(elementId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(elementId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = currentPath === '/';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome
            ? 'bg-[#00291E]/95 backdrop-blur-md shadow-lg shadow-black/20 py-2.5 border-b border-[#C9A24A]/20'
            : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-4'
        }`}
        style={{ minHeight: '74px' }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center text-left hover:opacity-95 transition-opacity focus:outline-none shrink-0"
            title="Velora Developers - Turning Land Into Landmarks"
          >
            <Logo variant="light" size="sm" showTagline={true} />
          </button>

          {/* Center: Desktop Navigation - optimized size & spacing */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.path)}
                  className={`text-[12.5px] xl:text-[13px] font-medium tracking-wider uppercase transition-colors relative py-1.5 px-0.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#C9A24A]'
                      : 'text-white/90 hover:text-[#DDB75C]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C9A24A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Gold CTA Button (Admin button removed - kept in Footer only) */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={onOpenSiteVisit}
              className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.98] text-[#00291E] font-medium text-xs lg:text-[13px] tracking-wide px-4.5 py-2.5 lg:px-5 rounded shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Book a Site Visit</span>
              <ArrowRight className="w-4 h-4 text-[#00291E]" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenSiteVisit}
              className="bg-[#C9A24A] text-[#00291E] font-medium text-xs px-3 py-1.5 rounded"
            >
              Visit →
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#00291E]/98 pt-24 px-6 pb-8 flex flex-col justify-between lg:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.path)}
                className={`text-left text-lg font-serif tracking-wider py-2 border-b border-white/10 ${
                  currentPath === item.path ? 'text-[#C9A24A]' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSiteVisit();
              }}
              className="w-full bg-[#C9A24A] text-[#00291E] font-semibold py-3 rounded text-center shadow-lg"
            >
              Book a Site Visit →
            </button>
          </div>
        </div>
      )}
    </>
  );
};
