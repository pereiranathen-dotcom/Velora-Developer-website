import {
  Project,
  LocationMilestone,
  GalleryItem,
  Testimonial,
  Lead,
  SiteVisitRequest,
  WebsiteContent,
  ContactSettings,
  SEOSettings,
  AdminUser,
  PromotionalPopupSettings,
  ChannelPartnerContent,
} from '../types';

// Curated high-res imagery matching the exact visual references
export const ASSETS = {
  // Amrutvan Grand Stone Entrance Gate with warm lights and lush tropical trees
  heroEntrance: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=85',
  
  // Plotted layout surrounded by rolling green hills (Amrutvan / Green Opulence)
  aerialGreenEstate: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85',
  
  // Family overlooking sunset mountain valley
  familySunset: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=85',
  
  // Scenic winding mountain highway with sunset & car
  scenicRoad: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
  
  // Luxury 2-story clubhouse in mountain setting
  clubhouse: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  
  // Manicured garden with gazebo and stone path
  gazeboGarden: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=85',
  
  // Children playground park
  kidsPlay: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85',
  
  // Clubhouse games room (billiards, lounge)
  indoorGames: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=1200&q=85',
  
  // Outdoor sports facilities (badminton / tennis / court)
  outdoorSports: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=85',

  // Master layout aerial schematic
  masterPlan: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=85',

  // Green Opulence villa and plots
  greenOpulenceVilla: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'amrutvan',
    slug: 'amrutvan',
    name: 'AMRUTVAN',
    marathiName: 'अमृतवन',
    tagline: 'Your Space. Your Nature. Your Future.',
    shortDescription: 'A thoughtfully planned destination where nature, connectivity and investment potential come together.',
    longDescription: 'Amrutvan is a thoughtfully planned NA plotted development that brings you closer to nature, while keeping you connected to everything that matters. Surrounded by lush greenery, scenic views and serene environment, Amrutvan is the perfect place to build your dream home and a lifetime of beautiful memories.',
    category: 'Nature-inspired plotted development',
    location: 'Mandangad, Ratnagiri, Maharashtra',
    status: 'Ready Possession',
    startingPrice: 'Contact for Price',
    priceUnit: 'Customizable Plots',
    plotSizes: '3 to 6 Guntha (3,267 - 6,534 sq.ft)',
    totalPlots: 59,
    availablePlots: 21,
    heroMode: 'text-and-image',
    heroSingleImage: ASSETS.heroEntrance,
    heroSingleImageAlt: 'Amrutvan Luxury Plotted Development Grand Entrance',
    heroSlideshowInterval: 5,
    heroOverlayDarkness: 75,
    heroSlides: [
      {
        id: 'as-1',
        image: ASSETS.heroEntrance,
        alt: 'Amrutvan Grand Entrance',
        caption: 'Amrutvan — Nature-Inspired Plotted Development, Mandangad',
      },
      {
        id: 'as-2',
        image: ASSETS.clubhouse,
        alt: 'Clubhouse & Amenities',
        caption: 'Exclusive Two-Story Clubhouse & Panoramic Sun Deck',
      },
      {
        id: 'as-3',
        image: ASSETS.aerialGreenEstate,
        alt: 'Scenic Valley Views',
        caption: 'Collector Sanctioned NA Plots with Separate 7/12 Extract',
      },
    ],
    heroImage: ASSETS.heroEntrance,
    thumbnail: ASSETS.heroEntrance,
    logo: 'Amrutvan',
    possessionStatus: 'Ready Possession with Clear NA Title',
    sanctionApproval: 'Collector Approved NA Layout',
    titleRegistration: 'Separate 7/12 Extract for Each Plot',
    masterPlanImage: ASSETS.masterPlan,
    masterPlanTitle: 'Master Layout Plan',
    masterPlanSubtitle: 'Well Connected. Well Positioned.',
    masterPlanDescription: 'Each plot has been master-planned to maximize natural ventilation, scenic hill vistas, and direct frontage on wide asphalt internal roads with street lights, underground cabling, and landscaped borders.',
    masterPlanFeatures: [
      '30ft Wide Main Internal Roads & Arterials',
      'Individual Water Supply & Power Points to Each Plot',
      'Central Clubhouse with Swimming Pool & Indoor Lounge',
      '5 Themed Landscaped Gardens & Stargazing Gazebos',
    ],
    masterPlanPdfUrl: 'https://www.veloradevelopers.com/brochures/amrutvan-master-plan.pdf',
    masterPlanPdfFileName: 'Amrutvan-Official-Brochure.pdf',
    masterPlanPdfFileSize: '1.85 MB',
    masterPlanDownloadText: 'Download Master Plan Brochure',
    mapUrl: 'https://maps.google.com/maps?q=Mandangad,Ratnagiri,Maharashtra&t=&z=11&ie=UTF8&iwloc=&output=embed',
    galleryPhotos: [
      { id: 'ap-1', title: 'Grand Entrance Gate at Twilight', image: ASSETS.heroEntrance, alt: 'Amrutvan Gate' },
      { id: 'ap-2', title: 'Two-Story Luxury Clubhouse', image: ASSETS.clubhouse, alt: 'Amrutvan Clubhouse' },
      { id: 'ap-3', title: 'Central Garden Gazebos', image: ASSETS.gazeboGarden, alt: 'Amrutvan Gazebo' },
      { id: 'ap-4', title: 'Children Play & Activity Enclave', image: ASSETS.kidsPlay, alt: 'Kids Play Park' },
      { id: 'ap-5', title: 'Indoor Sports & Billiards Lounge', image: ASSETS.indoorGames, alt: 'Indoor Lounge' },
      { id: 'ap-6', title: 'Outdoor Badminton & Chess Arena', image: ASSETS.outdoorSports, alt: 'Outdoor Sports' },
    ],
    featured: true,
    displayOrder: 1,
    reraNumber: 'P52800051234 (Collector Approved NA)',
    ctaText: 'Explore Amrutvan →',
    keyHighlights: [
      'Collector Approved NA Plotted Layout',
      'Clear Title Property with Separate 7/12 for each plot',
      'Ready Possession with Gated Boundary',
      'Bank Loan Support from Leading Institutions',
      'Equipped with 30ft Internal Asphalt Roads, Light & Water',
      '5 Themed Gardens & Luxury Clubhouse',
    ],
    amenities: [
      { id: '1', name: 'Grand Entrance Gate', icon: 'shield', description: 'Imposing security gate with 24/7 manned security and CCTV surveillance' },
      { id: '2', name: 'Two-Story Clubhouse', icon: 'building', description: 'Featuring indoor games lounge, banquet hall and panoramic deck' },
      { id: '3', name: '5 Themed Gardens', icon: 'trees', description: 'Meditation garden, side gardens, flower park, walking promenades' },
      { id: '4', name: 'Kids Play Park', icon: 'sun', description: 'Equipped with rubberized flooring, slides, swings and jungle gym' },
      { id: '5', name: 'Sports Courts', icon: 'activity', description: 'Badminton court, cricket practice turf, life-size outdoor chess' },
      { id: '6', name: '30ft Wide Roads', icon: 'car', description: 'Wide internal asphalt roads with designer LED street light illumination' },
      { id: '7', name: 'Water & Electricity', icon: 'zap', description: 'Individual water tap connection and underground power cabling' },
      { id: '8', name: 'Campfire & BBQ', icon: 'flame', description: 'Dedicated open-air stargazing and community gathering zone' },
    ],
    lifestyleSpaces: [
      { id: 'l1', number: 1, title: 'Main Entrance & Gate', subtitle: 'Grand Welcome', image: ASSETS.heroEntrance },
      { id: 'l2', number: 2, title: 'Central Garden & Gazebos', subtitle: 'Lush Botanical Walkways', image: ASSETS.gazeboGarden },
      { id: 'l3', number: 3, title: 'Kids Play Area', subtitle: 'Safe & Joyful', image: ASSETS.kidsPlay },
      { id: 'l4', number: 4, title: 'Meditation Garden', subtitle: 'Peaceful Sanctuary', image: ASSETS.gazeboGarden },
      { id: 'l5', number: 5, title: 'Side Walking Promenades', subtitle: 'Nature in Every Corner', image: ASSETS.scenicRoad },
    ],
    gamesFacilities: [
      {
        id: 'g1',
        categoryName: 'Club House',
        items: ['Lounge Area', 'Multipurpose Hall', 'Community Events', 'Birthday Celebrations'],
        image: ASSETS.clubhouse,
      },
      {
        id: 'g2',
        categoryName: 'Indoor Games',
        items: ['Table Tennis', 'Carrom', 'Board Games', 'Indoor Lounge'],
        image: ASSETS.indoorGames,
      },
      {
        id: 'g3',
        categoryName: 'Outdoor Games',
        items: ['Cricket Turf', 'Badminton Court', 'Outdoor Fitness Equipment', 'Giant Lawn Chess'],
        image: ASSETS.outdoorSports,
      },
      {
        id: 'g4',
        categoryName: 'Kids Activities',
        items: ['Archery Area', 'Kids Play Area', 'Children Play Equipment', 'Sand Pit'],
        image: ASSETS.kidsPlay,
      },
    ],
    infrastructure: [
      { id: 'i1', title: 'Wide Internal Roads', icon: 'road' },
      { id: 'i2', title: 'Electricity', icon: 'zap' },
      { id: 'i3', title: 'Water Supply', icon: 'droplet' },
      { id: 'i4', title: 'Street Lights', icon: 'lamp' },
      { id: 'i5', title: 'Drainage System', icon: 'layers' },
      { id: 'i6', title: 'Landscaping', icon: 'trees' },
      { id: 'i7', title: '24/7 Security', icon: 'shield' },
      { id: 'i8', title: 'Well Planned Plots', icon: 'check' },
    ],
    locationBenefits: [
      'Just 2 km from Mandangad Town center',
      'Direct touch to Pandharpur Highway (0 km)',
      'Close to Upcoming PAT MIDC (2 km)',
      '170 km scenic drive from Pune',
      '190 km smooth connectivity from Mumbai',
    ],
  },
  {
    id: 'green-opulence',
    slug: 'green-opulence',
    name: 'GREEN OPULENCE',
    marathiName: 'ग्रीन ऑप्युलेन्स',
    tagline: 'Experience a Refined Approach to Land Ownership',
    shortDescription: 'Experience a refined approach to land ownership surrounded by greenery and designed for a better tomorrow.',
    longDescription: 'Green Opulence brings together the best of rural serenity and contemporary luxury. Located in Panhali Kh., Maharashtra, this exclusive plotted enclave features Collector-approved NA plots with ready possession, custom villa architectural concepts, private clubhouse, campfire zones, and manicured green spaces.',
    category: 'Premium nature-focused development',
    location: 'Panhali Kh., Mandangad, Maharashtra 415203',
    status: 'Ready Possession',
    startingPrice: 'Contact for Price',
    priceUnit: 'Customizable Plots',
    plotSizes: '3 to 6 Guntha Plots',
    totalPlots: 42,
    availablePlots: 14,
    heroMode: 'text-and-image',
    heroSingleImage: ASSETS.greenOpulenceVilla,
    heroSingleImageAlt: 'Green Opulence Luxury Estate Living',
    heroSlideshowInterval: 5,
    heroOverlayDarkness: 75,
    heroSlides: [
      {
        id: 'gos-1',
        image: ASSETS.greenOpulenceVilla,
        alt: 'Green Opulence Luxury Villa',
        caption: 'Green Opulence — Exclusive Luxury Estate Living',
      },
      {
        id: 'gos-2',
        image: ASSETS.aerialGreenEstate,
        alt: 'Lush Estate Layout',
        caption: 'Bespoke Plotted Communities Surrounded by Nature',
      },
      {
        id: 'gos-3',
        image: ASSETS.familySunset,
        alt: 'Sunset Mountain Vista',
        caption: 'Scenic Weekend Home Retreats with Complete Peace of Mind',
      },
    ],
    heroImage: ASSETS.aerialGreenEstate,
    thumbnail: ASSETS.aerialGreenEstate,
    logo: 'Green Opulence',
    possessionStatus: 'Ready Possession with Separate 7/12',
    sanctionApproval: 'Collector Approved NA Plots',
    titleRegistration: 'Separate 7/12 for each plot',
    masterPlanImage: ASSETS.aerialGreenEstate,
    masterPlanTitle: 'Green Opulence Plotted Layout',
    masterPlanSubtitle: 'Collector Approved NA Layout with 30ft Roads',
    masterPlanDescription: 'Experience planned plotted living with demarcated boundaries, internal paved roads, independent water connections, and landscaped perimeter fencing.',
    masterPlanFeatures: [
      'NA Plot size of 3 to 6 Guntha',
      'Collector Approved NA Plots with Clear Title',
      '30ft Internal Road equipped with Street Lights',
      'Equipped with Electricity and Water Supply',
    ],
    masterPlanPdfUrl: 'https://www.veloradevelopers.com/brochures/green-opulence-plan.pdf',
    mapUrl: 'https://maps.google.com/maps?q=Panhali+Kh,Mandangad,Maharashtra&t=&z=11&ie=UTF8&iwloc=&output=embed',
    galleryPhotos: [
      { id: 'gp-1', title: 'Green Opulence Aerial View', image: ASSETS.aerialGreenEstate, alt: 'Aerial Layout' },
      { id: 'gp-2', title: 'Villa Architectural Concepts', image: ASSETS.greenOpulenceVilla, alt: 'Villa Concept' },
      { id: 'gp-3', title: 'Private Club House & Lounge', image: ASSETS.clubhouse, alt: 'Club House' },
      { id: 'gp-4', title: 'Botanical Gardens & Gazebos', image: ASSETS.gazeboGarden, alt: 'Orchard Garden' },
    ],
    featured: false,
    displayOrder: 2,
    reraNumber: 'Collector Approved NA Plots',
    ctaText: 'Discover Green Opulence →',
    keyHighlights: [
      'NA Plot size of 3 to 6 Guntha',
      'Collector Approved NA Plots',
      'Clear Title Property',
      'Separate 7/12 of each plot',
      '30ft Internal Road with Street Lights',
      'Equipped with Light & Water supply',
    ],
    amenities: [
      { id: 'g-1', name: 'Private Club House', icon: 'building', description: 'Architectural clubhouse for family recreation and celebrations' },
      { id: 'g-2', name: 'Camp Fire & Stargazing', icon: 'flame', description: 'Custom evening social zone amidst organic plantation' },
      { id: 'g-3', name: 'Outdoor Sports Enclave', icon: 'activity', description: 'Volleyball, badminton, and jogging track' },
      { id: 'g-4', name: 'Botanical Gardens', icon: 'trees', description: 'Lush fruit orchards and shaded gazebo sitting pavilions' },
      { id: 'g-5', name: 'Indoor Games Suite', icon: 'dice', description: 'Carrom, chess, snooker, and board games parlor' },
      { id: 'g-6', name: 'Gated Security', icon: 'shield', description: '24/7 security booth and solar perimeter lighting' },
    ],
    lifestyleSpaces: [
      { id: 'gl1', number: 1, title: 'Entrance Arch & Road', subtitle: '30ft Paved Avenue', image: ASSETS.aerialGreenEstate },
      { id: 'gl2', number: 2, title: 'Villa Architectural Concepts', subtitle: '1BHK & 2BHK Designs', image: ASSETS.greenOpulenceVilla },
      { id: 'gl3', number: 3, title: 'Campfire Arena', subtitle: 'Warm Nights with Friends', image: ASSETS.clubhouse },
      { id: 'gl4', number: 4, title: 'Orchard Gardens', subtitle: 'Peaceful Nature Haven', image: ASSETS.gazeboGarden },
    ],
    infrastructure: [
      { id: 'gi1', title: '30ft Internal Road', icon: 'road' },
      { id: 'gi2', title: 'Water Infrastructure', icon: 'droplet' },
      { id: 'gi3', title: 'Electricity Grid', icon: 'zap' },
      { id: 'gi4', title: 'Separate 7/12 Extract', icon: 'file' },
    ],
    locationBenefits: [
      'Near Panhali Kh., peaceful hillside hamlet',
      'Convenient access to state highways',
      'Clean unpolluted air and year-round green climate',
      'Excellent long-term capital appreciation corridor',
    ],
  },
];

