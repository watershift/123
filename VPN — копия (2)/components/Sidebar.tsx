
import React from 'react';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  Server as ServerIcon, 
  Bot, 
  BarChart3, 
  Settings,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: ViewType.ADMIN_DASHBOARD, label: 'Главная', icon: LayoutDashboard },
    { id: ViewType.SERVER_MANAGEMENT, label: 'Сервера', icon: ServerIcon },
    { id: ViewType.BOT_MANAGEMENT, label: 'Боты/Партнеры', icon: Bot },
    { id: ViewType.ANALYTICS, label: 'Аналитика', icon: BarChart3 },
  ];

  return (
    <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold hidden md:block bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Amnezia Admin
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeView === item.id 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden md:block">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="hidden md:block glass rounded-2xl p-4 mb-4 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Premium Status</span>
          </div>
          <p className="text-[10px] text-slate-400 mb-3">
            Вам доступны все функции мониторинга серверов Amnezia.
          </p>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4"></div>
          </div>
        </div>
        <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-xl transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span className="font-medium hidden md:block">Настройки</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
