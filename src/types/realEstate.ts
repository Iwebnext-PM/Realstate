export type ListingType = 'Sale' | 'Rent';

export type PropertyCategory =
  | 'House'
  | 'Condo'
  | 'Luxury'
  | 'Townhouse'
  | 'Commercial'
  | 'Investment';

export type ListingStatus = 'For Sale' | 'For Rent' | 'Sold' | 'Pending';

export type InquiryType =
  | 'Property Info'
  | 'Schedule Viewing'
  | 'Availability'
  | 'Property Valuation'
  | 'General Contact';

export type InquiryStatus = 'new' | 'contacted' | 'completed';

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyCategory;
  status: ListingStatus;
  featured: boolean;
  published: boolean;
  address: string;
  city: string;
  neighborhood?: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt?: number;
  parking?: string;
  features?: string[];
  imageUrls: string[];
  imageAlts?: string[];
  lat?: number;
  lng?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyAddress?: string;
  propertyType?: string;
  inquiryType: InquiryType;
  subject?: string;
  message: string;
  status: InquiryStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  rating: number;
  quote: string;
  isPlaceholder: boolean;
  published: boolean;
  sortOrder?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface SocialLinks {
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
  wechat: string;
}

export interface SiteGeneralConfig {
  businessName: string;
  phone: string;
  email: string;
  businessLocation: string;
  mapLat?: number;
  mapLng?: number;
  logoText: string;
  logoImageUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  socialLinks: SocialLinks;
  footerDescription: string;
  copyrightText: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface SiteContentConfig {
  hasSeededStarter?: boolean;
  heroHeadline: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroImageAlt: string;
  whyWorkWithUsTitle: string;
  whyWorkWithUsSubtitle: string;
  ctaHeadline: string;
  ctaSubtitle: string;
  aboutHeadline: string;
  aboutBio: string;
  aboutPhilosophy: string;
  aboutApproach: string;
  aboutCommitment: string;
  aboutPortraitUrl: string;
  aboutPortraitAlt: string;
  aboutCredentials: string[];
  buyingHeadline: string;
  buyingIntro: string;
  buyingSteps: ProcessStep[];
  sellingHeadline: string;
  sellingIntro: string;
  sellingSteps: ProcessStep[];
}

export interface PageSeoMeta {
  title: string;
  description: string;
  slug: string;
}

export interface SiteSeoConfig {
  defaultTitle: string;
  defaultDescription: string;
  ogImageUrl: string;
  sitemapBaseUrl: string;
  robotsTxt: string;
  pages: {
    home: PageSeoMeta;
    properties: PageSeoMeta;
    buying: PageSeoMeta;
    selling: PageSeoMeta;
    about: PageSeoMeta;
    contact: PageSeoMeta;
  };
}

export interface NavLinkItem {
  label: string;
  path: string;
  visible: boolean;
}

export interface SiteNavigationConfig {
  links: NavLinkItem[];
  ctaLabel: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  storagePath?: string;
  alt?: string;
  category: 'property' | 'banner' | 'portrait' | 'brand';
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface AdminUserRecord {
  uid: string;
  email: string;
  addedAt?: unknown;
}
