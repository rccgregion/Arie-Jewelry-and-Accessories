import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Printer, 
  ArrowRight,
  Lock,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    clearCart,
    createOrder,
    formatPrice,
    getWhatsAppOrderUrl
  } = useShop();

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmed'>('shipping');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lokoja',
    state: 'Kogi State',
    country: 'Nigeria',
    deliveryMethod: 'Nationwide Standard Courier (2-4 Days)',
    paymentMethod: 'Bank Transfer / Online Card',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••'
  });

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        const order = createOrder(
          {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postalCode: '260101'
          },
          formData.deliveryMethod,
          formData.paymentMethod
        );
        setConfirmedOrder(order);
        clearCart();
        setStep('confirmed');
      }, 1200);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('shipping');
    setConfirmedOrder(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#121110] border border-stone-300 dark:border-[#d4af37]/40 rounded-2xl text-stone-900 dark:text-[#f5f2eb] shadow-2xl p-6 sm:p-8 my-auto z-10 max-h-[92vh] overflow-y-auto transition-colors duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-stone-200 dark:border-[#d4af37]/20">
          <div>
            <span className="font-cinzel text-[10px] tracking-[0.24em] text-[#8c6b2d] dark:text-[#d4af37] uppercase">CHECKOUT</span>
            <h2 id="checkout-modal-title" className="font-cinzel text-xl text-stone-900 dark:text-white font-normal mt-0.5">
              {step === 'confirmed' ? 'Order Confirmed' : 'Order Finalization'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-black dark:hover:text-white rounded transition"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        {step !== 'confirmed' && (
          <div className="flex items-center justify-between my-5 text-xs font-cinzel">
            <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#8c6b2d] dark:text-[#d4af37] font-semibold' : 'text-stone-400'}`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
              <span>DELIVERY ADDRESS</span>
            </div>
            <div className="flex-1 h-[1px] bg-stone-200 dark:bg-white/10 mx-4" />
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#8c6b2d] dark:text-[#d4af37] font-semibold' : 'text-stone-400'}`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
              <span>PAYMENT</span>
            </div>
          </div>
        )}

        {/* Form Content */}
        {step === 'shipping' && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <h3 className="text-xs font-cinzel text-[#8c6b2d] dark:text-[#d4af37] tracking-wider uppercase">DELIVERY INFORMATION</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adebayo Johnson"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">Phone Number (WhatsApp Active)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0812 345 6789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="adebayo@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">Delivery Street Address</label>
              <input
                type="text"
                required
                placeholder="House / Apartment number, Street name, Landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">City / Town</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none"
                />
              </div>
            </div>

            {/* Total and CTA */}
            <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex justify-between items-center text-xs">
              <span className="text-stone-500 dark:text-stone-400">Total payable ({cart.length} items):</span>
              <span className="font-cinzel text-base font-semibold text-stone-900 dark:text-white">{formatPrice(cartTotal)}</span>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel font-semibold tracking-[0.16em] text-xs uppercase rounded transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>CONTINUE TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1b9e4b] dark:text-[#25D366] border border-[#25D366]/40 rounded font-sans text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>OR COMPLETE ORDER ON WHATSAPP INSTEAD</span>
              </a>
            </div>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <h3 className="text-xs font-cinzel text-[#8c6b2d] dark:text-[#d4af37] tracking-wider uppercase">PAYMENT OPTIONS</h3>

            {/* Bank Transfer note for Nigeria */}
            <div className="p-3.5 rounded-lg bg-stone-100 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs">
              <p className="font-cinzel text-[#8c6b2d] dark:text-[#d4af37] font-semibold mb-1">DIRECT BANK TRANSFER AVAILABLE</p>
              <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                You can also pay via instant Nigerian bank transfer and send receipt to our WhatsApp support line (08164907596) for instant confirmation.
              </p>
            </div>

            <div>
              <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">Card Number (Optional Demo)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none font-mono"
                />
                <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">Expiry</label>
                <input
                  type="text"
                  required
                  value={formData.cardExpiry}
                  onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-stone-600 dark:text-stone-300 font-sans block mb-1">CVV / CVC</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={formData.cardCvc}
                  onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                  className="w-full bg-stone-50 dark:bg-[#181716] border border-stone-300 dark:border-white/10 rounded px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-[#d4af37] outline-none font-mono"
                />
              </div>
            </div>

            {/* Security note */}
            <div className="p-3 rounded bg-stone-100 dark:bg-[#161514] border border-emerald-500/30 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>End-to-end encrypted TLS connection. Secure transaction guaranteed.</span>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="px-4 py-3 bg-stone-200 dark:bg-white/10 hover:bg-stone-300 dark:hover:bg-white/20 text-stone-900 dark:text-white font-cinzel text-xs rounded transition"
              >
                BACK
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3.5 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel font-semibold tracking-[0.16em] text-xs uppercase rounded transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-md"
              >
                {isProcessing ? 'AUTHORIZING ORDER...' : `CONFIRM ${formatPrice(cartTotal)}`}
              </button>
            </div>
          </form>
        )}

        {step === 'confirmed' && confirmedOrder && (
          <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[#8c6b2d] dark:text-[#d4af37] flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
            </div>

            <div>
              <p className="font-cinzel text-xs tracking-[0.24em] text-[#8c6b2d] dark:text-[#d4af37] uppercase">ORDER CONFIRMED</p>
              <h3 className="font-cormorant text-2xl sm:text-3xl text-stone-900 dark:text-white font-normal mt-1">
                Thank You for Choosing Arie Jewelry
              </h3>
              <p className="font-sans text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-md mx-auto">
                Your order is confirmed and is being packaged for delivery across Nigeria.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-5 rounded-xl bg-stone-100 dark:bg-[#161514] border border-stone-300 dark:border-[#d4af37]/30 text-left text-xs font-sans space-y-3 max-w-lg mx-auto shadow-sm">
              <div className="flex justify-between border-b border-stone-200 dark:border-white/10 pb-2">
                <span className="text-stone-500 dark:text-stone-400">Order Reference:</span>
                <span className="font-mono font-bold text-stone-900 dark:text-white">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 dark:border-white/10 pb-2">
                <span className="text-stone-500 dark:text-stone-400">Tracking Code:</span>
                <span className="font-mono text-[#8c6b2d] dark:text-[#d4af37]">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 dark:border-white/10 pb-2">
                <span className="text-stone-500 dark:text-stone-400">Delivery Address:</span>
                <span className="text-stone-800 dark:text-stone-200">{confirmedOrder.shippingDetails.address}, {confirmedOrder.shippingDetails.city}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 dark:border-white/10 pb-2">
                <span className="text-stone-500 dark:text-stone-400">Total Amount:</span>
                <span className="font-cinzel font-semibold text-stone-900 dark:text-white">{formatPrice(confirmedOrder.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400">Verified &amp; Saved Locally</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 border border-stone-300 dark:border-white/20 hover:border-stone-400 dark:hover:border-white/40 text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white rounded text-xs font-sans flex items-center justify-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-7 py-2.5 bg-[#d4af37] hover:bg-[#e6ca65] text-black font-cinzel text-xs font-semibold tracking-wider rounded transition shadow-md"
              >
                RETURN TO STORE
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
