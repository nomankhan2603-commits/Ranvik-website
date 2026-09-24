import React, { useState } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Truck,
  Shield,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Address } from '../types';

export const AccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    user,
    isLoggedIn,
    loginUser,
    logoutUser,
    orders,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    setIsOrderTrackingOpen,
    setTrackingOrder,
    setIsWishlistOpen,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'auth'>('orders');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Auth inputs
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Address inputs
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPinCode, setNewPinCode] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!isAccountOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'forgot') {
      showToast(`Password reset link dispatched to ${emailInput}`, 'info');
      setAuthMode('login');
      return;
    }
    if (!emailInput.trim()) {
      showToast('Please provide an email address', 'alert');
      return;
    }
    loginUser(emailInput.trim(), nameInput.trim());
    setActiveTab('orders');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStreet || !newCity || !newPinCode) {
      showToast('Please fill out the required address fields', 'alert');
      return;
    }
    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      fullName: newFullName,
      street: newStreet,
      landmark: newLandmark,
      city: newCity,
      state: newState || 'Delhi',
      pinCode: newPinCode,
      phone: newPhone || user?.phone || '+91 98765 43210',
      isDefault: (user?.addresses.length || 0) === 0,
    };
    saveAddress(newAddr);
    setShowAddressForm(false);
    setNewFullName('');
    setNewStreet('');
    setNewLandmark('');
    setNewCity('');
    setNewState('');
    setNewPinCode('');
    setNewPhone('');
  };

  const handleTrackOrder = (order: typeof orders[0]) => {
    setTrackingOrder(order);
    setIsAccountOpen(false);
    setIsOrderTrackingOpen(true);
  };

  return (
    <div
      id="account-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#E2E0DA] shadow-2xl overflow-hidden my-auto text-[#181818] rounded-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E0DA] bg-[#F7F6F2]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#181818]" />
            <h3 className="font-condensed font-black text-2xl uppercase tracking-wider text-[#181818]">
              {isLoggedIn ? `MEMBER: ${user?.name.toUpperCase()}` : 'CUSTOMER PORTAL'}
            </h3>
          </div>
          <button
            onClick={() => setIsAccountOpen(false)}
            className="p-2 text-[#77746D] hover:text-[#181818]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (When logged in) */}
        {isLoggedIn ? (
          <div className="flex border-b border-[#E2E0DA] bg-[#F7F6F2] font-mono text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-[#181818] text-[#181818] bg-[#FFFFFF] font-bold'
                  : 'border-transparent text-[#77746D] hover:text-[#181818]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>ORDERS ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'addresses'
                  ? 'border-[#181818] text-[#181818] bg-[#FFFFFF] font-bold'
                  : 'border-transparent text-[#77746D] hover:text-[#181818]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>SAVED ADDRESSES</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[#181818] text-[#181818] bg-[#FFFFFF] font-bold'
                  : 'border-transparent text-[#77746D] hover:text-[#181818]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>PROFILE</span>
            </button>

            <button
              onClick={() => {
                setIsAccountOpen(false);
                setIsWishlistOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 border-b-2 border-transparent text-[#77746D] hover:text-[#181818] whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 text-[#B83A2A]" />
              <span>WISHLIST</span>
            </button>

            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 px-4 py-3 ml-auto text-xs text-[#77746D] hover:text-[#B83A2A] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SIGN OUT</span>
            </button>
          </div>
        ) : null}

        {/* Tab Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {!isLoggedIn ? (
            /* Auth Forms: Login / Sign Up / Forgot Password */
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <Shield className="w-10 h-10 text-[#626653] mx-auto mb-2" />
                <h4 className="font-condensed font-black text-3xl uppercase text-[#181818] tracking-wide">
                  {authMode === 'login'
                    ? 'SIGN IN TO RANVIK'
                    : authMode === 'signup'
                    ? 'CREATE AN ACCOUNT'
                    : 'RESET PASSWORD'}
                </h4>
                <p className="text-xs text-[#55524B] mt-1">
                  Access your order history, delivery routes, and tracking.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4 font-mono text-xs">
                {authMode === 'signup' && (
                  <div>
                    <label className="block uppercase text-[#77746D] mb-1 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Vikram Sharma"
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 focus:outline-none focus:border-[#181818]"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block uppercase text-[#77746D] mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="vikram@example.com"
                    className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 focus:outline-none focus:border-[#181818]"
                    required
                  />
                </div>

                {authMode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="uppercase text-[#77746D] font-medium">Password</label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot')}
                          className="text-[10px] text-[#77746D] hover:text-[#181818] underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] px-3.5 py-2.5 focus:outline-none focus:border-[#181818]"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#181818] hover:bg-[#2A2A2A] text-white font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  {authMode === 'login'
                    ? 'SIGN IN'
                    : authMode === 'signup'
                    ? 'CREATE ACCOUNT'
                    : 'SEND RESET LINK'}
                </button>
              </form>

              <div className="text-center text-xs font-mono text-[#77746D] pt-2">
                {authMode === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="text-[#181818] underline font-bold"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already registered?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className="text-[#181818] underline font-bold"
                    >
                      Log In
                    </button>
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Logged In Content */
            <div>
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase text-[#77746D] font-medium">
                      PAST ORDERS
                    </span>
                    <span className="text-xs font-mono text-[#626653] font-bold">
                      {orders.length} Active Orders
                    </span>
                  </div>

                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-[#FFFFFF] border border-[#E2E0DA] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1 font-mono text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#181818] text-sm">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[10px] bg-[#E8E6E0] text-[#626653] border border-[#D9D7D0] px-2 py-0.5 uppercase font-bold">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[#55524B]">
                            Placed on {order.date} • {order.items.length} item(s) • Total: ₹
                            {order.total.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[11px] text-[#77746D]">
                            AWB: {order.trackingNumber} • Est: {order.estimatedDelivery}
                          </p>
                        </div>

                        <button
                          onClick={() => handleTrackOrder(order)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>TRACK ORDER</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-[#77746D] font-mono text-xs">
                      No active orders found.
                    </div>
                  )}
                </div>
              )}

              {/* SAVED ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase text-[#77746D] font-medium">
                      DELIVERY ADDRESSES
                    </span>
                    {!showAddressForm && (
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] text-xs font-mono text-white hover:bg-[#2A2A2A] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD NEW ADDRESS</span>
                      </button>
                    )}
                  </div>

                  {/* Add Address Form */}
                  {showAddressForm && (
                    <form
                      onSubmit={handleSaveAddress}
                      className="bg-[#F7F6F2] border border-[#E2E0DA] p-5 space-y-3 font-mono text-xs"
                    >
                      <h4 className="text-[#181818] font-bold uppercase mb-2">
                        Add New Delivery Address
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Recipient Full Name *"
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-2.5 focus:outline-none focus:border-[#181818]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Phone Number *"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-2.5 focus:outline-none focus:border-[#181818]"
                        />
                        <input
                          type="text"
                          placeholder="Street Address, House No *"
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          className="sm:col-span-2 bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-2.5 focus:outline-none focus:border-[#181818]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Landmark (Optional)"
                          value={newLandmark}
                          onChange={(e) => setNewLandmark(e.target.value)}
                          className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-2.5 focus:outline-none focus:border-[#181818]"
                        />
                        <input
                          type="text"
                          placeholder="City *"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-2.5 focus:outline-none focus:border-[#181818]"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State *"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-2.5 focus:outline-none focus:border-[#181818]"
                        />
                        <input
                          type="text"
                          placeholder="PIN Code *"
                          value={newPinCode}
                          onChange={(e) => setNewPinCode(e.target.value)}
                          className="bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] p-2.5 focus:outline-none focus:border-[#181818]"
                          required
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white font-bold uppercase"
                        >
                          SAVE ADDRESS
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2.5 bg-[#E8E6E0] text-[#181818] hover:bg-[#D9D7D0] uppercase"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* List of Addresses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 border rounded-xs font-mono text-xs flex flex-col justify-between ${
                          addr.isDefault
                            ? 'bg-[#F7F6F2] border-[#181818]'
                            : 'bg-[#FFFFFF] border-[#E2E0DA]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#181818] font-bold">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-[#181818] text-white px-1.5 py-0.2 uppercase font-bold">
                                DEFAULT
                              </span>
                            )}
                          </div>
                          <p className="text-[#55524B] leading-relaxed">
                            {addr.street}
                            {addr.landmark ? `, ${addr.landmark}` : ''}
                            <br />
                            {addr.city}, {addr.state} - {addr.pinCode}
                          </p>
                          <p className="text-[#77746D] mt-2">Ph: {addr.phone}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#E2E0DA]">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[#77746D] hover:text-[#181818] text-[11px] font-bold"
                            >
                              Make Default
                            </button>
                          ) : (
                            <span className="text-[#2E7D32] text-[10px] font-bold">Default Delivery Address</span>
                          )}

                          {user.addresses.length > 1 && (
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              className="text-[#8C8982] hover:text-[#B83A2A]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6 max-w-lg font-mono text-xs">
                  <div className="p-4 bg-[#F7F6F2] border border-[#E2E0DA] space-y-3">
                    <div>
                      <span className="text-[#77746D] block text-[10px] uppercase font-medium">
                        FULL NAME
                      </span>
                      <span className="text-[#181818] text-sm font-bold">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-[#77746D] block text-[10px] uppercase font-medium">
                        EMAIL ADDRESS
                      </span>
                      <span className="text-[#181818]">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-[#77746D] block text-[10px] uppercase font-medium">
                        MOBILE PHONE
                      </span>
                      <span className="text-[#181818]">{user?.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#77746D] block text-[10px] uppercase font-medium">
                        ACCOUNT STATUS
                      </span>
                      <span className="text-[#2E7D32] font-bold">Verified Member</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
