import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = useShop();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 md:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-[#1a1712] border border-amber-500/50 px-3.5 py-2 text-xs font-sans text-amber-200 shadow-2xl backdrop-blur-md"
    >
      <div className="relative flex items-center justify-center">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
      </div>
      <div>
        <span className="font-semibold text-amber-300">Offline Vault Active</span>
        <span className="text-amber-200/80 hidden sm:inline"> — Catalog, cart &amp; wishlist available offline.</span>
      </div>
    </div>
  );
};
