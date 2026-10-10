import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, MessageCircle, Instagram, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/products';
import { ARIE_LOGO_DATA_URI } from '../data/logo';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setIsVIPModalOpen, setActivePage } = useShop();

  const handleNav = (cat: 'watches' | 'jewelry' | 'accessories' | 'jerseys' | 'new-arrivals') => {
    setActivePage('shop');
    setSelectedCategory(cat);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAbout = () => {
    setActivePage('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#f4f1ea] dark:bg-[#070606] text-[#171513] dark:text-[#f5f2eb] border-t border-[#c5a059]/25 dark:border-[#d4af37]/25 pt-16 pb-24 md:pb-16 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-300 dark:border-white/10">
          
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 select-none">
              <img
                src={ARIE_LOGO_DATA_URI}
                alt="Arie Jewelry and Accessories Logo"
                onError={(e) => {
                  e.currentTarget.src = '/images/arie-logo.png';
                }}
                className="w-10 h-10 rounded-full object-contain bg-black/5 dark:bg-white/5 p-0.5 border border-[#c5a059]/40 dark:border-[#d4af37]/40 shadow-sm"
              />
              <div className="flex flex-col items-start">
                <span className="font-cinzel text-xl tracking-[0.2em] text-[#171513] dark:text-[#f5f2eb] dark:gold-gradient-text font-bold">
                  ARIE
                </span>
                <span className="font-sans text-[8px] font-semibold tracking-[0.32em] text-[#8c6b2d] dark:text-[#c5a059] uppercase -mt-0.5">
                  JEWELRY &amp; ACCESSORIES
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed max-w-sm">
              Authentic, affordable, and elegant jewelry, wristwatches, fashion accessories, and club jerseys with rapid nationwide delivery across Nigeria.
            </p>

            {/* Verified Social Media Links */}
            <div className="pt-2">
              <p className="text-[11px] font-cinzel font-semibold tracking-wider text-[#8c6b2d] dark:text-[#d4af37] uppercase mb-2">
                CONNECT WITH US
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/19dba575nT/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-400 border border-blue-600/30 text-xs font-sans font-medium transition"
                  title="Follow Arie Jewelry on Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@arie_jewelry?_r=1&_t=ZS-9APQcbVu4zY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-stone-200 dark:bg-white/10 hover:bg-stone-300 dark:hover:bg-white/20 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-white/20 text-xs font-sans font-medium transition"
                  title="Follow @arie_jewelry on TikTok"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.7a8.28 8.28 0 0 0 4.84 1.53V6.78a4.85 4.85 0 0 1-.94-.09z"/>
                  </svg>
                  <span>TikTok</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ariejewelryandaccessories?igsh=MWxzaXo5cHhxOGthcQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 dark:text-pink-400 border border-pink-500/30 text-xs font-sans font-medium transition"
                  title="Follow @ariejewelryandaccessories on Instagram"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Instagram</span>
                </a>

                {/* WhatsApp Order */}
                <a
                  href="https://wa.me/2348164907596"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1b9e4b] dark:text-[#25D366] border border-[#25D366]/40 text-xs font-sans font-medium transition"
                  title="Chat directly on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 1: Collections */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs tracking-[0.2em] text-[#8c6b2d] dark:text-[#d4af37] uppercase font-semibold">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <button onClick={() => handleNav('watches')} className="hover:text-[#8c6b2d] dark:hover:text-[#d4af37] transition">
                  Wristwatches &amp; Chronographs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jewelry')} className="hover:text-[#8c6b2d] dark:hover:text-[#d4af37] transition">
                  Necklaces &amp; Pendants
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jewelry')} className="hover:text-[#8c6b2d] dark:hover:text-[#d4af37] transition">
                  Earrings &amp; Rings
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('accessories')} className="hover:text-[#8c6b2d] dark:hover:text-[#d4af37] transition">
                  Cufflinks, Lapels &amp; Ties
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jerseys')} className="hover:text-[#8c6b2d] dark:hover:text-[#d4af37] transition">
                  Football Club Jerseys
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs tracking-[0.2em] text-[#8c6b2d] dark:text-[#d4af37] uppercase font-semibold">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li>
                <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200 transition">
                  Direct WhatsApp Order Support
                </a>
              </li>
              <li>
                <span className="hover:text-stone-900 dark:hover:text-stone-200 transition cursor-default">
                  Nationwide Delivery (All 36 States)
                </span>
              </li>
              <li>
                <span className="hover:text-stone-900 dark:hover:text-stone-200 transition cursor-default">
                  Quality Assurance &amp; Safe Packaging
                </span>
              </li>
              <li>
                <span className="hover:text-stone-900 dark:hover:text-stone-200 transition cursor-default">
                  Size Guidance &amp; Ring Sizing
                </span>
              </li>
              <li>
                <button onClick={handleAbout} className="hover:text-[#8c6b2d] dark:hover:text-[#d4af37] transition text-left font-medium">
                  About Our Story &amp; Atelier
                </button>
              </li>
              <li>
                <button onClick={() => setIsVIPModalOpen(true)} className="hover:text-[#8c6b2d] dark:hover:text-[#d4af37] transition">
                  Arie Circle Patron Status
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Location & Business */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs tracking-[0.2em] text-[#8c6b2d] dark:text-[#d4af37] uppercase font-semibold">
              LOCATION &amp; CONTACT
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8c6b2d] dark:text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#8c6b2d] dark:text-[#d4af37] flex-shrink-0" />
                <a href="tel:+2348164907596" className="hover:underline">{BUSINESS_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] flex-shrink-0" />
                <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1b9e4b] dark:text-[#25D366]">
                  WhatsApp: 08164907596
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400 font-sans">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© 2026 Arie Jewelry and Accessories. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span>Lokoja, Kogi State, Nigeria</span>
          </div>

          <div className="flex items-center gap-2 text-[#8c6b2d] dark:text-[#d4af37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-cinzel text-[11px] tracking-wider">AUTHENTIC · AFFORDABLE · ELEGANT</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
