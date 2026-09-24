import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    isInWishlist,
    toggleWishlist,
    addToCart,
    setSelectedProductForDetail,
  } = useShop();

  const defaultSize = product.availableSizes.includes(9)
    ? 9
    : product.availableSizes[0] || 8;
  const [selectedSize, setSelectedSize] = useState<number>(defaultSize);

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCardClick = () => {
    setSelectedProductForDetail(product);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group relative flex flex-col h-full bg-[#FFFFFF] border border-[#E2E0DA] hover:border-[#181818] transition-all duration-300 cursor-pointer overflow-hidden rounded-xs shadow-xs hover:shadow-md"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.bestSeller && (
          <span className="bg-[#181818] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase font-mono shadow-xs">
            BEST SELLER
          </span>
        )}
        {product.discountPercent > 0 && (
          <span className="bg-[#B83A2A] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase font-mono shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isNew && !product.bestSeller && (
          <span className="bg-[#626653] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider uppercase font-mono shadow-xs">
            NEW DROP
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`wishlist-btn-${product.id}`}
        onClick={handleWishlistToggle}
        aria-label={`Add ${product.name} to wishlist`}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md border border-[#E2E0DA] text-[#44423C] hover:text-[#181818] hover:border-[#181818] transition-all shadow-xs"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            inWishlist ? 'fill-[#B83A2A] text-[#B83A2A]' : 'text-[#44423C]'
          }`}
        />
      </button>

      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0EEEA]">
        <img
          src={product.images[0] || '/assets/products/ranger-x1.jpg'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== window.location.origin + '/assets/products/ranger-x1.jpg') {
              target.src = '/assets/products/ranger-x1.jpg';
            }
          }}
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] text-white text-[11px] uppercase tracking-widest font-mono shadow-md">
            VIEW BOOT INTEL <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Model Code & Category */}
        <div className="flex items-center justify-between text-[11px] font-mono text-[#77746D] uppercase mb-1">
          <span>{product.bootType} SERIES</span>
          <span>{product.modelCode}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-condensed font-bold text-xl sm:text-2xl uppercase text-[#181818] tracking-wide group-hover:text-black transition-colors mb-1.5">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#65625B] line-clamp-2 leading-relaxed mb-3">
          {product.shortDescription}
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center text-[#D97706]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-[#D97706] text-[#D97706]'
                    : 'fill-[#E8E6E0] text-[#E8E6E0]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-[#181818]">{product.rating}</span>
          <span className="text-[11px] text-[#77746D]">({product.reviewsCount})</span>
        </div>

        {/* Size Selection Ribbon */}
        <div
          className="mb-4 pt-2.5 border-t border-[#EFECE6]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-[10px] uppercase font-mono text-[#77746D] mb-1.5">
            <span>SELECT UK SIZE</span>
            <span className="text-[#181818] font-bold">UK {selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`h-7 min-w-[28px] px-1.5 text-xs font-mono transition-colors border ${
                  selectedSize === size
                    ? 'bg-[#181818] text-white border-[#181818] font-bold'
                    : 'bg-[#F7F6F2] text-[#242424] border-[#E2E0DA] hover:border-[#181818]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Quick Add Button Row */}
        <div className="mt-auto pt-3 border-t border-[#EFECE6] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold font-mono text-[#181818]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs font-mono text-[#8C8982] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#626653] font-mono font-medium">
              Free Delivery Eligible
            </span>
          </div>

          <button
            id={`quick-add-${product.id}`}
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-150 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QUICK ADD</span>
            <span className="sm:hidden">ADD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
