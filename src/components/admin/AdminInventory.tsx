import React, { useState, useEffect } from 'react';
import {
  Boxes,
  History,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  MinusCircle,
  X,
  FileText,
  RotateCw,
} from 'lucide-react';
import { inventoryService } from '../../services/inventory';
import { productsService, ProductWithDetails } from '../../services/products';
import { DBProductVariant, DBInventoryTransaction, InventoryReason } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminInventory: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useAdmin();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [transactions, setTransactions] = useState<DBInventoryTransaction[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'variants' | 'history'>('variants');
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Adjust modal state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<{
    variant: DBProductVariant;
    productName: string;
  } | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState<InventoryReason>('purchase');
  const [adjustmentRef, setAdjustmentRef] = useState('');

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, txs] = await Promise.all([
        productsService.getAll(false),
        inventoryService.getTransactions(),
      ]);
      setProducts(prods);
      setTransactions(txs);
    } catch (e) {
      console.error('Failed to load inventory data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Flatten variants with product names
  const allVariants = products.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productName: p.name,
      productSlug: p.slug,
      availableStock: Math.max(0, v.stockQuantity - v.reservedQuantity),
    }))
  );

  const filteredVariants = allVariants.filter((v) => {
    const matchesSearch =
      v.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = sizeFilter === 'all' || v.size.toString() === sizeFilter;
    let matchesStock = true;
    if (stockStatusFilter === 'out_of_stock') {
      matchesStock = v.availableStock === 0;
    } else if (stockStatusFilter === 'low_stock') {
      matchesStock = v.availableStock > 0 && v.availableStock <= v.lowStockThreshold;
    } else if (stockStatusFilter === 'in_stock') {
      matchesStock = v.availableStock > v.lowStockThreshold;
    }
    return matchesSearch && matchesSize && matchesStock;
  });

  const handleOpenAdjust = (v: DBProductVariant, productName: string) => {
    setSelectedVariant({ variant: v, productName });
    setAdjustmentQuantity(v.stockQuantity);
    setAdjustmentReason('purchase');
    setAdjustmentRef(`PO-AGRA-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;

    if (adjustmentQuantity < 0) {
      alert('Stock count cannot be negative.');
      return;
    }

    const res = await inventoryService.adjustStock({
      variantId: selectedVariant.variant.id,
      newQuantity: adjustmentQuantity,
      reason: adjustmentReason,
      referenceId: adjustmentRef,
      createdBy: 'Admin Command',
    });

    if (res.success) {
      setIsAdjustModalOpen(false);
      triggerRefresh();
      loadData();
    } else {
      alert(res.error || 'Failed to update stock');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            INVENTORY & CONCURRENCY CONTROLLER
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Real PostgreSQL variant tables • Safe transactional stock commits & deductions
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2 bg-[#16181E] border border-[#2B2E38] p-1 rounded-xs">
          <button
            onClick={() => setActiveSubTab('variants')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-xs flex items-center gap-1.5 ${
              activeSubTab === 'variants'
                ? 'bg-[#B83A2A] text-white'
                : 'text-[#8C92A4] hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>SIZE VARIANTS</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-xs flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-[#B83A2A] text-white'
                : 'text-[#8C92A4] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>AUDIT TRAIL ({transactions.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'variants' ? (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C92A4] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search variant SKU or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#16181E] border border-[#2B2E38] text-white pl-9 pr-3 py-2.5 text-xs font-mono rounded-xs focus:border-[#B83A2A] focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="bg-[#16181E] border border-[#2B2E38] text-white px-3 py-2.5 text-xs font-mono rounded-xs focus:outline-hidden"
              >
                <option value="all">ALL SIZES</option>
                {[6, 7, 8, 9, 10, 11].map((s) => (
                  <option key={s} value={s.toString()}>
                    SIZE UK {s}
                  </option>
                ))}
              </select>

              <select
                value={stockStatusFilter}
                onChange={(e: any) => setStockStatusFilter(e.target.value)}
                className="bg-[#16181E] border border-[#2B2E38] text-white px-3 py-2.5 text-xs font-mono rounded-xs focus:outline-hidden"
              >
                <option value="all">ALL STOCK LEVELS</option>
                <option value="in_stock">IN STOCK</option>
                <option value="low_stock">LOW STOCK (≤5)</option>
                <option value="out_of_stock">OUT OF STOCK (0)</option>
              </select>
            </div>
          </div>

          {/* Variants Table */}
          <div className="bg-[#16181E] border border-[#2B2E38] rounded-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2B2E38] bg-[#121418] text-[#8C92A4] text-[10px] uppercase">
                    <th className="p-3.5 font-normal">PRODUCT & SKU</th>
                    <th className="p-3.5 font-normal">SIZE</th>
                    <th className="p-3.5 font-normal">CURRENT STOCK</th>
                    <th className="p-3.5 font-normal">RESERVED</th>
                    <th className="p-3.5 font-normal">AVAILABLE</th>
                    <th className="p-3.5 font-normal">THRESHOLD</th>
                    <th className="p-3.5 font-normal">STATUS</th>
                    <th className="p-3.5 font-normal text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#22252E]">
                  {filteredVariants.map((v) => {
                    const status = inventoryService.getVariantStatus(v);
                    return (
                      <tr key={v.id} className="hover:bg-[#1C1F26] transition-colors">
                        <td className="p-3.5">
                          <span className="font-bold text-white block">{v.productName}</span>
                          <span className="text-[10px] text-[#8C92A4]">{v.sku}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="inline-block px-2 py-1 bg-[#242731] text-white font-bold rounded-xs">
                            UK {v.size}
                          </span>
                        </td>
                        <td className="p-3.5 text-white font-bold">{v.stockQuantity}</td>
                        <td className="p-3.5 text-[#8C92A4]">{v.reservedQuantity}</td>
                        <td className="p-3.5 font-bold text-[#E04D39]">{v.availableStock}</td>
                        <td className="p-3.5 text-[#8C92A4]">≤ {v.lowStockThreshold}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-xs ${
                              status === 'In Stock'
                                ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40'
                                : status === 'Low Stock'
                                ? 'bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40'
                                : 'bg-[#B83A2A]/20 text-[#F87171] border border-[#B83A2A]/40'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenAdjust(v, v.productName)}
                            className="px-3 py-1.5 bg-[#242731] hover:bg-[#B83A2A] text-white text-[10px] rounded-xs transition-colors font-bold uppercase"
                          >
                            ADJUST STOCK
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Inventory History Audit Trail */
        <div className="bg-[#16181E] border border-[#2B2E38] rounded-xs overflow-hidden">
          <div className="p-4 border-b border-[#2B2E38] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white">
              IMMUTABLE AUDIT LOG — TRANSACTION LEDGER
            </span>
            <span className="text-[10px] font-mono text-[#8C92A4]">
              Showing last {transactions.length} entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2B2E38] bg-[#121418] text-[#8C92A4] text-[10px] uppercase">
                  <th className="p-3.5 font-normal">TIMESTAMP</th>
                  <th className="p-3.5 font-normal">ITEM & SKU</th>
                  <th className="p-3.5 font-normal">REASON</th>
                  <th className="p-3.5 font-normal">BEFORE</th>
                  <th className="p-3.5 font-normal">CHANGE</th>
                  <th className="p-3.5 font-normal">AFTER</th>
                  <th className="p-3.5 font-normal">REFERENCE</th>
                  <th className="p-3.5 font-normal">USER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22252E]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#1C1F26] transition-colors">
                    <td className="p-3.5 text-[#8C92A4] whitespace-nowrap">
                      {new Date(tx.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="p-3.5">
                      <span className="text-white font-bold block">{tx.productName || 'Boot Variant'}</span>
                      <span className="text-[10px] text-[#8C92A4]">
                        {tx.sku} {tx.size ? `(UK ${tx.size})` : ''}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-[#242731] text-[#CBD5E1] text-[9px] uppercase font-bold rounded-xs">
                        {tx.reason.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#8C92A4]">{tx.quantityBefore}</td>
                    <td className="p-3.5 font-bold">
                      <span
                        className={
                          tx.quantityChange > 0
                            ? 'text-[#10B981]'
                            : tx.quantityChange < 0
                            ? 'text-[#EF4444]'
                            : 'text-[#8C92A4]'
                        }
                      >
                        {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange}
                      </span>
                    </td>
                    <td className="p-3.5 text-white font-bold">{tx.quantityAfter}</td>
                    <td className="p-3.5 text-[#8C92A4]">{tx.referenceId || '—'}</td>
                    <td className="p-3.5 text-[#8C92A4]">{tx.createdBy || 'System'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedVariant && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#16181E] border border-[#2B2E38] w-full max-w-md p-6 rounded-xs shadow-2xl relative">
            <button
              onClick={() => setIsAdjustModalOpen(false)}
              className="absolute top-4 right-4 text-[#8C92A4] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-condensed font-black text-2xl uppercase tracking-wider text-white mb-1">
              ADJUST INVENTORY
            </h2>
            <p className="text-xs font-mono text-[#8C92A4] mb-4">
              {selectedVariant.productName} • UK {selectedVariant.variant.size} ({selectedVariant.variant.sku})
            </p>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div className="bg-[#111317] border border-[#22252E] p-3 rounded-xs flex justify-between items-center text-xs font-mono">
                <span className="text-[#8C92A4]">CURRENT RECORDED STOCK:</span>
                <span className="font-bold text-white text-base">
                  {selectedVariant.variant.stockQuantity} units
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  NEW EXACT ON-HAND QUANTITY
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-sm font-mono focus:border-[#B83A2A] focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  ADJUSTMENT REASON (AUDIT COMPLIANCE)
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e: any) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                >
                  <option value="purchase">Purchase / Factory Stock In (Agra)</option>
                  <option value="manual_adjustment">Manual Cycle Count Adjustment</option>
                  <option value="damage">Damaged / Defective Discard</option>
                  <option value="return">Customer Return Restock</option>
                  <option value="stock_correction">Audit Reconciliation</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  REFERENCE NUMBER / PO
                </label>
                <input
                  type="text"
                  value={adjustmentRef}
                  onChange={(e) => setAdjustmentRef(e.target.value)}
                  placeholder="e.g. PO-AGRA-8819"
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2B2E38]">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 bg-[#242731] hover:bg-[#323644] text-white text-xs font-mono rounded-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B83A2A] hover:bg-[#A33324] text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xs shadow-lg"
                >
                  COMMIT TO LEDGER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
