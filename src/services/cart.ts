import { CartItem } from '../types';

const CART_KEY = 'RANVIK_CART_V1';

export const cartService = {
  load(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  save(items: CartItem[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart:', e);
      }
    }
  },

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_KEY);
    }
  },
};
