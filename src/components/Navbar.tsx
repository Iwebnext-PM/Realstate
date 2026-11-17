import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export const Navbar: React.FC = () => {
  const { generalConfig, navigationConfig } = useSite();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const visibleLinks = navigationConfig.links.filter((l) => l.visible).slice(0, 6);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E2E6EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B1D33]"
        >
          {generalConfig.logoImageUrl ? (
            <img
              src={generalConfig.logoImageUrl}
              alt={generalConfig.businessName}
              referrerPolicy="no-referrer"
              className="h-8 w-auto object-contain"
            />
          ) : null}
          <span
            className="font-display text-xl sm:text-2xl font-semibold tracking-tight whitespace-nowrap shrink-0"
            style={{ color: generalConfig.primaryColor || '#0B1D33' }}
          >
            {generalConfig.logoText || generalConfig.businessName}
          </span>
        </Link>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7"
        >
          {visibleLinks.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path + item.label}
                to={item.path}
                className={`text-sm font-medium whitespace-nowrap shrink-0 pb-0.5 transition-colors border-b ${
                  isActive
                    ? 'text-[#0B1D33] border-[#B59449]'
                    : 'text-[#525C68] border-transparent hover:text-[#0B1D33] hover:border-[#E2E6EC]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wide text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1D33]"
            style={{ backgroundColor: generalConfig.primaryColor || '#0B1D33' }}
          >
            {navigationConfig.ctaLabel || 'Contact Agent'}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-[#0B1D33] hover:bg-[#F1F3F6] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#E2E6EC] px-4 py-4 space-y-1">
          {visibleLinks.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path + item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F1F3F6] text-[#0B1D33]'
                    : 'text-[#525C68] hover:bg-[#F8F9FA] hover:text-[#0B1D33]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#E2E6EC]">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: generalConfig.primaryColor || '#0B1D33' }}
            >
              {navigationConfig.ctaLabel || 'Contact Agent'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
