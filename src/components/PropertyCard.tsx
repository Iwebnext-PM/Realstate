import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import type { Property } from '../types/realEstate';
import { formatCurrency } from '../lib/formatters';
import { PropertyImage } from './PropertyImage';

interface PropertyCardProps {
  property: Property;
  layout?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, layout = 'grid' }) => {
  const coverUrl = property.imageUrls[0];
  const coverAlt = property.imageAlts?.[0] || property.title;
  const priceDisplay = formatCurrency(property.price, property.listingType);
  const photoCount = property.imageUrls.length;

  const statusTextColor =
    property.status === 'Sold'
      ? 'bg-[#1E242B] text-white'
      : property.status === 'Pending'
        ? 'bg-[#9E7E38] text-white'
        : 'bg-[#0B1D33] text-white';

  if (layout === 'list') {
    return (
      <article className="bg-white border border-[#E2E6EC] hover:border-[#0B1D33]/35 transition-colors grid grid-cols-1 md:grid-cols-12 overflow-hidden group">
        <div className="md:col-span-5 relative aspect-[4/3] md:aspect-auto md:min-h-[250px] overflow-hidden bg-[#ECEFF3]">
          <PropertyImage
            src={coverUrl}
            alt={coverAlt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase ${statusTextColor}`}>
              {property.status}
            </span>
          </div>
          {photoCount > 1 && (
            <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/65 text-white text-[11px] font-mono-num">
              {photoCount} Photos
            </span>
          )}
        </div>

        <div className="md:col-span-7 p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs text-[#525C68]">
                <span className="font-semibold text-[#0B1D33]">{property.propertyType}</span>
                {property.featured && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-[#9E7E38]">Featured</span>
                  </>
                )}
              </div>
              <span className="font-mono-num text-xl font-semibold text-[#0B1D33]">
                {priceDisplay}
              </span>
            </div>

            <Link to={`/properties/${property.slug}`} className="block group-hover:text-[#9E7E38] transition-colors">
              <h3 className="font-display text-2xl font-semibold text-[#0B1D33] leading-snug mb-1.5">
                {property.title}
              </h3>
            </Link>

            <p className="flex items-center gap-1.5 text-sm text-[#525C68] mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#9E7E38] shrink-0" />
              <span>
                {property.address}, {property.city}
              </span>
            </p>

            <p className="text-sm text-[#525C68] line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E2E6EC] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1E242B] font-mono-num">
              <span>{property.bedrooms} Beds</span>
              <span aria-hidden="true" className="text-[#9AA3AE]">·</span>
              <span>{property.bathrooms} Baths</span>
              <span aria-hidden="true" className="text-[#9AA3AE]">·</span>
              <span>{property.sqft.toLocaleString()} sq ft</span>
            </div>

            <Link
              to={`/properties/${property.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View Property Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white border border-[#E2E6EC] hover:border-[#0B1D33]/35 transition-colors flex flex-col overflow-hidden group">
      <Link to={`/properties/${property.slug}`} className="relative aspect-[4/3] overflow-hidden bg-[#ECEFF3] block">
        <PropertyImage
          src={coverUrl}
          alt={coverAlt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase ${statusTextColor}`}>
            {property.status}
          </span>
        </div>
        {photoCount > 1 && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/65 text-white text-[11px] font-mono-num">
            {photoCount} Photos
          </span>
        )}
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#525C68] mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0B1D33]">{property.propertyType}</span>
              {property.featured && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#9E7E38]">Featured</span>
                </>
              )}
            </div>
            <span>{property.city}</span>
          </div>

          <div className="font-mono-num text-xl font-semibold text-[#0B1D33] mb-1.5">
            {priceDisplay}
          </div>

          <Link to={`/properties/${property.slug}`} className="block">
            <h3 className="font-display text-xl font-semibold text-[#0B1D33] leading-snug mb-2 group-hover:text-[#9E7E38] transition-colors line-clamp-2">
              {property.title}
            </h3>
          </Link>

          <p className="flex items-center gap-1.5 text-xs text-[#525C68]">
            <MapPin className="w-3.5 h-3.5 text-[#9E7E38] shrink-0" />
            <span className="truncate">{property.address}</span>
          </p>
        </div>

        <div className="pt-4 border-t border-[#E2E6EC] space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#1E242B] font-mono-num">
            <span>{property.bedrooms} Beds</span>
            <span aria-hidden="true" className="text-[#9AA3AE]">·</span>
            <span>{property.bathrooms} Baths</span>
            <span aria-hidden="true" className="text-[#9AA3AE]">·</span>
            <span>{property.sqft.toLocaleString()} sq ft</span>
          </div>

          <Link
            to={`/properties/${property.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B1D33] text-white text-xs font-semibold hover:bg-[#163254] transition-colors whitespace-nowrap"
          >
            <span>View Property Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
