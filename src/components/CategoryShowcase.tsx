import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Category } from '../types';

interface CategoryCardItem {
  id: Category;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

export const CategoryShowcase: React.FC = () => {
  const { setSelectedCategory } = useShop();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const categories: CategoryCardItem[] = [
    {
      id: 'watches',
      title: 'WRISTWATCHES',
      subtitle: 'Precision quartz, steel & gold link timepieces.',
      image: '/images/products/prod-watch-gold.jpg',
      alt: 'Arie Luxury Wristwatches Collection'
    },
    {
      id: 'jewelry',
      title: 'JEWELRY SETS',
      subtitle: 'Necklaces, earrings, rings & bridal statement pieces.',
      image: '/images/products/prod-necklace-set.jpg',
      alt: 'Arie Fine Jewelry and Sets'
    },
    {
      id: 'accessories',
      title: 'SUITING & SHADES',
      subtitle: 'Cufflinks, lapel pins, ties & UV400 sunglasses.',
      image: '/images/products/prod-cufflinks-lapel.jpg',
      alt: 'Arie Gentleman Accessories'
    },
    {
      id: 'jerseys',
      title: 'FOOTBALL JERSEYS',
      subtitle: 'Authentic club and national team match editions.',
      image: '/images/products/prod-jersey-club.jpg',
      alt: 'Arie Football Jerseys'
    }
  ];

  const handleCategorySelect = (catId: Category) => {
    setSelectedCategory(catId);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);

    const index = Math.round(scrollLeft / (clientWidth * 0.75));
    setActiveIndex(index);
  };

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section id="categories-section" className="py-16 lg:py-24 bg-[#f4f1ea] dark:bg-[#0a0908] text-[#171513] dark:text-[#f5f2eb] border-b border-[#c5a059]/15 dark:border-[#d4af37]/15 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="font-cinzel text-lg sm:text-2xl font-normal tracking-[0.24em] text-[#171513] dark:text-[#f5f2eb]">
              SHOP BY CATEGORY
            </h2>
            <div className="w-12 h-[1px] bg-[#c5a059] dark:bg-[#d4af37] mt-2" />
          </div>

          <div className="flex items-center gap-4">
            {/* Gesture scroll arrows for mobile & tablet */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={() => scrollByDirection('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll categories left"
                className="p-1.5 rounded-full border border-stone-300 dark:border-white/10 text-stone-700 dark:text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c5a059] dark:hover:border-[#d4af37]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByDirection('right')}
                disabled={!canScrollRight}
                aria-label="Scroll categories right"
                className="p-1.5 rounded-full border border-stone-300 dark:border-white/10 text-stone-700 dark:text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c5a059] dark:hover:border-[#d4af37]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleCategorySelect('all')}
              className="group inline-flex items-center gap-1.5 font-cinzel text-xs sm:text-sm tracking-[0.18em] text-[#8c6b2d] dark:text-[#d4af37] hover:text-[#5a431a] dark:hover:text-[#faeab1] transition"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Categories Grid / Mobile Swipe Carousel */}
        <div
          ref={carouselRef}
          className="flex lg:grid lg:grid-cols-4 gap-5 overflow-x-auto lg:overflow-x-visible no-scrollbar snap-x snap-mandatory pb-4 lg:pb-0"
        >
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="min-w-[80%] sm:min-w-[50%] lg:min-w-0 snap-center flex-shrink-0 cursor-pointer group bg-white dark:bg-[#141312] border border-stone-200 dark:border-[#d4af37]/20 hover:border-[#c5a059] dark:hover:border-[#d4af37]/70 transition-all duration-300 overflow-hidden rounded-xl flex flex-col justify-between shadow-sm dark:shadow-none"
            >
              {/* Category Image with Real Photos */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c0b0a]">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                  }}
                  className="w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 dark:from-[#141312] via-transparent to-transparent opacity-85" />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9.5px] font-cinzel tracking-wider bg-black/70 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30">
                  ARIE ESSENTIAL
                </div>
              </div>

              {/* Category Content */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-cinzel text-base font-semibold tracking-[0.2em] text-[#171513] dark:text-[#f5f2eb] group-hover:text-[#c5a059] dark:group-hover:text-[#d4af37] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans font-light mt-1.5 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200 dark:border-white/5 flex items-center justify-between">
                  <span className="font-cinzel text-xs tracking-[0.2em] text-[#8c6b2d] dark:text-[#d4af37] group-hover:text-[#b08a42] dark:group-hover:text-[#f3e5ab] font-medium flex items-center gap-1.5">
                    <span>EXPLORE NOW</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500">0{idx + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Pagination Indicator */}
        <div className="flex lg:hidden justify-center items-center gap-1.5 mt-4">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (carouselRef.current) {
                  carouselRef.current.scrollTo({
                    left: i * (carouselRef.current.clientWidth * 0.8),
                    behavior: 'smooth'
                  });
                }
              }}
              aria-label={`Go to category slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-6 bg-[#d4af37]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
