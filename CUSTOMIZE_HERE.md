# RANVIK — Customization & Developer Guide

Welcome to the **RANVIK** Footwear E-Commerce codebase! This guide is written for both non-technical store owners and developers looking to customize content, images, branding, colors, or product catalogs.

---

## 1. Quick Customization: `src/config/siteConfig.ts`

Almost all global copy, phone numbers, email addresses, brand statements, features, and imagery can be customized without touching any JSX/component code.

Open `/src/config/siteConfig.ts` to customize:

### Brand Identity & Slogans
```typescript
brand: {
  name: 'RANVIK',
  tagline: "Men's Leather Military Boots",
  heroHeadline: 'BUILT FOR THE GROUND',
  heroSubheadline:
    'Engineered for durability, confidence and everyday movement. Premium leather military boots with military-grade attitude and luxury craftsmanship.',
}
```

### Pricing & Shipping Badges
```typescript
priceBadge: '₹2,199 – ₹3,899',
features: [
  { icon: 'Shield', title: 'GENUINE LEATHER', description: '1.8mm hand-selected bovine hides' },
  { icon: 'Award', title: 'MIL-SPEC TOUGH', description: 'Reinforced heel & combat outsoles' },
  { icon: 'Truck', title: 'FREE SHIPPING', description: 'Across all 19,000+ Indian PIN codes' },
  { icon: 'RefreshCw', title: '7-DAY REPLACEMENTS', description: 'Zero-friction doorstep sizing exchange' },
]
```

### Social Links & Support Information
```typescript
support: {
  email: 'support@ranvikfootwear.com',
  whatsapp: '+91 98765 43210',
  dispatchAddress: 'Agra Leather Foundry, Uttar Pradesh 282001, India',
  hours: 'Mon – Sat: 09:00 – 19:00 IST'
}
```

---

## 2. Managing Products: `src/data/products.ts`

Each product model has rich metadata, multiple high-resolution images, specifications, size options, and customer reviews.

To add or edit a boot:
1. Open `/src/data/products.ts`
2. Update the `products` array with your custom specs:
   - `name`: Model name (e.g., `RANVIK TACTICAL-01`)
   - `price`: Price in INR (e.g., `2499`)
   - `originalPrice`: Strikethrough MRP (e.g., `4499`)
   - `images`: Array of asset paths (e.g., `['/assets/boot1.png', '/assets/boot2.png']`)
   - `bootType`: `'Combat' | 'Tactical' | 'Officer' | 'Field'`
   - `availableSizes`: UK sizes `[6, 7, 8, 9, 10, 11]`
   - `badge`: Optional tag (e.g., `'BESTSELLER'`, `'NEW RELEASE'`, `'MIL-SPEC'`)

---

## 3. Product & Brand Assets: `/public/assets/`

All high-definition product photography and hero imagery reside cleanly in:
```
/public/assets/
  ├── hero-boot.png       # Hero showcase image
  ├── boot1.png           # Ranger Tactical 8"
  ├── boot2.png           # Stealth Combat Desert Tan
  ├── boot3.png           # Officer Garrison Oxford
  ├── boot4.png           # Patrol Desert Sand Commando
  ├── boot5.png           # Vanguard Heavy Lug 10"
  ├── boot6.png           # Recon Lightweight Side-Zip
  ├── leather-texture.png # Agra Foundry Heritage feature
  └── sole-traction.png   # Outsole technology showcase
```

To swap an image, drop your new image file into `/public/assets/` using the same filename, or change the path in `src/data/products.ts`.

---

## 4. Color Palette & Design System: `src/index.css`

RANVIK uses a **LIGHT × PREMIUM × RUGGED × MODERN** color scheme. The core design tokens are defined in `src/index.css`:

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Warm Off-White** | `#F7F6F2` | Body background, modal backdrop tones |
| **Pure White** | `#FFFFFF` | Card surfaces, inputs, modal containers |
| **Soft Stone** | `#E8E6E0` | Sub-panels, pill chips, category filters |
| **Light Concrete** | `#E2E0DA` | Crisp 1px geometric borders, dividers |
| **Deep Charcoal** | `#181818` | Primary display text, primary action buttons |
| **Body Neutral** | `#55524B` | Secondary descriptions, specification labels |
| **Muted Military Olive**| `#626653` | Tactical badges, spec highlights, trust icons |
| **Leather Tan / Accent**| `#4A382A` | Leather callouts, heritage craftsmanship badges |

---

## 5. Live E-Commerce Features

All the core e-commerce interactions are fully functioning:
- **Product Filtering & Sorting**: Filter by boot type (Combat, Tactical, Officer, Field), leather finish, shaft height, price range, and sort by price or rating.
- **Interactive Sizing & Stock Check**: Select UK sizes 6 through 11 with instantaneous inventory verification and interactive size matrix guide.
- **Cart & Slide-Over Drawer**: Real-time quantity adjustment, subtotal calculation, free shipping threshold progress bar, and promo code engine (e.g., `FIRSTBOOT`, `COMMANDO10`).
- **Checkout & Razorpay-Style Payment**: 5-step checkout flow (Contact info, shipping address, surface vs. air courier speeds, UPI/Card/Netbanking/COD payment, order confirmation).
- **Live Order Tracking**: Interactive shipment timeline (Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered) with AWB generation and address receipt.
- **Saved Wishlist**: Instant heart-toggle to track favorite boots and quick-add to bag.
- **Customer Portal**: Sign in, switch default shipping addresses, and review past orders.
- **Search & Intel Tags**: Instant live fuzzy search across all boot specs and categories.

---

## 6. Deployment & Production

To compile for production:
```bash
npm run build
```
This runs `vite build`, bundling static assets directly to `/dist`.
