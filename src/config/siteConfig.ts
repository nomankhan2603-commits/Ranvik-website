/**
 * RANVIK — Central Site & Brand Configuration
 * 
 * Edit this file to customize brand names, texts, hero messaging,
 * images, contact details, social links, and size guides without
 * touching individual component files.
 */

export interface FeatureItem {
  number: string;
  title: string;
  description: string;
}

export interface SizeGuideRow {
  size: number;
  footLengthCm: string;
  usSize: string;
  euSize: string;
}

export const siteConfig = {
  brandName: 'RANVIK',
  brandTagline: 'RUGGED. REFINED. READY.',
  brandCategory: "Men's Leather Military & Tactical-Inspired Boots",
  priceRangeDisplay: '₹2,000–₹4,000',

  logo: {
    src: '/assets/ranvik-logo-clean-transparent.png',
    headerSrc: '/assets/ranvik-logo-clean-transparent.png',
    footerSrc: '/assets/ranvik-logo-clean-transparent.png',
    alt: 'RANVIK Leather Military Boots',
  },

  announcement: {
    text: 'FREE SHIPPING ON ORDERS ABOVE ₹2,999 • 7-DAY EASY RETURNS • CASH ON DELIVERY AVAILABLE',
    freeShippingThreshold: 2999,
    standardShippingFee: 149,
  },

  hero: {
    eyebrow: 'COLLECTION SERIES 2026',
    title: 'BUILT FOR THE GROUND.',
    subtitle:
      'Premium leather boots engineered for durability, confidence and everyday movement.',
    image: '/assets/hero/hero-main.jpg',
    secondaryImage: '/assets/hero/hero-secondary.jpg',
    ctaPrimary: 'SHOP MILITARY BOOTS',
    ctaSecondary: 'EXPLORE THE COLLECTION',
  },

  fieldSeries: {
    eyebrow: 'THE FIELD SERIES',
    heading: 'THE FIELD SERIES',
    subheading:
      'Military-grade attitude. Premium leather construction. Everyday performance.',
  },

  brandStory: {
    eyebrow: 'BRAND DISPATCH',
    heading: 'NO COMPROMISE. JUST GRIT.',
    quote:
      'RANVIK was built around one simple idea — a serious boot should look powerful, feel dependable and be ready for whatever the day demands.',
    body:
      'Originating from the traditional footwear craft belt of Agra, India, RANVIK represents a modern interpretation of rugged utility. We combine hand-selected full-grain bovine hides, reinforced steel shank arch support, and dual-density high-traction lugged soles to create boots that conquer gravel trails, highway rides, and urban tarmac with ease.',
    image: '/assets/banners/story-banner.jpg',
    badge: 'HANDCRAFTED LEATHER • INDIA',
  },

  features: [
    {
      number: '01',
      title: 'PREMIUM LEATHER',
      description:
        'Durable leather construction designed for long-term wear and rich natural patina.',
    },
    {
      number: '02',
      title: 'COMMAND GRIP',
      description:
        'Traction-focused outsole designed for confident movement on wet tarmac and rough terrain.',
    },
    {
      number: '03',
      title: 'BUILT FOR COMFORT',
      description:
        'Supportive orthotic construction with anti-fatigue footbed for all-day endurance.',
    },
    {
      number: '04',
      title: 'FIELD READY',
      description:
        'Rugged design inspired by military footwear, engineered for real everyday versatility.',
    },
  ] as FeatureItem[],

  lifestyleBanner: {
    eyebrow: 'FIELD TESTED',
    heading: 'MADE TO MOVE.',
    subheading:
      'Built for riders, explorers, and men who command presence with every step.',
    cta: 'SHOP THE COLLECTION',
    image: '/assets/lifestyle/lifestyle-01.jpg',
  },

  bestSellers: {
    heading: 'BEST SELLERS',
    subheading:
      'Field-proven silhouettes trusted by over 5,000 riders, travelers, and boot wearers.',
  },

  reviewsSummary: {
    rating: 4.9,
    totalReviews: 1280,
  },

  sizeGuide: [
    { size: 6, footLengthCm: '24.5', usSize: '7', euSize: '40' },
    { size: 7, footLengthCm: '25.5', usSize: '8', euSize: '41' },
    { size: 8, footLengthCm: '26.5', usSize: '9', euSize: '42' },
    { size: 9, footLengthCm: '27.5', usSize: '10', euSize: '43' },
    { size: 10, footLengthCm: '28.5', usSize: '11', euSize: '44' },
    { size: 11, footLengthCm: '29.5', usSize: '12', euSize: '45' },
  ] as SizeGuideRow[],

  social: {
    eyebrow: 'FIELD DISPATCHES',
    heading: 'MADE FOR THE TERRAIN',
    subheading: 'Follow the journey and tag @RANVIKFOOTWEAR to be featured.',
    instagram: 'https://instagram.com/ranvikfootwear',
    facebook: 'https://facebook.com/ranvikfootwear',
    youtube: 'https://youtube.com/@ranvikfootwear',
    posts: [
      {
        id: 'soc-1',
        image: '/assets/lifestyle/lifestyle-01.jpg',
        handle: '@ranvikfootwear',
        tag: 'Himalayan Ride • Ranger X1',
      },
      {
        id: 'soc-2',
        image: '/assets/products/tactical-core.jpg',
        handle: '@ranvikfootwear',
        tag: 'Tactical Core in Action',
      },
      {
        id: 'soc-3',
        image: '/assets/hero/hero-main.jpg',
        handle: '@ranvikfootwear',
        tag: 'Crafted Pull-Up Leather',
      },
      {
        id: 'soc-4',
        image: '/assets/products/officer-classic.jpg',
        handle: '@ranvikfootwear',
        tag: 'Officer Classic • Agra Foundry',
      },
    ],
  },

  newsletter: {
    heading: 'JOIN THE RANVIK FIELD',
    subheading:
      'Subscribe for field updates, new model drops, leather care guides, and exclusive subscriber perks.',
    perk: 'Get ₹300 OFF your first pair with code FIRSTBOOT',
  },

  contact: {
    email: 'care@ranvikfootwear.in',
    phone: '+91 80000 XXXXX',
    hours: 'Monday – Saturday: 10:00 AM – 7:00 PM IST',
    address: 'Agra Footwear Craft Cluster, Uttar Pradesh, India',
    supportNote:
      'Our specialist team assists with size selection, break-in guidance, and order delivery status.',
  },

  trustBadges: [
    { title: 'GENUINE LEATHER', subtitle: 'Hand-selected premium hides' },
    { title: '7-DAY RETURNS', subtitle: 'Hassle-free size exchanges' },
    { title: 'CASH ON DELIVERY', subtitle: 'Available across all India pin codes' },
    { title: 'SECURE CHECKOUT', subtitle: 'Razorpay & UPI payment security' },
  ],
};
