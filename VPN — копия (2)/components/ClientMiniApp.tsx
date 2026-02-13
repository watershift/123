
import React, { useState } from 'react';
import { PartnerBot, Server } from '../types';
import { 
  Power, 
  ShieldCheck, 
  Globe, 
  CreditCard, 
  History, 
  ChevronRight, 
  ArrowLeft,
  Wallet,
  Zap,
  CheckCircle2,
  Lock,
  Download,
  Settings2
} from 'lucide-react';
import { api } from '../services/api';

interface ClientMiniAppProps {
  bot: PartnerBot;
  servers: Server[];
  onBack: () => void;
}

const ClientMiniApp: React.FC<ClientMiniAppProps> = ({ bot, servers, onBack }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState<'main' | 'servers' | 'billing'>('main');
  const [isConnecting, setIsConnecting] = useState(false);

  const toggleConnection = () => {
    if (!isConnected) {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);
    } else {
      setIsConnected(false);
    }
  };

  const handleTopup = async (amount: number) => {
    const result = await api.topup("user_1", amount);
    if (result.success) {
      setBalance(prev => prev + amount);
    }
  };

  const renderMain = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex flex-col items-center justify-center pt-12">
        <div className="relative">
          {/* Animated Background Rings */}
          <div className={`absolute inset-0 rounded-full blur-[40px] transition-all duration-1000 ${isConnected ? 'bg-indigo-500/30 scale-150' : 'bg-transparent'}`}></div>
          
          <button 
            onClick={toggleConnection}
            disabled={isConnecting}
            className={`w-52 h-52 rounded-full flex flex-col items-center justify-center transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 border-8 ${
              isConnected 
                ? 'border-indigo-500 bg-slate-900 text-indigo-400' 
                : 'border-slate-800 bg-slate-900 text-slate-600'
            }`}
          >
            {isConnecting ? (
              <Zap className="w-16 h-16 animate-pulse" />
            ) : (
              <>
                <Power className={`w-20 h-20 mb-2 transition-transform duration-500 ${isConnected ? 'rotate-180 scale-110' : ''}`} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {isConnected ? 'ON' : 'OFF'}
                </span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-12 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-[10px] font-bold uppercase tracking-widest ${isConnected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
            <Lock className="w-3 h-3" />
            {isConnected ? 'Amnezia XRay Protocol' : 'Трафик не защищен'}
          </div>
          <h2 className="text-3xl font-black text-white">{isConnected ? 'ПОДКЛЮЧЕНО' : 'ОТКЛЮЧЕНО'}</h2>
          <p className="text-slate-500 text-xs mt-2 px-8">
            {isConnected ? `Вы используете защищенный узел в ${selectedServer.location}` : 'Выберите локацию и нажмите на кнопку для защиты'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setActiveTab('servers')}
          className="bg-slate-900/50 p-6 rounded-[2rem] flex flex-col items-start gap-4 active:scale-95 transition-all border border-white/5"
        >
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-200">Локации</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold mt-1 inline-flex items-center gap-1">
              {selectedServer.flag} {selectedServer.name.split('-')[1]}
            </span>
          </div>
        </button>
        
        <button 
          onClick={() => setActiveTab('billing')}
          className="bg-slate-900/50 p-6 rounded-[2rem] flex flex-col items-start gap-4 active:scale-95 transition-all border border-white/5"
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-200">Кошелек</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold mt-1 inline-flex items-center gap-1">
              {balance} ₽ • Пополнить
            </span>
          </div>
        </button>
      </div>

      <div className="bg-gradient-to-r from-indigo-600/20 to-transparent p-6 rounded-[2rem] border border-indigo-500/10 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
               <Download className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-sm font-bold text-slate-100">Настроить конфиг</h4>
               <p className="text-[10px] text-slate-500">Для Amnezia App / Shadowrocket</p>
            </div>
         </div>
         <ChevronRight className="w-5 h-5 text-slate-700" />
      </div>
    </div>
  );

  const renderServers = () => (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black">ЛОКАЦИИ</h3>
        <button onClick={() => setActiveTab('main')} className="p-3 bg-slate-900 rounded-2xl text-slate-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      
      <div className="space-y-3">
        {servers.map(s => (
          <button 
            key={s.id}
            onClick={() => { setSelectedServer(s); setActiveTab('main'); if(isConnected) setIsConnected(false); }}
            className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] transition-all border ${
              selectedServer.id === s.id ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-slate-900/50 border-white/5'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className="text-3xl filter grayscale-[0.2]">{s.flag}</div>
              <div className="text-left">
                <p className="font-bold text-slate-100">{s.name.split('-')[1] || s.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{width: `${s.cpu}%`}}></div>
                   </div>
                   <span className="text-[10px] text-slate-600 font-bold uppercase">PING: {Math.floor(Math.random() * 40 + 15)}ms</span>
                </div>
              </div>
            </div>
            {selectedServer.id === s.id && <CheckCircle2 className="w-6 h-6 text-indigo-500" />}
          </button>
        ))}
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black">КОШЕЛЕК</h3>
        <button onClick={() => setActiveTab('main')} className="p-3 bg-slate-900 rounded-2xl text-slate-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">Доступный баланс</p>
        <h2 className="text-5xl font-black">{balance} ₽</h2>
        <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
           <span className="text-xs text-indigo-100/60 font-mono">ID: USER_77102</span>
           <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold">VIP STATUS</div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em] px-2">Быстрое пополнение</p>
        <div className="grid grid-cols-3 gap-3">
          {[100, 300, 500, 1000, 2000, 5000].map(amount => (
            <button 
              key={amount}
              onClick={() => handleTopup(amount)}
              className="py-5 bg-slate-900 border border-white/5 rounded-[1.25rem] font-bold hover:border-indigo-500 transition-all active:scale-95"
            >
              {amount} ₽
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
        <h4 className="font-bold flex items-center gap-3 mb-6 text-slate-400 text-xs uppercase tracking-widest">
          <History className="w-4 h-4" />
          Последние списания
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Месячная подписка</span>
            <span className="text-white font-bold">-390 ₽</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Подключение (US-NY)</span>
            <span className="text-white font-bold">-0 ₽</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto h-full bg-slate-950 flex flex-col relative overflow-hidden shadow-2xl border-x border-slate-900">
      {/* Fake TMA Header */}
      <div className="p-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="flex items-center gap-4">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg"
            style={{ backgroundColor: bot.theme.primary }}
          >
            {bot.name.charAt(0)}
          </div>
          <div>
            <span className="block font-black text-sm text-white leading-none">{bot.name}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Telegram Mini App</span>
          </div>
        </div>
        <button onClick={onBack} className="p-2 text-slate-600 hover:text-white transition-colors">
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 pt-4">
        {activeTab === 'main' && renderMain()}
        {activeTab === 'servers' && renderServers()}
        {activeTab === 'billing' && renderBilling()}
      </div>

      {/* Modern Floating Bottom Nav */}
      <div className="absolute bottom-6 inset-x-6 h-20 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex items-center justify-around px-4 shadow-2xl">
        {[
          { id: 'main', icon: ShieldCheck, label: 'VPN' },
          { id: 'servers', icon: Globe, label: 'СЕРВЕРА' },
          { id: 'billing', icon: CreditCard, label: 'ОПЛАТА' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              activeTab === tab.id ? 'text-indigo-400 scale-110' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'fill-indigo-400/20' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClientMiniApp;
