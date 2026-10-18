import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Tag, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck, 
  Sun, 
  Moon,
  Sparkles,
  FolderTree
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminDiscounts } from './AdminDiscounts';
import { AdminSettings } from './AdminSettings';
import { ARIE_LOGO_DATA_URI } from '../../data/logo';
import { useShop } from '../../context/ShopContext';
import { AdminUser } from '../../types/admin';

type AdminTab = 'dashboard' | 'products' | 'categories' | 'orders' | 'discounts' | 'settings';

interface AdminLayoutProps {
  currentUser: AdminUser;
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentUser, onLogout }) => {
  const { setActivePage, theme, toggleTheme } = useShop();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedProductCategoryFilter, setSelectedProductCategoryFilter] = useState<string>('all');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as AdminTab, label: 'Products', icon: Package },
    { id: 'categories' as AdminTab, label: 'Categories', icon: FolderTree },
    { id: 'orders' as AdminTab, label: 'Orders', icon: ShoppingBag },
    { id: 'discounts' as AdminTab, label: 'Discounts', icon: Tag },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    if (tab === 'products') {
      setSelectedProductCategoryFilter('all');
    }
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8] dark:bg-[#0c0b0a] text-stone-900 dark:text-[#f5f2eb] flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Desktop Luxury Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-stone-200 dark:border-stone-800/80 bg-white dark:bg-[#100f0e] p-6 justify-between flex-shrink-0 z-20">
        <div className="space-y-8">
          {/* Admin Brand Header */}
          <div className="flex items-center gap-3">
            <img
              src={ARIE_LOGO_DATA_URI}
              alt="Arie Insignia"
              className="w-10 h-10 rounded-full object-contain bg-black/5 dark:bg-white/5 p-0.5 border border-[#c5a059]/40 dark:border-[#d4af37]/40 shadow-sm"
              onError={(e) => {
                e.currentTarget.src = '/images/arie-logo.png';
              }}
            />
            <div>
              <div className="font-cinzel text-base font-bold tracking-widest text-[#171513] dark:text-[#f5f2eb]">
                ARIE
              </div>
              <div className="text-[9px] font-sans font-semibold tracking-widest text-[#8c6b2d] dark:text-[#c5a059] uppercase -mt-0.5">
                ADMIN
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-semibold tracking-wider transition ${
                    isActive
                      ? 'bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/15'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Profile, Storefront preview, Logout */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800/80 space-y-3">
          {/* Current Admin User */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-bold text-[11px]">
                {currentUser.username[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <div className="font-semibold text-stone-900 dark:text-stone-100 text-xs">
                  {currentUser.username}
                </div>
                <div className="text-[10px] text-stone-400 capitalize">
                  {currentUser.role}
                </div>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-[#d4af37] transition"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Visit Storefront Button */}
          <button
            onClick={() => setActivePage('shop')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-stone-100 dark:bg-black/40 hover:bg-stone-200 dark:hover:bg-black/70 text-[11px] font-cinzel text-stone-700 dark:text-stone-300 transition"
          >
            <span>Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-cinzel text-red-500 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-[#100f0e] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <img
            src={ARIE_LOGO_DATA_URI}
            alt="Logo"
            className="w-7 h-7 rounded-full object-contain"
          />
          <span className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-white">
            ARIE ADMIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-[#d4af37]"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-black/80 backdrop-blur-md flex flex-col p-6 animate-in slide-in-from-top-2">
          <nav className="space-y-2 flex-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-cinzel font-semibold tracking-wider transition ${
                    isActive
                      ? 'bg-[#d4af37] text-black'
                      : 'text-stone-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-stone-800 space-y-3">
            <button
              onClick={() => {
                setActivePage('shop');
                setIsMobileDrawerOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-stone-900 text-xs font-cinzel text-stone-200"
            >
              <span>View Public Storefront</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-cinzel text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content Canvas */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <AdminDashboard
            onNavigateToProducts={() => {
              setSelectedProductCategoryFilter('all');
              setActiveTab('products');
            }}
            onNavigateToOrders={() => setActiveTab('orders')}
          />
        )}
        {activeTab === 'products' && (
          <AdminProducts initialCategory={selectedProductCategoryFilter} />
        )}
        {activeTab === 'categories' && (
          <AdminCategories
            onNavigateToProductsWithCategory={(catId) => {
              setSelectedProductCategoryFilter(catId);
              setActiveTab('products');
            }}
          />
        )}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'discounts' && <AdminDiscounts />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};
