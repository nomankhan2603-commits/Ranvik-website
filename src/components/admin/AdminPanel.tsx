import React from 'react';
import { AdminProvider, useAdmin } from './AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminInventory } from './AdminInventory';
import { AdminOrders } from './AdminOrders';
import { AdminCustomers } from './AdminCustomers';
import { AdminPricing } from './AdminPricing';
import { AdminCoupons } from './AdminCoupons';
import { AdminCategories } from './AdminCategories';
import { AdminMediaManager } from './AdminMediaManager';
import { AdminContentManager } from './AdminContentManager';
import { AdminSettings } from './AdminSettings';

interface AdminPanelProps {
  onGoToStorefront: () => void;
}

const AdminPanelContent: React.FC<AdminPanelProps> = ({ onGoToStorefront }) => {
  const { isAuthenticated, activeTab } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLogin onBackToStore={onGoToStorefront} />;
  }

  return (
    <div className="flex h-screen bg-[#0E0F12] text-[#F3F4F6] overflow-hidden selection:bg-[#B83A2A]">
      {/* Sidebar */}
      <AdminSidebar onGoToStorefront={onGoToStorefront} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'products' && <AdminProducts />}
        {(activeTab === 'inventory' || activeTab === 'inventory_history') && <AdminInventory />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'customers' && <AdminCustomers />}
        {activeTab === 'pricing' && <AdminPricing />}
        {activeTab === 'coupons' && <AdminCoupons />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'media' && <AdminMediaManager />}
        {activeTab === 'content' && <AdminContentManager />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  return (
    <AdminProvider>
      <AdminPanelContent {...props} />
    </AdminProvider>
  );
};
