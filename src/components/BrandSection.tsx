import React, { useState } from 'react';
import { ShieldCheck, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { siteConfig } from '../config/siteConfig';

export const BrandSection: React.FC = () => {
  const { setActiveNavSection, setFilterState } = useShop();
  const [imgFailed, setImgFailed] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);

  const handleExplore = () => {
    setActiveNavSection('shop');
    setFilterState((prev) => ({ ...prev, bootTypes: [] }));
    const shopEl = document.getElementById('shop-section');
    shopEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 08 — Brand Story Section (Clean Light Layout) */}
      <section
        id="story-section"
        className="relative w-full bg-[#FFFFFF] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#E2E0DA] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Editorial Lifestyle Imagery */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden border border-[#D9D7D0] shadow-lg bg-[#F0EEEA] group">
                {!imgFailed ? (
                  <img
                    src={siteConfig.brandStory.image}
                    alt="RANVIK Craftsmanship and Boot in Field"
                    loading="lazy"
                    onError={() => setImgFailed(true)}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#E8E6E0]">
                    <p className="font-condensed font-bold text-3xl uppercase text-[#181818] mb-2">
                      {siteConfig.brandName}
                    </p>
                    <p className="font-mono text-xs text-[#626653] uppercase">
                      AGRA FOUNDRY CRAFT
                    </p>
                  </div>
                )}

                {/* Subtle bottom shadow vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818]/40 via-transparent to-transparent pointer-events-none" />

                {/* Archive stamp */}
                <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-[#181818] bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1.5 border border-[#E2E0DA] shadow-xs">
                  {siteConfig.brandStory.badge}
                </div>
              </div>

              {/* Floating Spec Plate */}
              <div className="absolute -bottom-5 -right-3 sm:right-6 bg-[#FFFFFF] border border-[#D0CDC5] p-4 shadow-xl max-w-[220px] hidden sm:block">
                <p className="font-mono text-[10px] uppercase text-[#626653] font-bold mb-1">
                  TENSILE STRENGTH
                </p>
                <p className="font-condensed text-base text-[#181818] font-bold uppercase leading-tight">
                  1.8–2.0MM FULL GRAIN BOVINE HIDES
                </p>
              </div>
            </div>

            {/* Right Column: Brand Philosophy & Quote */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#626653] uppercase tracking-[0.25em] mb-4 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B83A2A]" />
                <span>{siteConfig.brandStory.eyebrow}</span>
              </div>

              {/* Headline */}
              <h2
                id="brand-manifesto-heading"
                className="font-condensed font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#181818] leading-[0.95] mb-6"
              >
                {siteConfig.brandStory.heading}
              </h2>

              {/* Exact Quote from Prompt */}
              <blockquote
                id="brand-manifesto-quote"
                className="text-[#242424] text-lg sm:text-xl font-normal leading-relaxed mb-6 border-l-3 border-[#181818] pl-5 italic bg-[#F7F6F2] py-4 pr-4"
              >
                "{siteConfig.brandStory.quote}"
              </blockquote>

              {/* Body */}
              <p className="text-sm text-[#55524B] leading-relaxed mb-8">
                {siteConfig.brandStory.body}
              </p>

              {/* 4 Brand Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-[#E2E0DA] mb-8 font-mono text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#626653]" />
                  <span className="text-[#242424] font-medium">Reinforced Steel Shank Arch</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#626653]" />
                  <span className="text-[#242424] font-medium">Patina-Rich Oiled Pull-Up</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#626653]" />
                  <span className="text-[#242424] font-medium">Handcrafted in Agra, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#626653]" />
                  <span className="text-[#242424] font-medium">Direct-to-Consumer Pricing</span>
                </div>
              </div>

              {/* Explore Button */}
              <div>
                <button
                  onClick={handleExplore}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#181818] hover:bg-[#2A2A2A] text-white font-mono font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>EXPLORE SPECIFICATIONS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 09 — Lifestyle / Action Banner ("MADE TO MOVE") */}
      <section
        id="lifestyle-banner-section"
        className="relative w-full py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#181818] border-b border-[#E2E0DA]"
      >
        {/* Background Photograph */}
        <div className="absolute inset-0 z-0">
          {!bannerFailed ? (
            <img
              src={siteConfig.lifestyleBanner.image}
              alt="RANVIK Boots in Motion"
              onError={() => setBannerFailed(true)}
              className="w-full h-full object-cover object-center opacity-40 filter contrast-110"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-[#242424]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#181818] via-[#181818]/85 to-transparent sm:w-3/4" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF]/10 backdrop-blur-md border border-white/20 text-[#D9D7D0] text-[11px] font-mono uppercase tracking-[0.25em] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B83A2A]" />
            <span>{siteConfig.lifestyleBanner.eyebrow}</span>
          </div>

          <h2
            id="lifestyle-banner-heading"
            className="font-condensed font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tight text-white leading-none mb-4"
          >
            {siteConfig.lifestyleBanner.heading}
          </h2>

          <p
            id="lifestyle-banner-subheading"
            className="text-[#D0CDC5] text-base sm:text-xl max-w-xl mb-8 leading-relaxed font-normal"
          >
            {siteConfig.lifestyleBanner.subheading}
          </p>

          <button
            onClick={handleExplore}
            className="inline-flex items-center gap-3 bg-[#FFFFFF] hover:bg-[#F0EEEA] text-[#181818] px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-all shadow-md cursor-pointer group"
          >
            <span>{siteConfig.lifestyleBanner.cta}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </>
  );
};
