import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface DbUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  slug: string;
}

export interface DbPortfolio {
  id: string;
  userId: string;
  slug: string;
  data: any;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  stats: {
    viewsCount: number;
    cvDownloadsCount: number;
  };
}

export interface DbSession {
  token: string;
  userId: string;
  role: 'user' | 'admin';
  createdAt: number;
  expiresAt: number;
}

interface PlatformDatabase {
  users: DbUser[];
  portfolios: DbPortfolio[];
  sessions: DbSession[];
}

// Fallback / Initial reference portfolio data for the platform owner (SEMAKO Déo-Gratias)
const DEFAULT_OWNER_PORTFOLIO_DATA = {
  identity: {
    name: 'SEMAKO Déo-Gratias',
    brandName: 'GratiaLink',
    mainTitle: 'TECHNICIEN INFORMATIQUE & DESIGNER GRAPHIQUE',
    photoUrl: '/src/assets/images/profile.jpg',
    location: 'Porto-Novo, Bénin',
    email: 'semakodeogratias64@gmail.com',
    phone: '+229 01 64 69 06 82',
  },
  about: {
    tagline: 'Maintenance des équipements, solutions numériques et création visuelle',
    heroSummary:
      'Mon parcours associe la technique informatique, la maintenance des équipements, la création graphique et l’exploration des outils numériques. Je développe mes compétences à travers la pratique, la formation et l’apprentissage continu.',
    presentation:
      'SEMAKO Déo-Gratias a débuté son cursus secondaire au Lycée Béhanzin, où il a obtenu son BEPC en 2023.\n\nAprès l’obtention de ce diplôme, il a poursuivi ses études au Lycée Technique et Professionnel de Porto-Novo en intégrant un cursus professionnel de 3 ans dans la filière Installations et Maintenance en Informatique (IMI).\n\nSon profil professionnel se construit aujourd’hui autour de deux axes complémentaires : l’informatique appliquée à la maintenance des équipements et le design graphique pour la création visuelle.\n\nSon parcours intègre également des apprentissages pratiques en maintenance de smartphones (GSM), en outils du web, en utilisation avancée d’Internet, en conception d’interfaces (UI/UX) et en compréhension des enjeux d’une intelligence artificielle responsable.',
  },
  skills: [
    { id: 'sk-1', name: 'Maintenance des postes de travail & dépannage matériel', category: 'Maintenance & Réseaux', levelOrDesc: 'Pratique confirmée' },
    { id: 'sk-2', name: 'Câblage réseau & connectique RJ45', category: 'Maintenance & Réseaux', levelOrDesc: 'Pratique confirmée' },
    { id: 'sk-3', name: 'Installation des systèmes Windows & Linux', category: 'Maintenance & Réseaux', levelOrDesc: 'Pratique confirmée' },
    { id: 'sk-4', name: 'Sécurité de base & maintenance préventive', category: 'Maintenance & Réseaux', levelOrDesc: 'Pratique confirmée' },
    { id: 'sk-5', name: 'Conception graphique & affiches (Photoshop, Illustrator, Canva)', category: 'Design Graphique', levelOrDesc: 'Création visuelle' },
    { id: 'sk-6', name: 'Prototypage d’interfaces & UI/UX (Figma)', category: 'Design Graphique', levelOrDesc: 'Création visuelle' },
    { id: 'sk-7', name: 'Sérigraphie', category: 'Design Graphique', levelOrDesc: 'Compétence complémentaire liée au graphisme' },
    { id: 'sk-8', name: 'Diagnostic matériel & logiciel sur smartphones Android/iOS', category: 'Maintenance GSM', levelOrDesc: 'Diagnostic & réparation' },
    { id: 'sk-9', name: 'Remplacement d’écrans, batteries et connecteurs de charge', category: 'Maintenance GSM', levelOrDesc: 'Diagnostic & réparation' },
  ],
  experiences: [
    {
      id: 'exp-1',
      title: 'Technicien stagiaire en maintenance informatique',
      organization: 'LTP Porto-Novo & Ateliers techniques',
      location: 'Porto-Novo, Bénin',
      period: '2023 - Présent',
      description: 'Pratique continue des diagnostics, de l’assemblage et du dépannage de parcs informatiques.',
      missions: [
        'Diagnostic de pannes matérielles et logicielles sur postes clients',
        'Installation et configuration d’OS Windows et distributions Linux',
        'Sertissage de câbles réseau RJ45 et test de connectivité',
        'Nettoyage et entretien préventif des unités centrales',
      ],
      tools: ['Multimètre', 'Pince à sertir', 'Testeur de câble RJ45', 'Clés bootables'],
    },
    {
      id: 'exp-2',
      title: 'Créateur visuel & graphiste indépendant',
      organization: 'GratiaLink',
      location: 'Porto-Novo, Bénin',
      period: '2023 - Présent',
      description: 'Conception de supports graphiques pour des associations, étudiants et micro-entreprises.',
      missions: [
        'Création d’affiches d’événements et bannières réseaux sociaux',
        'Élaboration d’identités visuelles et de logos',
        'Maquettage d’interfaces web et mobile sous Figma',
      ],
      tools: ['Photoshop', 'Illustrator', 'Canva', 'Figma'],
    },
    {
      id: 'exp-3',
      title: 'Praticien en maintenance de smartphones (GSM)',
      organization: 'Atelier de dépannage GSM',
      location: 'Porto-Novo, Bénin',
      period: '2024 - Présent',
      description: 'Démontage minutieux, micro-soudures et remplacement de pièces détachées sur smartphones.',
      missions: [
        'Ouverture sécurisée des appareils et remplacement de dalles tactiles',
        'Remplacement de batteries et ports de charge USB-C / micro-USB',
        'Désoxydation des cartes mères et contrôles sous tension',
      ],
      tools: ['Station à air chaud', 'Fers à souder de précision', 'Mégohmmètre / Testeurs'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      period: '2023 - 2026 (En cours)',
      institution: 'Lycée Technique et Professionnel de Porto-Novo',
      degree: 'Installations et Maintenance en Informatique (IMI)',
      description: 'Formation professionnelle de 3 ans combinant architecture des ordinateurs, réseaux et maintenance industrielle.',
    },
    {
      id: 'edu-2',
      period: '2023',
      institution: 'Lycée Béhanzin',
      degree: 'Brevet d’Études du Premier Cycle (BEPC)',
      description: 'Cursus d’enseignement secondaire général sanctionné par le diplôme d’État.',
    },
  ],
  formations: [
    {
      id: 'form-1',
      title: 'Maintenance pratique de téléphones portables (GSM)',
      institution: 'Formation pratique spécialisée',
      date: '2024',
      duration: 'Cycle pratique intensif',
      description: 'Apprentissage pratique de l’architecture matérielle des smartphones et protocoles de réparation.',
      hasAttestation: true,
    },
    {
      id: 'form-2',
      title: 'Sérigraphie et impression sur supports textiles & papier',
      institution: 'Atelier artisanal',
      date: '2023',
      duration: 'Formation pratique',
      description: 'Techniques d’insolage de cadres, préparation des encres et tirage manuel.',
      hasAttestation: true,
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'Comprendre et utiliser une IA responsable',
      issuer: 'Certification numérique / Mooc',
      date: '2024',
      refNumber: '',
      verifyUrl: '',
    },
    {
      id: 'cert-2',
      title: 'Compétences numériques & Recherche d’information sur Internet',
      issuer: 'Certification numérique',
      date: '2024',
      refNumber: '',
      verifyUrl: '',
    },
  ],
  projects: {
    enabled: false,
    items: [],
  },
  tools: [
    'Photoshop',
    'Illustrator',
    'Figma',
    'Canva',
    'Windows 10/11',
    'Ubuntu Linux',
    'Câblage RJ45',
    'Multimètre',
    'Station GSM',
    'Wikimedia / Wikipedia',
  ],
  links: {
    github: '',
    linkedin: '',
    facebook: '',
    instagram: '',
    website: '',
    other: '',
  },
};

// Simple rate limiter tracking
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

export class PlatformDb {
  private dataDir: string;
  private dbFilePath: string;
  private db: PlatformDatabase = {
    users: [],
    portfolios: [],
    sessions: [],
  };

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.dbFilePath = path.join(this.dataDir, 'platform_db.json');
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbFilePath)) {
        const fileContent = fs.readFileSync(this.dbFilePath, 'utf-8');
        this.db = JSON.parse(fileContent);
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.error('[DB] Erreur chargement fichier DB, fallback mémoire :', err);
    }

    this.ensureAdminAccount();
  }

  private saveToFile() {
    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Erreur écriture fichier DB :', err);
    }
  }

  public hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, chosenSalt, 100000, 64, 'sha512').toString('hex');
    return { hash, salt: chosenSalt };
  }

  public verifyPassword(password: string, hash: string, salt: string): boolean {
    try {
      const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
    } catch {
      return false;
    }
  }

  public slugify(name: string): string {
    const base = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return base || 'portfolio';
  }

  private ensureAdminAccount() {
    const adminEmail = (process.env.ADMIN_EMAIL || 'semakodeogratias02@gmail.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword2026!';
    const adminPasswordHashEnv = process.env.ADMIN_PASSWORD_HASH;

    let admin = this.db.users.find((u) => u.role === 'admin' || u.email.toLowerCase() === adminEmail);

    if (!admin) {
      let salt: string;
      let hash: string;

      if (adminPasswordHashEnv && adminPasswordHashEnv.includes(':')) {
        const parts = adminPasswordHashEnv.split(':');
        salt = parts[0];
        hash = parts[1];
      } else {
        const hashed = this.hashPassword(adminPassword);
        salt = hashed.salt;
        hash = hashed.hash;
      }

      admin = {
        id: 'usr_admin_owner_01',
        fullName: 'SEMAKO Déo-Gratias',
        email: adminEmail,
        passwordHash: hash,
        salt,
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        slug: 'semako-deo-gratias',
      };

      this.db.users.unshift(admin);
      console.log(`[DB] Compte propriétaire initialisé avec succès : ${adminEmail}`);
    } else {
      // Ensure role is admin
      admin.role = 'admin';
      admin.email = adminEmail;
    }

    // Ensure Admin has a personal portfolio record
    let adminPortfolio = this.db.portfolios.find((p) => p.userId === admin!.id);
    if (!adminPortfolio) {
      adminPortfolio = {
        id: 'port_admin_owner_01',
        userId: admin.id,
        slug: admin.slug,
        data: DEFAULT_OWNER_PORTFOLIO_DATA,
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        stats: {
          viewsCount: 1,
          cvDownloadsCount: 0,
        },
      };
      this.db.portfolios.unshift(adminPortfolio);
    }

    this.saveToFile();
  }

  // Rate limiter methods (Max 5 attempts, 15 min lock)
  public checkRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
    const record = rateLimitMap.get(ip);
    if (!record) return { allowed: true };

    const now = Date.now();
    if (record.lockedUntil > now) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remainingSeconds };
    }

    // Lock expired
    if (record.lockedUntil > 0 && record.lockedUntil <= now) {
      rateLimitMap.delete(ip);
    }

    return { allowed: true };
  }

  public recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { attempts: 0, lockedUntil: 0 };
    record.attempts += 1;

    if (record.attempts >= 5) {
      record.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
    }

    rateLimitMap.set(ip, record);
  }

  public clearRateLimit(ip: string): void {
    rateLimitMap.delete(ip);
  }

  // User methods
  public getUserByEmail(email: string): DbUser | null {
    const clean = email.trim().toLowerCase();
    const exact = this.db.users.find((u) => u.email.toLowerCase() === clean);
    if (exact) return exact;

    // Support admin email variations: semakodeogratias64@gmail.com, semakodeogratias02@gmail.com, admin
    if (
      clean === 'semakodeogratias64@gmail.com' ||
      clean === 'semakodeogratias02@gmail.com' ||
      clean === 'admin' ||
      clean === 'admin@semako.com'
    ) {
      return this.db.users.find((u) => u.role === 'admin') || null;
    }

    return null;
  }

  public getUserById(id: string): DbUser | null {
    return this.db.users.find((u) => u.id === id) || null;
  }

  public getUserBySlug(slug: string): DbUser | null {
    return this.db.users.find((u) => u.slug === slug) || null;
  }

  public getAllUsers(): Array<Omit<DbUser, 'passwordHash' | 'salt'>> {
    return this.db.users.map(({ passwordHash, salt, ...rest }) => rest);
  }

  public createUser(fullName: string, email: string, password: string): { user?: DbUser; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) return { error: 'Nom complet requis' };
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { error: 'Adresse email valide requise' };
    }
    if (password.length < 8) {
      return { error: 'Le mot de passe doit comporter au moins 8 caractères' };
    }

    if (this.getUserByEmail(cleanEmail)) {
      return { error: 'Cette adresse email est déjà enregistrée.' };
    }

    let baseSlug = this.slugify(cleanName);
    let slug = baseSlug;
    let counter = 1;
    while (this.db.users.some((u) => u.slug === slug)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const { hash, salt } = this.hashPassword(password);
    const newUser: DbUser = {
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      fullName: cleanName,
      email: cleanEmail,
      passwordHash: hash,
      salt,
      role: 'user', // strictly regular user
      status: 'active',
      createdAt: new Date().toISOString(),
      slug,
    };

    this.db.users.push(newUser);

    // Create starting portfolio for new user
    const userStarterData = {
      identity: {
        name: cleanName,
        brandName: cleanName.split(' ')[0] || cleanName,
        mainTitle: '',
        photoUrl: '',
        location: '',
        email: cleanEmail,
        phone: '',
      },
      about: {
        tagline: '',
        heroSummary: '',
        presentation: '',
      },
      skills: [],
      experiences: [],
      education: [],
      formations: [],
      certifications: [],
      projects: { enabled: false, items: [] },
      tools: [],
      links: { github: '', linkedin: '', website: '' },
    };

    const newPortfolio: DbPortfolio = {
      id: `port_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      userId: newUser.id,
      slug,
      data: userStarterData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { viewsCount: 0, cvDownloadsCount: 0 },
    };

    this.db.portfolios.push(newPortfolio);
    this.saveToFile();

    return { user: newUser };
  }

  public updateUserStatus(userId: string, status: 'active' | 'suspended'): boolean {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return false;
    if (user.role === 'admin') return false; // Cannot suspend platform owner
    user.status = status;
    this.saveToFile();
    return true;
  }

  public deleteUser(userId: string): boolean {
    const userIdx = this.db.users.findIndex((u) => u.id === userId);
    if (userIdx === -1) return false;
    if (this.db.users[userIdx].role === 'admin') return false; // Cannot delete admin

    this.db.users.splice(userIdx, 1);
    this.db.portfolios = this.db.portfolios.filter((p) => p.userId !== userId);
    this.db.sessions = this.db.sessions.filter((s) => s.userId !== userId);
    this.saveToFile();
    return true;
  }

  // Session methods
  public createSession(userId: string, role: 'user' | 'admin', hours: number = 24): DbSession {
    // Purge expired sessions
    const now = Date.now();
    this.db.sessions = this.db.sessions.filter((s) => s.expiresAt > now);

    const token = `sess_${crypto.randomBytes(32).toString('hex')}`;
    const session: DbSession = {
      token,
      userId,
      role,
      createdAt: now,
      expiresAt: now + hours * 60 * 60 * 1000,
    };

    this.db.sessions.push(session);
    this.saveToFile();
    return session;
  }

  public getSession(token: string): DbSession | null {
    if (!token) return null;
    const session = this.db.sessions.find((s) => s.token === token);
    if (!session) return null;

    if (session.expiresAt <= Date.now()) {
      this.deleteSession(token);
      return null;
    }
    return session;
  }

  public deleteSession(token: string): void {
    this.db.sessions = this.db.sessions.filter((s) => s.token !== token);
    this.saveToFile();
  }

  // Portfolio methods
  public getPortfolioByUserId(userId: string): DbPortfolio | null {
    return this.db.portfolios.find((p) => p.userId === userId) || null;
  }

  public getPortfolioById(id: string): DbPortfolio | null {
    return this.db.portfolios.find((p) => p.id === id) || null;
  }

  public getPortfolioBySlug(slug: string): DbPortfolio | null {
    return this.db.portfolios.find((p) => p.slug === slug) || null;
  }

  public getOwnerPortfolio(): DbPortfolio | null {
    const admin = this.db.users.find((u) => u.role === 'admin');
    if (!admin) return null;
    return this.getPortfolioByUserId(admin.id);
  }

  public saveUserPortfolio(
    userId: string,
    data: any,
    status?: 'draft' | 'published'
  ): DbPortfolio {
    let portfolio = this.db.portfolios.find((p) => p.userId === userId);
    const user = this.getUserById(userId);
    const slug = user?.slug || 'portfolio';
    const now = new Date().toISOString();

    if (portfolio) {
      portfolio.data = data;
      portfolio.updatedAt = now;
      if (status) {
        portfolio.status = status;
        if (status === 'published' && !portfolio.publishedAt) {
          portfolio.publishedAt = now;
        }
      }
    } else {
      portfolio = {
        id: `port_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        userId,
        slug,
        data,
        status: status || 'draft',
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : undefined,
        stats: { viewsCount: 0, cvDownloadsCount: 0 },
      };
      this.db.portfolios.push(portfolio);
    }

    this.saveToFile();
    return portfolio;
  }

  public adminUpdatePortfolio(
    portfolioId: string,
    updates: { data?: any; status?: 'draft' | 'published'; slug?: string }
  ): DbPortfolio | null {
    const portfolio = this.db.portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return null;

    const now = new Date().toISOString();
    if (updates.data) portfolio.data = updates.data;
    if (updates.status) {
      portfolio.status = updates.status;
      if (updates.status === 'published' && !portfolio.publishedAt) {
        portfolio.publishedAt = now;
      }
    }
    if (updates.slug) portfolio.slug = updates.slug;
    portfolio.updatedAt = now;

    this.saveToFile();
    return portfolio;
  }

  public deletePortfolio(portfolioId: string): boolean {
    const idx = this.db.portfolios.findIndex((p) => p.id === portfolioId);
    if (idx === -1) return false;

    // Check if it belongs to admin
    const portfolio = this.db.portfolios[idx];
    const user = this.getUserById(portfolio.userId);
    if (user?.role === 'admin') return false; // Admin's personal portfolio cannot be deleted

    this.db.portfolios.splice(idx, 1);
    this.saveToFile();
    return true;
  }

  public incrementViews(portfolioId: string): void {
    const portfolio = this.db.portfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      portfolio.stats.viewsCount += 1;
      this.saveToFile();
    }
  }

  public incrementCvDownloads(portfolioId: string): void {
    const portfolio = this.db.portfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      portfolio.stats.cvDownloadsCount += 1;
      this.saveToFile();
    }
  }

  public getAllPortfolios(): DbPortfolio[] {
    return this.db.portfolios;
  }

  public getPlatformStats() {
    const totalUsers = this.db.users.filter((u) => u.role !== 'admin').length;
    const totalPortfolios = this.db.portfolios.length;
    const publishedPortfolios = this.db.portfolios.filter((p) => p.status === 'published').length;
    const draftPortfolios = this.db.portfolios.filter((p) => p.status === 'draft').length;
    const totalViews = this.db.portfolios.reduce((acc, p) => acc + (p.stats?.viewsCount || 0), 0);
    const activeSessions = this.db.sessions.filter((s) => s.expiresAt > Date.now()).length;

    return {
      totalUsers,
      totalPortfolios,
      publishedPortfolios,
      draftPortfolios,
      totalViews,
      activeSessions,
      uptime: process.uptime(),
    };
  }
}

export const platformDb = new PlatformDb();
