
import { Server, PartnerBot } from '../types';

/**
 * API Service for communication with FastAPI backend.
 * Nginx proxies /api requests to the 'api' container.
 */
export const api = {
  getStats: async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Stats fetch failed');
      return await response.json();
    } catch (error) {
      console.warn("Using mock stats due to API error");
      return {
        totalRevenue: 0,
        totalUsers: 0,
        activeServers: 0,
        networkLoad: 0
      };
    }
  },
  
  getServers: async (): Promise<Server[]> => {
    try {
      const response = await fetch('/api/admin/servers');
      if (!response.ok) throw new Error('Servers fetch failed');
      const data = await response.json();
      // Map backend Server to frontend Server type if needed
      return data.map((s: any) => ({
        id: s.id.toString(),
        name: s.name,
        ip: s.ip,
        location: s.region,
        flag: s.region === 'europe' ? '🇪🇺' : '🌐',
        cpu: s.cpu_load,
        ram: s.memory_usage || 0,
        bandwidth: 0,
        users: s.current_peers,
        status: s.status === 'active' ? 'online' : 'offline'
      }));
    } catch (error) {
      console.error("API getServers error:", error);
      return [];
    }
  },

  createBot: async (botData: Partial<PartnerBot>) => {
    const response = await fetch('/api/bots/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: botData.name,
        token: botData.token,
        partner_id: 1, // Mock partner for now
        commission: botData.commission,
        theme: botData.theme
      })
    });
    return { success: response.ok, id: `bot-${Date.now()}` };
  },

  topup: async (userId: string, amount: number) => {
    const response = await fetch('/api/billing/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, amount })
    });
    const data = await response.json();
    return { success: response.ok, newBalance: data.new_balance };
  }
};
