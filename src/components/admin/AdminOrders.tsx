import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  X,
  CreditCard,
  Send,
} from 'lucide-react';
import { ordersService } from '../../services/orders';
import { DBOrder, DBOrderStatus } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminOrders: React.FC = () => {
  const { selectedOrderId, setSelectedOrderId, refreshTrigger, triggerRefresh } = useAdmin();
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Detail Modal
  const [activeOrder, setActiveOrder] = useState<DBOrder | null>(null);
  const [newStatus, setNewStatus] = useState<DBOrderStatus>('confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [refreshTrigger]);

  useEffect(() => {
    if (selectedOrderId && orders.length > 0) {
      const found = orders.find((o) => o.id === selectedOrderId);
      if (found) {
        setActiveOrder(found);
        setNewStatus(found.status);
      }
    }
  }, [selectedOrderId, orders]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAll();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    setUpdating(true);

    try {
      const updated = await ordersService.updateStatus(activeOrder.id, newStatus, statusNote);
      if (updated) {
        setActiveOrder(updated);
        setStatusNote('');
        triggerRefresh();
        loadOrders();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddressSnapshot.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            CUSTOMER ORDER DISPATCHES
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Historical product snapshots • Live order status tracking & logistics
          </p>
        </div>

        <div className="text-xs font-mono text-[#8C92A4] bg-[#16181E] border border-[#2B2E38] px-3 py-2 rounded-xs">
          TOTAL PROCESSED: <span className="text-white font-bold">{orders.length}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C92A4] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, Customer, or Tracking Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16181E] border border-[#2B2E38] text-white pl-9 pr-3 py-2.5 text-xs font-mono rounded-xs focus:border-[#B83A2A] focus:outline-hidden"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#16181E] border border-[#2B2E38] text-white px-3 py-2.5 text-xs font-mono rounded-xs focus:outline-hidden"
        >
          <option value="all">ALL STAGES</option>
          <option value="order_placed">ORDER PLACED</option>
          <option value="confirmed">CONFIRMED</option>
          <option value="packed">PACKED</option>
          <option value="shipped">SHIPPED</option>
          <option value="out_for_delivery">OUT FOR DELIVERY</option>
          <option value="delivered">DELIVERED</option>
          <option value="cancelled">CANCELLED</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[#16181E] border border-[#2B2E38] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2B2E38] bg-[#121418] text-[#8C92A4] text-[10px] uppercase">
                <th className="p-3.5 font-normal">ORDER #</th>
                <th className="p-3.5 font-normal">DATE</th>
                <th className="p-3.5 font-normal">CUSTOMER</th>
                <th className="p-3.5 font-normal">CITY & PIN</th>
                <th className="p-3.5 font-normal">ITEMS</th>
                <th className="p-3.5 font-normal">PAYMENT</th>
                <th className="p-3.5 font-normal">TOTAL</th>
                <th className="p-3.5 font-normal">STATUS</th>
                <th className="p-3.5 font-normal text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22252E]">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#1C1F26] transition-colors">
                  <td className="p-3.5 font-bold text-white">{ord.orderNumber}</td>
                  <td className="p-3.5 text-[#8C92A4] whitespace-nowrap">
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="p-3.5 text-[#CBD5E1]">
                    {ord.shippingAddressSnapshot.fullName}
                  </td>
                  <td className="p-3.5 text-[#8C92A4]">
                    {ord.shippingAddressSnapshot.city}, {ord.shippingAddressSnapshot.pinCode}
                  </td>
                  <td className="p-3.5 text-[#CBD5E1]">
                    {ord.items.length} pair{ord.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="p-3.5">
                    <span className="uppercase text-[10px] text-[#A0A6B8] bg-[#242731] px-2 py-0.5 rounded-xs">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-white">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] uppercase font-bold rounded-xs ${
                        ord.status === 'delivered'
                          ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40'
                          : ord.status === 'shipped'
                          ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40'
                          : ord.status === 'packed'
                          ? 'bg-[#F59E0B]/20 text-[#FBBF24] border border-[#F59E0B]/40'
                          : 'bg-[#B83A2A]/20 text-[#F87171] border border-[#B83A2A]/40'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setActiveOrder(ord);
                        setNewStatus(ord.status);
                      }}
                      className="px-2.5 py-1 bg-[#242731] hover:bg-[#B83A2A] text-white text-[10px] rounded-xs transition-colors uppercase font-bold"
                    >
                      INSPECT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#16181E] border border-[#2B2E38] w-full max-w-3xl p-6 rounded-xs shadow-2xl relative my-8">
            <button
              onClick={() => {
                setActiveOrder(null);
                setSelectedOrderId(null);
              }}
              className="absolute top-4 right-4 text-[#8C92A4] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="font-condensed font-black text-2xl uppercase tracking-wider text-white">
                ORDER {activeOrder.orderNumber}
              </span>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-[#B83A2A]/20 text-[#E04D39] border border-[#B83A2A]/40 rounded-xs">
                {activeOrder.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs font-mono text-[#8C92A4] mb-6">
              Placed on {new Date(activeOrder.createdAt).toLocaleString('en-IN')} • Tracking:{' '}
              <span className="text-white font-bold">{activeOrder.trackingNumber || 'PENDING'}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Customer & Address */}
              <div className="bg-[#111317] border border-[#22252E] p-4 rounded-xs text-xs font-mono">
                <span className="text-[10px] text-[#8C92A4] uppercase tracking-wider block mb-2 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B83A2A]" />
                  DELIVERY DESTINATION
                </span>
                <p className="font-bold text-white text-sm">
                  {activeOrder.shippingAddressSnapshot.fullName}
                </p>
                <p className="text-[#A0A6B8] mt-1">{activeOrder.shippingAddressSnapshot.phone}</p>
                <p className="text-[#A0A6B8] mt-0.5">{activeOrder.shippingAddressSnapshot.street}</p>
                <p className="text-[#A0A6B8]">
                  {activeOrder.shippingAddressSnapshot.city},{' '}
                  {activeOrder.shippingAddressSnapshot.state} —{' '}
                  {activeOrder.shippingAddressSnapshot.pinCode}
                </p>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#111317] border border-[#22252E] p-4 rounded-xs text-xs font-mono">
                <span className="text-[10px] text-[#8C92A4] uppercase tracking-wider block mb-2 font-bold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#3B82F6]" />
                  PAYMENT & RECONCILIATION
                </span>
                <div className="space-y-1.5 text-[#A0A6B8]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white">₹{activeOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-[#10B981]">
                      <span>Discount:</span>
                      <span>-₹{activeOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="text-white">
                      {activeOrder.shippingAmount === 0 ? 'FREE' : `₹${activeOrder.shippingAmount}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#22252E] pt-2 font-bold text-white text-sm">
                    <span>Total Paid:</span>
                    <span className="text-[#E04D39]">
                      ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Snapshot Table */}
            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#8C92A4] uppercase tracking-wider block mb-2 font-bold">
                HISTORICAL ITEM SNAPSHOTS (IMMUNE TO FUTURE PRICE CHANGES)
              </span>
              <div className="bg-[#111317] border border-[#22252E] rounded-xs overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#22252E] text-[10px] text-[#8C92A4] uppercase">
                      <th className="p-3">ITEM</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">SIZE</th>
                      <th className="p-3">QTY</th>
                      <th className="p-3">UNIT PRICE</th>
                      <th className="p-3 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22252E]">
                    {activeOrder.items.map((it) => (
                      <tr key={it.id}>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={it.productImageUrl || '/assets/boot1.png'}
                              alt=""
                              className="w-8 h-8 object-contain bg-[#0E0F12] border border-[#2B2E38] p-0.5 rounded-xs"
                            />
                            <span className="font-bold text-white">{it.productName}</span>
                          </div>
                        </td>
                        <td className="p-3 text-[#8C92A4]">{it.sku}</td>
                        <td className="p-3 text-white font-bold">UK {it.size}</td>
                        <td className="p-3 text-[#A0A6B8]">{it.quantity}</td>
                        <td className="p-3 text-[#A0A6B8]">₹{it.unitPrice}</td>
                        <td className="p-3 text-right font-bold text-white">
                          ₹{it.totalPrice.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeline History */}
            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#8C92A4] uppercase tracking-wider block mb-2 font-bold">
                STAGE TIMELINE LOG ({activeOrder.statusHistory?.length || 1} EVENTS)
              </span>
              <div className="bg-[#111317] border border-[#22252E] p-4 rounded-xs space-y-3">
                {activeOrder.statusHistory?.map((h) => (
                  <div key={h.id} className="flex items-start gap-3 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#B83A2A] mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase text-[11px]">
                          {h.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-[#8C92A4]">
                          {new Date(h.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      {h.note && <p className="text-[11px] text-[#8C92A4] mt-0.5">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="bg-[#0E0F12] border border-[#2B2E38] p-4 rounded-xs">
              <span className="text-[10px] font-mono text-[#8C92A4] uppercase tracking-wider block mb-2 font-bold">
                ADVANCE ORDER DISPATCH PIPELINE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    NEW STATUS
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full bg-[#16181E] border border-[#2B2E38] text-white p-2 text-xs font-mono rounded-xs focus:outline-hidden"
                  >
                    <option value="confirmed">CONFIRMED (Factory Agra)</option>
                    <option value="packed">PACKED (Carton Labeled)</option>
                    <option value="shipped">SHIPPED (AWB Generated)</option>
                    <option value="out_for_delivery">OUT FOR DELIVERY</option>
                    <option value="delivered">DELIVERED</option>
                    <option value="cancelled">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8C92A4] mb-1">
                    LOG NOTE / DISPATCH CARRIER
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Handed over to BlueDart courier hub."
                    className="w-full bg-[#16181E] border border-[#2B2E38] text-white p-2 text-xs font-mono rounded-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-2.5 bg-[#B83A2A] hover:bg-[#A33324] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{updating ? 'UPDATING DB...' : 'RECORD STATUS CHANGE'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
