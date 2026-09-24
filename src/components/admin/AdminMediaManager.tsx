import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  CheckCircle,
  Star,
  ExternalLink,
  Plus,
  X,
} from 'lucide-react';
import { imagesService } from '../../services/images';
import { productsService, ProductWithDetails } from '../../services/products';
import { DBProductImage } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminMediaManager: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useAdmin();
  const [images, setImages] = useState<DBProductImage[]>([]);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('all');

  // Upload modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProductId, setUploadProductId] = useState('');
  const [uploadUrl, setUploadUrl] = useState('/assets/products/ranger-x1.jpg');
  const [uploadAlt, setUploadAlt] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    loadMedia();
  }, [refreshTrigger]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const [imgs, prods] = await Promise.all([
        imagesService.getAll(),
        productsService.getAll(false),
      ]);
      setImages(imgs);
      setProducts(prods);
      if (prods.length > 0 && !uploadProductId) {
        setUploadProductId(prods[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadProductId || !uploadUrl.trim()) return;

    try {
      await imagesService.upload({
        productId: uploadProductId,
        publicUrl: uploadUrl.trim(),
        altText: uploadAlt.trim() || 'RANVIK Combat Boot',
        isPrimary,
      });

      setIsModalOpen(false);
      triggerRefresh();
      loadMedia();
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this image asset from storage?')) {
      await imagesService.delete(id);
      triggerRefresh();
      loadMedia();
    }
  };

  const handleSetPrimary = async (id: string) => {
    await imagesService.setPrimary(id);
    triggerRefresh();
    loadMedia();
  };

  const filteredImages =
    selectedProductId === 'all'
      ? images
      : images.filter((img) => img.productId === selectedProductId);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            SUPABASE STORAGE & MEDIA MANAGER
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Bucket: <code className="text-white">product-images</code> • Multi-angle photography & thumbnails
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#B83A2A] hover:bg-[#A33324] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors shadow-md cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>UPLOAD MEDIA</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-mono uppercase text-[#8C92A4]">
          FILTER BY FOOTWEAR SILHOUETTE:
        </label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="bg-[#16181E] border border-[#2B2E38] text-white px-3 py-2 text-xs font-mono rounded-xs focus:outline-hidden"
        >
          <option value="all">ALL SILHOUETTES ({images.length} IMAGES)</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredImages.map((img) => {
          const prod = products.find((p) => p.id === img.productId);
          return (
            <div
              key={img.id}
              className={`bg-[#16181E] border rounded-xs overflow-hidden group relative transition-all ${
                img.isPrimary ? 'border-[#B83A2A] shadow-lg' : 'border-[#2B2E38]'
              }`}
            >
              <div className="aspect-square bg-[#0E0F12] p-4 flex items-center justify-center relative">
                <img
                  src={img.publicUrl}
                  alt={img.altText}
                  className="max-h-full max-w-full object-contain"
                />

                {img.isPrimary && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-[#B83A2A] text-white text-[9px] font-mono uppercase font-bold rounded-xs flex items-center gap-1 shadow-md">
                    <Star className="w-2.5 h-2.5 fill-current" /> PRIMARY
                  </span>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  {!img.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      title="Set as primary product image"
                      className="p-2 bg-[#242731] hover:bg-[#B83A2A] text-white rounded-xs text-xs font-mono transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(img.id)}
                    title="Delete image"
                    className="p-2 bg-[#242731] hover:bg-[#B83A2A] text-white rounded-xs text-xs font-mono transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 border-t border-[#22252E] text-[10px] font-mono">
                <span className="text-white font-bold block truncate">{prod?.name || 'Boot'}</span>
                <span className="text-[#8C92A4] block truncate">{img.storagePath}</span>
              </div>
            </div>
          );
        })}
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
              ATTACH FOOTWEAR IMAGE
            </h2>
            <p className="text-xs font-mono text-[#8C92A4] mb-4">
              Stored in Supabase bucket <code className="text-white">product-images</code>
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  TARGET PRODUCT
                </label>
                <select
                  value={uploadProductId}
                  onChange={(e) => setUploadProductId(e.target.value)}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  IMAGE ASSET URL / PATH
                </label>
                <input
                  type="text"
                  required
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  ALT TEXT / ANGLE DESCRIPTION
                </label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="e.g. Side profile, aggressive lug outsole"
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="accent-[#B83A2A]"
                />
                <span className="text-xs font-mono text-white">SET AS PRIMARY DISPLAY IMAGE</span>
              </label>

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
                  SAVE IMAGE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
