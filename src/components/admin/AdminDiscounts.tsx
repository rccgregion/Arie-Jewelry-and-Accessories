import React, { useState, useEffect } from 'react';
import { Clock, Tag, Calendar, AlertCircle, CheckCircle, Percent, ArrowRight } from 'lucide-react';
import { AdminProduct } from '../../types/admin';
import { adminFetch } from '../../utils/adminAuth';

export const AdminDiscounts: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products for discounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const discountedProducts = products.filter(p => p.discount && p.discount.value > 0);

  // Format UTC date to Africa/Lagos (WAT, UTC+1)
  const formatLagosTime = (isoString?: string) => {
    if (!isoString) return 'Indefinite Window';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-GB', {
        timeZone: 'Africa/Lagos',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' (WAT)';
    } catch {
      return isoString;
    }
  };

  const getDiscountStatus = (p: AdminProduct) => {
    if (!p.discount || !p.discount.isActive) return { status: 'Inactive', color: 'text-stone-400 bg-stone-800' };
    const now = Date.now();
    if (p.discount.startDate && new Date(p.discount.startDate).getTime() > now) {
      return { status: 'Scheduled', color: 'text-blue-400 bg-blue-900/30' };
    }
    if (p.discount.endDate && new Date(p.discount.endDate).getTime() < now) {
      return { status: 'Expired', color: 'text-red-400 bg-red-900/30' };
    }
    return { status: 'Active Now', color: 'text-emerald-400 bg-emerald-900/30' };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-2 border-b border-stone-200 dark:border-stone-800">
        <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#f5f2eb] tracking-wide">
          TIMED PROMOTIONS &amp; AUTOMATIC DISCOUNTS
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Configured timed price campaigns computed authoritatively in UTC and displayed in Africa/Lagos timezone
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-cinzel uppercase tracking-wider">Active Campaigns</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {discountedProducts.filter(p => getDiscountStatus(p).status === 'Active Now').length}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Currently live on storefront</p>
        </div>

        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-cinzel uppercase tracking-wider">Scheduled Promos</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {discountedProducts.filter(p => getDiscountStatus(p).status === 'Scheduled').length}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Awaiting future activation window</p>
        </div>

        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-cinzel uppercase tracking-wider">Expired Windows</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {discountedProducts.filter(p => getDiscountStatus(p).status === 'Expired').length}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Reverted automatically to base price</p>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-white/[0.02] text-stone-500 dark:text-stone-400 font-cinzel text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Creation</th>
                <th className="py-3 px-3 font-semibold">Promo Value</th>
                <th className="py-3 px-3 font-semibold">Base Price</th>
                <th className="py-3 px-3 font-semibold">Final Customer Price</th>
                <th className="py-3 px-3 font-semibold">Promotion Window (WAT)</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {discountedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No active timed promotions currently configured. Configure discounts in Product Editor.
                  </td>
                </tr>
              ) : (
                discountedProducts.map(p => {
                  const statusInfo = getDiscountStatus(p);
                  const baseNgn = Math.round(p.basePriceKobo / 100);
                  const discountNgn = p.discount?.type === 'percentage'
                    ? Math.round((baseNgn * p.discount.value) / 100)
                    : Math.round((p.discount?.value || 0) / 100);
                  const finalNgn = Math.max(0, baseNgn - discountNgn);

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 dark:hover:bg-white/[0.015] transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || '/images/products/prod-watch-gold.jpg'}
                            alt={p.name}
                            className="w-10 h-10 rounded object-cover border border-stone-200 dark:border-stone-800"
                          />
                          <div>
                            <div className="font-semibold text-stone-900 dark:text-stone-100">{p.name}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{p.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-cinzel font-semibold text-stone-900 dark:text-[#d4af37]">
                          {p.discount?.type === 'percentage' ? `${p.discount.value}% OFF` : `₦${discountNgn.toLocaleString()} OFF`}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-400 line-through">
                        ₦{baseNgn.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-cinzel font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{finalNgn.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-stone-500">
                        <div>End: <span className="text-stone-700 dark:text-stone-300">{formatLagosTime(p.discount?.endDate)}</span></div>
                        <div className="text-[10px] text-stone-400">Start: {formatLagosTime(p.discount?.startDate)}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-cinzel font-semibold ${statusInfo.color}`}>
                          {statusInfo.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
