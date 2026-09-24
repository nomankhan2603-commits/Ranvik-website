import { DBOrder, DBOrderStatus, Address } from '../types';
import { dbStore } from './dbStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';

export interface CreateOrderInput {
  userId?: string;
  shippingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingAmount: number;
  totalAmount: number;
  items: {
    productId: string;
    variantId: string;
    productName: string;
    sku: string;
    size: number;
    quantity: number;
    unitPrice: number;
    productImageUrl: string;
  }[];
}

export const ordersService = {
  async getAll(): Promise<DBOrder[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (*),
            order_status_history (*)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number,
            userId: o.user_id,
            status: o.status,
            paymentStatus: o.payment_status,
            paymentMethod: o.payment_method,
            subtotal: Number(o.subtotal),
            discount: Number(o.discount),
            shippingAmount: Number(o.shipping_amount),
            taxAmount: Number(o.tax_amount || 0),
            totalAmount: Number(o.total_amount),
            shippingAddressSnapshot: o.shipping_address_snapshot,
            trackingNumber: `RVK-EXP-${o.order_number.replace('RVK-', '')}`,
            estimatedDelivery: '3–5 business days',
            createdAt: o.created_at,
            updatedAt: o.updated_at,
            items: (o.order_items || []).map((i: any) => ({
              id: i.id,
              orderId: i.order_id,
              productId: i.product_id,
              variantId: i.variant_id,
              productName: i.product_name,
              sku: i.sku,
              size: i.size,
              quantity: i.quantity,
              unitPrice: Number(i.unit_price),
              totalPrice: Number(i.total_price),
              productImageUrl: i.product_image_url,
            })),
            statusHistory: (o.order_status_history || []).map((h: any) => ({
              id: h.id,
              orderId: h.order_id,
              status: h.status,
              note: h.note,
              changedBy: h.changed_by,
              createdAt: h.created_at,
            })),
          }));
        }
      } catch (err) {
        console.warn('Supabase orders fetch failed, falling back to local store:', err);
      }
    }

    return dbStore.getOrders();
  },

  async getById(id: string): Promise<DBOrder | null> {
    const orders = await this.getAll();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async create(input: CreateOrderInput): Promise<DBOrder> {
    if (isSupabaseConfigured) {
      try {
        const orderNumber = `RVK-${Date.now().toString().slice(-5)}`;
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: input.userId || null,
            status: 'order_placed',
            payment_status: 'paid',
            payment_method: input.paymentMethod,
            subtotal: input.subtotal,
            discount: input.discount,
            shipping_amount: input.shippingAmount,
            total_amount: input.totalAmount,
            shipping_address_snapshot: input.shippingAddress,
          })
          .select()
          .single();

        if (!orderErr && orderData) {
          const itemPayloads = input.items.map((it) => ({
            order_id: orderData.id,
            product_id: it.productId,
            variant_id: it.variantId,
            product_name: it.productName,
            sku: it.sku,
            size: it.size,
            quantity: it.quantity,
            unit_price: it.unitPrice,
            total_price: it.unitPrice * it.quantity,
            product_image_url: it.productImageUrl,
          }));

          await supabase.from('order_items').insert(itemPayloads);
          await supabase.from('order_status_history').insert({
            order_id: orderData.id,
            status: 'order_placed',
            note: 'Order placed by customer.',
          });
        }
      } catch (err) {
        console.warn('Supabase order creation failed, fallback to local store:', err);
      }
    }

    return dbStore.createOrder(input);
  },

  async updateStatus(orderId: string, status: DBOrderStatus, note?: string): Promise<DBOrder | null> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
        await supabase.from('order_status_history').insert({
          order_id: orderId,
          status,
          note: note || `Status updated to ${status}`,
        });
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    return dbStore.updateOrderStatus(orderId, status, note);
  },
};
