import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Award, 
  MessageCircle, 
  ArrowRight, 
  Clock, 
  HeartHandshake, 
  HelpCircle, 
  ChevronDown,
  Instagram,
  Phone
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BUSINESS_INFO } from '../data/products';
import { ARIE_LOGO_DATA_URI } from '../data/logo';

export const AboutPage: React.FC = () => {
  const { setActivePage, setSelectedCategory } = useShop();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleShopNow = (cat: 'all' | 'watches' | 'jewelry' | 'accessories' | 'jerseys' = 'all') => {
    setSelectedCategory(cat);
    setActivePage('shop');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const pillars = [
    {
      icon: Award,
      title: 'Authenticity First',
      description: 'Engineered with premium 316L stainless steel, 18K vacuum PVD gold plating, and high-clarity Austrian crystal zirconias for tarnish-resistant endurance.'
    },
    {
      icon: HeartHandshake,
      title: 'Affordable Luxury',
      description: 'We eliminate bloated intermediary retail markups, bringing atelier-quality timepieces and fine jewelry directly to you at honest, fair prices.'
    },
    {
      icon: Sparkles,
      title: 'Distinctive Elegance',
      description: 'Curated statements for milestones, weddings, boardroom meetings, and modern casual styling — designed to elevate every single moment.'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: 'Fast, secure shipping across all 36 Nigerian states from our Lokoja hub, complete with protective presentation packaging and tracking.'
    }
  ];

  const faqs = [
    {
      q: 'Where is Arie Jewelry and Accessories located?',
      a: 'Our physical hub and showroom are located in Phase 1, Lokoja, Kogi State, Nigeria. We proudly fulfill orders nationwide across all 36 states and the FCT.'
    },
    {
      q: 'Will the gold finish tarnish or fade?',
      a: 'Our pieces utilize industrial PVD (Physical Vapor Deposition) 18K vacuum plating over solid stainless steel or jeweler’s brass. With proper care (avoiding direct abrasive chemicals and perfumed sprays), they maintain their radiant golden luster for years.'
    },
    {
      q: 'How long does nationwide delivery take in Nigeria?',
      a: 'Deliveries to Abuja and surrounding states typically arrive within 24 to 48 hours. Orders to Lagos, Port Harcourt, Kano, and other states take 2 to 4 business days via insured express transit.'
    },
    {
      q: 'Can I order directly through WhatsApp?',
      a: 'Yes, absolutely! Our dedicated WhatsApp concierge (08164907596) is available daily to take instant orders, share high-res video previews, confirm ring sizes, and arrange custom gift packaging.'
    },
    {
      q: 'Do you offer club jerseys and men’s accessories as well?',
      a: 'Yes! Beyond horology and women’s fine jewelry, we curate official club football jerseys, bespoke cufflinks, lapel pins, and tie bars for the modern gentleman.'
    }
  ];

  return (
    <div className="bg-[#fbfaf8] dark:bg-[#0c0b0a] text-[#171513] dark:text-[#f5f2eb] transition-colors duration-200">
      
      {/* Editorial Header Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#c5a059]/20 dark:border-[#d4af37]/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-[1px] bg-[#c5a059] dark:bg-[#d4af37]" />
            <p className="text-[11px] sm:text-xs font-cinzel font-semibold tracking-[0.28em] text-[#8c6b2d] dark:text-[#d4af37] uppercase">
              ABOUT OUR MAISON · LOKOJA, KOGI STATE
            </p>
            <span className="w-6 h-[1px] bg-[#c5a059] dark:bg-[#d4af37]" />
          </div>

          {/* Headline */}
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight mb-6">
            Modern Fashion Crafted for <br />
            <span className="italic font-light gold-gradient-text">Life’s Most Precious Moments</span>
          </h1>

          {/* Intro Paragraph */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-stone-600 dark:text-stone-300 font-sans font-light leading-relaxed">
            Welcome to <strong className="font-medium text-stone-900 dark:text-white">Arie Jewelry and Accessories</strong>. 
            Rooted in the historic confluence city of Lokoja, Kogi State, we are on a mission to redefine modern luxury 
            through genuine authenticity, everyday affordability, and uncompromising elegance.
          </p>

          {/* Quick Stats Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 sm:p-5 rounded-xl bg-white/70 dark:bg-[#141312]/80 border border-stone-200 dark:border-[#d4af37]/25 shadow-sm">
              <span className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#8c6b2d] dark:text-[#d4af37]">36</span>
              <p className="text-xs font-cinzel tracking-wider text-stone-500 dark:text-stone-400 uppercase mt-1">States Delivered</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Rapid delivery nationwide</p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-white/70 dark:bg-[#141312]/80 border border-stone-200 dark:border-[#d4af37]/25 shadow-sm">
              <span className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#8c6b2d] dark:text-[#d4af37]">18K</span>
              <p className="text-xs font-cinzel tracking-wider text-stone-500 dark:text-stone-400 uppercase mt-1">PVD Gold Finish</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Tarnish-resistant coating</p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-white/70 dark:bg-[#141312]/80 border border-stone-200 dark:border-[#d4af37]/25 shadow-sm">
              <span className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#8c6b2d] dark:text-[#d4af37]">100%</span>
              <p className="text-xs font-cinzel tracking-wider text-stone-500 dark:text-stone-400 uppercase mt-1">Inspected Craft</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Hand-verified quality</p>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-white/70 dark:bg-[#141312]/80 border border-stone-200 dark:border-[#d4af37]/25 shadow-sm">
              <span className="font-cormorant text-3xl sm:text-4xl font-semibold text-[#8c6b2d] dark:text-[#d4af37]">24/7</span>
              <p className="text-xs font-cinzel tracking-wider text-stone-500 dark:text-stone-400 uppercase mt-1">WhatsApp Care</p>
              <p className="text-[11px] text-stone-500 mt-0.5">Direct concierge line</p>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom & Atelier Showcase Section */}
      <section className="py-16 lg:py-24 border-b border-[#c5a059]/20 dark:border-[#d4af37]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Image showcase */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden border border-stone-300 dark:border-[#d4af37]/35 shadow-2xl group bg-stone-100 dark:bg-[#121110]">
                <img
                  src="/images/arie-about-atelier.jpg"
                  alt="Arie Jewelry and Accessories Atelier and Showroom in Lokoja, Nigeria"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/arie_about_atelier_1791549278468.jpg';
                  }}
                  className="w-full aspect-[16/10] sm:aspect-[16/9] object-cover object-center filter brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[11px] font-cinzel tracking-wider uppercase text-[#d4af37]">
                      Lokoja, Kogi State · Nigeria
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-cormorant italic text-stone-200">
                    Where artisanal passion meets Nigerian pride and contemporary luxury
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative text */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[1px] bg-[#c5a059] dark:bg-[#d4af37]" />
                <span className="text-xs font-cinzel tracking-[0.24em] text-[#8c6b2d] dark:text-[#d4af37] uppercase font-semibold">
                  OUR HERITAGE &amp; VISION
                </span>
              </div>

              <h2 className="font-cormorant text-3xl sm:text-4xl font-normal leading-snug">
                Born at the Confluence of Rivers and Cultures
              </h2>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans font-light leading-relaxed">
                Lokoja has always been a historic crossroad — where the Niger and Benue rivers unite. 
                In that same spirit, <strong>Arie Jewelry and Accessories</strong> brings together timeless classical 
                horology, gleaming fine jewelry, and contemporary African lifestyle fashion.
              </p>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-sans font-light leading-relaxed">
                We observed that fashion lovers throughout Nigeria were too often forced to choose between 
                cheap trinkets that tarnished within weeks, or wildly overpriced international designer items. 
                We created Arie to offer the perfect third option: <em>authentic pieces that last, priced honestly.</em>
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleShopNow('all')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel text-xs font-semibold tracking-wider rounded shadow transition duration-200 active:scale-95"
                >
                  <span>BROWSE CATALOG</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[#25D366]/50 hover:border-[#25D366] text-[#1b9e4b] dark:text-[#25D366] hover:bg-[#25D366]/10 font-sans text-xs font-medium rounded transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>CONSULT VIA WHATSAPP</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The 4 Pillars */}
      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-[#070606] border-b border-[#c5a059]/20 dark:border-[#d4af37]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-cinzel tracking-[0.26em] text-[#8c6b2d] dark:text-[#d4af37] uppercase font-semibold mb-2">
              THE ARIE STANDARD
            </p>
            <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-normal">
              Built Upon Four Unshakable Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-white dark:bg-[#121110] border border-stone-200 dark:border-[#d4af37]/25 shadow-sm hover:border-[#d4af37] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-[#d4af37]/15 text-[#8c6b2d] dark:text-[#d4af37] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <h3 className="font-cinzel text-sm font-semibold tracking-wide text-stone-900 dark:text-stone-100 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-100 dark:border-white/5 flex items-center gap-1.5 text-[11px] text-[#8c6b2d] dark:text-[#d4af37] font-cinzel">
                    <span>Guaranteed</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Curated Categories Preview */}
      <section className="py-16 lg:py-24 border-b border-[#c5a059]/20 dark:border-[#d4af37]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-cinzel tracking-[0.24em] text-[#8c6b2d] dark:text-[#d4af37] uppercase font-semibold mb-2">
                WHAT WE CREATE &amp; CURATE
              </p>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-normal">
                Four Signature Lines for Every Occasion
              </h2>
            </div>
            <button
              onClick={() => handleShopNow('all')}
              className="text-xs font-cinzel text-[#8c6b2d] dark:text-[#d4af37] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View Full Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Watches */}
            <div 
              onClick={() => handleShopNow('watches')}
              className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-[#141312] border border-stone-200 dark:border-white/10 hover:border-[#d4af37] transition shadow-sm"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 mb-3">
                <img
                  src="/images/products/prod-watch-gold.jpg"
                  alt="Arie Wristwatches & Horology"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="font-cinzel text-xs font-bold tracking-wider uppercase text-stone-900 dark:text-stone-100 group-hover:text-[#8c6b2d] dark:group-hover:text-[#d4af37]">
                Wristwatches &amp; Timepieces
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                Chronographs, gold-tone link bracelets, Roman dial classics, and pocket watches.
              </p>
            </div>

            {/* Fine Jewelry */}
            <div 
              onClick={() => handleShopNow('jewelry')}
              className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-[#141312] border border-stone-200 dark:border-white/10 hover:border-[#d4af37] transition shadow-sm"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 mb-3">
                <img
                  src="/images/products/prod-necklace-set.jpg"
                  alt="Arie Fine Jewelry & Necklaces"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="font-cinzel text-xs font-bold tracking-wider uppercase text-stone-900 dark:text-stone-100 group-hover:text-[#8c6b2d] dark:group-hover:text-[#d4af37]">
                Fine Jewelry &amp; Sets
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                Layered choker sets, medallion pendants, pavé rings, and bridal suites.
              </p>
            </div>

            {/* Gentlemen's Accessories */}
            <div 
              onClick={() => handleShopNow('accessories')}
              className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-[#141312] border border-stone-200 dark:border-white/10 hover:border-[#d4af37] transition shadow-sm"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 mb-3">
                <img
                  src="/images/products/prod-cufflinks-lapel.jpg"
                  alt="Arie Cufflinks & Accessories"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="font-cinzel text-xs font-bold tracking-wider uppercase text-stone-900 dark:text-stone-100 group-hover:text-[#8c6b2d] dark:group-hover:text-[#d4af37]">
                Gentleman’s Accessories
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                Precision lapel pins, monogrammed tie clips, cufflinks, and luxury eyewear.
              </p>
            </div>

            {/* Club Jerseys */}
            <div 
              onClick={() => handleShopNow('jerseys')}
              className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-[#141312] border border-stone-200 dark:border-white/10 hover:border-[#d4af37] transition shadow-sm"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 mb-3">
                <img
                  src="/images/products/prod-football-jersey.jpg"
                  alt="Arie Football Club Jerseys"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <h3 className="font-cinzel text-xs font-bold tracking-wider uppercase text-stone-900 dark:text-stone-100 group-hover:text-[#8c6b2d] dark:group-hover:text-[#d4af37]">
                Club Football Jerseys
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                Player and fan edition kits with breathable aeroready fabric and sharp badges.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-16 lg:py-24 bg-stone-50 dark:bg-[#070606] border-b border-[#c5a059]/20 dark:border-[#d4af37]/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <p className="text-xs font-cinzel tracking-[0.24em] text-[#8c6b2d] dark:text-[#d4af37] uppercase font-semibold mb-2">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#121110] overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-sans font-medium text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#8c6b2d] dark:text-[#d4af37] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-sans leading-relaxed border-t border-stone-100 dark:border-white/5">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Contact Concierge & Social Connections */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 sm:p-12 bg-white dark:bg-[#141312] border border-[#c5a059]/30 dark:border-[#d4af37]/30 shadow-xl text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-4">
              <img
                src={ARIE_LOGO_DATA_URI}
                alt="Arie Jewelry Logo"
                className="w-14 h-14 mx-auto rounded-full object-contain p-0.5 border border-[#d4af37] shadow"
              />
              <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-normal">
                Connect Directly with Our Concierge
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                Whether you need assistance choosing the perfect anniversary gift, inquiring about wholesale rates, 
                or requesting custom sizing, our team in Lokoja is ready to assist you.
              </p>

              {/* Verified Social Media Channels */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                {/* WhatsApp */}
                <a
                  href={BUSINESS_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#25D366] hover:bg-[#20ba59] text-white font-sans text-xs font-semibold shadow transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Concierge</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/19dba575nT/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-medium transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@arie_jewelry?_r=1&_t=ZS-9APQcbVu4zY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded bg-black hover:bg-stone-800 text-white border border-stone-700 font-sans text-xs font-medium transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.7a8.28 8.28 0 0 0 4.84 1.53V6.78a4.85 4.85 0 0 1-.94-.09z"/>
                  </svg>
                  <span>TikTok</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ariejewelryandaccessories?igsh=MWxzaXo5cHhxOGthcQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:opacity-95 text-white font-sans text-xs font-medium transition"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>

              {/* Address details */}
              <div className="pt-6 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  <span>Phase 1, Lokoja, Kogi State, Nigeria</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                  <a href="tel:+2348164907596" className="hover:underline">+234 816 490 7596</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
