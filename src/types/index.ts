export type HeroBannerMode = 'text-and-image' | 'single-image' | 'slideshow-image';

export interface HeroSlide {
  id: string;
  image: string;
  alt?: string;
  caption?: string;
  linkUrl?: string;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  marathiName?: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  location: string;
  status: 'Pre-Launch' | 'Ready Possession' | 'Under Development' | 'Sold Out';
  startingPrice?: string;
  priceUnit?: string;
  plotSizes: string;
  totalPlots: number;
  availablePlots: number;

  // Hero Display Mode & Banners for Project Pages
  heroMode?: HeroBannerMode; // 'text-and-image' | 'single-image' | 'slideshow-image'
  heroSingleImage?: string;
  heroSingleImageAlt?: string;
  heroSlides?: HeroSlide[];
  heroSlideshowInterval?: number; // In seconds (default 5)
  heroOverlayDarkness?: number; // 40 - 95% (default 75%)

  heroImage: string;
  thumbnail: string;
  logo?: string;
  keyHighlights: string[];
  amenities: Amenity[];
  lifestyleSpaces?: LifestyleSpace[];
  gamesFacilities?: FacilityGroup[];
  infrastructure?: InfrastructureItem[];
  locationBenefits?: string[];
  reraNumber?: string;
  possessionStatus: string;
  sanctionApproval?: string;
  titleRegistration?: string;
  masterPlanImage?: string;
  masterPlanTitle?: string;
  masterPlanSubtitle?: string;
  masterPlanDescription?: string;
  masterPlanFeatures?: string[];
  masterPlanPdfUrl?: string;
  masterPlanPdfFileName?: string;
  masterPlanPdfFileSize?: string;
  masterPlanPdfUploadDate?: string;
  masterPlanDownloadText?: string;
  brochurePdfUrl?: string;
  brochureFileName?: string;
  brochureFileSize?: string;
  brochureUploadDate?: string;
  brochureDownloadText?: string;
  mapUrl?: string;
  galleryPhotos?: ProjectPhoto[];
  featured: boolean;
  displayOrder: number;
  ctaText?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  highlightsEyebrow?: string;
  highlightsTitle?: string;
  masterPlanEyebrow?: string;
  galleryEyebrow?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  lifestyleEyebrow?: string;
  lifestyleTitle?: string;
  lifestyleSubtitle?: string;
  facilitiesEyebrow?: string;
  facilitiesTitle?: string;
  facilitiesSubtitle?: string;
  infraEyebrow?: string;
  infraTitle?: string;
  infraSubtitle?: string;
  locationEyebrow?: string;
  locationTitle?: string;
  ctaBannerTag?: string;
  ctaBannerTitle?: string;
  ctaBannerText?: string;
  ctaBannerButtonText?: string;
}

export interface ProjectPhoto {
  id: string;
  title: string;
  image: string;
  alt?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface LifestyleSpace {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  image: string;
}

export interface FacilityGroup {
  id: string;
  categoryName: string;
  items: string[];
  image: string;
}

export interface InfrastructureItem {
  id: string;
  title: string;
  icon: string;
}

export interface LocationMilestone {
  id: string;
  name: string;
  distance: string;
  icon: 'map-pin' | 'building' | 'highway' | 'factory' | 'train' | 'plane';
  displayOrder: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'project' | 'location' | 'lifestyle' | 'amenities' | 'master-plan';
  project: string;
  alt: string;
  image: string;
  displayOrder: number;
  active: boolean;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  quote: string;
  date: string;
  rating: number;
  active: boolean;
  displayOrder: number;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  project: string;
  preferredContact: 'Call' | 'WhatsApp';
  message?: string;
  date: string;
  time: string;
  status: 'New' | 'Contacted' | 'Interested' | 'Site Visit' | 'Follow Up' | 'Converted' | 'Not Interested' | 'Closed';
  assignedTo?: string;
  notes?: string;
  source: 'Website Form' | 'WhatsApp' | 'Phone Call' | 'Social Media' | 'Channel Partner' | 'Other';
  siteVisitId?: string;
  city?: string;
  partnerType?: string;
  reraNumber?: string;
}

export interface SiteVisitRequest {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  project: string;
  preferredDate: string;
  preferredTime: string;
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt: string;
  assignedExecutive?: string;
  pickupLocation?: string;
  numberOfVisitors?: number;
  leadId?: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface WebsiteContent {
  // Home Page Photos & Hero Modes
  heroMode?: HeroBannerMode; // 'text-and-image' | 'single-image' | 'slideshow-image'
  heroSingleImage?: string;
  heroSingleImageAlt?: string;
  heroSingleImageLink?: string;
  heroSlides?: HeroSlide[];
  heroSlideshowInterval?: number; // In seconds (default 5)

  heroBackgroundImage?: string;
  heroOverlayDarkness?: number;
  aboutImage?: string;
  aboutImageCaption?: string;
  featuredProjectImage?: string;
  whyVeloraImage?: string;
  leadFormBackgroundImage?: string;
  locationImage?: string;
  locationImageAlt?: string;

  heroHeadingPart1: string;
  heroHeadingHighlight: string;
  heroHeadingPart2: string;
  heroDescription: string;
  heroButton1Text: string;
  heroButton2Text: string;
  
  aboutLabel: string;
  aboutHeading: string;
  aboutPara1: string;
  aboutPara2: string;
  aboutButtonText: string;
  
  whyVeloraHeading: string;
  whyVeloraItems: WhyChooseItem[];
  
  featuredProjectSubtitle: string;
  featuredProjectDescription: string;
  featuredPlotSizes: string;
  featuredLocation: string;
  featuredSurroundings: string;
  featuredConnectivity: string;
  featuredDocs: string;
  
  locationHeading: string;
  locationSubheading: string;
  
  galleryHeading: string;
  gallerySubheading: string;
  
  testimonialsHeading: string;
  testimonialsSubheading: string;
  
  leadHeading: string;
  leadSubheading: string;
  
  footerDisclaimer: string;
}

export interface ChannelPartnerValueItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface ChannelPartnerCard {
  id: string;
  title: string;
  description: string;
  badge: string;
}

export interface ChannelPartnerStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  badge: string;
}

export interface ChannelPartnerAudience {
  id: string;
  title: string;
  description: string;
}

export interface ChannelPartnerProvideItem {
  id: string;
  title: string;
  description: string;
}

export interface ChannelPartnerBenefit {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ChannelPartnerFaq {
  id: string;
  question: string;
  answer: string;
}

export interface ChannelPartnerContent {
  // Hero Section
  heroBadge: string;
  heroHeading: string;
  heroHeadingHighlight: string;
  heroDescription: string;
  heroImage: string;
  heroImageAlt?: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  heroWhatsAppText: string;
  heroTrustBadge1: string;
  heroTrustBadge2: string;
  heroTrustBadge3: string;

