export interface SkillCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  skills: string[];
  tools?: string[];
}

export interface PracticalExperience {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  activities: string[];
  tools: string[];
}

export interface AcademicCurriculumItem {
  id: string;
  institution: string;
  degreeOrField: string;
  fieldDetails?: string;
  durationOrYear: string;
  status: string;
  description: string;
}

export interface AdditionalTrainingItem {
  id: string;
  title: string;
  duration?: string;
  description: string;
  validationStatus?: string;
}

export interface EducationItem {
  id: string;
  title: string;
  institution?: string;
  duration: string;
  status: 'en-cours' | 'complete';
  isMain?: boolean;
  description: string;
  keyLearnings: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuedDate: string;
  status: string;
  domain: string;
  description: string;
}

export interface DigitalTool {
  name: string;
  category: 'Design & UI/UX' | 'Développement Web' | 'Éditeur & Versioning' | 'Bureautique & Réseau';
  icon: string;
  description: string;
}
