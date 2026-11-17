import React, { useMemo, useState } from 'react';
import { Mail, Phone, Search, Trash2 } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { formatDateDisplay, formatPhoneDisplay, toTelHref } from '../../lib/formatters';
import type { Inquiry, InquiryStatus } from '../../types/realEstate';

export const AdminInquiries: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useSite();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return inquiries.filter((inq) => {
      if (statusFilter && inq.status !== statusFilter) return false;
      if (typeFilter && inq.inquiryType !== typeFilter) return false;
      if (q) {
        const hay = `${inq.name} ${inq.email} ${inq.phone} ${inq.propertyTitle || ''} ${inq.propertyAddress || ''} ${inq.message}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [inquiries, searchTerm, statusFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
          Lead &amp; Inquiry Management
        </h1>
        <p className="text-sm text-[#525C68] mt-1">
          Review property inquiries, viewing requests, valuation leads, and contact form messages.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E2E6EC] p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, phone, or property..."
            className="w-full pl-9 pr-3 py-2 border border-[#D4DAE2] text-sm focus:outline-none focus:border-[#0B1D33]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="sm:col-span-3 px-3 py-2 border border-[#D4DAE2] bg-white text-sm"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="sm:col-span-3 px-3 py-2 border border-[#D4DAE2] bg-white text-sm"
        >
          <option value="">All Inquiry Types</option>
          <option value="Property Info">Property Info</option>
          <option value="Schedule Viewing">Schedule Viewing</option>
          <option value="Availability">Availability</option>
          <option value="Property Valuation">Property Valuation</option>
          <option value="General Contact">General Contact</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inquiries List */}
        <div className="lg:col-span-7 bg-white border border-[#E2E6EC] divide-y divide-[#E2E6EC]">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-[#525C68]">
              No matching inquiries found.
            </div>
          ) : (
            filtered.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id;
              return (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#EEF2F6]' : 'hover:bg-[#F8F9FA]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-[#0B1D33]">{inq.name}</p>
                      <p className="text-xs text-[#525C68]">
                        {inq.inquiryType} · {formatDateDisplay(inq.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-semibold uppercase shrink-0 ${
                        inq.status === 'new'
                          ? 'bg-amber-100 text-amber-900'
                          : inq.status === 'contacted'
                            ? 'bg-slate-200 text-[#0B1D33]'
                            : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  {(inq.propertyTitle || inq.propertyAddress || inq.subject) && (
                    <p className="text-xs font-medium text-[#9E7E38] mb-1 truncate">
                      {inq.propertyTitle || inq.propertyAddress || inq.subject}
                    </p>
                  )}
                  <p className="text-xs text-[#525C68] line-clamp-2">{inq.message}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Inquiry Detail Inspector */}
        <div className="lg:col-span-5 bg-white border border-[#E2E6EC] p-6">
          {!selectedInquiry ? (
            <div className="py-16 text-center text-sm text-[#525C68]">
              Select an inquiry on the left to inspect full contact details, property reference, and update status.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E2E6EC]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#9E7E38]">
                    {selectedInquiry.inquiryType}
                  </p>
                  <h2 className="font-display text-2xl font-semibold text-[#0B1D33] mt-0.5">
                    {selectedInquiry.name}
                  </h2>
                  <p className="text-xs font-mono-num text-[#525C68] mt-1">
                    Submitted {formatDateDisplay(selectedInquiry.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(selectedInquiry.id)}
                  aria-label="Delete inquiry"
                  className="p-2 border border-[#D4DAE2] text-red-700 hover:bg-red-700 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-sm">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="flex items-center gap-2 text-[#0B1D33] hover:text-[#9E7E38] break-all"
                >
                  <Mail className="w-4 h-4 text-[#9E7E38] shrink-0" />
                  <span>{selectedInquiry.email}</span>
                </a>
                <a
                  href={toTelHref(selectedInquiry.phone)}
                  className="flex items-center gap-2 text-[#0B1D33] hover:text-[#9E7E38] font-mono-num"
                >
                  <Phone className="w-4 h-4 text-[#9E7E38] shrink-0" />
                  <span>{formatPhoneDisplay(selectedInquiry.phone)}</span>
                </a>
              </div>

              {(selectedInquiry.propertyTitle ||
                selectedInquiry.propertyAddress ||
                selectedInquiry.propertyType ||
                selectedInquiry.subject) && (
                <div className="bg-[#F8F9FA] border border-[#E2E6EC] p-4 space-y-1 text-xs">
                  <p className="font-semibold text-[#0B1D33] uppercase tracking-wider">
                    Reference Details
                  </p>
                  {selectedInquiry.propertyTitle && (
                    <p className="text-[#1E242B]">Property: {selectedInquiry.propertyTitle}</p>
                  )}
                  {selectedInquiry.propertyAddress && (
                    <p className="text-[#525C68]">Address: {selectedInquiry.propertyAddress}</p>
                  )}
                  {selectedInquiry.propertyType && (
                    <p className="text-[#525C68]">Type: {selectedInquiry.propertyType}</p>
                  )}
                  {selectedInquiry.subject && (
                    <p className="text-[#525C68]">Subject: {selectedInquiry.subject}</p>
                  )}
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#525C68] mb-2">
                  Message
                </p>
                <p className="text-sm text-[#1E242B] leading-relaxed whitespace-pre-line bg-[#F8F9FA] border border-[#E2E6EC] p-4">
                  {selectedInquiry.message}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E6EC]">
                <label className="block text-xs font-semibold text-[#1E242B] mb-2">
                  Lead Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['new', 'contacted', 'completed'] as InquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={async () => {
                        await updateInquiryStatus(selectedInquiry.id, st);
                        setSelectedInquiry((prev) => (prev ? { ...prev, status: st } : null));
                      }}
                      className={`py-2 px-3 text-xs font-semibold uppercase border transition-colors cursor-pointer ${
                        selectedInquiry.status === st
                          ? 'bg-[#0B1D33] text-white border-[#0B1D33]'
                          : 'bg-white text-[#525C68] border-[#D4DAE2] hover:border-[#0B1D33]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E6EC] max-w-md w-full p-6 space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">Delete Inquiry?</h2>
            <p className="text-sm text-[#525C68]">
              This inquiry will be permanently removed from the lead database.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-[#D4DAE2] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = confirmDeleteId;
                  setConfirmDeleteId(null);
                  if (selectedInquiry?.id === id) setSelectedInquiry(null);
                  await deleteInquiry(id);
                }}
                className="px-4 py-2 bg-red-700 text-white text-xs font-semibold cursor-pointer"
              >
                Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
