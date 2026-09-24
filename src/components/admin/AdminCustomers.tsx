import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';
import { customersService, CustomerSummary } from '../../services/customers';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const list = await customersService.getAll();
      setCustomers(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2B2E38]">
        <div>
          <h1 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
            CUSTOMER DIRECTORY & PROFILES
          </h1>
          <p className="text-xs font-mono text-[#8C92A4] mt-1">
            Verified accounts, dispatch addresses & lifetime order values
          </p>
        </div>
        <div className="text-xs font-mono text-[#8C92A4] bg-[#16181E] border border-[#2B2E38] px-3 py-2 rounded-xs">
          REGISTERED CLIENTS: <span className="text-white font-bold">{customers.length}</span>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-[#8C92A4] absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Search by customer name, phone, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#16181E] border border-[#2B2E38] text-white pl-9 pr-3 py-2.5 text-xs font-mono rounded-xs focus:border-[#B83A2A] focus:outline-hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cust) => {
          const primaryAddr = cust.addresses[0];
          return (
            <div
              key={cust.id}
              className="bg-[#16181E] border border-[#2B2E38] p-5 rounded-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white">{cust.name}</h3>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C92A4] mt-0.5">
                    <Mail className="w-3 h-3" />
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8C92A4]">
                    <Phone className="w-3 h-3" />
                    <span>{cust.phone}</span>
                  </div>
                </div>
                <div className="p-2 bg-[#242731] rounded-xs text-[#CBD5E1]">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              {primaryAddr && (
                <div className="bg-[#111317] p-2.5 border border-[#22252E] rounded-xs text-[11px] font-mono text-[#8C92A4] flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B83A2A] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {primaryAddr.street}, {primaryAddr.city} ({primaryAddr.pinCode})
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-[#2B2E38] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#8C92A4] block">ORDERS</span>
                  <span className="font-bold text-white">{cust.ordersCount} fulfilled</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8C92A4] block">LIFETIME VALUE</span>
                  <span className="font-bold text-[#E04D39]">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
