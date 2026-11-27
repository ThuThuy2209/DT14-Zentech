// src/routes/routeConfig.ts
export const VALID_TABS = [
  'dashboard',
  'invoices',
  'customers',
  'finance',
  'tax-calendar',
  'copilot',
  'settings',
  'profile',
] as const;

export type AppRouteTab = (typeof VALID_TABS)[number];

export const DEFAULT_TAB: AppRouteTab = 'dashboard';
