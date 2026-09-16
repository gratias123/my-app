import { CustomPortfolioData } from '../types/portfolioBuilder';
import { User, UserProfileRecord } from '../types/auth';

const STORAGE_PREFIX_USER_PORTFOLIO = 'pl_user_portfolio_';
const STORAGE_KEY_PROFILES_INDEX = 'pl_profiles_index_v1';

// Initial empty portfolio template adapted to a new user
export function createDefaultUserPortfolio(user?: User): CustomPortfolioData {
  return {
    identity: {
      name: user?.name || '',
      brandName: user?.name ? (user.name.split(' ')[0] || user.name) : '',
      mainTitle: '',
      photoUrl: '',
      location: '',
      email: user?.email || '',
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
    projects: {
      enabled: false,
      items: [],
    },
    tools: [],
    links: {
      github: '',
      linkedin: '',
      website: '',
    },
  };
}

// Get all profile records
function getAllProfileRecords(): UserProfileRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES_INDEX);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erreur lecture profiles index', e);
    return [];
  }
}

// Save all profile records
function saveAllProfileRecords(records: UserProfileRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES_INDEX, JSON.stringify(records));
  } catch (e) {
    console.error('Erreur sauvegarde profiles index', e);
  }
}

export const portfolioStorageService = {
  // Get portfolio for a specific user ID (strict isolation: User A !== User B)
  getUserPortfolio(userId: string): CustomPortfolioData | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX_USER_PORTFOLIO}${userId}`);
      if (!raw) return null;
      return JSON.parse(raw) as CustomPortfolioData;
    } catch (e) {
      console.error('Erreur lecture portfolio utilisateur', e);
      return null;
    }
  },

  // Save portfolio for a specific user ID
  saveUserPortfolio(userId: string, data: CustomPortfolioData, userSlug: string): void {
    try {
      // 1. Save data isolated by user id
      localStorage.setItem(`${STORAGE_PREFIX_USER_PORTFOLIO}${userId}`, JSON.stringify(data));

      // 2. Update profile index record
      const records = getAllProfileRecords();
      const now = new Date().toISOString();
      const existingIdx = records.findIndex((r) => r.userId === userId);

      if (existingIdx >= 0) {
        records[existingIdx].lastModifiedAt = now;
        records[existingIdx].slug = userSlug;
      } else {
        records.push({
          userId,
          slug: userSlug,
          isPublished: false,
          lastModifiedAt: now,
          stats: { viewsCount: 0, cvDownloadsCount: 0 },
        });
      }
      saveAllProfileRecords(records);
    } catch (e) {
      console.error('Erreur sauvegarde portfolio utilisateur', e);
    }
  },

  // Publish portfolio and mark ready for public access
  publishUserPortfolio(userId: string, userSlug: string): UserProfileRecord {
    const records = getAllProfileRecords();
    const now = new Date().toISOString();
    let record = records.find((r) => r.userId === userId);

    if (record) {
      record.isPublished = true;
      record.publishedAt = record.publishedAt || now;
      record.lastModifiedAt = now;
      record.slug = userSlug;
    } else {
      record = {
        userId,
        slug: userSlug,
        isPublished: true,
        publishedAt: now,
        lastModifiedAt: now,
        stats: { viewsCount: 1, cvDownloadsCount: 0 },
      };
      records.push(record);
    }
    saveAllProfileRecords(records);
    return record;
  },

  // Get user profile metadata (is published, last updated, etc.)
  getUserProfileRecord(userId: string): UserProfileRecord | null {
    const records = getAllProfileRecords();
    return records.find((r) => r.userId === userId) || null;
  },

  // Public lookup: get published portfolio by slug
  getPublicPortfolioBySlug(slug: string): { data: CustomPortfolioData; record: UserProfileRecord } | null {
    const records = getAllProfileRecords();
    const record = records.find((r) => r.slug === slug && r.isPublished);
    if (!record) return null;

    const data = this.getUserPortfolio(record.userId);
    if (!data) return null;

    // Increment view count
    if (record.stats) {
      record.stats.viewsCount = (record.stats.viewsCount || 0) + 1;
      saveAllProfileRecords(records);
    }

    return { data, record };
  },

  // Increment CV download stat
  incrementCvDownload(userId: string): void {
    const records = getAllProfileRecords();
    const record = records.find((r) => r.userId === userId);
    if (record && record.stats) {
      record.stats.cvDownloadsCount = (record.stats.cvDownloadsCount || 0) + 1;
      saveAllProfileRecords(records);
    }
  },
};
