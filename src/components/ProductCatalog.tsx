import React, { useState } from 'react';
import { 
  Heart, 
  Eye, 
  ShoppingBag, 
  SlidersHorizontal, 
  Star,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, FilterOptions, Category } from '../types';

export const ProductCatalog: React.FC = () => {
  const {
    filteredProducts,
    filterOptions,
    setFilterOptions,
    selectedCategory,
    setSelectedCategory,
    categories: dynamicCategories,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    formatPrice
  } = useShop();

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Curations' },
    { id: 'jewelry', label: 'Fine Jewelry' },
    { id: 'accessories', label: 'Accessories' },
    ...dynamicCategories.map(c => ({ id: c.id, label: c.name })),
    { id: 'new-arrivals', label: 'New Arrivals' }
  ];

  const materials = ['all', 'Gold Tone Stainless Steel', 'Crystal', 'Polished 316L Steel', 'Polyester', 'Cotton', 'Leather', 'Acetate'];

  const getDirectWhatsAppUrl = (product: Product) => {
    const text = encodeURIComponent(
      `Hello Arie Jewelry, I would like to order: "${product.name}" (${formatPrice(product.price)}). Is this available for delivery?`
    );
    return `https://wa.me/2348164907596?text=${text}`;
  };

  return (
    <section id="catalog-section" className="py-16 sm:py-24 bg-[#fbfaf8] dark:bg-[#0c0b0a] text-[#171513] dark:text-[#f5f2eb] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#c5a059]/20 dark:border-[#d4af37]/15">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-cinzel tracking-[0.24em] text-[#8c6b2d] dark:text-[#d4af37] uppercase">ARIE SIGNATURE CATALOG</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171513] dark:text-[#fbfaf8]">
              Curated Collections
            </h2>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setFilterOptions(prev => ({ ...prev, searchQuery: '' }));
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-2 text-xs font-cinzel tracking-[0.14em] uppercase rounded transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar: Count, Filter Toggle, Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-sans text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-3">
            <span className="text-stone-500 dark:text-stone-400">
              Showing <span className="text-[#171513] dark:text-[#f5f2eb] font-semibold">{filteredProducts.length}</span> authentic items
            </span>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded border transition ${
                isFilterPanelOpen
                  ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#8c6b2d] dark:text-[#d4af37]'
                  : 'border-stone-300 dark:border-white/10 hover:border-stone-400 dark:hover:border-white/30 text-stone-700 dark:text-stone-300'
              }`}
              aria-expanded={isFilterPanelOpen}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-stone-500 dark:text-stone-400 hidden sm:inline">Sort by:</span>
            <select
              value={filterOptions.sortBy}
              onChange={(e) =>
                setFilterOptions(prev => ({
                  ...prev,
                  sortBy: e.target.value as FilterOptions['sortBy']
                }))
              }
              aria-label="Sort creations by"
              className="bg-white dark:bg-[#141312] border border-stone-300 dark:border-white/10 hover:border-[#c5a059] dark:hover:border-[#d4af37]/40 text-stone-800 dark:text-stone-200 text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#d4af37]"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {isFilterPanelOpen && (
          <div className="mb-10 p-5 rounded-lg bg-stone-100/80 dark:bg-[#141312] border border-stone-300/80 dark:border-[#d4af37]/25 text-xs text-stone-700 dark:text-stone-300 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Material Filter */}
            <div>
              <p className="font-cinzel text-[#8c6b2d] dark:text-[#d4af37] font-semibold mb-2 tracking-wider">PRIMARY ATTRIBUTE</p>
              <div className="flex flex-wrap gap-1.5">
                {materials.map(mat => (
                  <button
                    key={mat}
                    onClick={() =>
                      setFilterOptions(prev => ({
                        ...prev,
                        material: mat === 'all' ? undefined : mat
                      }))
                    }
                    className={`px-2.5 py-1 rounded border transition capitalize ${
                      (mat === 'all' && !filterOptions.material) || filterOptions.material === mat
                        ? 'border-[#d4af37] text-black dark:text-[#d4af37] bg-[#d4af37]/20 font-medium'
                        : 'border-stone-300 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-white/30'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Cap Filter */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-cinzel text-[#8c6b2d] dark:text-[#d4af37] font-semibold tracking-wider">MAXIMUM PRICE</span>
                <span className="font-mono text-stone-900 dark:text-white">{formatPrice(filterOptions.maxPrice)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="80000"
                step="2000"
                value={filterOptions.maxPrice}
                onChange={(e) =>
                  setFilterOptions(prev => ({
                    ...prev,
                    maxPrice: Number(e.target.value)
                  }))
                }
                className="w-full accent-[#d4af37] cursor-pointer"
                aria-label="Filter maximum price threshold"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>{formatPrice(5000)}</span>
                <span>{formatPrice(80000)}</span>
              </div>
            </div>

            {/* Quick Reset */}
            <div className="flex flex-col justify-end">
              <button
                onClick={() =>
                  setFilterOptions({
                    category: 'all',
                    maxPrice: 80000,
                    sortBy: 'featured',
                    searchQuery: ''
                  })
                }
                className="py-2 px-3 rounded border border-stone-300 dark:border-white/15 text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-white/5 transition font-cinzel text-[11px]"
              >
                RESET ALL FILTERS
              </button>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-stone-200 dark:border-white/5 rounded-xl bg-white dark:bg-[#141312]">
            <p className="font-cinzel text-lg text-stone-800 dark:text-stone-300">No items match the selected criteria.</p>
            <p className="text-xs text-stone-500 mt-1">Try resetting the filters to view the full collection.</p>
            <button
              onClick={() => {
                setFilterOptions({
                  category: 'all',
                  maxPrice: 80000,
                  sortBy: 'featured',
                  searchQuery: ''
                });
                setSelectedCategory('all');
              }}
              className="mt-4 px-5 py-2 rounded bg-[#d4af37] text-black font-cinzel text-xs font-semibold"
            >
              View All Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const inWish = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  className="group relative bg-white dark:bg-[#131211] border border-stone-200 dark:border-[#d4af37]/20 hover:border-[#c5a059] dark:hover:border-[#d4af37]/60 rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm dark:shadow-none"
                >
                  {/* Top Image Canvas with Hover Actions */}
                  <div className="relative aspect-square w-full overflow-hidden bg-stone-100 dark:bg-[#0a0a09]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                      }}
                      className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.isBestseller && (
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-cinzel tracking-wider bg-[#d4af37] text-black font-bold">
                          BESTSELLER
                        </span>
                      )}
                      {product.isNew && (
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-cinzel tracking-wider bg-black/75 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/40">
                          NEW ARRIVAL
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition z-10 ${
                        inWish
                          ? 'bg-[#d4af37] text-black shadow-lg'
                          : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80'
                      }`}
                      aria-label={inWish ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                    >
                      <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                    </button>

                    {/* Hover Action Overlay Buttons (Desktop & Tablet) */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="flex-1 py-2 rounded bg-black/80 hover:bg-black text-white text-xs font-cinzel tracking-wider flex items-center justify-center gap-1.5 border border-white/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>QUICK VIEW</span>
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 py-2 rounded bg-[#d4af37] hover:bg-[#e6ca65] text-black text-xs font-cinzel font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>ADD TO BAG</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1.5">
                        <span className="font-cinzel uppercase text-[#8c6b2d] dark:text-[#c5a059] tracking-wider text-[10px]">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#d4af37] fill-current" />
                          <span className="font-mono text-stone-700 dark:text-stone-300">{product.rating}</span>
                          <span className="text-stone-400 dark:text-stone-500">({product.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 
                        onClick={() => setQuickViewProduct(product)}
                        className="font-cormorant text-xl font-normal text-[#171513] dark:text-[#f5f2eb] hover:text-[#c5a059] dark:hover:text-[#d4af37] transition cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      {/* Subtitle / Spec summary */}
                      <p className="text-xs text-stone-500 dark:text-stone-400 font-sans font-light mt-0.5 line-clamp-1">
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-cinzel text-base font-semibold text-[#171513] dark:text-[#fbfaf8]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-stone-400 dark:text-stone-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* WhatsApp Instant Order link & Mobile Cart Button */}
                      <div className="flex items-center gap-1.5">
                        <a
                          href={getDirectWhatsAppUrl(product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#1b9e4b] dark:text-[#25D366] border border-[#25D366]/40 transition"
                          title="Instant order via WhatsApp"
                          aria-label={`Order ${product.name} directly on WhatsApp`}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => addToCart(product)}
                          className="md:hidden p-2 rounded-full bg-[#d4af37] text-black hover:bg-[#e6ca65] transition"
                          aria-label={`Add ${product.name} to bag`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
