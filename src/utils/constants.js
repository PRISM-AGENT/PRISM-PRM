/**
 * Application constants
 */

// Routes
export const ROUTES = {
  HOME: '/',
  FEATURES: '/features',
  ASSISTANT: '/assistant',
  KNOWLEDGE: '/knowledge',
  TOKEN: '/token',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  HOW_IT_WORKS: '/how-it-works',
  ROADMAP: '/roadmap',
  TECHNOLOGY: '/technology',
  TEAM: '/team',
  CAREERS: '/careers',
  PRESS: '/press',
  HELP: '/help',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  FAQ: '/faq',
  DOCUMENTATION: '/documentation'
};

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  ASSISTANT: {
    QUERY: '/assistant/query',
    CREATE: '/assistant/create',
    LIST: '/assistant/list'
  },
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login'
  },
  USER: {
    PROFILE: '/user/profile'
  },
  TOKEN: {
    INFO: '/token/info',
    AIRDROP: '/token/airdrop'
  }
};

// LocalStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'prism_token',
  USER: 'prism_user',
  THEME: 'prism_theme'
};

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: 'https://x.com/PRI_SM_AI',
  GITHUB: 'https://github.com/PRISM-AGENT/PRISM'
};

// Website info
export const WEBSITE = {
  URL: 'https://www.prismn.xyz',
  NAME: 'PRISM',
  DESCRIPTION: 'Knowledge-Driven Crypto Asset Advisory Platform'
}; 