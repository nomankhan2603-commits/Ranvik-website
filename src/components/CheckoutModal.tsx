import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    user,
    createOrder,
    setIsOrderTrackingOpen,
    setTrackingOrder,
  } = useShop();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [email, setEmail] = useState(user?.email || 'karan.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  const defaultAddr = user?.addresses[0] || {
    id: 'addr_new',
    fullName: 'Karan Sharma',
    street: '402, Elite Heights, Sector 43',
    landmark: 'Golf Course Road',
    city: 'Gurugram',
    state: 'Haryana',
    pinCode: '122002',
    phone: '+91 98765 43210',
    isDefault: true,
  };

  const [address, setAddress] = useState<Address>(defaultAddr);
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('karan@okhdfcbank');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const expressFee = deliverySpeed === 'express' ? 199 : 0;
  const finalPayableTotal = cartTotal + expressFee;

  const [placingOrder, setPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const newOrder = await createOrder({
        address,
        paymentMethod,
      });
      setCreatedOrder(newOrder);
      setCurrentStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleTrackCreatedOrder = () => {
    if (createdOrder) {
      setTrackingOrder(createdOrder);
      setIsCheckoutOpen(false);
      setIsOrderTrackingOpen(true);
    }
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
    >
      <div
        id="checkout-container"
        className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#E2E0DA] shadow-2xl overflow-hidden my-auto text-[#181818] rounded-xs"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0DA] bg-[#F7F6F2]">
          <div className="flex items-center gap-3">
            <span className="font-condensed font-black text-2xl uppercase tracking-wider text-[#181818]">
              RANVIK SECURE CHECKOUT
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] text-[#626653] bg-[#E8E6E0] px-2 py-0.5 border border-[#D9D7D0] font-bold">
              256-BIT ENCRYPTED
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-[#77746D] hover:text-[#181818] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress (1 to 5) */}
        <div className="px-6 py-3.5 bg-[#F7F6F2] border-b border-[#E2E0DA] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] text-xs font-mono">
            {[
              { step: 1, label: 'Contact' },
              { step: 2, label: 'Shipping' },
              { step: 3, label: 'Delivery' },
              { step: 4, label: 'Payment' },
              { step: 5, label: 'Confirmation' },
            ].map((item, idx) => (
              <React.Fragment key={item.step}>
                <div
                  className={`flex items-center gap-2 ${
                    currentStep === item.step
                      ? 'text-[#181818] font-bold'
                      : currentStep > item.step
                      ? 'text-[#2E7D32] font-semibold'
                      : 'text-[#8C8982]'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentStep === item.step
                        ? 'bg-[#181818] text-white'
                        : currentStep > item.step
                        ? 'bg-[#2E7D32] text-white'
                        : 'bg-[#E8E6E0] text-[#77746D]'
                    }`}
                  >
                    {currentStep > item.step ? '✓' : item.step}
                  </span>
                  <span>{item.label}</span>
                </div>
                {idx < 4 && <div className="flex-1 h-px bg-[#E2E0DA] mx-3" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content: Step Views vs Order Summary Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[75vh] overflow-y-auto">
          {/* Steps Body (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {/* STEP 1: Contact Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-condensed font-bold text-2xl uppercase text-[#181818] mb-1">
                    STEP 1 — CONTACT INFORMATION
                  </h3>
                  <p className="text-xs text-[#55524B]">
                    Order dispatches, receipts, and live tracking updates will be sent here.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="karan@example.com"
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      Mobile Number (For Courier OTP Dispatch)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    <span>CONTINUE TO SHIPPING ADDRESS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Shipping Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-condensed font-bold text-2xl uppercase text-[#181818] mb-1">
                    STEP 2 — DELIVERY ADDRESS
                  </h3>
                  <p className="text-xs text-[#55524B]">
                    Enter the destination address where your RANVIK boots will be delivered.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      Street Address / House No. / Apartment
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={address.landmark || ''}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#77746D] mb-1 font-medium">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={address.pinCode}
                      onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-3 bg-[#F7F6F2] border border-[#E2E0DA] text-[#181818] hover:bg-[#EAE8E2] text-xs font-mono uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <span>PROCEED TO DELIVERY METHOD</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Delivery Method */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-condensed font-bold text-2xl uppercase text-[#181818] mb-1">
                    STEP 3 — DELIVERY METHOD
                  </h3>
                  <p className="text-xs text-[#55524B]">
                    Choose your transit speed and courier preference.
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setDeliverySpeed('standard')}
                    className={`flex items-start justify-between p-4 border rounded-xs cursor-pointer transition-colors ${
                      deliverySpeed === 'standard'
                        ? 'bg-[#F7F6F2] border-[#181818] ring-1 ring-[#181818]'
                        : 'bg-[#FFFFFF] border-[#E2E0DA] hover:border-[#181818]'
                    }`}
                  >
                    <div className="flex gap-3">
                      <Truck className="w-5 h-5 text-[#626653] mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#181818] uppercase">
                            Standard Insured Surface
                          </span>
                          <span className="text-[10px] bg-[#E8E6E0] text-[#626653] px-1.5 py-0.2 font-bold">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-xs text-[#55524B] mt-1">
                          Delivery within 3–5 business days across India. Protected with water-resistant packaging.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#181818]">
                      {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                    </span>
                  </label>

                  <label
                    onClick={() => setDeliverySpeed('express')}
                    className={`flex items-start justify-between p-4 border rounded-xs cursor-pointer transition-colors ${
                      deliverySpeed === 'express'
                        ? 'bg-[#F7F6F2] border-[#181818] ring-1 ring-[#181818]'
                        : 'bg-[#FFFFFF] border-[#E2E0DA] hover:border-[#181818]'
                    }`}
                  >
                    <div className="flex gap-3">
                      <Package className="w-5 h-5 text-[#181818] mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#181818] uppercase">
                            Express Air Priority
                          </span>
                          <span className="text-[10px] bg-[#181818] text-white px-1.5 py-0.2 font-bold">
                            FASTEST
                          </span>
                        </div>
                        <p className="text-xs text-[#55524B] mt-1">
                          Air Cargo transit. Delivered in 1–2 business days in metro cities.
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#181818]">
                      +₹199
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-3 bg-[#F7F6F2] border border-[#E2E0DA] text-[#181818] hover:bg-[#EAE8E2] text-xs font-mono uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <span>CONTINUE TO PAYMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-condensed font-bold text-2xl uppercase text-[#181818] mb-1">
                    STEP 4 — PAYMENT SELECTION
                  </h3>
                  <p className="text-xs text-[#55524B]">
                    Choose your payment method. Encrypted with 256-bit SSL security.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* UPI */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors ${
                      paymentMethod === 'upi'
                        ? 'bg-[#F7F6F2] border-[#181818] ring-1 ring-[#181818]'
                        : 'bg-[#FFFFFF] border-[#E2E0DA]'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#626653] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#181818] uppercase">
                          UPI (Google Pay, PhonePe, Paytm, BHIM)
                        </span>
                        <span className="text-[10px] text-[#2E7D32] font-mono font-bold">Instant 0% Fee</span>
                      </div>
                      {paymentMethod === 'upi' && (
                        <div className="mt-3 pt-2 border-t border-[#E2E0DA]">
                          <label className="block text-[10px] font-mono text-[#77746D] uppercase mb-1">
                            Enter UPI VPA
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#181818]"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-[#F7F6F2] border-[#181818] ring-1 ring-[#181818]'
                        : 'bg-[#FFFFFF] border-[#E2E0DA]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#626653] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#181818] uppercase">
                          Credit / Debit Card (Visa, MasterCard, RuPay)
                        </span>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="mt-3 pt-2 border-t border-[#E2E0DA] space-y-2 font-mono text-xs">
                          <input
                            type="text"
                            placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                            defaultValue="4532 8910 2341 9021"
                            className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3 py-2 text-xs"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              defaultValue="08/28"
                              className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3 py-2 text-xs"
                            />
                            <input
                              type="text"
                              placeholder="CVV"
                              defaultValue="842"
                              className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3 py-2 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#F7F6F2] border-[#181818] ring-1 ring-[#181818]'
                        : 'bg-[#FFFFFF] border-[#E2E0DA]'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#626653] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-mono font-bold text-[#181818] uppercase">
                        Net Banking (All Major Indian Banks)
                      </span>
                      {paymentMethod === 'netbanking' && (
                        <p className="text-[11px] text-[#55524B] mt-1 font-mono">
                          Supports HDFC, ICICI, SBI, Axis, Kotak, and 50+ financial institutions.
                        </p>
                      )}
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-3.5 border rounded-xs cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'bg-[#F7F6F2] border-[#181818] ring-1 ring-[#181818]'
                        : 'bg-[#FFFFFF] border-[#E2E0DA]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#626653] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-mono font-bold text-[#181818] uppercase">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-[#55524B] mt-0.5 font-mono">
                        Pay cash or scan courier QR code upon doorstep delivery.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-3 bg-[#F7F6F2] border border-[#E2E0DA] text-[#181818] hover:bg-[#EAE8E2] text-xs font-mono uppercase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    id="place-order-confirm-btn"
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <span>
                      {placingOrder
                        ? 'SECURING DISPATCH LEDGER...'
                        : `CONFIRM & PLACE ORDER (₹${finalPayableTotal.toLocaleString('en-IN')})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Order Confirmation */}
            {currentStep === 5 && createdOrder && (
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <div className="w-14 h-14 bg-[#2E7D32]/10 border border-[#2E7D32] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-condensed font-black text-3xl sm:text-4xl uppercase text-[#181818] tracking-wider mb-1">
                    ORDER CONFIRMED
                  </h3>
                  <p className="text-xs font-mono text-[#55524B]">
                    ORDER ID: <strong className="text-[#181818]">{createdOrder.orderNumber}</strong>
                  </p>
                </div>

                <div className="bg-[#F7F6F2] border border-[#E2E0DA] p-4 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-[#55524B]">
                    <span>Dispatch Date:</span>
                    <span className="text-[#181818] font-medium">{createdOrder.date}</span>
                  </div>
                  <div className="flex justify-between text-[#55524B]">
                    <span>Expected Arrival:</span>
                    <span className="text-[#181818] font-bold">{createdOrder.estimatedDelivery}</span>
                  </div>
                  <div className="flex justify-between text-[#55524B]">
                    <span>Destination:</span>
                    <span className="text-[#181818] text-right truncate max-w-[220px]">
                      {createdOrder.shippingAddress.city}, {createdOrder.shippingAddress.pinCode}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#55524B]">
                    <span>Payment Method:</span>
                    <span className="text-[#181818] uppercase font-medium">{createdOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[#55524B]">
                    <span>Tracking Number:</span>
                    <span className="text-[#181818] font-bold">{createdOrder.trackingNumber}</span>
                  </div>
                </div>

                {/* Track Order CTA */}
                <div className="space-y-3 pt-2">
                  <button
                    id="track-order-btn"
                    onClick={handleTrackCreatedOrder}
                    className="w-full py-4 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-[0.2em] transition-colors shadow-md"
                  >
                    TRACK ORDER STATUS & TIMELINE
                  </button>

                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-mono uppercase text-[#77746D] hover:text-[#181818]"
                  >
                    Back to Store
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar (5 Cols) */}
          <div className="lg:col-span-5 bg-[#F7F6F2] p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-[#E2E0DA] flex flex-col justify-between">
            <div>
              <h4 className="font-condensed font-bold text-lg uppercase text-[#181818] tracking-wider pb-3 mb-4 border-b border-[#E2E0DA]">
                ORDER SUMMARY ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h4>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover bg-[#FFFFFF] border border-[#E2E0DA] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-condensed font-bold text-sm text-[#181818] uppercase truncate">
                        {item.product.name}
                      </p>
                      <p className="font-mono text-[10px] text-[#77746D]">
                        UK {item.size} • Qty {item.quantity}
                      </p>
                      <p className="font-mono text-xs text-[#181818] font-bold mt-0.5">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="mt-6 pt-4 border-t border-[#E2E0DA] space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#55524B]">
                  <span>Subtotal</span>
                  <span className="text-[#181818]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-[#2E7D32]">
                    <span>Discount</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#55524B]">
                  <span>Delivery Dispatch</span>
                  <span>
                    {cartShipping === 0 ? (
                      <span className="text-[#2E7D32] font-bold">FREE</span>
                    ) : (
                      `₹${cartShipping}`
                    )}
                  </span>
                </div>

                {deliverySpeed === 'express' && (
                  <div className="flex justify-between text-[#55524B]">
                    <span>Express Air Priority</span>
                    <span className="text-[#181818] font-medium">+₹199</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-[#181818] pt-3 border-t border-[#E2E0DA]">
                  <span>Total Payable</span>
                  <span className="text-lg text-[#181818] font-mono">
                    ₹{finalPayableTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E2E0DA] text-[10px] font-mono text-[#77746D] space-y-1">
              <div className="flex items-center gap-1.5 text-[#626653] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% SECURE CHECKOUT</span>
              </div>
              <p>Direct Indian banking reconciliation via PCI-DSS compliant infrastructure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
