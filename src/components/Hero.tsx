import React, { useState } from 'react';
import { ArrowRight, Eye, Plus, Sparkles, MessageCircle, ShieldCheck, MapPin } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BUSINESS_INFO } from '../data/products';

export const Hero: React.FC = () => {
  const { products, setQuickViewProduct, addToCart, setSelectedCategory, formatPrice } = useShop();
  const [activePin, setActivePin] = useState<string | null>(null);

  // Products featured in the hero ensemble
  const watchProduct = products.find(p => p.category === 'watches' && p.price >= 20000) || products.find(p => p.category === 'watches') || products[0];
  const necklaceProduct = products.find(p => p.category === 'necklaces') || products[1];
  const ringProduct = products.find(p => p.category === 'rings') || products[2];
  const accessoryProduct = products.find(p => p.category === 'bracelets' || p.category === 'belts' || p.category === 'caps-hats') || products[3];

  const handleShopCollection = () => {
    setSelectedCategory('all');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#fbfaf8] dark:bg-[#0c0b0a] text-[#171513] dark:text-[#f5f2eb] border-b border-[#c5a059]/20 dark:border-[#d4af37]/20 pt-8 pb-16 lg:pt-14 lg:pb-24 transition-colors duration-200">
      {/* Subtle luxury ambient gold glow backdrop */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[1px] bg-[#c5a059] dark:bg-[#d4af37]" />
              <p className="text-[11px] sm:text-xs font-cinzel font-medium tracking-[0.26em] text-[#8c6b2d] dark:text-[#d4af37] uppercase">
                AUTHENTIC · AFFORDABLE · ELEGANT
              </p>
            </div>

            {/* Headline */}
            <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-normal leading-[1.08] tracking-tight text-[#171513] dark:text-[#fbfaf8] mb-4">
              Modern Fashion <br />
              <span className="italic font-light gold-gradient-text">For Every Moment</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300/90 font-sans font-light leading-relaxed max-w-md mb-8">
              Curated jewelry, wristwatches, gentleman’s accessories, and football jerseys. Designed to elevate every moment with authentic, affordable luxury.
            </p>

            {/* Buttons: SHOP COLLECTION & WHATSAPP ORDER */}
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                onClick={handleShopCollection}
                className="group relative inline-flex items-center justify-center px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-cinzel font-semibold tracking-[0.16em] uppercase text-[#0d0c0b] bg-[#d4af37] hover:bg-[#e6ca65] transition-all duration-300 shadow-lg shadow-[#d4af37]/20 active:scale-95 rounded"
              >
                <span>SHOP COLLECTION</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-sans font-medium tracking-wide text-[#171513] dark:text-[#f5f2eb] hover:text-[#25D366] border border-[#25D366]/60 hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all duration-300 active:scale-95 rounded gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>ORDER ON WHATSAPP</span>
              </a>
            </div>

            {/* Micro proof line */}
            <div className="mt-8 pt-6 border-t border-[#d4af37]/15 flex flex-wrap items-center gap-5 text-[11px] text-stone-400 font-sans">
              <div className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Based in Lokoja, Kogi State</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Nationwide Delivery across Nigeria</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Stage Visual matching the template and product details */}
          <div className="lg:col-span-7 relative">
            <div className="relative mx-auto max-w-2xl lg:max-w-none rounded-2xl p-2 sm:p-4 bg-stone-100/90 dark:bg-gradient-to-b dark:from-[#1c1a17]/60 dark:to-[#0e0d0c]/80 border border-stone-300/80 dark:border-[#d4af37]/30 shadow-xl overflow-hidden group transition-colors duration-200">
              
              {/* Luxury Display Stage Showcase */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-xl overflow-hidden bg-stone-200 dark:bg-[#070606]">
                <img
                  src="/images/arie-hero-luxury.jpg"
                  alt="Arie Jewelry and Accessories – Bespoke luxury gold chronograph watch, starburst pendant, and fine jewelry ensemble"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/arie_hero_luxury_1791549250017.jpg';
                  }}
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Dramatic gold vignette & dark luxury overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-[#d4af37]/25 rounded-xl pointer-events-none" />

                {/* Interactive Hotspot Pin 1: Arie Royal Gold Chronograph Watch */}
                <div className="absolute top-[32%] left-[28%] z-20">
                  <button
                    onClick={() => setActivePin(activePin === 'watch' ? null : 'watch')}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0c0b0a]/90 text-[#d4af37] border border-[#d4af37] hover:scale-110 transition shadow-lg"
                    aria-label="View Arie Gold Chronograph Watch details"
                    aria-expanded={activePin === 'watch'}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-40" />
                    <Plus className="w-4 h-4" />
                  </button>

                  {activePin === 'watch' && (
                    <div className="absolute left-0 top-10 w-60 p-3 bg-white dark:bg-[#141312] border border-stone-200 dark:border-[#d4af37]/50 rounded-lg shadow-2xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] font-cinzel text-[#8c6b2d] dark:text-[#d4af37] uppercase">{watchProduct.name}</p>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">{formatPrice(watchProduct.price)}</p>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">{watchProduct.subtitle}</p>
                      <div className="mt-2 flex gap-1.5">
                        <button
                          onClick={() => setQuickViewProduct(watchProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-900 dark:text-white rounded text-center border border-stone-300 dark:border-transparent"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => addToCart(watchProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-[#d4af37] hover:bg-[#e6ca65] text-black font-semibold rounded text-center"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Hotspot Pin 2: Starburst Gold Pendant Necklace */}
                <div className="absolute top-[56%] left-[45%] z-20">
                  <button
                    onClick={() => setActivePin(activePin === 'necklace' ? null : 'necklace')}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0c0b0a]/90 text-[#d4af37] border border-[#d4af37] hover:scale-110 transition shadow-lg"
                    aria-label="View Starburst Gold Pendant details"
                    aria-expanded={activePin === 'necklace'}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-40" />
                    <Plus className="w-4 h-4" />
                  </button>

                  {activePin === 'necklace' && (
                    <div className="absolute left-0 sm:-left-12 top-10 w-60 p-3 bg-white dark:bg-[#141312] border border-stone-200 dark:border-[#d4af37]/50 rounded-lg shadow-2xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] font-cinzel text-[#8c6b2d] dark:text-[#d4af37] uppercase">{necklaceProduct.name}</p>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">{formatPrice(necklaceProduct.price)}</p>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">{necklaceProduct.subtitle}</p>
                      <div className="mt-2 flex gap-1.5">
                        <button
                          onClick={() => setQuickViewProduct(necklaceProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-900 dark:text-white rounded text-center border border-stone-300 dark:border-transparent"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => addToCart(necklaceProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-[#d4af37] hover:bg-[#e6ca65] text-black font-semibold rounded text-center"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Hotspot Pin 3: Pavé Ring */}
                <div className="absolute top-[72%] left-[62%] z-20">
                  <button
                    onClick={() => setActivePin(activePin === 'ring' ? null : 'ring')}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0c0b0a]/90 text-[#d4af37] border border-[#d4af37] hover:scale-110 transition shadow-lg"
                    aria-label="View Pavé Crystal Ring details"
                    aria-expanded={activePin === 'ring'}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-40" />
                    <Plus className="w-4 h-4" />
                  </button>

                  {activePin === 'ring' && (
                    <div className="absolute right-0 top-10 w-60 p-3 bg-white dark:bg-[#141312] border border-stone-200 dark:border-[#d4af37]/50 rounded-lg shadow-2xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] font-cinzel text-[#8c6b2d] dark:text-[#d4af37] uppercase">{ringProduct.name}</p>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">{formatPrice(ringProduct.price)}</p>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">{ringProduct.subtitle}</p>
                      <div className="mt-2 flex gap-1.5">
                        <button
                          onClick={() => setQuickViewProduct(ringProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-900 dark:text-white rounded text-center border border-stone-300 dark:border-transparent"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => addToCart(ringProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-[#d4af37] hover:bg-[#e6ca65] text-black font-semibold rounded text-center"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Hotspot Pin 4: Gold Bangle Bracelet */}
                <div className="absolute top-[46%] right-[16%] z-20">
                  <button
                    onClick={() => setActivePin(activePin === 'bracelet' ? null : 'bracelet')}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0c0b0a]/90 text-[#d4af37] border border-[#d4af37] hover:scale-110 transition shadow-lg"
                    aria-label="View Gold Bangle Bracelet details"
                    aria-expanded={activePin === 'bracelet'}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-40" />
                    <Plus className="w-4 h-4" />
                  </button>

                  {activePin === 'bracelet' && (
                    <div className="absolute right-0 top-10 w-60 p-3 bg-white dark:bg-[#141312] border border-stone-200 dark:border-[#d4af37]/50 rounded-lg shadow-2xl z-30 text-left animate-in fade-in zoom-in-95 duration-150">
                      <p className="text-[10px] font-cinzel text-[#8c6b2d] dark:text-[#d4af37] uppercase">{accessoryProduct.name}</p>
                      <p className="text-xs font-semibold text-stone-900 dark:text-white">{formatPrice(accessoryProduct.price)}</p>
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">{accessoryProduct.subtitle}</p>
                      <div className="mt-2 flex gap-1.5">
                        <button
                          onClick={() => setQuickViewProduct(accessoryProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-900 dark:text-white rounded text-center border border-stone-300 dark:border-transparent"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => addToCart(accessoryProduct)}
                          className="flex-1 py-1 text-[10px] font-cinzel bg-[#d4af37] hover:bg-[#e6ca65] text-black font-semibold rounded text-center"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hotspot legend overlay */}
                <div className="absolute bottom-3 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-[10px] text-stone-300 font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <span>Tap pins to shop the featured ensemble</span>
                </div>
              </div>

              {/* Bottom Quick Category Strip */}
              <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[10px] font-cinzel tracking-wider text-stone-400 pt-2 border-t border-white/5">
                <button 
                  onClick={() => setQuickViewProduct(watchProduct)}
                  className="hover:text-[#d4af37] transition truncate"
                >
                  WRISTWATCHES
                </button>
                <button 
                  onClick={() => setQuickViewProduct(necklaceProduct)}
                  className="hover:text-[#d4af37] transition truncate"
                >
                  FINE JEWELRY
                </button>
                <button 
                  onClick={() => setQuickViewProduct(ringProduct)}
                  className="hover:text-[#d4af37] transition truncate"
                >
                  RINGS &amp; CUFFS
                </button>
                <button 
                  onClick={() => setQuickViewProduct(accessoryProduct)}
                  className="hover:text-[#d4af37] transition truncate"
                >
                  ACCESSORIES
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
