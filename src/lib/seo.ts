import type { Property, SiteGeneralConfig, SiteSeoConfig } from '../types/realEstate';

export function buildSitemapXml(
  baseUrl: string,
  properties: Property[],
  seo: SiteSeoConfig,
): string {
  const origin = (baseUrl || (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/+$/, '');
  const staticPaths = [
    { path: seo.pages.home.slug || '/', priority: '1.0', freq: 'weekly' },
    { path: seo.pages.properties.slug || '/properties', priority: '0.9', freq: 'daily' },
    { path: seo.pages.buying.slug || '/buying', priority: '0.8', freq: 'monthly' },
    { path: seo.pages.selling.slug || '/selling', priority: '0.8', freq: 'monthly' },
    { path: seo.pages.about.slug || '/about', priority: '0.7', freq: 'monthly' },
    { path: seo.pages.contact.slug || '/contact', priority: '0.8', freq: 'monthly' },
  ];

  const publishedProps = properties.filter((p) => p.published);
  const urls = [
    ...staticPaths.map(
      (item) =>
        `  <url>\n    <loc>${escapeXml(`${origin}${item.path}`)}</loc>\n    <changefreq>${item.freq}</changefreq>\n    <priority>${item.priority}</priority>\n  </url>`,
    ),
    ...publishedProps.map(
      (p) =>
        `  <url>\n    <loc>${escapeXml(`${origin}/properties/${p.slug}`)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
}

export function buildAgentJsonLd(general: SiteGeneralConfig): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: general.businessName,
    telephone: general.phone,
    email: general.email,
    ...(general.businessLocation ? { address: general.businessLocation } : {}),
    description: general.footerDescription,
  };
}

export function buildPropertyJsonLd(property: Property, general: SiteGeneralConfig): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: typeof window !== 'undefined' ? window.location.href : `/properties/${property.slug}`,
    image: property.imageUrls,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability:
        property.status === 'Sold'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      seller: {
        '@type': 'RealEstateAgent',
        name: general.businessName,
        telephone: general.phone,
        email: general.email,
      },
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.city,
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.sqft,
      unitCode: 'FTK',
    },
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
