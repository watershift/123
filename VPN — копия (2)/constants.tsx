
import { Server, PartnerBot, ViewType } from './types';

export const INITIAL_SERVERS: Server[] = [
  { id: '1', name: 'NL-Amsterdam-01', ip: '185.242.115.12', location: 'Netherlands', flag: '🇳🇱', cpu: 45, ram: 62, bandwidth: 850, users: 142, status: 'online' },
  { id: '2', name: 'US-Virginia-04', ip: '45.76.120.21', location: 'USA', flag: '🇺🇸', cpu: 82, ram: 78, bandwidth: 1200, users: 425, status: 'online' },
  { id: '3', name: 'DE-Frankfurt-02', ip: '95.217.34.88', location: 'Germany', flag: '🇩🇪', cpu: 12, ram: 25, bandwidth: 120, users: 12, status: 'online' },
  { id: '4', name: 'FI-Helsinki-01', ip: '65.21.144.12', location: 'Finland', flag: '🇫🇮', cpu: 0, ram: 0, bandwidth: 0, users: 0, status: 'offline' },
];

export const INITIAL_BOTS: PartnerBot[] = [
  { 
    id: 'bot-1', 
    name: 'Wylsacom VPN', 
    token: '612345678:AA...', 
    partnerName: 'Valentin Petukhov', 
    commission: 30, 
    totalUsers: 15400, 
    revenue: 450000, 
    status: 'active',
    createdDate: '2023-10-12',
    theme: { primary: '#ef4444', secondary: '#000000' }
  },
  { 
    id: 'bot-2', 
    name: 'TechReviews Bot', 
    token: '792345678:BB...', 
    partnerName: 'Ilya Kazakov', 
    commission: 25, 
    totalUsers: 8200, 
    revenue: 210000, 
    status: 'active',
    createdDate: '2023-11-05',
    theme: { primary: '#3b82f6', secondary: '#1e3a8a' }
  }
];
