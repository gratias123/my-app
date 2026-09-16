import {
  SkillCategory,
  PracticalExperience,
  AcademicCurriculumItem,
  AdditionalTrainingItem,
  EducationItem,
  CertificationItem,
  DigitalTool,
} from '../types';
import profilePhoto from '../assets/images/profile.jpg';

export const PERSONAL_INFO = {
  name: 'SEMAKO Déo-Gratias',
  brandName: 'GratiaLink',
  mainTitle: 'TECHNICIEN INFORMATIQUE & UI/UX DESIGNER',
  fullTitle: 'Technicien Informatique & UI/UX Designer',
  tagline: 'Maintenance des équipements, solutions numériques et création visuelle',
  subHeadline:
    'Technicien informatique et designer graphique, avec un parcours orienté vers la maintenance des équipements, le numérique et la création visuelle.',
  heroSummary:
    'Mon parcours associe la technique informatique, la maintenance des équipements, la création graphique et l’exploration des outils numériques. Je développe mes compétences à travers la pratique, la formation et l’apprentissage continu.',
  location: 'Porto-Novo, Bénin',
  email: 'semakodeogratias@gmail.com',
  phone: '+229 0164690682',
  phoneFormatted: '+229 01 64 69 06 82',
  availableFor: 'Interventions techniques, créations graphiques & opportunités professionnelles',
  photoUrl: profilePhoto,
  facebookUrl: 'https://www.facebook.com/profile.php?id=61593525761448',
  whatsappUrl: 'https://wa.me/message/4ZXFCVLLZVL5C1',
};

export const ABOUT_DATA = {
  title: 'À propos de moi',
  presentation: [
    'SEMAKO Déo-Gratias a débuté son cursus secondaire au Lycée Béhanzin, où il a obtenu son BEPC en 2023.',
    'Après l’obtention de ce diplôme, il a poursuivi ses études au Lycée Technique et Professionnel de Porto-Novo en intégrant un cursus professionnel de 3 ans dans la filière Installations et Maintenance en Informatique (IMI).',
    'Son profil professionnel se construit aujourd’hui autour de deux axes complémentaires : l’informatique appliquée à la maintenance des équipements et le design graphique pour la création visuelle.',
    'Son parcours intègre également des apprentissages pratiques en maintenance de smartphones (GSM), en outils du web, en utilisation avancée d’Internet, en conception d’interfaces (UI/UX) et en compréhension des enjeux d’une intelligence artificielle responsable.',
  ],
  axes: [
    {
      title: 'Informatique & Maintenance',
      description:
        'Diagnostic matériel, dépannage des postes de travail, câblage réseau RJ45 et entretien des parcs informatiques.',
    },
    {
      title: 'Design graphique & Création visuelle',
      description:
        'Conception d’affiches, de supports de communication, traitement d’images et maquettage ergonomique d’interfaces.',
    },
  ],
};

export const ACADEMIC_CURRICULUM: AcademicCurriculumItem[] = [
  {
    id: 'cursus-behanzin',
    institution: 'Lycée Béhanzin',
    degreeOrField: 'Parcours secondaire',
    durationOrYear: '2023',
    status: 'Diplôme obtenu : BEPC',
    description:
      'Études secondaires sanctionnées avec succès par l’obtention du Brevet d’Études du Premier Cycle (BEPC) en 2023.',
  },
  {
    id: 'cursus-ltp-portonovo',
    institution: 'Lycée Technique et Professionnel de Porto-Novo — Bénin',
    degreeOrField: 'Installations et Maintenance en Informatique (IMI)',
    fieldDetails: 'Filière IMI',
    durationOrYear: '3 ans',
    status: 'Formation professionnelle suivie',
    description:
      'Formation professionnelle suivie au Lycée Technique et Professionnel de Porto-Novo, axée sur la maintenance des ordinateurs, le diagnostic de pannes, les réseaux informatiques et la configuration système.',
  },
];

