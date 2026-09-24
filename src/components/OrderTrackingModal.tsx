import React from 'react';
import { X, CheckCircle2, Circle, Truck, MapPin, Calendar, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderTrackingModal: React.FC = () => {
  const { isOrderTrackingOpen, setIsOrderTrackingOpen, trackingOrder } = useShop();

  if (!isOrderTrackingOpen || !trackingOrder) return null;

  const order = trackingOrder;

  const stages = [
    { title: 'Order Placed', desc: 'Secure payment confirmed' },
    { title: 'Confirmed', desc: 'Quality inspection passed' },
    { title: 'Packed', desc: 'Custom packaging sealed' },
    { title: 'Shipped', desc: 'In courier transit' },
    { title: 'Out for Delivery', desc: 'Local hub courier out for delivery' },
    { title: 'Delivered', desc: 'Delivered to recipient' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.title === order.status);
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 0;

  return (
    <div
      id="order-tracking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] border border-[#E2E0DA] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-[#181818] rounded-xs">
        {/* Close Button */}
        <button
          onClick={() => setIsOrderTrackingOpen(false)}
          className="absolute top-5 right-5 p-2 text-[#77746D] hover:text-[#181818] transition-colors"
          aria-label="Close order tracker"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#626653] uppercase tracking-widest mb-1 font-bold">
          <Truck className="w-4 h-4" />
          <span>ORDER TRACKING & TIMELINE</span>
        </div>
        <h3 className="font-condensed font-black text-3xl sm:text-4xl uppercase text-[#181818] tracking-wide mb-1">
          ORDER #{order.orderNumber}
        </h3>
        <p className="text-xs font-mono text-[#55524B] mb-6">
          TRACKING NUMBER: <span className="text-[#181818] font-bold">{order.trackingNumber}</span> • VIA DELHI-EXPRESS COURIER
        </p>

        {/* Status Summary Banner */}
        <div className="bg-[#F7F6F2] border border-[#E2E0DA] p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFFFFF] border border-[#E2E0DA] text-[#181818] rounded-xs shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#77746D] font-medium">CURRENT STATUS</p>
              <p className="font-condensed text-xl font-bold uppercase text-[#181818] tracking-wide">
                {order.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#55524B]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#626653]" />
              <span>Est: {order.estimatedDelivery}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#626653]" />
              <span>{order.shippingAddress.city}</span>
            </div>
          </div>
        </div>

        {/* Interactive Step Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-[#E2E0DA] mb-8 ml-3 sm:ml-4">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={stage.title} className="relative group">
                {/* Node dot */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-0 h-6 w-6 rounded-full flex items-center justify-center border transition-colors ${
                    isCurrent
                      ? 'bg-[#181818] border-[#181818] text-white ring-4 ring-[#181818]/10'
                      : isCompleted
                      ? 'bg-[#2E7D32] border-[#2E7D32] text-white'
                      : 'bg-[#FFFFFF] border-[#D9D7D0] text-[#8C8982]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-2.5 h-2.5 fill-current" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <h4
                    className={`font-condensed font-bold text-lg uppercase tracking-wide ${
                      isCurrent ? 'text-[#181818]' : isCompleted ? 'text-[#333333]' : 'text-[#8C8982]'
                    }`}
                  >
                    {stage.title}
                  </h4>
                  {isCurrent && (
                    <span className="font-mono text-[10px] text-[#181818] uppercase tracking-wider font-bold">
                      IN TRANSIT
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#55524B] mt-0.5">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Order Items manifest */}
        <div className="border-t border-[#E2E0DA] pt-6 mb-6">
          <h4 className="font-mono text-xs uppercase tracking-widest text-[#77746D] mb-3 font-medium">
            ITEMS IN SHIPMENT
          </h4>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-[#F7F6F2] p-3 border border-[#E2E0DA]">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover bg-[#FFFFFF] border border-[#E2E0DA]"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0 font-mono text-xs">
                  <p className="font-bold text-[#181818] truncate">{item.product.name}</p>
                  <p className="text-[11px] text-[#77746D]">
                    Size: UK {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#181818]">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-[#F7F6F2] p-4 border border-[#E2E0DA] text-xs font-mono space-y-1">
          <p className="text-[10px] uppercase text-[#77746D] font-medium">DELIVER TO:</p>
          <p className="text-[#181818] font-bold">{order.shippingAddress.fullName}</p>
          <p className="text-[#55524B]">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}</p>
          <p className="text-[#77746D]">Contact: {order.shippingAddress.phone}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E2E0DA] text-right">
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="px-6 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-xs font-mono uppercase tracking-wider shadow-xs"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
