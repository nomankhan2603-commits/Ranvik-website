import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { SortOption } from '../types';
import { siteConfig } from '../config/siteConfig';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const ProductGrid: React.FC = () => {
  const { products, filterState, setFilterState, resetFilters } = useShop();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Boot Type
        if (filterState.bootTypes.length > 0 && !filterState.bootTypes.includes(p.bootType)) {
          return false;
        }
        // Size
        if (
          filterState.sizes.length > 0 &&
          !filterState.sizes.some((size) => p.availableSizes.includes(size))
        ) {
          return false;
        }
        // Price Range
        if (p.price < filterState.priceRange[0] || p.price > filterState.priceRange[1]) {
          return false;
        }
        // In Stock
        if (filterState.inStockOnly && !p.inStock) {
          return false;
        }
        // Rating
        if (filterState.minRating > 0 && p.rating < filterState.minRating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'newest':
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'featured':
          default:
            return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
      });
  }, [products, filterState]);

  const activeFilterCount =
    filterState.bootTypes.length +
    filterState.sizes.length +
    (filterState.inStockOnly ? 1 : 0) +
    (filterState.minRating > 0 ? 1 : 0) +
    (filterState.priceRange[0] !== 2000 || filterState.priceRange[1] !== 4000 ? 1 : 0);

  return (
    <section id="shop-section" className="w-full bg-[#F7F6F2] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2E0DA]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-[#E2E0DA]">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-xs text-[#626653] uppercase tracking-[0.25em] mb-2 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#626653]" />
              <span>{siteConfig.fieldSeries.eyebrow}</span>
            </div>
            <h2
              id="shop-heading"
              className="font-condensed font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#181818] mb-2"
            >
              {siteConfig.fieldSeries.heading}
            </h2>
            <p
              id="shop-subheading"
              className="text-[#65625B] text-sm sm:text-base max-w-2xl"
            >
              {siteConfig.fieldSeries.subheading}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-3 bg-[#FFFFFF] border border-[#E2E0DA] px-4 py-2.5 font-mono text-xs text-[#55524B] shadow-xs">
            <span className="text-[#181818] font-bold">{filteredProducts.length}</span>
            <span>MODELS AVAILABLE</span>
            <span className="text-[#D0CDC5]">•</span>
            <span className="text-[#181818] font-semibold">{siteConfig.priceRangeDisplay}</span>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Mobile Filter Toggle Button */}
          <button
            id="mobile-filter-trigger"
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFFFFF] border border-[#E2E0DA] text-xs font-mono uppercase text-[#181818] shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#626653]" />
            <span>FILTER BOOTS</span>
            {activeFilterCount > 0 && (
              <span className="h-4 w-4 bg-[#181818] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active Filter Chips */}
          <div className="flex-1 flex flex-wrap items-center gap-2">
            {filterState.bootTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E2E0DA] text-xs font-mono text-[#181818] shadow-xs"
              >
                <span>{type}</span>
                <button
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      bootTypes: prev.bootTypes.filter((t) => t !== type),
                    }))
                  }
                  className="text-[#8C8982] hover:text-[#181818]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {filterState.sizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border border-[#E2E0DA] text-xs font-mono text-[#181818] shadow-xs"
              >
                <span>UK {size}</span>
                <button
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      sizes: prev.sizes.filter((s) => s !== size),
                    }))
                  }
                  className="text-[#8C8982] hover:text-[#181818]"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-mono uppercase text-[#626653] hover:text-[#181818] underline ml-2"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs text-[#55524B]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#626653]" />
            <span className="hidden sm:inline uppercase">SORT:</span>
            <select
              id="sort-select"
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
              }
              className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#181818] cursor-pointer shadow-xs"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest Drops</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Main Grid & Filter Sidebar Layout */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <ProductFilters
            totalResults={filteredProducts.length}
            isOpenMobile={mobileFilterOpen}
            onCloseMobile={() => setMobileFilterOpen(false)}
          />

          {/* Products Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length > 0 ? (
              <motion.div
                id="products-container"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                key={`${filterState.sortBy}-${filterState.bootTypes.join(',')}-${filterState.sizes.join(',')}-${filterState.priceRange.join('-')}-${filterState.inStockOnly}-${filterState.minRating}`}
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    className="h-full flex flex-col"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div
                id="no-products-fallback"
                className="w-full py-20 px-6 text-center bg-[#FFFFFF] border border-[#E2E0DA] rounded-xs shadow-xs"
              >
                <p className="font-condensed text-2xl uppercase text-[#181818] tracking-wide mb-2">
                  NO BOOTS MATCH FILTER CRITERIA
                </p>
                <p className="text-sm text-[#65625B] max-w-md mx-auto mb-6">
                  Try clearing some of your size or price filters to view all available footwear models.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold tracking-widest uppercase shadow-xs"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
