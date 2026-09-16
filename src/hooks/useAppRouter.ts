import { useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | 'home'
  | 'connexion'
  | 'inscription'
  | 'mon-espace'
  | 'creer-mon-portfolio'
  | 'public-portfolio'
  | 'admin';

export interface RouteState {
  route: AppRoute;
  slug?: string;
  path: string;
  subPath?: string;
}

export function parsePath(targetPath: string, search: string = ''): RouteState {
  const [pathnamePart, queryPart] = targetPath.split('?');
  const path = (pathnamePart || '/').toLowerCase().replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(queryPart || search);
  const explicitRoute = searchParams.get('route');

  // Check admin route: /admin or /admin/* or ?route=admin
  if (explicitRoute === 'admin' || path === '/admin' || path.startsWith('/admin/')) {
    const sub = path.replace(/^\/admin\/?/, '');
    return { route: 'admin', path, subPath: sub || 'overview' };
  }

  // Check query route fallback if any
  if (explicitRoute === 'connexion' || path === '/connexion') {
    return { route: 'connexion', path: '/connexion' };
  }
  if (explicitRoute === 'inscription' || path === '/inscription') {
    return { route: 'inscription', path: '/inscription' };
  }
  if (explicitRoute === 'mon-espace' || path === '/mon-espace') {
    return { route: 'mon-espace', path: '/mon-espace' };
  }
  if (explicitRoute === 'creer-mon-portfolio' || path === '/creer-mon-portfolio') {
    return { route: 'creer-mon-portfolio', path: '/creer-mon-portfolio' };
  }

  // Check portfolio slug route: /portfolio/xxx or ?slug=xxx
  const slugParam = searchParams.get('slug');
  if (slugParam) {
    return { route: 'public-portfolio', slug: slugParam, path: `/portfolio/${slugParam}` };
  }

  const portfolioMatch = path.match(/^\/portfolio\/([^/]+)/);
  if (portfolioMatch && portfolioMatch[1]) {
    return { route: 'public-portfolio', slug: portfolioMatch[1], path };
  }

  // Also check if encoded shared portfolio ?p=... exists
  if (searchParams.get('p')) {
    return { route: 'public-portfolio', path: '/' };
  }

  return { route: 'home', path: '/' };
}

function parseCurrentLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { route: 'home', path: '/' };
  }
  return parsePath(window.location.pathname, window.location.search);
}

export function useAppRouter() {
  const [routeState, setRouteState] = useState<RouteState>(parseCurrentLocation);

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseCurrentLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((targetPath: string, options?: { replace?: boolean }) => {
    const newRouteState = parsePath(targetPath);

    try {
      if (options?.replace) {
        window.history.replaceState({}, '', targetPath);
      } else {
        window.history.pushState({}, '', targetPath);
      }
    } catch {
      // If pushState is restricted in sandboxed iframe, fallback safely
    }

    setRouteState(newRouteState);

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      // Ignore scroll errors
    }
  }, []);

  return {
    route: routeState.route,
    slug: routeState.slug,
    subPath: routeState.subPath,
    path: routeState.path,
    navigate,
  };
}
