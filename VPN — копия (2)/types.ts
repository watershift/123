
export enum ViewType {
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  SERVER_MANAGEMENT = 'SERVER_MANAGEMENT',
  BOT_MANAGEMENT = 'BOT_MANAGEMENT',
  CLIENT_APP = 'CLIENT_APP',
  ANALYTICS = 'ANALYTICS'
}

export interface Server {
  id: string;
  name: string;
  ip: string;
  location: string;
  flag: string;
  cpu: number;
  ram: number;
  bandwidth: number;
  users: number;
  status: 'online' | 'offline' | 'maintenance';
}

export interface PartnerBot {
  id: string;
  name: string;
  token: string;
  partnerName: string;
  commission: number;
  totalUsers: number;
  revenue: number;
  status: 'active' | 'suspended';
  createdDate: string;
  theme: {
    primary: string;
    secondary: string;
  };
}

export interface Transaction {
  id: string;
  botId: string;
  amount: number;
  userId: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface AppState {
  servers: Server[];
  bots: PartnerBot[];
  currentView: ViewType;
  selectedBotId: string | null;
  balance: number;
}
