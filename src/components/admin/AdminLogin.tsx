import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, Terminal } from 'lucide-react';
import { useAdmin } from './AdminContext';

export const AdminLogin: React.FC<{ onBackToStore: () => void }> = ({ onBackToStore }) => {
  const { login } = useAdmin();
  const [email, setEmail] = useState('admin@ranvikfootwear.com');
  const [password, setPassword] = useState('ranvik123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid administrative credentials. Use admin@ranvikfootwear.com / ranvik123.');
      }
    } catch (err) {
      setError('Authentication server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#F3F4F6] flex flex-col justify-center items-center p-4 selection:bg-[#B83A2A]">
      <div className="w-full max-w-md bg-[#16181D] border border-[#2B2E38] p-8 shadow-2xl relative rounded-xs">
        {/* Back to store button */}
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8C92A4] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STOREFRONT</span>
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-[#B83A2A]/10 border border-[#B83A2A]/40 text-[#E04D39]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-condensed font-black text-2xl uppercase tracking-wider text-white">
              RANVIK HQ ADMIN
            </h1>
            <p className="text-[11px] font-mono text-[#8C92A4] tracking-widest uppercase">
              MILITARY FOOTWEAR COMMAND
            </p>
          </div>
        </div>

        <div className="bg-[#1C1F26] border border-[#2B2E38] p-3 mb-6 flex items-start gap-2.5 text-xs text-[#A0A6B8]">
          <Terminal className="w-4 h-4 text-[#C7CCA9] shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[11px] text-white font-bold block mb-0.5">DEV CREDENTIALS PRE-FILLED</span>
            <span className="font-mono text-[10px] text-[#8C92A4]">
              admin@ranvikfootwear.com • ranvik123
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-[#B83A2A]/15 border border-[#B83A2A] text-[#FF8A7A] p-3 mb-5 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-[#8C92A4] mb-1.5">
              COMMAND EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5A6072] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white pl-9 pr-3 py-2.5 text-xs font-mono focus:border-[#B83A2A] focus:outline-hidden"
                placeholder="admin@ranvikfootwear.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-widest text-[#8C92A4] mb-1.5">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5A6072] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0E0F12] border border-[#2B2E38] text-white pl-9 pr-3 py-2.5 text-xs font-mono focus:border-[#B83A2A] focus:outline-hidden"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#B83A2A] hover:bg-[#A33324] text-white font-mono text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? 'VERIFYING CREDENTIALS...' : 'ACCESS ADMIN PANEL'}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[#2B2E38] text-center text-[10px] font-mono text-[#5A6072]">
          RANVIK FOOTWEAR ADMIN ENGINE • POWERED BY SUPABASE POSTGRESQL & AUTH
        </div>
      </div>
    </div>
  );
};
