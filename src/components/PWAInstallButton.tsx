import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Apple } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone PWA, suppress button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40 text-xs font-cinzel font-semibold tracking-wider transition"
      >
        <Download className="w-3.5 h-3.5" />
        <span>INSTALL APP</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 text-xs font-cinzel tracking-wider transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>INSTALL ON IOS</span>
        </button>

        {showIOSGuide && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-2xl bg-[#141312] border border-[#d4af37]/40 p-6 text-white shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Apple className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-cinzel text-sm font-semibold tracking-wider text-[#d4af37]">
                    INSTALL ON IPHONE / IPAD
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-white"
                  aria-label="Close guide"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 font-sans text-xs text-stone-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    1
                  </span>
                  <p>
                    Tap the <strong>Share</strong> button (box with an arrow pointing up) in your Safari toolbar.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    2
                  </span>
                  <p>
                    Scroll down and select <strong>Add to Home Screen</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    3
                  </span>
                  <p>
                    Tap <strong>Add</strong> in the top right corner to enjoy the full standalone Luxora Maison experience offline.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 rounded bg-[#d4af37] text-black font-cinzel text-xs font-semibold tracking-wider hover:bg-[#e6ca65] transition"
              >
                GOT IT
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
