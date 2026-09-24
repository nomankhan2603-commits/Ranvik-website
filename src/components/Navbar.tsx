import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BrandLogo } from './BrandLogo';
import { siteConfig } from '../config/siteConfig';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    setIsContactOpen,
    activeNavSection,
    setActiveNavSection,
    setFilterState,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section: 'home' | 'shop' | 'military' | 'story' | 'contact') => {
    setMobileMenuOpen(false);
    if (section === 'contact') {
      setIsContactOpen(true);
      return;
    }

    setActiveNavSection(section);

    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'shop') {
      setFilterState((prev) => ({ ...prev, bootTypes: [] }));
      const shopEl = document.getElementById('shop-section');
      shopEl?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'military') {
      setFilterState((prev) => ({ ...prev, bootTypes: ['Combat', 'Tactical'] }));
      const shopEl = document.getElementById('shop-section');
      shopEl?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'story') {
      const storyEl = document.getElementById('story-section');
      storyEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 01 — Top Announcement Bar (Light Premium Soft Stone) */}
      <div
        id="promo-ticker"
        className="w-full bg-[#EFECE6] border-b border-[#E2DFD7] text-[#44423C] text-[11px] sm:text-xs tracking-wider py-1.5 px-4 font-mono select-none overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#626653]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#626653] animate-pulse" />
            <span className="font-semibold tracking-widest text-[10px] uppercase text-[#242424]">FIELD DISPATCH:</span>
          </div>
          <div className="truncate text-center flex-1 px-4 text-[#242424] font-medium text-[11px]">
            {siteConfig.announcement.text}
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[#626653] text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#626653]" />
            <span>AUTHENTIC INDIAN LEATHERCRAFT</span>
          </div>
        </div>
      </div>

      {/* 02 — Main Navigation Bar (Light, Crisp, Editorial) */}
      <nav
        id="main-navbar"
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFFFF]/98 backdrop-blur-md border-b border-[#D9D7D0] shadow-sm py-3'
            : 'bg-[#F7F6F2]/95 backdrop-blur-sm border-b border-[#E2E0DA] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <div className="flex items-center shrink-0 pr-4">
            <BrandLogo
              size="md"
              variant="dark"
              context="header"
              onClick={() => handleNavClick('home')}
            />
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              id="nav-link-home"
              onClick={() => handleNavClick('home')}
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors hover:text-[#181818] ${
                activeNavSection === 'home' ? 'text-[#181818] border-b-2 border-[#181818] pb-0.5' : 'text-[#65625B]'
              }`}
            >
              Home
            </button>
            <button
              id="nav-link-shop"
              onClick={() => handleNavClick('shop')}
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors hover:text-[#181818] ${
                activeNavSection === 'shop' ? 'text-[#181818] border-b-2 border-[#181818] pb-0.5' : 'text-[#65625B]'
              }`}
            >
              Shop
            </button>
            <button
              id="nav-link-military"
              onClick={() => handleNavClick('military')}
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors hover:text-[#181818] flex items-center gap-1.5 ${
                activeNavSection === 'military' ? 'text-[#181818] border-b-2 border-[#181818] pb-0.5' : 'text-[#65625B]'
              }`}
            >
              <span>Military Boots</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-[#E8E6E0] text-[#626653] font-mono font-bold tracking-wider rounded-xs border border-[#D9D7D0]">
                SERIES
              </span>
            </button>
            <button
              id="nav-link-story"
              onClick={() => handleNavClick('story')}
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors hover:text-[#181818] ${
                activeNavSection === 'story' ? 'text-[#181818] border-b-2 border-[#181818] pb-0.5' : 'text-[#65625B]'
              }`}
            >
              Our Story
            </button>
            <button
              id="nav-link-contact"
              onClick={() => handleNavClick('contact')}
              className="text-xs uppercase tracking-[0.2em] font-semibold transition-colors hover:text-[#181818] text-[#65625B]"
            >
              Contact
            </button>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search boots"
              className="p-2 text-[#242424] hover:text-black hover:bg-[#EAE8E2] transition-colors rounded-xs"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account */}
            <button
              id="navbar-account-btn"
              onClick={() => setIsAccountOpen(true)}
              aria-label="Account"
              className="p-2 text-[#242424] hover:text-black hover:bg-[#EAE8E2] transition-colors rounded-xs"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              id="navbar-wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              className="relative p-2 text-[#242424] hover:text-black hover:bg-[#EAE8E2] transition-colors rounded-xs"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span
                  id="wishlist-count-badge"
                  className="absolute -top-0.5 -right-0.5 bg-[#626653] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center font-mono"
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart / Shopping Bag with Live Count */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="relative p-2 text-[#181818] hover:bg-[#EAE8E2] transition-colors rounded-xs flex items-center gap-1.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span
                id="cart-count-badge"
                className="bg-[#181818] text-white text-[11px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center font-mono shadow-sm"
              >
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#181818] hover:bg-[#EAE8E2] transition-colors rounded-xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden fixed inset-x-0 top-[88px] bottom-0 bg-[#F7F6F2] border-t border-[#E2E0DA] z-50 flex flex-col p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col space-y-1 text-left pt-2">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center justify-between text-lg uppercase font-condensed tracking-widest text-[#181818] py-3.5 border-b border-[#E2E0DA]"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-[#8C8982]" />
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className="flex items-center justify-between text-lg uppercase font-condensed tracking-widest text-[#181818] py-3.5 border-b border-[#E2E0DA]"
            >
              <span>Shop All Footwear</span>
              <ChevronRight className="w-4 h-4 text-[#8C8982]" />
            </button>
            <button
              onClick={() => handleNavClick('military')}
              className="flex items-center justify-between text-lg uppercase font-condensed tracking-widest text-[#181818] py-3.5 border-b border-[#E2E0DA]"
            >
              <div className="flex items-center gap-2">
                <span>Military Boots</span>
                <span className="text-[10px] bg-[#626653] text-white px-1.5 py-0.5 rounded-xs font-mono font-bold">
                  TACTICAL
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8C8982]" />
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className="flex items-center justify-between text-lg uppercase font-condensed tracking-widest text-[#181818] py-3.5 border-b border-[#E2E0DA]"
            >
              <span>Our Story</span>
              <ChevronRight className="w-4 h-4 text-[#8C8982]" />
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="flex items-center justify-between text-lg uppercase font-condensed tracking-widest text-[#181818] py-3.5 border-b border-[#E2E0DA]"
            >
              <span>Contact & Support</span>
              <ChevronRight className="w-4 h-4 text-[#8C8982]" />
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-[#E2E0DA] flex items-center justify-between text-xs text-[#77746D]">
            <span className="font-mono">{siteConfig.brandCategory}</span>
            <span className="text-[#181818] font-mono font-bold">EST. {new Date().getFullYear()}</span>
          </div>
        </div>
      )}
    </header>
  );
};
