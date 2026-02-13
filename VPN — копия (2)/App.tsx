
import React, { useState, useEffect } from 'react';
import { ViewType, Server, PartnerBot } from './types.ts';
import { INITIAL_SERVERS, INITIAL_BOTS } from './constants.tsx';
import Sidebar from './components/Sidebar.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import ServerManager from './components/ServerManager.tsx';
import BotManager from './components/BotManager.tsx';
import ClientMiniApp from './components/ClientMiniApp.tsx';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.ADMIN_DASHBOARD);
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [bots, setBots] = useState<PartnerBot[]>(INITIAL_BOTS);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => prev.map(s => s.status === 'online' ? {
        ...s,
        cpu: Math.min(100, Math.max(0, s.cpu + (Math.random() * 10 - 5))),
        bandwidth: Math.max(0, s.bandwidth + (Math.random() * 50 - 25))
      } : s));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddBot = (newBot: PartnerBot) => {
    setBots([...bots, newBot]);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewType.ADMIN_DASHBOARD:
        return <AdminDashboard servers={servers} bots={bots} onNavigate={setCurrentView} />;
      case ViewType.SERVER_MANAGEMENT:
        return <ServerManager servers={servers} />;
      case ViewType.BOT_MANAGEMENT:
        return <BotManager bots={bots} onAddBot={handleAddBot} onSelectBot={(id) => { setSelectedBotId(id); setCurrentView(ViewType.CLIENT_APP); }} />;
      case ViewType.CLIENT_APP:
        const selectedBot = bots.find(b => b.id === selectedBotId) || bots[0];
        return <ClientMiniApp bot={selectedBot} servers={servers.filter(s => s.status === 'online')} onBack={() => setCurrentView(ViewType.BOT_MANAGEMENT)} />;
      default:
        return <AdminDashboard servers={servers} bots={bots} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {currentView !== ViewType.CLIENT_APP && (
        <Sidebar activeView={currentView} onViewChange={setCurrentView} />
      )}
      
      <main className="flex-1 overflow-y-auto relative p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
