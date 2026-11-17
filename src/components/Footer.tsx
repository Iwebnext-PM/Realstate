import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { formatPhoneDisplay, toTelHref } from '../lib/formatters';

export const Footer: React.FC = () => {
  const { generalConfig, navigationConfig } = useSite();
  const visibleLinks = navigationConfig.links.filter((l) => l.visible);

  const categories = [
    { label: 'Houses', to: '/properties?type=House' },
    { label: 'Condos & Apartments', to: '/properties?type=Condo' },
    { label: 'Luxury Properties', to: '/properties?type=Luxury' },
    { label: 'Townhouses', to: '/properties?type=Townhouse' },
    { label: 'Commercial Properties', to: '/properties?type=Commercial' },
    { label: 'Investment Properties', to: '/properties?type=Investment' },
  ];

  const socialItems = [
    { label: 'LinkedIn', url: generalConfig.socialLinks.linkedin },
    { label: 'Instagram', url: generalConfig.socialLinks.instagram },
    { label: 'Facebook', url: generalConfig.socialLinks.facebook },
    { label: 'YouTube', url: generalConfig.socialLinks.youtube },
    { label: 'WeChat', url: generalConfig.socialLinks.wechat },
  ].filter((item) => item.url && item.url.trim().length > 0);

  return (
    <footer
      className="text-white border-t border-[#1E334E]"
      style={{ backgroundColor: generalConfig.primaryColor || '#0B1D33' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Summary */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              {generalConfig.logoImageUrl ? (
                <img
                  src={generalConfig.logoImageUrl}
                  alt={generalConfig.businessName}
                  referrerPolicy="no-referrer"
                  className="h-9 w-auto object-contain mb-3"
                />
              ) : null}
              <span className="font-display text-2xl font-semibold tracking-tight text-white">
                {generalConfig.businessName}
              </span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
              {generalConfig.footerDescription}
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {visibleLinks.map((link) => (
                <li key={link.path + link.label}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/admin" className="text-slate-400 hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-4">
              Property Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link to={cat.to} className="hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-4">
              Direct Contact
            </h3>
            <div className="space-y-3 text-sm text-slate-300">
              <a
                href={toTelHref(generalConfig.phone)}
                className="flex items-center gap-2.5 hover:text-white transition-colors font-mono-num"
              >
                <Phone className="w-4 h-4 text-[#D4B773] shrink-0" />
                <span>{formatPhoneDisplay(generalConfig.phone)}</span>
              </a>
              <a
                href={`mailto:${generalConfig.email}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors break-all"
              >
                <Mail className="w-4 h-4 text-[#D4B773] shrink-0" />
                <span>{generalConfig.email}</span>
              </a>
              {generalConfig.businessLocation ? (
                <div className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-[#D4B773] shrink-0 mt-0.5" />
                  <span>{generalConfig.businessLocation}</span>
                </div>
              ) : null}

              {socialItems.length > 0 && (
                <div className="pt-3 flex flex-wrap gap-4 text-xs">
                  {socialItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-[#D4B773] transition-colors underline underline-offset-4"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legal Bottom Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>{generalConfig.copyrightText}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
