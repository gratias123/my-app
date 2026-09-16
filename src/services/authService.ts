import { UserAccount, UserPortfolioRecord, AuthSession } from '../types/auth';
import { CustomPortfolioData } from '../types/portfolioBuilder';
import { EMPTY_STARTER_DATA } from '../utils/portfolioModelAdapter';

const USERS_STORAGE_KEY = 'portfolioplatform_users_v1';
const SESSION_STORAGE_KEY = 'portfolioplatform_session_v1';
const PORTFOLIO_PREFIX = 'portfolioplatform_portfolio_';
const SLUG_INDEX_KEY = 'portfolioplatform_slugs_v1';

// Simple hashing utility for demonstration (in production, use bcrypt / argon2 on backend server)
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h_${Math.abs(hash).toString(36)}_${btoa(password.slice(0, 3) + 'salt')}`;
}

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  return base || 'portfolio';
}

class AuthService {
  private users: Map<string, UserAccount> = new Map();
  private currentSession: AuthSession | null = null;

  constructor() {
    this.loadUsers();
    this.loadSession();
  }

  private loadUsers() {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (data) {
        const parsed: UserAccount[] = JSON.parse(data);
        parsed.forEach((u) => this.users.set(u.email.toLowerCase(), u));
      }
    } catch (e) {
      console.error('Erreur chargement utilisateurs', e);
    }
  }

  private saveUsers() {
    try {
      const list = Array.from(this.users.values());
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Erreur sauvegarde utilisateurs', e);
    }
  }

  private loadSession() {
    try {
      const sessStr = localStorage.getItem(SESSION_STORAGE_KEY);
      if (sessStr) {
        const sess: AuthSession = JSON.parse(sessStr);
        if (sess.expiresAt > Date.now()) {
          this.currentSession = sess;
        } else {
          this.clearSession();
        }
      }
    } catch {
      this.clearSession();
    }
  }

  private saveSession(session: AuthSession) {
    this.currentSession = session;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Erreur sauvegarde session', e);
    }
  }

  public clearSession() {
    this.currentSession = null;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.error('Erreur suppression session', e);
    }
  }

  public getCurrentUser(): UserAccount | null {
    if (!this.currentSession) return null;
    if (this.currentSession.expiresAt <= Date.now()) {
      this.clearSession();
      return null;
    }
    return this.currentSession.user;
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Register a new user account
   */
  public async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      return { success: false, error: 'Veuillez saisir votre nom complet.' };
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { success: false, error: 'Veuillez saisir une adresse e-mail valide.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Le mot de passe doit comporter au moins 8 caractères.' };
    }

    if (this.users.has(trimmedEmail)) {
      return {
        success: false,
        error: 'Cette adresse e-mail est déjà associée à un compte. Veuillez vous connecter.',
      };
    }

    // Generate unique slug
    let baseSlug = generateSlug(trimmedName);
    let candidateSlug = baseSlug;
    let counter = 1;
    const existingSlugs = new Set(Array.from(this.users.values()).map((u) => u.slug));
    while (existingSlugs.has(candidateSlug)) {
      counter++;
      candidateSlug = `${baseSlug}-${counter}`;
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      fullName: trimmedName,
      email: trimmedEmail,
      role: 'user',
      status: 'active',
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      slug: candidateSlug,
    };

    this.users.set(trimmedEmail, newUser);
    this.saveUsers();

    // Create session (valid for 7 days)
    const session: AuthSession = {
      token: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`,
      user: newUser,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    this.saveSession(session);

    // Initialize clean starting portfolio for this user (draft)
    const starterData: CustomPortfolioData = {
      ...EMPTY_STARTER_DATA,
      identity: {
        ...EMPTY_STARTER_DATA.identity,
        name: trimmedName,
        email: trimmedEmail,
      },
    };

    this.saveUserPortfolio(newUser.id, candidateSlug, starterData, 'draft');

    return { success: true, user: newUser };
  }

  /**
   * Login with email and password
   */
  public async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();
    const user = this.users.get(trimmedEmail);

    if (!user) {
      return {
        success: false,
        error: 'Aucun compte associé à cette adresse e-mail. Veuillez créer un compte.',
      };
    }

    if (user.passwordHash !== hashPassword(password)) {
      return {
        success: false,
        error: 'Mot de passe incorrect. Veuillez vérifier votre saisie.',
      };
    }

    const session: AuthSession = {
      token: `tok_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`,
      user,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    this.saveSession(session);

    return { success: true, user };
  }

  /**
   * Log out active session
   */
  public logout(): void {
    this.clearSession();
  }

  /**
   * Save user portfolio record (strictly isolated per user ID)
   */
  public saveUserPortfolio(
    userId: string,
    slug: string,
    data: CustomPortfolioData,
    status: 'draft' | 'published' = 'draft'
  ): UserPortfolioRecord {
    const record: UserPortfolioRecord = {
      userId,
      slug,
      status,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      data,
    };

    try {
      localStorage.setItem(`${PORTFOLIO_PREFIX}${userId}`, JSON.stringify(record));
      
      // Update slug index for public lookup
      const slugIndexStr = localStorage.getItem(SLUG_INDEX_KEY);
      const slugMap: Record<string, string> = slugIndexStr ? JSON.parse(slugIndexStr) : {};
      slugMap[slug] = userId;
      localStorage.setItem(SLUG_INDEX_KEY, JSON.stringify(slugMap));
    } catch (e) {
      console.error('Erreur sauvegarde portfolio utilisateur', e);
    }

    return record;
  }

  /**
   * Retrieve portfolio for specific user ID
   */
  public getPortfolioForUser(userId: string): UserPortfolioRecord | null {
    try {
      const data = localStorage.getItem(`${PORTFOLIO_PREFIX}${userId}`);
      if (data) {
        return JSON.parse(data) as UserPortfolioRecord;
      }
    } catch (e) {
      console.error('Erreur lecture portfolio utilisateur', e);
    }
    return null;
  }

  /**
   * Public retrieval by slug (e.g. /portfolio/jean-dupont)
   */
  public getPortfolioBySlug(slug: string): UserPortfolioRecord | null {
    try {
      const slugIndexStr = localStorage.getItem(SLUG_INDEX_KEY);
      if (slugIndexStr) {
        const slugMap: Record<string, string> = JSON.parse(slugIndexStr);
        const userId = slugMap[slug];
        if (userId) {
          return this.getPortfolioForUser(userId);
        }
      }

      // Fallback search across users
      for (const u of this.users.values()) {
        if (u.slug === slug) {
          return this.getPortfolioForUser(u.id);
        }
      }
    } catch (e) {
      console.error('Erreur recherche par slug', e);
    }
    return null;
  }

  /**
   * Find user by slug
   */
  public findUserBySlug(slug: string): UserAccount | null {
    for (const u of this.users.values()) {
      if (u.slug === slug) {
        return u;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
