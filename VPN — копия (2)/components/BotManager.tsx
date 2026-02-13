
import React, { useState } from 'react';
import { PartnerBot } from '../types';
import { Plus, Bot, Link as LinkIcon, Settings2, Eye, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

interface BotManagerProps {
  bots: PartnerBot[];
  onAddBot: (bot: PartnerBot) => void;
  onSelectBot: (id: string) => void;
}

const BotManager: React.FC<BotManagerProps> = ({ bots, onAddBot, onSelectBot }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newBot, setNewBot] = useState<Partial<PartnerBot>>({
    name: '',
    partnerName: '',
    token: '',
    commission: 20,
    theme: { primary: '#6366f1', secondary: '#1e293b' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Call Python API
    const result = await api.createBot(newBot);
    
    if (result.success) {
      const bot: PartnerBot = {
        id: result.id,
        name: newBot.name || 'Untitled Bot',
        partnerName: newBot.partnerName || 'Unknown',
        token: newBot.token || '',
        commission: newBot.commission || 20,
        totalUsers: 0,
        revenue: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
        theme: newBot.theme!
      };
      onAddBot(bot);
      setShowModal(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
            Партнеры & Боты
          </h2>
          <p className="text-slate-400 mt-2">Масштабируйте свою VPN сеть через блогеров.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Развернуть нового бота
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {bots.map(bot => (
          <div key={bot.id} className="glass p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] -z-10 group-hover:bg-indigo-500/10 transition-colors" />
            
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div 
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl relative"
                  style={{ backgroundColor: bot.theme.primary }}
                >
                  <Bot className="w-8 h-8" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-100">{bot.name}</h4>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                     <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                     <span>Партнер: {bot.partnerName}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => onSelectBot(bot.id)}
                  className="p-3 bg-slate-800/50 hover:bg-indigo-500 text-slate-300 hover:text-white rounded-2xl transition-all"
                  title="Web App Preview"
                >
                  <Eye className="w-6 h-6" />
                </button>
                <button className="p-3 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all">
                  <Settings2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-950/50 p-5 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Оборот</p>
                <p className="text-2xl font-black text-white">{bot.revenue.toLocaleString()} ₽</p>
              </div>
              <div className="bg-slate-950/50 p-5 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Клиенты</p>
                <p className="text-2xl font-black text-white">{bot.totalUsers.toLocaleString()}</p>
              </div>
              <div className="bg-slate-950/50 p-5 rounded-3xl border border-white/5">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Процент</p>
                <p className="text-2xl font-black text-indigo-400">{bot.commission}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
               <div className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-mono text-slate-400">t.me/{bot.name.toLowerCase().replace(' ', '_')}_bot</span>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-700" />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass w-full max-w-xl rounded-[2.5rem] p-10 border border-slate-800 animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-bold mb-8">Новый партнерский проект</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Название бота</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-all text-slate-100"
                    placeholder="Wylsa VPN"
                    value={newBot.name}
                    onChange={e => setNewBot({...newBot, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Имя блогера</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-all text-slate-100"
                    placeholder="Валентин Петухов"
                    value={newBot.partnerName}
                    onChange={e => setNewBot({...newBot, partnerName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">API Токен (от @BotFather)</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-all font-mono text-xs text-indigo-400"
                  placeholder="1234567890:AAH_yZ..."
                  value={newBot.token}
                  onChange={e => setNewBot({...newBot, token: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Комиссия (%)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 transition-all text-slate-100"
                    value={newBot.commission}
                    onChange={e => setNewBot({...newBot, commission: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Цвет TMA</label>
                  <div className="flex gap-4">
                     <input 
                      type="color" 
                      className="w-16 h-[56px] bg-slate-900 border border-slate-800 rounded-2xl p-1 outline-none cursor-pointer"
                      value={newBot.theme?.primary}
                      onChange={e => setNewBot({...newBot, theme: {...newBot.theme!, primary: e.target.value}})}
                    />
                    <div className="flex-1 flex items-center text-xs text-slate-500 font-mono bg-slate-900 border border-slate-800 rounded-2xl px-4 uppercase">
                      {newBot.theme?.primary}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-5 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all text-slate-300"
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 text-white flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : 'Запустить проект'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotManager;
