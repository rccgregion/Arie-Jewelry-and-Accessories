import React, { useState, useRef } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  Sparkles,
  WifiOff,
  Globe
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Category, Currency } from '../types';
import { ARIE_LOGO_DATA_URI } from '../data/logo';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    setIsVIPModalOpen,
    selectedCategory,
    setSelectedCategory,
    setFilterOptions,
    isOnline,
    vipTier
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Swipe gesture for mobile drawer
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    // Swiped left by > 60px closes the drawer
    if (diff < -60) {
      setIsMobileMenuOpen(false);
      touchStartX.current = null;
    }
  };

  const handleCategoryClick = (cat: Category) => {
    setActivePage('shop');
    setFilterOptions(prev => ({ ...prev, searchQuery: '', material: undefined }));
    setSelectedCategory(cat);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        const yOffset = -70;
        const y = catalogEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 80);
  };

  const handleAboutClick = () => {
    setActivePage('about');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navCategories: { id: Category; label: string }[] = [
    { id: 'watches', label: 'WATCHES' },
    { id: 'jewelry', label: 'JEWELRY' },
    { id: 'accessories', label: 'ACCESSORIES' },
    { id: 'jerseys', label: 'JERSEYS' },
    { id: 'new-arrivals', label: 'NEW ARRIVALS' }
  ];

  const currencies: Currency[] = ['NGN', 'USD', 'GBP', 'EUR'];

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <aside aria-label="Announcement" className="relative z-40 bg-[#070606] text-[#e6ca65] border-b border-[#d4af37]/20 text-[11px] sm:text-xs py-2 px-3 tracking-widest font-cinzel">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1 text-center font-medium flex items-center justify-center gap-2">
            <span className="text-[#d4af37]">✦</span>
            <span>NATIONWIDE DELIVERY ACROSS NIGERIA · AUTHENTIC, AFFORDABLE &amp; ELEGANT</span>
            <span className="text-[#d4af37] hidden sm:inline">✦</span>
          </div>

          <div className="flex items-center gap-3 font-sans text-xs">
            {/* WhatsApp Quick Chat */}
            <a
              href="https://wa.me/2348164907596"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-[#25D366] hover:text-[#42e47e] font-sans font-medium text-[11px]"
              title="Chat with Arie Jewelry on WhatsApp"
            >
              <span>WhatsApp: 08164907596</span>
            </a>

            {/* Offline indicator if not online */}
            {!isOnline && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <WifiOff className="w-3 h-3" />
                Offline Vault
              </span>
            )}

            {/* Currency Switcher */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-[#f5f2eb]/80 hover:text-[#d4af37] py-0.5 px-1.5 rounded transition"
                aria-label="Change currency"
                aria-expanded={currencyDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="font-medium">{currency}</span>
              </button>

              {currencyDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-24 bg-[#141312] border border-[#d4af37]/30 rounded shadow-2xl py-1 z-50 text-left font-sans text-xs"
                  onMouseLeave={() => setCurrencyDropdownOpen(false)}
                >
                  {currencies.map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left transition flex items-center justify-between ${
                        currency === c ? 'text-[#d4af37] bg-white/5 font-semibold' : 'text-[#f5f2eb]/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{c}</span>
                      {currency === c && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-30 transition-colors duration-200 backdrop-blur-md bg-[#fbfaf8]/95 dark:bg-[#0c0b0a]/95 border-b border-[#c5a059]/20 dark:border-[#d4af37]/15 text-[#171513] dark:text-[#f5f2eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Toggle & Left Nav Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#171513] dark:text-[#f5f2eb] hover:text-[#c5a059] dark:hover:text-[#d4af37] transition focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[11.5px] tracking-[0.16em] font-cinzel font-medium" aria-label="Main Navigation">
              {navCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative py-2 transition-colors ${
                    activePage === 'shop' && selectedCategory === cat.id
                      ? 'text-[#c5a059] dark:text-[#d4af37] font-semibold'
                      : 'text-[#171513]/80 dark:text-[#f5f2eb]/85 hover:text-[#c5a059] dark:hover:text-[#d4af37]'
                  }`}
                >
                  {cat.label}
                  {activePage === 'shop' && selectedCategory === cat.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a059] dark:bg-[#d4af37]" />
                  )}
                </button>
              ))}

              <button
                onClick={handleAboutClick}
                className={`relative py-2 transition-colors ${
                  activePage === 'about'
                    ? 'text-[#c5a059] dark:text-[#d4af37] font-semibold'
                    : 'text-[#171513]/80 dark:text-[#f5f2eb]/85 hover:text-[#c5a059] dark:hover:text-[#d4af37]'
                }`}
              >
                ABOUT
                {activePage === 'about' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c5a059] dark:bg-[#d4af37]" />
                )}
              </button>
            </nav>
          </div>

          {/* Center Brand Identity: ARIE JEWELRY AND ACCESSORIES */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => handleCategoryClick('all')}>
            <img
              src={ARIE_LOGO_DATA_URI}
              alt="Arie Jewelry and Accessories Logo"
              onError={(e) => {
                e.currentTarget.src = '/images/arie-logo.png';
              }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-contain bg-black/5 dark:bg-white/5 p-0.5 border border-[#c5a059]/40 dark:border-[#d4af37]/30 shadow-sm"
            />
            <div className="flex flex-col items-start justify-center">
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#171513] dark:text-[#f5f2eb] dark:gold-gradient-text drop-shadow-sm leading-tight">
                ARIE
              </span>
              <span className="font-sans text-[7.5px] sm:text-[8.5px] font-semibold tracking-[0.34em] text-[#8c6b2d] dark:text-[#c5a059] uppercase -mt-0.5">
                JEWELRY &amp; ACCESSORIES
              </span>
            </div>
          </div>

          {/* Right Action Icons (Search, Theme, VIP, Wishlist, Cart) */}
          <div className="flex items-center gap-3 sm:gap-4.5 text-[#171513] dark:text-[#f5f2eb]">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-[#c5a059] dark:hover:text-[#d4af37] transition rounded-full focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              aria-label="Search catalog"
              title="Search (Cmd+K)"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative p-2 hover:text-[#c5a059] dark:hover:text-[#d4af37] transition rounded-full focus:outline-none focus:ring-1 focus:ring-[#d4af37] hidden sm:block"
              aria-label={`Wishlist (${wishlist.length} items)`}
              title="View Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[9.5px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:text-[#c5a059] dark:hover:text-[#d4af37] transition rounded-full focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 stroke-[1.75] text-[#d4af37]" />
              ) : (
                <Moon className="w-5 h-5 stroke-[1.75] text-[#8c7438]" />
              )}
            </button>

            {/* VIP Concierge / Account */}
            <button
              onClick={() => setIsVIPModalOpen(true)}
              className="relative p-2 hover:text-[#c5a059] dark:hover:text-[#d4af37] transition rounded-full focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              aria-label="VIP Account and Privilege status"
              title="Maison VIP Status"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
              <span className="sr-only">VIP Status: {vipTier.name}</span>
            </button>

            {/* Luxury Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-[#c5a059] dark:hover:text-[#d4af37] transition rounded-full focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              aria-label={`Shopping bag containing ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[10px] font-bold flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Gesture Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content with swipe listener */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="relative w-4/5 max-w-sm bg-[#ffffff] dark:bg-[#121110] border-r border-[#c5a059]/30 dark:border-[#d4af37]/30 h-full p-6 flex flex-col justify-between text-[#171513] dark:text-[#f5f2eb] z-10 shadow-2xl transition-transform"
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#c5a059]/20 dark:border-[#d4af37]/20">
                <div className="flex items-center gap-2">
                  <img
                    src={ARIE_LOGO_DATA_URI}
                    alt="Arie Logo"
                    onError={(e) => {
                      e.currentTarget.src = '/images/arie-logo.png';
                    }}
                    className="w-8 h-8 rounded-full object-contain bg-black/5 dark:bg-white/5 p-0.5 border border-[#c5a059]/40"
                  />
                  <div className="flex flex-col">
                    <span className="font-cinzel text-lg tracking-[0.2em] font-bold text-[#171513] dark:text-white">ARIE</span>
                    <span className="font-sans text-[7.5px] tracking-[0.34em] text-[#8c6b2d] dark:text-[#c5a059]">JEWELRY &amp; ACCESSORIES</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white rounded"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation items */}
              <nav className="mt-8 flex flex-col gap-4 font-cinzel text-sm tracking-widest">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`text-left py-2 px-1 border-b border-stone-200 dark:border-white/5 transition flex items-center justify-between ${
                    selectedCategory === 'all' ? 'text-[#c5a059] dark:text-[#d4af37] font-bold' : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span>COMPLETE COLLECTION</span>
                  <span className="text-xs">→</span>
                </button>
                {navCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`text-left py-2 px-1 border-b border-stone-200 dark:border-white/5 transition flex items-center justify-between ${
                      activePage === 'shop' && selectedCategory === cat.id ? 'text-[#c5a059] dark:text-[#d4af37] font-bold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs">→</span>
                  </button>
                ))}
                <button
                  onClick={handleAboutClick}
                  className={`text-left py-2 px-1 border-b border-stone-200 dark:border-white/5 transition flex items-center justify-between ${
                    activePage === 'about' ? 'text-[#c5a059] dark:text-[#d4af37] font-bold' : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span>ABOUT OUR STORY</span>
                  <span className="text-xs">→</span>
                </button>
              </nav>

              {/* Quick VIP summary in mobile drawer */}
              <div className="mt-8 p-4 rounded bg-stone-50 dark:bg-[#1a1918] border border-[#c5a059]/30 dark:border-[#d4af37]/25">
                <div className="flex items-center gap-2 text-xs text-[#d4af37] font-cinzel">
                  <Sparkles className="w-4 h-4" />
                  <span>VIP PRIVILEGE: {vipTier.name}</span>
                </div>
                <p className="text-stone-400 text-xs mt-1 font-sans">
                  Enjoy {vipTier.discountPct}% patronage privilege on all fine creations.
                </p>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsVIPModalOpen(true);
                  }}
                  className="mt-3 text-[11px] font-sans font-semibold text-[#d4af37] hover:underline"
                >
                  Manage Membership →
                </button>
              </div>
            </div>

            {/* Drawer Footer with swipe hint */}
            <div className="pt-6 border-t border-white/10 text-xs text-stone-400 font-sans flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Theme</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1 bg-white/10 rounded text-xs text-stone-200"
                >
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>
              <p className="text-[10px] text-stone-500 text-center mt-3">
                ← Swipe left to close drawer
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
