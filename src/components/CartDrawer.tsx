import React, { useState, useRef } from 'react';
import { X, Trash2, Plus, Minus, Gift, ArrowRight, ShieldCheck, Tag, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    removeFromCart,
    updateQuantity,
    toggleGiftWrap,
    formatPrice,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen,
    getWhatsAppOrderUrl
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // Swipe gesture to close drawer (swiping right closes drawer)
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    if (diff > 70) {
      setIsCartOpen(false);
      touchStartX.current = null;
    }
  };

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="relative w-full max-w-md bg-white dark:bg-[#121110] border-l border-stone-200 dark:border-[#d4af37]/30 h-full flex flex-col justify-between text-[#171513] dark:text-[#f5f2eb] z-10 shadow-2xl pb-safe transition-colors duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 dark:border-[#d4af37]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel text-base tracking-[0.2em] text-[#171513] dark:text-[#fbfaf8]">
              SHOPPING BAG
            </h2>
            <span className="text-xs font-mono text-[#8c6b2d] dark:text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/30">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-500 hover:text-black dark:text-stone-400 dark:hover:text-white rounded transition"
            aria-label="Close shopping bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-stone-100 dark:bg-[#1c1b18] px-6 py-2.5 border-b border-stone-200 dark:border-white/5 flex items-center justify-between text-xs text-[#8c6b2d] dark:text-[#d4af37] font-cinzel">
          <span>NATIONWIDE DELIVERY ACROSS NIGERIA</span>
          <span className="text-[10px] text-stone-500 dark:text-stone-400 font-sans">INSURED</span>
        </div>

        {/* Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full border border-stone-300 dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-stone-400">
                <Gift className="w-8 h-8 stroke-[1]" />
              </div>
              <p className="font-cinzel text-stone-700 dark:text-stone-300 tracking-wider">YOUR BAG IS EMPTY</p>
              <p className="text-xs text-stone-500 font-sans mt-1">Discover our timeless creations to begin.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2.5 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel text-xs font-semibold tracking-wider rounded"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.monogram || ''}`}
                className="flex gap-4 pb-6 border-b border-stone-100 dark:border-white/5"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded bg-stone-100 dark:bg-[#0a0a09] overflow-hidden flex-shrink-0 border border-stone-200 dark:border-white/10">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-cormorant text-base text-[#171513] dark:text-white leading-tight font-medium">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-red-500 p-0.5 transition"
                        aria-label={`Remove ${item.product.name} from bag`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans mt-0.5">
                      {item.selectedColor ? `Color: ${item.selectedColor}` : item.product.subtitle}
                    </p>

                    {item.monogram && (
                      <p className="text-[10px] text-[#8c6b2d] dark:text-[#d4af37] font-mono mt-0.5">
                        Note/Size: "{item.monogram}"
                      </p>
                    )}
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-stone-200 dark:border-white/15 rounded">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white px-2"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white px-2"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-cinzel text-xs font-semibold text-[#171513] dark:text-white">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 dark:border-[#d4af37]/20 bg-stone-50 dark:bg-[#0e0d0c] space-y-4">
            {/* Promo Code input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between px-3 py-2 rounded bg-stone-200/60 dark:bg-[#1f1d19] border border-stone-300 dark:border-[#d4af37]/40 text-xs">
                  <div className="flex items-center gap-2 text-[#8c6b2d] dark:text-[#d4af37]">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono font-bold">{appliedPromo}</span>
                    <span className="text-stone-500 dark:text-stone-400">(-{formatPrice(cartDiscount)})</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-600 dark:text-stone-400 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Discount code (e.g. WELCOME5)"
                    className="flex-1 bg-white dark:bg-[#161514] border border-stone-300 dark:border-white/10 rounded px-3 py-1.5 text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-200 dark:bg-white/10 hover:bg-stone-300 dark:hover:bg-white/20 text-xs font-cinzel text-stone-900 dark:text-white rounded transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-red-500 dark:text-red-400 mt-1">{promoError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs font-sans text-stone-600 dark:text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-[#8c6b2d] dark:text-[#d4af37] font-medium font-cinzel text-[11px]">NATIONWIDE AVAILABLE</span>
              </div>
              <div className="flex justify-between text-sm font-cinzel font-semibold text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-white/10">
                <span>TOTAL</span>
                <span className="font-mono text-[#8c6b2d] dark:text-[#fbfaf8]">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* WhatsApp Direct Order CTA (Recommended for Nigeria) */}
            <a
              href={getWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-black font-sans font-bold tracking-wide text-xs uppercase rounded transition shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>ORDER VIA WHATSAPP (INSTANT)</span>
            </a>

            {/* Standard Online Checkout CTA */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel font-semibold tracking-[0.16em] text-xs uppercase rounded transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <span>PAY ONLINE / BANK TRANSFER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Micro reassurance */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8c6b2d] dark:text-[#d4af37]" />
              <span>Safe payment & verified delivery across Nigeria</span>
            </div>
            
            <p className="text-[9.5px] text-stone-400 dark:text-stone-500 text-center">
              Swipe right to dismiss drawer →
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
