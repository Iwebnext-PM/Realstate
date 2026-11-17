import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Home,
  KeyRound,
  Landmark,
  Mail,
  Phone,
  Search,
  Star,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { GENERATED_IMAGES } from '../data/defaultData';
import { formatPhoneDisplay, toTelHref } from '../lib/formatters';
import { buildAgentJsonLd } from '../lib/seo';
import { DocumentHead } from '../components/DocumentHead';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyImage } from '../components/PropertyImage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    properties,
    testimonials,
    generalConfig,
    contentConfig,
    seoConfig,
    loadingProperties,
  } = useSite();

  // Hero search state
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [listingType, setListingType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (propertyType) params.set('type', propertyType);
    if (listingType) params.set('listingType', listingType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('beds', bedrooms);
    navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const featuredProperties = useMemo(() => {
    const flagged = properties.filter((p) => p.featured);
    if (flagged.length > 0) return flagged.slice(0, 6);
    return properties.slice(0, 3);
  }, [properties]);

  const categoryCards = [
    {
      title: 'Houses',
      type: 'House',
      subtitle: 'Detached & semi-detached family residences',
      image: GENERATED_IMAGES.modernVilla,
      icon: Home,
    },
    {
      title: 'Condos & Apartments',
      type: 'Condo',
      subtitle: 'Skyline residences & urban suites',
      image: GENERATED_IMAGES.waterfrontCondo,
      icon: Building2,
    },
    {
      title: 'Luxury Properties',
      type: 'Luxury',
      subtitle: 'Architectural estates & bespoke residences',
      image: GENERATED_IMAGES.heroEstate,
      icon: Landmark,
    },
    {
      title: 'Townhouses',
      type: 'Townhouse',
      subtitle: 'Multi-level urban & neighborhood townhomes',
      image: GENERATED_IMAGES.townhouseRow,
      icon: KeyRound,
    },
    {
      title: 'Commercial Properties',
      type: 'Commercial',
      subtitle: 'Retail storefronts, offices & mixed-use buildings',
      image: GENERATED_IMAGES.commercialLoft,
      icon: Warehouse,
    },
    {
      title: 'Investment Properties',
      type: 'Investment',
      subtitle: 'Income-oriented residential & multi-unit assets',
      image: GENERATED_IMAGES.penthouseInterior,
      icon: TrendingUp,
    },
  ];

  const pillars = [
    {
      num: '01',
      title: 'Personalized Property Guidance',
      desc: 'Recommendations tailored strictly to your budget, neighborhood preferences, and long-term plans.',
    },
    {
      num: '02',
      title: 'Professional Communication',
      desc: 'Direct, timely updates from Frank Fu Feng so you never have to chase answers during critical decisions.',
    },
    {
      num: '03',
      title: 'Buyer & Seller Assistance',
      desc: 'Structured end-to-end support whether preparing a property for market or negotiating a purchase.',
    },
    {
      num: '04',
      title: 'Local Market Insights',
      desc: 'Clear comparable sales context, neighborhood inventory trends, and practical pricing perspective.',
    },
    {
      num: '05',
      title: 'Dedicated Customer Support',
      desc: 'Attentive scheduling for private viewings, document review coordination, and closing follow-through.',
    },
    {
      num: '06',
      title: 'Transparent Property Information',
      desc: 'Straightforward property disclosures, accurate specifications, and honest assessments without pressure.',
    },
  ];

  const agentJsonLd = useMemo(() => buildAgentJsonLd(generalConfig), [generalConfig]);

  return (
    <>
      <DocumentHead
        title={seoConfig.pages.home.title}
        description={seoConfig.pages.home.description}
        ogImage={contentConfig.heroImageUrl || seoConfig.ogImageUrl}
        jsonLd={agentJsonLd}
      />

      {/* HERO SECTION */}
      <section className="relative bg-[#0B1D33] text-white overflow-hidden">
        <div className="absolute inset-0">
          <PropertyImage
            src={contentConfig.heroImageUrl || GENERATED_IMAGES.heroEstate}
            alt={contentConfig.heroImageAlt || 'Luxury contemporary real estate exterior'}
            priority
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D33]/80 via-[#0B1D33]/60 to-[#0B1D33]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4B773] mb-4">
              {generalConfig.businessName}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-white text-balance mb-5">
              {contentConfig.heroHeadline}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8">
              {contentConfig.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#B59449] text-[#0B1D33] text-sm font-semibold hover:bg-[#C9A85B] transition-colors whitespace-nowrap"
              >
                <span>Contact Agent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={toTelHref(generalConfig.phone)}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/35 bg-white/10 backdrop-blur-xs text-white text-sm font-medium hover:bg-white/20 transition-colors whitespace-nowrap font-mono-num"
              >
                <Phone className="w-4 h-4 text-[#D4B773]" />
                <span>{formatPhoneDisplay(generalConfig.phone)}</span>
              </a>
            </div>
          </div>

          {/* PROMINENT PROPERTY SEARCH BAR */}
          <form
            onSubmit={handleHeroSearch}
            aria-label="Search Properties"
            className="bg-white text-[#1E242B] p-4 sm:p-6 shadow-xl border border-[#E2E6EC]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="lg:col-span-2">
                <label htmlFor="hero-location" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Location
                </label>
                <input
                  id="hero-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, neighborhood, or street"
                  className="w-full px-3 py-2.5 border border-[#D4DAE2] text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
                />
              </div>

              <div>
                <label htmlFor="hero-type" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Property Type
                </label>
                <select
                  id="hero-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">All Types</option>
                  <option value="House">Houses</option>
                  <option value="Condo">Condos &amp; Apartments</option>
                  <option value="Luxury">Luxury Properties</option>
                  <option value="Townhouse">Townhouses</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div>
                <label htmlFor="hero-listing-type" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Buy / Rent
                </label>
                <select
                  id="hero-listing-type"
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">Buy or Rent</option>
                  <option value="Sale">Buy</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              <div>
                <label htmlFor="hero-beds" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Bedrooms
                </label>
                <select
                  id="hero-beds"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">Any Beds</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="hero-min-price" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    Min Price
                  </label>
                  <input
                    id="hero-min-price"
                    type="number"
                    min={0}
                    step={50000}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="$ Min"
                    className="w-full px-2.5 py-2.5 border border-[#D4DAE2] text-sm font-mono-num text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
                  />
                </div>
                <div>
                  <label htmlFor="hero-max-price" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    Max Price
                  </label>
                  <input
                    id="hero-max-price"
                    type="number"
                    min={0}
                    step={50000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="$ Max"
                    className="w-full px-2.5 py-2.5 border border-[#D4DAE2] text-sm font-mono-num text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E2E6EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-[#525C68]">
                Search available residential, condominium, commercial, and rental listings.
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#0B1D33] text-white text-sm font-semibold hover:bg-[#163254] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Properties</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#E2E6EC]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-2">
                Curated Portfolio
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1D33] text-balance">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1D33] hover:text-[#9E7E38] transition-colors whitespace-nowrap"
            >
              <span>Browse All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="bg-white border border-[#E2E6EC] h-[440px] animate-pulse">
                  <div className="aspect-[4/3] bg-[#E2E6EC]" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-[#E2E6EC] w-1/3" />
                    <div className="h-6 bg-[#E2E6EC] w-3/4" />
                    <div className="h-4 bg-[#E2E6EC] w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="bg-white border border-[#E2E6EC] p-12 text-center">
              <h3 className="font-display text-2xl font-semibold text-[#0B1D33] mb-2">
                New Listings Coming Soon
              </h3>
              <p className="text-sm text-[#525C68] max-w-md mx-auto mb-6">
                Contact Frank Fu Feng directly for upcoming and private residential or commercial opportunities.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1D33] text-white text-xs font-semibold"
              >
                Contact Frank Fu Feng
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EXPLORE PROPERTIES BY CATEGORY */}
      <section className="py-16 sm:py-24 bg-white border-y border-[#E2E6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-2">
              Property Categories
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1D33] text-balance mb-3">
              Explore Properties by Type
            </h2>
            <p className="text-sm sm:text-base text-[#525C68] leading-relaxed">
              Whether seeking a primary residence, urban condominium, townhouse lease, or commercial investment, filter directly to the property class that fits your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((cat) => {
              const Icon = cat.icon;
              const count = properties.filter((p) => p.propertyType === cat.type).length;
              return (
                <Link
                  key={cat.type}
                  to={`/properties?type=${encodeURIComponent(cat.type)}`}
                  className="group relative aspect-[4/3] overflow-hidden bg-[#0B1D33] border border-[#E2E6EC] block"
                >
                  <PropertyImage
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D33]/90 via-[#0B1D33]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Icon className="w-5 h-5 text-[#D4B773]" />
                      <span className="text-xs font-mono-num text-slate-200">
                        {count} {count === 1 ? 'Listing' : 'Listings'}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-semibold text-white mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-200">{cat.subtitle}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-2">
                Why Work With Us
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1D33] text-balance mb-4">
                {contentConfig.whyWorkWithUsTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#525C68] leading-relaxed mb-6">
                {contentConfig.whyWorkWithUsSubtitle}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1D33] hover:text-[#9E7E38] transition-colors"
              >
                <span>Learn About Frank Fu Feng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.num}
                  className="bg-white border border-[#E2E6EC] p-6 space-y-2.5"
                >
                  <span className="font-mono-num text-xs font-semibold text-[#9E7E38]">
                    {pillar.num}
                  </span>
                  <h3 className="text-lg font-semibold text-[#0B1D33]">{pillar.title}</h3>
                  <p className="text-sm text-[#525C68] leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BUYING, SELLING & INVESTMENT SECTIONS */}
      <section className="py-16 sm:py-24 bg-[#0B1D33] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-2">
              Advisory Services
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white text-balance">
              Tailored Pathways for Buyers, Sellers &amp; Investors
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border border-white/15 bg-[#102742] p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="font-mono-num text-xs text-[#D4B773] mb-3">01 · ACQUISITION</p>
                <h3 className="font-display text-2xl font-semibold text-white mb-3">
                  Looking to Buy?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Explore neighborhoods with clear comparable pricing, coordinated private viewings, thorough condition reviews, and disciplined offer strategy.
                </p>
              </div>
              <Link
                to="/buying"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#0B1D33] text-xs font-semibold hover:bg-[#D4B773] transition-colors whitespace-nowrap"
              >
                <span>Explore Buyer Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="border border-white/15 bg-[#102742] p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="font-mono-num text-xs text-[#D4B773] mb-3">02 · DISPOSITION</p>
                <h3 className="font-display text-2xl font-semibold text-white mb-3">
                  Thinking of Selling?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Request a property valuation, prepare your home for maximum presentation, and benefit from structured buyer vetting and skilled negotiation.
                </p>
              </div>
              <Link
                to="/selling"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#B59449] text-[#0B1D33] text-xs font-semibold hover:bg-[#C9A85B] transition-colors whitespace-nowrap"
              >
                <span>Request Property Valuation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="border border-white/15 bg-[#102742] p-8 flex flex-col justify-between gap-6">
              <div>
                <p className="font-mono-num text-xs text-[#D4B773] mb-3">03 · PORTFOLIO</p>
                <h3 className="font-display text-2xl font-semibold text-white mb-3">
                  Real Estate Investment?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Evaluate residential income suites, mixed-use storefronts, and commercial opportunities grounded in tenant demand and long-term fundamentals.
                </p>
              </div>
              <Link
                to="/properties?type=Investment"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-white/30 text-white text-xs font-semibold hover:bg-white hover:text-[#0B1D33] transition-colors whitespace-nowrap"
              >
                <span>View Investment Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-16 sm:py-24 bg-white border-b border-[#E2E6EC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-2">
                  Client Perspectives
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1D33]">
                  Testimonials
                </h2>
              </div>
              {testimonials.some((t) => t.isPlaceholder) && (
                <p className="text-xs text-[#525C68] max-w-md">
                  Note: Items labeled “Sample Placeholder” are demonstration entries editable or replaceable with verified client reviews in the Admin Dashboard.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#F8F9FA] border border-[#E2E6EC] p-7 flex flex-col justify-between gap-6"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < t.rating
                                ? 'text-[#B59449] fill-[#B59449]'
                                : 'text-[#CBD5E1]'
                            }`}
                          />
                        ))}
                      </div>
                      {t.isPlaceholder && (
                        <span className="text-[11px] font-medium text-[#64748B]">
                          Sample Placeholder
                        </span>
                      )}
                    </div>
                    <blockquote className="text-sm text-[#1E242B] leading-relaxed">
                      “{t.quote}”
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t border-[#E2E6EC]">
                    <p className="text-sm font-semibold text-[#0B1D33]">{t.clientName}</p>
                    <p className="text-xs text-[#525C68]">{t.clientRole}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E2E6EC] p-8 sm:p-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-3">
              Personal Real Estate Advisory
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1D33] text-balance mb-4">
              {contentConfig.ctaHeadline}
            </h2>
            <p className="text-sm sm:text-base text-[#525C68] max-w-xl mx-auto leading-relaxed mb-8">
              {contentConfig.ctaSubtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0B1D33] text-white text-sm font-semibold hover:bg-[#163254] transition-colors whitespace-nowrap"
              >
                <span>Contact Frank Fu Feng</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={toTelHref(generalConfig.phone)}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#D4DAE2] bg-white text-[#0B1D33] text-sm font-semibold hover:border-[#0B1D33] transition-colors whitespace-nowrap font-mono-num"
              >
                <Phone className="w-4 h-4 text-[#9E7E38]" />
                <span>{formatPhoneDisplay(generalConfig.phone)}</span>
              </a>
              <a
                href={`mailto:${generalConfig.email}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#D4DAE2] bg-white text-[#0B1D33] text-sm font-semibold hover:border-[#0B1D33] transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-[#9E7E38]" />
                <span>{generalConfig.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