export const INITIAL_LOCATIONS: LocationMilestone[] = [
  { id: 'loc-1', name: 'Mandangad Town', distance: '2 km', icon: 'map-pin', displayOrder: 1 },
  { id: 'loc-2', name: 'Mumbai', distance: '190 km', icon: 'building', displayOrder: 2 },
  { id: 'loc-3', name: 'Pune', distance: '170 km', icon: 'building', displayOrder: 3 },
  { id: 'loc-4', name: 'Pandharpur Highway', distance: '0 km', icon: 'highway', displayOrder: 4 },
  { id: 'loc-5', name: 'Upcoming PAT MIDC', distance: '2 km', icon: 'factory', displayOrder: 5 },
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Amrutvan Grand Entrance Gate at Twilight',
    category: 'project',
    project: 'Amrutvan',
    alt: 'Amrutvan Grand Entrance Gate with illuminated lanterns and stone masonry',
    image: ASSETS.heroEntrance,
    displayOrder: 1,
    active: true,
  },
  {
    id: 'gal-2',
    title: 'Panoramic Valley View & Green Plots',
    category: 'project',
    project: 'Amrutvan',
    alt: 'Panoramic View of Amrutvan plotted landscape nestled in green hills',
    image: ASSETS.aerialGreenEstate,
    displayOrder: 2,
    active: true,
  },
  {
    id: 'gal-3',
    title: 'Scenic Mountain Highway Connection',
    category: 'location',
    project: 'Amrutvan',
    alt: 'Winding mountain road with sunset heading towards Mandangad Ratnagiri',
    image: ASSETS.scenicRoad,
    displayOrder: 3,
    active: true,
  },
  {
    id: 'gal-4',
    title: 'Green Opulence Plotted Layout & Villas',
    category: 'project',
    project: 'Green Opulence',
    alt: 'Green Opulence layout aerial view surrounded by pristine forests',
    image: ASSETS.greenOpulenceVilla,
    displayOrder: 4,
    active: true,
  },
  {
    id: 'gal-5',
    title: 'Children Play Area & Activity Enclave',
    category: 'lifestyle',
    project: 'Amrutvan',
    alt: 'Colorful kids play area with slides, swings, and manicured green lawns',
    image: ASSETS.kidsPlay,
    displayOrder: 5,
    active: true,
  },
  {
    id: 'gal-6',
    title: 'Luxury Clubhouse & Recreation Lounge',
    category: 'lifestyle',
    project: 'Amrutvan',
    alt: 'Two-story Amrutvan clubhouse with evening lights and stone architecture',
    image: ASSETS.clubhouse,
    displayOrder: 6,
    active: true,
  },
  {
    id: 'gal-7',
    title: 'Central Garden Gazebos & Walking Track',
    category: 'lifestyle',
    project: 'Amrutvan',
    alt: 'Terracotta gazebos surrounded by flowering plants and lit bollard lamps',
    image: ASSETS.gazeboGarden,
    displayOrder: 7,
    active: true,
  },
  {
    id: 'gal-8',
    title: 'Indoor Sports & Billiards Room',
    category: 'amenities',
    project: 'Amrutvan',
    alt: 'Indoor games room with table tennis, carrom, and billiards table',
    image: ASSETS.indoorGames,
    displayOrder: 8,
    active: true,
  },
  {
    id: 'gal-9',
    title: 'Master Layout Aerial Map (59 Plots)',
    category: 'master-plan',
    project: 'Amrutvan',
    alt: 'Master layout aerial view of 59 numbered plots and wide internal roads',
    image: ASSETS.masterPlan,
    displayOrder: 9,
    active: true,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    customerName: 'Rahul Sharma',
    location: 'Mumbai',
    quote: 'The site visit gave us a much better understanding of the location and the overall development.',
    date: '28 Sep 2026',
    rating: 5,
    active: true,
    displayOrder: 1,
  },
  {
    id: 'test-2',
    customerName: 'Sneha Patil',
    location: 'Pune',
    quote: 'A peaceful location with great potential. The team was very supportive throughout the process.',
    date: '15 Sep 2026',
    rating: 5,
    active: true,
    displayOrder: 2,
  },
  {
    id: 'test-3',
    customerName: 'Amit Deshmukh',
    location: 'Thane',
    quote: 'We loved the natural surroundings and the thoughtfully planned layout. Transparent documentation.',
    date: '02 Sep 2026',
    rating: 5,
    active: true,
    displayOrder: 3,
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'LD-1001',
    name: 'Rahul Sharma',
    phone: '93221 33592',
    email: 'rahul.sharma@example.com',
    project: 'Amrutvan',
    preferredContact: 'WhatsApp',
    message: 'Interested in a 4 Guntha plot near the garden zone. Please share price sheet.',
    date: '02 Oct 2026',
    time: '11:42 AM',
    status: 'New',
    assignedTo: 'Vikram Joshi',
    source: 'WhatsApp',
  },
  {
    id: 'LD-1002',
    name: 'Sneha Patil',
    phone: '98765 43210',
    email: 'sneha.patil@outlook.com',
    project: 'Green Opulence',
    preferredContact: 'Call',
    message: 'Looking for vacation home plot for retirement. Wanted site visit this weekend.',
    date: '02 Oct 2026',
    time: '09:15 AM',
    status: 'Contacted',
    assignedTo: 'Anand Pereira',
    source: 'Website Form',
  },
  {
    id: 'LD-1003',
    name: 'Amit Deshmukh',
    phone: '99678 12345',
    email: 'amit.desh@gmail.com',
    project: 'Amrutvan',
    preferredContact: 'WhatsApp',
    message: 'Requested site visit for Sunday with family. 4 persons.',
    date: '01 Oct 2026',
    time: '04:30 PM',
    status: 'Site Visit',
    assignedTo: 'Brijesh Pereira',
    source: 'Website Form',
  },
  {
    id: 'LD-1004',
    name: 'Priya Kulkarni',
    phone: '98234 56789',
    email: 'priya.kulkarni@techcorp.in',
    project: 'Amrutvan',
    preferredContact: 'Call',
    message: 'Discussed NA sanctions and 7/12 extract clarity. Highly satisfied.',
    date: '01 Oct 2026',
    time: '02:10 PM',
    status: 'Interested',
    assignedTo: 'Vikram Joshi',
    source: 'Phone Call',
  },
  {
    id: 'LD-1005',
    name: 'Kunal Mehta',
    phone: '97654 32109',
    email: 'kunal.mehta@yahoo.com',
    project: 'Green Opulence',
    preferredContact: 'WhatsApp',
    message: 'Follow-up call scheduled for Tuesday regarding payment schedule.',
    date: '30 Sep 2026',
    time: '05:45 PM',
    status: 'Follow Up',
    assignedTo: 'Anand Pereira',
    source: 'Social Media',
  },
];

