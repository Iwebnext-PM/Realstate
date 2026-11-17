import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { DocumentHead } from '../components/DocumentHead';
import { PropertyCard } from '../components/PropertyCard';

type SortOption = 'newest' | 'price-asc' | 'price-desc';

export const PropertiesPage: React.FC = () => {
  const { properties, loadingProperties, seoConfig } = useSite();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(searchParams.get('type') || '');
  const [listingTypeFilter, setListingTypeFilter] = useState(searchParams.get('listingType') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minBeds, setMinBeds] = useState(searchParams.get('beds') || '');
  const [minBaths, setMinBaths] = useState(searchParams.get('baths') || '');
  const [minSqft, setMinSqft] = useState(searchParams.get('minSqft') || '');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Keep in sync when navigated with query params from homepage or footer
  useEffect(() => {
    setLocationFilter(searchParams.get('location') || '');
    setPropertyTypeFilter(searchParams.get('type') || '');
    setListingTypeFilter(searchParams.get('listingType') || '');
    setStatusFilter(searchParams.get('status') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setMinBeds(searchParams.get('beds') || '');
    setMinBaths(searchParams.get('baths') || '');
    setMinSqft(searchParams.get('minSqft') || '');
  }, [searchParams]);

  const resetFilters = () => {
    setLocationFilter('');
    setPropertyTypeFilter('');
    setListingTypeFilter('');
    setStatusFilter('');
    setMinPrice('');
    setMaxPrice('');
    setMinBeds('');
    setMinBaths('');
    setMinSqft('');
    setSortBy('newest');
    setSearchParams({});
  };

  const filteredProperties = useMemo(() => {
    const loc = locationFilter.trim().toLowerCase();
    const minP = minPrice ? Number(minPrice) : null;
    const maxP = maxPrice ? Number(maxPrice) : null;
    const beds = minBeds ? Number(minBeds) : null;
    const baths = minBaths ? Number(minBaths) : null;
    const sqft = minSqft ? Number(minSqft) : null;

    const list = properties.filter((p) => {
      if (loc) {
        const haystack = `${p.address} ${p.city} ${p.neighborhood || ''} ${p.title}`.toLowerCase();
        if (!haystack.includes(loc)) return false;
      }
      if (propertyTypeFilter && p.propertyType !== propertyTypeFilter) return false;
      if (listingTypeFilter && p.listingType !== listingTypeFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (minP !== null && Number.isFinite(minP) && p.price < minP) return false;
      if (maxP !== null && Number.isFinite(maxP) && p.price > maxP) return false;
      if (beds !== null && Number.isFinite(beds) && p.bedrooms < beds) return false;
      if (baths !== null && Number.isFinite(baths) && p.bathrooms < baths) return false;
      if (sqft !== null && Number.isFinite(sqft) && p.sqft < sqft) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [
    properties,
    locationFilter,
    propertyTypeFilter,
    listingTypeFilter,
    statusFilter,
    minPrice,
    maxPrice,
    minBeds,
    minBaths,
    minSqft,
    sortBy,
  ]);

  const hasActiveFilters = Boolean(
    locationFilter ||
      propertyTypeFilter ||
      listingTypeFilter ||
      statusFilter ||
      minPrice ||
      maxPrice ||
      minBeds ||
      minBaths ||
      minSqft,
  );

  return (
    <>
      <DocumentHead
        title={seoConfig.pages.properties.title}
        description={seoConfig.pages.properties.description}
      />

      <div className="bg-[#0B1D33] text-white py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-2">
            Portfolio Directory
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white text-balance mb-3">
            Property Listings
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Browse active residences, rentals, commercial spaces, and investment opportunities. Refine by price, size, location, or status.
          </p>
        </div>
      </div>

      <section className="py-10 bg-[#F8F9FA] min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Advanced Filters Card */}
          <div className="bg-white border border-[#E2E6EC] p-5 sm:p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E6EC]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#0B1D33]">
                <SlidersHorizontal className="w-4 h-4 text-[#9E7E38]" />
                <span>Advanced Search &amp; Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E7E38] hover:text-[#0B1D33] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="flt-location" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Location
                </label>
                <input
                  id="flt-location"
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="City, neighborhood, address"
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
                />
              </div>

              <div>
                <label htmlFor="flt-type" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Property Type
                </label>
                <select
                  id="flt-type"
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">All Property Types</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo &amp; Apartment</option>
                  <option value="Luxury">Luxury Property</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div>
                <label htmlFor="flt-buy-rent" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Buy or Rent
                </label>
                <select
                  id="flt-buy-rent"
                  value={listingTypeFilter}
                  onChange={(e) => setListingTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">All (Buy &amp; Rent)</option>
                  <option value="Sale">Buy (For Sale)</option>
                  <option value="Rent">Rent (For Lease)</option>
                </select>
              </div>

              <div>
                <label htmlFor="flt-status" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Listing Status
                </label>
                <select
                  id="flt-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">All Statuses</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Pending">Pending</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="flt-min-price" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    Min Price
                  </label>
                  <input
                    id="flt-min-price"
                    type="number"
                    min={0}
                    step={25000}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="$0"
                    className="w-full px-2.5 py-2 border border-[#D4DAE2] text-sm font-mono-num text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
                  />
                </div>
                <div>
                  <label htmlFor="flt-max-price" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                    Max Price
                  </label>
                  <input
                    id="flt-max-price"
                    type="number"
                    min={0}
                    step={25000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="No max"
                    className="w-full px-2.5 py-2 border border-[#D4DAE2] text-sm font-mono-num text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="flt-beds" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Bedrooms
                </label>
                <select
                  id="flt-beds"
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">Any Bedrooms</option>
                  <option value="1">1+ Bedrooms</option>
                  <option value="2">2+ Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>

              <div>
                <label htmlFor="flt-baths" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Bathrooms
                </label>
                <select
                  id="flt-baths"
                  value={minBaths}
                  onChange={(e) => setMinBaths(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm text-[#1E242B] bg-white focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="">Any Bathrooms</option>
                  <option value="1">1+ Bathrooms</option>
                  <option value="2">2+ Bathrooms</option>
                  <option value="3">3+ Bathrooms</option>
                  <option value="4">4+ Bathrooms</option>
                </select>
              </div>

              <div>
                <label htmlFor="flt-sqft" className="block text-[11px] font-semibold uppercase tracking-wider text-[#525C68] mb-1">
                  Min Property Size (sq ft)
                </label>
                <input
                  id="flt-sqft"
                  type="number"
                  min={0}
                  step={250}
                  value={minSqft}
                  onChange={(e) => setMinSqft(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 border border-[#D4DAE2] text-sm font-mono-num text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
                />
              </div>
            </div>
          </div>

          {/* Results Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-sm text-[#525C68] font-mono-num">
              Showing <strong className="text-[#0B1D33]">{filteredProperties.length}</strong>{' '}
              {filteredProperties.length === 1 ? 'property' : 'properties'}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sort-listings" className="text-xs font-medium text-[#525C68] whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort-listings"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-[#D4DAE2] bg-white text-xs font-semibold text-[#0B1D33] focus:outline-none focus:border-[#0B1D33]"
                >
                  <option value="newest">Newest Listings</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              <div className="flex items-center border border-[#D4DAE2] bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`p-2 transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#0B1D33] text-white'
                      : 'text-[#525C68] hover:text-[#0B1D33]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`p-2 transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-[#0B1D33] text-white'
                      : 'text-[#525C68] hover:text-[#0B1D33]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid / List / Empty State */}
          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white border border-[#E2E6EC] h-[430px] animate-pulse">
                  <div className="aspect-[4/3] bg-[#E2E6EC]" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-[#E2E6EC] w-1/3" />
                    <div className="h-6 bg-[#E2E6EC] w-3/4" />
                    <div className="h-4 bg-[#E2E6EC] w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="bg-white border border-[#E2E6EC] p-12 text-center">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33] mb-2">
                No Properties Match Your Current Filters
              </h2>
              <p className="text-sm text-[#525C68] max-w-md mx-auto mb-6">
                Try broadening your price range, bedroom requirement, or location keywords to view additional available listings.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} layout="list" />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
