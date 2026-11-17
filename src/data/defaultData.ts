import type {
  Property,
  SiteContentConfig,
  SiteGeneralConfig,
  SiteNavigationConfig,
  SiteSeoConfig,
  Testimonial,
} from '../types/realEstate';

export const SCHEMA_LIMITS = {
  SLUG_MAX: 140,
  SLUG_PATTERN: /^[a-z0-9-]+$/,
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  TITLE_MAX: 160,
  DESCRIPTION_MAX: 6000,
  ADDRESS_MAX: 240,
  CITY_MAX: 100,
  NAME_MAX: 120,
  EMAIL_MAX: 160,
  PHONE_MAX: 40,
  MESSAGE_MAX: 3000,
  FEATURES_MAX: 30,
  IMAGES_MAX: 15,
};

export const GENERATED_IMAGES = {
  heroEstate: '/src/assets/images/hero_luxury_estate_1794935885836.jpg',
  penthouseInterior: '/src/assets/images/property_penthouse_interior_1794935886078.jpg',
  modernVilla: '/src/assets/images/property_modern_villa_1794935886445.jpg',
  townhouseRow: '/src/assets/images/property_townhouse_row_1794935886414.jpg',
  commercialLoft: '/src/assets/images/property_commercial_loft_1794935886795.jpg',
  luxuryKitchen: '/src/assets/images/property_kitchen_luxury_1794935886966.jpg',
  waterfrontCondo: '/src/assets/images/property_waterfront_condo_1794935888374.jpg',
  frankPortrait: '/src/assets/images/agent_portrait_frank_1794935887583.jpg',
};

export const DEFAULT_GENERAL_CONFIG: SiteGeneralConfig = {
  businessName: 'Frank Fu Feng Real Estate',
  phone: '4168005898',
  email: 'frankfufeng@gmail.com',
  businessLocation: '',
  logoText: 'Frank Fu Feng Real Estate',
  logoImageUrl: '',
  faviconUrl: '',
  primaryColor: '#0B1D33',
  accentColor: '#B59449',
  socialLinks: {
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
    wechat: '',
  },
  footerDescription:
    'Dedicated real estate representation for residential buyers, sellers, renters, and property investors with transparent guidance from first consultation to closing.',
  copyrightText: '© 2026 Frank Fu Feng Real Estate. All rights reserved.',
};