export const INITIAL_SITE_VISITS: SiteVisitRequest[] = [
  {
    id: 'SV-201',
    customerName: 'Amit Deshmukh',
    phone: '99678 12345',
    email: 'amit.desh@gmail.com',
    project: 'Amrutvan',
    preferredDate: '2026-10-04',
    preferredTime: '11:00 AM',
    status: 'Confirmed',
    notes: 'Family visit from Thane. Car pickup coordination at Mandangad bus depot.',
    createdAt: '2026-10-01 16:30',
  },
  {
    id: 'SV-202',
    customerName: 'Sneha Patil',
    phone: '98765 43210',
    email: 'sneha.patil@outlook.com',
    project: 'Green Opulence',
    preferredDate: '2026-10-05',
    preferredTime: '02:00 PM',
    status: 'Requested',
    notes: 'Interested in plot #12 or #14 near internal road.',
    createdAt: '2026-10-02 09:15',
  },
];

export const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  logoMode: 'svg-brand',
  customLogoImage: '',
  customLogoHeight: 44,
  customLogoAlt: 'Velora Developers Logo',
  showLogoTagline: true,

  heroMode: 'text-and-image',
  heroSingleImage: ASSETS.heroEntrance,
  heroSingleImageAlt: 'Amrutvan Luxury Plotted Development Entrance at Dusk',
  heroSingleImageLink: '/projects/amrutvan',
  heroSlideshowInterval: 5,
  heroSlides: [
    {
      id: 'slide-1',
      image: ASSETS.heroEntrance,
      alt: 'Amrutvan Grand Entrance Gate Mandangad',
      caption: 'Amrutvan — Nature-Inspired Plotted Development, Mandangad',
      linkUrl: '/projects/amrutvan',
    },
    {
      id: 'slide-2',
      image: ASSETS.aerialGreenEstate,
      alt: 'Lush Green Plotted Layout Aerial View',
      caption: 'Clear Title Collector NA Sanctioned Plots with Separate 7/12',
      linkUrl: '/projects',
    },
    {
      id: 'slide-3',
      image: ASSETS.greenOpulenceVilla,
      alt: 'Green Opulence Luxury Mountain Villa',
      caption: 'Green Opulence — Exclusive Luxury Estate Living',
      linkUrl: '/projects/green-opulence',
    },
    {
      id: 'slide-4',
      image: ASSETS.clubhouse,
      alt: 'Two-Story Clubhouse and Amenities',
      caption: 'State-of-the-Art Clubhouse, Gardens & Modern Infrastructure',
      linkUrl: '/projects/amrutvan',
    },
  ],
  heroBackgroundImage: ASSETS.heroEntrance,
  heroOverlayDarkness: 75,
  aboutImage: ASSETS.familySunset,
  aboutImageCaption: 'Family looking over sunset hills at Velora Estates',
  featuredProjectImage: ASSETS.heroEntrance,
  whyVeloraImage: ASSETS.aerialGreenEstate,
  leadFormBackgroundImage: ASSETS.scenicRoad,
  locationImage: ASSETS.scenicRoad,
  locationImageAlt: 'Scenic winding mountain highway during sunset with white car driving to Mandangad Ratnagiri',

  heroHeadingPart1: 'Where Vision',
  heroHeadingHighlight: 'Real Estate',
  heroHeadingPart2: 'Meets the Future',
  heroDescription: 'Discover thoughtfully planned properties in promising locations, developed with a focus on quality, connectivity and long-term value.',
  heroButton1Text: 'Explore Our Projects →',
  heroButton2Text: 'Book a Site Visit',
  
  aboutLabel: 'ABOUT VELORA',
  aboutHeading: 'More Than Development. We Create Possibilities.',
  aboutPara1: 'Velora Developers is committed to creating thoughtfully planned real-estate developments that bring together location, accessibility, quality and long-term value.',
  aboutPara2: 'Our approach goes beyond simply developing property. We focus on creating spaces that people can confidently invest in, build upon and make part of their future.',
  aboutButtonText: 'Know More About Us →',
  
  whyVeloraHeading: 'Why Choose Velora?',
  whyVeloraItems: [
    {
      id: 'why-1',
      title: 'Strategic Locations',
      description: 'Carefully selected locations with strong connectivity and development potential.',
      icon: 'map-pin',
    },
    {
      id: 'why-2',
      title: 'Thoughtful Development',
      description: 'Every project is planned with functionality, accessibility and aesthetics in mind.',
      icon: 'settings',
    },
    {
      id: 'why-3',
      title: 'Transparent Approach',
      description: 'Clear communication and straightforward information throughout the customer journey.',
      icon: 'file-text',
    },
    {
      id: 'why-4',
      title: 'Nature & Lifestyle',
      description: 'Developments that aim to balance modern living with natural surroundings.',
      icon: 'leaf',
    },
    {
      id: 'why-5',
      title: 'Customer First',
      description: 'From your first enquiry to your site visit and beyond, we focus on creating a smooth experience.',
      icon: 'user',
    },
    {
      id: 'why-6',
      title: 'Future-Focused Vision',
      description: 'We look beyond today\'s requirements to create opportunities for tomorrow.',
      icon: 'trending-up',
    },
  ],
  
  featuredProjectSubtitle: 'Your Space. Your Nature. Your Future.',
  featuredProjectDescription: 'A thoughtfully planned plotted development created for those looking to own a piece of land surrounded by nature while staying connected to the essentials of modern life.',
  featuredPlotSizes: '3 to 6 Guntha (Editable)',
  featuredLocation: 'Mandangad, Ratnagiri',
  featuredSurroundings: 'Lush natural environment',
  featuredConnectivity: 'Well connected and accessible',
  featuredDocs: 'Clear and secure',
  
  locationHeading: 'Strategic Location',
  locationSubheading: 'Well Connected. Well Positioned.',
  
  galleryHeading: 'Gallery',
  gallerySubheading: 'See the Vision. Experience the Space.',
  
  testimonialsHeading: 'What Our Customers Say',
  testimonialsSubheading: 'Hear from people who have visited our projects and experienced the difference.',
  
  leadHeading: "Let's Find the Right Property for You",
  leadSubheading: "Tell us what you're looking for and our property advisor will get in touch with you.",
  
  footerDisclaimer: 'RERA Information (As applicable for each project)',
};

