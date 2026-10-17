import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Eye,
  X
} from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../types/admin';
import { adminFetch } from '../../utils/adminAuth';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AdminOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.deliveryState.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') {
      result = result.filter(o => o.status === selectedStatus);
    }
    setFilteredOrders(result);
  }, [orders, searchQuery, selectedStatus]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-2 border-b border-stone-200 dark:border-stone-800">
        <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900 dark:text-[#f5f2eb] tracking-wide">
          PATRON ORDERS &amp; FULFILLMENT
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Review customer purchases, update delivery states, and manage nationwide dispatches
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, or phone..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 rounded-lg text-xs outline-none focus:border-[#d4af37] text-stone-800 dark:text-stone-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-stone-50 dark:bg-black/40 border border-stone-200 dark:border-stone-800 rounded-lg text-xs px-3 py-1.5 text-stone-700 dark:text-stone-300 outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#121110] border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-white/[0.02] text-stone-500 dark:text-stone-400 font-cinzel text-[11px] uppercase">
                <th className="py-3 px-4 font-semibold">Order Number</th>
                <th className="py-3 px-3 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">Destination</th>
                <th className="py-3 px-3 font-semibold">Items</th>
                <th className="py-3 px-3 font-semibold">Total (₦)</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50/70 dark:hover:bg-white/[0.015] transition">
                    <td className="py-3 px-4 font-mono font-semibold text-stone-900 dark:text-stone-100">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-900 dark:text-stone-200">{order.customerName}</div>
                      <div className="text-[10px] text-stone-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-stone-600 dark:text-stone-400">
                      {order.deliveryState}
                    </td>
                    <td className="py-3 px-3 text-stone-500">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} pcs ({order.items.length} titles)
                    </td>
                    <td className="py-3 px-3 font-cinzel font-bold text-stone-900 dark:text-[#d4af37] whitespace-nowrap">
                      ₦{(order.totalKobo / 100).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 hover:bg-[#d4af37] hover:text-black transition text-[11px] font-cinzel"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121110] border border-[#d4af37]/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-[#f5f2eb] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <span className="font-mono text-xs text-[#d4af37] font-semibold">{selectedOrder.orderNumber}</span>
                <h2 className="font-cinzel text-lg font-bold text-white mt-0.5">
                  Order Details &amp; Packaging
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5 text-xs">
              {/* Customer & Delivery Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-stone-800">
                <div>
                  <h4 className="font-cinzel text-[11px] uppercase text-[#c5a059] mb-1.5 font-semibold">
                    Client Details
                  </h4>
                  <p className="font-medium text-white">{selectedOrder.customerName}</p>
                  <p className="text-stone-400 text-[11px] mt-0.5">{selectedOrder.customerEmail}</p>
                  <p className="text-stone-400 text-[11px] flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3 text-[#d4af37]" />
                    <span>{selectedOrder.customerPhone}</span>
                  </p>
                </div>

                <div>
                  <h4 className="font-cinzel text-[11px] uppercase text-[#c5a059] mb-1.5 font-semibold">
                    Delivery Address
                  </h4>
                  <p className="text-stone-300 leading-relaxed">{selectedOrder.deliveryAddress}</p>
                  <p className="text-stone-400 text-[11px] mt-1">State: <strong className="text-white">{selectedOrder.deliveryState}</strong></p>
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h4 className="font-cinzel text-[11px] uppercase text-stone-400 mb-2 font-semibold">
                  Purchased Items ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-stone-800 rounded-xl border border-stone-800 overflow-hidden bg-black/30">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || '/images/products/prod-watch-gold.jpg'}
                          alt={item.productName}
                          className="w-10 h-10 rounded object-cover border border-stone-800"
                        />
                        <div>
                          <div className="font-medium text-white">{item.productName}</div>
                          {item.variantName && (
                            <div className="text-[10px] text-[#c5a059]">Option: {item.variantName}</div>
                          )}
                          <div className="text-[10px] text-stone-500 font-mono">Qty: {item.quantity} × ₦{(item.unitPriceKobo / 100).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="font-cinzel font-bold text-[#d4af37]">
                        ₦{(item.totalKobo / 100).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="p-4 rounded-xl bg-black/40 border border-stone-800 space-y-1.5">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span>₦{(selectedOrder.subtotalKobo / 100).toLocaleString()}</span>
                </div>
                {selectedOrder.discountKobo > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Applied</span>
                    <span>-₦{(selectedOrder.discountKobo / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Delivery Fee</span>
                  <span>₦{(selectedOrder.deliveryFeeKobo / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-cinzel font-bold text-[#d4af37] pt-2 border-t border-stone-800">
                  <span>Total Amount Paid</span>
                  <span>₦{(selectedOrder.totalKobo / 100).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-xs text-stone-400">Transition Order State:</span>
                <div className="flex items-center gap-2">
                  {(['pending', 'processing', 'shipped', 'delivered'] as OrderStatus[]).map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-cinzel font-semibold capitalize transition ${
                        selectedOrder.status === status
                          ? 'bg-[#d4af37] text-black shadow-md'
                          : 'bg-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
