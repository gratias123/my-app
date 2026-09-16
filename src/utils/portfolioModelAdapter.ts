import { CustomPortfolioData } from '../types/portfolioBuilder';
import {
  PERSONAL_INFO,
  ABOUT_DATA,
  ACADEMIC_CURRICULUM,
  ADDITIONAL_TRAINING,
  PRACTICAL_EXPERIENCES,
  SKILL_CATEGORIES,
  CERTIFICATIONS_LIST,
  DIGITAL_TOOLS,
} from '../data/portfolioData';

export const SEMAKO_MODEL_DATA: CustomPortfolioData = {
  identity: {
    name: PERSONAL_INFO.name,
    brandName: PERSONAL_INFO.brandName,
    mainTitle: PERSONAL_INFO.mainTitle,
    photoUrl: PERSONAL_INFO.photoUrl || '',
    location: PERSONAL_INFO.location,
    email: PERSONAL_INFO.email,
    phone: PERSONAL_INFO.phoneFormatted,
  },
  about: {
    tagline: PERSONAL_INFO.tagline,
    heroSummary: PERSONAL_INFO.heroSummary,
    presentation: ABOUT_DATA.presentation.join('\n\n'),
  },
  skills: SKILL_CATEGORIES.flatMap((cat) =>
    cat.skills.map((s, idx) => ({
      id: `skill-${cat.id}-${idx}`,
      name: s,
      category: cat.title,
      levelOrDesc: '',
    }))
  ),
  experiences: PRACTICAL_EXPERIENCES.map((exp) => ({
    id: exp.id,
    title: exp.title,
    organization: exp.badge,
    location: 'Porto-Novo, Bénin',
    period: '2023 - Présent',
    description: exp.description,
    missions: exp.activities,
    tools: exp.tools,
  })),
  education: ACADEMIC_CURRICULUM.map((edu) => ({
    id: edu.id,
    period: edu.durationOrYear,
    institution: edu.institution,
    degree: edu.degreeOrField ? `${edu.degreeOrField} — ${edu.status}` : edu.status,
    description: edu.description,
  })),
  formations: ADDITIONAL_TRAINING.map((tr) => ({
    id: tr.id,
    title: tr.title,
    institution: 'Formation continue',
    date: tr.duration || 'Période confirmée',
    duration: tr.duration || '',
    description: tr.description,
    hasAttestation: tr.validationStatus === 'Attestation obtenue' || tr.validationStatus === 'Formation suivie',
  })),
  certifications: CERTIFICATIONS_LIST.map((cert) => ({
    id: cert.id,
    title: `${cert.title} (${cert.status})`,
    issuer: cert.domain,
    date: cert.issuedDate,
    refNumber: '',
    verifyUrl: '',
  })),
  projects: {
    enabled: false,
    items: [],
  },
  tools: DIGITAL_TOOLS.map((t) => t.name),
  links: {
    github: '',
    linkedin: '',
    facebook: PERSONAL_INFO.facebookUrl,
    whatsapp: PERSONAL_INFO.whatsappUrl,
    instagram: '',
    website: '',
    other: '',
  },
};

export const EMPTY_STARTER_DATA: CustomPortfolioData = {
  identity: {
    name: '',
    brandName: '',
    mainTitle: '',
    photoUrl: '',
    location: '',
    email: '',
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
    facebook: '',
    instagram: '',
    website: '',
    other: '',
  },
};

const STORAGE_KEY = 'user_custom_portfolio_data_v1';

export function saveCustomPortfolioToStorage(data: CustomPortfolioData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Erreur lors de la sauvegarde locale :', err);
  }
}

export function loadCustomPortfolioFromStorage(): CustomPortfolioData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomPortfolioData;
  } catch (err) {
    console.error('Erreur lors du chargement local :', err);
    return null;
  }
}

export function clearCustomPortfolioStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Erreur lors de la suppression locale :', err);
  }
}

/**
 * Encodage URL sécurisé sans dépendance externe pour partage instantané
 */
export function encodePortfolioToUrl(data: CustomPortfolioData): string {
  try {
    // Avoid embedding huge base64 photos in URL to prevent URL length limits
    const clone = { ...data };
    if (clone.identity.photoUrl && clone.identity.photoUrl.startsWith('data:')) {
      clone.identity = { ...clone.identity, photoUrl: '' }; // Strip huge data URLs from share query
    }
    const jsonStr = JSON.stringify(clone);
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    const url = new URL(window.location.href);
    url.searchParams.set('p', encoded);
    return url.toString();
  } catch (err) {
    console.error('Erreur lors de la génération du lien :', err);
    return window.location.href;
  }
}

export function decodePortfolioFromUrl(customParam?: string): CustomPortfolioData | null {
  try {
    let param = customParam;
    if (!param) {
      const url = new URL(window.location.href);
      param = url.searchParams.get('p') || undefined;
    }
    if (!param) return null;
    const decodedStr = decodeURIComponent(escape(atob(decodeURIComponent(param))));
    return JSON.parse(decodedStr) as CustomPortfolioData;
  } catch (err) {
    console.error('Erreur de décodage du portfolio depuis URL :', err);
    return null;
  }
}
