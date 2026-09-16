export interface CustomSkillItem {
  id: string;
  name: string;
  category?: string;
  levelOrDesc?: string;
}

export interface CustomExperienceItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  missions: string[];
  tools?: string[];
}

export interface CustomEducationItem {
  id: string;
  period: string;
  institution: string;
  degree: string;
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
}

export interface CustomCertificationItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  refNumber?: string;
  verifyUrl?: string;
}

export interface CustomProjectItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  link?: string;
  tools: string[];
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
  tools: string[];
  languages?: {
    id?: string;
    name: string;
    level?: string;
  }[];
  interests?: string[];
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
  };
}
