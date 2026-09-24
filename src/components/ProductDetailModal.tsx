import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Ruler,
  ChevronDown,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    setIsCheckoutOpen,
    addReview,
    showToast,
  } = useShop();

  const product = selectedProductForDetail;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number>(() => {
    return product ? (product.availableSizes.includes(9) ? 9 : product.availableSizes[0]) : 9;
  });
  const [quantity] = useState(1);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    materials: false,
    sole: false,
    fit: false,
    shipping: false,
    returns: false,
    reviews: true,
  });

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToBag = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyItNow = () => {
    addToCart(product, selectedSize, quantity);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please fill in your name and review', 'alert');
      return;
    }
    addReview(product.id, {
      userName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      sizePurchased: selectedSize,
    });
    setReviewName('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Boot link copied to clipboard', 'info');
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="product-detail-card"
        className="relative w-full max-w-5xl bg-[#FFFFFF] border border-[#E2E0DA] shadow-2xl my-auto text-[#181818] overflow-hidden rounded-xs"
      >
        {/* Sticky Close Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0DA] bg-[#F7F6F2]">
          <div className="flex items-center gap-3 font-mono text-xs text-[#626653] uppercase font-bold">
            <span className="text-[#181818]">RANVIK SPECIFICATION</span>
            <span>//</span>
            <span>{product.modelCode}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-[#77746D] hover:text-[#181818] transition-colors"
              title="Share Boot"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="close-product-detail-btn"
              onClick={() => setSelectedProductForDetail(null)}
              className="p-2 text-[#77746D] hover:text-[#181818] transition-colors hover:bg-[#EAE8E2] rounded-xs"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* Primary Display Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F0EEEA] border border-[#E2E0DA]">
              <img
                src={product.images[activeImageIndex] || product.images[0] || '/assets/products/ranger-x1.jpg'}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== window.location.origin + '/assets/products/ranger-x1.jpg') {
                    target.src = '/assets/products/ranger-x1.jpg';
                  }
                }}
              />
              {product.discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-[#B83A2A] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase font-mono shadow-xs">
                  {product.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 shrink-0 border overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#181818] opacity-100 ring-2 ring-[#181818]'
                        : 'border-[#E2E0DA] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Assurance Badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F7F6F2] border border-[#E2E0DA] text-center font-mono text-[11px] text-[#55524B]">
              <div>
                <Truck className="w-4 h-4 mx-auto mb-1 text-[#626653]" />
                <p className="text-[#181818] font-bold">Free Shipping</p>
                <p className="text-[10px] text-[#77746D]">Above ₹2,999</p>
              </div>
              <div>
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-[#626653]" />
                <p className="text-[#181818] font-bold">7-Day Return</p>
                <p className="text-[10px] text-[#77746D]">Easy Exchange</p>
              </div>
              <div>
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#626653]" />
                <p className="text-[#181818] font-bold">Genuine Leather</p>
                <p className="text-[10px] text-[#77746D]">Agra Crafted</p>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Title & Star Rating */}
            <h1 className="font-condensed font-black text-3xl sm:text-4xl uppercase text-[#181818] tracking-wide mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-[#D97706]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#D97706] text-[#D97706]'
                        : 'fill-[#E8E6E0] text-[#E8E6E0]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-mono font-bold text-[#181818]">{product.rating}</span>
              <span className="text-xs text-[#77746D] font-mono">({product.reviewsCount} verified reviews)</span>
            </div>

            {/* Pricing Area */}
            <div className="flex items-baseline gap-3 pb-4 mb-5 border-b border-[#E2E0DA]">
              <span className="text-3xl font-black font-mono text-[#181818]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base font-mono text-[#8C8982] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discountPercent > 0 && (
                <span className="text-xs font-bold font-mono text-[#B83A2A] bg-[#B83A2A]/10 border border-[#B83A2A]/20 px-2 py-0.5 uppercase">
                  {product.discountPercent}% OFF
                </span>
              )}
              <span className="text-xs text-[#626653] font-mono font-medium ml-auto">
                Inclusive of all taxes
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-[#55524B] leading-relaxed mb-6">
              {product.fullDescription}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#77746D] font-medium">
                  SELECT SIZE (UK / INDIA):
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1.5 text-xs text-[#181818] hover:underline font-mono font-bold"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#626653]" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs font-mono font-bold transition-all border ${
                      selectedSize === size
                        ? 'bg-[#181818] text-white border-[#181818] shadow-sm'
                        : 'bg-[#F7F6F2] text-[#242424] border-[#E2E0DA] hover:border-[#181818]'
                    }`}
                  >
                    UK {size}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-[#77746D] font-mono">
                Fits true to Indian sizing. Orthotic cushioned footbed included.
              </p>
            </div>

            {/* Purchase Buttons */}
            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <button
                  id="modal-add-to-bag-btn"
                  type="button"
                  onClick={handleAddToBag}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#F7F6F2] text-[#181818] border-2 border-[#181818] py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#181818]" />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="p-4 bg-[#F7F6F2] hover:bg-[#EAE8E2] border border-[#E2E0DA] text-[#181818] transition-colors"
                  aria-label="Wishlist toggle"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      inWishlist ? 'fill-[#B83A2A] text-[#B83A2A]' : 'text-[#181818]'
                    }`}
                  />
                </button>
              </div>

              <button
                id="modal-buy-it-now-btn"
                type="button"
                onClick={handleBuyItNow}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#181818] hover:bg-[#2A2A2A] text-white py-4 text-xs font-bold uppercase tracking-[0.22em] transition-colors shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>BUY IT NOW — EXPRESS CHECKOUT</span>
              </button>
            </div>

            {/* Expandable Accordions */}
            <div className="border-t border-[#E2E0DA] divide-y divide-[#E2E0DA] text-xs">
              {/* Product Details & Specs */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-left font-mono uppercase text-[#181818] hover:text-black font-bold py-1"
                >
                  <span>PRODUCT SPECIFICATIONS</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.details ? 'rotate-180 text-[#181818]' : 'text-[#77746D]'
                    }`}
                  />
                </button>
                {openAccordions.details && (
                  <div className="pt-3 pb-2 text-[#55524B] font-mono space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[#77746D] block text-[10px]">LEATHER:</span>
                        <span className="text-[#181818] font-medium">{product.specs.material}</span>
                      </div>
                      <div>
                        <span className="text-[#77746D] block text-[10px]">OUTSOLE:</span>
                        <span className="text-[#181818] font-medium">{product.specs.sole}</span>
                      </div>
                      <div>
                        <span className="text-[#77746D] block text-[10px]">SHAFT HEIGHT:</span>
                        <span className="text-[#181818] font-medium">{product.specs.shaftHeight}</span>
                      </div>
                      <div>
                        <span className="text-[#77746D] block text-[10px]">HARDWARE:</span>
                        <span className="text-[#181818] font-medium">{product.specs.closure}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Materials */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between text-left font-mono uppercase text-[#181818] hover:text-black font-bold py-1"
                >
                  <span>MATERIALS & CRAFTSMANSHIP</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.materials ? 'rotate-180 text-[#181818]' : 'text-[#77746D]'
                    }`}
                  />
                </button>
                {openAccordions.materials && (
                  <div className="pt-3 pb-2 text-[#55524B] leading-relaxed">
                    {product.materialsDescription}
                  </div>
                )}
              </div>

              {/* Sole */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('sole')}
                  className="w-full flex items-center justify-between text-left font-mono uppercase text-[#181818] hover:text-black font-bold py-1"
                >
                  <span>COMMAND SOLE ARCHITECTURE</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.sole ? 'rotate-180 text-[#181818]' : 'text-[#77746D]'
                    }`}
                  />
                </button>
                {openAccordions.sole && (
                  <div className="pt-3 pb-2 text-[#55524B] leading-relaxed">
                    {product.soleDescription}
                  </div>
                )}
              </div>

              {/* Fit */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('fit')}
                  className="w-full flex items-center justify-between text-left font-mono uppercase text-[#181818] hover:text-black font-bold py-1"
                >
                  <span>FIT & BREAK-IN ADVICE</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.fit ? 'rotate-180 text-[#181818]' : 'text-[#77746D]'
                    }`}
                  />
                </button>
                {openAccordions.fit && (
                  <div className="pt-3 pb-2 text-[#55524B] leading-relaxed">
                    {product.fitAdvice}
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left font-mono uppercase text-[#181818] hover:text-black font-bold py-1"
                >
                  <span>SHIPPING & DELIVERY</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.shipping ? 'rotate-180 text-[#181818]' : 'text-[#77746D]'
                    }`}
                  />
                </button>
                {openAccordions.shipping && (
                  <div className="pt-3 pb-2 text-[#55524B] leading-relaxed space-y-1.5">
                    <p>• Orders dispatched within 24 hours from our Agra workshop.</p>
                    <p>• Free surface express delivery across India for orders above ₹2,999.</p>
                    <p>• Expected delivery time: 3 to 5 working days (Metro cities: 2 to 3 days).</p>
                    <p>• Cash on Delivery available at all serviceable pin codes.</p>
                  </div>
                )}
              </div>

              {/* Returns */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('returns')}
                  className="w-full flex items-center justify-between text-left font-mono uppercase text-[#181818] hover:text-black font-bold py-1"
                >
                  <span>7-DAY EASY REPLACEMENT POLICY</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.returns ? 'rotate-180 text-[#181818]' : 'text-[#77746D]'
                    }`}
                  />
                </button>
                {openAccordions.returns && (
                  <div className="pt-3 pb-2 text-[#55524B] leading-relaxed space-y-1.5">
                    <p>• Complimentary size exchange if the boots do not fit perfectly.</p>
                    <p>• Hassle-free pickup directly from your doorstep.</p>
                    <p>• Boots must be unworn outdoors with original packaging intact.</p>
                  </div>
                )}
              </div>

              {/* Reviews Accordion */}
              <div className="py-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('reviews')}
                  className="w-full flex items-center justify-between text-left font-mono uppercase text-[#181818] hover:text-black font-bold py-1"
                >
                  <span>VERIFIED FIELD REVIEWS ({product.reviews.length})</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openAccordions.reviews ? 'rotate-180 text-[#181818]' : 'text-[#77746D]'
                    }`}
                  />
                </button>
                {openAccordions.reviews && (
                  <div className="pt-4 pb-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#181818] font-mono font-bold">
                        Average: {product.rating} / 5.0
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="text-xs text-[#181818] hover:underline font-mono uppercase font-bold"
                      >
                        {showReviewForm ? 'Cancel' : '+ Write a Review'}
                      </button>
                    </div>

                    {showReviewForm && (
                      <form
                        onSubmit={handleReviewSubmit}
                        className="p-4 bg-[#F7F6F2] border border-[#E2E0DA] space-y-3"
                      >
                        <p className="font-mono text-xs uppercase text-[#181818] font-bold">
                          Submit Your Review
                        </p>
                        <div>
                          <label className="block text-[10px] font-mono text-[#77746D] uppercase mb-1 font-medium">
                            Your Name
                          </label>
                          <input
                            type="text"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="e.g. Vikram Sharma"
                            className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3 py-2 text-xs focus:outline-none focus:border-[#181818]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-[#77746D] uppercase mb-1 font-medium">
                            Rating
                          </label>
                          <div className="flex gap-2">
                            {[5, 4, 3, 2, 1].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={`px-2.5 py-1 text-xs font-mono border ${
                                  reviewRating === star
                                    ? 'bg-[#181818] text-white border-[#181818]'
                                    : 'bg-[#FFFFFF] text-[#55524B] border-[#E2E0DA]'
                                }`}
                              >
                                {star} ★
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-[#77746D] uppercase mb-1 font-medium">
                            Feedback
                          </label>
                          <textarea
                            rows={3}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Detail your experience with the leather, sole grip, comfort..."
                            className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-3 text-xs focus:outline-none focus:border-[#181818]"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase font-bold"
                        >
                          SUBMIT REVIEW
                        </button>
                      </form>
                    )}

                    {/* Existing Reviews List */}
                    <div className="space-y-3">
                      {product.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3.5 bg-[#F7F6F2] border border-[#E2E0DA] rounded-xs"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#181818] font-mono text-xs">
                                {rev.userName}
                              </span>
                              {rev.verifiedPurchase && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[#626653] bg-[#E8E6E0] border border-[#D9D7D0] px-1.5 py-0.2 font-bold">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  VERIFIED OWNER
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#8C8982] font-mono">{rev.date}</span>
                          </div>

                          <div className="flex items-center text-[#D97706] mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating
                                    ? 'fill-[#D97706] text-[#D97706]'
                                    : 'fill-[#E8E6E0] text-[#E8E6E0]'
                                }`}
                              />
                            ))}
                            <span className="text-[10px] text-[#77746D] ml-2 font-mono">
                              UK {rev.sizePurchased}
                            </span>
                          </div>

                          <p className="text-xs text-[#55524B] leading-relaxed">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
