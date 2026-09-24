import { DBProduct, DBProductVariant, DBProductImage } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

export interface ProductWithDetails extends DBProduct {
  variants: DBProductVariant[];
  images: DBProductImage[];
  categoryName?: string;
}

export const productsService = {
  async getAll(includeArchived = false): Promise<ProductWithDetails[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            categories (name),
            product_variants (*),
            product_images (*)
          `)
          .order('created_at', { ascending: false });

        if (!includeArchived) {
          query = query.eq('status', 'active');
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            sku: item.sku,
            shortDescription: item.short_description,
            description: item.description,
            categoryId: item.category_id,
            categoryName: item.categories?.name,
            mrp: Number(item.mrp),
            sellingPrice: Number(item.selling_price),
            status: item.status,
            brand: item.brand,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            variants: (item.product_variants || []).map((v: any) => ({
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
            })),
            images: (item.product_images || []).map((img: any) => ({
              id: img.id,
              productId: img.product_id,
              variantId: img.variant_id,
              storagePath: img.storage_path,
              publicUrl: img.public_url,
              altText: img.alt_text || '',
              sortOrder: img.sort_order || 0,
              isPrimary: Boolean(img.is_primary),
              createdAt: img.created_at,
            })),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }

    // Local / fallback store
    const products = dbStore.getProducts(includeArchived);
    const categories = dbStore.getCategories();
    return products.map((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      return {
        ...p,
        categoryName: cat?.name,
        variants: dbStore.getVariants(p.id),
        images: dbStore.getImages(p.id),
      };
    });
  },

  async getById(id: string): Promise<ProductWithDetails | null> {
    const all = await this.getAll(true);
    return all.find((p) => p.id === id || p.slug === id) || null;
  },

  async upsert(productData: Partial<DBProduct> & { name: string; sku: string; sellingPrice: number }): Promise<DBProduct> {
    if (isSupabaseConfigured) {
      try {
        const payload = {
          name: productData.name,
          slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          sku: productData.sku,
          short_description: productData.shortDescription || '',
          description: productData.description || '',
          category_id: productData.categoryId,
          mrp: productData.mrp || productData.sellingPrice * 1.5,
          selling_price: productData.sellingPrice,
          status: productData.status || 'active',
          brand: 'RANVIK',
          updated_at: new Date().toISOString(),
        };

        if (productData.id) {
          const { data, error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', productData.id)
            .select()
            .single();
          if (!error && data) {
            dbStore.upsertProduct(productData);
            return dbStore.getProductById(data.id) || dbStore.upsertProduct(productData);
          }
        } else {
          const { data, error } = await supabase.from('products').insert(payload).select().single();
          if (!error && data) {
            return dbStore.upsertProduct({ ...productData, id: data.id });
          }
        }
      } catch (err) {
        console.warn('Supabase upsert failed, using local store:', err);
      }
    }

    return dbStore.upsertProduct(productData);
  },

  async archive(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('products').update({ status: 'archived' }).eq('id', id);
      } catch (err) {
        console.warn('Supabase archive failed:', err);
      }
    }
    dbStore.archiveProduct(id);
  },
};
