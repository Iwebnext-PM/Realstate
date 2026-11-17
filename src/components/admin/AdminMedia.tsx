import React, { useState } from 'react';
import { Copy, Check, Trash2, Upload, Plus } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { MediaAsset } from '../../types/realEstate';
import { PropertyImage } from '../PropertyImage';

export const AdminMedia: React.FC = () => {
  const { mediaAssets, uploadMediaFile, registerMediaUrl, updateMediaAsset, deleteMediaAsset } = useSite();

  const [category, setCategory] = useState<MediaAsset['category']>('property');
  const [altInput, setAltInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setErrorMsg('');
    try {
      for (const file of Array.from(files)) {
        await uploadMediaFile(file, category, altInput || file.name);
      }
      setAltInput('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? `Firebase Storage upload error: ${err.message}. You can also register an image URL below.`
          : 'Upload error.',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRegisterUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!urlInput.trim()) return;
    await registerMediaUrl({
      name: nameInput.trim() || 'Image Asset',
      url: urlInput.trim(),
      alt: altInput.trim() || nameInput.trim() || 'Real estate photograph',
      category,
    });
    setUrlInput('');
    setNameInput('');
    setAltInput('');
  };

  const handleCopy = (id: string, url: string) => {
    void navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
          Media Management
        </h1>
        <p className="text-sm text-[#525C68] mt-1">
          Upload property photographs, website banners, portraits, and manage image alt text.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs">
          {errorMsg}
        </div>
      )}

      <div className="bg-white border border-[#E2E6EC] p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[#0B1D33]">Upload to Firebase Storage</h2>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MediaAsset['category'])}
              className="px-3 py-2 border border-[#D4DAE2] bg-white text-xs font-semibold"
            >
              <option value="property">Property Photo</option>
              <option value="banner">Website Banner</option>
              <option value="portrait">Portrait</option>
              <option value="brand">Logo / Brand</option>
            </select>
            <input
              type="text"
              value={altInput}
              onChange={(e) => setAltInput(e.target.value)}
              placeholder="Descriptive alt text"
              className="px-3 py-2 border border-[#D4DAE2] text-xs"
            />
          </div>
          <label className="flex flex-col items-center justify-center border border-dashed border-[#0B1D33]/40 bg-[#F8F9FA] p-6 text-center cursor-pointer hover:bg-[#EEF2F6] transition-colors">
            <Upload className="w-6 h-6 text-[#0B1D33] mb-2" />
            <span className="text-xs font-semibold text-[#0B1D33]">
              {uploading ? 'Uploading files...' : 'Click to Select Images (JPG, PNG, WebP)'}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleRegisterUrl} className="space-y-3 border-t lg:border-t-0 lg:border-l border-[#E2E6EC] pt-5 lg:pt-0 lg:pl-6">
          <h2 className="text-sm font-semibold text-[#0B1D33]">Register External or Asset URL</h2>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Asset Title (e.g. Hero Twilight Shot)"
            className="w-full px-3 py-2 border border-[#D4DAE2] text-xs"
          />
          <input
            type="text"
            required
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... or /src/assets/images/..."
            className="w-full px-3 py-2 border border-[#D4DAE2] text-xs"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1D33] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Media Library</span>
          </button>
        </form>
      </div>

      {/* Media Grid */}
      {mediaAssets.length === 0 ? (
        <div className="bg-white border border-[#E2E6EC] p-12 text-center text-sm text-[#525C68]">
          No uploaded media items yet. Upload photographs above to build your reusable gallery.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaAssets.map((asset) => (
            <div key={asset.id} className="bg-white border border-[#E2E6EC] overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-[#ECEFF3] overflow-hidden">
                <PropertyImage
                  src={asset.url}
                  alt={asset.alt || asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9E7E38]">
                    {asset.category}
                  </p>
                  <p className="text-sm font-semibold text-[#0B1D33] truncate">{asset.name}</p>
                  <p className="text-xs text-[#525C68] truncate">{asset.alt || 'No alt text'}</p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E2E6EC]">
                  <button
                    type="button"
                    onClick={() => handleCopy(asset.id, asset.url)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1D33] hover:text-[#9E7E38] cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copied URL</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingAsset(asset)}
                      className="text-xs font-semibold text-[#525C68] hover:text-[#0B1D33] cursor-pointer"
                    >
                      Replace / Alt
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMediaAsset(asset)}
                      className="p-1.5 text-red-700 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingAsset && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await updateMediaAsset(editingAsset.id, {
                name: editingAsset.name,
                alt: editingAsset.alt || '',
                category: editingAsset.category,
                url: editingAsset.url,
              });
              setEditingAsset(null);
            }}
            className="bg-white border border-[#E2E6EC] max-w-md w-full p-6 space-y-4"
          >
            <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
              Update Media Details
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Title</label>
              <input
                type="text"
                value={editingAsset.name}
                onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Image URL</label>
              <input
                type="text"
                value={editingAsset.url}
                onChange={(e) => setEditingAsset({ ...editingAsset, url: e.target.value })}
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Alt Text</label>
              <input
                type="text"
                value={editingAsset.alt || ''}
                onChange={(e) => setEditingAsset({ ...editingAsset, alt: e.target.value })}
                className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2 border border-[#D4DAE2] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0B1D33] text-white text-xs font-semibold cursor-pointer"
              >
                Save Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