export const DEFAULT_CONTENT_CONFIG: SiteContentConfig = {
  hasSeededStarter: false,
  heroHeadline: 'Find Your Perfect Place to Call Home.',
  heroSubtitle:
    'Thoughtful representation for buyers, sellers, renters, and real estate investors—combining local market clarity, disciplined negotiation, and responsive personal service.',
  heroImageUrl: GENERATED_IMAGES.heroEstate,
  heroImageAlt: 'Contemporary limestone and glass residence at twilight',
  whyWorkWithUsTitle: 'A Disciplined Standard of Representation',
  whyWorkWithUsSubtitle:
    'Every transaction is guided by clear communication, verified property details, and client-first counsel.',
  ctaHeadline: 'Ready to Discuss Your Next Move?',
  ctaSubtitle:
    'Connect directly with Frank Fu Feng for private viewings, property valuations, or tailored acquisition guidance.',
  aboutHeadline: 'Personal Guidance Built on Trust and Clarity',
  aboutBio:
    'Frank Fu Feng Real Estate provides attentive, full-cycle advisory for individuals, families, and investors navigating residential and commercial property decisions. Whether acquiring a first condominium, transitioning to a detached family residence, leasing, or evaluating an investment asset, every client receives direct, responsive representation.',
  aboutPhilosophy:
    'Real estate decisions shape both daily life and long-term financial footing. Our philosophy prioritizes candid advice, thorough property due diligence, and clear communication—never rushing a decision or obscuring essential details.',
  aboutApproach:
    'We take time to understand your lifestyle requirements, budget parameters, and timeline before curating relevant opportunities, arranging private viewings, and structuring disciplined offers or listing strategies.',
  aboutCommitment:
    'From initial consultation through closing day and beyond, you communicate directly with Frank Fu Feng—ensuring accountability, discretion, and consistent follow-through at every milestone.',
  aboutPortraitUrl: GENERATED_IMAGES.frankPortrait,
  aboutPortraitAlt: 'Portrait of Frank Fu Feng in a modern architectural office',
  aboutCredentials: [],
  buyingHeadline: 'Buying a Property With Clarity and Confidence',
  buyingIntro:
    'From evaluating neighborhoods and financing readiness to negotiating terms and closing smoothly, here is how we guide buyers step by step.',
  buyingSteps: [
    {
      number: '01',
      title: 'Understanding the Property Market',
      description:
        'Review recent comparable sales, neighborhood inventory levels, pricing trends, and carrying costs so you enter the market with realistic expectations.',
    },
    {
      number: '02',
      title: 'Defining Criteria & Finding the Right Property',
      description:
        'Align architectural style, layout, transit access, schools, and long-term resale fundamentals to shortlist homes and investment properties that truly fit.',
    },
    {
      number: '03',
      title: 'Arranging Private Property Viewings',
      description:
        'Walk through shortlisted properties with an attentive eye on natural light, building condition, floor plan efficiency, condo status documents, or lot potential.',
    },
    {
      number: '04',
      title: 'Structuring & Making an Offer',
      description:
        'Craft a strategic offer backed by comparable data, protective conditions, deposit timing, and calm negotiation to secure favorable terms.',
    },
    {
      number: '05',
      title: 'The Closing Process',
      description:
        'Coordinate seamlessly with your lender, home inspector, and real estate lawyer through condition fulfillment, final walkthroughs, and key handover.',
    },
  ],
  sellingHeadline: 'Strategic Marketing & Representation for Sellers',
  sellingIntro:
    'Position your property to attract qualified buyers, command strong market value, and move through negotiation and closing with minimal friction.',
  sellingSteps: [
    {
      number: '01',
      title: 'Property Valuation & Pricing Strategy',
      description:
        'Evaluate comparable transactions, active competition, and property condition to establish a data-backed asking strategy.',
    },
    {
      number: '02',
      title: 'Preparing Your Property for Sale',
      description:
        'Receive practical recommendations on decluttering, minor repairs, lighting, and presentation so buyers experience the space at its best.',
    },
    {
      number: '03',
      title: 'Professional Photography & Marketing',
      description:
        'Showcase your listing with crisp editorial photography, compelling architectural descriptions, digital placement, and targeted buyer outreach.',
    },
    {
      number: '04',
      title: 'Managing Buyer Inquiries & Viewings',
      description:
        'Every inquiry is vetted and answered promptly, with coordinated private showings and timely feedback after every visit.',
    },
    {
      number: '05',
      title: 'Negotiation Support & Closing Assistance',
      description:
        'Review offers carefully across price, conditions, and closing dates, then track all milestones through to a successful closing.',
    },
  ],
};

export const DEFAULT_SEO_CONFIG: SiteSeoConfig = {
  defaultTitle: 'Frank Fu Feng Real Estate | Residential, Commercial & Investment Properties',
  defaultDescription:
    'Explore curated residential, condominium, commercial, and investment properties with Frank Fu Feng Real Estate. Call 416-800-5898 for personalized buyer and seller guidance.',
  ogImageUrl: GENERATED_IMAGES.heroEstate,
  sitemapBaseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: /sitemap.xml',
  pages: {
    home: {
      title: 'Frank Fu Feng Real Estate | Find Your Perfect Place to Call Home',
      description:
        'Curated homes, condominiums, townhouses, commercial spaces, and investment properties with dedicated client representation.',
      slug: '/',
    },
    properties: {
      title: 'Property Listings | Frank Fu Feng Real Estate',
      description:
        'Browse homes, condos, townhouses, commercial listings, and rental properties. Filter by price, bedrooms, location, and property type.',
      slug: '/properties',
    },
    buying: {
      title: 'Buying a Property | Frank Fu Feng Real Estate',
      description:
        'Step-by-step guidance for property buyers: market research, viewings, strategic offers, and closing support.',
      slug: '/buying',
    },
    selling: {
      title: 'Selling a Property & Valuation | Frank Fu Feng Real Estate',
      description:
        'Request a complimentary property valuation and learn how Frank Fu Feng markets and negotiates residential and investment listings.',
      slug: '/selling',
    },
    about: {
      title: 'About Frank Fu Feng | Frank Fu Feng Real Estate',
      description:
        'Learn about Frank Fu Feng Real Estate, our client-first philosophy, transparent guidance, and personalized buyer and seller support.',
      slug: '/about',
    },
    contact: {
      title: 'Contact Frank Fu Feng | 416-800-5898',
      description:
        'Contact Frank Fu Feng Real Estate at 416-800-5898 or frankfufeng@gmail.com to schedule a viewing, request property details, or discuss selling.',
      slug: '/contact',
    },
  },
};

