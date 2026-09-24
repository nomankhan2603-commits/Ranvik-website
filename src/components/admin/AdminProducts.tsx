import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Package,
  Edit2,
  Archive,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { productsService, ProductWithDetails } from '../../services/products';
import { categoriesService } from '../../services/categories';
import { DBCategory, DBProduct } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminProducts: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useAdmin();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mrp, setMrp] = useState<number>(4499);
  const [sellingPrice, setSellingPrice] = useState<number>(2499);
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/products/ranger-x1.jpg');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [sizeStock, setSizeStock] = useState<Record<number, number>>({
    6: 10,
    7: 15,
    8: 25,
    9: 30,
    10: 20,
    11: 8,
  });

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productsService.getAll(true),
        categoriesService.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setSku(`RVK-TAC-${Math.floor(100 + Math.random() * 900)}`);
    setCategoryId(categories[0]?.id || 'cat-tactical');
    setMrp(4499);
    setSellingPrice(2499);
    setShortDesc('Full-grain tactical leather combat boot with lug outsole.');
    setDescription('Engineered for heavy duty endurance, all terrain traction, and high comfort.');
    setImageUrl('/assets/boot1.png');
    setStatus('active');
    setSizeStock({ 6: 10, 7: 15, 8: 25, 9: 30, 10: 20, 11: 8 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductWithDetails) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(p.categoryId);
    setMrp(p.mrp);
    setSellingPrice(p.sellingPrice);
    setShortDesc(p.shortDescription);
    setDescription(p.description);
    setImageUrl(p.images[0]?.publicUrl || '/assets/boot1.png');
    setStatus(p.status);

    const stocks: Record<number, number> = {};
    p.variants.forEach((v) => {
      stocks[v.size] = v.stockQuantity;
    });
    setSizeStock({
      6: stocks[6] ?? 10,
      7: stocks[7] ?? 15,
      8: stocks[8] ?? 20,
      9: stocks[9] ?? 25,
      10: stocks[10] ?? 15,
      11: stocks[11] ?? 5,
    });

    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sellingPrice > mrp) {
      alert('Selling Price cannot exceed MRP.');
      return;
    }

    try {
      await productsService.upsert({
        id: editingProduct?.id,
        name,
        sku,
        categoryId,
        mrp,
        sellingPrice,
        shortDescription: shortDesc,
        description,
        status,
      });

      setIsModalOpen(false);
      triggerRefresh();
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    }
  };

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive this boot from active inventory?')) {
      await productsService.archive(id);
      triggerRefresh();
      loadData();
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            PRODUCT CATALOG MANAGEMENT
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Maintain footwear profiles, sizes (UK 6–11), and Supabase records
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B83A2A] hover:bg-[#A33324] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NEW PRODUCT</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C92A4] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search boot name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16181E] border border-[#2B2E38] text-white pl-9 pr-3 py-2.5 text-xs font-mono rounded-xs focus:border-[#B83A2A] focus:outline-hidden"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="bg-[#16181E] border border-[#2B2E38] text-white px-3 py-2.5 text-xs font-mono rounded-xs focus:outline-hidden"
          >
            <option value="all">ALL STATUSES</option>
            <option value="active">ACTIVE</option>
            <option value="archived">ARCHIVED</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#16181E] border border-[#2B2E38] text-white px-3 py-2.5 text-xs font-mono rounded-xs focus:outline-hidden"
          >
            <option value="all">ALL CATEGORIES</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#16181E] border border-[#2B2E38] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2B2E38] bg-[#121418] text-[#8C92A4] text-[10px] uppercase">
                <th className="p-3.5 font-normal">BOOT / SKU</th>
                <th className="p-3.5 font-normal">CATEGORY</th>
                <th className="p-3.5 font-normal">MRP / SELLING</th>
                <th className="p-3.5 font-normal">SIZES (6–11)</th>
                <th className="p-3.5 font-normal">STATUS</th>
                <th className="p-3.5 font-normal text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22252E]">
              {filtered.map((p) => {
                const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
                const primaryImage = p.images[0]?.publicUrl || '/assets/boot1.png';

                return (
                  <tr key={p.id} className="hover:bg-[#1C1F26] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImage}
                          alt={p.name}
                          className="w-12 h-12 object-contain bg-[#0E0F12] border border-[#2B2E38] p-1 rounded-xs"
                        />
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-[10px] text-[#8C92A4]">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#CBD5E1]">
                      {p.categoryName || 'Tactical'}
                    </td>
                    <td className="p-3.5">
                      <span className="text-white font-bold">
                        ₹{p.sellingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#8C92A4] line-through ml-2">
                        ₹{p.mrp.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {p.variants.map((v) => (
                          <span
                            key={v.size}
                            title={`${v.stockQuantity} in stock`}
                            className={`px-1.5 py-0.5 text-[9px] font-bold rounded-xs border ${
                              v.stockQuantity === 0
                                ? 'bg-[#B83A2A]/10 text-[#FF8A7A] border-[#B83A2A]/30'
                                : v.stockQuantity <= 5
                                ? 'bg-[#F59E0B]/10 text-[#FCD34D] border-[#F59E0B]/30'
                                : 'bg-[#121418] text-[#A0A6B8] border-[#2B2E38]'
                            }`}
                          >
                            {v.size}:{v.stockQuantity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-xs ${
                          p.status === 'active'
                            ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40'
                            : 'bg-[#6B7280]/20 text-[#9CA3AF] border border-[#6B7280]/40'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-[#242731] hover:bg-[#323644] text-white rounded-xs transition-colors"
                        title="Edit Boot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {p.status === 'active' && (
                        <button
                          onClick={() => handleArchive(p.id)}
                          className="p-1.5 bg-[#242731] hover:bg-[#B83A2A] text-white rounded-xs transition-colors"
                          title="Archive Boot"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#16181E] border border-[#2B2E38] w-full max-w-2xl p-6 rounded-xs shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#8C92A4] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-condensed font-black text-2xl uppercase tracking-wider text-white mb-1">
              {editingProduct ? 'EDIT FOOTWEAR PROFILE' : 'REGISTER NEW FOOTWEAR SILHOUETTE'}
            </h2>
            <p className="text-xs font-mono text-[#8C92A4] mb-6">
              Database synchronization with variant matrix UK 6–11
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    BOOT NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:border-[#B83A2A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    SKU CODE
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:border-[#B83A2A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    SELLING PRICE (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  SHORT SPECIFICATION SUMMARY
                </label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  TACTICAL LEATHER & SOLE DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  STATUS
                </label>
                <div className="flex gap-4">
                  {(['active', 'draft', 'archived'] as const).map((st) => (
                    <label key={st} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="prod_status"
                        checked={status === st}
                        onChange={() => setStatus(st)}
                        className="accent-[#B83A2A]"
                      />
                      <span className="text-xs font-mono uppercase text-white">{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2B2E38]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#242731] hover:bg-[#323644] text-white text-xs font-mono rounded-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B83A2A] hover:bg-[#A33324] text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xs shadow-lg"
                >
                  SAVE & SYNC DATABASE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
