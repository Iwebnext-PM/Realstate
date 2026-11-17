import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { buildSitemapXml } from '../../lib/seo';
import type { SiteSeoConfig } from '../../types/realEstate';

export const AdminSeo: React.FC = () => {
  const { seoConfig, properties, saveSiteConfig } = useSite();
  const [seo, setSeo] = useState<SiteSeoConfig>(seoConfig);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    setSeo(seoConfig);
  }, [seoConfig]);

  const generatedSitemap = useMemo(
    () => buildSitemapXml(seo.sitemapBaseUrl, properties, seo),
    [seo, properties],
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice('');
    try {
      await saveSiteConfig('seo', seo);
      setSavedNotice('SEO metadata, OpenGraph defaults, and robots configuration saved.');
    } finally {
      setSaving(false);
    }
  };

  const downloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pageEntries: Array<{ key: keyof SiteSeoConfig['pages']; label: string }> = [
    { key: 'home', label: 'Homepage' },
    { key: 'properties', label: 'Property Listings Page' },
    { key: 'buying', label: 'Buying Guide Page' },
    { key: 'selling', label: 'Selling & Valuation Page' },
    { key: 'about', label: 'About Us Page' },
    { key: 'contact', label: 'Contact Page' },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
            SEO Management
          </h1>
          <p className="text-sm text-[#525C68] mt-1">
            Configure page titles, meta descriptions, OpenGraph cards, XML sitemap, and robots.txt rules.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] cursor-pointer whitespace-nowrap"
        >
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Global OpenGraph & Defaults */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          Global Metadata &amp; Open Graph
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Default Site Title</label>
            <input
              type="text"
              value={seo.defaultTitle}
              onChange={(e) => setSeo((p) => ({ ...p, defaultTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Default Open Graph Image URL</label>
            <input
              type="text"
              value={seo.ogImageUrl}
              onChange={(e) => setSeo((p) => ({ ...p, ogImageUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Default Meta Description</label>
            <textarea
              rows={2}
              value={seo.defaultDescription}
              onChange={(e) => setSeo((p) => ({ ...p, defaultDescription: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
        </div>
      </section>

      {/* Per-Page SEO */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-5">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          Per-Page Titles, Descriptions &amp; Slugs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pageEntries.map(({ key, label }) => (
            <div key={key} className="p-4 border border-[#E2E6EC] space-y-3 bg-[#F8F9FA]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9E7E38]">
                {label}
              </p>
              <div>
                <label className="block text-[11px] font-semibold mb-1">Page Title</label>
                <input
                  type="text"
                  value={seo.pages[key].title}
                  onChange={(e) =>
                    setSeo((p) => ({
                      ...p,
                      pages: {
                        ...p.pages,
                        [key]: { ...p.pages[key], title: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 border border-[#D4DAE2] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={seo.pages[key].description}
                  onChange={(e) =>
                    setSeo((p) => ({
                      ...p,
                      pages: {
                        ...p.pages,
                        [key]: { ...p.pages[key], description: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 border border-[#D4DAE2] bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-1">Canonical Path</label>
                <input
                  type="text"
                  value={seo.pages[key].slug}
                  onChange={(e) =>
                    setSeo((p) => ({
                      ...p,
                      pages: {
                        ...p.pages,
                        [key]: { ...p.pages[key], slug: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-2.5 py-1.5 border border-[#D4DAE2] bg-white text-xs font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sitemap & Robots.txt */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-5">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          Sitemap &amp; Robots.txt
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold">sitemap.xml Preview</label>
              <button
                type="button"
                onClick={() => downloadFile('sitemap.xml', generatedSitemap, 'application/xml')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1D33] hover:text-[#9E7E38] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download sitemap.xml</span>
              </button>
            </div>
            <input
              type="text"
              value={seo.sitemapBaseUrl}
              onChange={(e) => setSeo((p) => ({ ...p, sitemapBaseUrl: e.target.value }))}
              placeholder="https://yourdomain.com"
              className="w-full px-3 py-2 border border-[#D4DAE2] text-xs font-mono"
            />
            <textarea
              readOnly
              rows={8}
              value={generatedSitemap}
              className="w-full px-3 py-2 border border-[#D4DAE2] bg-[#F8F9FA] text-[11px] font-mono"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold">robots.txt Directives</label>
              <button
                type="button"
                onClick={() => downloadFile('robots.txt', seo.robotsTxt, 'text/plain')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1D33] hover:text-[#9E7E38] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download robots.txt</span>
              </button>
            </div>
            <textarea
              rows={10}
              value={seo.robotsTxt}
              onChange={(e) => setSeo((p) => ({ ...p, robotsTxt: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-xs font-mono"
            />
          </div>
        </div>
      </section>
    </form>
  );
};