  // Trust / Value Strip (5 items)
  valueStrip: ChannelPartnerValueItem[];

  // Why Partner With Velora (6 Cards)
  whyPartnerBadge: string;
  whyPartnerHeading: string;
  whyPartnerDescription: string;
  whyPartnerCards: ChannelPartnerCard[];
  whyPartnerDisclaimer: string;

  // How It Works (4 Steps)
  howItWorksBadge: string;
  howItWorksHeading: string;
  howItWorksDescription: string;
  howItWorksSteps: ChannelPartnerStep[];

  // Who Can Partner
  whoCanPartnerBadge: string;
  whoCanPartnerHeading: string;
  whoCanPartnerDescription: string;
  whoCanPartnerTerritories: string;
  whoCanPartnerAudiences: ChannelPartnerAudience[];

  // What We Provide (10 items)
  whatWeProvideBadge: string;
  whatWeProvideHeading: string;
  whatWeProvideDescription: string;
  whatWeProvideItems: ChannelPartnerProvideItem[];

  // Featured Project Section
  featuredProjectBadge: string;
  featuredProjectHeading: string;
  featuredProjectDescription: string;
  featuredProjectSlug: string;

  // Partner Benefits (4 cards)
  benefitsBadge: string;
  benefitsHeading: string;
  benefitsList: ChannelPartnerBenefit[];

  // Testimonials Section
  testimonialsBadge: string;
  testimonialsHeading: string;
  testimonialsEmptyNotice: string;
  testimonialsSubNotice: string;

  // FAQs
  faqsBadge: string;
  faqsHeading: string;
  faqsDescription: string;
  faqsList: ChannelPartnerFaq[];

  // Contact Desk & Form
  formBadge: string;
  formHeading: string;
  deskPhone: string;
  deskWhatsApp: string;
  deskEmail: string;
}

export interface ContactSettings {
  phone: string;
  phoneAlt: string;
  whatsapp: string;
  email: string;
  siteAddress: string;
  officeAddress: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  googleMapsUrl: string;
  websiteUrl: string;
  reraText: string;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  googleAnalyticsId: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Super Admin' | 'Manager' | 'Employee' | 'Sales Agent';
  department?: string;
  phone?: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  isOwner?: boolean;
}

export type PopupLayoutType = 'text-and-image' | 'only-text' | 'only-image';
export type PopupActionType = 'open-project' | 'open-site-visit' | 'open-whatsapp' | 'custom-link' | 'close';

export interface PromotionalPopupSettings {
  enabled: boolean;
  layout: PopupLayoutType; // 'text-and-image' | 'only-text' | 'only-image'
  
  // Content
  badgeText: string; // e.g. "Exclusive Festive Privilege", "New Project Launch"
  headline: string; // e.g. "Special ₹2 Lakh Launch Discount"
  subheadline?: string; // e.g. "Applicable for first 10 plot bookings at Amrutvan"
  bodyText?: string;
  highlightPoints?: string[]; // e.g. ["Zero Stamp Duty Registration", "Immediate 7/12 Extract", "Free 1-Yr Clubhouse Pass"]
  discountCode?: string; // e.g. "VELORA2026"
  
  // Media (for text-and-image or only-image)
  image?: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'left' | 'right';
  
  // Linked Project / CTA
  linkedProjectId?: string; // project slug/id e.g. 'amrutvan' or 'green-opulence'
  primaryCtaText: string;
  primaryCtaAction: PopupActionType;
  customCtaUrl?: string;
  
  secondaryCtaText?: string;
  secondaryCtaAction?: PopupActionType;
  
  // Display rules
  delaySeconds: number; // e.g. 2, 3, 5
  frequency: 'always' | 'once-per-session' | 'once-per-day';
  expiresAt?: string;
}

