import React, { useState } from 'react';
import { ArrowRight, Compass, Shield, Award, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { siteConfig } from '../config/siteConfig';

export const Hero: React.FC = () => {
  const { setFilterState, setActiveNavSection } = useShop();
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const handleShopMilitary = () => {
    setActiveNavSection('military');
    setFilterState((prev) => ({ ...prev, bootTypes: ['Combat', 'Tactical'] }));
    const shopEl = document.getElementById('shop-section');
    shopEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreCollection = () => {
    setActiveNavSection('shop');
    setFilterState((prev) => ({ ...prev, bootTypes: [] }));
    const shopEl = document.getElementById('shop-section');
    shopEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[88vh] lg:min-h-[92vh] w-full flex items-center bg-[#F7F6F2] overflow-hidden border-b border-[#E2E0DA]"
    >
      {/* Subtle architectural concrete grid texture */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D9D7D0 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-[#E8E6E0] border border-[#D9D7D0] text-[#626653] text-[11px] font-mono uppercase tracking-[0.25em] mb-6 w-fit">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B83A2A]" />
              <span className="font-bold text-[#181818]">{siteConfig.hero.eyebrow}</span>
              <span className="text-[#9E9B93]">•</span>
              <span className="text-[#626653]">HANDCRAFTED IN AGRA</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-headline"
              className="font-condensed font-black uppercase text-[#181818] tracking-[-0.01em] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.92] mb-6"
            >
              {siteConfig.hero.title.split('.').map((part, idx) => (
                part.trim() ? (
                  <span key={idx} className="block">
                    {part.trim()}
                    {idx === 0 ? '.' : ''}
                  </span>
                ) : null
              ))}
            </h1>

            {/* Supporting Copy */}
            <p
              id="hero-supporting-copy"
              className="text-[#55524B] text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mb-9 font-normal"
            >
              {siteConfig.hero.subtitle}
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <button
                id="hero-cta-primary"
                onClick={handleShopMilitary}
                className="inline-flex items-center justify-center gap-3 bg-[#181818] hover:bg-[#2A2A2A] text-white px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer group"
              >
                <span>{siteConfig.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-cta-secondary"
                onClick={handleExploreCollection}
                className="inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#E8E6E0] text-[#181818] border border-[#D0CDC5] hover:border-[#181818] px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#626653]" />
                <span>{siteConfig.hero.ctaSecondary}</span>
              </button>
            </div>

            {/* Specifications Strip (Light Theme) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#E2E0DA]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#626653]" />
                <div>
                  <p className="text-[11px] font-mono uppercase text-[#181818] font-bold">1.8–2.0 MM</p>
                  <p className="text-[10px] text-[#77746D]">Oiled Bovine Leather</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#626653]" />
                <div>
                  <p className="text-[11px] font-mono uppercase text-[#181818] font-bold">GOODYEAR WELT</p>
                  <p className="text-[10px] text-[#77746D]">Reinforced Lock-Stitch</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#626653]" />
                <div>
                  <p className="text-[11px] font-mono uppercase text-[#181818] font-bold">COMMAND GRIP</p>
                  <p className="text-[10px] text-[#77746D]">Traction Rubber Outsole</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#181818] bg-[#E8E6E0] px-1.5 py-0.5 border border-[#D9D7D0]">₹2K-4K</span>
                <div>
                  <p className="text-[11px] font-mono uppercase text-[#181818] font-bold">DIRECT VALUE</p>
                  <p className="text-[10px] text-[#77746D]">No Middleman Markup</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Hero Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full overflow-hidden bg-[#E8E6E0] border border-[#D9D7D0] shadow-xl group">
              {!heroImgFailed ? (
                <img
                  src={siteConfig.hero.image}
                  alt={siteConfig.hero.title}
                  onError={() => setHeroImgFailed(true)}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-[#E8E6E0]">
                  <p className="font-condensed font-bold text-3xl uppercase text-[#181818] tracking-widest mb-2">
                    {siteConfig.brandName}
                  </p>
                  <p className="font-mono text-xs text-[#626653] uppercase tracking-wider">
                    {siteConfig.brandTagline}
                  </p>
                </div>
              )}

              {/* Editorial Frame Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818]/60 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Badge Over Image */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between pointer-events-none">
                <div className="bg-[#FFFFFF]/95 backdrop-blur-md px-4 py-2.5 border border-[#E2E0DA] shadow-md">
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#626653]">
                    MODEL SHOWN
                  </p>
                  <p className="font-condensed font-bold text-base uppercase text-[#181818] tracking-wider">
                    RANGER X1 TACTICAL
                  </p>
                </div>

                <div className="hidden sm:block text-right text-white font-mono text-[10px] tracking-widest bg-[#181818]/80 backdrop-blur-sm px-2.5 py-1.5">
                  SERIES 2026
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
