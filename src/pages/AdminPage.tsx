import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ExternalLink,
  FileText,
  Globe,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  Settings,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { DocumentHead } from '../components/DocumentHead';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminProperties } from '../components/admin/AdminProperties';
import { AdminInquiries } from '../components/admin/AdminInquiries';
import { AdminContent } from '../components/admin/AdminContent';
import { AdminTestimonials } from '../components/admin/AdminTestimonials';
import { AdminMedia } from '../components/admin/AdminMedia';
import { AdminSeo } from '../components/admin/AdminSeo';
import { AdminSettings } from '../components/admin/AdminSettings';

type AdminTab =
  | 'overview'
  | 'properties'
  | 'inquiries'
  | 'content'
  | 'testimonials'
  | 'media'
  | 'seo'
  | 'settings';

export const AdminPage: React.FC = () => {
  const {
    user,
    authReady,
    isAdmin,
    adminCheckLoading,
    signInWithGoogle,
    logout,
    generalConfig,
    inquiries,
  } = useSite();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [openNewProperty, setOpenNewProperty] = useState(false);
  const [authError, setAuthError] = useState('');

  const newInquiryCount = inquiries.filter((i) => i.status === 'new').length;

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to sign in with Google.',
      );
    }
  };

  if (!authReady || adminCheckLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-[#0B1D33] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-[#525C68]">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated Sign-In View
  if (!user) {
    return (
      <>
        <DocumentHead title={`Admin Sign In | ${generalConfig.businessName}`} />
        <div className="min-h-screen bg-[#0B1D33] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white border border-[#E2E6EC] p-8 sm:p-10 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-2">
                Protected Console
              </p>
              <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
                {generalConfig.businessName}
              </h1>
              <p className="text-sm text-[#525C68] mt-2 leading-relaxed">
                Sign in with an authorized administrator Google account to manage property listings, leads, media, and website content.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-[#0B1D33] text-white text-sm font-semibold hover:bg-[#163254] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4B773]" />
              <span>Sign In with Google</span>
            </button>

            <div className="pt-4 border-t border-[#E2E6EC] text-center">
              <Link to="/" className="text-xs font-semibold text-[#525C68] hover:text-[#0B1D33]">
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Authenticated but Unauthorized Account View
  if (!isAdmin) {
    return (
      <>
        <DocumentHead title={`Access Restricted | ${generalConfig.businessName}`} />
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white border border-[#E2E6EC] p-8 space-y-5">
            <div className="w-11 h-11 bg-red-50 text-red-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
              Administrator Access Required
            </h1>
            <p className="text-sm text-[#525C68] leading-relaxed">
              You are currently signed in as <strong className="text-[#0B1D33]">{user.email}</strong>, which is not authorized for administrative management.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={logout}
                className="px-5 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold cursor-pointer"
              >
                Sign Out &amp; Switch Account
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 border border-[#D4DAE2] text-xs font-semibold text-[#0B1D33]"
              >
                Return to Website
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const navItems: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'inquiries', label: 'Inquiries & Leads', icon: Mail, badge: newInquiryCount },
    { id: 'content', label: 'Website Content', icon: FileText },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'seo', label: 'SEO & Sitemap', icon: Globe },
    { id: 'settings', label: 'General Settings', icon: Settings },
  ];

  return (
    <>
      <DocumentHead title={`Admin Dashboard | ${generalConfig.businessName}`} />
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-64 bg-[#0B1D33] text-white shrink-0 flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#D4B773]">
                Management Console
              </p>
              <p className="font-display text-xl font-semibold text-white mt-1">
                {generalConfig.businessName}
              </p>
            </div>

            <nav aria-label="Admin Navigation" className="p-3 flex lg:flex-col gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#B59449] text-[#0B1D33]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-mono-num ${
                          active ? 'bg-[#0B1D33] text-white' : 'bg-[#B59449] text-[#0B1D33]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-white/10 space-y-3 hidden lg:block">
            <div className="text-xs text-slate-300 truncate">{user.email}</div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-white/20 text-xs font-semibold text-white hover:bg-white/10"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Site</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-white/20 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-[#E2E6EC] px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="text-xs font-medium text-[#525C68]">
              Admin <span aria-hidden="true">/</span>{' '}
              <span className="text-[#0B1D33] font-semibold capitalize">{activeTab}</span>
            </div>
            <div className="flex items-center gap-3 lg:hidden">
              <Link to="/" className="text-xs font-semibold text-[#0B1D33]">
                Live Site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-red-700 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </header>

          <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto">
            {activeTab === 'overview' && (
              <AdminOverview
                onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
                onCreateProperty={() => {
                  setOpenNewProperty(true);
                  setActiveTab('properties');
                }}
              />
            )}
            {activeTab === 'properties' && (
              <AdminProperties
                openNewOnMount={openNewProperty}
                onClearOpenNew={() => setOpenNewProperty(false)}
              />
            )}
            {activeTab === 'inquiries' && <AdminInquiries />}
            {activeTab === 'content' && <AdminContent />}
            {activeTab === 'testimonials' && <AdminTestimonials />}
            {activeTab === 'media' && <AdminMedia />}
            {activeTab === 'seo' && <AdminSeo />}
            {activeTab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>
    </>
  );
};
