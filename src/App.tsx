/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { ProductGrid } from './components/ProductGrid';
import { BrandSection } from './components/BrandSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';

// Modals and Overlays
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ToastNotification } from './components/ToastNotification';

// Admin System
import { AdminPanel } from './components/admin/AdminPanel';
import { Shield, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'store';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('store');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSwitchToAdmin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
  };

  const handleSwitchToStore = () => {
    window.location.hash = '';
    setCurrentView('store');
  };

  if (currentView === 'admin') {
    return <AdminPanel onGoToStorefront={handleSwitchToStore} />;
  }

  return (
    <ShopProvider>
      <div className="min-h-screen bg-[#F7F6F2] text-[#181818] font-sans antialiased selection:bg-[#181818] selection:text-white flex flex-col relative">
        {/* Sticky Tactical Navbar */}
        <Navbar />

        {/* Main Content Layout */}
        <main className="flex-1">
          {/* Cinematic Hero */}
          <Hero />

          {/* 4-Pillar Features Strip */}
          <FeaturesSection />

          {/* The RANVIK Boot Catalog & Live Filters */}
          <ProductGrid />

          {/* Brand Manifesto & Agra Foundry Heritage */}
          <BrandSection />

          {/* Verified Field Testimonials */}
          <ReviewsSection />
        </main>

        {/* Footer with Trust Badges & Field Report Newsletter */}
        <Footer />

        {/* Floating Admin Quick Access Badge */}
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={handleSwitchToAdmin}
            title="Open RANVIK Supabase Admin Panel"
            className="flex items-center gap-2 bg-[#121418] hover:bg-[#B83A2A] text-white border border-[#3A3D46] px-3.5 py-2 rounded-xs shadow-2xl transition-all duration-200 text-xs font-mono font-bold tracking-wider cursor-pointer group"
          >
            <Shield className="w-3.5 h-3.5 text-[#E04D39] group-hover:text-white transition-colors" />
            <span className="hidden sm:inline">ADMIN PORTAL</span>
            <span className="sm:hidden">ADMIN</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Interactive Overlays & Drawers */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackingModal />
        <SearchModal />
        <WishlistDrawer />
        <AccountModal />
        <SizeGuideModal />
        <ToastNotification />
      </div>
    </ShopProvider>
  );
}
