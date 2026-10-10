import React, { useState } from 'react';
import { ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Newsletter: React.FC = () => {
  const { showToast } = useShop();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      showToast('Welcome to the Arie Circle. An exclusive welcome discount has been registered.');
    }, 700);
  };

  return (
    <section className="bg-[#ece8df]/60 dark:bg-[#090807] text-[#171513] dark:text-[#f5f2eb] border-b border-[#c5a059]/20 dark:border-[#d4af37]/20 py-14 sm:py-20 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Form: JOIN THE ARIE CIRCLE */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#8c6b2d] dark:text-[#d4af37]" />
              <h2 className="font-cinzel text-lg sm:text-2xl font-normal tracking-[0.24em] text-[#171513] dark:text-[#f5f2eb]">
                JOIN THE ARIE CIRCLE
              </h2>
            </div>
            
            <p className="font-sans text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light max-w-xl mb-6">
              Be the first to discover new arrivals, exclusive discounts, and fashion styling inspiration delivered to your inbox and WhatsApp.
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-lg bg-white dark:bg-[#141312] border border-[#d4af37]/40 text-[#171513] dark:text-[#f5f2eb] flex items-center gap-3 max-w-lg shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-cinzel text-xs font-semibold text-[#8c6b2d] dark:text-[#d4af37]">WELCOME TO THE ARIE CIRCLE</p>
                  <p className="font-sans text-xs text-stone-600 dark:text-stone-300">Your welcome discount code (WELCOME5) has been registered.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    aria-label="Email address for Arie Circle newsletter"
                    className="w-full bg-white dark:bg-[#141312] border border-stone-300 dark:border-[#d4af37]/30 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-[#171513] dark:text-[#f5f2eb] placeholder-stone-400 text-xs sm:text-sm px-4 py-3.5 rounded shadow-sm focus:outline-none transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3.5 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase rounded transition disabled:opacity-50 whitespace-nowrap shadow-md active:scale-95"
                >
                  {isLoading ? 'ENROLLING...' : 'SUBSCRIBE'}
                </button>
              </form>
            )}

            {/* Privacy note */}
            <div className="flex items-center gap-2 mt-4 text-[11px] text-stone-500 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8c6b2d] dark:text-[#d4af37]" />
              <span>We respect your privacy. Unsubscribe anytime with zero hassle.</span>
            </div>
          </div>

          {/* Right Highlight Box */}
          <div className="lg:col-span-4 p-6 rounded-xl bg-white/80 dark:bg-[#141312]/80 border border-stone-300 dark:border-[#d4af37]/25 backdrop-blur-md shadow-sm">
            <h3 className="font-cinzel text-sm font-semibold text-[#8c6b2d] dark:text-[#d4af37] tracking-wider mb-2">
              PATRON PRIVILEGES
            </h3>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-300 font-sans">
              <li className="flex items-center gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Immediate 5% discount on your first order</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>Priority reservation on limited club jerseys</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#d4af37]">✓</span>
                <span>WhatsApp notifications for new collections</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};
