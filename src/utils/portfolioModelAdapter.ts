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
import {
  PERSONAL_INFO_EN,
  ABOUT_DATA_EN,
  ACADEMIC_CURRICULUM_EN,
  ADDITIONAL_TRAINING_EN,
  PRACTICAL_EXPERIENCES_EN,
  SKILL_CATEGORIES_EN,
  CERTIFICATIONS_LIST_EN,
  DIGITAL_TOOLS_EN,
} from '../data/portfolioDataEn';

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
    enabled: true,
    items: [
      {
        id: 'proj-1',
        name: 'GratiaLink - Identité visuelle & Solutions graphiques',
        description: 'Conception complète de la marque visuelle GratiaLink : création du logo, élaboration de la charte graphique et production des supports de communication pour les réseaux sociaux.',
        role: 'Designer Graphique & Créateur de marque',
        period: '2023 - 2024',
        tools: ['Photoshop', 'Canva', 'Figma', 'Typographie'],
        results: 'Identité reconnue localement, plusieurs dizaines de commandes graphiques livrées avec satisfaction client.',
      },
      {
        id: 'proj-2',
        name: 'Plateforme Portfolio Professionnel & Générateur de CV',
        description: 'Développement d’une application web moderne de portfolio bilingue (FR/EN) avec éditeur dynamique complet (Base Admin) et générateur de Fiche CV paginée conforme aux standards recruteurs.',
        role: 'Développeur Frontend & Concepteur UI',
        period: '2024',
        tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Lucide Icons'],
        results: 'Interface rapide, accessible sur mobile et desktop, avec mise à jour en temps réel des données.',
      },
      {
        id: 'proj-3',
        name: 'Atelier de diagnostic et de réparation GSM / Informatique',
        description: 'Organisation d’un espace de diagnostic matériel et logiciel pour le dépannage rapide d’unités centrales et de téléphones portables.',
        role: 'Technicien de maintenance',
        period: '2024',
        tools: ['Station à air chaud', 'Multimètre', 'Câblage RJ45', 'Tournevis de précision'],
        results: 'Plus de 80 interventions réussies sur ordinateurs et smartphones avec diagnostic transparent.',
      },
    ],
  },
  tools: DIGITAL_TOOLS.map((t) => ({
    id: `tool-${t.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: t.name,
    category: t.category,
    description: t.category,
    icon: t.name,
    level: 'Maîtrisé',
  })),
  wikimedia: {
    enabled: true,
    username: 'Semako64',
    contributionsUrl: 'https://commons.wikimedia.org/wiki/Special:Contributions/Semako64',
    profileUrl: 'https://commons.wikimedia.org/wiki/User:Semako64',
    title: 'Wikimedia',
    badge: 'Culture Libre & Communs',
    subtitle: 'Contribution & partage de connaissances',
    presentation:
      'Contributeur aux projets Wikimedia sous le pseudonyme « Semako64 ». Mon activité comprend notamment des contributions sur Wikimedia Commons.',
    showRecentUploads: true,
    paragraphs: [
      'L’engagement dans l’univers Wikimedia représente pour moi une passerelle essentielle entre la technique informatique et la responsabilité citoyenne du numérique. Plutôt que de rester simple consommateur passif d’Internet, contribuer permet d’agir concrètement pour la qualité de l’information accessible à tous.',
      'Cette démarche implique une rigueur méthodologique permanente : respect strict de la neutralité de point de vue, vérification scrupuleuse de sources admissibles et indépendantes, et structuration minutieuse des données pour les rendre interopérables et pérennes.',
    ],
    highlights: [
      { label: 'Wikimedia Commons', desc: 'Import et documentation de photographies et médias libres sous licence CC-BY-SA' },
      { label: 'Wikipédia & Wikidata', desc: 'Contributions aux données ouvertes et amélioration méthodique des contenus encyclopédiques' },
    ],
    links: [
      { label: 'Contributions Commons', url: 'https://commons.wikimedia.org/wiki/Special:Contributions/Semako64' },
      { label: 'Profil Utilisateur', url: 'https://commons.wikimedia.org/wiki/User:Semako64' },
    ],
  },
  languages: [
    { id: 'lang-1', name: 'Français', level: 'Langue de travail / Excellente maîtrise écrite et orale' },
    { id: 'lang-2', name: 'Goun / Fon', level: 'Langue nationale / Parlé couramment' },
    { id: 'lang-3', name: 'Anglais technique', level: 'Compréhension écrite des documentations et manuels techniques' },
  ],
  interests: [
    'Veille technologique & architecture matérielle des ordinateurs',
    'Micro-électronique et réparation mobile GSM',
    'Typographie, identités visuelles & design d’interfaces',
    'Diffusion du savoir libre et encyclopédies collaboratives',
  ],
  availabilityNotice: 'Disponible pour des interventions de maintenance informatique, réparation de smartphones, conception graphique et missions techniques.',
  links: {
    github: 'https://github.com',
    linkedin: '',
    facebook: PERSONAL_INFO.facebookUrl,
    whatsapp: PERSONAL_INFO.whatsappUrl,
    instagram: '',
    website: '',
    other: '',
    customLinks: [],
  },
};

export const SEMAKO_MODEL_DATA_EN: CustomPortfolioData = {
  identity: {
    name: PERSONAL_INFO_EN.name,
    brandName: PERSONAL_INFO_EN.brandName,
    mainTitle: PERSONAL_INFO_EN.mainTitle,
    photoUrl: PERSONAL_INFO_EN.photoUrl || '',
    location: PERSONAL_INFO_EN.location,
    email: PERSONAL_INFO_EN.email,
    phone: PERSONAL_INFO_EN.phoneFormatted,
  },
  about: {
    tagline: PERSONAL_INFO_EN.tagline,
    heroSummary: PERSONAL_INFO_EN.heroSummary,
    presentation: ABOUT_DATA_EN.presentation.join('\n\n'),
  },
  skills: SKILL_CATEGORIES_EN.flatMap((cat) =>
    cat.skills.map((s, idx) => ({
      id: `skill-${cat.id}-${idx}`,
      name: s,
      category: cat.title,
      levelOrDesc: '',
    }))
  ),
  experiences: PRACTICAL_EXPERIENCES_EN.map((exp) => ({
    id: exp.id,
    title: exp.title,
    organization: exp.badge,
    location: 'Porto-Novo, Benin',
    period: '2023 - Present',
    description: exp.description,
    missions: exp.activities,
    tools: exp.tools,
  })),
  education: ACADEMIC_CURRICULUM_EN.map((edu) => ({
    id: edu.id,
    period: edu.durationOrYear,
    institution: edu.institution,
    degree: edu.degreeOrField ? `${edu.degreeOrField} — ${edu.status}` : edu.status,
    description: edu.description,
  })),
  formations: ADDITIONAL_TRAINING_EN.map((tr) => ({
    id: tr.id,
    title: tr.title,
    institution: 'Continuous Training',
    date: tr.duration || 'Verified Period',
    duration: tr.duration || '',
    description: tr.description,
    hasAttestation: tr.validationStatus === 'Certificate Earned' || tr.validationStatus === 'Course Completed',
  })),
  certifications: CERTIFICATIONS_LIST_EN.map((cert) => ({
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
  tools: DIGITAL_TOOLS_EN.map((t) => t.name),
  links: {
    github: '',
    linkedin: '',
    facebook: PERSONAL_INFO_EN.facebookUrl,
    whatsapp: PERSONAL_INFO_EN.whatsappUrl,
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
