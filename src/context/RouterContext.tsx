import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | 'home'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'builder'
  | 'public_portfolio';

interface RouteMatch {
  route: AppRoute;
  path: string;
  slug?: string;
}

interface RouterContextType {
  route: AppRoute;
  path: string;
  slug?: string;
  navigate: (to: string) => void;
  redirectToLoginWithNotice: (notice?: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parsePath(pathname: string, search: string): RouteMatch {
  // Support query param fallback e.g. ?route=/connexion or direct pathname
  let effectivePath = pathname;
  const params = new URLSearchParams(search);
  const routeParam = params.get('route');
  if (routeParam) {
    effectivePath = routeParam;
  }

  // Normalize path
  if (!effectivePath || effectivePath === '') {
    effectivePath = '/';
  }

  // Route matching
  if (effectivePath === '/connexion') {
    return { route: 'login', path: effectivePath };
  }
  if (effectivePath === '/inscription') {
    return { route: 'register', path: effectivePath };
  }
  if (effectivePath === '/mon-espace') {
    return { route: 'dashboard', path: effectivePath };
  }
  if (effectivePath === '/creer-mon-portfolio') {
    return { route: 'builder', path: effectivePath };
  }
  if (effectivePath.startsWith('/portfolio/')) {
    const slug = effectivePath.replace('/portfolio/', '').split('/')[0];
    return { route: 'public_portfolio', path: effectivePath, slug };
  }

  return { route: 'home', path: '/' };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState<RouteMatch>(() => {
    return parsePath(window.location.pathname, window.location.search);
  });

  const navigate = useCallback((to: string) => {
    try {
      window.history.pushState({}, '', to);
    } catch {
      // Ignore in environments where pushState might fail
    }
    const match = parsePath(to, '');
    setCurrentMatch(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const match = parsePath(window.location.pathname, window.location.search);
      setCurrentMatch(match);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const redirectToLoginWithNotice = useCallback(
    (notice?: string) => {
      // Store notification in sessionStorage or pass via param
      if (notice) {
        sessionStorage.setItem('auth_redirect_notice', notice);
      }
      navigate('/connexion');
    },
    [navigate]
  );

  return (
    <RouterContext.Provider
      value={{
        route: currentMatch.route,
        path: currentMatch.path,
        slug: currentMatch.slug,
        navigate,
        redirectToLoginWithNotice,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    // Safe graceful fallback instead of crashing the app if called outside RouterProvider
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const parsed = typeof window !== 'undefined'
      ? parsePath(window.location.pathname, window.location.search)
      : { route: 'home' as AppRoute, path: '/' };

    return {
      route: parsed.route,
      path: currentPath,
      slug: parsed.slug,
      navigate: (to: string) => {
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState({}, '', to);
            window.dispatchEvent(new PopStateEvent('popstate'));
          } catch {
            // PushState fallback
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      redirectToLoginWithNotice: (notice?: string) => {
        if (typeof window !== 'undefined') {
          if (notice) {
            sessionStorage.setItem('auth_redirect_notice', notice);
          }
          try {
            window.history.pushState({}, '', '/connexion');
            window.dispatchEvent(new PopStateEvent('popstate'));
          } catch {
            // PushState fallback
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
    };
  }
  return context;
};
