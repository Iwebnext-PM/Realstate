import React, { useEffect, useState } from 'react';
import { CheckCircle2, Plus, Trash2, Upload } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { SiteContentConfig, SiteGeneralConfig, SiteNavigationConfig } from '../../types/realEstate';

export const AdminContent: React.FC = () => {
  const {
    contentConfig,
    generalConfig,
    navigationConfig,
    saveSiteConfig,
    uploadMediaFile,
  } = useSite();

  const [content, setContent] = useState<SiteContentConfig>(contentConfig);
  const [general, setGeneral] = useState<SiteGeneralConfig>(generalConfig);
  const [nav, setNav] = useState<SiteNavigationConfig>(navigationConfig);
  const [credentialsText, setCredentialsText] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    setContent(contentConfig);
    setCredentialsText((contentConfig.aboutCredentials || []).join('\n'));
  }, [contentConfig]);

  useEffect(() => {
    setGeneral(generalConfig);
  }, [generalConfig]);

  useEffect(() => {
    setNav(navigationConfig);
  }, [navigationConfig]);

  const handleUploadImage = async (
    files: FileList | null,
    target: 'hero' | 'portrait',
  ) => {
    if (!files || !files[0]) return;
    setUploadingField(target);
    try {
      const asset = await uploadMediaFile(
        files[0],
        target === 'hero' ? 'banner' : 'portrait',
        target === 'hero' ? 'Hero Banner' : 'Advisor Portrait',
      );
      if (target === 'hero') {
        setContent((prev) => ({ ...prev, heroImageUrl: asset.url }));
      } else {
        setContent((prev) => ({ ...prev, aboutPortraitUrl: asset.url }));
      }
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice('');
    try {
      const updatedContent: SiteContentConfig = {
        ...content,
        aboutCredentials: credentialsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await saveSiteConfig('content', updatedContent);
      await saveSiteConfig('general', general);
      await saveSiteConfig('navigation', nav);
      setSavedNotice('All website content, navigation, and footer changes published.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
            Website Content Management
          </h1>
          <p className="text-sm text-[#525C68] mt-1">
            Edit homepage copy, hero imagery, About Us biography, Buying &amp; Selling guides, navigation, and footer text.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] disabled:opacity-60 cursor-pointer whitespace-nowrap"
        >
          {saving ? 'Saving...' : 'Save & Publish Content'}
        </button>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Homepage Hero */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          Homepage Hero &amp; Value Messaging
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Hero Headline</label>
            <input
              type="text"
              value={content.heroHeadline}
              onChange={(e) => setContent((p) => ({ ...p, heroHeadline: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Hero Supporting Text</label>
            <textarea
              rows={2}
              value={content.heroSubtitle}
              onChange={(e) => setContent((p) => ({ ...p, heroSubtitle: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Hero Background Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content.heroImageUrl}
                onChange={(e) => setContent((p) => ({ ...p, heroImageUrl: e.target.value }))}
                className="flex-1 px-3 py-2 border border-[#D4DAE2] text-sm"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#0B1D33] text-xs font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingField === 'hero' ? '...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e.target.files, 'hero')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Hero Image Alt Text</label>
            <input
              type="text"
              value={content.heroImageAlt}
              onChange={(e) => setContent((p) => ({ ...p, heroImageAlt: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Why Work With Us Heading</label>
            <input
              type="text"
              value={content.whyWorkWithUsTitle}
              onChange={(e) => setContent((p) => ({ ...p, whyWorkWithUsTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Final CTA Headline</label>
            <input
              type="text"
              value={content.ctaHeadline}
              onChange={(e) => setContent((p) => ({ ...p, ctaHeadline: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
        </div>
      </section>

      {/* About Us Page */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          About Us Content &amp; Credentials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">About Page Headline</label>
            <input
              type="text"
              value={content.aboutHeadline}
              onChange={(e) => setContent((p) => ({ ...p, aboutHeadline: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Biography / Introduction</label>
            <textarea
              rows={3}
              value={content.aboutBio}
              onChange={(e) => setContent((p) => ({ ...p, aboutBio: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Real Estate Philosophy</label>
            <textarea
              rows={3}
              value={content.aboutPhilosophy}
              onChange={(e) => setContent((p) => ({ ...p, aboutPhilosophy: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Professional Approach</label>
            <textarea
              rows={3}
              value={content.aboutApproach}
              onChange={(e) => setContent((p) => ({ ...p, aboutApproach: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Portrait Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={content.aboutPortraitUrl}
                onChange={(e) => setContent((p) => ({ ...p, aboutPortraitUrl: e.target.value }))}
                className="flex-1 px-3 py-2 border border-[#D4DAE2] text-sm"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#0B1D33] text-xs font-semibold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingField === 'portrait' ? '...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e.target.files, 'portrait')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Experience, Certifications &amp; Credentials (one per line, optional)
            </label>
            <textarea
              rows={3}
              value={credentialsText}
              onChange={(e) => setCredentialsText(e.target.value)}
              placeholder="Leave blank if not yet added, or enter one item per line."
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
        </div>
      </section>

      {/* Buying & Selling Pages */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-5">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          Buying &amp; Selling Pages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0B1D33]">Buying Page</h3>
            <input
              type="text"
              value={content.buyingHeadline}
              onChange={(e) => setContent((p) => ({ ...p, buyingHeadline: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              placeholder="Buying Headline"
            />
            <textarea
              rows={2}
              value={content.buyingIntro}
              onChange={(e) => setContent((p) => ({ ...p, buyingIntro: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              placeholder="Buying Introduction"
            />
            {content.buyingSteps.map((step, idx) => (
              <div key={step.number + idx} className="p-3 border border-[#E2E6EC] space-y-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const next = [...content.buyingSteps];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setContent((p) => ({ ...p, buyingSteps: next }));
                  }}
                  className="w-full px-2.5 py-1.5 border border-[#D4DAE2] text-xs font-semibold"
                />
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => {
                    const next = [...content.buyingSteps];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setContent((p) => ({ ...p, buyingSteps: next }));
                  }}
                  className="w-full px-2.5 py-1.5 border border-[#D4DAE2] text-xs"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0B1D33]">Selling Page</h3>
            <input
              type="text"
              value={content.sellingHeadline}
              onChange={(e) => setContent((p) => ({ ...p, sellingHeadline: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              placeholder="Selling Headline"
            />
            <textarea
              rows={2}
              value={content.sellingIntro}
              onChange={(e) => setContent((p) => ({ ...p, sellingIntro: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              placeholder="Selling Introduction"
            />
            {content.sellingSteps.map((step, idx) => (
              <div key={step.number + idx} className="p-3 border border-[#E2E6EC] space-y-2">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const next = [...content.sellingSteps];
                    next[idx] = { ...next[idx], title: e.target.value };
                    setContent((p) => ({ ...p, sellingSteps: next }));
                  }}
                  className="w-full px-2.5 py-1.5 border border-[#D4DAE2] text-xs font-semibold"
                />
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => {
                    const next = [...content.sellingSteps];
                    next[idx] = { ...next[idx], description: e.target.value };
                    setContent((p) => ({ ...p, sellingSteps: next }));
                  }}
                  className="w-full px-2.5 py-1.5 border border-[#D4DAE2] text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation & Footer */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-5">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          Navigation Menu &amp; Footer Content
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#1E242B]">Navigation Menu Links</label>
            <button
              type="button"
              onClick={() =>
                setNav((prev) => ({
                  ...prev,
                  links: [...prev.links, { label: 'New Link', path: '/properties', visible: true }],
                }))
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B1D33] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>
          {nav.links.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const next = [...nav.links];
                  next[idx] = { ...next[idx], label: e.target.value };
                  setNav((p) => ({ ...p, links: next }));
                }}
                className="col-span-4 px-2.5 py-1.5 border border-[#D4DAE2] text-xs"
              />
              <input
                type="text"
                value={item.path}
                onChange={(e) => {
                  const next = [...nav.links];
                  next[idx] = { ...next[idx], path: e.target.value };
                  setNav((p) => ({ ...p, links: next }));
                }}
                className="col-span-5 px-2.5 py-1.5 border border-[#D4DAE2] text-xs font-mono"
              />
              <label className="col-span-2 inline-flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(e) => {
                    const next = [...nav.links];
                    next[idx] = { ...next[idx], visible: e.target.checked };
                    setNav((p) => ({ ...p, links: next }));
                  }}
                />
                <span>Show</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setNav((p) => ({ ...p, links: p.links.filter((_, i) => i !== idx) }))
                }
                className="col-span-1 text-red-700 flex justify-end cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E2E6EC]">
          <div>
            <label className="block text-xs font-semibold mb-1">Header CTA Button Label</label>
            <input
              type="text"
              value={nav.ctaLabel}
              onChange={(e) => setNav((p) => ({ ...p, ctaLabel: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Footer Copyright Text</label>
            <input
              type="text"
              value={general.copyrightText}
              onChange={(e) => setGeneral((p) => ({ ...p, copyrightText: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1">Footer Business Description</label>
            <textarea
              rows={2}
              value={general.footerDescription}
              onChange={(e) => setGeneral((p) => ({ ...p, footerDescription: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
            />
          </div>
        </div>
      </section>
    </form>
  );
};
