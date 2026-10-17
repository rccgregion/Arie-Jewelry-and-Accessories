import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, categories, setQuickViewProduct, formatPrice, setSelectedCategory } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results: Product[] = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        const catObj = categories.find((c) => c.id === p.category || c.slug === p.category);
        const categoryName = catObj ? catObj.name.toLowerCase() : '';
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          categoryName.includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          p.materials.some((m) => m.toLowerCase().includes(q))
        );
      })
    : [];

  const quickSearches = [
    'Royal Chronos Watch',
    'Gold Medallion',
    'Cufflinks & Lapel',
    'Club Jersey',
    'Sparkle Ring'
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Search Arie Jewelry Collection"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#141312] border border-stone-300 dark:border-[#d4af37]/40 rounded-2xl text-stone-900 dark:text-[#f5f2eb] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 transition-colors duration-200">
        
        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8c6b2d] dark:text-[#d4af37] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search watches, jewelry, cufflinks, jerseys..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white rounded border border-stone-300 dark:border-white/10 text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestions when empty */}
        {!query.trim() && (
          <div className="p-6">
            <p className="text-xs font-cinzel text-stone-500 dark:text-stone-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8c6b2d] dark:text-[#d4af37]" />
              POPULAR SEARCHES
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-white/5 dark:hover:bg-white/10 border border-stone-200 dark:border-white/10 hover:border-[#d4af37] text-xs text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query.trim() && (
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs font-sans">
                No creations found matching "{query}".
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setQuickViewProduct(product);
                    setIsSearchOpen(false);
                  }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] border border-stone-200 dark:border-white/5 hover:border-[#c5a059] dark:hover:border-[#d4af37]/40 transition cursor-pointer group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                    }}
                    className="w-14 h-14 rounded-lg object-cover bg-stone-200 dark:bg-black flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-[9.5px] text-[#8c6b2d] dark:text-[#d4af37] tracking-wider uppercase">
                        {categories.find((c) => c.id === product.category || c.slug === product.category)?.name || product.category}
                      </span>
                      {product.isNew && (
                        <span className="text-[9px] text-stone-500">· New</span>
                      )}
                    </div>
                    <h4 className="font-cormorant text-base text-stone-900 dark:text-white truncate font-medium group-hover:text-[#c5a059] dark:group-hover:text-[#d4af37] transition">
                      {product.name}
                    </h4>
                    <p className="font-sans text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-cinzel text-sm font-semibold text-stone-900 dark:text-white">
                      {formatPrice(product.price)}
                    </p>
                    <span className="text-[10px] text-stone-400 flex items-center justify-end gap-1 group-hover:text-[#8c6b2d] dark:group-hover:text-[#d4af37]">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};
