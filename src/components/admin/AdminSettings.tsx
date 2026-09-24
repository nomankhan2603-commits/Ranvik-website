import React, { useState, useEffect } from 'react';
import { Database, ShieldAlert, CheckCircle2, RotateCcw, Copy, ExternalLink, Terminal } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { dbStore } from '../../services/dbStore';
import { useAdmin } from './AdminContext';

export const AdminSettings: React.FC = () => {
  const { triggerRefresh } = useAdmin();
  const [copied, setCopied] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const envVars = [
    {
      name: 'NEXT_PUBLIC_SUPABASE_URL / VITE_SUPABASE_URL',
      role: 'Supabase Project API Endpoint',
      isSet: Boolean(import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL),
    },
    {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY',
      role: 'Public Anonymous Key (Client-Safe)',
      isSet: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
    {
      name: 'SUPABASE_SERVICE_ROLE_KEY',
      role: 'Private Admin Service Key (Server-Side Only, Never Expose to Browser)',
      isSet: false, // strictly server-side
    },
  ];

  const handleReset = () => {
    if (confirm('Reset RANVIK Database to factory seed state? This restores all 7 default tactical boots, UK 6-11 variants, active coupons, and orders.')) {
      dbStore.resetToDefault();
      setResetMessage('Database successfully reset to seed state.');
      triggerRefresh();
      setTimeout(() => setResetMessage(''), 3000);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            DATABASE & SUPABASE ARCHITECTURE
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Environment verification, SQL migration audit, and disaster recovery
          </p>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3 bg-[#10B981]/20 border border-[#10B981] text-[#34D399] text-xs font-mono rounded-xs">
          {resetMessage}
        </div>
      )}

      {/* Supabase Status Banner */}
      <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xs border ${
                isSupabaseConfigured
                  ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981]'
                  : 'bg-[#F59E0B]/10 border-[#F59E0B]/40 text-[#F59E0B]'
              }`}
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-base font-bold text-white">
                  SUPABASE POSTGRESQL CONNECTION
                </h2>
                <span
                  className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-xs ${
                    isSupabaseConfigured
                      ? 'bg-[#10B981]/20 text-[#34D399]'
                      : 'bg-[#F59E0B]/20 text-[#FBBF24]'
                  }`}
                >
                  {isSupabaseConfigured ? 'LIVE CONNECTED' : 'LOCAL STORE SYNC'}
                </span>
              </div>
              <p className="text-xs font-mono text-[#8C92A4] mt-1">
                {isSupabaseConfigured
                  ? 'All product catalogs, variants, RLS policies, and orders are querying the remote Supabase PostgreSQL database directly.'
                  : 'Currently operating in hybrid local storage sync mode. Once you add your Supabase URL and Anon key to .env, it connects seamlessly.'}
              </p>
            </div>
          </div>
        </div>

        {/* Environment check list */}
        <div className="mt-6 space-y-2.5 pt-4 border-t border-[#242731]">
          <span className="text-[10px] font-mono text-[#8C92A4] uppercase tracking-wider block font-bold">
            ENVIRONMENT VARIABLES CONFIGURATION
          </span>
          {envVars.map((v) => (
            <div
              key={v.name}
              className="flex items-center justify-between p-2.5 bg-[#111317] border border-[#22252E] rounded-xs text-xs font-mono"
            >
              <div>
                <span className="text-white font-bold block">{v.name}</span>
                <span className="text-[10px] text-[#8C92A4]">{v.role}</span>
              </div>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                  v.isSet
                    ? 'bg-[#10B981]/20 text-[#34D399]'
                    : 'bg-[#242731] text-[#8C92A4]'
                }`}
              >
                {v.isSet ? 'CONFIGURED' : 'OPTIONAL / SERVER'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-[#B83A2A]/10 border border-[#B83A2A]/40 p-5 rounded-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#E04D39] shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-[#E1E4EA] space-y-1">
          <span className="font-bold text-white block">MILITARY-GRADE SECURITY DIRECTIVE:</span>
          <p className="text-[#A0A6B8]">
            Never expose <code className="text-white">SUPABASE_SERVICE_ROLE_KEY</code> to the client
            browser bundle. The client utilizes the public anon key with Row Level Security (RLS)
            policies enabled on all 16 database tables.
          </p>
        </div>
      </div>

      {/* Migrations summary */}
      <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs">
        <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-white mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#C7CCA9]" />
          POSTGRESQL MIGRATION SCRIPTS (DEPLOYED AT /supabase/migrations/)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#111317] border border-[#22252E] rounded-xs">
            <span className="text-white font-bold block">001_initial_schema.sql</span>
            <span className="text-[10px] text-[#8C92A4]">Categories, Products, Variants, Carts</span>
          </div>
          <div className="p-3 bg-[#111317] border border-[#22252E] rounded-xs">
            <span className="text-white font-bold block">002_rls.sql</span>
            <span className="text-[10px] text-[#8C92A4]">Row Level Security & Policies</span>
          </div>
          <div className="p-3 bg-[#111317] border border-[#22252E] rounded-xs">
            <span className="text-white font-bold block">003_inventory.sql</span>
            <span className="text-[10px] text-[#8C92A4]">RPC reserve_stock & audit transactions</span>
          </div>
          <div className="p-3 bg-[#111317] border border-[#22252E] rounded-xs">
            <span className="text-white font-bold block">004_orders.sql</span>
            <span className="text-[10px] text-[#8C92A4]">Orders, Historical Snapshots, Status</span>
          </div>
          <div className="p-3 bg-[#111317] border border-[#22252E] rounded-xs">
            <span className="text-white font-bold block">005_coupons.sql</span>
            <span className="text-[10px] text-[#8C92A4]">Promotional codes & rules</span>
          </div>
          <div className="p-3 bg-[#111317] border border-[#22252E] rounded-xs">
            <span className="text-white font-bold block">006_content.sql</span>
            <span className="text-[10px] text-[#8C92A4]">Admin users & editorial content</span>
          </div>
        </div>
      </div>

      {/* Disaster Recovery */}
      <div className="bg-[#16181E] border border-[#2B2E38] p-6 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest font-bold text-white">
            RESTORE DEFAULT FACTORY SEED STATE
          </h3>
          <p className="text-xs font-mono text-[#8C92A4] mt-0.5">
            Reset all catalogs, size 6-11 variants, active promo codes, and sample dispatches.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-[#242731] hover:bg-[#B83A2A] text-white text-xs font-mono uppercase font-bold rounded-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RE-SEED DATABASE</span>
        </button>
      </div>
    </div>
  );
};
