import { createClient, SupabaseClient } from '@supabase/supabase-js';

// =====================================================================
// Environment Variables & Configuration
// =====================================================================

// Safely access environment variables across Vite client and Node server contexts
const getEnvVar = (viteKey: string, nextKey: string, fallbackKey?: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
    if (import.meta.env[nextKey]) return import.meta.env[nextKey];
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[viteKey]) return process.env[viteKey];
    if (process.env[nextKey]) return process.env[nextKey];
    if (fallbackKey && process.env[fallbackKey]) return process.env[fallbackKey];
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey !== 'placeholder' &&
    supabaseAnonKey !== 'placeholder-anon-key' &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseUrl.includes('placeholder.supabase.co')
);

// =====================================================================
// Core Database Types & Enums
// =====================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DBProductStatus = 'draft' | 'active' | 'archived';

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

export type DBPaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';

export type DBCouponDiscountType = 'percentage' | 'fixed';

export type DBInventoryReason =
  | 'sale'
  | 'purchase'
  | 'return'
  | 'damage'
  | 'manual_adjustment'
  | 'cancellation'
  | 'stock_correction';

export type DBAdminRole = 'super_admin' | 'admin' | 'inventory_manager' | 'order_manager';

export interface DBShippingAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

// 1. Categories
export interface DBCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DBCategoryInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface DBCategoryUpdate {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

// 2. Products
export interface DBProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  category_id: string | null;
  mrp: number;
  selling_price: number;
  status: DBProductStatus;
  brand: string;
  created_at: string;
  updated_at: string;
}

