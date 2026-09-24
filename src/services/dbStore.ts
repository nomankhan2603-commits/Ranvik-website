import {
  DBProduct,
  DBProductVariant,
  DBProductImage,
  DBCategory,
  DBOrder,
  DBOrderItem,
  DBOrderStatusHistory,
  DBInventoryTransaction,
  Coupon,
  DBSiteContent,
  Address,
  UserProfile,
} from '../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

// Local storage key for fallback synchronization
const STORAGE_KEY = 'RANVIK_DB_STORE_V2';

interface DBState {
  categories: DBCategory[];
  products: DBProduct[];
  variants: DBProductVariant[];
  images: DBProductImage[];
  orders: DBOrder[];
  inventoryTransactions: DBInventoryTransaction[];
  coupons: Coupon[];
  siteContent: Record<string, DBSiteContent['value']>;
  profiles: UserProfile[];
}

const INITIAL_CATEGORIES: DBCategory[] = [
  {
    id: 'cat-tactical',
    name: 'Tactical Boots',
    slug: 'tactical-boots',
    description: 'High-mobility tactical footwear for rapid movement and urban patrol.',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-combat',
    name: 'Combat Boots',
    slug: 'combat-boots',
    description: 'Heavy-duty combat boots engineered for rugged field terrain.',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-officer',
    name: 'Officer Boots',
    slug: 'officer-boots',
    description: 'Polished parade and ceremonial silhouettes crafted with premium leather.',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-field',
    name: 'Field Boots',
    slug: 'field-boots',
    description: 'All-weather, water-resistant field boots with reinforced combat lug outsoles.',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_PRODUCTS: DBProduct[] = [
  {
    id: 'prod-rx1',
    name: 'RANVIK Ranger X1',
    slug: 'ranvik-ranger-x1',
    sku: 'RVK-RX1-BASE',
    shortDescription: '8-inch full-grain combat boot with reinforced Goodyear welt and quick-lacing hooks.',
    description: 'Engineered for tactical endurance and rigorous all-terrain movement. Built with 1.8mm hand-selected full-grain bovine leather and aggressive multi-directional lugged outsoles.',
    categoryId: 'cat-combat',
    mrp: 4499,
    sellingPrice: 2499,
    status: 'active',
    brand: 'RANVIK',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-tac-core',
    name: 'RANVIK Tactical Core',
    slug: 'ranvik-tactical-core',
    sku: 'RVK-TAC-CORE',
    shortDescription: 'Breathable lightweight desert patrol boot with ballistic Cordura panelling.',
    description: 'High-mobility tactical boot blending rugged leather lowers with abrasion-resistant nylon uppers. Formulated for heat dispersal and rapid foot response.',
    categoryId: 'cat-tactical',
    mrp: 4999,
    sellingPrice: 2799,
    status: 'active',
    brand: 'RANVIK',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-cmd-08',
    name: 'RANVIK Command 8',
    slug: 'ranvik-command-8',
    sku: 'RVK-CMD-08',
    shortDescription: 'High-shine parade and ceremonial boot with double-stitched leather toe cap.',
    description: 'Crafted from mirror-buffed full-grain leather, the Command 8 offers disciplined poise and uncompromising arch support during formal inspections.',
    categoryId: 'cat-officer',
    mrp: 5499,
    sellingPrice: 3299,
    status: 'active',
    brand: 'RANVIK',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-ptr-pro',
    name: 'RANVIK Patrol Pro',
    slug: 'ranvik-patrol-pro',
    sku: 'RVK-PTR-PRO',
    shortDescription: 'Mid-height side-zip patrol boot engineered for rapid emergency deployment.',
    description: 'Features a durable YKK industrial side zipper protected by Velcro retention flap, allowing quick on/off transitions without untying speed laces.',
    categoryId: 'cat-tactical',
    mrp: 4299,
    sellingPrice: 2399,
    status: 'active',
    brand: 'RANVIK',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-blk-ops',
    name: 'RANVIK Black Ops',
    slug: 'ranvik-black-ops',
    sku: 'RVK-BLK-OPS',
    shortDescription: 'Heavy lug 10-inch tactical storm boot with matte black oil-resistant finish.',
    description: 'Heavyweight combat performer equipped with high ankle stabilizer shanks, waterproof leather membranes, and deep 6mm compound mud lugs.',
    categoryId: 'cat-combat',
    mrp: 5999,
    sellingPrice: 3499,
    status: 'active',
    brand: 'RANVIK',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-off-cls',
    name: 'RANVIK Officer Classic',
    slug: 'ranvik-officer-classic',
    sku: 'RVK-OFF-CLS',
    shortDescription: 'Low-quarter garrison derby boot built with Goodyear-welted rubber dress soles.',
    description: 'Designed for daily office command and uniform dress requirements, offering bespoke-grade leather lining and cushioned memory-foam footbeds.',
    categoryId: 'cat-officer',
    mrp: 4799,
    sellingPrice: 2899,
    status: 'active',
    brand: 'RANVIK',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-fld-mk2',
    name: 'RANVIK Field Mark II',
    slug: 'ranvik-field-mark-ii',
    sku: 'RVK-FLD-MK2',
    shortDescription: 'Rugged 6-inch commando utility boot with puncture-resistant mid-sole layer.',
    description: 'Versatile workhorse boot engineered for rough outdoor operations, motorcycling, and heavy work. Treated with silicone water repellency.',
    categoryId: 'cat-field',
    mrp: 4199,
    sellingPrice: 2199,
    status: 'active',
    brand: 'RANVIK',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Generate size variants 6 through 11 for all products
function generateInitialVariants(): DBProductVariant[] {
  const list: DBProductVariant[] = [];
  INITIAL_PRODUCTS.forEach((prod) => {
    const stockMap: Record<number, number> = {
      6: 10,
      7: 18,
      8: 25,
      9: 31,
      10: 22,
      11: 7,
    };

    [6, 7, 8, 9, 10, 11].forEach((sz) => {
      list.push({
        id: `var-${prod.id}-${sz}`,
        productId: prod.id,
        size: sz,
        sku: `${prod.sku.replace('-BASE', '')}-${sz < 10 ? '0' + sz : sz}`,
        price: prod.sellingPrice,
        stockQuantity: stockMap[sz] || 15,
        reservedQuantity: 0,
        lowStockThreshold: 5,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });
  return list;
}

const INITIAL_IMAGES: DBProductImage[] = [
  {
    id: 'img-1',
    productId: 'prod-rx1',
    storagePath: 'products/ranger-x1/ranger-x1.jpg',
    publicUrl: '/assets/products/ranger-x1.jpg',
    altText: 'RANVIK Ranger X1 Profile',
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-2',
    productId: 'prod-rx1',
    storagePath: 'products/ranger-x1/ranger-x1-01.jpg',
    publicUrl: '/assets/products/ranger-x1-01.jpg',
    altText: 'RANVIK Ranger X1 Angle',
    sortOrder: 1,
    isPrimary: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-3',
    productId: 'prod-rx1',
    storagePath: 'products/ranger-x1/sole.jpg',
    publicUrl: '/assets/hero/hero-main.jpg',
    altText: 'RANVIK Ranger X1 Outsole',
    sortOrder: 2,
    isPrimary: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-4',
    productId: 'prod-tac-core',
    storagePath: 'products/tactical-core/tactical-core.jpg',
    publicUrl: '/assets/products/tactical-core.jpg',
    altText: 'RANVIK Tactical Core Desert',
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-5',
    productId: 'prod-cmd-08',
    storagePath: 'products/command-8/command-8.jpg',
    publicUrl: '/assets/products/command-8.jpg',
    altText: 'RANVIK Command 8 Officer',
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-6',
    productId: 'prod-ptr-pro',
    storagePath: 'products/patrol-pro/patrol-pro.jpg',
    publicUrl: '/assets/products/patrol-pro.jpg',
    altText: 'RANVIK Patrol Pro Sand',
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-7',
    productId: 'prod-blk-ops',
    storagePath: 'products/black-ops/black-ops.jpg',
    publicUrl: '/assets/products/black-ops.jpg',
    altText: 'RANVIK Black Ops Heavy',
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-8',
    productId: 'prod-off-cls',
    storagePath: 'products/officer-classic/officer-classic.jpg',
    publicUrl: '/assets/products/officer-classic.jpg',
    altText: 'RANVIK Officer Classic',
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'img-9',
    productId: 'prod-fld-mk2',
    storagePath: 'products/field-mk2/field-mark-ii.jpg',
    publicUrl: '/assets/products/field-mark-ii.jpg',
    altText: 'RANVIK Field Mark II',
    sortOrder: 0,
    isPrimary: true,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'FIRSTBOOT',
    discountType: 'fixed',
    discountValue: 300,
    fixedDiscount: 300,
    minOrderValue: 2000,
    maximumDiscount: 300,
    usageLimit: 1000,
    usedCount: 42,
    description: 'Flat ₹300 OFF for first-time command boots.',
    status: 'active',
  },
  {
    id: 'coup-2',
    code: 'COMMANDO10',
    discountType: 'percentage',
    discountValue: 10,
    discountPercent: 10,
    minOrderValue: 2500,
    maximumDiscount: 500,
    usageLimit: 500,
    usedCount: 88,
    description: '10% OFF on all tactical orders above ₹2,499.',
    status: 'active',
  },
  {
    id: 'coup-3',
    code: 'TACTICAL15',
    discountType: 'percentage',
    discountValue: 15,
    discountPercent: 15,
    minOrderValue: 3500,
    maximumDiscount: 750,
    usageLimit: 200,
    usedCount: 19,
    description: '15% OFF for veteran squad orders over ₹3,500.',
    status: 'active',
  },
];

const INITIAL_CONTENT = {
  homepage_hero: {
    heroTitle: 'BUILT FOR THE GROUND',
    heroSubtitle:
      'Engineered for durability, confidence and everyday movement. Premium leather military boots with military-grade attitude and luxury craftsmanship.',
    heroImage: '/assets/hero-boot.png',
    ctaText: 'ORDER NOW — FREE SHIPPING',
    ctaUrl: '#catalog',
    campaignTitle: 'AGRA LEATHER FOUNDRY HERITAGE',
    campaignDescription:
      'Every boot is lasted in Agra, utilizing 1.8mm hand-selected bovine hides cured with natural plant oils for exceptional flex and water-resistance.',
  },
};

const INITIAL_ORDERS: DBOrder[] = [
  {
    id: 'ord-10001',
    orderNumber: 'RVK-10001',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    subtotal: 2499,
    discount: 300,
    shippingAmount: 0,
    taxAmount: 0,
    totalAmount: 2199,
    trackingNumber: 'RVK-EXP-908124',
    estimatedDelivery: '3 business days',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    shippingAddressSnapshot: {
      id: 'addr-1',
      fullName: 'Vikramaditya Rathore',
      phone: '+91 98290 11223',
      street: 'Flat 402, Tactical Enclave, Cantt Road',
      city: 'Jodhpur',
      state: 'Rajasthan',
      pinCode: '342001',
      isDefault: true,
    },
    items: [
      {
        id: 'ord-item-1',
        orderId: 'ord-10001',
        productId: 'prod-rx1',
        variantId: 'var-prod-rx1-9',
        productName: 'RANVIK Ranger X1',
        sku: 'RVK-RX1-09',
        size: 9,
        quantity: 1,
        unitPrice: 2499,
        totalPrice: 2499,
        productImageUrl: '/assets/boot1.png',
      },
    ],
    statusHistory: [
      {
        id: 'hist-1',
        orderId: 'ord-10001',
        status: 'order_placed',
        note: 'Order placed with UPI payment confirmation.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'hist-2',
        orderId: 'ord-10001',
        status: 'confirmed',
        note: 'Quality inspection passed at Agra dispatch hub.',
        createdAt: new Date(Date.now() - 86400000 * 1.8).toISOString(),
      },
      {
        id: 'hist-3',
        orderId: 'ord-10001',
        status: 'packed',
        note: 'Custom military carton packaged and labeled.',
        createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      },
      {
        id: 'hist-4',
        orderId: 'ord-10001',
        status: 'shipped',
        note: 'Dispatched via Express Air Courier. AWB generated.',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
  },
];

class DBStore {
  private state: DBState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DBState {
    if (typeof window === 'undefined') {
      return {
        categories: INITIAL_CATEGORIES,
        products: INITIAL_PRODUCTS,
        variants: generateInitialVariants(),
        images: INITIAL_IMAGES,
        orders: INITIAL_ORDERS,
        inventoryTransactions: [],
        coupons: INITIAL_COUPONS,
        siteContent: INITIAL_CONTENT,
        profiles: [],
      };
    }

    try {
      // Clear legacy V1 storage if present
      if (localStorage.getItem('RANVIK_DB_STORE_V1')) {
        localStorage.removeItem('RANVIK_DB_STORE_V1');
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Sanitize image URLs: replace any stale placeholder paths
        const sanitizedImages: DBProductImage[] = (parsed.images || []).map((img: DBProductImage) => {
          if (!img.publicUrl || img.publicUrl.includes('/assets/boot') || img.publicUrl.includes('sole-traction')) {
            const initialMatch = INITIAL_IMAGES.find((i) => i.productId === img.productId && i.isPrimary === img.isPrimary);
            if (initialMatch) {
              return { ...img, publicUrl: initialMatch.publicUrl };
            }
          }
          return img;
        });

        return {
          categories: parsed.categories?.length ? parsed.categories : INITIAL_CATEGORIES,
          products: parsed.products?.length ? parsed.products : INITIAL_PRODUCTS,
          variants: parsed.variants?.length ? parsed.variants : generateInitialVariants(),
          images: sanitizedImages.length ? sanitizedImages : INITIAL_IMAGES,
          orders: parsed.orders?.length ? parsed.orders : INITIAL_ORDERS,
          inventoryTransactions: parsed.inventoryTransactions || [],
          coupons: parsed.coupons?.length ? parsed.coupons : INITIAL_COUPONS,
          siteContent: parsed.siteContent || INITIAL_CONTENT,
          profiles: parsed.profiles || [],
        };
      }
    } catch (e) {
      console.warn('Failed to load RANVIK store from storage:', e);
    }

    const fresh: DBState = {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      variants: generateInitialVariants(),
      images: INITIAL_IMAGES,
      orders: INITIAL_ORDERS,
      inventoryTransactions: [],
      coupons: INITIAL_COUPONS,
      siteContent: INITIAL_CONTENT,
      profiles: [],
    };
    this.save(fresh);
    return fresh;
  }

  private save(newState: DBState) {
    this.state = newState;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
    this.notify();
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState(): DBState {
    return this.state;
  }

  public resetToDefault() {
    const fresh: DBState = {
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      variants: generateInitialVariants(),
      images: INITIAL_IMAGES,
      orders: INITIAL_ORDERS,
      inventoryTransactions: [],
      coupons: INITIAL_COUPONS,
      siteContent: INITIAL_CONTENT,
      profiles: [],
    };
    this.save(fresh);
  }

  // --- Products ---
  public getProducts(includeArchived = false): DBProduct[] {
    return this.state.products.filter(
      (p) => includeArchived || p.status === 'active'
    );
  }

  public getProductById(id: string): DBProduct | undefined {
    return this.state.products.find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): DBProduct | undefined {
    return this.state.products.find((p) => p.slug === slug);
  }

  public upsertProduct(product: Partial<DBProduct> & { name: string; sku: string; sellingPrice: number }): DBProduct {
    const existingIndex = product.id
      ? this.state.products.findIndex((p) => p.id === product.id)
      : -1;

    const id = product.id || `prod-${Date.now()}`;
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const updatedProduct: DBProduct = {
      id,
      name: product.name,
      slug,
      sku: product.sku,
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      categoryId: product.categoryId || (this.state.categories[0]?.id ?? 'cat-tactical'),
      mrp: product.mrp || product.sellingPrice * 1.6,
      sellingPrice: product.sellingPrice,
      status: product.status || 'active',
      brand: 'RANVIK',
      createdAt: existingIndex >= 0 ? this.state.products[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let newProducts = [...this.state.products];
    if (existingIndex >= 0) {
      newProducts[existingIndex] = updatedProduct;
    } else {
      newProducts.unshift(updatedProduct);
      // Auto-create variants 6 to 11 if new
      const newVariants = [...this.state.variants];
      [6, 7, 8, 9, 10, 11].forEach((sz) => {
        newVariants.push({
          id: `var-${id}-${sz}`,
          productId: id,
          size: sz,
          sku: `${product.sku}-${sz < 10 ? '0' + sz : sz}`,
          price: product.sellingPrice,
          stockQuantity: 15,
          reservedQuantity: 0,
          lowStockThreshold: 5,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      this.state.variants = newVariants;
    }

    this.save({
      ...this.state,
      products: newProducts,
    });

    return updatedProduct;
  }

  public archiveProduct(id: string) {
    const updated = this.state.products.map((p) =>
      p.id === id ? { ...p, status: 'archived' as const, updatedAt: new Date().toISOString() } : p
    );
    this.save({ ...this.state, products: updated });
  }

  // --- Variants ---
  public getVariants(productId?: string): DBProductVariant[] {
    if (productId) {
      return this.state.variants.filter((v) => v.productId === productId);
    }
    return this.state.variants;
  }

  public updateVariant(id: string, updates: Partial<DBProductVariant>): DBProductVariant | null {
    const idx = this.state.variants.findIndex((v) => v.id === id);
    if (idx === -1) return null;

    const oldVariant = this.state.variants[idx];
    const updated: DBProductVariant = {
      ...oldVariant,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const newVariants = [...this.state.variants];
    newVariants[idx] = updated;

    this.save({
      ...this.state,
      variants: newVariants,
    });
    return updated;
  }

  // --- Inventory & Stock ---
  public adjustStock(params: {
    variantId: string;
    newQuantity: number;
    reason: DBInventoryTransaction['reason'];
    referenceId?: string;
    createdBy?: string;
  }): { success: boolean; error?: string } {
    const variant = this.state.variants.find((v) => v.id === params.variantId);
    if (!variant) {
      return { success: false, error: 'Variant not found' };
    }

    if (params.newQuantity < 0) {
      return { success: false, error: 'Stock quantity cannot be negative' };
    }

    const prod = this.state.products.find((p) => p.id === variant.productId);
    const qtyBefore = variant.stockQuantity;
    const qtyChange = params.newQuantity - qtyBefore;

    const updatedVariant = {
      ...variant,
      stockQuantity: params.newQuantity,
      updatedAt: new Date().toISOString(),
    };

    const transaction: DBInventoryTransaction = {
      id: `tx-${Date.now()}`,
      variantId: variant.id,
      productName: prod?.name,
      sku: variant.sku,
      size: variant.size,
      quantityBefore: qtyBefore,
      quantityChange: qtyChange,
      quantityAfter: params.newQuantity,
      reason: params.reason,
      referenceId: params.referenceId,
      createdBy: params.createdBy || 'Admin',
      createdAt: new Date().toISOString(),
    };

    const newVariants = this.state.variants.map((v) =>
      v.id === params.variantId ? updatedVariant : v
    );

    this.save({
      ...this.state,
      variants: newVariants,
      inventoryTransactions: [transaction, ...this.state.inventoryTransactions],
    });

    return { success: true };
  }

  // Atomic stock reservation
  public reserveStock(variantId: string, quantity: number): boolean {
    const variant = this.state.variants.find((v) => v.id === variantId);
    if (!variant) return false;

    const available = variant.stockQuantity - variant.reservedQuantity;
    if (available < quantity) return false;

    const newVariants = this.state.variants.map((v) =>
      v.id === variantId
        ? {
            ...v,
            reservedQuantity: v.reservedQuantity + quantity,
            updatedAt: new Date().toISOString(),
          }
        : v
    );

    this.save({ ...this.state, variants: newVariants });
    return true;
  }

  public releaseStock(variantId: string, quantity: number) {
    const newVariants = this.state.variants.map((v) =>
      v.id === variantId
        ? {
            ...v,
            reservedQuantity: Math.max(0, v.reservedQuantity - quantity),
            updatedAt: new Date().toISOString(),
          }
        : v
    );
    this.save({ ...this.state, variants: newVariants });
  }

  public commitStockDeduction(variantId: string, quantity: number, referenceId: string) {
    const variant = this.state.variants.find((v) => v.id === variantId);
    if (!variant) return;

    const qtyBefore = variant.stockQuantity;
    const qtyAfter = Math.max(0, qtyBefore - quantity);
    const prod = this.state.products.find((p) => p.id === variant.productId);

    const transaction: DBInventoryTransaction = {
      id: `tx-${Date.now()}`,
      variantId,
      productName: prod?.name,
      sku: variant.sku,
      size: variant.size,
      quantityBefore: qtyBefore,
      quantityChange: -quantity,
      quantityAfter: qtyAfter,
      reason: 'sale',
      referenceId,
      createdAt: new Date().toISOString(),
    };

    const newVariants = this.state.variants.map((v) =>
      v.id === variantId
        ? {
            ...v,
            stockQuantity: qtyAfter,
            reservedQuantity: Math.max(0, v.reservedQuantity - quantity),
            updatedAt: new Date().toISOString(),
          }
        : v
    );

    this.save({
      ...this.state,
      variants: newVariants,
      inventoryTransactions: [transaction, ...this.state.inventoryTransactions],
    });
  }

  // --- Images ---
  public getImages(productId?: string): DBProductImage[] {
    if (productId) {
      return this.state.images
        .filter((img) => img.productId === productId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return this.state.images;
  }

  public addImage(image: Omit<DBProductImage, 'id' | 'createdAt'>): DBProductImage {
    const id = `img-${Date.now()}`;
    const newImg: DBProductImage = {
      ...image,
      id,
      createdAt: new Date().toISOString(),
    };

    let newImages = [...this.state.images];
    if (newImg.isPrimary) {
      newImages = newImages.map((img) =>
        img.productId === newImg.productId ? { ...img, isPrimary: false } : img
      );
    }

    newImages.push(newImg);
    this.save({ ...this.state, images: newImages });
    return newImg;
  }

  public deleteImage(id: string) {
    const target = this.state.images.find((img) => img.id === id);
    if (!target) return;

    let remaining = this.state.images.filter((img) => img.id !== id);

    // If target was primary, promote the next image of that product to primary
    if (target.isPrimary) {
      const nextIndex = remaining.findIndex((img) => img.productId === target.productId);
      if (nextIndex >= 0) {
        remaining[nextIndex] = { ...remaining[nextIndex], isPrimary: true };
      }
    }

    this.save({ ...this.state, images: remaining });
  }

  public setPrimaryImage(id: string) {
    const target = this.state.images.find((img) => img.id === id);
    if (!target) return;

    const newImages = this.state.images.map((img) => {
      if (img.productId === target.productId) {
        return { ...img, isPrimary: img.id === id };
      }
      return img;
    });

    this.save({ ...this.state, images: newImages });
  }

  // --- Orders ---
  public getOrders(): DBOrder[] {
    return this.state.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): DBOrder | undefined {
    return this.state.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderInput: {
    userId?: string;
    shippingAddress: Address;
    paymentMethod: string;
    subtotal: number;
    discount: number;
    shippingAmount: number;
    totalAmount: number;
    items: {
      productId: string;
      variantId: string;
      productName: string;
      sku: string;
      size: number;
      quantity: number;
      unitPrice: number;
      productImageUrl: string;
    }[];
  }): DBOrder {
    const count = this.state.orders.length + 10001;
    const orderNumber = `RVK-${count}`;
    const orderId = `ord-${Date.now()}`;

    const orderItems: DBOrderItem[] = orderInput.items.map((item, idx) => ({
      id: `ord-item-${Date.now()}-${idx}`,
      orderId,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      sku: item.sku,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      productImageUrl: item.productImageUrl,
    }));

    // Commit inventory deduction
    orderInput.items.forEach((it) => {
      this.commitStockDeduction(it.variantId, it.quantity, orderNumber);
    });

    const newOrder: DBOrder = {
      id: orderId,
      orderNumber,
      userId: orderInput.userId,
      status: 'order_placed',
      paymentStatus: 'paid',
      paymentMethod: orderInput.paymentMethod,
      subtotal: orderInput.subtotal,
      discount: orderInput.discount,
      shippingAmount: orderInput.shippingAmount,
      taxAmount: 0,
      totalAmount: orderInput.totalAmount,
      shippingAddressSnapshot: orderInput.shippingAddress,
      trackingNumber: `RVK-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: '3–5 business days',
      items: orderItems,
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          orderId,
          status: 'order_placed',
          note: `Order placed via ${orderInput.paymentMethod.toUpperCase()}.`,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.save({
      ...this.state,
      orders: [newOrder, ...this.state.orders],
    });

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: DBOrder['status'], note?: string): DBOrder | null {
    const idx = this.state.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;

    const order = this.state.orders[idx];
    const newHistory: DBOrderStatusHistory = {
      id: `hist-${Date.now()}`,
      orderId,
      status,
      note: note || `Status updated to ${status.replace(/_/g, ' ').toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    const updated: DBOrder = {
      ...order,
      status,
      statusHistory: [...order.statusHistory, newHistory],
      updatedAt: new Date().toISOString(),
    };

    const newOrders = [...this.state.orders];
    newOrders[idx] = updated;

    this.save({ ...this.state, orders: newOrders });
    return updated;
  }

  // --- Categories ---
  public getCategories(): DBCategory[] {
    return this.state.categories;
  }

  public upsertCategory(category: Partial<DBCategory> & { name: string; slug: string }): DBCategory {
    const id = category.id || `cat-${Date.now()}`;
    const updated: DBCategory = {
      id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      imageUrl: category.imageUrl,
      status: category.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const idx = this.state.categories.findIndex((c) => c.id === id);
    const newCats = [...this.state.categories];
    if (idx >= 0) {
      newCats[idx] = updated;
    } else {
      newCats.push(updated);
    }

    this.save({ ...this.state, categories: newCats });
    return updated;
  }

  // --- Coupons ---
  public getCoupons(): Coupon[] {
    return this.state.coupons;
  }

  public upsertCoupon(coupon: Coupon): Coupon {
    const idx = this.state.coupons.findIndex((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
    const newCoupons = [...this.state.coupons];
    if (idx >= 0) {
      newCoupons[idx] = coupon;
    } else {
      newCoupons.push({ ...coupon, id: `coup-${Date.now()}`, status: 'active' });
    }
    this.save({ ...this.state, coupons: newCoupons });
    return coupon;
  }

  public deleteCoupon(code: string) {
    this.save({
      ...this.state,
      coupons: this.state.coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase()),
    });
  }

  // --- Site Content ---
  public getContent(key: string): DBSiteContent['value'] | null {
    return (this.state.siteContent as Record<string, DBSiteContent['value']>)[key] || null;
  }

  public setContent(key: string, value: DBSiteContent['value']) {
    const newContent = {
      ...this.state.siteContent,
      [key]: value,
    };
    this.save({ ...this.state, siteContent: newContent });
  }

  // --- Transactions ---
  public getTransactions(): DBInventoryTransaction[] {
    return this.state.inventoryTransactions;
  }
}

export const dbStore = new DBStore();
