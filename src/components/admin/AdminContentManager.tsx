import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle, Eye } from 'lucide-react';
import { contentService } from '../../services/content';
import { DBSiteContent } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminContentManager: React.FC = () => {
  const { triggerRefresh } = useAdmin();
  const [content, setContent] = useState<DBSiteContent['value']>({
    heroTitle: 'BUILT FOR THE GROUND',
    heroSubtitle:
      'Engineered for durability, confidence and everyday movement. Premium leather military boots with military-grade attitude and luxury craftsmanship.',
    heroImage: '/assets/hero-boot.png',
    ctaText: 'ORDER NOW — FREE SHIPPING',
    ctaUrl: '#catalog',
    campaignTitle: 'AGRA LEATHER FOUNDRY HERITAGE',
    campaignDescription:
      'Every boot is lasted in Agra, utilizing 1.8mm hand-selected bovine hides cured with natural plant oils for exceptional flex and water-resistance.',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const c = await contentService.getHomepageContent();
    if (c) setContent(c);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await contentService.updateHomepageContent(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            STOREFRONT EDITORIAL & CAMPAIGN CONTENT
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Edit live hero messaging, promotional headlines and foundry heritage copy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Form */}
        <form onSubmit={handleSave} className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-white mb-2">
            PRIMARY HERO SECTION
          </h2>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
              HERO MAIN HEADLINE
            </label>
            <input
              type="text"
              required
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:border-[#B83A2A] focus:outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
              HERO SUBTITLE / BRAND STATEMENT
            </label>
            <textarea
              rows={3}
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
              HERO BOOT IMAGE PATH
            </label>
            <input
              type="text"
              value={content.heroImage}
              onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
              className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                CTA BUTTON TEXT
              </label>
              <input
                type="text"
                value={content.ctaText}
                onChange={(e) => setContent({ ...content, ctaText: e.target.value })}
                className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                CTA TARGET URL
              </label>
              <input
                type="text"
                value={content.ctaUrl}
                onChange={(e) => setContent({ ...content, ctaUrl: e.target.value })}
                className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-white pt-4 border-t border-[#2B2E38] mb-2">
            AGRA FOUNDRY CAMPAIGN BANNER
          </h2>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
              CAMPAIGN TITLE
            </label>
            <input
              type="text"
              value={content.campaignTitle}
              onChange={(e) => setContent({ ...content, campaignTitle: e.target.value })}
              className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
              CAMPAIGN DESCRIPTION
            </label>
            <textarea
              rows={3}
              value={content.campaignDescription}
              onChange={(e) => setContent({ ...content, campaignDescription: e.target.value })}
              className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#B83A2A] hover:bg-[#A33324] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>SAVED TO DATABASE</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? 'UPDATING...' : 'PUBLISH STOREFRONT CONTENT'}</span>
              </>
            )}
          </button>
        </form>

        {/* Live Visual Preview */}
        <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs flex flex-col">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8C92A4] mb-4">
            <Eye className="w-4 h-4 text-[#B83A2A]" />
            <span>LIVE STOREFRONT HERO PREVIEW</span>
          </div>

          <div className="bg-[#FAF8F5] text-[#1E2024] p-8 rounded-xs border border-[#E6E1DA] flex-1 flex flex-col justify-center">
            <span className="text-[10px] font-mono tracking-widest text-[#B83A2A] font-bold uppercase block mb-2">
              RANVIK TACTICAL • SPEC 2026
            </span>
            <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-[#121418] leading-tight mb-3">
              {content.heroTitle}
            </h1>
            <p className="text-xs text-[#525866] leading-relaxed mb-6 max-w-md">
              {content.heroSubtitle}
            </p>

            <div className="my-4 bg-white/70 p-4 border border-[#E6E1DA] rounded-xs flex items-center justify-center">
              <img
                src={content.heroImage}
                alt="Boot Preview"
                className="h-36 object-contain drop-shadow-lg"
              />
            </div>

            <button className="py-2.5 px-5 bg-[#121418] text-white font-mono text-xs font-bold tracking-wider uppercase rounded-xs self-start shadow-md">
              {content.ctaText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