export const ADDITIONAL_TRAINING: AdditionalTrainingItem[] = [
  {
    id: 'formation-info-1an',
    title: 'Formation en informatique — 1 an',
    duration: '1 an',
    description:
      'Apprentissage des bases informatiques, de la bureautique et de l’environnement des systèmes d’exploitation.',
    validationStatus: 'Formation suivie',
  },
  {
    id: 'formation-maintenance-gsm',
    title: 'Formation en maintenance GSM',
    description:
      'Pratique du diagnostic, de l’entretien et de la réparation matérielle et logicielle des téléphones portables et smartphones.',
    validationStatus: 'Formation suivie',
  },
  {
    id: 'formation-graphisme',
    title: 'Formation en graphisme',
    description:
      'Apprentissage de la composition visuelle, de l’harmonie des couleurs et de la création de supports de communication.',
    validationStatus: 'Formation suivie',
  },
  {
    id: 'formation-serigraphie',
    title: 'Formation en Sérigraphie',
    description: 'Formation pratique en sérigraphie',
    validationStatus: 'Attestation obtenue',
  },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    id: 'edu-ltp-portonovo',
    title: 'Installations et Maintenance en Informatique (IMI)',
    institution: 'Lycée Technique et Professionnel de Porto-Novo — Bénin',
    duration: '3 ans',
    status: 'en-cours',
    isMain: true,
    description:
      'Formation professionnelle suivie au Lycée Technique et Professionnel de Porto-Novo, axée sur la maintenance des ordinateurs, le diagnostic de pannes, les réseaux informatiques et la configuration système.',
    keyLearnings: [
      'Diagnostic matériel et dépannage des postes de travail',
      'Installation et configuration des systèmes d’exploitation',
      'Câblage RJ45 et sertissage de câbles réseau',
      'Maintenance préventive et entretien des équipements informatiques',
    ],
  },
  {
    id: 'edu-behanzin',
    title: 'Brevet d’Études du Premier Cycle (BEPC)',
    institution: 'Lycée Béhanzin',
    duration: '2023',
    status: 'complete',
    isMain: false,
    description:
      'Cursus secondaire général sanctionné avec succès par l’obtention du diplôme du BEPC en 2023, préalable à l’orientation technique.',
    keyLearnings: [
      'Formation générale et raisonnement scientifique',
      'Méthodologie de travail et expression écrite',
      'Socle académique préparatoire à l’enseignement professionnel',
    ],
  },
  {
    id: 'edu-info-1an',
    title: 'Formation en informatique — 1 an',
    institution: 'Formation pratique',
    duration: '1 an',
    status: 'complete',
    isMain: false,
    description:
      'Apprentissage des bases informatiques, de la bureautique et de l’environnement des systèmes d’exploitation.',
    keyLearnings: [
      'Prise en main approfondie des systèmes et fichiers',
      'Bureautique et traitement de données',
      'Bonnes pratiques d’utilisation informatique',
    ],
  },
  {
    id: 'edu-gsm',
    title: 'Formation en maintenance GSM',
    institution: 'Formation pratique spécialisée',
    duration: 'Formation pratique',
    status: 'complete',
    isMain: false,
    description:
      'Pratique du diagnostic, de l’entretien et de la réparation matérielle et logicielle des téléphones portables et smartphones.',
    keyLearnings: [
      'Démontage sécurisé et analyse des pannes matérielles',
      'Remplacement d’écrans, batteries et connecteurs de charge',
      'Nettoyage et désoxydation des circuits électroniques',
    ],
  },
  {
    id: 'edu-graphisme',
    title: 'Formation en graphisme',
    institution: 'Formation pratique en création visuelle',
    duration: 'Formation pratique',
    status: 'complete',
    isMain: false,
    description:
      'Apprentissage de la composition visuelle, de l’harmonie des couleurs et de la création de supports de communication.',
    keyLearnings: [
      'Conception d’affiches, flyers et bannières numériques',
      'Mise en page, contrastes et typographie',
      'Retouche et traitement d’images sous Photoshop, Photopea et Canva',
    ],
  },
  {
    id: 'edu-serigraphie',
    title: 'Formation en Sérigraphie',
    institution: 'Formation pratique en sérigraphie',
    duration: 'Attestation obtenue',
    status: 'complete',
    isMain: false,
    description:
      'Formation pratique en sérigraphie sanctionnée par une attestation obtenue, compétence complémentaire liée au graphisme et à la création visuelle.',
    keyLearnings: [
      'Techniques d’impression sérigraphique',
      'Préparation des visuels et encrage sur supports variés',
      'Attestation de formation pratique obtenue',
    ],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'info-maintenance',
    title: 'INFORMATIQUE & MAINTENANCE',
    iconName: 'Wrench',
    description: 'Diagnostic, réparation matérielle et maintien opérationnel des postes informatiques et réseaux.',
    skills: [
      'Installation et maintenance informatique',
      'Diagnostic et dépannage informatique',
      'Maintenance des équipements informatiques',
      'Administration élémentaire des postes de travail',
      'Installation et configuration de logiciels',
      'Réseaux informatiques',
      'Câblage RJ45',
      'Sertissage de câbles réseau',
    ],
  },
  {
    id: 'maintenance-gsm',
    title: 'MAINTENANCE GSM',
    iconName: 'Smartphone',
    description: 'Interventions techniques et réparations sur téléphones portables et appareils mobiles.',
    skills: [
      'Diagnostic de pannes',
      'Maintenance des téléphones mobiles',
      'Entretien et réparation des appareils mobiles',
    ],
  },
  {
    id: 'design-graphique',
    title: 'DESIGN GRAPHIQUE',
    iconName: 'Palette',
    description: 'Création visuelle, composition de supports de communication et traitement de l’image.',
    skills: [
      'Conception graphique',
      'Création de supports visuels',
      'Mise en page',
      'Communication visuelle',
      'Retouche et traitement d’images',
      'Sérigraphie',
    ],
  },
  {
    id: 'outils-design',
    title: 'OUTILS DE DESIGN',
    iconName: 'Layers',
    description: 'Logiciels et plateformes utilisés pour la création visuelle et le maquettage.',
    skills: ['Photoshop', 'Photopea', 'Canva', 'Adobe XD', 'Figma'],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX',
    iconName: 'Layout',
    description: 'Conception d’expériences numériques centrées sur l’utilisateur et clarté des interfaces.',
    skills: [
      'Conception d’interfaces',
      'Wireframes',
      'Maquettage',
      'Organisation visuelle d’interfaces',
      'Principes d’ergonomie',
    ],
  },
  {
    id: 'web-outils-numeriques',
    title: 'WEB & OUTILS NUMÉRIQUES',
    iconName: 'Globe',
    description: 'Technologies d’intégration front-end et outils de travail pour le numérique.',
    skills: [
      'HTML',
      'CSS',
      'JavaScript',
      'Bootstrap',
      'Visual Studio Code',
      'GitHub',
      'GitHub Pages',
    ],
  },
];

