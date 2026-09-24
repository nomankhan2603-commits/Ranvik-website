import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastNotification: React.FC = () => {
  const { toast } = useShop();

  if (!toast) return null;

  return (
    <div
      id="ranvik-toast"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#181818] border border-[#333333] text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-200 rounded-xs"
    >
      {toast.type === 'success' && (
        <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
      )}
      {toast.type === 'info' && (
        <Info className="w-4 h-4 text-[#C7CCA9] shrink-0" />
      )}
      {toast.type === 'alert' && (
        <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0" />
      )}

      <span className="text-xs font-mono text-white">{toast.message}</span>
    </div>
  );
};
