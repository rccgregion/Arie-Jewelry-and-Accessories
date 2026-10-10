import React from 'react';
import { Truck, Gem, ShieldCheck, MessageCircle } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      icon: Truck,
      title: 'NATIONWIDE DELIVERY',
      subtitle: 'To all 36 states across Nigeria',
    },
    {
      icon: Gem,
      title: 'AUTHENTIC & ELEGANT',
      subtitle: 'High quality jewelry & timepieces',
    },
    {
      icon: ShieldCheck,
      title: 'SECURE ORDERING',
      subtitle: 'Safe payment & verified delivery',
    },
    {
      icon: MessageCircle,
      title: 'WHATSAPP CONCIERGE',
      subtitle: 'Direct support: 08164907596',
    },
  ];

  return (
    <section className="bg-[#f4f1ea] dark:bg-[#0c0b0a] text-[#171513] dark:text-[#f5f2eb] border-b border-[#c5a059]/20 dark:border-[#d4af37]/20 py-10 sm:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {props.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="flex items-start sm:items-center gap-3.5 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#c5a059]/40 dark:border-[#d4af37]/40 flex items-center justify-center flex-shrink-0 text-[#8c6b2d] dark:text-[#d4af37] bg-[#c5a059]/10 dark:bg-[#d4af37]/5">
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[1.5]" />
                </div>

                <div className="flex flex-col">
                  <h3 className="font-cinzel text-xs sm:text-xs font-semibold tracking-[0.14em] text-[#171513] dark:text-[#f5f2eb]">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 font-light mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
