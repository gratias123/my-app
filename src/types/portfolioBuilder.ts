export interface CustomSkillItem {
  id: string;
  name: string;
  category?: string;
  levelOrDesc?: string;
  tools?: string[];
}

export interface CustomExperienceItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  current?: boolean;
  description: string;
  missions: string[];
  tools?: string[];
}

export interface CustomEducationItem {
  id: string;
  period: string;
  institution: string;
  degree: string;
  field?: string;
  status?: string;
  description?: string;
}

export interface CustomFormationItem {
  id: string;
  title: string;
  institution?: string;
  date?: string;
  duration?: string;
  description: string;
  hasAttestation: boolean;
  details?: string;
}

export interface CustomCertificationItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  type?: string;
  domain?: string;
  refNumber?: string;
  verifyUrl?: string;
  description?: string;
}

export interface CustomProjectItem {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  role?: string;
  period?: string;
  category?: string;
  imageUrl?: string;
  gallery?: string[];
  link?: string;
  tools: string[];
  context?: string;
  results?: string;
  featured?: boolean;
}

export interface CustomToolItem {
  id?: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  level?: string;
}

export interface CustomWikimediaData {
  enabled: boolean;
  username?: string;
  contributionsUrl?: string;
  profileUrl?: string;
  title?: string;
  badge?: string;
  subtitle?: string;
  presentation?: string;
  paragraphs?: string[];
  highlights?: Array<{ label: string; desc: string }>;
  showRecentUploads?: boolean;
  links?: Array<{ label: string; url: string }>;
}

export interface CustomPortfolioData {
  identity: {
    name: string;
    brandName: string;
    mainTitle: string;
    photoUrl: string;
    location: string;
    email: string;
    phone: string;
  };
  about: {
    tagline: string;
    heroSummary: string;
    presentation: string;
    highlights?: string[];
  };
  skills: CustomSkillItem[];
  experiences: CustomExperienceItem[];
  education: CustomEducationItem[];
  formations: CustomFormationItem[];
  certifications: CustomCertificationItem[];
  projects: {
    enabled: boolean;
    items: CustomProjectItem[];
  };
  tools: Array<string | CustomToolItem>;
  wikimedia?: CustomWikimediaData;
  languages?: {
    id?: string;
    name: string;
    level?: string;
  }[];
  interests?: string[];
  availabilityNotice?: string;
  references?: {
    id?: string;
    name: string;
    title?: string;
    organization?: string;
    contact?: string;
  }[];
  activities?: {
    id?: string;
    title: string;
    organization?: string;
    period?: string;
    description?: string;
    missions?: string[];
    tools?: string[];
  }[];
  links: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    whatsapp?: string;
    instagram?: string;
    website?: string;
    other?: string;
    customLinks?: Array<{ label: string; url: string }>;
  };
}