export const DEFAULT_NAVIGATION_CONFIG: SiteNavigationConfig = {
  links: [
    { label: 'Home', path: '/', visible: true },
    { label: 'Properties', path: '/properties', visible: true },
    { label: 'Buying', path: '/buying', visible: true },
    { label: 'Selling', path: '/selling', visible: true },
    { label: 'About', path: '/about', visible: true },
    { label: 'Contact', path: '/contact', visible: true },
  ],
  ctaLabel: 'Contact Agent',
};

export const STARTER_PROPERTIES: Property[] = [
  {
    id: 'prop-limestone-estate',
    slug: 'contemporary-limestone-architectural-residence',
    title: 'Contemporary Limestone & Glass Architectural Residence',
    description:
      'Designed around clean horizontal lines, natural limestone masonry, and expansive floor-to-ceiling glazing, this custom residence balances private courtyard living with bright open-concept entertaining spaces. Features a bespoke chef kitchen with waterfall marble island, radiant heated white oak flooring, and seamless indoor-outdoor terrace access.',
    price: 3480000,
    listingType: 'Sale',
    propertyType: 'Luxury',
    status: 'For Sale',
    featured: true,
    published: true,
    address: '148 Bridle Path Crescent',
    city: 'Toronto',
    neighborhood: 'Midtown Estates',
    bedrooms: 5,
    bathrooms: 5.5,
    sqft: 4650,
    yearBuilt: 2023,
    parking: '3-Car Heated Private Garage + 4 Driveway Spaces',
    features: [
      'Floor-to-ceiling thermally broken glazing',
      'Bespoke chef kitchen with Calacatta marble island',
      'Private landscaped courtyard & reflecting pool',
      'White oak wide-plank hardwood throughout',
      'Smart climate & architectural lighting control',
      'Finished lower level recreation & wine room',
    ],
    imageUrls: [
      GENERATED_IMAGES.heroEstate,
      GENERATED_IMAGES.luxuryKitchen,
      GENERATED_IMAGES.penthouseInterior,
    ],
    imageAlts: [
      'Twilight exterior view of contemporary limestone and glass residence',
      'Bespoke chef kitchen with waterfall marble island and oak cabinetry',
      'Sunlit main living room with wide-plank oak flooring and fireplace',
    ],
    lat: 43.7315,
    lng: -79.3738,
    seoTitle: 'Contemporary Limestone Residence | 148 Bridle Path Crescent',
    seoDescription:
      '5-bedroom custom limestone and glass luxury residence featuring bespoke chef kitchen, 4,650 sq ft of living space, and private courtyard.',
  },
  {
    id: 'prop-skyline-penthouse',
    slug: 'skyline-corner-penthouse-suite',
    title: 'Skyline Corner Penthouse With Panoramic City Views',
    description:
      'Occupying a prized upper corner exposure, this thoughtfully proportioned penthouse residence delivers unobstructed skyline views through floor-to-ceiling windows. The open living and dining salon centers on a honed stone fireplace, complemented by European white oak floors, a streamlined kitchen, and wrap-around private terrace.',
    price: 2150000,
    listingType: 'Sale',
    propertyType: 'Condo',
    status: 'For Sale',
    featured: true,
    published: true,
    address: '88 Harbour View Avenue, PH-04',
    city: 'Toronto',
    neighborhood: 'Waterfront District',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2280,
    yearBuilt: 2022,
    parking: '2 Side-by-Side Underground EV Spaces + Locker',
    features: [
      'Panoramic corner skyline & lake exposures',
      'Honed stone gas fireplace feature wall',
      'Private 420 sq ft wrap-around terrace',
      '24-hour concierge & private elevator foyer',
      'Integrated Miele kitchen appliance suite',
    ],
    imageUrls: [
      GENERATED_IMAGES.penthouseInterior,
      GENERATED_IMAGES.waterfrontCondo,
      GENERATED_IMAGES.luxuryKitchen,
    ],
    imageAlts: [
      'Skyline corner penthouse living room with floor-to-ceiling windows',
      'Waterfront glass condominium residence exterior at dusk',
      'Modern marble and oak kitchen interior',
    ],
    lat: 43.6406,
    lng: -79.3817,
    seoTitle: 'Skyline Corner Penthouse | 88 Harbour View Avenue',
    seoDescription:
      '3-bedroom waterfront penthouse condominium with 2,280 sq ft, panoramic skyline views, honed stone fireplace, and wrap-around terrace.',
  },
  {
    id: 'prop-cedar-modern-house',
    slug: 'cedar-and-stucco-modern-family-home',
    title: 'Cedar & Crisp Stucco Modern Detached Family Home',
    description:
      'Set on a quiet residential street, this detached contemporary home pairs warm natural cedar cladding with crisp architectural stucco and dark-framed glazing. Inside, generous ceiling heights, a custom navy-and-oak kitchen, and manicured front and rear gardens create an effortless everyday sanctuary for family living.',
    price: 1895000,
    listingType: 'Sale',
    propertyType: 'House',
    status: 'For Sale',
    featured: true,
    published: true,
    address: '42 Willowbank Boulevard',
    city: 'North York',
    neighborhood: 'Willowdale',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3180,
    yearBuilt: 2021,
    parking: 'Built-In Double Garage + 2 Driveway Spaces',
    features: [
      'Natural western red cedar & crisp stucco facade',
      'Calacatta marble waterfall kitchen island',
      'Dedicated main-floor home office',
      'Landscaped private backyard with stone patio',
      'High-efficiency zoned HVAC system',
    ],
    imageUrls: [
      GENERATED_IMAGES.modernVilla,
      GENERATED_IMAGES.luxuryKitchen,
    ],
    imageAlts: [
      'Modern detached house exterior with cedar accents and landscaped walkway',
      'Custom kitchen with oak cabinetry and marble island',
    ],
    lat: 43.7689,
    lng: -79.4136,
    seoTitle: 'Modern Detached Family Home | 42 Willowbank Boulevard',
    seoDescription:
      '4-bedroom contemporary detached home in North York featuring custom cedar facade, 3,180 sq ft, marble kitchen, and double garage.',
  },
  {
    id: 'prop-limestone-townhouse',
    slug: 'urban-brick-and-limestone-townhouse',
    title: 'Urban Brick & Limestone Three-Storey Townhouse',
    description:
      'Located along a tranquil tree-lined avenue, this refined three-storey townhouse offers architectural dark brick masonry, limestone entry framing, and private matte-black steel balconies on multiple levels. Available for lease with immediate or flexible occupancy.',
    price: 5400,
    listingType: 'Rent',
    propertyType: 'Townhouse',
    status: 'For Rent',
    featured: false,
    published: true,
    address: '102 Elmhurst Mews',
    city: 'Toronto',
    neighborhood: 'Annex Corridor',
    bedrooms: 3,
    bathrooms: 3.5,
    sqft: 2140,
    yearBuilt: 2020,
    parking: 'Private Underground Garage Bay',
    features: [
      'Two private street-facing balconies',
      'Primary suite occupying entire third floor',
      'Direct internal access to private garage',
      'Walkable to transit, parks, and cafes',
    ],
    imageUrls: [
      GENERATED_IMAGES.townhouseRow,
      GENERATED_IMAGES.penthouseInterior,
    ],
    imageAlts: [
      'Three-storey dark brick and limestone urban townhouse facade',
      'Bright open living space with oak floors',
    ],
    lat: 43.6712,
    lng: -79.4036,
    seoTitle: 'Urban Three-Storey Townhouse for Lease | 102 Elmhurst Mews',
    seoDescription:
      '3-bedroom, 3.5-bath urban brick and limestone townhouse available for rent at $5,400/month with private balconies and garage.',
  },
  {
    id: 'prop-exchange-commercial',
    slug: 'corner-mixed-use-commercial-investment-building',
    title: 'Corner Mixed-Use Commercial & Office Investment Building',
    description:
      'Well-positioned corner commercial asset combining high-visibility ground-floor retail frontage with two bright upper levels of contemporary office suites. Modern steel-and-glass curtain wall construction, high pedestrian exposure, and diversified tenant income make this an attractive long-term commercial investment.',
    price: 4250000,
    listingType: 'Sale',
    propertyType: 'Commercial',
    status: 'For Sale',
    featured: false,
    published: true,
    address: '310 King Street East',
    city: 'Toronto',
    neighborhood: 'Downtown East',
    bedrooms: 0,
    bathrooms: 4,
    sqft: 6800,
    yearBuilt: 2019,
    parking: 'Rear Surface Loading & 6 Reserved Stalls',
    features: [
      'Corner retail frontage with floor-to-ceiling glazing',
      'Two upper floors of turnkey modern office space',
      'Strong pedestrian & transit corridor visibility',
      'Separate metered utilities per floor',
    ],
    imageUrls: [GENERATED_IMAGES.commercialLoft],
    imageAlts: ['Corner three-storey glass and steel commercial retail and office building'],
    lat: 43.6519,
    lng: -79.3665,
    seoTitle: 'Corner Mixed-Use Commercial Building | 310 King Street East',
    seoDescription:
      '6,800 sq ft mixed-use commercial and office investment building with prime corner retail frontage.',
  },
  {
    id: 'prop-waterfront-investment-suite',
    slug: 'lakefront-residence-investment-suite',
    title: 'Lakefront High-Rise Two-Bedroom Investment Residence',
    description:
      'Elevated above waterfront parklands, this bright two-bedroom condominium suite offers strong tenant demand, low-maintenance modern finishes, and unobstructed park and skyline outlooks. Ideal for investors seeking turnkey urban rental performance or end-users seeking lock-and-leave convenience.',
    price: 985000,
    listingType: 'Sale',
    propertyType: 'Investment',
    status: 'For Sale',
    featured: false,
    published: true,
    address: '215 Queens Quay West, Suite 1804',
    city: 'Toronto',
    neighborhood: 'Harbourfront',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1090,
    yearBuilt: 2021,
    parking: '1 Underground Parking Space',
    features: [
      'Split two-bedroom floor plan for optimal privacy',
      'Full-width lakeside balcony',
      'Steps to waterfront trails and financial core',
      'Strong long-term rental fundamentals',
    ],
    imageUrls: [
      GENERATED_IMAGES.waterfrontCondo,
      GENERATED_IMAGES.penthouseInterior,
    ],
    imageAlts: [
      'Lakefront high-rise glass condominium tower overlooking calm water',
      'Bright condominium interior overlooking skyline',
    ],
    lat: 43.6384,
    lng: -79.3863,
    seoTitle: 'Lakefront Investment Residence | 215 Queens Quay West',
    seoDescription:
      '2-bedroom, 2-bath 1,090 sq ft lakefront condominium investment opportunity overlooking waterfront parklands.',
  },
];

