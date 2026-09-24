import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

const WISHLIST_KEY = 'RANVIK_WISHLIST_V1';

export const wishlistService = {
  async get(userId?: string): Promise<string[]> {
    if (userId && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', userId);
        if (!error && data) {
          return data.map((d: any) => d.product_id);
        }
      } catch (err) {
        console.warn('Supabase wishlist get error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  async toggle(productId: string, userId?: string): Promise<string[]> {
    const current = await this.get(userId);
    const exists = current.includes(productId);
    const next = exists ? current.filter((id) => id !== productId) : [...current, productId];

    if (userId && isSupabaseConfigured) {
      try {
        if (exists) {
          await supabase.from('wishlists').delete().match({ user_id: userId, product_id: productId });
        } else {
          await supabase.from('wishlists').insert({ user_id: userId, product_id: productId });
        }
      } catch (err) {
        console.warn('Supabase wishlist toggle error:', err);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    }
    return next;
  },
};
