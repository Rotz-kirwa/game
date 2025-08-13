// Demo mode configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? null // No backend in production - demo mode
  : 'http://localhost:5000';

export const DEMO_MODE = process.env.NODE_ENV === 'production';

// Demo user data
export const DEMO_USER = {
  id: 1,
  email: 'demo@megaodds.com',
  balance: 162500,
  token: 'demo-token-12345'
};