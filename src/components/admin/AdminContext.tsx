import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../../lib/supabase/client';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'inventory_history'
  | 'orders'
  | 'customers'
  | 'pricing'
  | 'coupons'
  | 'categories'
  | 'media'
  | 'content'
  | 'settings';

interface AdminUserSession {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'inventory_manager' | 'order_manager';
  name: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  user: AdminUserSession | null;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isSupabaseLive: boolean;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('RANVIK_ADMIN_AUTH') === 'true';
    }
    return false;
  });

  const [user, setUser] = useState<AdminUserSession | null>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('RANVIK_ADMIN_AUTH') === 'true') {
      return {
        id: 'usr-admin-master',
        email: 'admin@ranvikfootwear.com',
        role: 'super_admin',
        name: 'Command General (Admin)',
      };
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isSupabaseLive = isSupabaseConfigured;

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Check credentials via local logic or API
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === 'admin@ranvikfootwear.com' || cleanEmail === 'admin') &&
      (pass === 'ranvik123' || pass === 'admin')
    ) {
      const adminUser: AdminUserSession = {
        id: 'usr-admin-master',
        email: 'admin@ranvikfootwear.com',
        role: 'super_admin',
        name: 'Command General (Admin)',
      };
      setIsAuthenticated(true);
      setUser(adminUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('RANVIK_ADMIN_AUTH', 'true');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('RANVIK_ADMIN_AUTH');
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        user,
        activeTab,
        setActiveTab,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        selectedCustomerId,
        setSelectedCustomerId,
        login,
        logout,
        isSupabaseLive,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
