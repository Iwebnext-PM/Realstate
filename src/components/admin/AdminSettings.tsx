import React, { useEffect, useState } from 'react';
import { CheckCircle2, Plus, Trash2, Upload } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { SiteGeneralConfig } from '../../types/realEstate';

export const AdminSettings: React.FC = () => {
  const {
    generalConfig,
    saveSiteConfig,
    uploadMediaFile,
    adminUsers,
    addAdminUser,
    removeAdminUser,
  } = useSite();

  const [form, setForm] = useState<SiteGeneralConfig>(generalConfig);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    setForm(generalConfig);
  }, [generalConfig]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice('');
    try {
      await saveSiteConfig('general', form);
      setSavedNotice('General settings, branding colors, contact info, and social links saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadBrandAsset = async (
    files: FileList | null,
    target: 'logo' | 'favicon',
  ) => {
    if (!files || !files[0]) return;
    const asset = await uploadMediaFile(files[0], 'brand', target);
    if (target === 'logo') {
      setForm((p) => ({ ...p, logoImageUrl: asset.url }));
    } else {
      setForm((p) => ({ ...p, faviconUrl: asset.url }));
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    try {
      await addAdminUser(newAdminUid, newAdminEmail);
      setNewAdminUid('');
      setNewAdminEmail('');
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : 'Unable to add admin user.');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
              General Settings &amp; Branding
            </h1>
            <p className="text-sm text-[#525C68] mt-1">
              Manage contact information, business location, logo, favicon, brand palette, and social links.
            </p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] cursor-pointer whitespace-nowrap"
          >
            {saving ? 'Saving...' : 'Save General Settings'}
          </button>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Contact & Location */}
        <section className="bg-white border border-[#E2E6EC] p-6 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
            Business &amp; Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Business Name</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Business Location (Optional — displayed on Contact &amp; Footer)
              </label>
              <input
                type="text"
                value={form.businessLocation}
                onChange={(e) => setForm((p) => ({ ...p, businessLocation: e.target.value }))}
                placeholder="City, Region, or Office Address"
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              />
            </div>
          </div>
        </section>

        {/* Brand Identity & Colors */}
        <section className="bg-white border border-[#E2E6EC] p-6 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
            Logo, Favicon &amp; Brand Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Header Wordmark Text</label>
              <input
                type="text"
                value={form.logoText}
                onChange={(e) => setForm((p) => ({ ...p, logoText: e.target.value }))}
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Logo Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.logoImageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, logoImageUrl: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-[#D4DAE2] text-sm"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#0B1D33] text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadBrandAsset(e.target.files, 'logo')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Favicon URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.faviconUrl}
                  onChange={(e) => setForm((p) => ({ ...p, faviconUrl: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-[#D4DAE2] text-sm"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#0B1D33] text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadBrandAsset(e.target.files, 'favicon')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Primary Navy Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))}
                    className="w-10 h-9 border border-[#D4DAE2] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.primaryColor}
                    onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))}
                    className="flex-1 px-2.5 py-2 border border-[#D4DAE2] text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Gold Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => setForm((p) => ({ ...p, accentColor: e.target.value }))}
                    className="w-10 h-9 border border-[#D4DAE2] cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.accentColor}
                    onChange={(e) => setForm((p) => ({ ...p, accentColor: e.target.value }))}
                    className="flex-1 px-2.5 py-2 border border-[#D4DAE2] text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="bg-white border border-[#E2E6EC] p-6 space-y-4">
          <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['linkedin', 'instagram', 'facebook', 'youtube', 'wechat'] as const).map((key) => (
              <div key={key}>
                <label className="block text-xs font-semibold capitalize mb-1">{key} URL</label>
                <input
                  type="url"
                  value={form.socialLinks[key]}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      socialLinks: { ...p.socialLinks, [key]: e.target.value },
                    }))
                  }
                  placeholder={`https://${key}.com/...`}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                />
              </div>
            ))}
          </div>
        </section>
      </form>

      {/* Admin Access Management */}
      <section className="bg-white border border-[#E2E6EC] p-6 space-y-4">
        <h2 className="font-display text-2xl font-semibold text-[#0B1D33] border-b border-[#E2E6EC] pb-3">
          Authorized Administrators
        </h2>
        <p className="text-xs text-[#525C68]">
          Grant additional Firebase user UIDs access to this admin dashboard.
        </p>

        {adminError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">{adminError}</div>
        )}

        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            required
            value={newAdminUid}
            onChange={(e) => setNewAdminUid(e.target.value)}
            placeholder="Firebase User UID"
            className="sm:col-span-5 px-3 py-2 border border-[#D4DAE2] text-xs font-mono"
          />
          <input
            type="email"
            required
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Admin Email"
            className="sm:col-span-5 px-3 py-2 border border-[#D4DAE2] text-xs"
          />
          <button
            type="submit"
            className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0B1D33] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Admin</span>
          </button>
        </form>

        {adminUsers.length > 0 && (
          <div className="divide-y divide-[#E2E6EC] border border-[#E2E6EC]">
            {adminUsers.map((adm) => (
              <div key={adm.uid} className="px-4 py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#0B1D33]">{adm.email}</span>
                  <span className="text-[#525C68] font-mono ml-3">UID: {adm.uid}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAdminUser(adm.uid)}
                  className="text-red-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
