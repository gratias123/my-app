import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { platformDb, DbUser, DbSession } from './server/db';

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '15mb' }));

// Extend express Request type with session & user
declare global {
  namespace Express {
    interface Request {
      authSession?: DbSession;
      authUser?: DbUser;
    }
  }
}

// Client IP extractor
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Middleware: Authenticate via Bearer token
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = platformDb.getSession(token);
    if (session) {
      req.authSession = session;
      const user = platformDb.getUserById(session.userId);
      if (user && user.status !== 'suspended') {
        req.authUser = user;
      }
    }
  }
  next();
}

// Middleware: Require regular user or admin
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.authSession || !req.authUser) {
    res.status(401).json({ error: 'Session non authentifiée ou expirée' });
    return;
  }
  next();
}

// Middleware: Require strictly ADMIN role
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.authSession || !req.authUser || req.authSession.role !== 'admin' || req.authUser.role !== 'admin') {
    res.status(403).json({ error: 'Accès non autorisé' });
    return;
  }
  next();
}

app.use(authenticate);

// ==========================================
// 1. PUBLIC ROUTES & AUTHENTICATION
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Register normal user
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    res.status(400).json({ success: false, error: 'Champs obligatoires manquants' });
    return;
  }

  const result = platformDb.createUser(fullName, email, password);
  if (result.error || !result.user) {
    res.status(400).json({ success: false, error: result.error || 'Erreur lors de l’inscription' });
    return;
  }

  // Create session
  const session = platformDb.createSession(result.user.id, 'user', 7 * 24);
  const portfolio = platformDb.getPortfolioByUserId(result.user.id);

  const { passwordHash, salt, ...safeUser } = result.user;
  res.status(201).json({
    success: true,
    token: session.token,
    user: safeUser,
    portfolio,
  });
});

// Regular user login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email et mot de passe requis' });
    return;
  }

  const user = platformDb.getUserByEmail(email);
  if (!user || user.status === 'suspended') {
    res.status(401).json({ success: false, error: 'Identifiants incorrects ou compte inactif.' });
    return;
  }

  const isValid = platformDb.verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    res.status(401).json({ success: false, error: 'Identifiants incorrects ou compte inactif.' });
    return;
  }

  const session = platformDb.createSession(user.id, user.role, 7 * 24);
  const portfolio = platformDb.getPortfolioByUserId(user.id);
  const { passwordHash, salt, ...safeUser } = user;

  res.json({
    success: true,
    token: session.token,
    user: safeUser,
    portfolio,
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  if (req.authSession) {
    platformDb.deleteSession(req.authSession.token);
  }
  res.json({ success: true });
});

// Current user check
app.get('/api/auth/me', (req, res) => {
  if (!req.authUser || !req.authSession) {
    res.status(401).json({ success: false, user: null });
    return;
  }

  const portfolio = platformDb.getPortfolioByUserId(req.authUser.id);
  const { passwordHash, salt, ...safeUser } = req.authUser;

  res.json({
    success: true,
    user: safeUser,
    portfolio,
  });
});

// ==========================================
// 2. USER ISOLATED PORTFOLIO (ROLE: USER)
// ==========================================

// Get caller's own portfolio
app.get('/api/user/portfolio', requireAuth, (req, res) => {
  const userId = req.authUser!.id;
  const portfolio = platformDb.getPortfolioByUserId(userId);
  res.json({ success: true, portfolio });
});

// Save caller's own portfolio (STRICT ISOLATION: userId comes from session!)
app.put('/api/user/portfolio', requireAuth, (req, res) => {
  const userId = req.authUser!.id;
  const { data, status } = req.body;

  if (!data) {
    res.status(400).json({ success: false, error: 'Données de portfolio manquantes' });
    return;
  }

  const saved = platformDb.saveUserPortfolio(userId, data, status);
  res.json({ success: true, portfolio: saved });
});

// ==========================================
// 3. PUBLIC PORTFOLIOS
// ==========================================

// Get owner portfolio (used for default home page view /)
app.get('/api/public/owner-portfolio', (req, res) => {
  const ownerPortfolio = platformDb.getOwnerPortfolio();
  if (ownerPortfolio) {
    res.json({ success: true, portfolio: ownerPortfolio });
  } else {
    res.status(404).json({ success: false, error: 'Portfolio non disponible' });
  }
});

// Get published portfolio by slug
app.get('/api/public/portfolio/:slug', (req, res) => {
  const { slug } = req.params;
  const portfolio = platformDb.getPortfolioBySlug(slug);

  if (!portfolio) {
    res.status(404).json({ success: false, error: 'Portfolio introuvable' });
    return;
  }

  if (portfolio.status !== 'published') {
    // If requester is the owner of this draft or admin, allow preview
    if (req.authUser && (req.authUser.id === portfolio.userId || req.authUser.role === 'admin')) {
      res.json({ success: true, portfolio, isPreview: true });
      return;
    }
    res.status(404).json({ success: false, error: 'Ce portfolio n’est pas encore publié' });
    return;
  }

  // Increment view counter
  platformDb.incrementViews(portfolio.id);
  res.json({ success: true, portfolio });
});

// Increment CV download count
app.post('/api/public/portfolio/:id/download-cv', (req, res) => {
  platformDb.incrementCvDownloads(req.params.id);
  res.json({ success: true });
});

// ==========================================
// 4. PRIVATE ADMIN AUTHENTICATION
// ==========================================

