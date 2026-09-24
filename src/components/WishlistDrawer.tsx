import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setSelectedProductForDetail,
    setActiveNavSection,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: typeof products[0]) => {
    const size = product.availableSizes[0] || 9;
    addToCart(product, size, 1);
  };

  const handleExplore = () => {
    setIsWishlistOpen(false);
    setActiveNavSection('shop');
    const shopEl = document.getElementById('shop-section');
    shopEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="wishlist-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="wishlist-panel"
          className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#E2E0DA] shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#E2E0DA] flex items-center justify-between bg-[#F7F6F2]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#B83A2A] fill-[#B83A2A]" />
              <h3 className="font-condensed font-black text-2xl uppercase tracking-wider text-[#181818]">
                SAVED BOOTS ({wishlistProducts.length})
              </h3>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-[#77746D] hover:text-[#181818] transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length > 0 ? (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-[#FFFFFF] border border-[#E2E0DA] flex flex-col gap-3 group shadow-xs hover:border-[#181818] transition-colors"
                >
                  <div className="flex gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setSelectedProductForDetail(product);
                      }}
                      className="w-20 h-20 object-cover bg-[#F0EEEA] border border-[#E2E0DA] cursor-pointer shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setSelectedProductForDetail(product);
                          }}
                          className="font-condensed font-bold text-lg text-[#181818] uppercase truncate cursor-pointer hover:underline"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[#8C8982] hover:text-[#B83A2A] p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="font-mono text-[11px] text-[#77746D] mt-0.5">
                        {product.bootType} • {product.specs.shaftHeight}
                      </p>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-mono font-bold text-sm text-[#181818]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="font-mono text-xs text-[#8C8982] line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD TO BAG</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-[#77746D]">
                <Heart className="w-12 h-12 mx-auto mb-4 text-[#D0CDC5]" />
                <p className="font-condensed text-2xl uppercase text-[#181818] tracking-wide mb-1">
                  NO SAVED BOOTS
                </p>
                <p className="text-xs mb-6 text-[#77746D]">
                  Click the heart icon on any boot model to save it to your wishlist.
                </p>
                <button
                  onClick={handleExplore}
                  className="px-6 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold tracking-wider uppercase shadow-xs"
                >
                  EXPLORE COLLECTION
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F7F6F2] border-t border-[#E2E0DA] text-center">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="text-xs font-mono text-[#77746D] hover:text-[#181818] uppercase tracking-wider"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
