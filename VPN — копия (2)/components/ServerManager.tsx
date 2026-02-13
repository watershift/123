
import React from 'react';
import { Server } from '../types';
import { 
  Shield, 
  Cpu, 
  HardDrive, 
  Users, 
  Wifi, 
  MapPin, 
  RefreshCw,
  MoreVertical
} from 'lucide-react';

interface ServerManagerProps {
  servers: Server[];
}

const ServerCard: React.FC<{ server: Server }> = ({ server }) => {
  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'online': return 'text-emerald-400 bg-emerald-400/10';
      case 'offline': return 'text-rose-400 bg-rose-400/10';
      case 'maintenance': return 'text-amber-400 bg-amber-400/10';
    }
  };

  return (
    <div className="glass p-5 rounded-2xl border border-slate-800 group hover:border-blue-500/30 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{server.flag}</div>
          <div>
            <h4 className="font-bold text-slate-100">{server.name}</h4>
            <p className="text-xs text-slate-500 font-mono">{server.ip}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            <Cpu className="w-3 h-3" /> CPU
          </div>
          <div className="flex items-center justify-between">
            <div className="h-1.5 flex-1 bg-slate-700 rounded-full mr-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${server.cpu > 80 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                style={{ width: `${server.cpu}%` }} 
              />
            </div>
            <span className="text-xs font-bold w-8 text-right">{Math.round(server.cpu)}%</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
            <HardDrive className="w-3 h-3" /> RAM
          </div>
          <div className="flex items-center justify-between">
            <div className="h-1.5 flex-1 bg-slate-700 rounded-full mr-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${server.ram > 80 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                style={{ width: `${server.ram}%` }} 
              />
            </div>
            <span className="text-xs font-bold w-8 text-right">{Math.round(server.ram)}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users className="w-3.5 h-3.5" /> {server.users}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Wifi className="w-3.5 h-3.5" /> {server.bandwidth} MB/s
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(server.status)}`}>
          {server.status}
        </span>
      </div>
    </div>
  );
};

const ServerManager: React.FC<ServerManagerProps> = ({ servers }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="text-blue-500" />
            Управление Серверами (Amnezia)
          </h2>
          <p className="text-slate-400">Протоколы XRay/WireGuard на базе Amnezia.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors">
            Добавить сервер
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {servers.map(server => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h3 className="text-lg font-bold mb-4">Массовые действия</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-rose-900/20 hover:text-rose-400 border border-slate-700 hover:border-rose-900/40 rounded-lg text-sm transition-all">
            Принудительная очистка кеша
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-blue-900/20 hover:text-blue-400 border border-slate-700 hover:border-blue-900/40 rounded-lg text-sm transition-all">
            Обновить ядро Amnezia на всех узлах
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-emerald-900/20 hover:text-emerald-400 border border-slate-700 hover:border-emerald-900/40 rounded-lg text-sm transition-all">
            Генерация отчета по трафику
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerManager;