export const PRACTICAL_EXPERIENCES: PracticalExperience[] = [
  {
    id: 'exp-maintenance-info',
    title: 'EXPÉRIENCE EN MAINTENANCE INFORMATIQUE',
    category: 'Informatique & Systèmes',
    badge: 'Atelier & Équipements',
    description:
      'Pratique régulière du diagnostic, de l’entretien et de la maintenance des équipements informatiques.',
    activities: [
      'Dépoussiérage et révision physique des unités centrales et circuits de ventilation.',
      'Diagnostic méthodique des pannes d’allumage, d’affichage et de surchauffe.',
      'Remplacement et vérification de composants matériels : RAM, disques de stockage, blocs d’alimentation.',
      'Installation propre et paramétrage de systèmes d’exploitation et logiciels utilitaires.',
      'Réalisation et test de câblages réseau RJ45 (sertissage droit et croisé).',
    ],
    tools: ['Tournevis de précision', 'Pince à sertir RJ45', 'Testeur de câble', 'Images système bootables'],
  },
  {
    id: 'exp-maintenance-gsm',
    title: 'EXPÉRIENCE EN MAINTENANCE GSM',
    category: 'Appareils Mobiles',
    badge: 'Intervention mobile',
    description:
      'Pratique du diagnostic et de la maintenance des téléphones mobiles et appareils portables.',
    activities: [
      'Analyse des dysfonctionnements matériels (défaut de charge, écran noir, perte de tactile).',
      'Démontage ordonné et sécurisé des coques, nappes et composants internes.',
      'Remplacement d’écrans cassés, de batteries défectueuses et de connecteurs de charge.',
      'Nettoyage et désoxydation minutieuse des circuits électroniques.',
    ],
    tools: ['Spatules d’ouverture', 'Pistolet à air chaud', 'Multimètre', 'Pinceaux antistatiques'],
  },
  {
    id: 'exp-graphisme',
    title: 'EXPÉRIENCE EN GRAPHISME',
    category: 'Création Visuelle',
    badge: 'Supports visuels',
    description:
      'Conception de visuels, supports graphiques et contenus numériques adaptés aux besoins de communication.',
    activities: [
      'Création d’affiches, de flyers informatifs et de bannières pour les réseaux sociaux.',
      'Mise en page équilibrée respectant la hiérarchie typographique et les contrastes.',
      'Détourage, retouches colorimétriques et traitement d’images numériques.',
      'Déclinaison de maquettes visuelles adaptées à l’impression et aux formats web.',
    ],
    tools: ['Photoshop', 'Photopea', 'Canva'],
  },
  {
    id: 'exp-uiux',
    title: 'EXPÉRIENCE EN UI/UX',
    category: 'Design d’Interfaces',
    badge: 'Ergonomie & Maquettes',
    description:
      'Pratique du maquettage et de la conception d’interfaces utilisateur claires et intuitives.',
    activities: [
      'Structuration des écrans et élaboration de wireframes pour organiser les informations.',
      'Réalisation de maquettes interactives pour applications et pages web.',
      'Application des principes d’ergonomie pour faciliter la navigation sur smartphone et ordinateur.',
      'Sélection de palettes de couleurs lisibles et d’éléments de navigation cohérents.',
    ],
    tools: ['Figma', 'Adobe XD'],
  },
  {
    id: 'exp-wikimedia',
    title: 'CONTRIBUTION NUMÉRIQUE / WIKIMEDIA',
    category: 'Culture Libre',
    badge: 'Partage de connaissances',
    description:
      'Implication active dans l’écosystème Wikimedia pour documenter, fiabiliser et partager la connaissance libre.',
    activities: [
      'Contribution à la rédaction et à la relecture d’articles encyclopédiques sur Wikipédia.',
      'Recherche et vérification rigoureuse des sources documentaires.',
      'Structuration et mise à jour de données ouvertes sur Wikidata.',
      'Sensibilisation au partage du savoir libre et à la valorisation des informations vérifiées.',
    ],
    tools: ['Wikipédia', 'Wikidata', 'Ressources documentaires'],
  },
];

