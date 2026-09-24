export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  sizePurchased: number;
}

export interface ProductSpecs {
  material: string;
  sole: string;
  shaftHeight: string;
  closure: string;
  waterResistance: string;
  origin: string;
}

export type BootType = 'Combat' | 'Tactical' | 'Field' | 'Officer';

export interface Product {
  id: string;
  slug?: string;
  name: string;
  modelCode: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  availableSizes: number[];
  colors: { name: string; hex: string }[];
  bootType: BootType;
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  specs: ProductSpecs;
  materialsDescription: string;
  soleDescription: string;
  fitAdvice: string;
  reviews: Review[];
}

export interface CartItem {
  id: string; // product.id + size
  product: Product;
  size: number;
  quantity: number;
}

export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';

export interface FilterState {
  bootTypes: BootType[];
  sizes: number[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  minRating: number;
  sortBy: SortOption;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
    completed: boolean;
  }[];
}

export interface Coupon {
  id?: string;
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
  minOrderValue: number;
  description: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount?: number;
  startsAt?: string;
  expiresAt?: string;
  status?: 'active' | 'inactive';
}

// -------------------------------------------------------------
// Database & Supabase Full-Stack Types
// -------------------------------------------------------------

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DBProductVariant {
  id: string;
  productId: string;
  size: number;
  sku: string;
  price: number;
  stockQuantity: number;
  reservedQuantity: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DBProductImage {
  id: string;
  productId: string;
  variantId?: string | null;
  storagePath: string;
  publicUrl: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface DBProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  mrp: number;
  sellingPrice: number;
  status: ProductStatus;
  brand: string;
  createdAt: string;
  updatedAt: string;
}

export type DBOrderStatus = 
  | 'order_placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export interface DBOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  size: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImageUrl: string;
}

export interface DBOrderStatusHistory {
  id: string;
  orderId: string;
  status: DBOrderStatus | OrderStatus;
  note?: string;
  changedBy?: string;
  createdAt: string;
}

export interface DBOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  status: DBOrderStatus;
  paymentStatus: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddressSnapshot: Address;
  items: DBOrderItem[];
  statusHistory: DBOrderStatusHistory[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export type InventoryReason = 
  | 'sale' 
  | 'purchase' 
  | 'return' 
  | 'damage' 
  | 'manual_adjustment' 
  | 'cancellation' 
  | 'stock_correction';

export interface DBInventoryTransaction {
  id: string;
  variantId: string;
  productName?: string;
  sku?: string;
  size?: number;
  quantityBefore: number;
  quantityChange: number;
  quantityAfter: number;
  reason: InventoryReason;
  referenceId?: string;
  createdBy?: string;
  createdAt: string;
}

export interface DBSiteContent {
  id?: string;
  key: string;
  value: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    ctaText: string;
    ctaUrl: string;
    campaignTitle: string;
    campaignDescription: string;
    campaignImage?: string;
  };
  updatedAt?: string;
}

export interface AdminUser {
  id: string;
  userId: string;
  email: string;
  role: 'super_admin' | 'admin' | 'inventory_manager' | 'order_manager';
  createdAt: string;
}

