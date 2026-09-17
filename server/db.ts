import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface DbUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  slug: string;
}

export interface DbPortfolio {
  id: string;
  userId: string;
  slug: string;
  data: any;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  stats: {
    viewsCount: number;
    cvDownloadsCount: number;
  };
}

export interface DbSession {
  token: string;
  userId: string;
  role: 'user' | 'admin';
  createdAt: number;
  expiresAt: number;
}

interface PlatformDatabase {
  users: DbUser[];
  portfolios: DbPortfolio[];
  sessions: DbSession[];
}

// Complete reference portfolio data for the platform owner (SEMAKO Déo-Gratias)
const DEFAULT_OWNER_PORTFOLIO_DATA = {
  identity: {
    name: 'SEMAKO Déo-Gratias',
    brandName: 'GratiaLink',
    mainTitle: 'TECHNICIEN INFORMATIQUE & UI/UX DESIGNER',
    photoUrl: '/src/assets/images/profile.jpg',
    location: 'Porto-Novo, Bénin',
    email: 'semakodeogratias@gmail.com',
    phone: '+229 01 64 69 06 82',
  },
  about: {
    tagline: 'Maintenance des équipements, solutions numériques et création visuelle',
    heroSummary:
      'Mon parcours associe la technique informatique, la maintenance des équipements, la création graphique et l’exploration des outils numériques. Je développe mes compétences à travers la pratique, la formation et l’apprentissage continu.',
    presentation:
      'SEMAKO Déo-Gratias a débuté son cursus secondaire au Lycée Béhanzin, où il a obtenu son BEPC en 2023.\n\nAprès l’obtention de ce diplôme, il a poursuivi ses études au Lycée Technique et Professionnel de Porto-Novo en intégrant un cursus professionnel de 3 ans dans la filière Installations et Maintenance en Informatique (IMI).\n\nSon profil professionnel se construit aujourd’hui autour de deux axes complémentaires : l’informatique appliquée à la maintenance des équipements et le design graphique pour la création visuelle.\n\nSon parcours intègre également des apprentissages pratiques en maintenance de smartphones (GSM), en outils du web, en utilisation avancée d’Internet, en conception d’interfaces (UI/UX) et en compréhension des enjeux d’une intelligence artificielle responsable.',
    highlights: [
      'Informatique & Maintenance des parcs et postes clients',
      'Design graphique, identités visuelles & prototypage ergonomique UI/UX',
      'Maintenance matérielle des smartphones (GSM)',
      'Engagement actif dans les communs numériques et Wikimedia',
    ],
  },
  skills: [
    { id: 'sk-1', name: 'Diagnostic matériel & logiciel des ordinateurs', category: 'Informatique & Maintenance', levelOrDesc: 'Diagnostic méthodique et résolution de pannes sur cartes mères, alimentations et disques.' },
    { id: 'sk-2', name: 'Dépannage des postes de travail & remplacement de composants', category: 'Informatique & Maintenance', levelOrDesc: 'Remplacement de dalles, RAM, ventilateurs, blocs d’alimentation et connectique.' },
    { id: 'sk-3', name: 'Installation et configuration des systèmes Windows & Linux', category: 'Informatique & Maintenance', levelOrDesc: 'Formatage, partitionnement, configuration UEFI/BIOS, gestion des pilotes et sécurisation.' },
    { id: 'sk-4', name: 'Réalisation de câblages réseau RJ45 & tests de connectivité', category: 'Informatique & Maintenance', levelOrDesc: 'Sertissage aux normes T568A/B, pose de goulottes et vérification au testeur réseau.' },
    { id: 'sk-5', name: 'Maintenance préventive & nettoyage physique des parcs', category: 'Informatique & Maintenance', levelOrDesc: 'Dépoussiérage, remplacement de pâte thermique, optimisation logicielle et mises à jour.' },
    { id: 'sk-6', name: 'Diagnostic approfondi des pannes sur smartphones Android & iOS', category: 'Maintenance GSM', levelOrDesc: 'Identification des pannes logicielles (bootloop) et matérielles (circuits de charge).' },
    { id: 'sk-7', name: 'Remplacement d’écrans tactiles & dalles LCD/OLED', category: 'Maintenance GSM', levelOrDesc: 'Démontage sécurisé sous chauffe thermique et recollage étanche de précision.' },
    { id: 'sk-8', name: 'Remplacement de batteries & connecteurs de charge USB-C', category: 'Maintenance GSM', levelOrDesc: 'Micro-soudure des ports, nettoyage des pistes et tests de tension/courant.' },
    { id: 'sk-9', name: 'Désoxydation des circuits électroniques après immersion', category: 'Maintenance GSM', levelOrDesc: 'Bain à ultrasons, nettoyage à l’alcool isopropylique et contrôle des courts-circuits.' },
    { id: 'sk-10', name: 'Utilisation d’équipements spécialisés (Station air chaud, multimètre)', category: 'Maintenance GSM', levelOrDesc: 'Maîtrise des profils thermiques et mesure des continuités au multimètre digital.' },
    { id: 'sk-11', name: 'Conception d’affiches, flyers & supports de communication', category: 'Design Graphique', levelOrDesc: 'Création de visuels percutants avec respect des règles de composition et d’équilibre.' },
    { id: 'sk-12', name: 'Retouche avancée, détourage et traitement d’images', category: 'Design Graphique', levelOrDesc: 'Correction colorimétrique, masque de fusion et optimisation des formats d’exportation.' },
    { id: 'sk-13', name: 'Élaboration de chartes graphiques & identités de marques', category: 'Design Graphique', levelOrDesc: 'Conception de logos, choix de palettes chromatiques et grilles typographiques.' },
    { id: 'sk-14', name: 'Sérigraphie artisanale sur textiles & supports papier', category: 'Design Graphique', levelOrDesc: 'Insolation de cadres, calage des typons et impression manuelle multi-couleurs.' },
    { id: 'sk-15', name: 'Prototypage d’interfaces ergonomiques et intuitives (UI/UX)', category: 'Design Graphique', levelOrDesc: 'Wireframes, maquettes haute fidélité et composants interactifs sous Figma.' },
    { id: 'sk-16', name: 'Adobe Photoshop & Photopea', category: 'Outils de Design', levelOrDesc: 'Création matricielle professionnelle, composition graphique et photomontage.' },
    { id: 'sk-17', name: 'Figma & Adobe XD', category: 'Outils de Design', levelOrDesc: 'Conception de systèmes de design, maquettes interactives et parcours utilisateurs.' },
    { id: 'sk-18', name: 'Canva Pro', category: 'Outils de Design', levelOrDesc: 'Déclinaison rapide de supports pour réseaux sociaux et présentations visuelles.' },
    { id: 'sk-19', name: 'Visual Studio Code', category: 'Outils Web & Logiciels', levelOrDesc: 'Environnement de développement moderne avec extensions et raccourcis de productivité.' },
    { id: 'sk-20', name: 'HTML5, CSS3 & JavaScript', category: 'Outils Web & Logiciels', levelOrDesc: 'Structure sémantique accessible, stylisation responsive moderne et interactivité DOM.' },
    { id: 'sk-21', name: 'Bootstrap & Tailwind CSS', category: 'Outils Web & Logiciels', levelOrDesc: 'Intégration rapide de grilles responsives et composants UI harmonieux.' },
    { id: 'sk-22', name: 'Git, GitHub & GitHub Pages', category: 'Outils Web & Logiciels', levelOrDesc: 'Gestion de versions distribuée, publication de sites statiques et hébergement.' },
  ],
  experiences: [
    {
      id: 'exp-1',
      title: 'Maintenance des postes de travail et réseaux informatiques',
      organization: 'Lycée Technique et Professionnel de Porto-Novo',
      location: 'Porto-Novo, Bénin',
      period: '2023 - Présent',
      current: true,
      description: 'Pratique continue au sein des ateliers techniques : diagnostic de pannes, réinstallation complète de parcs et mise en œuvre de solutions réseau filaires fiables.',
      missions: [
        'Diagnostic méthodique de pannes matérielles et logicielles sur unités centrales et ordinateurs portables.',
        'Installation, configuration et sécurisation de systèmes d’exploitation Windows 10/11 et distributions Linux.',
        'Sertissage de câbles RJ45 (normes T568A/B), pose de prises murales et tests de connectivité réseau.',
        'Maintenance préventive complète : dépoussiérage, remplacement de pâte thermique et optimisation du stockage.',
      ],
      tools: ['Multimètre', 'Pince à sertir RJ45', 'Testeur réseau', 'Clés USB bootables', 'Linux Ubuntu', 'Windows'],
    },
    {
      id: 'exp-2',
      title: 'Maintenance et réparation de smartphones (GSM)',
      organization: 'Atelier de maintenance & pratique personnelle',
      location: 'Porto-Novo, Bénin',
      period: '2024 - Présent',
      current: true,
      description: 'Intervention sur des appareils mobiles de différentes générations pour diagnostiquer et réparer des défaillances courantes et complexes.',
      missions: [
        'Démontage minutieux et remplacement d’écrans tactiles, nappes de connexion et batteries.',
        'Micro-soudure et remplacement de connecteurs de charge USB-C et micro-USB endommagés.',
        'Désoxydation de cartes mères après chute dans l’eau et contrôle des tensions de charge.',
        'Conseil aux utilisateurs sur l’entretien physique et logiciel de leurs smartphones.',
      ],
      tools: ['Station à air chaud', 'Fer à souder de précision', 'Plaque chauffante', 'Mégohmmètre', 'Tournevis de précision'],
    },
    {
      id: 'exp-3',
      title: 'Création visuelle et design graphique',
      organization: 'GratiaLink / Travaux personnels et commandes',
      location: 'Porto-Novo, Bénin',
      period: '2023 - Présent',
      current: true,
      description: 'Conception d’affiches, de supports promotionnels et d’identités de marque pour des particuliers, étudiants et structures locales.',
      missions: [
        'Élaboration de chartes graphiques et conception de logos vectoriels adaptés aux besoins des clients.',
        'Création d’affiches d’événements percutantes et bannières optimisées pour les réseaux sociaux.',
        'Retouche professionnelle de photographies, correction des couleurs et détourages de haute précision.',
        'Préparation des fichiers d’exécution technique pour l’impression et la sérigraphie.',
      ],
      tools: ['Photoshop', 'Photopea', 'Canva', 'Illustrator', 'Figma'],
    },
    {
      id: 'exp-4',
      title: 'Initiation aux outils du web et à la conception d’interfaces (UI/UX)',
      organization: 'Projets personnels et d’apprentissage continu',
      location: 'Porto-Novo, Bénin',
      period: '2024 - Présent',
      current: true,
      description: 'Apprentissage et mise en pratique des technologies du web pour concevoir des interfaces attrayantes, lisibles et conformes aux standards ergonomiques.',
      missions: [
        'Création de maquettes fonctionnelles et prototypes interactifs d’applications web sous Figma.',
        'Intégration de pages web responsives avec HTML5 sémantique, CSS3 moderne et Bootstrap.',
        'Déploiement et hébergement de projets statiques en ligne via GitHub Pages.',
        'Application des principes d’ergonomie et de hiérarchie visuelle pour une meilleure expérience utilisateur.',
      ],
      tools: ['Figma', 'Visual Studio Code', 'HTML5 / CSS3', 'JavaScript', 'Bootstrap', 'GitHub Pages'],
    },
    {
      id: 'exp-5',
      title: 'Contribution à la culture libre et aux projets Wikimedia',
      organization: 'Wikimédiens du Bénin & initiatives libres',
      location: 'Bénin / En ligne',
      period: '2024 - Présent',
      current: true,
      description: 'Participation bénévole à la valorisation du patrimoine documentaire et scientifique africain sur les plateformes collaboratives ouvertes.',
      missions: [
        'Rédaction, relecture et enrichissement d’articles encyclopédiques avec vérification rigoureuse des sources.',
        'Structuration de données ouvertes sur Wikidata (création d’éléments, identifiants et propriétés liées).',
        'Promotion de la culture libre et du partage de savoirs sous licences Creative Commons (CC-BY-SA).',
        'Sensibilisation aux enjeux de la vérification de l’information à l’ère de l’intelligence artificielle.',
      ],
      tools: ['Wikipédia', 'Wikidata', 'Wikimedia Commons', 'Licences libres CC-BY-SA'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      period: '2023 - 2026 (En cours)',
      institution: 'Lycée Technique et Professionnel de Porto-Novo',
      degree: 'Baccalauréat Technique - Filière IMI',
      field: 'Installations et Maintenance en Informatique (IMI)',
      status: 'En cours',
      description: 'Cursus professionnel complet couvrant l’architecture matérielle, le diagnostic électronique, les réseaux informatiques, les systèmes d’exploitation et la maintenance préventive.',
    },
    {
      id: 'edu-2',
      period: '2023',
      institution: 'Lycée Béhanzin',
      degree: 'Brevet d’Études du Premier Cycle (BEPC)',
      field: 'Enseignement secondaire général',
      status: 'Diplôme d’État obtenu',
      description: 'Formation générale solide ayant permis de développer des bases rigoureuses en sciences, raisonnement logique et expression écrite.',
    },
  ],
  formations: [
    {
      id: 'form-1',
      title: 'Formation pratique en maintenance informatique (1 an)',
      institution: 'Centre de formation technique & ateliers pratiques',
      date: '2023 - 2024',
      duration: '1 an intensif',
      description: 'Apprentissage approfondi du démontage, du dépannage matériel, de l’installation logicielle et du câblage de réseaux informatiques.',
      hasAttestation: true,
      details: 'Architecture des ordinateurs, dépannage de parcs, câblage RJ45 et sécurité.',
    },
    {
      id: 'form-2',
      title: 'Formation pratique en maintenance de smartphones (GSM)',
      institution: 'Atelier spécialisé en micro-électronique mobile',
      date: '2024',
      duration: 'Cycle pratique spécialisé',
      description: 'Maîtrise des protocoles d’ouverture sécurisée, micro-soudure des composants SMD, changement d’écrans et désoxydation des cartes mères.',
      hasAttestation: true,
      details: 'Micro-soudure, composants SMD, remplacement de blocs d’affichage et batteries.',
    },
    {
      id: 'form-3',
      title: 'Formation en graphisme et création visuelle',
      institution: 'Ateliers de création numérique',
      date: '2023 - 2024',
      duration: 'Formation continue',
      description: 'Maîtrise des logiciels Adobe Photoshop, Photopea et Canva pour la création d’affiches événementielles, logos et chartes visuelles.',
      hasAttestation: true,
      details: 'Identité visuelle, théorie des couleurs, typographie et communication visuelle.',
    },
    {
      id: 'form-4',
      title: 'Formation en sérigraphie artisanale',
      institution: 'Atelier professionnel de sérigraphie',
      date: '2023',
      duration: 'Formation pratique qualifiante',
      description: 'Techniques manuelles d’insolation des cadres, préparation des encres et tirage sur textiles et papier. Sanctionnée par une attestation officielle.',
      hasAttestation: true,
      details: 'Attestation obtenue. Préparation des typons, insolation UV, raclage et polymérisation.',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'IA pour tous : Comprendre et utiliser une IA responsable',
      issuer: 'Google / Coursera',
      date: '2024',
      type: 'Certificat de réussite',
      domain: 'Intelligence Artificielle',
      refNumber: 'CERT-AI-RESP-2024',
      verifyUrl: 'https://coursera.org',
      description: 'Compréhension des fondements de l’IA générative, de ses limites éthiques, de la protection des données et des usages responsables.',
    },
    {
      id: 'cert-2',
      title: 'Les fondamentaux d’Internet & Architecture des réseaux',
      issuer: 'Internet Society',
      date: '2024',
      type: 'Certificat de formation',
      domain: 'Réseaux & Protocoles',
      refNumber: 'ISOC-NET-FUND-2024',
      verifyUrl: '',
      description: 'Principes fondamentaux du modèle TCP/IP, du routage mondial, de la neutralité du net et de la gouvernance ouverte.',
    },
    {
      id: 'cert-3',
      title: 'Compétences Internet pour une utilisation quotidienne et professionnelle',
      issuer: 'Cisco Networking Academy',
      date: '2024',
      type: 'Certificat de compétences',
      domain: 'Compétences Numériques',
      refNumber: 'CISCO-NET-SKILLS-2024',
      verifyUrl: '',
      description: 'Bonnes pratiques de navigation sécurisée, protection contre l’hameçonnage, gestion des identifiants et outils collaboratifs en ligne.',
    },
    {
      id: 'cert-4',
      title: 'Recherche d’information avancée & Évaluation des sources',
      issuer: 'Mozilla / Open Knowledge Community',
      date: '2024',
      type: 'Certificat de maîtrise',
      domain: 'Information & Médias',
      refNumber: '',
      verifyUrl: '',
      description: 'Techniques de recherche booléenne, vérification des faits, détection de fausses informations et utilisation de sources académiques.',
    },
    {
      id: 'cert-5',
      title: 'Principes de la neutralité et de la contribution libre',
      issuer: 'Wikimedia Community',
      date: '2024',
      type: 'Attestation de participation',
      domain: 'Culture Libre & Savoir Ouvert',
      refNumber: '',
      verifyUrl: '',
      description: 'Assimilation des 5 piliers de Wikipédia, des licences Creative Commons et des bonnes pratiques de contribution collaborative.',
    },
  ],
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
  tools: [
    { id: 'tool-1', name: 'Visual Studio Code', category: 'Éditeur & Versioning', description: 'Éditeur de code principal avec configuration d’extensions.', icon: 'Code', level: 'Maîtrisé' },
    { id: 'tool-2', name: 'HTML5', category: 'Développement Web', description: 'Structuration sémantique de pages web conformes aux standards.', icon: 'FileCode', level: 'Maîtrisé' },
    { id: 'tool-3', name: 'CSS3', category: 'Développement Web', description: 'Mise en page moderne avec Flexbox, Grid et animations fluides.', icon: 'Palette', level: 'Maîtrisé' },
    { id: 'tool-4', name: 'JavaScript', category: 'Développement Web', description: 'Dynamisme, manipulation du DOM et appels API asynchrones.', icon: 'Terminal', level: 'Pratique confirmée' },
    { id: 'tool-5', name: 'Bootstrap', category: 'Développement Web', description: 'Intégration rapide de maquettes responsives.', icon: 'Grid', level: 'Maîtrisé' },
    { id: 'tool-6', name: 'GitHub / Pages', category: 'Éditeur & Versioning', description: 'Versionnement de code et publication de sites en ligne.', icon: 'GitBranch', level: 'Maîtrisé' },
    { id: 'tool-7', name: 'Adobe Photoshop', category: 'Design & UI/UX', description: 'Retouche d’images, affiches et montages graphiques avancés.', icon: 'Image', level: 'Maîtrisé' },
    { id: 'tool-8', name: 'Photopea', category: 'Design & UI/UX', description: 'Édition graphique matricielle en ligne compatible PSD.', icon: 'Layers', level: 'Maîtrisé' },
    { id: 'tool-9', name: 'Canva Pro', category: 'Design & UI/UX', description: 'Création rapide de visuels événementiels et réseaux sociaux.', icon: 'Sparkles', level: 'Maîtrisé' },
    { id: 'tool-10', name: 'Adobe XD', category: 'Design & UI/UX', description: 'Conception de wireframes et maquettes d’interfaces.', icon: 'Layout', level: 'Pratique confirmée' },
    { id: 'tool-11', name: 'Figma', category: 'Design & UI/UX', description: 'Prototypage UI/UX interactif et design systems.', icon: 'Layout', level: 'Pratique confirmée' },
    { id: 'tool-12', name: 'Câblage RJ45 & Réseau', category: 'Maintenance & Réseau', description: 'Sertissage aux normes T568A/B et tests de connectivité.', icon: 'Cpu', level: 'Maîtrisé' },
    { id: 'tool-13', name: 'Station GSM & Micro-soudure', category: 'Maintenance & Réseau', description: 'Remplacement de connecteurs et dalles sous station à air chaud.', icon: 'Wrench', level: 'Pratique confirmée' },
    { id: 'tool-14', name: 'Multimètre digital', category: 'Maintenance & Réseau', description: 'Mesure de continuités, tensions et résistances de circuits.', icon: 'Zap', level: 'Maîtrisé' },
  ],
  wikimedia: {
    enabled: true,
    title: 'Engagement dans la Culture Libre & Wikimedia',
    badge: 'Culture Libre & Partage',
    subtitle: 'Participer activement à la diffusion du savoir universel, structurer les données ouvertes et valoriser le patrimoine documentaire africain.',
    paragraphs: [
      'L’engagement dans l’univers Wikimedia représente pour moi une passerelle essentielle entre la technique informatique et la responsabilité citoyenne du numérique. Plutôt que de rester simple consommateur passif d’Internet, contribuer permet d’agir concrètement pour la qualité de l’information accessible à tous.',
      'Cette démarche implique une rigueur méthodologique permanente : respect strict de la neutralité de point de vue, vérification scrupuleuse de sources admissibles et indépendantes, et structuration minutieuse des données pour les rendre interopérables et pérennes.',
      'C’est également une formidable opportunité de valoriser les savoirs locaux, les personnalités, les institutions et les richesses culturelles du Bénin et d’Afrique sur les plateformes les plus consultées au monde.',
    ],
    highlights: [
      { label: 'Wikipédia', desc: 'Rédaction, relecture et vérification méthodique de sources documentaires vérifiables' },
      { label: 'Wikidata', desc: 'Alimentation du graphe mondial de données ouvertes et structurées' },
      { label: 'Culture Libre', desc: 'Partage du savoir sans barrière technique ou commerciale sous licences CC-BY-SA' },
      { label: 'Valorisation', desc: 'Documentation du patrimoine matériel et immatériel régional sur le web mondial' },
    ],
    links: [
      { label: 'Portail Wikimedia', url: 'https://meta.wikimedia.org' },
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
    facebook: 'https://www.facebook.com/profile.php?id=61593525761448',
    whatsapp: 'https://wa.me/message/4ZXFCVLLZVL5C1',
    instagram: '',
    website: '',
    other: '',
    customLinks: [],
  },
};

// Simple rate limiter tracking
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

export class PlatformDb {
  private dataDir: string;
  private dbFilePath: string;
  private db: PlatformDatabase = {
    users: [],
    portfolios: [],
    sessions: [],
  };

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.dbFilePath = path.join(this.dataDir, 'platform_db.json');
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dbFilePath)) {
        const fileContent = fs.readFileSync(this.dbFilePath, 'utf-8');
        this.db = JSON.parse(fileContent);
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.error('[DB] Erreur chargement fichier DB, fallback mémoire :', err);
    }

    this.ensureAdminAccount();
  }

  private saveToFile() {
    try {
      fs.writeFileSync(this.dbFilePath, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Erreur écriture fichier DB :', err);
    }
  }

  public hashPassword(password: string, salt?: string): { hash: string; salt: string } {
    const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, chosenSalt, 100000, 64, 'sha512').toString('hex');
    return { hash, salt: chosenSalt };
  }

  public verifyPassword(password: string, hash: string, salt: string): boolean {
    try {
      const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
    } catch {
      return false;
    }
  }

  public slugify(name: string): string {
    const base = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return base || 'portfolio';
  }

  private ensureAdminAccount() {
    const adminEmail = (process.env.ADMIN_EMAIL || 'semakodeogratias02@gmail.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword2026!';
    const adminPasswordHashEnv = process.env.ADMIN_PASSWORD_HASH;

    let admin = this.db.users.find((u) => u.role === 'admin' || u.email.toLowerCase() === adminEmail);

    if (!admin) {
      let salt: string;
      let hash: string;

      if (adminPasswordHashEnv && adminPasswordHashEnv.includes(':')) {
        const parts = adminPasswordHashEnv.split(':');
        salt = parts[0];
        hash = parts[1];
      } else {
        const hashed = this.hashPassword(adminPassword);
        salt = hashed.salt;
        hash = hashed.hash;
      }

      admin = {
        id: 'usr_admin_owner_01',
        fullName: 'SEMAKO Déo-Gratias',
        email: adminEmail,
        passwordHash: hash,
        salt,
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        slug: 'semako-deo-gratias',
      };

      this.db.users.unshift(admin);
      console.log(`[DB] Compte propriétaire initialisé avec succès : ${adminEmail}`);
    } else {
      // Ensure role is admin
      admin.role = 'admin';
      admin.email = adminEmail;
    }

    // Ensure Admin has a personal portfolio record
    let adminPortfolio = this.db.portfolios.find((p) => p.userId === admin!.id);
    if (!adminPortfolio) {
      adminPortfolio = {
        id: 'port_admin_owner_01',
        userId: admin.id,
        slug: admin.slug,
        data: JSON.parse(JSON.stringify(DEFAULT_OWNER_PORTFOLIO_DATA)),
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        stats: {
          viewsCount: 1,
          cvDownloadsCount: 0,
        },
      };
      this.db.portfolios.unshift(adminPortfolio);
    } else {
      // Ensure admin portfolio data contains all sections and isn't wiped or empty
      const currData = adminPortfolio.data || {};
      const refData = DEFAULT_OWNER_PORTFOLIO_DATA;

      if (!Array.isArray(currData.skills) || currData.skills.length === 0) {
        currData.skills = JSON.parse(JSON.stringify(refData.skills));
      }
      if (!Array.isArray(currData.experiences) || currData.experiences.length === 0) {
        currData.experiences = JSON.parse(JSON.stringify(refData.experiences));
      }
      if (!Array.isArray(currData.education) || currData.education.length === 0) {
        currData.education = JSON.parse(JSON.stringify(refData.education));
      }
      if (!Array.isArray(currData.formations) || currData.formations.length === 0) {
        currData.formations = JSON.parse(JSON.stringify(refData.formations));
      }
      if (!Array.isArray(currData.certifications) || currData.certifications.length === 0) {
        currData.certifications = JSON.parse(JSON.stringify(refData.certifications));
      }
      if (!currData.projects || !Array.isArray(currData.projects.items) || currData.projects.items.length === 0) {
        currData.projects = JSON.parse(JSON.stringify(refData.projects));
      }
      if (!Array.isArray(currData.tools) || currData.tools.length === 0) {
        currData.tools = JSON.parse(JSON.stringify(refData.tools));
      }
      if (!currData.wikimedia || !Array.isArray(currData.wikimedia.paragraphs) || currData.wikimedia.paragraphs.length === 0) {
        currData.wikimedia = JSON.parse(JSON.stringify(refData.wikimedia));
      }
      if (!Array.isArray(currData.languages) || currData.languages.length === 0) {
        currData.languages = JSON.parse(JSON.stringify(refData.languages));
      }
      if (!Array.isArray(currData.interests) || currData.interests.length === 0) {
        currData.interests = JSON.parse(JSON.stringify(refData.interests));
      }
      if (!currData.availabilityNotice) {
        currData.availabilityNotice = refData.availabilityNotice;
      }
      if (!currData.links || Object.keys(currData.links).length === 0) {
        currData.links = JSON.parse(JSON.stringify(refData.links));
      }
      if (!currData.identity?.photoUrl) {
        currData.identity = { ...refData.identity, ...currData.identity, photoUrl: refData.identity.photoUrl };
      }
      adminPortfolio.data = currData;
    }

    this.saveToFile();
  }

  // Rate limiter methods (Max 5 attempts, 15 min lock)
  public checkRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
    const record = rateLimitMap.get(ip);
    if (!record) return { allowed: true };

    const now = Date.now();
    if (record.lockedUntil > now) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remainingSeconds };
    }

    // Lock expired
    if (record.lockedUntil > 0 && record.lockedUntil <= now) {
      rateLimitMap.delete(ip);
    }

    return { allowed: true };
  }

  public recordFailedAttempt(ip: string): void {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { attempts: 0, lockedUntil: 0 };
    record.attempts += 1;

    if (record.attempts >= 5) {
      record.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
    }

    rateLimitMap.set(ip, record);
  }

  public clearRateLimit(ip: string): void {
    rateLimitMap.delete(ip);
  }

  // User methods
  public getUserByEmail(email: string): DbUser | null {
    const clean = email.trim().toLowerCase();
    const exact = this.db.users.find((u) => u.email.toLowerCase() === clean);
    if (exact) return exact;

    // Support admin email variations: semakodeogratias64@gmail.com, semakodeogratias02@gmail.com, admin
    if (
      clean === 'semakodeogratias64@gmail.com' ||
      clean === 'semakodeogratias02@gmail.com' ||
      clean === 'admin' ||
      clean === 'admin@semako.com'
    ) {
      return this.db.users.find((u) => u.role === 'admin') || null;
    }

    return null;
  }

  public getUserById(id: string): DbUser | null {
    return this.db.users.find((u) => u.id === id) || null;
  }

  public getUserBySlug(slug: string): DbUser | null {
    return this.db.users.find((u) => u.slug === slug) || null;
  }

  public getAllUsers(): Array<Omit<DbUser, 'passwordHash' | 'salt'>> {
    return this.db.users.map(({ passwordHash, salt, ...rest }) => rest);
  }

  public createUser(fullName: string, email: string, password: string): { user?: DbUser; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    if (!cleanName) return { error: 'Nom complet requis' };
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { error: 'Adresse email valide requise' };
    }
    if (password.length < 8) {
      return { error: 'Le mot de passe doit comporter au moins 8 caractères' };
    }

    if (this.getUserByEmail(cleanEmail)) {
      return { error: 'Cette adresse email est déjà enregistrée.' };
    }

    let baseSlug = this.slugify(cleanName);
    let slug = baseSlug;
    let counter = 1;
    while (this.db.users.some((u) => u.slug === slug)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const { hash, salt } = this.hashPassword(password);
    const newUser: DbUser = {
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      fullName: cleanName,
      email: cleanEmail,
      passwordHash: hash,
      salt,
      role: 'user', // strictly regular user
      status: 'active',
      createdAt: new Date().toISOString(),
      slug,
    };

    this.db.users.push(newUser);

    // Create starting portfolio for new user
    const userStarterData = {
      identity: {
        name: cleanName,
        brandName: cleanName.split(' ')[0] || cleanName,
        mainTitle: '',
        photoUrl: '',
        location: '',
        email: cleanEmail,
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
      projects: { enabled: false, items: [] },
      tools: [],
      links: { github: '', linkedin: '', website: '' },
    };

    const newPortfolio: DbPortfolio = {
      id: `port_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      userId: newUser.id,
      slug,
      data: userStarterData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: { viewsCount: 0, cvDownloadsCount: 0 },
    };

    this.db.portfolios.push(newPortfolio);
    this.saveToFile();

    return { user: newUser };
  }

  public updateUserStatus(userId: string, status: 'active' | 'suspended'): boolean {
    const user = this.db.users.find((u) => u.id === userId);
    if (!user) return false;
    if (user.role === 'admin') return false; // Cannot suspend platform owner
    user.status = status;
    this.saveToFile();
    return true;
  }

  public deleteUser(userId: string): boolean {
    const userIdx = this.db.users.findIndex((u) => u.id === userId);
    if (userIdx === -1) return false;
    if (this.db.users[userIdx].role === 'admin') return false; // Cannot delete admin

    this.db.users.splice(userIdx, 1);
    this.db.portfolios = this.db.portfolios.filter((p) => p.userId !== userId);
    this.db.sessions = this.db.sessions.filter((s) => s.userId !== userId);
    this.saveToFile();
    return true;
  }

  // Session methods
  public createSession(userId: string, role: 'user' | 'admin', hours: number = 24): DbSession {
    // Purge expired sessions
    const now = Date.now();
    this.db.sessions = this.db.sessions.filter((s) => s.expiresAt > now);

    const token = `sess_${crypto.randomBytes(32).toString('hex')}`;
    const session: DbSession = {
      token,
      userId,
      role,
      createdAt: now,
      expiresAt: now + hours * 60 * 60 * 1000,
    };

    this.db.sessions.push(session);
    this.saveToFile();
    return session;
  }

  public getSession(token: string): DbSession | null {
    if (!token) return null;
    const session = this.db.sessions.find((s) => s.token === token);
    if (!session) return null;

    if (session.expiresAt <= Date.now()) {
      this.deleteSession(token);
      return null;
    }
    return session;
  }

  public deleteSession(token: string): void {
    this.db.sessions = this.db.sessions.filter((s) => s.token !== token);
    this.saveToFile();
  }

  // Portfolio methods
  public getPortfolioByUserId(userId: string): DbPortfolio | null {
    return this.db.portfolios.find((p) => p.userId === userId) || null;
  }

  public getPortfolioById(id: string): DbPortfolio | null {
    return this.db.portfolios.find((p) => p.id === id) || null;
  }

  public getPortfolioBySlug(slug: string): DbPortfolio | null {
    return this.db.portfolios.find((p) => p.slug === slug) || null;
  }

  public getOwnerPortfolio(): DbPortfolio | null {
    const admin = this.db.users.find((u) => u.role === 'admin');
    if (!admin) return null;
    return this.getPortfolioByUserId(admin.id);
  }

  public saveUserPortfolio(
    userId: string,
    data: any,
    status?: 'draft' | 'published'
  ): DbPortfolio {
    let portfolio = this.db.portfolios.find((p) => p.userId === userId);
    const user = this.getUserById(userId);
    const slug = user?.slug || 'portfolio';
    const now = new Date().toISOString();

    if (portfolio) {
      portfolio.data = data;
      portfolio.updatedAt = now;
      if (status) {
        portfolio.status = status;
        if (status === 'published' && !portfolio.publishedAt) {
          portfolio.publishedAt = now;
        }
      }
    } else {
      portfolio = {
        id: `port_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        userId,
        slug,
        data,
        status: status || 'draft',
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : undefined,
        stats: { viewsCount: 0, cvDownloadsCount: 0 },
      };
      this.db.portfolios.push(portfolio);
    }

    this.saveToFile();
    return portfolio;
  }

  public adminUpdatePortfolio(
    portfolioId: string,
    updates: { data?: any; status?: 'draft' | 'published'; slug?: string }
  ): DbPortfolio | null {
    const portfolio = this.db.portfolios.find((p) => p.id === portfolioId);
    if (!portfolio) return null;

    const now = new Date().toISOString();
    if (updates.data) portfolio.data = updates.data;
    if (updates.status) {
      portfolio.status = updates.status;
      if (updates.status === 'published' && !portfolio.publishedAt) {
        portfolio.publishedAt = now;
      }
    }
    if (updates.slug) portfolio.slug = updates.slug;
    portfolio.updatedAt = now;

    this.saveToFile();
    return portfolio;
  }

  public deletePortfolio(portfolioId: string): boolean {
    const idx = this.db.portfolios.findIndex((p) => p.id === portfolioId);
    if (idx === -1) return false;

    // Check if it belongs to admin
    const portfolio = this.db.portfolios[idx];
    const user = this.getUserById(portfolio.userId);
    if (user?.role === 'admin') return false; // Admin's personal portfolio cannot be deleted

    this.db.portfolios.splice(idx, 1);
    this.saveToFile();
    return true;
  }

  public incrementViews(portfolioId: string): void {
    const portfolio = this.db.portfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      portfolio.stats.viewsCount += 1;
      this.saveToFile();
    }
  }

  public incrementCvDownloads(portfolioId: string): void {
    const portfolio = this.db.portfolios.find((p) => p.id === portfolioId);
    if (portfolio) {
      portfolio.stats.cvDownloadsCount += 1;
      this.saveToFile();
    }
  }

  public getAllPortfolios(): DbPortfolio[] {
    return this.db.portfolios;
  }

  public getPlatformStats() {
    const totalUsers = this.db.users.filter((u) => u.role !== 'admin').length;
    const totalPortfolios = this.db.portfolios.length;
    const publishedPortfolios = this.db.portfolios.filter((p) => p.status === 'published').length;
    const draftPortfolios = this.db.portfolios.filter((p) => p.status === 'draft').length;
    const totalViews = this.db.portfolios.reduce((acc, p) => acc + (p.stats?.viewsCount || 0), 0);
    const activeSessions = this.db.sessions.filter((s) => s.expiresAt > Date.now()).length;

    return {
      totalUsers,
      totalPortfolios,
      publishedPortfolios,
      draftPortfolios,
      totalViews,
      activeSessions,
      uptime: process.uptime(),
    };
  }
}

export const platformDb = new PlatformDb();
