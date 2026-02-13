
import React, { useState, useEffect } from 'react';
import { Server, Shield, Activity, Power, Trash2, Sliders, AlertTriangle } from 'lucide-react';

const ServerManager: React.FC = () => {
  const [servers, setServers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchServers = async () => {
    try {
      const res = await fetch('/api/admin/servers', { 
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to fetch servers');
      const data = await res.json();
      setServers(data);
      setError(null);
    } catch (err) {
      setError('Connection error. Retrying...');
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 10000); 
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'draining': return 'bg-amber-500';
      case 'down': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-blue-500" /> Управление узлами
          </h2>
          {error && <p className="text-xs text-rose-400 mt-1 flex items-center gap-1"><AlertTriangle size={12}/> {error}</p>}
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all">
          Добавить узел
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map(s => (
          <div key={s.id} className={`glass p-6 rounded-3xl border transition-all ${
            s.status === 'active' ? 'border-emerald-500/20' : 
            s.status === 'down' ? 'border-rose-500/40 bg-rose-500/5' : 'border-slate-800'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-bold text-lg">{s.name}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">{s.ip}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase text-white ${getStatusColor(s.status)}`}>
                  {s.status}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>CPU Load</span>
                  <span>{s.cpu_load}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${s.cpu_load > 80 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                    style={{ width: `${s.cpu_load}%` }} 
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-slate-400">
                   <Activity size={14}/>
                   <span className="text-xs">Clients</span>
                </div>
                <span className="font-bold text-sm">{s.current_peers} <span className="text-slate-600">/ {s.max_peers}</span></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                disabled={s.status === 'draining'}
                className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-xl text-xs font-bold transition-all"
              >
                <Power size={14} /> Drain
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-bold transition-all">
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerManager;
