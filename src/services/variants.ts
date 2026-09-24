import { DBProductVariant } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

export const variantsService = {
  async getByProductId(productId: string): Promise<DBProductVariant[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productId)
          .order('size', { ascending: true });

        if (!error && data) {
          return data.map((v: any) => ({
            id: v.id,
            productId: v.product_id,
            size: v.size,
            sku: v.sku,
            price: Number(v.price),
            stockQuantity: v.stock_quantity,
            reservedQuantity: v.reserved_quantity,
            lowStockThreshold: v.low_stock_threshold,
            status: v.status,
            createdAt: v.created_at,
            updatedAt: v.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase variants error, fallback to local store:', err);
      }
    }

    return dbStore.getVariants(productId);
  },

  async update(id: string, updates: Partial<DBProductVariant>): Promise<DBProductVariant | null> {
    if (isSupabaseConfigured) {
      try {
        const payload: any = {};
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.stockQuantity !== undefined) payload.stock_quantity = updates.stockQuantity;
        if (updates.reservedQuantity !== undefined) payload.reserved_quantity = updates.reservedQuantity;
        if (updates.lowStockThreshold !== undefined) payload.low_stock_threshold = updates.lowStockThreshold;
        if (updates.status !== undefined) payload.status = updates.status;
        payload.updated_at = new Date().toISOString();

        await supabase.from('product_variants').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase variant update failed:', err);
      }
    }

    return dbStore.updateVariant(id, updates);
  },

  getAvailableStock(variant: DBProductVariant): number {
    return Math.max(0, variant.stockQuantity - variant.reservedQuantity);
  },
};
