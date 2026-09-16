import { UserAccount, UserPortfolioRecord } from '../types/auth';
import { CustomPortfolioData } from '../types/portfolioBuilder';

const TOKEN_KEY = 'platform_auth_token_v2';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem(TOKEN_KEY);
      } catch {
        this.token = null;
      }
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      try {
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (e) {
        console.error('Erreur token storage', e);
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem(TOKEN_KEY);
      } catch {
        this.token = null;
      }
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || `Erreur requête (${response.status})`;
      const error = new Error(errorMsg) as any;
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data as T;
  }

  // --- Auth methods ---
  public async register(fullName: string, email: string, password: string) {
    const res = await this.request<{
      success: boolean;
      token: string;
      user: UserAccount;
      portfolio?: UserPortfolioRecord;
      error?: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });

    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  public async login(email: string, password: string) {
    const res = await this.request<{
      success: boolean;
      token: string;
      user: UserAccount;
      portfolio?: UserPortfolioRecord;
      error?: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  public async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      this.setToken(null);
    }
  }

  public async getMe() {
    return this.request<{
      success: boolean;
      user: UserAccount | null;
      portfolio: UserPortfolioRecord | null;
    }>('/api/auth/me');
  }

  // --- Normal User Portfolio (Isolated) ---
  public async getUserPortfolio() {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord | null;
    }>('/api/user/portfolio');
  }

  public async saveUserPortfolio(data: CustomPortfolioData, status?: 'draft' | 'published') {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord;
    }>('/api/user/portfolio', {
      method: 'PUT',
      body: JSON.stringify({ data, status }),
    });
  }

  // --- Public Portfolios ---
  public async getOwnerPortfolio() {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord;
    }>('/api/public/owner-portfolio');
  }

  public async getPublicPortfolioBySlug(slug: string) {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord;
      isPreview?: boolean;
    }>(`/api/public/portfolio/${encodeURIComponent(slug)}`);
  }

  public async recordCvDownload(portfolioId: string) {
    try {
      await this.request(`/api/public/portfolio/${encodeURIComponent(portfolioId)}/download-cv`, {
        method: 'POST',
      });
    } catch {
      // Ignore
    }
  }

  // --- Private Admin Auth ---
  public async adminLogin(identifier: string, password: string) {
    const res = await this.request<{
      success: boolean;
      token: string;
      user: UserAccount;
      error?: string;
    }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });

    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  public async checkAdmin() {
    return this.request<{
      success: boolean;
      user: UserAccount;
    }>('/api/admin/check');
  }

  // --- Private Admin Platform Management ---
  public async getAdminStats() {
    return this.request<{
      success: boolean;
      stats: {
        totalUsers: number;
        totalPortfolios: number;
        publishedPortfolios: number;
        draftPortfolios: number;
        totalViews: number;
        activeSessions: number;
        uptime: number;
      };
    }>('/api/admin/stats');
  }

  public async getAdminUsers() {
    return this.request<{
      success: boolean;
      users: Array<
        UserAccount & {
          portfolioStatus: string;
          portfolioSlug: string;
          viewsCount: number;
          cvDownloadsCount: number;
          lastUpdated: string;
        }
      >;
    }>('/api/admin/users');
  }

  public async updateAdminUserStatus(userId: string, status: 'active' | 'suspended') {
    return this.request<{ success: boolean }>(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  public async deleteAdminUser(userId: string) {
    return this.request<{ success: boolean }>(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
  }

  public async getAdminPortfolios() {
    return this.request<{
      success: boolean;
      portfolios: Array<{
        id: string;
        userId: string;
        slug: string;
        status: 'draft' | 'published';
        createdAt: string;
        updatedAt: string;
        stats: { viewsCount: number; cvDownloadsCount: number };
        ownerName: string;
        ownerEmail: string;
        isOwnerAdmin: boolean;
        mainTitle: string;
      }>;
    }>('/api/admin/portfolios');
  }

  public async getAdminPortfolioById(id: string) {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord;
    }>(`/api/admin/portfolios/${encodeURIComponent(id)}`);
  }

  public async updateAdminPortfolio(
    id: string,
    payload: { data?: CustomPortfolioData; status?: 'draft' | 'published'; slug?: string }
  ) {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord;
    }>(`/api/admin/portfolios/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  public async deleteAdminPortfolio(id: string) {
    return this.request<{ success: boolean }>(`/api/admin/portfolios/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  public async getAdminMyPortfolio() {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord;
    }>('/api/admin/my-portfolio');
  }

  public async saveAdminMyPortfolio(data: CustomPortfolioData, status: 'draft' | 'published' = 'published') {
    return this.request<{
      success: boolean;
      portfolio: UserPortfolioRecord;
    }>('/api/admin/my-portfolio', {
      method: 'PUT',
      body: JSON.stringify({ data, status }),
    });
  }
}

export const apiClient = new ApiClient();
