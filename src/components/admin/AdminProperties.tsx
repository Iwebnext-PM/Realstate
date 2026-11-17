import React, { useEffect, useState } from 'react';
import {
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { GENERATED_IMAGES } from '../../data/defaultData';
import { formatCurrency, slugify } from '../../lib/formatters';
import type {
  ListingStatus,
  ListingType,
  Property,
  PropertyCategory,
} from '../../types/realEstate';
import { PropertyImage } from '../PropertyImage';

interface AdminPropertiesProps {
  openNewOnMount?: boolean;
  onClearOpenNew?: () => void;
}

const emptyProperty = (): Omit<Property, 'id' | 'createdAt' | 'updatedAt'> => ({
  slug: '',
  title: '',
  description: '',
  price: 0,
  listingType: 'Sale',
  propertyType: 'House',
  status: 'For Sale',
  featured: false,
  published: true,
  address: '',
  city: '',
  neighborhood: '',
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1800,
  yearBuilt: 0,
  parking: '',
  features: [],
  imageUrls: [],
  imageAlts: [],
  seoTitle: '',
  seoDescription: '',
});

export const AdminProperties: React.FC<AdminPropertiesProps> = ({
  openNewOnMount = false,
  onClearOpenNew,
}) => {
  const { allProperties, mediaAssets, saveProperty, deleteProperty, uploadMediaFile } = useSite();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [form, setForm] = useState(emptyProperty());
  const [featuresText, setFeaturesText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (openNewOnMount) {
      setEditingId(undefined);
      setForm(emptyProperty());
      setFeaturesText('');
      setEditorOpen(true);
      onClearOpenNew?.();
    }
  }, [openNewOnMount, onClearOpenNew]);

  const openCreate = () => {
    setEditingId(undefined);
    setForm(emptyProperty());
    setFeaturesText('');
    setFormError('');
    setEditorOpen(true);
  };

  const openEdit = (prop: Property) => {
    setEditingId(prop.id);
    setForm({
      slug: prop.slug,
      title: prop.title,
      description: prop.description,
      price: prop.price,
      listingType: prop.listingType,
      propertyType: prop.propertyType,
      status: prop.status,
      featured: prop.featured,
      published: prop.published,
      address: prop.address,
      city: prop.city,
      neighborhood: prop.neighborhood || '',
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      sqft: prop.sqft,
      yearBuilt: prop.yearBuilt || 0,
      parking: prop.parking || '',
      features: prop.features || [],
      imageUrls: prop.imageUrls || [],
      imageAlts: prop.imageAlts || [],
      lat: prop.lat,
      lng: prop.lng,
      seoTitle: prop.seoTitle || '',
      seoDescription: prop.seoDescription || '',
    });
    setFeaturesText((prop.features || []).join('\n'));
    setFormError('');
    setEditorOpen(true);
  };

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setFormError('');
    try {
      const addedUrls: string[] = [];
      const addedAlts: string[] = [];
      for (const file of Array.from(files)) {
        const asset = await uploadMediaFile(file, 'property', form.title || file.name);
        addedUrls.push(asset.url);
        addedAlts.push(asset.alt || form.title || 'Property photo');
      }
      setForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...addedUrls].slice(0, 15),
        imageAlts: [...(prev.imageAlts || []), ...addedAlts].slice(0, 15),
      }));
    } catch (err) {
      setFormError(
        err instanceof Error
          ? `Image upload failed: ${err.message}. You can also paste an image URL or choose from Media Library.`
          : 'Upload failed.',
      );
    } finally {
      setUploading(false);
    }
  };

  const addImageByUrl = () => {
    const clean = newImageUrl.trim();
    if (!clean) return;
    setForm((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, clean].slice(0, 15),
      imageAlts: [...(prev.imageAlts || []), newImageAlt.trim() || prev.title || 'Property photo'].slice(0, 15),
    }));
    setNewImageUrl('');
    setNewImageAlt('');
  };

  const removeImageAt = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
      imageAlts: (prev.imageAlts || []).filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= form.imageUrls.length) return;
    const urls = [...form.imageUrls];
    const alts = [...(form.imageAlts || [])];
    [urls[index], urls[nextIndex]] = [urls[nextIndex], urls[index]];
    [alts[index], alts[nextIndex]] = [alts[nextIndex] || '', alts[index] || ''];
    setForm((prev) => ({ ...prev, imageUrls: urls, imageAlts: alts }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.title.trim()) {
      setFormError('Property title is required.');
      return;
    }
    if (!form.address.trim() || !form.city.trim()) {
      setFormError('Address and city are required.');
      return;
    }

    const parsedFeatures = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)
      .slice(0, 30);

    setSaving(true);
    try {
      await saveProperty({
        id: editingId,
        ...form,
        slug: slugify(form.slug || form.title),
        features: parsedFeatures,
        imageUrls:
          form.imageUrls.length > 0 ? form.imageUrls : [GENERATED_IMAGES.modernVilla],
        imageAlts:
          form.imageUrls.length > 0
            ? form.imageUrls.map((_, i) => form.imageAlts?.[i] || form.title)
            : [form.title],
      });
      setEditorOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save property.');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async (prop: Property, field: 'published' | 'featured') => {
    await saveProperty({
      id: prop.id,
      slug: prop.slug,
      title: prop.title,
      description: prop.description,
      price: prop.price,
      listingType: prop.listingType,
      propertyType: prop.propertyType,
      status: prop.status,
      featured: field === 'featured' ? !prop.featured : prop.featured,
      published: field === 'published' ? !prop.published : prop.published,
      address: prop.address,
      city: prop.city,
      neighborhood: prop.neighborhood,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      sqft: prop.sqft,
      yearBuilt: prop.yearBuilt,
      parking: prop.parking,
      features: prop.features,
      imageUrls: prop.imageUrls,
      imageAlts: prop.imageAlts,
      lat: prop.lat,
      lng: prop.lng,
      seoTitle: prop.seoTitle,
      seoDescription: prop.seoDescription,
    });
  };

  const filtered = allProperties.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const match = `${p.title} ${p.address} ${p.city} ${p.propertyType}`.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
            Property Management
          </h1>
          <p className="text-sm text-[#525C68] mt-1">
            Add, edit, publish, feature, and manage property galleries across your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E2E6EC] p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, address, city, or type..."
            className="w-full pl-9 pr-3 py-2 border border-[#D4DAE2] text-sm focus:outline-none focus:border-[#0B1D33]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#D4DAE2] bg-white text-sm focus:outline-none focus:border-[#0B1D33]"
        >
          <option value="">All Statuses</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
          <option value="Pending">Pending</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      {/* Properties Table */}
      <div className="bg-white border border-[#E2E6EC] overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#525C68]">
            No properties found. Click “Add New Property” to create your first listing.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8F9FA] border-b border-[#E2E6EC] text-xs font-semibold uppercase tracking-wider text-[#525C68]">
              <tr>
                <th className="px-5 py-3">Property</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3">Visibility</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6EC]">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-[#F8F9FA]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 shrink-0 bg-[#ECEFF3] overflow-hidden">
                        <PropertyImage
                          src={prop.imageUrls[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0B1D33] truncate max-w-xs">
                          {prop.title}
                        </p>
                        <p className="text-xs text-[#525C68] truncate max-w-xs">
                          {prop.address}, {prop.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[#1E242B]">
                    {prop.propertyType} ({prop.listingType})
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono-num font-semibold text-[#0B1D33]">
                    {formatCurrency(prop.price, prop.listingType)}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-[#1E242B]">
                    {prop.status}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleQuickToggle(prop, 'featured')}
                      title={prop.featured ? 'Remove from featured' : 'Mark as featured'}
                      className={`inline-flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                        prop.featured ? 'text-[#9E7E38]' : 'text-[#9AA3AE] hover:text-[#0B1D33]'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${prop.featured ? 'fill-[#B59449]' : ''}`} />
                      <span>{prop.featured ? 'Featured' : 'Standard'}</span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleQuickToggle(prop, 'published')}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                        prop.published ? 'text-emerald-800' : 'text-[#64748B]'
                      }`}
                    >
                      {prop.published ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(prop)}
                        aria-label={`Edit ${prop.title}`}
                        className="p-2 border border-[#D4DAE2] text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(prop.id)}
                        aria-label={`Delete ${prop.title}`}
                        className="p-2 border border-[#D4DAE2] text-red-700 hover:bg-red-700 hover:text-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E6EC] max-w-md w-full p-6 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
              Delete Property Listing?
            </h2>
            <p className="text-sm text-[#525C68]">
              This will permanently remove the property listing from Firestore. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-[#D4DAE2] text-xs font-semibold text-[#1E242B] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = confirmDeleteId;
                  setConfirmDeleteId(null);
                  await deleteProperty(id);
                }}
                className="px-4 py-2 bg-red-700 text-white text-xs font-semibold hover:bg-red-800 cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Property Modal */}
      {editorOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto bg-white border border-[#E2E6EC] my-6">
            <div className="px-6 py-4 border-b border-[#E2E6EC] flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                {editingId ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="p-2 text-[#525C68] hover:text-[#0B1D33] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                        slug: editingId ? prev.slug : slugify(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    URL Slug (SEO)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm font-mono-num"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Listing Type
                  </label>
                  <select
                    value={form.listingType}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, listingType: e.target.value as ListingType }))
                    }
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm bg-white"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Property Type
                  </label>
                  <select
                    value={form.propertyType}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, propertyType: e.target.value as PropertyCategory }))
                    }
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm bg-white"
                  >
                    <option value="House">House</option>
                    <option value="Condo">Condo &amp; Apartment</option>
                    <option value="Luxury">Luxury Property</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Listing Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value as ListingStatus }))
                    }
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm bg-white"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Pending">Pending</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B1D33] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                    />
                    <span>Published (Live)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#9E7E38] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                    />
                    <span>Featured Property</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    value={form.neighborhood || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, neighborhood: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Parking Information
                  </label>
                  <input
                    type="text"
                    value={form.parking || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, parking: e.target.value }))}
                    placeholder="e.g. 2-Car Underground Garage"
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 sm:col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                      Beds
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={form.bedrooms}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, bedrooms: Number(e.target.value) }))
                      }
                      className="w-full px-2.5 py-2 border border-[#D4DAE2] text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                      Baths
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      step={0.5}
                      value={form.bathrooms}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, bathrooms: Number(e.target.value) }))
                      }
                      className="w-full px-2.5 py-2 border border-[#D4DAE2] text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                      Sq Ft
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.sqft}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, sqft: Number(e.target.value) }))
                      }
                      className="w-full px-2.5 py-2 border border-[#D4DAE2] text-sm font-mono-num"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                      Year Built
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={2100}
                      value={form.yearBuilt || 0}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, yearBuilt: Number(e.target.value) }))
                      }
                      className="w-full px-2.5 py-2 border border-[#D4DAE2] text-sm font-mono-num"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    Features &amp; Amenities (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="Floor-to-ceiling windows&#10;Hardwood flooring&#10;Private balcony"
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>
              </div>

              {/* Property Images Manager */}
              <div className="border-t border-[#E2E6EC] pt-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#0B1D33]">
                      Property Image Gallery ({form.imageUrls.length}/15)
                    </h3>
                    <p className="text-xs text-[#525C68]">
                      Upload multiple photographs to Firebase Storage, select from Media Library, or add by URL.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B1D33] text-white text-xs font-semibold cursor-pointer hover:bg-[#163254]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploading}
                      onChange={(e) => handleUploadFiles(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://... or /src/assets/...)"
                    className="sm:col-span-6 px-3 py-2 border border-[#D4DAE2] text-xs"
                  />
                  <input
                    type="text"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Image alt text"
                    className="sm:col-span-4 px-3 py-2 border border-[#D4DAE2] text-xs"
                  />
                  <button
                    type="button"
                    onClick={addImageByUrl}
                    className="sm:col-span-2 px-3 py-2 border border-[#0B1D33] text-xs font-semibold text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white cursor-pointer"
                  >
                    Add Photo
                  </button>
                </div>

                {mediaAssets.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <span className="text-[11px] font-semibold text-[#525C68] shrink-0">
                      Quick Pick from Media:
                    </span>
                    {mediaAssets.slice(0, 8).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            imageUrls: [...prev.imageUrls, m.url].slice(0, 15),
                            imageAlts: [...(prev.imageAlts || []), m.alt || m.name].slice(0, 15),
                          }))
                        }
                        className="w-12 h-9 shrink-0 border border-[#D4DAE2] overflow-hidden hover:border-[#0B1D33] cursor-pointer"
                        title={`Add ${m.name}`}
                      >
                        <img src={m.url} alt={m.alt || m.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {form.imageUrls.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {form.imageUrls.map((url, idx) => (
                      <div
                        key={url + idx}
                        className="flex items-center gap-3 p-2.5 border border-[#E2E6EC] bg-[#F8F9FA]"
                      >
                        <img
                          src={url}
                          alt={form.imageAlts?.[idx] || 'Property'}
                          className="w-20 h-14 object-cover shrink-0 bg-[#ECEFF3]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-[#0B1D33] mb-1">
                            {idx === 0 ? 'Cover Photo' : `Photo #${idx + 1}`}
                          </p>
                          <input
                            type="text"
                            value={form.imageAlts?.[idx] || ''}
                            onChange={(e) => {
                              const nextAlts = [...(form.imageAlts || [])];
                              nextAlts[idx] = e.target.value;
                              setForm((prev) => ({ ...prev, imageAlts: nextAlts }));
                            }}
                            placeholder="Alt text for SEO"
                            className="w-full px-2 py-1 border border-[#D4DAE2] bg-white text-xs"
                          />
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveImage(idx, -1)}
                            disabled={idx === 0}
                            className="p-1 border border-[#D4DAE2] bg-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 1)}
                            disabled={idx === form.imageUrls.length - 1}
                            className="p-1 border border-[#D4DAE2] bg-white disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImageAt(idx)}
                          className="p-1.5 text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property SEO Fields */}
              <div className="border-t border-[#E2E6EC] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    maxLength={140}
                    value={form.seoTitle || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E242B] mb-1">
                    SEO Meta Description
                  </label>
                  <input
                    type="text"
                    maxLength={300}
                    value={form.seoDescription || ''}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, seoDescription: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E6EC] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-5 py-2.5 border border-[#D4DAE2] text-xs font-semibold text-[#1E242B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
