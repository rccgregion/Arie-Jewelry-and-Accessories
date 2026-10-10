import React from 'react';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setSelectedCategory,
    setActivePage
  } = useShop();

  const handleHomeClick = () => {
    setActivePage('shop');
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    setActivePage('shop');
    setTimeout(() => {
      const el = document.getElementById('categories-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleWishlistClick = () => {
    setActivePage('shop');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0d0c0b]/96 backdrop-blur-lg border-t border-stone-200 dark:border-[#d4af37]/25 pb-safe text-stone-800 dark:text-[#f5f2eb] transition-colors duration-200"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 px-2">
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center w-14 py-1 text-stone-500 hover:text-[#8c6b2d] dark:text-stone-400 dark:hover:text-[#d4af37] focus:outline-none"
          aria-label="Home"
        >
          <Home className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[9px] font-cinzel mt-0.5 tracking-wider">HOME</span>
        </button>

        {/* Categories */}
        <button
          onClick={handleCategoriesClick}
          className="flex flex-col items-center justify-center w-14 py-1 text-stone-500 hover:text-[#8c6b2d] dark:text-stone-400 dark:hover:text-[#d4af37] focus:outline-none"
          aria-label="Categories"
        >
          <Compass className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[9px] font-cinzel mt-0.5 tracking-wider">EXPLORE</span>
        </button>

        {/* Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center w-14 py-1 text-stone-500 hover:text-[#8c6b2d] dark:text-stone-400 dark:hover:text-[#d4af37] focus:outline-none"
          aria-label="Search"
        >
          <Search className="w-5 h-5 stroke-[1.6]" />
          <span className="text-[9px] font-cinzel mt-0.5 tracking-wider">SEARCH</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={handleWishlistClick}
          className="relative flex flex-col items-center justify-center w-14 py-1 text-stone-500 hover:text-[#8c6b2d] dark:text-stone-400 dark:hover:text-[#d4af37] focus:outline-none"
          aria-label={`Wishlist (${wishlist.length} saved)`}
        >
          <Heart className="w-5 h-5 stroke-[1.6]" />
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[9px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
          <span className="text-[9px] font-cinzel mt-0.5 tracking-wider">SAVED</span>
        </button>

        {/* Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center w-14 py-1 text-stone-500 hover:text-[#8c6b2d] dark:text-stone-400 dark:hover:text-[#d4af37] focus:outline-none"
          aria-label={`Bag (${cartCount} items)`}
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[9px] font-cinzel mt-0.5 tracking-wider">BAG</span>
        </button>
      </div>
    </nav>
  );
};
