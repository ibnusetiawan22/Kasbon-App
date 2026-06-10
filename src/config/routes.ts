export const ROUTES = {
  authCallback: "/auth/callback",
  dashboard: "/dashboard",
  debts: "/debts",
  login: "/login",
  register: "/register",
  settings: "/settings",
} as const;

export const PUBLIC_ROUTE_PATTERNS = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.authCallback,
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  ROUTES.dashboard,
  ROUTES.debts,
  ROUTES.settings,
] as const;

export const DEFAULT_AUTH_REDIRECT = ROUTES.dashboard;
export const DEFAULT_UNAUTH_REDIRECT = ROUTES.login;

const hasPrefix = (pathname: string, prefix: string) => {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

export const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTE_PATTERNS.some((route) => hasPrefix(pathname, route));
};

export const isProtectedRoute = (pathname: string) => {
  return PROTECTED_ROUTE_PREFIXES.some((route) => hasPrefix(pathname, route));
};
