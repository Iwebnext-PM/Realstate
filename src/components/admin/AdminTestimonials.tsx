import React, { useState } from 'react';
import { Edit2, Plus, Star, Trash2, X } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import type { Testimonial } from '../../types/realEstate';

export const AdminTestimonials: React.FC = () => {
  const { allTestimonials, saveTestimonial, deleteTestimonial } = useSite();

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState('');
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditingId(undefined);
    setClientName('');
    setClientRole('');
    setRating(5);
    setQuote('');
    setIsPlaceholder(false);
    setPublished(true);
    setSortOrder(allTestimonials.length + 1);
    setEditorOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setClientName(t.clientName);
    setClientRole(t.clientRole);
    setRating(t.rating);
    setQuote(t.quote);
    setIsPlaceholder(t.isPlaceholder);
    setPublished(t.published);
    setSortOrder(t.sortOrder ?? 1);
    setEditorOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveTestimonial({
        id: editingId,
        clientName,
        clientRole,
        rating,
        quote,
        isPlaceholder,
        published,
        sortOrder,
      });
      setEditorOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
            Testimonials Management
          </h1>
          <p className="text-sm text-[#525C68] mt-1">
            Add genuine client reviews, replace placeholder samples, and manage visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTestimonials.map((t) => (
          <div key={t.id} className="bg-white border border-[#E2E6EC] p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < t.rating ? 'text-[#B59449] fill-[#B59449]' : 'text-[#CBD5E1]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-[#525C68]">
                  {t.published ? 'Published' : 'Hidden'}
                  {t.isPlaceholder ? ' · Placeholder' : ''}
                </span>
              </div>
              <p className="text-sm text-[#1E242B] leading-relaxed mb-3">“{t.quote}”</p>
            </div>

            <div className="pt-3 border-t border-[#E2E6EC] flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#0B1D33]">{t.clientName}</p>
                <p className="text-xs text-[#525C68]">{t.clientRole}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  className="p-2 border border-[#D4DAE2] text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteTestimonial(t.id)}
                  className="p-2 border border-[#D4DAE2] text-red-700 hover:bg-red-700 hover:text-white cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editorOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E6EC] max-w-lg w-full">
            <div className="px-6 py-4 border-b border-[#E2E6EC] flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button type="button" onClick={() => setEditorOpen(false)} className="cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Client Role / Context *</label>
                <input
                  type="text"
                  required
                  value={clientRole}
                  onChange={(e) => setClientRole(e.target.value)}
                  placeholder="e.g. Home Buyer"
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Sort Order</label>
                  <input
                    type="number"
                    min={0}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#D4DAE2] text-sm font-mono-num"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  <span>Published</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={isPlaceholder}
                    onChange={(e) => setIsPlaceholder(e.target.checked)}
                  />
                  <span>Mark as Sample Placeholder</span>
                </label>
              </div>
              <div className="pt-3 border-t border-[#E2E6EC] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 border border-[#D4DAE2] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#0B1D33] text-white text-xs font-semibold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
