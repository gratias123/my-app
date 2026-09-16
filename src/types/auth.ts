import { CustomPortfolioData } from './portfolioBuilder';

export type UserRole = 'user' | 'admin';

export interface UserAccount {
  id: string;
  fullName: string;
  name?: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  status?: 'active' | 'suspended';
  createdAt: string;
  slug: string;
}

export type User = UserAccount;

export interface UserPortfolioRecord {
  userId: string;
  slug: string;
  status?: 'draft' | 'published';
  isPublished?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  lastModifiedAt?: string;
  data?: CustomPortfolioData;
  stats?: {
    viewsCount: number;
    cvDownloadsCount: number;
  };
}

export type UserProfileRecord = UserPortfolioRecord;

export interface AuthSession {
  token: string;
  user: UserAccount;
  expiresAt: number;
}
