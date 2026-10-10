import React from 'react';
import { X, Award, MapPin, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BUSINESS_INFO } from '../data/products';

export const VIPModal: React.FC = () => {
  const { isVIPModalOpen, setIsVIPModalOpen, vipTier, orders, formatPrice } = useShop();

  if (!isVIPModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vip-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => setIsVIPModalOpen(false)}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121110] border border-stone-300 dark:border-[#d4af37]/40 rounded-2xl text-stone-900 dark:text-[#f5f2eb] shadow-2xl p-6 sm:p-8 my-auto z-10 max-h-[92vh] overflow-y-auto transition-colors duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-200 dark:border-[#d4af37]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#d4af37] bg-[#d4af37]/10 flex items-center justify-center text-[#8c6b2d] dark:text-[#d4af37]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinzel text-[10px] tracking-[0.24em] text-[#8c6b2d] dark:text-[#d4af37] uppercase">PATRONAGE PRIVILEGES</span>
              <h2 id="vip-modal-title" className="font-cormorant text-2xl text-stone-900 dark:text-white font-normal mt-0.5">
                The Arie Circle
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsVIPModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-black dark:hover:text-white rounded transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current VIP Status Card */}
        <div className="my-6 p-5 rounded-xl bg-stone-100 dark:bg-gradient-to-r dark:from-[#1c1a17] dark:via-[#24211d] dark:to-[#1a1815] border border-stone-300 dark:border-[#d4af37]/35 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#8c6b2d] dark:text-[#d4af37] uppercase">MEMBERSHIP TIER</span>
              <h3 className="font-cinzel text-xl text-stone-900 dark:text-white font-bold tracking-wider mt-0.5">
                {vipTier.name}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-cinzel font-semibold bg-[#d4af37] text-black shadow-sm">
              {vipTier.discountPct}% PRIVILEGE DISCOUNT
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 font-sans">
            <span>Total Patronage:</span>
            <span className="font-mono text-stone-900 dark:text-white font-semibold">{formatPrice(vipTier.points)}</span>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-4">
          <h3 className="font-cinzel text-xs tracking-wider text-[#8c6b2d] dark:text-[#d4af37] uppercase">
            YOUR RECENT ORDERS ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div className="p-6 rounded-lg bg-stone-50 dark:bg-[#161514] border border-stone-200 dark:border-white/5 text-center text-xs text-stone-500 dark:text-stone-400">
              No orders registered yet. Confirmed purchases are automatically recorded in your offline-ready device vault.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-lg bg-stone-50 dark:bg-[#161514] border border-stone-200 dark:border-[#d4af37]/20 text-xs font-sans space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/5 pb-2">
                    <span className="font-mono font-bold text-stone-900 dark:text-white">{o.id}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{o.status}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                    <span>Date: {o.date}</span>
                    <span className="font-mono text-stone-900 dark:text-white">{formatPrice(o.total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-stone-500 dark:text-stone-400">Tracking Reference:</span>
                    <span className="font-mono text-[#8c6b2d] dark:text-[#d4af37]">{o.trackingNumber}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direct Concierge & Boutique Address */}
        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-white/10 space-y-3">
          <h3 className="font-cinzel text-xs tracking-wider text-[#8c6b2d] dark:text-[#d4af37] uppercase">
            CONCIERGE &amp; STORE LOCATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans text-stone-600 dark:text-stone-300">
            <a
              href={BUSINESS_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded bg-stone-50 dark:bg-[#161514] border border-[#25D366]/40 hover:border-[#25D366] flex items-center gap-2.5 transition"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <div>
                <p className="font-semibold text-stone-900 dark:text-white">Direct WhatsApp</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">{BUSINESS_INFO.whatsapp} (Instant Chat)</p>
              </div>
            </a>

            <div className="p-3 rounded bg-stone-50 dark:bg-[#161514] border border-stone-200 dark:border-white/5 flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#8c6b2d] dark:text-[#d4af37]" />
              <div>
                <p className="font-semibold text-stone-900 dark:text-white">Store Location</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">{BUSINESS_INFO.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsVIPModalOpen(false)}
            className="px-6 py-2 rounded bg-stone-200 hover:bg-stone-300 dark:bg-white/10 dark:hover:bg-white/20 text-stone-900 dark:text-white font-cinzel text-xs tracking-wider transition"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
