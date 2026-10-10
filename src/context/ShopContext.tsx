import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, WishlistItem, Order, Currency, Category, FilterOptions, ActivePage } from '../types';
import { PRODUCTS, CURRENCY_RATES } from '../data/products';

interface ShopContextType {
  // Navigation
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  // Theme & Currency
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number) => string;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, monogram?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleGiftWrap: (productId: string) => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;
  appliedPromo: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Catalog & Filters
  products: Product[];
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  filteredProducts: Product[];
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isDocsOpen: boolean;
  setIsDocsOpen: (open: boolean) => void;
  isVIPModalOpen: boolean;
  setIsVIPModalOpen: (open: boolean) => void;

  // Orders & VIP
  orders: Order[];
  createOrder: (shippingDetails: Order['shippingDetails'], deliveryMethod: string, paymentMethod: string) => Order;
  vipTier: { name: string; discountPct: number; points: number; badgeColor: string };

  // Toast & Offline
  isOnline: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // WhatsApp order link generator
  getWhatsAppOrderUrl: (customNote?: string) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'arie_theme',
  CURRENCY: 'arie_currency_v3',
  CART: 'arie_cart_v3',
  WISHLIST: 'arie_wishlist_v3',
  ORDERS: 'arie_orders_v3',
  PROMO: 'arie_promo_v3'
};

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation: 'shop' or 'about'
  const [activePage, setActivePageState] = useState<ActivePage>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash.toLowerCase() === '#about') return 'about';
    }
    return 'shop';
  });

  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page === 'about' ? 'about' : '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.toLowerCase() === '#about') {
        setActivePageState('about');
      } else {
        setActivePageState('shop');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Theme state: default dark, supports light mode toggle
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) || localStorage.getItem('luxora_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  // Currency: Default NGN for Arie Jewelry
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (saved && CURRENCY_RATES[saved]) return saved as Currency;
    }
    return 'NGN';
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.CART);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Promo Code
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.PROMO);
    }
    return null;
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isVIPModalOpen, setIsVIPModalOpen] = useState(false);

  // Filters & Navigation
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'all',
    maxPrice: 80000,
    sortBy: 'featured',
    searchQuery: ''
  });

  // Online status
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Online/Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Network restored — synced with Luxora Vault.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline Mode active — browsing cached collection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme synchronization with DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);

    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(theme);
      document.body.setAttribute('data-theme', theme);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      localStorage.setItem('luxora_theme', theme);
    } catch {}
  }, [theme]);

  // Persist Currency
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Persist Orders
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Persist Promo
  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem(STORAGE_KEYS.PROMO, appliedPromo);
    } else {
      localStorage.removeItem(STORAGE_KEYS.PROMO);
    }
  }, [appliedPromo]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const formatPrice = (amountInUSD: number): string => {
    const curConfig = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
    const converted = amountInUSD * curConfig.rate;
    const formatted = Math.round(converted).toLocaleString('en-US');
    return `${curConfig.symbol}${formatted}`;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, monogram?: string, selectedColor?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.monogram === monogram);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, monogram, selectedColor, giftWrap: true }];
    });
    showToast(`Added "${product.name}" to your bag.`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from bag.');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleGiftWrap = (productId: string) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, giftWrap: !item.giftWrap } : item
      )
    );
  };

  // Promo code validation
  const applyPromoCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ARIE10' || normalized === 'LUXURY10') {
      setAppliedPromo('ARIE10');
      showToast('10% Arie Circle Privilege applied.');
      return { success: true, message: '10% privilege applied to your order.' };
    }
    if (normalized === 'WELCOME5') {
      setAppliedPromo('WELCOME5');
      showToast('5% Welcome Patron voucher applied.');
      return { success: true, message: '5% welcome voucher applied.' };
    }
    if (normalized === 'VIPGOLD') {
      setAppliedPromo('VIPGOLD');
      showToast('₦5,000 Gold Patron voucher applied.');
      return { success: true, message: '₦5,000 voucher applied.' };
    }
    return { success: false, message: 'Invalid or expired invitation code. Try ARIE10 or WELCOME5.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Privilege code removed.');
  };

  // Calculate cart financials
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let cartDiscount = 0;
  if (appliedPromo === 'ARIE10' || appliedPromo === 'LUXURY10') {
    cartDiscount = Math.round(cartSubtotal * 0.1);
  } else if (appliedPromo === 'WELCOME5') {
    cartDiscount = Math.round(cartSubtotal * 0.05);
  } else if (appliedPromo === 'VIPGOLD') {
    cartDiscount = Math.min(cartSubtotal, 5000);
  }

  // Worldwide / Nationwide complimentary shipping as per banner
  const cartShipping = 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  // WhatsApp Order URL Generator
  const getWhatsAppOrderUrl = (customNote?: string) => {
    const lines = [
      `Hello Arie Jewelry and Accessories, I want to place an order from your website:`,
      ''
    ];
    if (cart.length === 0 && customNote) {
      lines.push(`Inquiry: ${customNote}`);
    } else {
      cart.forEach((item, idx) => {
        lines.push(`${idx + 1}. ${item.product.name} (Qty: ${item.quantity}) - ₦${(item.product.price * item.quantity).toLocaleString()}`);
      });
      lines.push('');
      lines.push(`Total Amount: ₦${cartTotal.toLocaleString()}`);
      if (customNote) lines.push(`Delivery Note: ${customNote}`);
    }
    lines.push('');
    lines.push(`Please confirm availability and bank transfer / payment details. Thank you!`);
    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/2348164907596?text=${encoded}`;
  };

  // Wishlist operations
  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist(prev => prev.filter(item => item.product.id !== product.id));
      showToast(`Removed from your Wishlist.`);
    } else {
      setWishlist(prev => [...prev, { product, addedAt: new Date().toISOString() }]);
      showToast(`Saved "${product.name}" to your Wishlist.`);
    }
  };

  // Orders creation
  const createOrder = (
    shippingDetails: Order['shippingDetails'],
    deliveryMethod: string,
    paymentMethod: string
  ): Order => {
    const newOrder: Order = {
      id: `LX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping: cartShipping,
      tax: Math.round(cartSubtotal * 0.08),
      total: cartTotal + Math.round(cartSubtotal * 0.08),
      currency,
      status: 'Confirmed',
      trackingNumber: `LX-EXP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      shippingDetails,
      deliveryMethod,
      paymentMethod
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setAppliedPromo(null);
    return newOrder;
  };

  // VIP Tier calculation
  const totalLifetimeSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const vipTier = (() => {
    if (totalLifetimeSpent >= 250000) {
      return { name: 'Elite Ambassador', discountPct: 15, points: totalLifetimeSpent, badgeColor: 'bg-amber-400 text-black' };
    }
    if (totalLifetimeSpent >= 100000) {
      return { name: 'Gold Circle Member', discountPct: 10, points: totalLifetimeSpent, badgeColor: 'bg-[#d4af37] text-black' };
    }
    return { name: 'Arie Patron', discountPct: 5, points: totalLifetimeSpent, badgeColor: 'bg-stone-700 text-stone-100' };
  })();

  // Filtered products list
  const filteredProducts = PRODUCTS.filter(prod => {
    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'new-arrivals') {
        if (!prod.isNew) return false;
      } else if (prod.category !== selectedCategory) {
        return false;
      }
    }

    // Material filter
    if (filterOptions.material && filterOptions.material !== 'all') {
      const hasMat = prod.materials.some(m =>
        m.toLowerCase().includes(filterOptions.material!.toLowerCase())
      );
      if (!hasMat) return false;
    }

    // Search query
    if (filterOptions.searchQuery && filterOptions.searchQuery.trim() !== '') {
      const q = filterOptions.searchQuery.toLowerCase();
      const match =
        prod.name.toLowerCase().includes(q) ||
        prod.subtitle.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q) ||
        prod.category.toLowerCase().includes(q) ||
        prod.materials.some(m => m.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Price cap
    if (prod.price > filterOptions.maxPrice) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filterOptions.sortBy === 'price-asc') return a.price - b.price;
    if (filterOptions.sortBy === 'price-desc') return b.price - a.price;
    if (filterOptions.sortBy === 'rating') return b.rating - a.rating;
    if (filterOptions.sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        theme,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleGiftWrap,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTotal,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        wishlist,
        toggleWishlist,
        isInWishlist,
        products: PRODUCTS,
        filterOptions,
        setFilterOptions,
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isDocsOpen,
        setIsDocsOpen,
        isVIPModalOpen,
        setIsVIPModalOpen,
        orders,
        createOrder,
        vipTier,
        isOnline,
        toastMessage,
        showToast,
        getWhatsAppOrderUrl
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
