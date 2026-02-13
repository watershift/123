
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Wallet, 
  Activity, 
  ArrowUpRight, 
  Server as ServerIcon,
  Bot as BotIcon,
  Sparkles,
  Database
} from 'lucide-react';
import { Server, PartnerBot, ViewType } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getAIOptimizationTips } from '../services/geminiService';
import { api } from '../services/api';

interface DashboardProps {
  servers: Server[];
  bots: PartnerBot[];
  onNavigate: (view: ViewType) => void;
}

const data = [
  { name: 'Пн', revenue: 45000, users: 1200 },
  { name: 'Вт', revenue: 52000, users: 1350 },
  { name: 'Ср', revenue: 48000, users: 1400 },
  { name: 'Чт', revenue: 61000, users: 1600 },
  { name: 'Пт', revenue: 55000, users: 1750 },
  { name: 'Сб', revenue: 82000, users: 2100 },
  { name: 'Вс', revenue: 95000, users: 2400 },
];

const AdminDashboard: React.FC<DashboardProps> = ({ servers, bots, onNavigate }) => {
  const [aiTips, setAiTips] = useState<string>("Анализирую данные...");
  const [stats, setStats] = useState({ totalRevenue: 0, totalUsers: 0, activeServers: 0, networkLoad: 0 });

  useEffect(() => {
    const loadData = async () => {
      const s = await api.getStats();
      setStats(s);
      const tips = await getAIOptimizationTips(servers, bots);
      setAiTips(tips || "Нет доступных рекомендаций.");
    };
    loadData();
  }, [servers, bots]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Мастер-Панель Управления</h2>
          <div className="flex items-center gap-2 text-slate-400 mt-1">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Стек: Python (FastAPI) + PostgreSQL + Docker</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate(ViewType.BOT_MANAGEMENT)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <BotIcon className="w-4 h-4" />
            Создать бота для блогера
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Общий доход', value: `${stats.totalRevenue.toLocaleString()} ₽`, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Всего пользователей', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Активных серверов', value: `${stats.activeServers}/${servers.length}`, icon: ServerIcon, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Нагрузка сети', value: `${stats.networkLoad}%`, icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className="glass p-6 rounded-3xl border border-slate-800 flex flex-col gap-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center text-emerald-400 text-sm font-bold">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +14.2%
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-100">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10" />
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Аналитика выручки (Postgres Data)</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase">Live</span>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-900/10 to-transparent flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-xl">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg">AI-Советник</h3>
          </div>
          <div className="flex-1 text-slate-300 text-sm leading-relaxed italic border-l-2 border-indigo-500/30 pl-4 py-2">
            "{aiTips}"
          </div>
          <div className="mt-8 space-y-3">
             <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Рекомендация по серверам</p>
                <p className="text-xs font-medium">Перенесите 20% трафика из США в Нидерланды для снижения пинга.</p>
             </div>
             <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all uppercase tracking-widest text-indigo-400 border border-indigo-500/10">
                Запустить оптимизацию
             </button>
          </div>
        </div>
      </div>
      
      {/* Partners List */}
      <div className="glass p-8 rounded-[2rem] border border-slate-800">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-bold">Партнерская статистика</h3>
           <button className="text-sm text-indigo-400 hover:underline">Экспорт в CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                <th className="pb-6">Бот / Блогер</th>
                <th className="pb-6">Пользователи</th>
                <th className="pb-6">Доля партнера</th>
                <th className="pb-6">Чистая прибыль</th>
                <th className="pb-6">Статус API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {bots.map((bot) => (
                <tr key={bot.id} className="group hover:bg-white/5 transition-all">
                  <td className="py-6 font-medium">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{backgroundColor: bot.theme.primary}}>
                        <BotIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-slate-100 font-bold">{bot.name}</div>
                        <div className="text-slate-500 text-xs">{bot.partnerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 font-semibold text-slate-200">{bot.totalUsers.toLocaleString()}</td>
                  <td className="py-6 text-slate-400">{bot.commission}%</td>
                  <td className="py-6">
                    <div className="text-emerald-400 font-bold">{(bot.revenue * (1 - bot.commission/100)).toLocaleString()} ₽</div>
                    <div className="text-[10px] text-slate-500">из {bot.revenue.toLocaleString()} ₽ всего</div>
                  </td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                       <span className="text-xs font-bold text-emerald-500">ACTIVE</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
