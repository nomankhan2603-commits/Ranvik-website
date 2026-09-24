import { dbStore } from './dbStore';
import { Address } from '../types';

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  addresses: Address[];
}

export const customersService = {
  async getAll(): Promise<CustomerSummary[]> {
    const orders = dbStore.getOrders();
    const customerMap = new Map<string, CustomerSummary>();

    // Seed/Known customers + customers extracted from orders
    orders.forEach((ord) => {
      const snap = ord.shippingAddressSnapshot;
      const key = snap.phone || snap.fullName.toLowerCase().replace(/\s+/g, '-');
      const existing = customerMap.get(key);

      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += ord.totalAmount;
        if (!existing.lastOrderDate || new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = ord.createdAt;
        }
      } else {
        customerMap.set(key, {
          id: `cust-${key}`,
          name: snap.fullName,
          email: `${snap.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          phone: snap.phone,
          ordersCount: 1,
          totalSpent: ord.totalAmount,
          lastOrderDate: ord.createdAt,
          createdAt: ord.createdAt,
          addresses: [snap],
        });
      }
    });

    // Add standard customer profile if empty
    if (customerMap.size === 0) {
      customerMap.set('demo', {
        id: 'cust-demo',
        name: 'Major Raghavendra Sharma',
        email: 'raghav.sharma@tactical.in',
        phone: '+91 98110 54321',
        ordersCount: 3,
        totalSpent: 8497,
        lastOrderDate: new Date().toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        addresses: [
          {
            id: 'addr-demo-1',
            fullName: 'Major Raghavendra Sharma',
            phone: '+91 98110 54321',
            street: 'Officers Mess Road, Section 4',
            city: 'New Delhi',
            state: 'Delhi',
            pinCode: '110001',
            isDefault: true,
          },
        ],
      });
    }

    return Array.from(customerMap.values());
  },
};