export const INITIAL_CONTACT_SETTINGS: ContactSettings = {
  phone: '9322133592',
  phoneAlt: '+91 92409 53403 | +91 95792 22856',
  whatsapp: '9322133592',
  email: 'veloradevelopers.inquiry@gmail.com',
  siteAddress: 'Amrutvan, Near Pat MIDC, Tal. Mandangad, Dist. Ratnagiri - 415203, Maharashtra, India',
  officeAddress: 'Velora Developers, Corporate Office, Ratnagiri, Maharashtra, India',
  instagramUrl: 'https://instagram.com/veloradevelopers',
  facebookUrl: 'https://facebook.com/veloradevelopers',
  youtubeUrl: 'https://youtube.com/@veloradevelopers',
  googleMapsUrl: 'https://maps.google.com/?q=Mandangad+Ratnagiri',
  websiteUrl: 'www.veloradevelopers.com',
  reraText: 'RERA Information (As applicable for each project)',
};

export const INITIAL_SEO_SETTINGS: SEOSettings = {
  metaTitle: 'Velora Developers — Turning Land Into Landmarks | Luxury Real Estate',
  metaDescription: 'Discover thoughtfully planned luxury plotted developments by Velora Developers in Ratnagiri, Maharashtra. Featuring Amrutvan & Green Opulence.',
  keywords: 'Velora Developers, Amrutvan, Green Opulence, Mandangad plots, Ratnagiri NA plots, Konkan real estate, luxury plotted development',
  ogImage: ASSETS.heroEntrance,
  googleAnalyticsId: 'G-VELORA2026',
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-owner',
    name: 'Nathen Pereira (Owner)',
    email: 'veloradevelopers.inquiry@gmail.com',
    password: 'velora2026',
    role: 'Super Admin',
    department: 'Executive / Ownership',
    phone: '+91 93221 33592',
    status: 'Active',
    createdAt: 'Jan 15, 2026',
    lastLogin: 'Active session',
    isOwner: true,
  },
  {
    id: 'user-employee-1',
    name: 'Sales & Site Team',
    email: 'employee@veloradevelopers.com',
    password: 'employee2026',
    role: 'Employee',
    department: 'Sales & Site Inquiries',
    phone: '+91 92409 53403',
    status: 'Active',
    createdAt: 'Feb 01, 2026',
    lastLogin: 'Oct 02, 2026',
    isOwner: false,
  },
];

