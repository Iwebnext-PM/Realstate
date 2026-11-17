import React, { useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Maximize2,
  Phone,
  X,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { formatCurrency, formatPhoneDisplay, toTelHref } from '../lib/formatters';
import { buildPropertyJsonLd } from '../lib/seo';
import type { InquiryType } from '../types/realEstate';
import { DocumentHead } from '../components/DocumentHead';
import { InquiryForm } from '../components/InquiryForm';
import { LocationCard } from '../components/LocationCard';
import { PropertyImage } from '../components/PropertyImage';

export const PropertyDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { properties, allProperties, isAdmin, generalConfig, loadingProperties } = useSite();

  const property = useMemo(() => {
    const pool = isAdmin && allProperties.length > 0 ? allProperties : properties;
    return pool.find((p) => p.slug === slug || p.id === slug);
  }, [properties, allProperties, isAdmin, slug]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedInquiryType, setSelectedInquiryType] = useState<InquiryType>('Property Info');
  const inquirySectionRef = useRef<HTMLDivElement>(null);

  const handleRequestViewing = () => {
    setSelectedInquiryType('Schedule Viewing');
    inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const jsonLd = useMemo(
    () => (property ? buildPropertyJsonLd(property, generalConfig) : undefined),
    [property, generalConfig],
  );

  if (loadingProperties) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="h-[460px] bg-[#E2E6EC] animate-pulse mb-8" />
        <div className="h-10 bg-[#E2E6EC] w-1/2 animate-pulse mb-4" />
        <div className="h-6 bg-[#E2E6EC] w-1/3 animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold text-[#0B1D33] mb-3">
          Property Not Found
        </h1>
        <p className="text-sm text-[#525C68] mb-8">
          This listing may have been removed or is no longer publicly available.
        </p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1D33] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Property Listings</span>
        </Link>
      </div>
    );
  }

  const images = property.imageUrls.length > 0 ? property.imageUrls : [''];
  const currentIdx = Math.min(activeImageIdx, images.length - 1);

  return (
    <>
      <DocumentHead
        title={property.seoTitle || `${property.title} | ${generalConfig.businessName}`}
        description={property.seoDescription || property.description.slice(0, 155)}
        ogImage={images[0]}
        jsonLd={jsonLd}
      />

      <div className="bg-[#F8F9FA] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#525C68] hover:text-[#0B1D33] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Listings</span>
            </Link>
          </div>

          {/* HEADER SUMMARY */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 mb-8 border-b border-[#E2E6EC]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs mb-3">
                <span className="px-2.5 py-1 bg-[#0B1D33] text-white font-semibold uppercase tracking-wider">
                  {property.status}
                </span>
                <span className="font-semibold text-[#0B1D33]">{property.propertyType}</span>
                {property.featured && (
                  <>
                    <span aria-hidden="true" className="text-[#9AA3AE]">·</span>
                    <span className="font-semibold text-[#9E7E38]">Featured Listing</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0B1D33] text-balance mb-3">
                {property.title}
              </h1>

              <p className="flex items-center gap-2 text-sm sm:text-base text-[#525C68]">
                <MapPin className="w-4 h-4 text-[#9E7E38] shrink-0" />
                <span>
                  {property.address}, {property.city}
                  {property.neighborhood ? ` (${property.neighborhood})` : ''}
                </span>
              </p>
            </div>

            <div className="lg:text-right shrink-0">
              <p className="text-xs uppercase tracking-wider text-[#525C68] mb-1">
                {property.listingType === 'Rent' ? 'Monthly Lease' : 'Listing Price'}
              </p>
              <p className="font-mono-num text-3xl sm:text-4xl font-semibold text-[#0B1D33]">
                {formatCurrency(property.price, property.listingType)}
              </p>
            </div>
          </div>

          {/* GALLERY */}
          <div className="mb-12 space-y-3">
            <div className="relative aspect-[16/9] max-h-[580px] w-full bg-[#ECEFF3] border border-[#E2E6EC] overflow-hidden">
              <PropertyImage
                src={images[currentIdx]}
                alt={property.imageAlts?.[currentIdx] || property.title}
                priority
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/55 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setActiveImageIdx((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/55 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 bg-black/70 text-white text-xs font-medium hover:bg-black transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Fullscreen ({currentIdx + 1} / {images.length})</span>
              </button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {images.map((url, idx) => (
                  <button
                    key={url + idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-[4/3] overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === currentIdx
                        ? 'border-[#0B1D33] opacity-100'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <PropertyImage
                      src={url}
                      alt={property.imageAlts?.[idx] || `${property.title} photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MAIN CONTENT + CONTACT AGENT SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-10">
              {/* Key Specifications Strip */}
              <div className="bg-white border border-[#E2E6EC] grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E6EC]">
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    Bedrooms
                  </p>
                  <p className="font-mono-num text-xl font-semibold text-[#0B1D33]">
                    {property.bedrooms}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    Bathrooms
                  </p>
                  <p className="font-mono-num text-xl font-semibold text-[#0B1D33]">
                    {property.bathrooms}
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    Square Footage
                  </p>
                  <p className="font-mono-num text-xl font-semibold text-[#0B1D33]">
                    {property.sqft.toLocaleString()} sq ft
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    {property.yearBuilt && property.yearBuilt > 0 ? 'Year Built' : 'Category'}
                  </p>
                  <p className="font-mono-num text-xl font-semibold text-[#0B1D33]">
                    {property.yearBuilt && property.yearBuilt > 0 ? property.yearBuilt : property.propertyType}
                  </p>
                </div>
              </div>

              {/* Property Description */}
              <div className="bg-white border border-[#E2E6EC] p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-[#0B1D33] mb-4">
                  Property Overview
                </h2>
                <p className="text-sm sm:text-base text-[#1E242B] leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>

                <dl className="mt-8 pt-6 border-t border-[#E2E6EC] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                      Property Type
                    </dt>
                    <dd className="text-[#0B1D33] font-medium mt-1">{property.propertyType}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                      Parking Information
                    </dt>
                    <dd className="text-[#0B1D33] font-medium mt-1 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-[#9E7E38]" />
                      <span>{property.parking || 'Available upon request'}</span>
                    </dd>
                  </div>
                  {property.yearBuilt && property.yearBuilt > 0 ? (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                        Year Built
                      </dt>
                      <dd className="text-[#0B1D33] font-medium font-mono-num mt-1">
                        {property.yearBuilt}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                      Listing Status
                    </dt>
                    <dd className="text-[#0B1D33] font-medium mt-1">{property.status}</dd>
                  </div>
                </dl>
              </div>

              {/* Features & Amenities */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white border border-[#E2E6EC] p-6 sm:p-8">
                  <h2 className="font-display text-2xl font-semibold text-[#0B1D33] mb-5">
                    Features &amp; Highlights
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {property.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#1E242B]">
                        <Check className="w-4 h-4 text-[#9E7E38] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Location Card */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#0B1D33] mb-4">
                  Property Location
                </h2>
                <LocationCard
                  title={property.neighborhood || property.city}
                  address={`${property.address}, ${property.city}`}
                  subtitle="View neighborhood surroundings and driving directions."
                  lat={property.lat}
                  lng={property.lng}
                />
              </div>
            </div>

            {/* CONTACT AGENT & INQUIRY SIDEBAR */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-[#0B1D33] text-white p-6 sm:p-7 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-1">
                    Listing Representation
                  </p>
                  <h2 className="font-display text-2xl font-semibold text-white">
                    {generalConfig.businessName}
                  </h2>
                </div>

                <div className="space-y-2.5 text-sm text-slate-200 border-y border-white/15 py-4">
                  <div className="flex items-center gap-2.5 font-mono-num">
                    <Phone className="w-4 h-4 text-[#D4B773]" />
                    <span>{formatPhoneDisplay(generalConfig.phone)}</span>
                  </div>
                  <div className="flex items-center gap-2.5 break-all">
                    <Mail className="w-4 h-4 text-[#D4B773]" />
                    <span>{generalConfig.email}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleRequestViewing}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#B59449] text-[#0B1D33] text-xs font-semibold hover:bg-[#C9A85B] transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Request a Viewing</span>
                  </button>
                  <a
                    href={toTelHref(generalConfig.phone)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#0B1D33] text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`mailto:${generalConfig.email}?subject=${encodeURIComponent(`Inquiry: ${property.title}`)}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Agent</span>
                  </a>
                </div>
              </div>

              <div ref={inquirySectionRef}>
                <InquiryForm
                  defaultInquiryType={selectedInquiryType}
                  externalSelectedType={selectedInquiryType}
                  allowInquiryTypeSelect
                  propertyId={property.id}
                  propertyTitle={property.title}
                  propertyAddress={`${property.address}, ${property.city}`}
                  heading="Inquire About This Property"
                  subheading="Request floor plans, availability, or schedule a private showing."
                  submitLabel="Submit Property Inquiry"
                />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Property image gallery"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-11 h-11 bg-white/10 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 w-11 h-11 bg-white/10 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
            <img
              src={images[currentIdx]}
              alt={property.imageAlts?.[currentIdx] || property.title}
              referrerPolicy="no-referrer"
              className="max-h-[78vh] w-auto object-contain"
            />
            <p className="text-xs text-slate-300 mt-3 font-mono-num">
              {currentIdx + 1} / {images.length} — {property.imageAlts?.[currentIdx] || property.title}
            </p>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setActiveImageIdx((prev) => (prev + 1) % images.length)}
              className="absolute right-4 w-11 h-11 bg-white/10 text-white flex items-center justify-center hover:bg-white/25 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
};
