import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface PropertyImageProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const PropertyImage: React.FC<PropertyImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1D33] via-[#152D4A] to-[#1E242B] text-white/80 p-6 text-center ${className}`}
      >
        <Building2 className="w-8 h-8 text-[#D4B773] mb-2" />
        <span className="text-xs font-medium tracking-wide text-slate-200 line-clamp-2 max-w-[220px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
