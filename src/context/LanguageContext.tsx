import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  isEn: boolean;
  t: (key: string, fallback?: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    // Navbar
    'nav.initials': 'SD',
    'nav.home': 'Accueil',
    'nav.resume': 'Fiche CV',
    'nav.contact': 'Me contacter',
    'nav.createPortfolio': 'Créer mon portfolio',
    'nav.mySpace': 'Mon espace',
    'nav.switchLang': 'Passer en anglais',

    // Hero
    'hero.badge': 'Technicien Informatique & Designer',
    'hero.verifiedProfile': 'Profil vérifié & certifié',
    'hero.exploreJourney': 'Découvrir mon parcours',
    'hero.printCv': 'Fiche CV',
    'hero.downloadCv': 'Télécharger CV / Imprimer',
    'hero.statusAvailable': 'Disponible pour interventions techniques & missions graphiques',
    'hero.contactDirect': 'Contact direct :',
    'hero.scrollDown': 'Défiler vers le bas',
    'hero.phone': 'Téléphone :',
    'hero.email': 'Email :',
    'hero.location': 'Localisation :',

    // About
    'about.badge': 'Présentation',
    'about.title': 'À propos de moi',
    'about.subtitle': 'Présentation de mon parcours, de ma formation et de mes orientations professionnelles.',
    'about.learningTitle': "Démarche d'apprentissage et de rigueur",
    'about.learningText': "Développer mes aptitudes par la pratique régulière en atelier, l'analyse méthodique des pannes matérielles et logicielles, et la conception graphique appliquée aux besoins concrets.",
    'about.pillarsTitle': 'Mes deux axes principaux de construction',
    'about.customPillarsTitle': 'Piliers & domaines d’intervention',

    // Skills
    'skills.badge': 'Savoir-faire pratiques',
    'skills.title': 'Compétences & Domaines d’expertise',
    'skills.subtitle': 'Aptitudes concrètes acquises en formation technique, en atelier et en projets visuels.',
    'skills.filterAll': 'Toutes les compétences',

    // Practical Experiences
    'exp.badge': 'Pratique réelle & Atelier',
    'exp.title': 'Expériences pratiques',
    'exp.subtitle': 'Présentation des domaines d’application dans lesquels j’ai réellement pratiqué, sans postes ou entreprises inventés.',
    'exp.activitiesTitle': 'Missions & Réalisations concrètes',
    'exp.toolsTitle': 'Outils & Matériel utilisés',
    'exp.locationLabel': 'Lieu :',
    'exp.periodLabel': 'Période :',
    'exp.workshopEnvironment': 'Environnement d’atelier & pratique technique',

    // Academic Curriculum
    'curriculum.badge': 'Parcours scolaire & professionnel',
    'curriculum.title': 'Cursus académique',
    'curriculum.subtitle': 'Chronologie des études et des formations certifiantes.',
    'curriculum.noData': 'Aucun cursus académique enregistré pour le moment',
    'curriculum.noDataDesc': 'Ajoutez vos diplômes ou études dans l’éditeur de portfolio.',

    // Additional Training
    'training.badge': 'Apprentissages continus',
    'training.title': 'Formations complémentaires',
    'training.subtitle': 'Apprentissages pratiques spécialisés suivis en atelier et formations courtes.',
    'training.attestation': 'Attestation obtenue',
    'training.followed': 'Formation suivie',
    'training.noData': 'Aucune formation complémentaire enregistrée pour le moment',

    // Certifications
    'certs.badge': 'Compétences certifiées',
    'certs.title': 'Certifications & Attestations',
    'certs.subtitle': 'Validations officielles de compétences numériques et technologiques.',
    'certs.dateLabel': 'Délivré le :',
    'certs.domainLabel': 'Domaine :',
    'certs.statusLabel': 'Statut :',
    'certs.noData': 'Aucune certification enregistrée pour le moment',

    // Wikimedia
    'wiki.badge': 'Écosystème du savoir ouvert',
    'wiki.title': 'Wikimedia et connaissance libre',
    'wiki.subtitle': 'Participer activement à la diffusion du savoir encyclopédique, structurer les données ouvertes et valoriser le patrimoine documentaire.',
    'wiki.p1': "L'engagement dans l'univers Wikimedia représente pour moi une passerelle essentielle entre la technique informatique et la responsabilité citoyenne du numérique. Plutôt que de rester simple consommateur passif d'Internet, contribuer permet d'agir concrètement pour la qualité de l'information accessible à tous.",
    'wiki.p2': "Cette démarche implique une rigueur méthodique permanente : respect strict de la neutralité de point de vue, vérification scrupuleuse de sources admissibles et indépendantes, et structuration minutieuse des données pour les rendre interopérables et pérennes.",
    'wiki.p3': "C'est également une formidable opportunité de valoriser les savoirs locaux, les personnalités, les institutions et les richesses culturelles du Bénin et d'Afrique sur les plateformes les plus consultées au monde.",
    'wiki.wikipediaTitle': 'Wikipédia',
    'wiki.wikipediaSub': 'Rédaction & vérification de sources',
    'wiki.wikidataTitle': 'Wikidata',
    'wiki.wikidataSub': 'Données ouvertes & structuration',

    // Tools
    'tools.badge': 'Technologies & Logiciels',
    'tools.title': 'Outils informatiques & logiciels',
    'tools.subtitle': 'Palette d’outils utilisés au quotidien pour le développement, le design et la maintenance.',
    'tools.filterAll': 'Tous les outils',

    // Contact
    'contact.badge': 'Prise de contact',
    'contact.title': 'Me contacter',
    'contact.subtitle': 'Pour un dépannage informatique, une intervention GSM, un projet graphique ou une opportunité professionnelle.',
    'contact.nameLabel': 'Nom complet *',
    'contact.namePlaceholder': 'Votre nom et prénom',
    'contact.emailLabel': 'Adresse e-mail *',
    'contact.emailPlaceholder': 'votre.email@exemple.com',
    'contact.subjectLabel': 'Objet du message',
    'contact.subjectPlaceholder': 'Ex : Dépannage informatique / Projet graphique',
    'contact.messageLabel': 'Votre message *',
    'contact.messagePlaceholder': 'Décrivez votre besoin ou votre projet...',
    'contact.submitBtn': 'Envoyer le message',
    'contact.phone': 'Téléphone',
    'contact.email': 'E-mail',
    'contact.location': 'Localisation',
    'contact.copy': 'Copier',
    'contact.copied': 'Copié !',
    'contact.openWhatsapp': 'Ouvrir WhatsApp',
    'contact.openFacebook': 'Page Facebook',

    // Footer
    'footer.navigation': 'Navigation du portfolio',
    'footer.resources': 'Ressources & Accès',
    'footer.verified': 'Contenu vérifié et authentique • SEMAKO Déo-Gratias',
    'footer.backToTop': 'Haut de page',
    'footer.adminAccess': 'Espace Administration',
    'footer.printResume': 'Fiche CV (Imprimer / PDF)',

    // Print modal
    'print.modalTitle': 'Fiche CV Professionnelle',
    'print.savePdf': 'Imprimer / Sauvegarder en PDF',
    'print.close': 'Fermer',
  },
  en: {
    // Navbar
    'nav.initials': 'SD',
    'nav.home': 'Home',
    'nav.resume': 'Resume',
    'nav.contact': 'Contact Me',
    'nav.createPortfolio': 'Create My Portfolio',
    'nav.mySpace': 'My Dashboard',
    'nav.switchLang': 'Passer en français',

    // Hero
    'hero.badge': 'IT Technician & Graphic Designer',
    'hero.verifiedProfile': 'Verified & Certified Profile',
    'hero.exploreJourney': 'Explore My Journey',
    'hero.printCv': 'Resume',
    'hero.downloadCv': 'Download CV / Print',
    'hero.statusAvailable': 'Available for technical support & visual design projects',
    'hero.contactDirect': 'Direct contact:',
    'hero.scrollDown': 'Scroll down',
    'hero.phone': 'Phone:',
    'hero.email': 'Email:',
    'hero.location': 'Location:',

    // About
    'about.badge': 'About Me',
    'about.title': 'About Me',
    'about.subtitle': 'Overview of my career path, education, and professional focus.',
    'about.learningTitle': 'Commitment to Learning & Rigor',
    'about.learningText': 'Developing practical abilities through regular workshop practice, methodical troubleshooting of hardware and software faults, and graphic design tailored to concrete needs.',
    'about.pillarsTitle': 'My Two Main Pillars',
    'about.customPillarsTitle': 'Pillars & Key Focus Areas',

    // Skills
    'skills.badge': 'Practical Skills',
    'skills.title': 'Skills & Areas of Expertise',
    'skills.subtitle': 'Hands-on capabilities developed through technical education, workshop practice, and visual projects.',
    'skills.filterAll': 'All Skills',

    // Practical Experiences
    'exp.badge': 'Hands-on Practice & Workshop',
    'exp.title': 'Practical Experiences',
    'exp.subtitle': 'Real-world fields of practice where I have acquired hands-on experience, without fictitious roles or companies.',
    'exp.activitiesTitle': 'Key Activities & Practical Tasks',
    'exp.toolsTitle': 'Tools & Equipment Used',
    'exp.locationLabel': 'Location:',
    'exp.periodLabel': 'Period:',
    'exp.workshopEnvironment': 'Workshop Environment & Technical Practice',

    // Academic Curriculum
    'curriculum.badge': 'Academic & Vocational Journey',
    'curriculum.title': 'Academic Curriculum',
    'curriculum.subtitle': 'Chronology of academic studies and vocational credentials.',
    'curriculum.noData': 'No academic milestones recorded yet',
    'curriculum.noDataDesc': 'Add your degrees or education in the portfolio builder.',

    // Additional Training
    'training.badge': 'Continuous Learning',
    'training.title': 'Additional Training',
    'training.subtitle': 'Specialized practical courses completed alongside the academic curriculum.',
    'training.attestation': 'Certificate Earned',
    'training.followed': 'Course Completed',
    'training.noData': 'No additional training recorded yet',

    // Certifications
    'certs.badge': 'Certified Credentials',
    'certs.title': 'Certifications & Credentials',
    'certs.subtitle': 'Official validations of digital, AI, and networking skills.',
    'certs.dateLabel': 'Issued on:',
    'certs.domainLabel': 'Domain:',
    'certs.statusLabel': 'Status:',
    'certs.noData': 'No certifications recorded yet',

    // Wikimedia
    'wiki.badge': 'Open Knowledge Ecosystem',
    'wiki.title': 'Wikimedia & Free Knowledge',
    'wiki.subtitle': 'Actively contributing to encyclopedic knowledge distribution, structuring open data, and highlighting cultural heritage.',
    'wiki.p1': 'My involvement in the Wikimedia ecosystem represents an essential bridge between computer engineering and responsible digital citizenship. Rather than remaining a passive web consumer, contributing enables direct action for the quality of knowledge accessible to all.',
    'wiki.p2': 'This commitment requires constant methodological rigor: strict adherence to neutral point of view, scrupulous verification of admissible and independent sources, and thorough data structuring for long-term interoperability.',
    'wiki.p3': 'It is also a remarkable opportunity to highlight local knowledge, prominent figures, institutions, and cultural heritage of Benin and Africa on the most visited educational platforms worldwide.',
    'wiki.wikipediaTitle': 'Wikipedia',
    'wiki.wikipediaSub': 'Article drafting & source verification',
    'wiki.wikidataTitle': 'Wikidata',
    'wiki.wikidataSub': 'Open linked data & structuring',

    // Tools
    'tools.badge': 'Technologies & Software',
    'tools.title': 'Mastered Tools & Software',
    'tools.subtitle': 'Suite of tools utilized daily for development, visual design, and computer maintenance.',
    'tools.filterAll': 'All Tools',

    // Contact
    'contact.badge': 'Get In Touch',
    'contact.title': 'Contact Me',
    'contact.subtitle': 'For computer troubleshooting, GSM repair, graphic design, or professional collaboration.',
    'contact.nameLabel': 'Full Name *',
    'contact.namePlaceholder': 'Your full name',
    'contact.emailLabel': 'Email Address *',
    'contact.emailPlaceholder': 'your.email@example.com',
    'contact.subjectLabel': 'Subject',
    'contact.subjectPlaceholder': 'e.g. IT support / Graphic design request',
    'contact.messageLabel': 'Your Message *',
    'contact.messagePlaceholder': 'Describe your needs or project...',
    'contact.submitBtn': 'Send Message',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.location': 'Location',
    'contact.copy': 'Copy',
    'contact.copied': 'Copied!',
    'contact.openWhatsapp': 'Open WhatsApp',
    'contact.openFacebook': 'Facebook Page',

    // Footer
    'footer.navigation': 'Portfolio Navigation',
    'footer.resources': 'Resources & Links',
    'footer.verified': 'Verified and authentic content • SEMAKO Déo-Gratias',
    'footer.backToTop': 'Back to top',
    'footer.adminAccess': 'Admin Portal',
    'footer.printResume': 'Resume (Print / PDF)',

    // Print modal
    'print.modalTitle': 'Professional Resume',
    'print.savePdf': 'Print / Save as PDF',
    'print.close': 'Close',
  },
};

const LanguageContext = createContext<LanguageContextValue>({
  language: 'fr',
  setLanguage: () => {},
  isEn: false,
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('semako_portfolio_lang');
      if (saved === 'en' || saved === 'fr') {
        return saved;
      }
    }
    return 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('semako_portfolio_lang', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch {
      // Storage unavailable fallback
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || fallback || TRANSLATIONS.fr[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isEn: language === 'en',
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
