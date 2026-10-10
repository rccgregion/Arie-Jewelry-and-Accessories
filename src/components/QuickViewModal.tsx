import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Check,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice
  } = useShop();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [monogram, setMonogram] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [isZoomed, setIsZoomed] = useState(false);

  // Swipe gesture for mobile modal image gallery
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIdx(0);
      setQuantity(1);
      setMonogram('');
      setIsZoomed(false);
      if (quickViewProduct.colors && quickViewProduct.colors.length > 0) {
        setSelectedColor(quickViewProduct.colors[0].name);
      } else {
        setSelectedColor(undefined);
      }
    }
  }, [quickViewProduct]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const inWish = isInWishlist(quickViewProduct.id);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    if (diff > 50) {
      setActiveImageIdx(prev => (prev === 0 ? quickViewProduct.images.length - 1 : prev - 1));
      touchStartX.current = null;
    } else if (diff < -50) {
      setActiveImageIdx(prev => (prev === quickViewProduct.images.length - 1 ? 0 : prev + 1));
      touchStartX.current = null;
    }
  };

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity, monogram.trim() || undefined, selectedColor);
    setQuickViewProduct(null);
  };

  const getDirectWhatsAppUrl = () => {
    const note = monogram ? ` (Custom/Size: ${monogram})` : '';
    const text = encodeURIComponent(
      `Hello Arie Jewelry, I would like to order "${quickViewProduct.name}" (Qty: ${quantity}, Total: ${formatPrice(quickViewProduct.price * quantity)})${note}. Please confirm delivery.`
    );
    return `https://wa.me/2348164907596?text=${text}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setQuickViewProduct(null)}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121110] border border-stone-300 dark:border-[#d4af37]/40 rounded-2xl text-stone-900 dark:text-[#f5f2eb] shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col md:flex-row transition-colors duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-stone-200/80 hover:bg-stone-300 dark:bg-black/60 dark:hover:bg-black text-stone-700 dark:text-white hover:text-[#d4af37] border border-stone-300 dark:border-white/10 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Swipeable Gallery with Zoom */}
        <div className="w-full md:w-1/2 bg-stone-100 dark:bg-[#090807] flex flex-col justify-between p-4 sm:p-6 border-b md:border-b-0 md:border-r border-stone-200 dark:border-[#d4af37]/20">
          {/* Main Visual */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onClick={() => setIsZoomed(!isZoomed)}
            className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-200 dark:bg-black flex items-center justify-center cursor-zoom-in group select-none shadow-inner"
          >
            <img
              src={quickViewProduct.images[activeImageIdx]}
              alt={`${quickViewProduct.name} - View ${activeImageIdx + 1}`}
              onError={(e) => {
                e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
              }}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105'
              }`}
            />

            {/* Nav Arrows */}
            {quickViewProduct.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(prev => (prev === 0 ? quickViewProduct.images.length - 1 : prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 transition"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(prev => (prev === quickViewProduct.images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black text-white border border-white/20 transition"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Micro swipe hint for mobile */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-sans text-stone-300 bg-black/70 px-2 py-0.5 rounded pointer-events-none md:hidden">
              Swipe to switch view · Tap to zoom
            </div>
          </div>

          {/* Thumbnails list */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 justify-center overflow-x-auto no-scrollbar py-1">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                    activeImageIdx === idx ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
              <span className="font-cinzel text-[#8c6b2d] dark:text-[#d4af37] tracking-[0.2em] uppercase">
                {quickViewProduct.category} · {quickViewProduct.sku}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#d4af37] fill-current" />
                <span className="font-mono text-stone-800 dark:text-white">{quickViewProduct.rating}</span>
                <span className="text-stone-400 dark:text-stone-500">({quickViewProduct.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h2 id="quickview-title" className="font-cormorant text-2xl sm:text-3xl text-stone-900 dark:text-white font-normal leading-tight">
              {quickViewProduct.name}
            </h2>
            <p className="font-sans text-xs text-stone-600 dark:text-stone-400 mt-1">
              {quickViewProduct.subtitle}
            </p>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-cinzel text-2xl font-semibold text-[#171513] dark:text-[#fbfaf8]">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-stone-400 dark:text-stone-500 line-through">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
              <span className="text-[11px] font-sans text-emerald-600 dark:text-emerald-400 ml-auto flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                In Stock ({quickViewProduct.stockCount} remaining)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans font-light leading-relaxed mt-4">
              {quickViewProduct.description}
            </p>

            {/* Craftsmanship & Origin */}
            <div className="mt-4 p-3.5 rounded-lg bg-stone-100 dark:bg-[#1a1918] border border-stone-200 dark:border-[#d4af37]/20 text-xs">
              <p className="font-cinzel text-[#8c6b2d] dark:text-[#d4af37] font-medium tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                MAISON CRAFTSMANSHIP
              </p>
              <p className="text-stone-600 dark:text-stone-300 font-sans leading-relaxed text-[11px]">
                {quickViewProduct.craftsmanship}
              </p>
            </div>

            {/* Specifications & Materials */}
            <div className="mt-4 space-y-2 text-xs font-sans">
              <p className="font-cinzel text-stone-500 dark:text-stone-400 tracking-wider text-[11px]">MATERIALS &amp; ATTRIBUTES</p>
              <div className="flex flex-wrap gap-1.5">
                {quickViewProduct.materials.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-200 text-[11px]">
                    {m}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                <span className="text-stone-700 dark:text-stone-300">Dimensions:</span> {quickViewProduct.dimensions}
              </p>
            </div>

            {/* Color selector if applicable */}
            {quickViewProduct.colors && (
              <div className="mt-4">
                <label className="text-xs font-cinzel text-stone-500 dark:text-stone-400 tracking-wider block mb-1.5">
                  COLOR SELECTION: <span className="text-stone-900 dark:text-white font-semibold">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        selectedColor === c.name ? 'border-[#d4af37] scale-110 shadow-lg' : 'border-stone-300 dark:border-transparent opacity-70'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={`Select color ${c.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bespoke Monogramming Option */}
            <div className="mt-4">
              <label htmlFor="monogram-input" className="text-xs font-cinzel text-stone-500 dark:text-stone-400 tracking-wider block mb-1">
                SIZE / MONOGRAM / NOTE (OPTIONAL)
              </label>
              <input
                id="monogram-input"
                type="text"
                maxLength={20}
                value={monogram}
                onChange={(e) => setMonogram(e.target.value)}
                placeholder="e.g. Ring size 8, or Jersey Size L"
                className="w-full bg-white dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-stone-200 dark:border-white/10 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Adjuster */}
              <div className="flex items-center border border-stone-300 dark:border-white/20 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 font-mono text-xs text-stone-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAdd}
                className="flex-1 py-3 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel font-semibold tracking-[0.16em] text-xs uppercase rounded transition shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO BAG · {formatPrice(quickViewProduct.price * quantity)}</span>
              </button>

              {/* WhatsApp Quick Order Link */}
              <a
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#1b9e4b] dark:text-[#25D366] border border-[#25D366]/50 transition flex items-center justify-center"
                title="Instant order via WhatsApp"
                aria-label="Order on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>

              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(quickViewProduct)}
                className={`p-3 rounded border transition ${
                  inWish
                    ? 'bg-[#d4af37] text-black border-[#d4af37]'
                    : 'border-stone-300 dark:border-white/20 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white hover:border-[#d4af37]'
                }`}
                aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Reassurance strip */}
            <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-sans pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#8c6b2d] dark:text-[#d4af37]" />
                Nationwide Delivery across Nigeria
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8c6b2d] dark:text-[#d4af37]" />
                Authenticity Guarantee
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
