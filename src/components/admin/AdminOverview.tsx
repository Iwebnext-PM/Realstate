import React from 'react';
import { ArrowRight, Building2, CheckCircle2, Mail, Plus, Sparkles } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { formatDateDisplay } from '../../lib/formatters';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
  onCreateProperty: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigateTab,
  onCreateProperty,
}) => {
  const { allProperties, inquiries, seedStarterPortfolio } = useSite();
  const [seeding, setSeeding] = React.useState(false);

  const totalProperties = allProperties.length;
  const activeListings = allProperties.filter(
    (p) => p.published && (p.status === 'For Sale' || p.status === 'For Rent'),
  ).length;
  const soldProperties = allProperties.filter((p) => p.status === 'Sold').length;
  const rentalListings = allProperties.filter(
    (p) => p.listingType === 'Rent' || p.status === 'For Rent',
  ).length;
  const featuredProperties = allProperties.filter((p) => p.featured).length;
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;

  const recentInquiries = inquiries.slice(0, 6);

  const metrics = [
    { label: 'Total Properties', value: totalProperties },
    { label: 'Active Listings', value: activeListings },
    { label: 'Sold Properties', value: soldProperties },
    { label: 'Rental Listings', value: rentalListings },
    { label: 'Featured Properties', value: featuredProperties },
    { label: 'Total Inquiries', value: totalInquiries },
    { label: 'New Inquiries', value: newInquiries, highlight: newInquiries > 0 },
  ];

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedStarterPortfolio();
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#0B1D33]">
            Dashboard Overview
          </h1>
          <p className="text-sm text-[#525C68] mt-1">
            Live portfolio metrics, active listings summary, and recent lead submissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {totalProperties === 0 && (
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeed}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#0B1D33] text-xs font-semibold text-[#0B1D33] hover:bg-[#F1F3F6] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{seeding ? 'Seeding...' : 'Load Starter Listings'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onCreateProperty}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Property</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`bg-white border p-4 ${
              m.highlight ? 'border-[#B59449]' : 'border-[#E2E6EC]'
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-2">
              {m.label}
            </p>
            <p className="font-mono-num text-2xl font-semibold text-[#0B1D33]">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white border border-[#E2E6EC]">
        <div className="px-6 py-4 border-b border-[#E2E6EC] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#9E7E38]" />
            <h2 className="text-base font-semibold text-[#0B1D33]">Recent Lead Submissions</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('inquiries')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1D33] hover:text-[#9E7E38] cursor-pointer"
          >
            <span>Manage All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#525C68]">
            No inquiries received yet. Submissions from property pages, valuation forms, and the contact page appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FA] border-b border-[#E2E6EC] text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Inquiry Type</th>
                  <th className="px-6 py-3">Property / Subject</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6EC]">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#F8F9FA]">
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-[#0B1D33]">{inq.name}</p>
                      <p className="text-xs text-[#525C68]">{inq.email}</p>
                    </td>
                    <td className="px-6 py-3.5 text-xs font-medium text-[#1E242B]">
                      {inq.inquiryType}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#525C68] max-w-xs truncate">
                      {inq.propertyTitle || inq.propertyAddress || inq.subject || 'General Inquiry'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase ${
                          inq.status === 'new'
                            ? 'bg-amber-100 text-amber-900'
                            : inq.status === 'contacted'
                              ? 'bg-slate-200 text-[#0B1D33]'
                              : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-xs font-mono-num text-[#525C68]">
                      {formatDateDisplay(inq.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E2E6EC] p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1D33]">
            <Building2 className="w-4 h-4 text-[#9E7E38]" />
            <span>Quick Navigation</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigateTab('properties')}
              className="p-3 border border-[#E2E6EC] text-left text-xs font-semibold text-[#0B1D33] hover:border-[#0B1D33] cursor-pointer"
            >
              Manage Properties →
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('content')}
              className="p-3 border border-[#E2E6EC] text-left text-xs font-semibold text-[#0B1D33] hover:border-[#0B1D33] cursor-pointer"
            >
              Edit Site Content →
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('media')}
              className="p-3 border border-[#E2E6EC] text-left text-xs font-semibold text-[#0B1D33] hover:border-[#0B1D33] cursor-pointer"
            >
              Upload Media →
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('seo')}
              className="p-3 border border-[#E2E6EC] text-left text-xs font-semibold text-[#0B1D33] hover:border-[#0B1D33] cursor-pointer"
            >
              SEO &amp; Sitemap →
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E2E6EC] p-6 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1D33]">
            <CheckCircle2 className="w-4 h-4 text-[#9E7E38]" />
            <span>Real-Time Publishing</span>
          </div>
          <p className="text-xs text-[#525C68] leading-relaxed">
            Every property listing, testimonial, hero update, SEO metadata change, and general setting saved in this console synchronizes immediately with Cloud Firestore and updates the live public website.
          </p>
        </div>
      </div>
    </div>
  );
};
