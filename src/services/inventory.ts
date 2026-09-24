import { DBInventoryTransaction, InventoryReason, DBProductVariant } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

export const inventoryService = {
  async adjustStock(params: {
    variantId: string;
    newQuantity: number;
    reason: InventoryReason;
    referenceId?: string;
    createdBy?: string;
  }): Promise<{ success: boolean; error?: string }> {
    if (params.newQuantity < 0) {
      return { success: false, error: 'Quantity cannot be negative' };
    }

    if (isSupabaseConfigured) {
      try {
        // Record via Supabase RPC or direct query
        const { error } = await supabase.from('product_variants').update({
          stock_quantity: params.newQuantity,
          updated_at: new Date().toISOString(),
        }).eq('id', params.variantId);

        if (!error) {
          await supabase.from('inventory_transactions').insert({
            variant_id: params.variantId,
            quantity_before: 0, // Recorded in DB trigger
            quantity_change: 0,
            quantity_after: params.newQuantity,
            reason: params.reason,
            reference_id: params.referenceId,
          });
        }
      } catch (err) {
        console.warn('Supabase inventory adjustment failed, using local store:', err);
      }
    }

    return dbStore.adjustStock(params);
  },

  async reserveStock(variantId: string, quantity: number): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('reserve_stock', {
          p_variant_id: variantId,
          p_quantity: quantity,
        });
        if (!error && typeof data === 'boolean') {
          return data;
        }
      } catch (err) {
        console.warn('Supabase reserve_stock rpc error:', err);
      }
    }
    return dbStore.reserveStock(variantId, quantity);
  },

  async releaseStock(variantId: string, quantity: number): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.rpc('release_stock', {
          p_variant_id: variantId,
          p_quantity: quantity,
        });
      } catch (err) {
        console.warn('Supabase release_stock rpc error:', err);
      }
    }
    dbStore.releaseStock(variantId, quantity);
  },

  async getTransactions(): Promise<DBInventoryTransaction[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('inventory_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && data) {
          return data.map((t: any) => ({
            id: t.id,
            variantId: t.variant_id,
            quantityBefore: t.quantity_before,
            quantityChange: t.quantity_change,
            quantityAfter: t.quantity_after,
            reason: t.reason,
            referenceId: t.reference_id,
            createdBy: t.created_by,
            createdAt: t.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase transaction fetch error:', err);
      }
    }

    return dbStore.getTransactions();
  },

  getVariantStatus(variant: DBProductVariant): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    const available = Math.max(0, variant.stockQuantity - variant.reservedQuantity);
    if (available === 0) return 'Out of Stock';
    if (available <= variant.lowStockThreshold) return 'Low Stock';
    return 'In Stock';
  },
};
