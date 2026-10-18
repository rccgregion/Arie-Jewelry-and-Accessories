import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  ArrowRight, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Package, 
  ExternalLink,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { ProductCategory } from '../../types';
import { adminFetch } from '../../utils/adminAuth';

interface AdminCategoriesProps {
  onNavigateToProductsWithCategory?: (categoryId: string) => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  onNavigateToProductsWithCategory
}) => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Delete Confirmation State
  const [deleteConfirmationCategory, setDeleteConfirmationCategory] = useState<ProductCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/api/admin/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
        setFilteredCategories(data.categories);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to load categories.' });
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setStatusMessage({ type: 'error', text: 'Network error connecting to categories API.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const filtered = categories.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormImage('/images/products/prod-watch-gold.jpg');
    setFormDisplayOrder(categories.length > 0 ? Math.max(...categories.map(c => c.displayOrder || 0)) + 1 : 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDescription(cat.description || '');
    setFormImage(cat.image || '');
    setFormDisplayOrder(cat.displayOrder || 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Slug Generation in Real-time from Name
  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingCategory) {
      const autoSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(autoSlug);
    }
  };

  // Handle Image Upload via Admin Upload Endpoint
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setFormError(null);

    try {
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormImage(data.url);
      } else {
        setFormError(data.error || 'Failed to upload category image.');
      }
    } catch (err) {
      setFormError('Network error uploading category image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Save Category (Create or Edit)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formName.trim().length < 2) {
      setFormError('Category name must have at least 2 characters.');
      return;
    }

    const cleanSlug = (formSlug.trim() || formName.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!cleanSlug) {
      setFormError('A valid slug identifier is required.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          slug: cleanSlug,
          description: formDescription.trim() || undefined,
          image: formImage.trim() || undefined,
          displayOrder: Number(formDisplayOrder) || 1
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save category.');
        setIsSaving(false);
        return;
      }

      setStatusMessage({
        type: 'success',
        text: editingCategory 
          ? `Category "${data.category?.name || formName}" successfully updated!` 
          : `New category "${data.category?.name || formName}" successfully created!`
      });

      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setFormError('Server error while saving category.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async () => {
    if (!deleteConfirmationCategory) return;
    setIsDeleting(true);

    try {
      const res = await adminFetch(`/api/admin/categories/${deleteConfirmationCategory.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Could not delete category.'
        });
        setDeleteConfirmationCategory(null);
        return;
      }

      setStatusMessage({
        type: 'success',
        text: `Category "${deleteConfirmationCategory.name}" was successfully removed.`
      });
      setDeleteConfirmationCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setStatusMessage({
        type: 'error',
        text: 'Error deleting category from server.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#d4af37]/10 text-[#8c6b2d] dark:text-[#d4af37]">
              <FolderTree className="w-4 h-4" />
            </span>
            <span className="text-xs font-cinzel tracking-widest text-[#8c6b2d] dark:text-[#d4af37] uppercase font-bold">
              ADMIN TAXONOMY &amp; NAVIGATION
            </span>
          </div>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            Product Categories
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            Create and curate distinct departments for watches, fine jewelry, suits, and accessories. Dynamic categories empower instant storefront faceted filters and global searches.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition disabled:opacity-50"
            title="Refresh category list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel font-semibold tracking-wider text-xs uppercase shadow-md shadow-[#d4af37]/20 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Category</span>
          </button>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/40 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel uppercase text-stone-500 dark:text-stone-400">Total Categories</span>
            <Layers className="w-4 h-4 text-[#8c6b2d] dark:text-[#d4af37]" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {categories.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Active navigation departments
          </div>
        </div>

        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel uppercase text-stone-500 dark:text-stone-400">Total Products Categorized</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {totalProducts}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Assigned across all collections
          </div>
        </div>

        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel uppercase text-stone-500 dark:text-stone-400">Avg Products / Category</span>
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {categories.length > 0 ? (totalProducts / categories.length).toFixed(1) : '0'}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Distribution balance across catalog
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category by name, slug or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#121110] text-xs text-stone-900 dark:text-[#f5f2eb] placeholder-stone-400 focus:outline-none focus:border-[#d4af37] transition shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400 font-sans self-end sm:self-auto">
          Showing <span className="font-semibold text-stone-900 dark:text-stone-200">{filteredCategories.length}</span> of {categories.length} categories
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-cinzel text-stone-400 tracking-wider">Loading Admin Categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
          <FolderTree className="w-10 h-10 text-stone-400 mx-auto mb-3 opacity-60" />
          <h3 className="font-cinzel text-sm font-semibold text-stone-800 dark:text-stone-200">
            No matching categories found
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or click below to create a new product category.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4af37] text-black text-xs font-cinzel font-semibold tracking-wider uppercase hover:bg-[#c5a059] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const productCount = cat.productCount || 0;
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800/90 rounded-2xl overflow-hidden shadow-sm hover:border-[#d4af37]/40 transition group flex flex-col justify-between"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative h-40 w-full overflow-hidden bg-stone-900/60">
                    <img
                      src={cat.image || '/images/products/prod-watch-gold.jpg'}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badges on top */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-stone-200">
                        #{cat.displayOrder ?? 99}
                      </span>
                      {cat.isSystem && (
                        <span className="px-2 py-0.5 rounded-md bg-[#d4af37]/80 text-black text-[9px] font-cinzel font-bold tracking-wider uppercase">
                          System
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#d4af37]/30 text-[11px] font-cinzel font-semibold text-[#f5f2eb] flex items-center gap-1">
                        <Package className="w-3 h-3 text-[#d4af37]" />
                        <span>{productCount} {productCount === 1 ? 'Product' : 'Products'}</span>
                      </span>
                    </div>

                    {/* Title in Header */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-cinzel text-base font-bold text-white tracking-wide drop-shadow-sm">
                        {cat.name}
                      </h3>
                      <div className="text-[10px] text-[#d4af37] font-mono drop-shadow-sm">
                        slug: /{cat.slug}
                      </div>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {cat.description || 'Curated luxury collection crafted for discerning clientele.'}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                  {onNavigateToProductsWithCategory ? (
                    <button
                      onClick={() => onNavigateToProductsWithCategory(cat.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-cinzel text-[#8c6b2d] dark:text-[#d4af37] hover:underline font-semibold"
                    >
                      <span>View Products</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="text-[11px] text-stone-400 font-mono">
                      ID: {cat.id}
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      title="Edit Category Details"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-[#d4af37] hover:bg-stone-100 dark:hover:bg-white/5 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmationCategory(cat)}
                      title="Delete Category"
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-500 hover:bg-red-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121110] border border-[#d4af37]/30 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl text-[#f5f2eb] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#d4af37]" />
                <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#f5f2eb]">
                  {editingCategory ? 'EDIT CATEGORY' : 'NEW PRODUCT CATEGORY'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Brooches &amp; Lapel Pins"
                  className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1.5">
                    Slug Identifier *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. brooches-pins"
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-stone-300 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief narrative of what this collection entails (used for SEO &amp; category showcase banners)..."
                  className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1.5">
                  Category Banner Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="/images/products/prod-watch-gold.jpg"
                    className="flex-1 px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-stone-300 font-mono outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-white flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {formImage && (
                  <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-stone-800 bg-black/40">
                    <img
                      src={formImage}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                      }}
                    />
                    <div className="absolute bottom-1 right-2 bg-black/70 px-2 py-0.5 rounded text-[9px] text-[#d4af37]">
                      Live Preview
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-800 text-xs font-cinzel text-stone-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-5 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel font-semibold tracking-wider text-xs uppercase transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121110] border border-red-500/40 rounded-2xl w-full max-w-md p-6 shadow-2xl text-[#f5f2eb]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center flex-shrink-0 text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-white">
                  Delete Category?
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Are you sure you want to delete <strong className="text-white">"{deleteConfirmationCategory.name}"</strong>?
                </p>
                {(deleteConfirmationCategory.productCount || 0) > 0 && (
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs">
                    <p className="font-semibold">Notice: Contains {deleteConfirmationCategory.productCount} active products.</p>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">Products will remain in the catalog, but may lose their primary category taxonomy until reassigned.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-stone-800">
              <button
                onClick={() => setDeleteConfirmationCategory(null)}
                className="px-4 py-2 rounded-lg border border-stone-800 text-xs font-cinzel text-stone-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-cinzel font-semibold text-xs uppercase tracking-wider transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
