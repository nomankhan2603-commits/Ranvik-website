import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowUpRight,
  PackageCheck,
  Calendar,
  Layers,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { analyticsService, DashboardMetrics } from '../../services/analytics';
import { ordersService } from '../../services/orders';
import { DBOrder } from '../../types';
import { useAdmin } from './AdminContext';

export const AdminDashboard: React.FC = () => {
  const { setActiveTab, setSelectedOrderId, refreshTrigger } = useAdmin();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<DBOrder[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '12m'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange, refreshTrigger]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, ords] = await Promise.all([
        analyticsService.getDashboardMetrics(timeRange),
        ordersService.getAll(),
      ]);
      setMetrics(m);
      setRecentOrders(ords.slice(0, 6));
    } catch (e) {
      console.error('Failed to load dashboard metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="p-8 flex items-center justify-center text-sm font-mono text-[#8C92A4]">
        <Clock className="w-4 h-4 animate-spin mr-2" /> LOADING HQ METRICS...
      </div>
    );
  }

  const maxSale = Math.max(...metrics.recentSales.map((s) => s.amount), 1000);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            OPERATIONS & REVENUE DASHBOARD
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Real-time Supabase telemetry • Agra foundry logistics & inventory
          </p>
        </div>

        {/* Time range picker */}
        <div className="flex items-center gap-1 bg-[#16181E] border border-[#2B2E38] p-1 rounded-xs">
          {(['7d', '30d', '3m', '12m'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors rounded-xs ${
                timeRange === r
                  ? 'bg-[#B83A2A] text-white'
                  : 'text-[#8C92A4] hover:text-white'
              }`}
            >
              {r === '7d' ? '7 DAYS' : r === '30d' ? '30 DAYS' : r === '3m' ? '3 MONTHS' : 'YEAR'}
            </button>
          ))}
          <button
            onClick={loadData}
            title="Refresh metrics"
            className="p-1.5 text-[#8C92A4] hover:text-white transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-[#16181E] border border-[#2B2E38] p-5 rounded-xs">
          <div className="flex items-center justify-between text-[#8C92A4] mb-2">
            <span className="text-[11px] font-mono tracking-widest uppercase">GROSS REVENUE</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-black font-condensed tracking-wider text-white">
            ₹{metrics.totalSales.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] font-mono text-[#10B981] mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Verified through order transactions</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-[#16181E] border border-[#2B2E38] p-5 rounded-xs">
          <div className="flex items-center justify-between text-[#8C92A4] mb-2">
            <span className="text-[11px] font-mono tracking-widest uppercase">TOTAL ORDERS</span>
            <ShoppingCart className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-black font-condensed tracking-wider text-white">
            {metrics.totalOrders}
          </div>
          <p className="text-[10px] font-mono text-[#8C92A4] mt-1">
            Across online UPI, Cards & COD
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => setActiveTab('inventory')}
          className="bg-[#16181E] border border-[#2B2E38] hover:border-[#F59E0B] p-5 rounded-xs cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-[#8C92A4] mb-2">
            <span className="text-[11px] font-mono tracking-widest uppercase">STOCK ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-black font-condensed tracking-wider text-[#F59E0B]">
            {metrics.lowStockCount} Low / {metrics.outOfStockCount} OOS
          </div>
          <p className="text-[10px] font-mono text-[#8C92A4] mt-1">
            Click to manage size variants
          </p>
        </div>

        {/* Total Customers */}
        <div className="bg-[#16181E] border border-[#2B2E38] p-5 rounded-xs">
          <div className="flex items-center justify-between text-[#8C92A4] mb-2">
            <span className="text-[11px] font-mono tracking-widest uppercase">CUSTOMERS</span>
            <Users className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-2xl font-black font-condensed tracking-wider text-white">
            {metrics.totalCustomers}
          </div>
          <p className="text-[10px] font-mono text-[#8C92A4] mt-1">
            Active military & civilian buyers
          </p>
        </div>
      </div>

      {/* Revenue Trend Visualizer */}
      <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-widest font-bold text-white">
              DAILY REVENUE TRAJECTORY
            </h2>
            <p className="text-[11px] font-mono text-[#8C92A4]">
              Last 7 days fulfilled transaction totals
            </p>
          </div>
          <span className="text-xs font-mono text-[#8C92A4]">INR (₹)</span>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-48 flex items-end gap-3 sm:gap-6 pt-4 border-b border-[#2B2E38]">
          {metrics.recentSales.map((s, idx) => {
            const pct = Math.max(12, Math.round((s.amount / maxSale) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-[#8C92A4] opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{s.amount.toLocaleString('en-IN')}
                </div>
                <div
                  style={{ height: `${pct}%` }}
                  className="w-full bg-[#2B2E38] group-hover:bg-[#B83A2A] transition-colors rounded-t-xs"
                />
                <span className="text-[10px] font-mono text-[#8C92A4] shrink-0">
                  {s.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown: Top Products & Top Sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#B83A2A]" />
              TOP-PERFORMING BOOTS
            </h2>
            <button
              onClick={() => setActiveTab('products')}
              className="text-[10px] font-mono text-[#B83A2A] hover:underline"
            >
              VIEW ALL PRODUCTS
            </button>
          </div>

          <div className="space-y-3">
            {metrics.topProducts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#111317] border border-[#22252E] rounded-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#8C92A4] w-4">#{idx + 1}</span>
                  <div>
                    <span className="font-mono text-xs text-white font-bold block">{p.name}</span>
                    <span className="font-mono text-[10px] text-[#8C92A4]">
                      {p.unitsSold} units delivered
                    </span>
                  </div>
                </div>
                <div className="font-mono text-xs font-bold text-[#E04D39]">
                  ₹{p.revenue.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Sizes */}
        <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C7CCA9]" />
              SIZE VELOCITY (UK 6–11)
            </h2>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-[10px] font-mono text-[#8C92A4] hover:text-white"
            >
              ADJUST SIZES
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {metrics.topSizes.map((s) => (
              <div
                key={s.size}
                className="p-3 bg-[#111317] border border-[#22252E] text-center rounded-xs"
              >
                <span className="text-[10px] font-mono text-[#8C92A4] block uppercase">
                  SIZE UK {s.size}
                </span>
                <span className="text-lg font-condensed font-bold text-white block mt-0.5">
                  {s.unitsSold}
                </span>
                <span className="text-[9px] font-mono text-[#10B981]">sold to date</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#3B82F6]" />
            RECENT CUSTOMER DISPATCHES
          </h2>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-[10px] font-mono text-[#B83A2A] hover:underline"
          >
            VIEW ALL ORDERS ({metrics.totalOrders})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#2B2E38] text-[#8C92A4] text-[10px] uppercase">
                <th className="pb-3 font-normal">ORDER #</th>
                <th className="pb-3 font-normal">CUSTOMER</th>
                <th className="pb-3 font-normal">ITEMS</th>
                <th className="pb-3 font-normal">TOTAL</th>
                <th className="pb-3 font-normal">STATUS</th>
                <th className="pb-3 font-normal text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22252E]">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#1C1F26] transition-colors">
                  <td className="py-3 text-white font-bold">{ord.orderNumber}</td>
                  <td className="py-3 text-[#CBD5E1]">
                    {ord.shippingAddressSnapshot.fullName}
                  </td>
                  <td className="py-3 text-[#8C92A4]">
                    {ord.items.map((it) => `${it.productName} (UK ${it.size})`).join(', ')}
                  </td>
                  <td className="py-3 text-white font-bold">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3">
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
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setActiveTab('orders');
                      }}
                      className="px-2.5 py-1 bg-[#242731] hover:bg-[#B83A2A] text-white text-[10px] rounded-xs transition-colors"
                    >
                      DETAILS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
