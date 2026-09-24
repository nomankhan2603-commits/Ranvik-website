import { Coupon } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

export const couponsService = {
  async getAll(): Promise<Coupon[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('coupons').select('*');
        if (!error && data) {
          return data.map((c: any) => ({
            id: c.id,
            code: c.code,
            discountType: c.discount_type,
            discountValue: Number(c.discount_value),
            discountPercent: c.discount_type === 'percentage' ? Number(c.discount_value) : undefined,
            fixedDiscount: c.discount_type === 'fixed' ? Number(c.discount_value) : undefined,
            minOrderValue: Number(c.minimum_order_value || 0),
            maximumDiscount: c.maximum_discount ? Number(c.maximum_discount) : undefined,
            usageLimit: c.usage_limit,
            usedCount: c.used_count || 0,
            description: c.discount_type === 'percentage' 
              ? `${c.discount_value}% OFF orders above ₹${c.minimum_order_value}` 
              : `Flat ₹${c.discount_value} OFF`,
            status: c.status,
          }));
        }
      } catch (err) {
        console.warn('Supabase coupons error:', err);
      }
    }

    return dbStore.getCoupons();
  },

  async validate(code: string, subtotal: number): Promise<{
    valid: boolean;
    discount: number;
    coupon?: Coupon;
    message: string;
  }> {
    const coupons = await this.getAll();
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (coupon.status === 'inactive') {
      return { valid: false, discount: 0, message: 'This coupon is no longer active.' };
    }

    if (subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this code.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage' || coupon.discountPercent) {
      const pct = coupon.discountValue || coupon.discountPercent || 0;
      discount = Math.round((subtotal * pct) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.discountValue || coupon.fixedDiscount || 0;
    }

    return {
      valid: true,
      discount,
      coupon,
      message: `Coupon ${cleanCode} applied successfully!`,
    };
  },

  async upsert(coupon: Coupon): Promise<Coupon> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('coupons').upsert({
          code: coupon.code.toUpperCase(),
          discount_type: coupon.discountType || 'fixed',
          discount_value: coupon.discountValue || coupon.fixedDiscount || 300,
          minimum_order_value: coupon.minOrderValue || 0,
          maximum_discount: coupon.maximumDiscount || null,
          usage_limit: coupon.usageLimit || 500,
          status: coupon.status || 'active',
        });
      } catch (err) {
        console.warn('Supabase coupon upsert error:', err);
      }
    }

    return dbStore.upsertCoupon(coupon);
  },

  async delete(code: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('coupons').delete().eq('code', code.toUpperCase());
      } catch (err) {
        console.warn('Supabase coupon delete error:', err);
      }
    }

    dbStore.deleteCoupon(code);
  },
};
