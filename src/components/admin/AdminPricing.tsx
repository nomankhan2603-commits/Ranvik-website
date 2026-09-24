import React, { useState, useEffect } from 'react';
import { Tag, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { productsService, ProductWithDetails } from '../../services/products';
import { useAdmin } from './AdminContext';

export const AdminPricing: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useAdmin();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceEdits, setPriceEdits] = useState<Record<string, { mrp: number; sellingPrice: number }>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productsService.getAll(false);
      setProducts(data);
      const edits: Record<string, { mrp: number; sellingPrice: number }> = {};
      data.forEach((p) => {
        edits[p.id] = { mrp: p.mrp, sellingPrice: p.sellingPrice };
      });
      setPriceEdits(edits);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id: string, field: 'mrp' | 'sellingPrice', val: number) => {
    setPriceEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: val,
      },
    }));
  };

  const handleSavePrice = async (p: ProductWithDetails) => {
    const edit = priceEdits[p.id];
    if (!edit) return;

    if (edit.sellingPrice > edit.mrp) {
      alert(`Validation error: Selling price (₹${edit.sellingPrice}) cannot exceed MRP (₹${edit.mrp}) for ${p.name}.`);
      return;
    }

    if (edit.sellingPrice < 500) {
      alert('Selling price cannot be lower than minimum footwear threshold ₹500.');
      return;
    }

    try {
      await productsService.upsert({
        ...p,
        mrp: edit.mrp,
        sellingPrice: edit.sellingPrice,
      });
      setSaveSuccess(p.id);
      setTimeout(() => setSaveSuccess(null), 2500);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update product pricing');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            PRICING MATRIX & MARGIN CONTROLLER
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Maintain MRP, actual storefront offer prices, and promotional discount percentages
          </p>
        </div>
      </div>

      <div className="bg-[#16181E] border border-[#2B2E38] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2B2E38] bg-[#121418] text-[#8C92A4] text-[10px] uppercase">
                <th className="p-3.5 font-normal">FOOTWEAR SILHOUETTE</th>
                <th className="p-3.5 font-normal">SKU</th>
                <th className="p-3.5 font-normal">MAXIMUM RETAIL (MRP)</th>
                <th className="p-3.5 font-normal">OFFER SELLING PRICE</th>
                <th className="p-3.5 font-normal">CALCULATED SAVINGS</th>
                <th className="p-3.5 font-normal text-right">SYNC ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22252E]">
              {products.map((p) => {
                const currentEdit = priceEdits[p.id] || { mrp: p.mrp, sellingPrice: p.sellingPrice };
                const discountPct =
                  currentEdit.mrp > 0
                    ? Math.round(((currentEdit.mrp - currentEdit.sellingPrice) / currentEdit.mrp) * 100)
                    : 0;
                const isInvalid = currentEdit.sellingPrice > currentEdit.mrp;

                return (
                  <tr key={p.id} className="hover:bg-[#1C1F26] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]?.publicUrl || '/assets/boot1.png'}
                          alt=""
                          className="w-10 h-10 object-contain bg-[#0E0F12] border border-[#2B2E38] p-1 rounded-xs"
                        />
                        <span className="font-bold text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#8C92A4]">{p.sku}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[#8C92A4]">₹</span>
                        <input
                          type="number"
                          value={currentEdit.mrp}
                          onChange={(e) => handlePriceChange(p.id, 'mrp', Number(e.target.value))}
                          className="w-24 bg-[#0E0F12] border border-[#2B2E38] text-white px-2 py-1 text-xs rounded-xs focus:outline-hidden"
                        />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[#8C92A4]">₹</span>
                        <input
                          type="number"
                          value={currentEdit.sellingPrice}
                          onChange={(e) =>
                            handlePriceChange(p.id, 'sellingPrice', Number(e.target.value))
                          }
                          className={`w-24 bg-[#0E0F12] border px-2 py-1 text-xs rounded-xs focus:outline-hidden font-bold ${
                            isInvalid
                              ? 'border-[#B83A2A] text-[#FF8A7A]'
                              : 'border-[#2B2E38] text-white'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="p-3.5">
                      {isInvalid ? (
                        <span className="text-[#B83A2A] text-[10px] font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> SELLING &gt; MRP
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 rounded-xs text-[10px] font-bold">
                          {discountPct}% OFF (SAVE ₹{currentEdit.mrp - currentEdit.sellingPrice})
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleSavePrice(p)}
                        disabled={isInvalid}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-xs transition-colors flex items-center gap-1 ml-auto ${
                          saveSuccess === p.id
                            ? 'bg-[#10B981] text-white'
                            : isInvalid
                            ? 'bg-[#242731] text-[#5A6072] cursor-not-allowed'
                            : 'bg-[#B83A2A] hover:bg-[#A33324] text-white cursor-pointer'
                        }`}
                      >
                        {saveSuccess === p.id ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>SAVED</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3" />
                            <span>UPDATE</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