export const INITIAL_POPUP_SETTINGS: PromotionalPopupSettings = {
  enabled: true,
  layout: 'text-and-image',
  badgeText: 'Festive Launch Privilege',
  headline: 'Special ₹2,00,000 Early Bird Privilege',
  subheadline: 'Celebrate the new launch of Phase 2 at Amrutvan, Mandangad',
  bodyText: 'Book your premium mountain-view villa plot this month and receive exclusive inaugural benefits with clear NA collector sanctions and immediate 7/12 extract transfer.',
  highlightPoints: [
    '₹2 Lakh direct savings on first 10 plots',
    'Zero Stamp Duty & Registration Assistance',
    'Complimentary 1-Year Luxury Clubhouse Pass',
    'Clear 7/12 extract & immediate boundary demarcation',
  ],
  discountCode: 'FESTIVE-VELORA',
  image: ASSETS.heroEntrance,
  imageAlt: 'Amrutvan luxury estate entrance gate during sunset',
  imagePosition: 'top',
  linkedProjectId: 'amrutvan',
  primaryCtaText: 'Explore Amrutvan & Claim Offer →',
  primaryCtaAction: 'open-project',
  secondaryCtaText: 'Book a Free Site Visit',
  secondaryCtaAction: 'open-site-visit',
  delaySeconds: 2,
  frequency: 'once-per-session',
};

