import React from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

interface LocationCardProps {
  title: string;
  address: string;
  subtitle?: string;
  lat?: number;
  lng?: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  title,
  address,
  subtitle,
  lat,
  lng,
}) => {
  const hasAddress = Boolean(address && address.trim().length > 0);
  const query = hasAddress
    ? encodeURIComponent(address)
    : lat !== undefined && lng !== undefined
      ? `${lat},${lng}`
      : '';
  const mapsUrl = query ? `https://www.google.com/maps/search/?api=1&query=${query}` : '';

  return (
    <div className="bg-white border border-[#E2E6EC] overflow-hidden">
      {/* Clean Architectural Locator Visual */}
      <div className="relative h-56 bg-[#EEF2F6] border-b border-[#E2E6EC] flex items-center justify-center overflow-hidden">
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-40"
          viewBox="0 0 600 240"
          fill="none"
        >
          <path d="M0 60H600M0 120H600M0 180H600" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M120 0V240M240 0V240M360 0V240M480 0V240" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M0 200L220 120L410 140L600 45" stroke="#94A3B8" strokeWidth="2" />
          <path d="M180 0L270 240" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="300" cy="120" r="44" stroke="#B59449" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="w-11 h-11 bg-[#0B1D33] text-[#D4B773] flex items-center justify-center mb-3 shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="font-display text-xl font-semibold text-[#0B1D33]">{title}</p>
          <p className="text-sm text-[#525C68] mt-0.5">
            {hasAddress ? address : 'Location details managed in Admin Settings'}
          </p>
          {lat !== undefined && lng !== undefined && (
            <p className="text-[11px] font-mono-num text-[#64748B] mt-1">
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#0B1D33]">
            {hasAddress ? address : 'Address Not Yet Specified'}
          </p>
          {subtitle && <p className="text-xs text-[#525C68] mt-0.5">{subtitle}</p>}
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#0B1D33] text-xs font-semibold text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
