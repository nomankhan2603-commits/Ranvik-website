import { DBSiteContent } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

export const contentService = {
  async getHomepageContent(): Promise<DBSiteContent['value']> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('value')
          .eq('key', 'homepage_hero')
          .single();

        if (!error && data?.value) {
          return data.value;
        }
      } catch (err) {
        console.warn('Supabase site content error:', err);
      }
    }

    const val = dbStore.getContent('homepage_hero');
    return (
      val || {
        heroTitle: 'BUILT FOR THE GROUND',
        heroSubtitle:
          'Engineered for durability, confidence and everyday movement. Premium leather military boots with military-grade attitude and luxury craftsmanship.',
        heroImage: '/assets/hero-boot.png',
        ctaText: 'ORDER NOW — FREE SHIPPING',
        ctaUrl: '#catalog',
        campaignTitle: 'AGRA LEATHER FOUNDRY HERITAGE',
        campaignDescription:
          'Every boot is lasted in Agra, utilizing 1.8mm hand-selected bovine hides cured with natural plant oils for exceptional flex and water-resistance.',
      }
    );
  },

  async updateHomepageContent(value: DBSiteContent['value']): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('site_content').upsert({
          key: 'homepage_hero',
          value,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase update site content error:', err);
      }
    }

    dbStore.setContent('homepage_hero', value);
  },
};
