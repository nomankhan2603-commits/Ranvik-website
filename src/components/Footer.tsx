import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Banknote,
  Lock,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  CreditCard,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useShop } from '../context/ShopContext';
import { siteConfig } from '../config/siteConfig';

export const Footer: React.FC = () => {
  const {
    setIsSizeGuideOpen,
    setIsAccountOpen,
    setIsContactOpen,
    setActiveNavSection,
    setFilterState,
    showToast,
  } = useShop();

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast('Subscribed to RANVIK Field Updates! Use code FIRSTBOOT for ₹300 off.', 'info');
    setNewsletterEmail('');
  };

  const scrollToShop = (category?: string) => {
    setActiveNavSection(category ? category.toLowerCase() : 'shop');
    if (category) {
      setFilterState((prev) => ({ ...prev, bootTypes: [category] }));
    } else {
      setFilterState((prev) => ({ ...prev, bootTypes: [] }));
    }
    const shopEl = document.getElementById('shop-section');
    shopEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStory = () => {
    setActiveNavSection('story');
    const storyEl = document.getElementById('story-section');
    storyEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="w-full bg-[#181818] text-[#A6A29A] border-t border-[#2A2A2A]">
      {/* 01 — Value Assurance Grid */}
      <div className="border-b border-[#2A2A2A] py-8 px-4 sm:px-6 lg:px-8 bg-[#202020]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono text-xs">
          {siteConfig.trustBadges.map((badge, idx) => {
            const icons = [ShieldCheck, RotateCcw, Banknote, Lock];
            const Icon = icons[idx] || ShieldCheck;
            return (
              <div key={badge.title} className="flex flex-col items-center justify-center p-2">
                <Icon className="w-5 h-5 text-[#D9D7D0] mb-2" />
                <span className="font-bold text-white uppercase tracking-wider">{badge.title}</span>
                <span className="text-[11px] text-[#8C8982] mt-0.5">{badge.subtitle}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 02 — Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: Brand & Manifesto (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="light" context="footer" size="md" />
            <p className="text-xs sm:text-sm text-[#BDB9B0] leading-relaxed pt-2">
              RANVIK builds rugged, high-performance leather military boots designed for durability,
              confidence and everyday strength. Handcrafted in Agra with industrial combat soles and
              reinforced heavy full-grain leather.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-[#8C8982] pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D9D7D0] shrink-0" />
                <span>{siteConfig.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D9D7D0] shrink-0" />
                <span>Customer Ops: {siteConfig.contact.phone} ({siteConfig.contact.hours})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D9D7D0] shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-4 text-white">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#262626] hover:bg-[#333333] transition-colors rounded-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#262626] hover:bg-[#333333] transition-colors rounded-xs"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#262626] hover:bg-[#333333] transition-colors rounded-xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collection Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3 font-mono text-xs">
            <h4 className="font-condensed font-bold text-base uppercase text-white tracking-wider">
              BOOT COLLECTION
            </h4>
            <ul className="space-y-2 text-[#A6A29A]">
              <li>
                <button
                  onClick={() => scrollToShop()}
                  className="hover:text-white transition-colors"
                >
                  Shop All Models
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToShop('Combat')}
                  className="hover:text-white transition-colors"
                >
                  Combat Boots
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToShop('Tactical')}
                  className="hover:text-white transition-colors"
                >
                  Tactical Boots
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToShop('Field')}
                  className="hover:text-white transition-colors"
                >
                  Field Patrol Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToShop('Officer')}
                  className="hover:text-white transition-colors"
                >
                  Officer Formal Boots
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-white text-[#D9D7D0] transition-colors font-bold underline"
                >
                  Field Sizing Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Support (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-mono text-xs">
            <h4 className="font-condensed font-bold text-base uppercase text-white tracking-wider">
              CUSTOMER SUPPORT
            </h4>
            <ul className="space-y-2 text-[#A6A29A]">
              <li>
                <button
                  onClick={() => setIsAccountOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Track Order Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Contact Support & Sizing Help
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToStory}
                  className="hover:text-white transition-colors"
                >
                  Our Agra Leathercraft Story
                </button>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">7-Day Doorstep Replacement</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Leather Care & Break-in Guide</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">Corporate & Defense Bulk Supply</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Field Updates (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-condensed font-bold text-base uppercase text-white tracking-wider">
              {siteConfig.newsletter.heading}
            </h4>
            <p className="text-xs text-[#BDB9B0]">
              {siteConfig.newsletter.subheading}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 bg-[#262626] border border-[#3A3A3A] text-white px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-white"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-white hover:bg-[#E8E6E0] text-[#181818] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>JOIN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Promo Incentive */}
              <div className="p-2.5 bg-[#202020] border border-[#333333] text-[11px] font-mono text-[#D9D7D0]">
                {siteConfig.newsletter.perk}
              </div>
            </form>
          </div>
        </div>

        {/* Payment Methods Badges Row */}
        <div className="pt-10 mt-10 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#8C8982]">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-[#A6A29A]">ACCEPTED PAYMENTS:</span>
            <span className="px-2 py-1 bg-[#242424] border border-[#333333] text-[11px] text-white">UPI / GPay / PhonePe</span>
            <span className="px-2 py-1 bg-[#242424] border border-[#333333] text-[11px] text-white">Visa & Mastercard</span>
            <span className="px-2 py-1 bg-[#242424] border border-[#333333] text-[11px] text-white">Net Banking</span>
            <span className="px-2 py-1 bg-[#242424] border border-[#333333] text-[11px] text-[#D9D7D0]">Cash on Delivery</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-[#D9D7D0]" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 mt-6 border-t border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#77746D]">
          <p>© {new Date().getFullYear()} {siteConfig.brandName} FOOTWEAR. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px]">
            <span className="hover:text-white cursor-pointer">TERMS OF SERVICE</span>
            <span className="hover:text-white cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-white cursor-pointer">SHIPPING & RETURNS</span>
            <button
              onClick={() => {
                window.location.hash = '#admin';
              }}
              className="text-[#C7CCA9] hover:text-white cursor-pointer underline uppercase"
            >
              ADMIN PORTAL
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