export interface DBProductInsert {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  category_id?: string | null;
  mrp: number;
  selling_price: number;
  status?: DBProductStatus;
  brand?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBProductUpdate {
  id?: string;
  name?: string;
  slug?: string;
  sku?: string;
  short_description?: string;
  description?: string;
  category_id?: string | null;
  mrp?: number;
  selling_price?: number;
  status?: DBProductStatus;
  brand?: string;
  created_at?: string;
  updated_at?: string;
}

// 3. Product Variants (Size Matrix UK 6 to 11)
export interface DBProductVariantRow {
  id: string;
  product_id: string;
  size: number;
  sku: string;
  price: number;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DBProductVariantInsert {
  id?: string;
  product_id: string;
  size: number;
  sku: string;
  price: number;
  stock_quantity?: number;
  reserved_quantity?: number;
  low_stock_threshold?: number;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface DBProductVariantUpdate {
  id?: string;
  product_id?: string;
  size?: number;
  sku?: string;
  price?: number;
  stock_quantity?: number;
  reserved_quantity?: number;
  low_stock_threshold?: number;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

// 4. Product Images
export interface DBProductImageRow {
  id: string;
  product_id: string;
  variant_id: string | null;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface DBProductImageInsert {
  id?: string;
  product_id: string;
  variant_id?: string | null;
  storage_path: string;
  public_url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
  created_at?: string;
}

export interface DBProductImageUpdate {
  id?: string;
  product_id?: string;
  variant_id?: string | null;
  storage_path?: string;
  public_url?: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
  created_at?: string;
}

// 5. Profiles
export interface DBProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBProfileInsert {
  id: string;
  full_name: string;
  phone?: string | null;
  email: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DBProfileUpdate {
  id?: string;
  full_name?: string;
  phone?: string | null;
  email?: string;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// 6. Addresses
export interface DBAddressRow {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface DBAddressInsert {
  id?: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DBAddressUpdate {
  id?: string;
  user_id?: string;
  full_name?: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string | null;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 7. Orders
export interface DBOrderRow {
  id: string;
  order_number: string;
  user_id: string | null;
  status: DBOrderStatus;
  payment_status: DBPaymentStatus;
  payment_method: string;
  subtotal: number;
  discount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_address_snapshot: Json;
  created_at: string;
  updated_at: string;
}

export interface DBOrderInsert {
  id?: string;
  order_number: string;
  user_id?: string | null;
  status?: DBOrderStatus;
  payment_status?: DBPaymentStatus;
  payment_method: string;
  subtotal: number;
  discount?: number;
  shipping_amount?: number;
  tax_amount?: number;
  total_amount: number;
  shipping_address_snapshot: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DBOrderUpdate {
  id?: string;
  order_number?: string;
  user_id?: string | null;
  status?: DBOrderStatus;
  payment_status?: DBPaymentStatus;
  payment_method?: string;
  subtotal?: number;
  discount?: number;
  shipping_amount?: number;
  tax_amount?: number;
  total_amount?: number;
  shipping_address_snapshot?: Json;
  created_at?: string;
  updated_at?: string;
}

// 8. Order Items
export interface DBOrderItemRow {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  sku: string;
  size: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image_url: string;
}

export interface DBOrderItemInsert {
  id?: string;
  order_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  product_name: string;
  sku: string;
  size: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image_url: string;
}

export interface DBOrderItemUpdate {
  id?: string;
  order_id?: string;
  product_id?: string | null;
  variant_id?: string | null;
  product_name?: string;
  sku?: string;
  size?: number;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  product_image_url?: string;
}

// 9. Order Status History
export interface DBOrderStatusHistoryRow {
  id: string;
  order_id: string;
  status: string;
  note: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface DBOrderStatusHistoryInsert {
  id?: string;
  order_id: string;
  status: string;
  note?: string | null;
  changed_by?: string | null;
  created_at?: string;
}

export interface DBOrderStatusHistoryUpdate {
  id?: string;
  order_id?: string;
  status?: string;
  note?: string | null;
  changed_by?: string | null;
  created_at?: string;
}

// 10. Inventory Transactions
export interface DBInventoryTransactionRow {
  id: string;
  variant_id: string;
  quantity_before: number;
  quantity_change: number;
  quantity_after: number;
  reason: DBInventoryReason;
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface DBInventoryTransactionInsert {
  id?: string;
  variant_id: string;
  quantity_before: number;
  quantity_change: number;
  quantity_after: number;
  reason: DBInventoryReason;
  reference_id?: string | null;
  created_by?: string | null;
  created_at?: string;
}

export interface DBInventoryTransactionUpdate {
  id?: string;
  variant_id?: string;
  quantity_before?: number;
  quantity_change?: number;
  quantity_after?: number;
  reason?: DBInventoryReason;
  reference_id?: string | null;
  created_by?: string | null;
  created_at?: string;
}

// 11. Coupons
export interface DBCouponRow {
  id: string;
  code: string;
  discount_type: DBCouponDiscountType;
  discount_value: number;
  minimum_order_value: number;
  maximum_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  per_customer_limit: number;
  starts_at: string;
  expires_at: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface DBCouponInsert {
  id?: string;
  code: string;
  discount_type: DBCouponDiscountType;
  discount_value: number;
  minimum_order_value?: number;
  maximum_discount?: number | null;
  usage_limit?: number | null;
  used_count?: number;
  per_customer_limit?: number;
  starts_at?: string;
  expires_at?: string | null;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface DBCouponUpdate {
  id?: string;
  code?: string;
  discount_type?: DBCouponDiscountType;
  discount_value?: number;
  minimum_order_value?: number;
  maximum_discount?: number | null;
  usage_limit?: number | null;
  used_count?: number;
  per_customer_limit?: number;
  starts_at?: string;
  expires_at?: string | null;
  status?: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

// 12. Site Content
export interface DBSiteContentRow {
  id: string;
  key: string;
  value: Json;
  created_at: string;
  updated_at: string;
}

export interface DBSiteContentInsert {
  id?: string;
  key: string;
  value: Json;
  created_at?: string;
  updated_at?: string;
}

export interface DBSiteContentUpdate {
  id?: string;
  key?: string;
  value?: Json;
  created_at?: string;
  updated_at?: string;
}

// 13. Admin Users
export interface DBAdminUserRow {
  id: string;
  user_id: string;
  role: DBAdminRole;
  created_at: string;
}

export interface DBAdminUserInsert {
  id?: string;
  user_id: string;
  role?: DBAdminRole;
  created_at?: string;
}

export interface DBAdminUserUpdate {
  id?: string;
  user_id?: string;
  role?: DBAdminRole;
  created_at?: string;
}

// 14. Carts & Cart Items
export interface DBCartRow {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBCartInsert {
  id?: string;
  user_id?: string | null;
  session_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DBCartUpdate {
  id?: string;
  user_id?: string | null;
  session_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DBCartItemRow {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface DBCartItemInsert {
  id?: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DBCartItemUpdate {
  id?: string;
  cart_id?: string;
  product_id?: string;
  variant_id?: string;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}

// 15. Wishlists
export interface DBWishlistRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface DBWishlistInsert {
  id?: string;
  user_id: string;
  product_id: string;
  created_at?: string;
}

export interface DBWishlistUpdate {
  id?: string;
  user_id?: string;
  product_id?: string;
  created_at?: string;
}

// 16. Payments
export interface DBPaymentRow {
  id: string;
  order_id: string;
  provider: string;
  payment_id: string | null;
  amount: number;
  status: DBPaymentStatus;
  method: string | null;
  created_at: string;
  updated_at: string;
}

export interface DBPaymentInsert {
  id?: string;
  order_id: string;
  provider?: string;
  payment_id?: string | null;
  amount: number;
  status?: DBPaymentStatus;
  method?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DBPaymentUpdate {
  id?: string;
  order_id?: string;
  provider?: string;
  payment_id?: string | null;
  amount?: number;
  status?: DBPaymentStatus;
  method?: string | null;
  created_at?: string;
  updated_at?: string;
}

// =====================================================================
// Complete Supabase Database Schema Interface
// =====================================================================

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: DBCategoryRow;
        Insert: DBCategoryInsert;
        Update: DBCategoryUpdate;
        Relationships: [];
      };
      products: {
        Row: DBProductRow;
        Insert: DBProductInsert;
        Update: DBProductUpdate;
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      product_variants: {
        Row: DBProductVariantRow;
        Insert: DBProductVariantInsert;
        Update: DBProductVariantUpdate;
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      product_images: {
        Row: DBProductImageRow;
        Insert: DBProductImageInsert;
        Update: DBProductImageUpdate;
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'product_images_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          }
        ];
      };
      profiles: {
        Row: DBProfileRow;
        Insert: DBProfileInsert;
        Update: DBProfileUpdate;
        Relationships: [];
      };
      addresses: {
        Row: DBAddressRow;
        Insert: DBAddressInsert;
        Update: DBAddressUpdate;
        Relationships: [
          {
            foreignKeyName: 'addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: DBOrderRow;
        Insert: DBOrderInsert;
        Update: DBOrderUpdate;
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      order_items: {
        Row: DBOrderItemRow;
        Insert: DBOrderItemInsert;
        Update: DBOrderItemUpdate;
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          }
        ];
      };
      order_status_history: {
        Row: DBOrderStatusHistoryRow;
        Insert: DBOrderStatusHistoryInsert;
        Update: DBOrderStatusHistoryUpdate;
        Relationships: [
          {
            foreignKeyName: 'order_status_history_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          }
        ];
      };
      inventory_transactions: {
        Row: DBInventoryTransactionRow;
        Insert: DBInventoryTransactionInsert;
        Update: DBInventoryTransactionUpdate;
        Relationships: [
          {
            foreignKeyName: 'inventory_transactions_variant_id_fkey';
            columns: ['variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          }
        ];
      };
      coupons: {
        Row: DBCouponRow;
        Insert: DBCouponInsert;
        Update: DBCouponUpdate;
        Relationships: [];
      };
      site_content: {
        Row: DBSiteContentRow;
        Insert: DBSiteContentInsert;
        Update: DBSiteContentUpdate;
        Relationships: [];
      };
      admin_users: {
        Row: DBAdminUserRow;
        Insert: DBAdminUserInsert;
        Update: DBAdminUserUpdate;
        Relationships: [];
      };
      carts: {
        Row: DBCartRow;
        Insert: DBCartInsert;
        Update: DBCartUpdate;
        Relationships: [];
      };
      cart_items: {
        Row: DBCartItemRow;
        Insert: DBCartItemInsert;
        Update: DBCartItemUpdate;
        Relationships: [];
      };
      wishlists: {
        Row: DBWishlistRow;
        Insert: DBWishlistInsert;
        Update: DBWishlistUpdate;
        Relationships: [];
      };
      payments: {
        Row: DBPaymentRow;
        Insert: DBPaymentInsert;
        Update: DBPaymentUpdate;
        Relationships: [
          {
            foreignKeyName: 'payments_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      reserve_stock: {
        Args: {
          p_variant_id: string;
          p_quantity: number;
        };
        Returns: boolean;
      };
      release_stock: {
        Args: {
          p_variant_id: string;
          p_quantity: number;
        };
        Returns: boolean;
      };
      commit_stock_deduction: {
        Args: {
          p_variant_id: string;
          p_quantity: number;
          p_reference_id?: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// =====================================================================
// Supabase Client Instance Initializer
// =====================================================================

export function createSupabaseClient(): SupabaseClient<Database> {
  const activeUrl = supabaseUrl || 'https://placeholder.supabase.co';
  const activeKey = supabaseAnonKey || 'placeholder-anon-key';

  return createClient<Database>(activeUrl, activeKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

// Primary client instance for application use.
// Exported as SupabaseClient<Database, "public", any> to provide rich type-safe table inference
// while also allowing flexible method chaining across frontend services.
export const supabase: SupabaseClient<any, "public", any> = createSupabaseClient();
