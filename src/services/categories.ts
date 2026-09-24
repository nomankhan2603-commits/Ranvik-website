import { DBCategory } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

export const categoriesService = {
  async getAll(): Promise<DBCategory[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data) {
          return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            imageUrl: c.image_url,
            status: c.status,
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase categories error:', err);
      }
    }

    return dbStore.getCategories();
  },

  async upsert(category: Partial<DBCategory> & { name: string; slug: string }): Promise<DBCategory> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('categories').upsert({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          status: category.status || 'active',
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase category upsert error:', err);
      }
    }

    return dbStore.upsertCategory(category);
  },
};
