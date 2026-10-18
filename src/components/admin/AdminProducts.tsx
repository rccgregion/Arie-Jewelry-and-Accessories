import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Image as ImageIcon, 
  Layers, 
  Sparkles, 
  Clock, 
  Tag, 
  Archive, 
  Eye, 
  Star,
  ChevronDown,
  FolderPlus,
  FolderTree,
  Edit2
} from 'lucide-react';
import { z } from 'zod';
import { AdminProduct, ProductStatus, ProductVariantOption, ProductVariantCombination, ProductCategory } from '../../types/admin';
import { Category } from '../../types';
import { adminFetch } from '../../utils/adminAuth';

// Client-side Zod validation schema
const clientProductSchema = z.object({
  name: z.string().min(2, 'Product name must have at least 2 characters'),
  slug: z.string().min(2, 'Slug is required'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  category: z.string().min(2, 'Category is required'),
  basePriceNgn: z.number().positive('Base price must be greater than 0'),
  stockCount: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(0).default(5),
  status: z.enum(['published', 'draft', 'archived']),
  sku: z.string().min(2, 'SKU is required')
});

export interface AdminProductsProps {
  initialCategory?: string;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ initialCategory = 'all' }) => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Dynamic Categories State
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isInlineCategoryOpen, setIsInlineCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categorySuccess, setCategorySuccess] = useState<string | null>(null);

  // Modal / Drawer state for Create or Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<string>('watches');
  const [formTags, setFormTags] = useState('');
  const [formBasePriceNgn, setFormBasePriceNgn] = useState<number>(0);
  const [formStockCount, setFormStockCount] = useState<number>(10);
  const [formLowStockThreshold, setFormLowStockThreshold] = useState<number>(5);
  const [formStatus, setFormStatus] = useState<ProductStatus>('published');
  const [formSku, setFormSku] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsNew, setFormIsNew] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([]);

  // Timed Discount State
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [discountStartDate, setDiscountStartDate] = useState('');
  const [discountEndDate, setDiscountEndDate] = useState('');

  // Variants State
  const [variantTypes, setVariantTypes] = useState<ProductVariantOption[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<ProductVariantCombination[]>([]);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeValues, setNewTypeValues] = useState('');

  // Upload state & Validation errors
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    try {
      const res = await adminFetch('/api/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let res = await adminFetch('/api/admin/products');
      if (!res.ok) {
        // Fallback to public products endpoint if admin call failed
        res = await fetch('/api/products');
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        // Fallback attempt with public products
        const pubRes = await fetch('/api/products');
        const pubData = await pubRes.json();
        if (pubData.success && Array.isArray(pubData.products)) {
          setProducts(pubData.products);
          setFilteredProducts(pubData.products);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin products:', err);
      try {
        const pubRes = await fetch('/api/products');
        const pubData = await pubRes.json();
        if (pubData.success && Array.isArray(pubData.products)) {
          setProducts(pubData.products);
          setFilteredProducts(pubData.products);
        }
      } catch (e) {
        console.error('Products fallback error:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCatName.trim()) {
      setCategoryError('Category name must have at least 2 characters.');
      return;
    }

    setIsCreatingCategory(true);
    setCategoryError(null);
    setCategorySuccess(null);

    try {
      const res = await adminFetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug: newCatSlug.trim() || undefined,
          description: newCatDescription.trim() || undefined,
          image: newCatImage.trim() || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setCategoryError(data.error || 'Failed to create category.');
        setIsCreatingCategory(false);
        return;
      }

      setCategorySuccess(`Category "${data.category.name}" created!`);
      await fetchCategories();
      setFormCategory(data.category.id);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDescription('');
      setNewCatImage('');
      setIsInlineCategoryOpen(false);
    } catch (err) {
      setCategoryError('Error saving new category.');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to delete category.');
        return;
      }
      await fetchCategories();
      if (formCategory === id) {
        setFormCategory(categories[0]?.id || 'watches');
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  // Filter products when search, category or status changes
  useEffect(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (selectedStatus !== 'all') {
      result = result.filter(p => p.status === selectedStatus);
    }
    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Open modal for Creating new Product
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSlug('');
    setFormSubtitle('');
    setFormDescription('');
    setFormCategory('watches');
    setFormTags('luxury, timepiece, gold');
    setFormBasePriceNgn(45000);
    setFormStockCount(10);
    setFormLowStockThreshold(5);
    setFormStatus('published');
    setFormSku(`ARIE-${Date.now().toString().slice(-4)}`);
    setFormIsFeatured(false);
    setFormIsBestseller(false);
    setFormIsNew(true);
    setFormImages(['/images/products/prod-watch-gold.jpg']);
    setHasDiscount(false);
    setDiscountType('percentage');
    setDiscountValue(10);
    setDiscountStartDate('');
    setDiscountEndDate('');
    setVariantTypes([]);
    setVariantCombinations([]);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Editing existing Product
  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormSubtitle(p.subtitle || '');
    setFormDescription(p.description);
    setFormCategory(p.category);
    setFormTags(p.tags ? p.tags.join(', ') : '');
    setFormBasePriceNgn(Math.round(p.basePriceKobo / 100));
    setFormStockCount(p.stockCount);
    setFormLowStockThreshold(p.lowStockThreshold || 5);
    setFormStatus(p.status);
    setFormSku(p.sku);
    setFormIsFeatured(p.isFeatured);
    setFormIsBestseller(p.isBestseller);
    setFormIsNew(p.isNew);
    setFormImages(p.images && p.images.length ? p.images : ['/images/products/prod-watch-gold.jpg']);
    
    if (p.discount && p.discount.value > 0) {
      setHasDiscount(true);
      setDiscountType(p.discount.type);
      setDiscountValue(p.discount.type === 'fixed' ? Math.round(p.discount.value / 100) : p.discount.value);
      setDiscountStartDate(p.discount.startDate ? p.discount.startDate.slice(0, 16) : '');
      setDiscountEndDate(p.discount.endDate ? p.discount.endDate.slice(0, 16) : '');
    } else {
      setHasDiscount(false);
      setDiscountType('percentage');
      setDiscountValue(10);
      setDiscountStartDate('');
      setDiscountEndDate('');
    }

    if (p.variants) {
      setVariantTypes(p.variants.types || []);
      setVariantCombinations(p.variants.combinations || []);
    } else {
      setVariantTypes([]);
      setVariantCombinations([]);
    }

    setFormErrors({});
    setIsModalOpen(true);
  };

  // Auto-generate slug when name changes if not manually set
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingProduct) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(generated);
    }
  };

  // Add a new variant type (e.g. "Size" with options ["40mm", "42mm"])
  const handleAddVariantType = () => {
    if (!newTypeName.trim() || !newTypeValues.trim()) return;

    const values = newTypeValues
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    if (values.length === 0) return;

    const updatedTypes = [...variantTypes, { type: newTypeName.trim(), values }];
    setVariantTypes(updatedTypes);
    setNewTypeName('');
    setNewTypeValues('');

    // Re-generate combinations matrix
    generateCombinations(updatedTypes);
  };

  // Generate cartesian product of variant types
  const generateCombinations = (types: ProductVariantOption[]) => {
    if (types.length === 0) {
      setVariantCombinations([]);
      return;
    }

    let combinations: Array<Record<string, string>> = [{}];
    for (const t of types) {
      const next: Array<Record<string, string>> = [];
      for (const cur of combinations) {
        for (const val of t.values) {
          next.push({ ...cur, [t.type]: val });
        }
      }
      combinations = next;
    }

    const newMatrix: ProductVariantCombination[] = combinations.map((combo, idx) => {
      const comboName = Object.values(combo).join(' / ');
      const skuSuffix = Object.values(combo).map(v => v.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase()).join('-');
      return {
        id: `var_${idx + 1}`,
        sku: `${formSku || 'ARIE'}-${skuSuffix || idx + 1}`,
        name: comboName,
        options: combo,
        priceKobo: formBasePriceNgn * 100,
        stockCount: Math.max(1, Math.floor(formStockCount / combinations.length) || 5),
        image: formImages[0]
      };
    });

    setVariantCombinations(newMatrix);
  };

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await adminFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.urls)) {
        setFormImages(prev => [...prev, ...data.urls]);
      } else {
        alert(data.error || 'Failed to upload image.');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Error during image upload. Check image format (JPEG, PNG, WebP) and size (<5MB).');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Set image as primary thumbnail
  const setPrimaryImage = (index: number) => {
    setFormImages(prev => {
      const copy = [...prev];
      const selected = copy.splice(index, 1)[0];
      return [selected, ...copy];
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormImages(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Product Create or Update
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod
    const validationResult = clientProductSchema.safeParse({
      name: formName,
      slug: formSlug,
      subtitle: formSubtitle,
      description: formDescription,
      category: formCategory,
      basePriceNgn: Number(formBasePriceNgn),
      stockCount: Number(formStockCount),
      lowStockThreshold: Number(formLowStockThreshold),
      status: formStatus,
      sku: formSku
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    if (formImages.length === 0) {
      setFormErrors({ images: 'At least one product image is required.' });
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    const basePriceKobo = Math.round(Number(formBasePriceNgn) * 100);

    // Build discount object
    let discount = undefined;
    if (hasDiscount && discountValue > 0) {
      discount = {
        type: discountType,
        value: discountType === 'fixed' ? Math.round(discountValue * 100) : discountValue,
        startDate: discountStartDate ? new Date(discountStartDate).toISOString() : undefined,
        endDate: discountEndDate ? new Date(discountEndDate).toISOString() : undefined,
        isActive: true
      };
    }

    const payload = {
      name: formName.trim(),
      slug: formSlug.trim(),
      subtitle: formSubtitle.trim() || undefined,
      description: formDescription.trim(),
      category: formCategory,
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      images: formImages,
      basePriceKobo,
      discount,
      stockCount: Number(formStockCount),
      lowStockThreshold: Number(formLowStockThreshold),
      status: formStatus,
      isFeatured: formIsFeatured,
      isBestseller: formIsBestseller,
      isNew: formIsNew,
      sku: formSku.trim(),
      variants: variantTypes.length > 0 ? {
        types: variantTypes,
        combinations: variantCombinations
      } : undefined
    };

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setFormErrors({ form: data.error || 'Failed to save product.' });
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFormErrors({ form: 'Network error saving product.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDeleteConfirmationId(null);
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#f5f2eb] tracking-wide">
            PRODUCT ADMIN &amp; INVENTORY
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Manage authentic catalog items, timed promotions, variants, and stock levels
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg border border-[#d4af37]/40 hover:border-[#d4af37] bg-black/40 hover:bg-[#d4af37]/10 text-[#d4af37] font-cinzel text-xs font-semibold tracking-wider uppercase transition shadow-sm"
          >
            <FolderTree className="w-4 h-4 stroke-[2]" />
            <span>Categories ({categories.length})</span>
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel text-xs font-bold tracking-wider uppercase shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Creation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, or category..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 rounded-lg text-xs outline-none focus:border-[#d4af37] text-stone-800 dark:text-stone-200 placeholder-stone-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Dynamic Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 rounded-lg text-xs px-3 py-1.5 text-stone-700 dark:text-stone-300 outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Departments ({products.length})</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.productCount !== undefined ? cat.productCount : products.filter(p => p.category === cat.id).length})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 rounded-lg text-xs px-3 py-1.5 text-stone-700 dark:text-stone-300 outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-white/[0.02] text-stone-500 dark:text-stone-400 font-cinzel text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Creation</th>
                <th className="py-3 px-3 font-semibold">Department</th>
                <th className="py-3 px-3 font-semibold">Base Price (₦)</th>
                <th className="py-3 px-3 font-semibold">Inventory</th>
                <th className="py-3 px-3 font-semibold">Variants</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No matching creations found in admin database.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-stone-50/70 dark:hover:bg-white/[0.015] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || '/images/products/prod-watch-gold.jpg'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                          }}
                        />
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5 flex items-center gap-1.5">
                            <span>{product.sku}</span>
                            {product.isFeatured && (
                              <span className="text-[#d4af37] font-sans">· Featured</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-stone-600 dark:text-stone-400 capitalize">
                      {product.category}
                    </td>
                    <td className="py-3 px-3 font-cinzel font-bold text-stone-900 dark:text-[#d4af37] whitespace-nowrap">
                      ₦{(product.basePriceKobo / 100).toLocaleString()}
                      {product.discount?.isActive && (
                        <span className="block text-[10px] text-emerald-500 font-sans font-normal">
                          {product.discount.type === 'percentage' ? `${product.discount.value}% off` : 'Timed Promo'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        product.stockCount <= 0 
                          ? 'bg-red-500/10 text-red-400' 
                          : product.stockCount <= (product.lowStockThreshold || 5)
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {product.stockCount} in vault
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-500">
                      {product.variants?.combinations?.length ? (
                        <span>{product.variants.combinations.length} combinations</span>
                      ) : (
                        <span>Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        product.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                        product.status === 'draft' ? 'bg-stone-500/10 text-stone-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          title="Edit Product"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-[#d4af37] hover:bg-stone-100 dark:hover:bg-white/5 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmationId(product.id)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121110] border border-[#d4af37]/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-[#f5f2eb]">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="font-cinzel text-lg font-bold text-[#f5f2eb]">
                {editingProduct ? 'EDIT PRODUCT DETAILS' : 'CREATE NEW PRODUCT'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.form && (
              <div className="mt-4 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                {formErrors.form}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-6">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Royal Chronos Gold Timepiece"
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                  />
                  {formErrors.name && <p className="text-[10px] text-red-400 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                    Slug (Auto-Generated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="royal-chronos-gold-timepiece"
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-stone-300 font-mono outline-none"
                  />
                  {formErrors.slug && <p className="text-[10px] text-red-400 mt-1">{formErrors.slug}</p>}
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="ARIE-WTC-001"
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white font-mono outline-none"
                  />
                  {formErrors.sku && <p className="text-[10px] text-red-400 mt-1">{formErrors.sku}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-cinzel uppercase text-stone-300">
                      Category Department *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsInlineCategoryOpen(!isInlineCategoryOpen);
                        setCategoryError(null);
                        setCategorySuccess(null);
                      }}
                      className="text-[11px] font-cinzel text-[#d4af37] hover:text-[#f3e5ab] flex items-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isInlineCategoryOpen ? 'Cancel' : '+ New Category'}</span>
                    </button>
                  </div>

                  {isInlineCategoryOpen && (
                    <div className="p-3 bg-black/70 border border-[#d4af37]/40 rounded-xl space-y-2 mb-2 animate-in fade-in">
                      <div className="text-[11px] font-cinzel text-[#d4af37] font-semibold flex items-center justify-between">
                        <span>Create New Category</span>
                        <span className="text-[10px] text-stone-400 font-sans font-normal">Auto-selected upon creation</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={newCatName}
                          onChange={(e) => {
                            setNewCatName(e.target.value);
                            if (!newCatSlug || newCatSlug === newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
                              setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                            }
                          }}
                          placeholder="Category Name (e.g. Brooches)"
                          className="px-2.5 py-1.5 bg-black/60 border border-stone-800 rounded-lg text-xs text-white outline-none focus:border-[#d4af37]"
                        />
                        <input
                          type="text"
                          value={newCatSlug}
                          onChange={(e) => setNewCatSlug(e.target.value)}
                          placeholder="Slug (e.g. brooches)"
                          className="px-2.5 py-1.5 bg-black/60 border border-stone-800 rounded-lg text-xs text-stone-300 font-mono outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <input
                        type="text"
                        value={newCatDescription}
                        onChange={(e) => setNewCatDescription(e.target.value)}
                        placeholder="Optional Description (e.g. Handcrafted ornamental statement brooches)"
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-stone-800 rounded-lg text-xs text-white outline-none focus:border-[#d4af37]"
                      />
                      {categoryError && <p className="text-[10px] text-red-400">{categoryError}</p>}
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isCreatingCategory}
                          onClick={() => handleCreateCategory()}
                          className="px-3 py-1.5 rounded bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {isCreatingCategory && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                          <span>Save &amp; Select Category</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && <p className="text-[10px] text-red-400 mt-1">{formErrors.category}</p>}
                </div>
              </div>

              {/* Subtitle & Description */}
              <div>
                <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                  Subtitle / Highlight Tagline
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g. High-Luster Gold Link Watch with Obsidian Sunray Dial"
                  className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed craftsmanship narrative and styling suggestions..."
                  className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                />
                {formErrors.description && <p className="text-[10px] text-red-400 mt-1">{formErrors.description}</p>}
              </div>

              {/* Images Manager */}
              <div className="p-4 rounded-xl bg-black/30 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-cinzel uppercase text-stone-200">
                      Product Images (Max 5MB each, JPEG/PNG/WebP) *
                    </label>
                    <p className="text-[10px] text-stone-400">
                      First image is the primary storefront thumbnail. Drag or click to set primary.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/50 text-[#d4af37] text-xs font-cinzel flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Verifying Upload...' : 'Upload Images'}</span>
                  </button>
                </div>

                {/* Image Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-800 aspect-square bg-stone-900">
                      <img
                        src={img}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                        }}
                      />
                      {idx === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#d4af37] text-black text-[9px] font-bold px-1.5 py-0.5 rounded font-cinzel">
                          PRIMARY
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(idx)}
                            title="Set Primary"
                            className="p-1.5 bg-[#d4af37] text-black rounded text-[10px] font-bold"
                          >
                            Set Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          title="Remove Image"
                          className="p-1.5 bg-red-600 text-white rounded text-[10px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing, Inventory & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                    Base Price (NGN ₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formBasePriceNgn}
                    onChange={(e) => setFormBasePriceNgn(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white font-cinzel font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStockCount}
                    onChange={(e) => setFormStockCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-stone-300 mb-1">
                    Publish Status *
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ProductStatus)}
                    className="w-full px-3 py-2 bg-black/50 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                  >
                    <option value="published">Published (Storefront Active)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Timed Promotions / Discounts */}
              <div className="p-4 rounded-xl bg-black/30 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-cinzel text-xs font-semibold uppercase text-stone-200">
                      Timed Promotion / Automatic Discount
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      className="accent-[#d4af37]"
                    />
                    <span>Enable Promotion Window</span>
                  </label>
                </div>

                {hasDiscount && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div>
                      <label className="block text-stone-400 mb-1">Type</label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as any)}
                        className="w-full p-2 bg-black/60 border border-stone-800 rounded text-xs text-white outline-none"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₦)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1">
                        Discount Value ({discountType === 'percentage' ? '%' : '₦'})
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={discountValue}
                        onChange={(e) => setDiscountValue(Number(e.target.value))}
                        className="w-full p-2 bg-black/60 border border-stone-800 rounded text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1">
                        End Date/Time (Africa/Lagos WAT)
                      </label>
                      <input
                        type="datetime-local"
                        value={discountEndDate}
                        onChange={(e) => setDiscountEndDate(e.target.value)}
                        className="w-full p-2 bg-black/60 border border-stone-800 rounded text-xs text-white outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3 text-[11px] text-[#c5a059] bg-[#d4af37]/5 p-2 rounded border border-[#d4af37]/20">
                      Calculated Final Price during promo: ₦
                      {(
                        discountType === 'percentage'
                          ? Math.round(formBasePriceNgn * (1 - discountValue / 100))
                          : Math.max(0, formBasePriceNgn - discountValue)
                      ).toLocaleString()}
                      {' '}(Computed authoritatively by server in UTC)
                    </div>
                  </div>
                )}
              </div>

              {/* Variant Combinations Builder */}
              <div className="p-4 rounded-xl bg-black/30 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-cinzel text-xs font-semibold uppercase text-stone-200">
                      Variant Matrix (Size, Color, Material, etc.)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="Type Name (e.g. Size or Color)"
                    className="p-2 bg-black/50 border border-stone-800 rounded text-xs text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newTypeValues}
                    onChange={(e) => setNewTypeValues(e.target.value)}
                    placeholder="Options (e.g. 40mm, 42mm, 44mm)"
                    className="p-2 bg-black/50 border border-stone-800 rounded text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariantType}
                    className="p-2 rounded bg-stone-800 hover:bg-stone-700 text-xs font-cinzel text-white transition"
                  >
                    Generate Matrix
                  </button>
                </div>

                {variantCombinations.length > 0 && (
                  <div className="overflow-x-auto max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-stone-800 text-stone-400 font-cinzel">
                          <th className="pb-1.5">Variant</th>
                          <th className="pb-1.5">SKU</th>
                          <th className="pb-1.5">Price Override (₦)</th>
                          <th className="pb-1.5">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60">
                        {variantCombinations.map((combo, cIdx) => (
                          <tr key={combo.id}>
                            <td className="py-1.5 font-medium text-stone-200">{combo.name}</td>
                            <td className="py-1.5 font-mono text-stone-400">{combo.sku}</td>
                            <td className="py-1.5">
                              <input
                                type="number"
                                value={combo.priceKobo ? Math.round(combo.priceKobo / 100) : formBasePriceNgn}
                                onChange={(e) => {
                                  const val = Number(e.target.value) * 100;
                                  setVariantCombinations(prev => {
                                    const copy = [...prev];
                                    copy[cIdx] = { ...copy[cIdx], priceKobo: val };
                                    return copy;
                                  });
                                }}
                                className="w-24 p-1 bg-black border border-stone-800 rounded text-[11px] text-white"
                              />
                            </td>
                            <td className="py-1.5">
                              <input
                                type="number"
                                value={combo.stockCount}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setVariantCombinations(prev => {
                                    const copy = [...prev];
                                    copy[cIdx] = { ...copy[cIdx], stockCount: val };
                                    return copy;
                                  });
                                }}
                                className="w-16 p-1 bg-black border border-stone-800 rounded text-[11px] text-white"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-stone-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Feature in Hero Showcase</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-400 hover:text-stone-200 text-xs font-cinzel transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving Creation...</span>
                    </>
                  ) : (
                    <span>Save Creation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121110] border border-red-500/40 rounded-xl max-w-sm w-full p-6 text-[#f5f2eb] shadow-2xl">
            <h3 className="font-cinzel text-base font-bold text-red-400 mb-2">
              CONFIRM REMOVAL
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              Are you certain you wish to remove this product from the catalog? This action will be recorded in the security audit log.
            </p>
            <div className="flex items-center justify-end gap-3 text-xs font-cinzel">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 rounded-lg text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmationId)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121110] border border-[#d4af37]/40 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-[#f5f2eb]">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <FolderTree className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#f5f2eb]">
                    PRODUCT CATEGORIES
                  </h2>
                  <p className="text-[11px] text-stone-400">
                    Create departments to organize catalog products, filters, and searches
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setCategoryError(null);
                  setCategorySuccess(null);
                }}
                className="p-1 text-stone-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Create New Category Card */}
            <div className="my-6 p-4 rounded-xl bg-black/50 border border-[#d4af37]/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-cinzel font-semibold text-[#d4af37] tracking-wider uppercase">
                <FolderPlus className="w-4 h-4" />
                <span>Add New Category</span>
              </div>

              {categorySuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{categorySuccess}</span>
                </div>
              )}

              {categoryError && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{categoryError}</span>
                </div>
              )}

              <form onSubmit={handleCreateCategory} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-cinzel uppercase text-stone-300 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => {
                        setNewCatName(e.target.value);
                        if (!newCatSlug || newCatSlug === newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) {
                          setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                        }
                      }}
                      placeholder="e.g. Brooches &amp; Pins"
                      className="w-full px-3 py-2 bg-black/60 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-cinzel uppercase text-stone-300 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatSlug}
                      onChange={(e) => setNewCatSlug(e.target.value)}
                      placeholder="e.g. brooches-pins"
                      className="w-full px-3 py-2 bg-black/60 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-stone-300 font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-stone-300 mb-1">
                    Description / Highlight
                  </label>
                  <input
                    type="text"
                    value={newCatDescription}
                    onChange={(e) => setNewCatDescription(e.target.value)}
                    placeholder="e.g. Handcrafted ornamental statement brooches and lapel accessories"
                    className="w-full px-3 py-2 bg-black/60 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-stone-300 mb-1">
                    Showcase Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCatImage}
                    onChange={(e) => setNewCatImage(e.target.value)}
                    placeholder="e.g. /images/products/prod-necklace-set.jpg"
                    className="w-full px-3 py-2 bg-black/60 border border-stone-800 focus:border-[#d4af37] rounded-lg text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isCreatingCategory}
                    className="px-4 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c5a059] text-black font-cinzel text-xs font-bold tracking-wider uppercase transition shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCreatingCategory ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Creating Category...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Categories Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-cinzel text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Active Store Departments ({categories.length})
                </span>
                <span className="text-[11px] text-stone-500">
                  Total Catalog Products: {products.length}
                </span>
              </div>

              <div className="border border-stone-800 rounded-xl overflow-hidden bg-black/30">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-800 bg-stone-900/40 text-stone-400 font-cinzel text-[11px] uppercase">
                      <th className="py-2.5 px-4 font-semibold">Category</th>
                      <th className="py-2.5 px-3 font-semibold">Slug</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Assigned Products</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {categories.map((cat) => {
                      const count = cat.productCount !== undefined 
                        ? cat.productCount 
                        : products.filter(p => p.category === cat.id).length;
                      return (
                        <tr key={cat.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-2.5 px-4">
                            <div className="font-medium text-white">{cat.name}</div>
                            {cat.description && (
                              <div className="text-[10px] text-stone-400 line-clamp-1">{cat.description}</div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-stone-400">
                            {cat.slug}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] font-semibold text-[11px]">
                              {count} {count === 1 ? 'item' : 'items'}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (count > 0) {
                                  alert(`Cannot delete "${cat.name}": ${count} product(s) are currently assigned to this category. Please reassign those products first.`);
                                  return;
                                }
                                if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                                  handleDeleteCategory(cat.id);
                                }
                              }}
                              title={count > 0 ? "Cannot delete while products are assigned" : "Delete category"}
                              className={`p-1.5 rounded-lg transition ${
                                count > 0 
                                  ? 'text-stone-600 cursor-not-allowed' 
                                  : 'text-stone-400 hover:text-red-400 hover:bg-red-500/10'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-cinzel text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
