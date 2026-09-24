import { DBProductImage } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

const BUCKET_NAME = 'product-images';

export const imagesService = {
  async getByProductId(productId: string): Promise<DBProductImage[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', productId)
          .order('sort_order', { ascending: true });

        if (!error && data) {
          return data.map((img: any) => ({
            id: img.id,
            productId: img.product_id,
            variantId: img.variant_id,
            storagePath: img.storage_path,
            publicUrl: img.public_url,
            altText: img.alt_text || '',
            sortOrder: img.sort_order || 0,
            isPrimary: Boolean(img.is_primary),
            createdAt: img.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase images fetch error:', err);
      }
    }

    return dbStore.getImages(productId);
  },

  async getAll(): Promise<DBProductImage[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('product_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((img: any) => ({
            id: img.id,
            productId: img.product_id,
            variantId: img.variant_id,
            storagePath: img.storage_path,
            publicUrl: img.public_url,
            altText: img.alt_text || '',
            sortOrder: img.sort_order || 0,
            isPrimary: Boolean(img.is_primary),
            createdAt: img.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase images fetch error:', err);
      }
    }

    return dbStore.getImages();
  },

  async upload(params: {
    productId: string;
    file?: File;
    publicUrl?: string;
    altText?: string;
    isPrimary?: boolean;
  }): Promise<DBProductImage> {
    let finalUrl = params.publicUrl || '/assets/boot1.png';
    let storagePath = `products/${params.productId}/${Date.now()}.png`;

    if (params.file && isSupabaseConfigured) {
      try {
        storagePath = `products/${params.productId}/${Date.now()}-${params.file.name}`;
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, params.file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!error && data) {
          const { data: pubData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
          if (pubData?.publicUrl) {
            finalUrl = pubData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed:', err);
      }
    }

    const newImage: Omit<DBProductImage, 'id' | 'createdAt'> = {
      productId: params.productId,
      storagePath,
      publicUrl: finalUrl,
      altText: params.altText || 'RANVIK Boot Image',
      sortOrder: 0,
      isPrimary: params.isPrimary ?? false,
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('product_images').insert({
          product_id: newImage.productId,
          storage_path: newImage.storagePath,
          public_url: newImage.publicUrl,
          alt_text: newImage.altText,
          sort_order: newImage.sortOrder,
          is_primary: newImage.isPrimary,
        });
      } catch (err) {
        console.warn('Supabase DB image insert error:', err);
      }
    }

    return dbStore.addImage(newImage);
  },

  async delete(id: string): Promise<void> {
    const target = dbStore.getImages().find((img) => img.id === id);
    if (isSupabaseConfigured && target) {
      try {
        await supabase.storage.from(BUCKET_NAME).remove([target.storagePath]);
        await supabase.from('product_images').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase image delete failed:', err);
      }
    }

    dbStore.deleteImage(id);
  },

  async setPrimary(id: string): Promise<void> {
    const target = dbStore.getImages().find((img) => img.id === id);
    if (isSupabaseConfigured && target) {
      try {
        await supabase
          .from('product_images')
          .update({ is_primary: false })
          .eq('product_id', target.productId);

        await supabase
          .from('product_images')
          .update({ is_primary: true })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase set primary failed:', err);
      }
    }

    dbStore.setPrimaryImage(id);
  },
};