export const STARTER_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-placeholder-1',
    clientName: 'Michael & Clara T.',
    clientRole: 'Residential Home Buyers (Placeholder Review)',
    rating: 5,
    quote:
      'Sample placeholder testimonial: Frank guided our search with patience, clear comparable pricing data, and prompt answers at every viewing. Replace this entry with verified client feedback in the Admin Dashboard.',
    isPlaceholder: true,
    published: true,
    sortOrder: 1,
  },
  {
    id: 'test-placeholder-2',
    clientName: 'David L.',
    clientRole: 'Condominium Seller (Placeholder Review)',
    rating: 5,
    quote:
      'Sample placeholder testimonial: From preparing our suite for photography to negotiating final closing terms, communication remained transparent and calm throughout. Replace with verified client review via Admin.',
    isPlaceholder: true,
    published: true,
    sortOrder: 2,
  },
  {
    id: 'test-placeholder-3',
    clientName: 'Hannah K.',
    clientRole: 'Investment Property Client (Placeholder Review)',
    rating: 5,
    quote:
      'Sample placeholder testimonial: Having clear rental yield estimates and straightforward market context helped us evaluate multiple properties without pressure. Replace with genuine review in Admin.',
    isPlaceholder: true,
    published: true,
    sortOrder: 3,
  },
];
