/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCatalog } from './components/ProductCatalog';
import { ValueProps } from './components/ValueProps';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { VIPModal } from './components/VIPModal';
import { DocModal } from './components/DocModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AboutPage } from './components/AboutPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminUser } from './types/admin';
import { Check } from 'lucide-react';
import { adminFetch, getStoredAdminUser, clearAdminSession, saveAdminSession } from './utils/adminAuth';

const ToastNotification: React.FC = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-24 right-4 z-50 flex items-center gap-2.5 rounded-lg bg-white dark:bg-[#141312] border border-[#c5a059] dark:border-[#d4af37] px-4 py-3 text-xs font-sans text-stone-900 dark:text-[#f5f2eb] shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center flex-shrink-0">
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
      <span className="font-medium">{toastMessage}</span>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const { activePage, setActivePage } = useShop();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getStoredAdminUser());
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Check admin session on mount or when navigating to admin
  useEffect(() => {
    if (activePage === 'admin') {
      const stored = getStoredAdminUser();
      if (stored && !adminUser) {
        setAdminUser(stored);
      }

      setIsCheckingAuth(true);
      adminFetch('/api/auth/me')
        .then(res => {
          if (res.ok) return res.json();
          // Only throw if unauthorized
          if (res.status === 401) {
            throw new Error('Unauthorized');
          }
          return null;
        })
        .then(data => {
          if (data && data.success && data.user) {
            setAdminUser(data.user);
            if (data.token) {
              saveAdminSession(data.token, data.user);
            }
          }
        })
        .catch(() => {
          // Only redirect to login if there is no valid adminUser
          if (!getStoredAdminUser() && !adminUser) {
            clearAdminSession();
            setAdminUser(null);
            setActivePage('admin-login');
          }
        })
        .finally(() => {
          setIsCheckingAuth(false);
        });
    }
  }, [activePage]);

  const handleAdminLogout = async () => {
    try {
      await adminFetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    clearAdminSession();
    setAdminUser(null);
    setActivePage('admin-login');
  };

  // 1. Admin Login View
  if (activePage === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setAdminUser(user);
          setActivePage('admin');
        }}
      />
    );
  }

  // 2. Admin Dashboard View
  if (activePage === 'admin') {
    if (isCheckingAuth && !adminUser) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c0b0a] text-stone-400">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-3" />
          <span className="font-cinzel text-xs tracking-widest text-[#d4af37]">VERIFYING ADMIN SESSION...</span>
        </div>
      );
    }

    if (adminUser) {
      return <AdminLayout currentUser={adminUser} onLogout={handleAdminLogout} />;
    }
  }

  // 3. Public Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] dark:bg-[#0c0b0a] text-[#171513] dark:text-[#f5f2eb] transition-colors duration-200 selection:bg-[#d4af37]/30 selection:text-[#b08a42] dark:selection:text-[#f3e5ab]">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1" id="main-content">
        {activePage === 'about' ? (
          <AboutPage />
        ) : (
          <>
            {/* Hero Section */}
            <Hero />

            {/* Shop By Category Showcase */}
            <CategoryShowcase />

            {/* Full Interactive Product Catalog */}
            <ProductCatalog />

            {/* Value Proposition 4-Column Bar */}
            <ValueProps />

            {/* Newsletter Subscription */}
            <Newsletter />
          </>
        )}
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Mobile & Tablet Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals & Slide-Overs */}
      <CartDrawer />
      <QuickViewModal />
      <CheckoutModal />
      <SearchModal />
      <VIPModal />
      <DocModal />
      <OfflineIndicator />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
