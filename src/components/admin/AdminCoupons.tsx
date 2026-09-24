import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Edit2, X, CheckCircle } from 'lucide-react';
import { couponsService } from '../../services/coupons';
import { Coupon } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminCoupons: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useAdmin();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(300);
  const [minOrderValue, setMinOrderValue] = useState<number>(2000);
  const [maximumDiscount, setMaximumDiscount] = useState<number>(500);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCoupons();
  }, [refreshTrigger]);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const list = await couponsService.getAll();
      setCoupons(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setCode('');
    setDiscountType('fixed');
    setDiscountValue(300);
    setMinOrderValue(2000);
    setMaximumDiscount(500);
    setUsageLimit(500);
    setDescription('Flat ₹300 OFF on combat boots.');
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      await couponsService.upsert({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue,
        fixedDiscount: discountType === 'fixed' ? discountValue : undefined,
        discountPercent: discountType === 'percentage' ? discountValue : undefined,
        minOrderValue,
        maximumDiscount: discountType === 'percentage' ? maximumDiscount : undefined,
        usageLimit,
        usedCount: 0,
        description,
        status: 'active',
      });
      setIsModalOpen(false);
      triggerRefresh();
      loadCoupons();
    } catch (err) {
      console.error(err);
      alert('Failed to save coupon');
    }
  };

  const handleDelete = async (couponCode: string) => {
    if (confirm(`Delete coupon code ${couponCode}?`)) {
      await couponsService.delete(couponCode);
      triggerRefresh();
      loadCoupons();
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            PROMOTIONAL COUPONS & CODES
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Configure tactical checkout discounts, minimum thresholds & usage caps
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B83A2A] hover:bg-[#A33324] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NEW COUPON</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="bg-[#16181E] border border-[#2B2E38] p-5 rounded-xs space-y-3 relative group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-lg font-black text-white tracking-wider block">
                  {c.code}
                </span>
                <span className="text-[10px] font-mono text-[#10B981] font-bold">
                  {c.discountType === 'percentage' || c.discountPercent
                    ? `${c.discountValue || c.discountPercent}% OFF`
                    : `FLAT ₹${c.discountValue || c.fixedDiscount} OFF`}
                </span>
              </div>
              <button
                onClick={() => handleDelete(c.code)}
                className="text-[#8C92A4] hover:text-[#B83A2A] p-1 transition-colors"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#8C92A4]">{c.description}</p>

            <div className="pt-3 border-t border-[#2B2E38] grid grid-cols-2 gap-2 text-[10px] font-mono text-[#A0A6B8]">
              <div>
                <span className="text-[#5A6072] block">MIN ORDER</span>
                <span className="text-white font-bold">₹{c.minOrderValue}</span>
              </div>
              <div>
                <span className="text-[#5A6072] block">STATUS</span>
                <span className="text-[#10B981] font-bold uppercase">{c.status || 'ACTIVE'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#16181E] border border-[#2B2E38] w-full max-w-md p-6 rounded-xs shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#8C92A4] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-condensed font-black text-2xl uppercase tracking-wider text-white mb-1">
              CREATE PROMO CODE
            </h2>
            <p className="text-xs font-mono text-[#8C92A4] mb-4">
              Stored in Supabase `coupons` table
            </p>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  COUPON CODE (UPPERCASE)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. COMMANDO20"
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:border-[#B83A2A] focus:outline-hidden font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    DISCOUNT TYPE
                  </label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                  >
                    <option value="fixed">Flat Fixed (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    DISCOUNT VALUE ({discountType === 'percentage' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    MIN ORDER VALUE (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    USAGE LIMIT
                  </label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  CUSTOMER DESCRIPTION
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10% OFF for orders above ₹2,500."
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2B2E38]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#242731] hover:bg-[#323644] text-white text-xs font-mono rounded-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B83A2A] hover:bg-[#A33324] text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xs shadow-lg"
                >
                  SAVE COUPON
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
