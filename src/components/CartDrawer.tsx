import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    setIsCheckoutOpen,
    setActiveNavSection,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    setActiveNavSection('shop');
    const shopEl = document.getElementById('shop-section');
    shopEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#E2E0DA] shadow-2xl flex flex-col justify-between"
        >
          {/* Cart Header */}
          <div className="p-5 sm:p-6 border-b border-[#E2E0DA] flex items-center justify-between bg-[#F7F6F2]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#181818]" />
              <h3 className="font-condensed font-black text-2xl uppercase tracking-wider text-[#181818]">
                YOUR CART ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              id="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#77746D] hover:text-[#181818] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-[#F7F6F2] border-b border-[#E2E0DA] font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#55524B]">
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-[#2E7D32] font-bold">QUALIFIED FOR FREE EXPRESS SHIPPING!</span>
                ) : (
                  <span>Add <strong className="text-[#181818]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for Free Shipping</span>
                )}
              </span>
              <span className="text-[#77746D] font-bold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#E8E6E0] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#181818] h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#E2E0DA]">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-[#F0EEEA] border border-[#E2E0DA] overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-condensed font-bold text-lg text-[#181818] uppercase leading-tight">
                          {item.product.name}
                        </h4>
                        <p className="font-mono text-[11px] text-[#77746D] mt-0.5">
                          SIZE: <span className="text-[#181818] font-bold">UK {item.size}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#8C8982] hover:text-[#B83A2A] p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity + Item Price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#E2E0DA] bg-[#FFFFFF]">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-[#77746D] hover:text-[#181818]"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-[#181818]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-[#77746D] hover:text-[#181818]"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-sm text-[#181818]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-[#77746D]">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#D0CDC5]" />
                <p className="font-condensed text-xl uppercase text-[#181818] tracking-wide mb-1">
                  YOUR BAG IS EMPTY
                </p>
                <p className="text-xs mb-6 text-[#77746D]">
                  Select from our handcrafted leather boot line-up.
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-2.5 bg-[#181818] text-white text-xs font-mono font-bold tracking-wider uppercase shadow-xs"
                >
                  EXPLORE BOOTS
                </button>
              </div>
            )}
          </div>

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="p-4 bg-[#F7F6F2] border-t border-[#E2E0DA]">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#FFFFFF] border border-[#E2E0DA] text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#2E7D32]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      CODE: <strong className="text-[#181818]">{appliedCoupon.code}</strong> (
                      {appliedCoupon.description})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#B83A2A] hover:underline text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      placeholder="PROMO CODE (e.g. FIRSTBOOT)"
                      className="flex-1 bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#181818]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-semibold tracking-wider uppercase"
                    >
                      APPLY
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-[#B83A2A] font-mono">{couponError}</p>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Order Summary & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#F7F6F2] border-t border-[#E2E0DA] space-y-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#55524B]">
                  <span>SUBTOTAL</span>
                  <span className="text-[#181818] font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#2E7D32]">
                    <span>DISCOUNT APPLIED</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#55524B]">
                  <span>SHIPPING</span>
                  <span>
                    {cartShipping === 0 ? (
                      <span className="text-[#2E7D32] font-bold">FREE</span>
                    ) : (
                      `₹${cartShipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#181818] pt-2 border-t border-[#E2E0DA]">
                  <span>ESTIMATED TOTAL</span>
                  <span className="text-base text-[#181818] font-mono">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  id="cart-checkout-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors shadow-md cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleContinueShopping}
                  className="w-full py-2 text-center text-xs font-mono uppercase text-[#77746D] hover:text-[#181818] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#77746D] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#626653]" />
                <span>256-BIT ENCRYPTED SECURE CHECKOUT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
