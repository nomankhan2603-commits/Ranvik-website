import React from 'react';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BootType } from '../types';

interface ProductFiltersProps {
  totalResults: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const BOOT_TYPES: BootType[] = ['Combat', 'Tactical', 'Field', 'Officer'];
const SIZES = [6, 7, 8, 9, 10, 11];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  totalResults,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { filterState, setFilterState, resetFilters } = useShop();

  const handleBootTypeToggle = (type: BootType) => {
    setFilterState((prev) => {
      const exists = prev.bootTypes.includes(type);
      return {
        ...prev,
        bootTypes: exists ? prev.bootTypes.filter((t) => t !== type) : [...prev.bootTypes, type],
      };
    });
  };

  const handleSizeToggle = (size: number) => {
    setFilterState((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const handlePriceRange = (min: number, max: number) => {
    setFilterState((prev) => ({
      ...prev,
      priceRange: [min, max],
    }));
  };

  const hasActiveFilters =
    filterState.bootTypes.length > 0 ||
    filterState.sizes.length > 0 ||
    filterState.inStockOnly ||
    filterState.minRating > 0 ||
    filterState.priceRange[0] !== 2000 ||
    filterState.priceRange[1] !== 4000;

  const content = (
    <div className="flex flex-col space-y-6 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E0DA]">
        <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#181818] font-bold tracking-wider">
          <Filter className="w-3.5 h-3.5 text-[#626653]" />
          <span>FILTER COLLECTION</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-[#626653] hover:text-[#181818] transition-colors font-mono font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        )}
      </div>

      {/* Boot Type Filter */}
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-[#77746D] mb-3">
          Boot Silhouette
        </h4>
        <div className="space-y-1.5">
          {BOOT_TYPES.map((type) => {
            const checked = filterState.bootTypes.includes(type);
            return (
              <label
                key={type}
                className="flex items-center justify-between py-1.5 px-2 rounded-xs hover:bg-[#F7F6F2] cursor-pointer text-[#242424] select-none transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                      checked
                        ? 'bg-[#181818] border-[#181818] text-white'
                        : 'border-[#D0CDC5] bg-[#FFFFFF]'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs ${checked ? 'text-[#181818] font-bold' : 'text-[#44423C]'}`}>
                    {type} Boots
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-[#77746D] mb-3">
          UK / India Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => {
            const active = filterState.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`py-2 text-xs font-mono transition-colors border ${
                  active
                    ? 'bg-[#181818] text-white border-[#181818] font-bold'
                    : 'bg-[#F7F6F2] text-[#242424] border-[#E2E0DA] hover:border-[#181818]'
                }`}
              >
                UK {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[#77746D] mb-3">
          <span>Price Bracket</span>
          <span className="text-[#181818] font-bold">
            ₹{filterState.priceRange[0]} - ₹{filterState.priceRange[1]}
          </span>
        </div>
        <div className="space-y-1.5 font-mono text-xs">
          <button
            onClick={() => handlePriceRange(2000, 4000)}
            className={`w-full text-left py-2 px-2.5 rounded-xs border transition-colors ${
              filterState.priceRange[0] === 2000 && filterState.priceRange[1] === 4000
                ? 'bg-[#181818] text-white border-[#181818]'
                : 'bg-[#F7F6F2] text-[#44423C] border-[#E2E0DA] hover:border-[#D0CDC5]'
            }`}
          >
            All Boots (₹2,000 – ₹4,000)
          </button>
          <button
            onClick={() => handlePriceRange(2000, 2700)}
            className={`w-full text-left py-2 px-2.5 rounded-xs border transition-colors ${
              filterState.priceRange[0] === 2000 && filterState.priceRange[1] === 2700
                ? 'bg-[#181818] text-white border-[#181818]'
                : 'bg-[#F7F6F2] text-[#44423C] border-[#E2E0DA] hover:border-[#D0CDC5]'
            }`}
          >
            Under ₹2,700 (Tactical Core)
          </button>
          <button
            onClick={() => handlePriceRange(2700, 3500)}
            className={`w-full text-left py-2 px-2.5 rounded-xs border transition-colors ${
              filterState.priceRange[0] === 2700 && filterState.priceRange[1] === 3500
                ? 'bg-[#181818] text-white border-[#181818]'
                : 'bg-[#F7F6F2] text-[#44423C] border-[#E2E0DA] hover:border-[#D0CDC5]'
            }`}
          >
            ₹2,700 – ₹3,500 (Combat / Command)
          </button>
          <button
            onClick={() => handlePriceRange(3500, 4000)}
            className={`w-full text-left py-2 px-2.5 rounded-xs border transition-colors ${
              filterState.priceRange[0] === 3500 && filterState.priceRange[1] === 4000
                ? 'bg-[#181818] text-white border-[#181818]'
                : 'bg-[#F7F6F2] text-[#44423C] border-[#E2E0DA] hover:border-[#D0CDC5]'
            }`}
          >
            ₹3,500 – ₹4,000 (Field Mark II & Patrol)
          </button>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="font-mono text-xs uppercase tracking-widest text-[#77746D] mb-3">
          Customer Rating
        </h4>
        <div className="flex gap-2">
          {[0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setFilterState((prev) => ({ ...prev, minRating: rating }))}
              className={`flex-1 py-1.5 text-xs font-mono border transition-colors ${
                filterState.minRating === rating
                  ? 'bg-[#181818] text-white border-[#181818] font-bold'
                  : 'bg-[#F7F6F2] text-[#55524B] border-[#E2E0DA] hover:border-[#D0CDC5]'
              }`}
            >
              {rating === 0 ? 'All' : `${rating}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="pt-3 border-t border-[#E2E0DA]">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <span className="text-xs font-mono uppercase text-[#242424] font-medium">In-Stock Only</span>
          <input
            type="checkbox"
            checked={filterState.inStockOnly}
            onChange={(e) =>
              setFilterState((prev) => ({ ...prev, inStockOnly: e.target.checked }))
            }
            className="w-4 h-4 rounded-xs accent-[#181818] cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Filter (Light Theme) */}
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-[#FFFFFF] p-6 border border-[#E2E0DA] rounded-xs h-fit sticky top-28 shadow-xs">
        {content}
      </aside>

      {/* Mobile Drawer Filter */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#FFFFFF] h-full p-6 overflow-y-auto border-l border-[#E2E0DA] shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E0DA] mb-6">
                <span className="font-condensed text-xl font-bold uppercase text-[#181818] tracking-wider">
                  FILTER BOOTS
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 text-[#55524B] hover:text-[#181818]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-[#E2E0DA] mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-bold font-mono tracking-widest uppercase"
              >
                SHOW {totalResults} RESULTS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
