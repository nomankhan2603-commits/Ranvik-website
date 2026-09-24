import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit2, X, Check } from 'lucide-react';
import { categoriesService } from '../../services/categories';
import { DBCategory } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminCategories: React.FC = () => {
  const { refreshTrigger, triggerRefresh } = useAdmin();
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DBCategory | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, [refreshTrigger]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: DBCategory) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      await categoriesService.upsert({
        id: editingCategory?.id,
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        status: 'active',
      });
      setIsModalOpen(false);
      triggerRefresh();
      loadCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to save category');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            CATEGORY HIERARCHY
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Organize tactical silhouettes and filter taxonomies
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B83A2A] hover:bg-[#A33324] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xs transition-colors shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NEW CATEGORY</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-[#16181E] border border-[#2B2E38] p-5 rounded-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-mono text-sm font-bold text-white">{c.name}</h3>
                <span className="text-[10px] font-mono text-[#8C92A4]">{c.slug}</span>
              </div>
              <button
                onClick={() => handleOpenEdit(c)}
                className="p-1.5 bg-[#242731] hover:bg-[#323644] text-white rounded-xs transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-mono text-[#A0A6B8] line-clamp-2">
              {c.description || 'No description provided.'}
            </p>
            <div className="pt-2 border-t border-[#2B2E38] flex items-center justify-between text-[10px] font-mono text-[#8C92A4]">
              <span>STATUS</span>
              <span className="text-[#10B981] uppercase font-bold">{c.status}</span>
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
              {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
            </h2>
            <p className="text-xs font-mono text-[#8C92A4] mb-4">
              Stored in Supabase `categories` table
            </p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  CATEGORY NAME
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:border-[#B83A2A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  SLUG (URL FRIENDLY)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white p-2.5 text-xs font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                  DESCRIPTION
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  SAVE CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