export const CERTIFICATIONS_LIST: CertificationItem[] = [
  {
    id: 'cert-1',
    title: 'IA pour tous',
    issuedDate: '5 août 2026',
    status: 'Certificat de réussite',
    domain: 'Intelligence Artificielle',
    description:
      'Compréhension des notions fondamentales de l’intelligence artificielle, de ses mécanismes généraux et de ses applications concrètes.',
  },
  {
    id: 'cert-2',
    title: 'IA responsable',
    issuedDate: '5 août 2026',
    status: 'Certificat de réussite',
    domain: 'Éthique & Société Numérique',
    description:
      'Sensibilisation aux principes éthiques de l’IA : équité des algorithmes, transparence, protection de la vie privée et utilisation raisonnée.',
  },
  {
    id: 'cert-3',
    title: 'Les fondamentaux d’Internet',
    issuedDate: '5 août 2026',
    status: 'Certificat de réussite',
    domain: 'Culture Réseau & Protocoles',
    description:
      'Connaissance des principes de fonctionnement d’Internet, de l’acheminement des données et des architectures réseau de base.',
  },
  {
    id: 'cert-4',
    title: 'Compétences Internet pour une utilisation quotidienne',
    issuedDate: '5 août 2026',
    status: 'Certificat de réussite',
    domain: 'Usages Numériques du Quotidien',
    description:
      'Maîtrise des pratiques quotidiennes sur le web : navigation sécurisée, outils en ligne courants et gestion des informations personnelles.',
  },
  {
    id: 'cert-5',
    title: 'Recherche sur Internet et au-delà',
    issuedDate: '5 août 2026',
    status: 'Certificat de réussite',
    domain: 'Recherche & Évaluation de l’Information',
    description:
      'Méthodes de recherche documentaire efficace, validation des sources en ligne et analyse critique des contenus trouvés sur le web.',
  },
];

export const DIGITAL_TOOLS: DigitalTool[] = [
  {
    name: 'HTML',
    category: 'Développement Web',
    icon: 'FileCode',
    description: 'Structuration sémantique et accessible des pages web.',
  },
  {
    name: 'CSS',
    category: 'Développement Web',
    icon: 'Palette',
    description: 'Mise en forme graphique, styles et design responsive.',
  },
  {
    name: 'JavaScript',
    category: 'Développement Web',
    icon: 'Terminal',
    description: 'Dynamisme, logique interactive et gestion des événements utilisateur.',
  },
  {
    name: 'Bootstrap',
    category: 'Développement Web',
    icon: 'Grid',
    description: 'Framework CSS pour concevoir des mises en page réactives et ordonnées.',
  },
  {
    name: 'Visual Studio Code',
    category: 'Éditeur & Versioning',
    icon: 'Code',
    description: 'Éditeur de code polyvalent avec extensions pour le web.',
  },
  {
    name: 'GitHub',
    category: 'Éditeur & Versioning',
    icon: 'GitBranch',
    description: 'Gestion de dépôts de code et suivi des versions de projets.',
  },
  {
    name: 'GitHub Pages',
    category: 'Éditeur & Versioning',
    icon: 'Globe',
    description: 'Hébergement et publication en ligne de pages web statiques.',
  },
  {
    name: 'Photoshop',
    category: 'Design & UI/UX',
    icon: 'Image',
    description: 'Retouche d’images, détourage précis et création graphique matricielle.',
  },
  {
    name: 'Photopea',
    category: 'Design & UI/UX',
    icon: 'Layers',
    description: 'Édition graphique en ligne pratique et accessible depuis un navigateur.',
  },
  {
    name: 'Canva',
    category: 'Design & UI/UX',
    icon: 'Sparkles',
    description: 'Conception rapide de supports de communication et déclinaisons visuelles.',
  },
  {
    name: 'Adobe XD',
    category: 'Design & UI/UX',
    icon: 'Layout',
    description: 'Conception de wireframes et prototypes d’interfaces logicielles et mobiles.',
  },
  {
    name: 'Figma',
    category: 'Design & UI/UX',
    icon: 'Figma',
    description: 'Maquettage d’écrans d’applications, composants graphiques et ergonomie UI.',
  },
];
