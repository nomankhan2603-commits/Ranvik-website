import React from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  Ticket,
  FolderTree,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Database,
  Radio,
} from 'lucide-react';
import { useAdmin, AdminTab } from './AdminContext';

interface AdminSidebarProps {
  onGoToStorefront: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onGoToStorefront }) => {
  const { activeTab, setActiveTab, logout, isSupabaseLive, user } = useAdmin();

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory & Stock', icon: Boxes },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'pricing', label: 'Pricing Matrix', icon: Tag },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'media', label: 'Media Manager', icon: ImageIcon },
    { id: 'content', label: 'Homepage Content', icon: FileText },
    { id: 'settings', label: 'Supabase & System', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#121418] border-r border-[#242731] flex flex-col h-screen select-none shrink-0 text-[#E1E4EA]">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#242731]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-condensed font-black text-2xl tracking-wider text-white">
              RANVIK
            </h2>
            <p className="text-[10px] font-mono tracking-widest text-[#B83A2A] font-bold">
              HQ ADMIN PANEL
            </p>
          </div>
          <button
            onClick={onGoToStorefront}
            title="View live customer storefront"
            className="p-1.5 bg-[#1C1F26] hover:bg-[#282C37] text-[#A0A6B8] hover:text-white border border-[#2B2E38] transition-colors rounded-xs flex items-center gap-1 text-[10px] font-mono"
          >
            <span>STORE</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Supabase status badge */}
        <div className="mt-3 py-1.5 px-2.5 bg-[#16181E] border border-[#242731] rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#A0A6B8]" />
            <span className="text-[10px] font-mono text-[#A0A6B8]">SUPABASE DB</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseLive ? 'bg-[#10B981] animate-pulse' : 'bg-[#F59E0B]'
              }`}
            />
            <span className="text-[9px] font-mono uppercase font-bold text-white">
              {isSupabaseLive ? 'LIVE' : 'LOCAL SYNC'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono tracking-wider transition-colors rounded-xs text-left ${
                isActive
                  ? 'bg-[#B83A2A] text-white font-bold shadow-xs'
                  : 'text-[#9BA1B2] hover:bg-[#1C1F26] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-[#242731] bg-[#0E0F12]">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-mono font-bold text-white truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] font-mono text-[#8C92A4] truncate">
              {user?.role || 'super_admin'}
            </p>
          </div>
          <button
            onClick={logout}
            title="Log out of Admin"
            className="p-2 text-[#8C92A4] hover:text-[#B83A2A] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