// Admin Login (Rate limited, strictly checked on server)
app.post('/api/admin/login', (req, res) => {
  const clientIp = getClientIp(req);

  // Rate limiting check
  const rateLimit = platformDb.checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    res.status(429).json({
      success: false,
      error: `Trop de tentatives. Veuillez patienter ${rateLimit.remainingSeconds || 60} secondes avant de réessayer.`,
    });
    return;
  }

  const { identifier, email, password } = req.body;
  const targetEmail = (email || identifier || '').trim().toLowerCase();

  if (!targetEmail || !password) {
    platformDb.recordFailedAttempt(clientIp);
    res.status(401).json({ success: false, error: 'Identifiants incorrects.' });
    return;
  }

  const user = platformDb.getUserByEmail(targetEmail);
  if (!user || user.role !== 'admin' || user.status === 'suspended') {
    platformDb.recordFailedAttempt(clientIp);
    res.status(401).json({ success: false, error: 'Identifiants incorrects.' });
    return;
  }

  const isPasswordValid = platformDb.verifyPassword(password, user.passwordHash, user.salt);
  if (!isPasswordValid) {
    platformDb.recordFailedAttempt(clientIp);
    res.status(401).json({ success: false, error: 'Identifiants incorrects.' });
    return;
  }

  // Clear rate limit on successful authentication
  platformDb.clearRateLimit(clientIp);

  // Create 24h admin session
  const session = platformDb.createSession(user.id, 'admin', 24);
  const { passwordHash, salt, ...safeUser } = user;

  res.json({
    success: true,
    token: session.token,
    user: safeUser,
  });
});

// Admin verification check
app.get('/api/admin/check', requireAdmin, (req, res) => {
  const { passwordHash, salt, ...safeUser } = req.authUser!;
  res.json({
    success: true,
    user: safeUser,
  });
});

// ==========================================
// 5. PRIVATE ADMIN MANAGEMENT API
// ==========================================

// Admin stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const stats = platformDb.getPlatformStats();
  res.json({ success: true, stats });
});

// Get all users
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = platformDb.getAllUsers();
  const portfolios = platformDb.getAllPortfolios();

  const userSummaries = users.map((u) => {
    const p = portfolios.find((item) => item.userId === u.id);
    return {
      ...u,
      portfolioStatus: p ? p.status : 'none',
      portfolioSlug: p ? p.slug : u.slug,
      viewsCount: p ? p.stats.viewsCount : 0,
      cvDownloadsCount: p ? p.stats.cvDownloadsCount : 0,
      lastUpdated: p ? p.updatedAt : u.createdAt,
    };
  });

  res.json({ success: true, users: userSummaries });
});

// Update user status
app.put('/api/admin/users/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (status !== 'active' && status !== 'suspended') {
    res.status(400).json({ success: false, error: 'Statut invalide' });
    return;
  }

  const ok = platformDb.updateUserStatus(req.params.id, status);
  if (!ok) {
    res.status(400).json({ success: false, error: 'Impossible de modifier ce statut' });
    return;
  }

  res.json({ success: true });
});

// Delete user
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  const ok = platformDb.deleteUser(req.params.id);
  if (!ok) {
    res.status(400).json({ success: false, error: 'Suppression impossible pour ce compte' });
    return;
  }
  res.json({ success: true });
});

// Get all portfolios
app.get('/api/admin/portfolios', requireAdmin, (req, res) => {
  const portfolios = platformDb.getAllPortfolios();
  const users = platformDb.getAllUsers();

  const portfolioList = portfolios.map((p) => {
    const owner = users.find((u) => u.id === p.userId);
    return {
      id: p.id,
      userId: p.userId,
      slug: p.slug,
      status: p.status,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      stats: p.stats,
      ownerName: owner?.fullName || p.data?.identity?.name || 'Inconnu',
      ownerEmail: owner?.email || p.data?.identity?.email || '',
      isOwnerAdmin: owner?.role === 'admin',
      mainTitle: p.data?.identity?.mainTitle || '',
    };
  });

  res.json({ success: true, portfolios: portfolioList });
});

// Get portfolio by ID (admin preview/inspect)
app.get('/api/admin/portfolios/:id', requireAdmin, (req, res) => {
  const portfolio = platformDb.getPortfolioById(req.params.id);
  if (!portfolio) {
    res.status(404).json({ success: false, error: 'Portfolio introuvable' });
    return;
  }
  res.json({ success: true, portfolio });
});

// Update portfolio by ID (admin edit)
app.put('/api/admin/portfolios/:id', requireAdmin, (req, res) => {
  const { data, status, slug } = req.body;
  const updated = platformDb.adminUpdatePortfolio(req.params.id, { data, status, slug });
  if (!updated) {
    res.status(404).json({ success: false, error: 'Portfolio introuvable' });
    return;
  }
  res.json({ success: true, portfolio: updated });
});

// Delete portfolio by ID
app.delete('/api/admin/portfolios/:id', requireAdmin, (req, res) => {
  const ok = platformDb.deletePortfolio(req.params.id);
  if (!ok) {
    res.status(400).json({ success: false, error: 'Impossible de supprimer ce portfolio' });
    return;
  }
  res.json({ success: true });
});

// Get admin's own portfolio
app.get('/api/admin/my-portfolio', requireAdmin, (req, res) => {
  const adminPortfolio = platformDb.getOwnerPortfolio();
  res.json({ success: true, portfolio: adminPortfolio });
});

// Update admin's own portfolio (modifies the personal portfolio of the platform owner)
app.put('/api/admin/my-portfolio', requireAdmin, (req, res) => {
  const adminId = req.authUser!.id;
  const { data, status } = req.body;

  if (!data) {
    res.status(400).json({ success: false, error: 'Données de portfolio manquantes' });
    return;
  }

  const saved = platformDb.saveUserPortfolio(adminId, data, status || 'published');
  res.json({ success: true, portfolio: saved });
});

// ==========================================
// 6. VITE MIDDLEWARE & SPA SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Plateforme opérationnelle sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
