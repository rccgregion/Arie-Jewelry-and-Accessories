import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Percent, 
  AlertTriangle, 
  ArrowUpRight, 
  Calendar, 
  ChevronRight, 
  Package, 
  Eye, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { AdminAnalyticsSummary, OrderStatus } from '../../types/admin';
import { adminFetch } from '../../utils/adminAuth';

interface AdminDashboardProps {
  onNavigateToProducts: () => void;
  onNavigateToOrders: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onNavigateToProducts, 
  onNavigateToOrders 
}) => {
  const [range, setRange] = useState<'today' | '7d' | '30d' | 'custom'>('7d');
  const [data, setData] = useState<AdminAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/analytics?range=${range}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = await res.json();
      if (json.success) {
        setData(json.analytics);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAnalytics();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-stone-400">
        <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-cinzel tracking-wider">Computing Atelier Metrics...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-xl bg-red-950/30 border border-red-500/20 text-red-300 text-sm flex items-center justify-between">
        <span>{error || 'Unable to load analytics summary.'}</span>
        <button
          onClick={fetchAnalytics}
          className="px-3 py-1.5 rounded-md bg-red-800/40 hover:bg-red-800/60 text-xs text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate SVG curve coordinates for Sales Over Time Chart
  const salesPoints = data.salesOverTime || [];
  const maxRevenue = Math.max(...salesPoints.map(p => p.revenueKobo), 1);
  const chartWidth = 600;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = salesPoints.map((pt, index) => {
    const x = paddingX + (index / Math.max(salesPoints.length - 1, 1)) * (chartWidth - paddingX * 2);
    const normalizedY = pt.revenueKobo / maxRevenue;
    const y = chartHeight - paddingY - normalizedY * (chartHeight - paddingY * 2);
    return { x, y, ...pt };
  });

  const svgPath = points.length > 1 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 1
    ? `${svgPath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Range Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#f5f2eb] tracking-wide">
            STORE PERFORMANCE &amp; ANALYTICS
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Real-time verified store transactions, inventory velocity, and customer metrics
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#151413] p-1 rounded-lg border border-stone-200 dark:border-stone-800 text-xs">
          {(['today', '7d', '30d'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setRange(tab)}
              className={`px-3 py-1.5 rounded font-cinzel text-[11px] tracking-wider transition ${
                range === tab
                  ? 'bg-[#d4af37] text-black font-semibold shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {tab === 'today' ? 'Today' : tab === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
          <button
            onClick={fetchAnalytics}
            title="Refresh Data"
            className="p-1.5 text-stone-500 hover:text-[#d4af37] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inventory Low Stock Alert Banner if present */}
      {(data.inventoryAlerts.lowStockCount > 0 || data.inventoryAlerts.outOfStockCount > 0) && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-amber-200">Inventory Alert: </span>
              <span>
                {data.inventoryAlerts.outOfStockCount} out of stock and {data.inventoryAlerts.lowStockCount} items below threshold.
              </span>
            </div>
          </div>
          <button
            onClick={onNavigateToProducts}
            className="text-xs font-cinzel font-semibold underline underline-offset-4 hover:text-amber-100 transition whitespace-nowrap self-start sm:self-auto"
          >
            Restock Inventory →
          </button>
        </div>
      )}

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm hover:border-[#d4af37]/40 transition">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-cinzel uppercase tracking-wider font-medium">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 text-[#d4af37] flex items-center justify-center font-bold">
              ₦
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            ₦{(data.totalRevenueKobo / 100).toLocaleString('en-NG')}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Verified Server Recalculated</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm hover:border-[#d4af37]/40 transition">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-cinzel uppercase tracking-wider font-medium">Verified Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {data.totalOrders}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
            {data.ordersByStatus.delivered} delivered · {data.ordersByStatus.processing + data.ordersByStatus.pending} active
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm hover:border-[#d4af37]/40 transition">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-cinzel uppercase tracking-wider font-medium">Average Order Value</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            ₦{(data.averageOrderValueKobo / 100).toLocaleString('en-NG')}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
            Across luxury watches &amp; fine jewelry
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm hover:border-[#d4af37]/40 transition">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-cinzel uppercase tracking-wider font-medium">Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-2xl font-bold text-stone-900 dark:text-[#f5f2eb]">
            {data.conversionRate}%
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-2">
            {data.customerMetrics.retentionRate}% patron retention rate
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Over Time Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb]">
                SALES OVER TIME
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Revenue trends across the selected {range === 'today' ? 'day' : range} period
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-sans text-stone-500 dark:text-stone-400">Peak: </span>
              <span className="text-xs font-cinzel font-bold text-[#d4af37]">
                ₦{(maxRevenue / 100).toLocaleString()}
              </span>
            </div>
          </div>

          {/* SVG Interactive Smooth Line Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 sm:h-56 select-none"
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={idx}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-stone-200 dark:text-stone-800"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Area fill */}
              {areaPath && <path d={areaPath} fill="url(#salesGradient)" />}

              {/* Line path */}
              {svgPath && (
                <path
                  d={svgPath}
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points */}
              {points.map((pt, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#121110"
                    stroke="#d4af37"
                    strokeWidth="2"
                    className="transition-transform group-hover:scale-125"
                  />
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[9px] fill-stone-500 font-sans"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Revenue By Category */}
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb] mb-1">
              REVENUE BY CATEGORY
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-6">
              Distribution of sales across departments
            </p>

            <div className="space-y-4">
              {data.revenueByCategory.map(cat => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800 dark:text-stone-200">{cat.categoryLabel}</span>
                    <span className="font-cinzel font-semibold text-stone-900 dark:text-[#d4af37]">
                      ₦{(cat.revenueKobo / 100).toLocaleString()} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#d4af37] h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy-Friendly Traffic Stats */}
          <div className="mt-8 pt-5 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-cinzel tracking-wider uppercase text-[11px]">Site Traffic (Plausible/Vercel)</span>
              <span className="text-stone-900 dark:text-[#f5f2eb] font-semibold">{data.siteTraffic.totalVisitors.toLocaleString()} Visitors</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400">
              <div className="p-2 bg-stone-50 dark:bg-black/30 rounded border border-stone-200/50 dark:border-stone-800">
                <span className="block text-stone-400 text-[10px]">Page Views</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{data.siteTraffic.totalPageViews.toLocaleString()}</span>
              </div>
              <div className="p-2 bg-stone-50 dark:bg-black/30 rounded border border-stone-200/50 dark:border-stone-800">
                <span className="block text-stone-400 text-[10px]">Top Visited</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{data.siteTraffic.topPages[0]?.path || '/'} ({data.siteTraffic.topPages[0]?.percentage || 45}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products & Orders Table Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products List */}
        <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb]">
              TOP SELLING CREATIONS
            </h2>
            <button
              onClick={onNavigateToProducts}
              className="text-xs text-[#d4af37] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {data.topSellingProducts.map(p => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/prod-watch-gold.jpg';
                    }}
                  />
                  <div>
                    <h3 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-mono">{p.sku}</p>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap">
                  <div className="font-cinzel text-xs font-bold text-stone-900 dark:text-[#d4af37]">
                    ₦{(p.revenueKobo / 100).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {p.unitsSold} units
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-cinzel text-sm font-bold tracking-wider text-stone-900 dark:text-[#f5f2eb]">
                RECENT CLIENT ORDERS
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Latest transactions requiring dispatch or fulfillment
              </p>
            </div>
            <button
              onClick={onNavigateToOrders}
              className="text-xs font-cinzel text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 font-cinzel text-[10px] uppercase">
                  <th className="pb-2.5 font-medium">Order #</th>
                  <th className="pb-2.5 font-medium">Patron</th>
                  <th className="pb-2.5 font-medium">State</th>
                  <th className="pb-2.5 font-medium">Amount</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {data.recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-white/[0.02] transition">
                    <td className="py-3 font-mono font-medium text-stone-900 dark:text-stone-100">
                      {order.orderNumber}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-stone-900 dark:text-stone-200">{order.customerName}</div>
                      <div className="text-[10px] text-stone-500">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 text-stone-600 dark:text-stone-400">
                      {order.deliveryState}
                    </td>
                    <td className="py-3 font-cinzel font-bold text-stone-900 dark:text-[#d4af37]">
                      ₦{(order.totalKobo / 100).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                        order.status === 'processing' ? 'bg-amber-500/10 text-amber-400' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                        'bg-stone-500/10 text-stone-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-stone-100 dark:bg-black/40 border border-stone-200 dark:border-stone-800 text-[10px] rounded px-2 py-1 outline-none text-stone-700 dark:text-stone-300 focus:border-[#d4af37]"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
