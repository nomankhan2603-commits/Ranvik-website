import React, { useState, useMemo } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    setSelectedProductForDetail,
    setFilterState,
    setActiveNavSection,
  } = useShop();

  const [query, setQuery] = useState('');

  const quickTags = [
    'Combat Boots',
    'Tactical Boots',
    'Full Grain Leather',
    'Side Zipper',
    'Under ₹3,000',
    'Officer Series',
  ];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.bootType.toLowerCase().includes(q);
      const matchDesc = p.shortDescription.toLowerCase().includes(q);
      const matchSpecs =
        p.specs.material.toLowerCase().includes(q) ||
        p.specs.sole.toLowerCase().includes(q);
      const matchPrice = p.price.toString().includes(q);

      return matchName || matchCategory || matchDesc || matchSpecs || matchPrice;
    });
  }, [products, query]);

  if (!isSearchOpen) return null;

  const handleProductSelect = (product: typeof products[0]) => {
    setIsSearchOpen(false);
    setSelectedProductForDetail(product);
  };

  const handleTagClick = (tag: string) => {
    if (tag === 'Combat Boots') {
      setIsSearchOpen(false);
      setActiveNavSection('military');
      setFilterState((prev) => ({ ...prev, bootTypes: ['Combat'] }));
      const shopEl = document.getElementById('shop-section');
      shopEl?.scrollIntoView({ behavior: 'smooth' });
    } else if (tag === 'Under ₹3,000') {
      setIsSearchOpen(false);
      setActiveNavSection('shop');
      setFilterState((prev) => ({ ...prev, priceRange: [2000, 3000] }));
      const shopEl = document.getElementById('shop-section');
      shopEl?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setQuery(tag);
    }
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6 flex items-start justify-center animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#E2E0DA] shadow-2xl p-6 sm:p-8 mt-12 text-[#181818] rounded-xs">
        {/* Close */}
        <button
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-5 right-5 p-2 text-[#77746D] hover:text-[#181818]"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b-2 border-[#181818] pb-3 mb-6">
          <Search className="w-6 h-6 text-[#181818]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH BOOTS, LEATHERS, SPECIFICATIONS..."
            className="w-full bg-transparent text-lg sm:text-xl font-mono uppercase text-[#181818] placeholder-[#8C8982] focus:outline-none font-semibold"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-[#77746D] hover:text-[#181818] font-bold"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Quick Tag Recommendations */}
        <div className="mb-6">
          <p className="text-[11px] font-mono uppercase text-[#77746D] mb-2 font-medium">
            POPULAR SEARCHES:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 bg-[#F7F6F2] hover:bg-[#EAE8E2] border border-[#E2E0DA] text-xs font-mono text-[#181818] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div>
          {query.trim() && (
            <div className="flex items-center justify-between text-xs font-mono text-[#77746D] mb-3 pb-2 border-b border-[#E2E0DA]">
              <span>MATCHING BOOTS ({searchResults.length})</span>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="group flex items-center justify-between p-3 bg-[#FFFFFF] hover:bg-[#F7F6F2] border border-[#E2E0DA] hover:border-[#181818] cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover bg-[#F0EEEA] border border-[#E2E0DA]"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-condensed font-bold text-lg text-[#181818] uppercase group-hover:underline">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#55524B] line-clamp-1">
                        {product.shortDescription}
                      </p>
                      <span className="text-[10px] font-mono text-[#626653] font-medium">
                        {product.bootType} Series • {product.specs.material}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-[#181818] block">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#181818] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      VIEW <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            ) : query.trim() ? (
              <div className="py-12 text-center text-[#77746D]">
                <p className="font-condensed text-xl uppercase text-[#181818] mb-1">
                  NO MATCHES FOUND FOR "{query}"
                </p>
                <p className="text-xs text-[#55524B]">
                  Try searching for 'Ranger', 'Tactical', 'Black', or 'Leather'.
                </p>
              </div>
            ) : (
              <div className="py-8 text-center text-[#77746D] font-mono text-xs">
                Type keywords above to view immediate specifications and boot availability.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