export const INITIAL_CHANNEL_PARTNER_CONTENT: ChannelPartnerContent = {
  // Hero Section
  heroBadge: 'Velora Channel Partner Program',
  heroHeading: 'Partner With Velora.',
  heroHeadingHighlight: 'Grow Together.',
  heroDescription:
    'Join our Channel Partner network and connect your clients with thoughtfully planned real estate opportunities from Velora Developers.',
  heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
  heroImageAlt: 'Velora Developers Channel Partner Network',
  heroPrimaryCtaText: 'Become a Channel Partner',
  heroSecondaryCtaText: 'Talk to Our Team',
  heroWhatsAppText: 'WhatsApp Desk',
  heroTrustBadge1: '100% Clear Title Land',
  heroTrustBadge2: 'Collector & NA Sanctioned',
  heroTrustBadge3: 'Zero Registration Fee',

  // Trust / Value Strip (5 items)
  valueStrip: [
    { id: 'val-1', title: 'Quality Projects', subtitle: 'Nature & Master Planned' },
    { id: 'val-2', title: 'Professional Support', subtitle: 'Dedicated Partner Desk' },
    { id: 'val-3', title: 'Marketing Assistance', subtitle: 'Brochures, Kits & Creatives' },
    { id: 'val-4', title: 'Transparent Process', subtitle: 'Clear Lead Tagging' },
    { id: 'val-5', title: 'Long-Term Partnership', subtitle: 'Grow Beyond Single Deals' },
  ],

  // Why Partner With Velora (6 Cards)
  whyPartnerBadge: 'MUTUAL RESPECT & SUCCESS',
  whyPartnerHeading: 'Why Partner With Velora?',
  whyPartnerDescription:
    'Build a long-term relationship with a developer that values transparency, professionalism and partner success.',
  whyPartnerCards: [
    {
      id: 'why-1',
      title: 'Attractive Earning Opportunity',
      description:
        "Earn through successful property referrals and sales, subject to Velora Developers' applicable channel partner terms.",
      badge: 'Timely Milestone Payouts',
    },
    {
      id: 'why-2',
      title: 'Quality Projects',
      description:
        'Represent thoughtfully planned real estate projects designed with long-term value and customer needs in mind.',
      badge: 'Clear Land Titles & Sanctions',
    },
    {
      id: 'why-3',
      title: 'Marketing Support',
      description:
        'Access project information, creatives and marketing material to help you confidently present the opportunity to your clients.',
      badge: 'Brochures & WhatsApp Creatives',
    },
    {
      id: 'why-4',
      title: 'Sales Support',
      description: 'Our team supports you through enquiries, site visits and the sales process.',
      badge: 'Dedicated On-Ground Managers',
    },
    {
      id: 'why-5',
      title: 'Transparent Process',
      description:
        'Clear communication and a professional process from lead registration to transaction.',
      badge: 'Protected Client Registration',
    },
    {
      id: 'why-6',
      title: 'Long-Term Partnership',
      description:
        'Build a relationship with Velora Developers beyond a single transaction.',
      badge: 'Portfolio Growth & New Launches',
    },
  ],
  whyPartnerDisclaimer:
    "* Channel partner engagements are subject to Velora Developers' standard partner terms and applicable regulatory provisions. No guaranteed sales or earnings claims are implied.",

  // How It Works (4 Steps)
  howItWorksBadge: 'SEAMLESS 4-STEP ONBOARDING',
  howItWorksHeading: 'How the Channel Partnership Works',
  howItWorksDescription:
    'A transparent, streamlined journey from your initial onboarding to closing and growing your network.',
  howItWorksSteps: [
    {
      id: 'step-1',
      stepNumber: '01',
      title: 'Register',
      description: 'Submit your details to join the Velora Channel Partner network.',
      badge: 'Free Onboarding',
    },
    {
      id: 'step-2',
      stepNumber: '02',
      title: 'Get Project Information',
      description:
        'Receive relevant project details, brochures, pricing information and marketing resources.',
      badge: 'Digital Toolkits',
    },
    {
      id: 'step-3',
      stepNumber: '03',
      title: 'Refer Your Client',
      description: 'Introduce genuine prospects who are interested in Velora\'s projects.',
      badge: 'Secure Lead Tagging',
    },
    {
      id: 'step-4',
      stepNumber: '04',
      title: 'Close & Grow',
      description:
        'Our team supports the customer journey while you build your relationship and business with Velora.',
      badge: 'Ongoing Relationship',
    },
  ],

  // Who Can Partner
  whoCanPartnerBadge: 'OPEN TO GROWING NETWORKS',
  whoCanPartnerHeading: 'Who Can Partner With Us?',
  whoCanPartnerDescription:
    "You don't need to be a large brokerage firm. If you have a genuine network of property buyers and want to build a professional relationship with a developer, we'd like to hear from you.",
  whoCanPartnerTerritories:
    'Active opportunities for partners across Mumbai, Navi Mumbai, Thane, Pune, and the scenic Konkan belt.',
  whoCanPartnerAudiences: [
    {
      id: 'aud-1',
      title: 'Real Estate Brokers',
      description: 'Licensed brokerage firms and veteran property dealmakers.',
    },
    {
      id: 'aud-2',
      title: 'Property Consultants',
      description: 'Advisors offering tailored property portfolios to clients.',
    },
    {
      id: 'aud-3',
      title: 'Independent Agents',
      description: 'Self-employed real estate professionals with direct buyer relationships.',
    },
    {
      id: 'aud-4',
      title: 'Freelance Property Advisors',
      description: 'Part-time or flexible consultants connecting buyers to plotted land.',
    },
    {
      id: 'aud-5',
      title: 'Referral Partners',
      description: 'Professionals who introduce genuine friends, relatives, and colleagues.',
    },
    {
      id: 'aud-6',
      title: 'Local Network Professionals',
      description: 'Chartered accountants, tax advisors, and executives with trusted circles.',
    },
    {
      id: 'aud-7',
      title: 'Real Estate Marketing Professionals',
      description: 'Digital and direct marketers driving qualified property inquiries.',
    },
    {
      id: 'aud-8',
      title: 'Strong Buyer Networkers',
      description: 'Individuals with strong investor circles seeking appreciating land assets.',
    },
  ],

  // What We Provide (10 items)
  whatWeProvideBadge: 'END-TO-END ENABLEMENT',
  whatWeProvideHeading: 'Everything You Need to Sell With Confidence',
  whatWeProvideDescription:
    'We empower our channel partners with comprehensive sales collateral, responsive ground support, and real-time project updates.',
  whatWeProvideItems: [
    { id: 'prov-1', title: 'Project Brochures', description: 'High-res downloadable PDFs' },
    { id: 'prov-2', title: 'Pricing Information', description: 'Transparent plot rate sheets' },
    { id: 'prov-3', title: 'Project Presentations', description: 'Client-ready slide decks' },
    { id: 'prov-4', title: 'Marketing Creatives', description: 'Social & WhatsApp creatives' },
    { id: 'prov-5', title: 'Location Information', description: 'Highway & connectivity guides' },
    { id: 'prov-6', title: 'Site Visit Coordination', description: 'Guided pickup & site tours' },
    { id: 'prov-7', title: 'Sales Team Assistance', description: 'Direct manager support' },
    { id: 'prov-8', title: 'Customer Enquiry Support', description: 'Fast objection resolution' },
    { id: 'prov-9', title: 'Project Updates', description: 'On-ground progress photos' },
    { id: 'prov-10', title: 'Partner Communication', description: 'Dedicated partner hotline' },
  ],

  // Featured Project Section
  featuredProjectBadge: 'FLAGSHIP OPPORTUNITY',
  featuredProjectHeading: 'Start With Amrutvan',
  featuredProjectDescription:
    'Introduce your clients to Amrutvan — a thoughtfully planned plotted development opportunity in Konkan by Velora Developers.',
  featuredProjectSlug: 'amrutvan',

  // Partner Benefits (4 cards)
  benefitsBadge: 'ADVANTAGE VELORA',
  benefitsHeading: 'Built Around Partner Success',
  benefitsList: [
    {
      id: 'ben-1',
      number: '01',
      title: 'Professional Relationship',
      description:
        'Direct access to developers, prompt communication, and a culture of mutual respect.',
    },
    {
      id: 'ben-2',
      number: '02',
      title: 'Sales & Site Visit Support',
      description:
        'On-site assistance, vehicle coordination, and guided layout presentations for your buyers.',
    },
    {
      id: 'ben-3',
      number: '03',
      title: 'Marketing Resources',
      description:
        'White-label presentations, HD drone footage, and project brochures ready to circulate.',
    },
    {
      id: 'ben-4',
      number: '04',
      title: 'Opportunity to Grow With Velora',
      description:
        'First access to pre-launches, volume partner tiers, and long-term portfolio synergy.',
    },
  ],

  // Testimonials Section
  testimonialsBadge: 'PARTNER VOICES',
  testimonialsHeading: 'What Our Partners Say',
  testimonialsEmptyNotice:
    '"Partner testimonials will appear here as verified partner reviews are onboarded."',
  testimonialsSubNotice:
    'Velora Developers maintains authentic, verifiable records for all channel partner collaborations across Mumbai, Pune & Konkan.',

  // FAQs
  faqsBadge: 'CLARITY & TRANSPARENCY',
  faqsHeading: 'Frequently Asked Questions',
  faqsDescription:
    'Find answers to key questions about registration, marketing assistance, customer referrals, and partner terms.',
  faqsList: [
    {
      id: 'faq-1',
      question: 'Who can become a Velora Channel Partner?',
      answer:
        'Any individual or firm with an active network of genuine property buyers — including real estate brokers, property consultants, independent agents, freelance property advisors, financial advisors, corporate networkers, or local property influencers in Mumbai, Navi Mumbai, Thane, Pune, and Konkan — can join our network.',
    },
    {
      id: 'faq-2',
      question: 'How do I register as a Channel Partner?',
      answer:
        'Simply fill out the registration form on this page with your contact details, operational area, and professional background. Our dedicated Channel Partner relations team will review your submission and reach out within 24 business hours with project kits and welcome orientation.',
    },
    {
      id: 'faq-3',
      question: 'Do I need to be a registered real estate company?',
      answer:
        'No. While registered brokerage firms and MahaRERA registered professionals are welcome, you do not need to be a large company. Independent property consultants, referral partners, and individuals with genuine buyer networks are equally eligible to partner with Velora Developers.',
    },
    {
      id: 'faq-4',
      question: 'How do I refer a customer?',
      answer:
        'You can register your prospect via our Channel Partner helpline, dedicated WhatsApp desk, or through our partner enquiry portal before their first site visit. Once registered, your client is securely tagged to your partner account throughout their discovery and purchase journey.',
    },
    {
      id: 'faq-5',
      question: 'Will Velora provide project information and marketing material?',
      answer:
        'Yes. Upon registration, you receive complete high-resolution digital marketing kits, including project brochures, master layout plans, sanctioned approvals summary, unbranded WhatsApp-ready creatives, video walkthroughs, and location milestone presentations.',
    },
    {
      id: 'faq-6',
      question: 'Can I arrange site visits for my customers?',
      answer:
        'Absolutely. Our sales team coordinates site visits directly with you or your clients. We provide on-site hospitality, dedicated guided plot walkthroughs, and complete assistance at our project sales galleries in Konkan.',
    },
    {
      id: 'faq-7',
      question: 'How does the partner payout/commission process work?',
      answer:
        "Channel partner payouts are structured transparently and processed per Velora Developers' applicable channel partner terms and milestone schedules agreed upon registration. Payments are made through standard banking channels following successful booking and documentation milestones.",
    },
    {
      id: 'faq-8',
      question: 'Can I promote multiple Velora projects?',
      answer:
        'Yes. As an authorized Velora Channel Partner, you can present any current and future projects in our portfolio, including Amrutvan and upcoming gated plotted communities across Maharashtra.',
    },
    {
      id: 'faq-9',
      question: 'Is there any registration fee?',
      answer:
        'No. Registration for the Velora Developers Channel Partner program is completely free of cost. There are no joining fees, upfront deposits, or subscription charges.',
    },
    {
      id: 'faq-10',
      question: 'Who can I contact for Channel Partner support?',
      answer:
        'You can reach our Channel Partner Desk directly via phone at +91 92409 53403, email at info@veloradevelopers.com, or send an instant message on WhatsApp to discuss collaboration and project availability.',
    },
  ],

  // Contact Desk & Form
  formBadge: 'JOIN AS CHANNEL PARTNER',
  formHeading: 'Channel Partner Registration Form',
  deskPhone: '92409 53403',
  deskWhatsApp: '92409 53403',
  deskEmail: 'partners@veloradevelopers.com',
};

