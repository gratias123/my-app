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

export const PERSONAL_INFO_EN = {
  name: 'SEMAKO Déo-Gratias',
  brandName: 'GratiaLink',
  mainTitle: 'IT TECHNICIAN & UI/UX DESIGNER',
  fullTitle: 'IT Technician & UI/UX Designer',
  tagline: 'Equipment maintenance, digital solutions and visual creation',
  subHeadline:
    'IT technician and graphic designer, specialized in hardware maintenance, digital technology, and visual design.',
  heroSummary:
    'My journey bridges computer technology, hardware maintenance, graphic design, and exploring digital tools. I cultivate my skills through hands-on practice, training, and continuous learning.',
  location: 'Porto-Novo, Benin',
  email: 'semakodeogratias@gmail.com',
  phone: '+229 0164690682',
  phoneFormatted: '+229 01 64 69 06 82',
  availableFor: 'Technical maintenance, visual designs & professional opportunities',
  photoUrl: profilePhoto,
  facebookUrl: 'https://www.facebook.com/profile.php?id=61593525761448',
  whatsappUrl: 'https://wa.me/message/4ZXFCVLLZVL5C1',
};

export const ABOUT_DATA_EN = {
  title: 'About Me',
  presentation: [
    'SEMAKO Déo-Gratias began his secondary education at Lycée Béhanzin, where he earned his BEPC diploma in 2023.',
    'Following this degree, he continued his studies at Lycée Technique et Professionnel de Porto-Novo in a 3-year vocational program in Computer Installation and Maintenance (IMI).',
    'His professional profile is built around two complementary pillars: applied computer hardware maintenance and graphic design for visual communication.',
    'His journey also includes practical training in smartphone repair (GSM), web tools, advanced internet utilization, user interface design (UI/UX), and understanding responsible artificial intelligence.',
  ],
  axes: [
    {
      title: 'IT & Hardware Maintenance',
      description:
        'Hardware diagnostics, computer workstation repair, RJ45 network cabling, and IT infrastructure maintenance.',
    },
    {
      title: 'Graphic Design & Visual Creation',
      description:
        'Designing posters, communication materials, image editing, and ergonomic UI prototyping.',
    },
  ],
};

export const ACADEMIC_CURRICULUM_EN: AcademicCurriculumItem[] = [
  {
    id: 'cursus-behanzin',
    institution: 'Lycée Béhanzin',
    degreeOrField: 'Secondary School Curriculum',
    durationOrYear: '2023',
    status: 'Diploma earned: BEPC',
    description:
      'General secondary education successfully completed with the Junior High School Certificate (BEPC) in 2023.',
  },
  {
    id: 'cursus-ltp-portonovo',
    institution: 'Lycée Technique et Professionnel de Porto-Novo — Benin',
    degreeOrField: 'Computer Installation and Maintenance (IMI)',
    fieldDetails: 'IMI Department',
    durationOrYear: '3 years',
    status: 'Vocational Training in Progress',
    description:
      'Professional vocational training at Lycée Technique et Professionnel de Porto-Novo, specializing in computer maintenance, fault diagnostics, networking, and system configuration.',
  },
];

export const ADDITIONAL_TRAINING_EN: AdditionalTrainingItem[] = [
  {
    id: 'formation-info-1an',
    title: '1-Year Computer Science Training',
    duration: '1 year',
    description:
      'Learning computer fundamentals, office productivity suites, and operating system environments.',
    validationStatus: 'Course Completed',
  },
  {
    id: 'formation-maintenance-gsm',
    title: 'GSM Smartphone Maintenance Training',
    description:
      'Hands-on diagnostic, hardware and software repair of mobile phones and smartphones.',
    validationStatus: 'Course Completed',
  },
  {
    id: 'formation-graphisme',
    title: 'Graphic Design Training',
    description:
      'Learning visual composition, color theory, layout hierarchy, and media asset creation.',
    validationStatus: 'Course Completed',
  },
  {
    id: 'formation-serigraphie',
    title: 'Screen Printing Training',
    description: 'Practical screen printing workshop on diverse media.',
    validationStatus: 'Certificate Earned',
  },
];

export const EDUCATION_LIST_EN: EducationItem[] = [
  {
    id: 'edu-ltp-portonovo',
    title: 'Computer Installation and Maintenance (IMI)',
    institution: 'Lycée Technique et Professionnel de Porto-Novo — Benin',
    duration: '3 years',
    status: 'en-cours',
    isMain: true,
    description:
      'Professional vocational training at Lycée Technique et Professionnel de Porto-Novo, specializing in computer maintenance, fault diagnostics, networking, and system configuration.',
    keyLearnings: [
      'Hardware diagnostics and workstation troubleshooting',
      'Operating systems installation and configuration',
      'RJ45 cabling and network cable crimping',
      'Preventive maintenance and IT asset upkeep',
    ],
  },
  {
    id: 'edu-behanzin',
    title: 'Junior High School Certificate (BEPC)',
    institution: 'Lycée Béhanzin',
    duration: '2023',
    status: 'complete',
    isMain: false,
    description:
      'General secondary education successfully completed with the Junior High School Certificate (BEPC) in 2023, prior to technical specialization.',
    keyLearnings: [
      'General education and scientific reasoning',
      'Study methodology and written expression',
      'Academic foundation preparatory to technical schooling',
    ],
  },
  {
    id: 'edu-info-1an',
    title: '1-Year Computer Science Training',
    institution: 'Hands-on Training',
    duration: '1 year',
    status: 'complete',
    isMain: false,
    description:
      'Learning computer fundamentals, office productivity suites, and operating system environments.',
    keyLearnings: [
      'In-depth system navigation and file management',
      'Office tools and spreadsheet data processing',
      'Best computing practices and hygiene',
    ],
  },
  {
    id: 'edu-gsm',
    title: 'GSM Smartphone Maintenance Training',
    institution: 'Specialized Practical Workshop',
    duration: 'Hands-on Course',
    status: 'complete',
    isMain: false,
    description:
      'Hands-on diagnostic, hardware and software repair of mobile phones and smartphones.',
    keyLearnings: [
      'Safe disassembly and physical fault analysis',
      'Replacing screens, batteries, and charging ports',
      'Cleaning and deoxidation of electronic circuits',
    ],
  },
  {
    id: 'edu-graphisme',
    title: 'Graphic Design Training',
    institution: 'Visual Design Workshop',
    duration: 'Hands-on Course',
    status: 'complete',
    isMain: false,
    description:
      'Learning visual composition, color theory, layout hierarchy, and media asset creation.',
    keyLearnings: [
      'Designing posters, flyers, and digital marketing banners',
      'Layout structuring, typographic contrast, and readability',
      'Image editing and retouching in Photoshop, Photopea, and Canva',
    ],
  },
  {
    id: 'edu-serigraphie',
    title: 'Screen Printing Training',
    institution: 'Screen Printing Practical Workshop',
    duration: 'Certificate Earned',
    status: 'complete',
    isMain: false,
    description:
      'Hands-on screen printing workshop with certificate awarded, providing complementary visual production skills.',
    keyLearnings: [
      'Screen printing and stenciling techniques',
      'Visual preparation and inking on various substrates',
      'Official practical training certificate earned',
    ],
  },
];

export const SKILL_CATEGORIES_EN: SkillCategory[] = [
  {
    id: 'info-maintenance',
    title: 'IT & MAINTENANCE',
    iconName: 'Wrench',
    description: 'Hardware diagnostics, workstation repairs, and operational maintenance of computer networks.',
    skills: [
      'Computer installation and maintenance',
      'Hardware diagnostics & troubleshooting',
      'IT equipment maintenance',
      'Basic workstation administration',
      'Software installation & setup',
      'Computer networking',
      'RJ45 cabling',
      'Network cable crimping',
    ],
  },
  {
    id: 'maintenance-gsm',
    title: 'GSM SMARTPHONE REPAIR',
    iconName: 'Smartphone',
    description: 'Technical troubleshooting and repairs on mobile phones and portable devices.',
    skills: [
      'Fault diagnosis & inspection',
      'Mobile phone maintenance',
      'Hardware repairs on mobile devices',
    ],
  },
  {
    id: 'design-graphique',
    title: 'GRAPHIC DESIGN',
    iconName: 'Palette',
    description: 'Visual creation, communication media composition, and image editing.',
    skills: [
      'Graphic design & art direction',
      'Visual marketing assets',
      'Layout & typesetting',
      'Visual communication',
      'Image retouching & clipping',
      'Screen printing',
    ],
  },
  {
    id: 'outils-design',
    title: 'DESIGN TOOLS',
    iconName: 'Layers',
    description: 'Software and digital tools utilized for visual composition and prototyping.',
    skills: ['Photoshop', 'Photopea', 'Canva', 'Adobe XD', 'Figma'],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX DESIGN',
    iconName: 'Layout',
    description: 'Designing user-centered digital experiences with focus on interface clarity.',
    skills: [
      'Interface design',
      'Wireframing',
      'Prototyping',
      'Visual layout hierarchy',
      'Ergonomics & usability principles',
    ],
  },
  {
    id: 'web-outils-numeriques',
    title: 'WEB & DIGITAL TOOLS',
    iconName: 'Globe',
    description: 'Front-end development technologies and digital productivity tools.',
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

export const PRACTICAL_EXPERIENCES_EN: PracticalExperience[] = [
  {
    id: 'exp-maintenance-info',
    title: 'COMPUTER MAINTENANCE EXPERIENCE',
    category: 'IT & Systems',
    badge: 'Workshop & Equipment',
    description:
      'Regular practice in diagnostics, servicing, and maintenance of computer systems.',
    activities: [
      'Dust removal and physical overhaul of CPU towers and cooling ventilation systems.',
      'Methodical diagnostics of power-up, display, and thermal overheating issues.',
      'Replacement and verification of hardware components: RAM, storage drives, power supplies.',
      'Clean installation and configuration of operating systems and utility software.',
      'Assembly and testing of RJ45 network cabling (straight-through and crossover crimping).',
    ],
    tools: ['Precision Screwdrivers', 'RJ45 Crimping Tool', 'Cable Tester', 'Bootable OS Drives'],
  },
  {
    id: 'exp-maintenance-gsm',
    title: 'GSM SMARTPHONE REPAIR EXPERIENCE',
    category: 'Mobile Devices',
    badge: 'Mobile Hardware',
    description:
      'Diagnostic practice and technical servicing of smartphones and mobile devices.',
    activities: [
      'Analysis of hardware malfunctions (charging faults, black screens, unresponsive touchscreens).',
      'Safe and orderly disassembly of casings, flex cables, and internal components.',
      'Replacement of broken screens, defective batteries, and USB-C / micro-USB charging ports.',
      'Careful cleaning and deoxidation of motherboard circuits.',
    ],
    tools: ['Opening Spudgers', 'Hot Air Gun', 'Digital Multimeter', 'Anti-static Brushes'],
  },
  {
    id: 'exp-graphisme',
    title: 'GRAPHIC DESIGN EXPERIENCE',
    category: 'Visual Creation',
    badge: 'Visual Media',
    description:
      'Creation of visual designs, graphic assets, and digital media tailored for communication needs.',
    activities: [
      'Creation of event posters, informational flyers, and social media promotional banners.',
      'Balanced layouts respecting typographic hierarchy, contrast, and visual rhythm.',
      'Clipping, color grading, and digital photo editing.',
      'Visual mockups prepared and optimized for both physical print and digital web formats.',
    ],
    tools: ['Photoshop', 'Photopea', 'Canva'],
  },
  {
    id: 'exp-uiux',
    title: 'UI/UX DESIGN EXPERIENCE',
    category: 'Interface Design',
    badge: 'Ergonomics & Mockups',
    description:
      'Prototyping and designing clean, intuitive, and user-friendly digital interfaces.',
    activities: [
      'Screen structure planning and wireframe drafting to organize information logically.',
      'Building interactive prototypes for web pages and mobile applications.',
      'Applying usability principles to streamline navigation across smartphones and desktops.',
      'Selecting high-contrast, accessible color palettes and consistent navigation elements.',
    ],
    tools: ['Figma', 'Adobe XD'],
  },
  {
    id: 'exp-wikimedia',
    title: 'DIGITAL CONTRIBUTIONS / WIKIMEDIA',
    category: 'Open Knowledge',
    badge: 'Knowledge Sharing',
    description:
      'Active engagement within the Wikimedia ecosystem to document, verify, and share free knowledge.',
    activities: [
      'Contributing to drafting and proofreading encyclopedic articles on Wikipedia.',
      'Rigorous research and fact-checking of reliable documentary sources.',
      'Structuring and updating open linked data entries on Wikidata.',
      'Promoting open knowledge sharing and highlighting verified cultural information.',
    ],
    tools: ['Wikipedia', 'Wikidata', 'Documentary Archives'],
  },
];

export const CERTIFICATIONS_LIST_EN: CertificationItem[] = [
  {
    id: 'cert-1',
    title: 'AI for Everyone',
    issuedDate: 'August 5, 2026',
    status: 'Certificate of Completion',
    domain: 'Artificial Intelligence',
    description:
      'Understanding foundational artificial intelligence principles, core mechanics, and concrete real-world applications.',
  },
  {
    id: 'cert-2',
    title: 'Responsible AI',
    issuedDate: 'August 5, 2026',
    status: 'Certificate of Completion',
    domain: 'Ethics & Digital Society',
    description:
      'Awareness of ethical AI guidelines: algorithmic fairness, transparency, privacy protection, and accountable usage.',
  },
  {
    id: 'cert-3',
    title: 'Internet Fundamentals',
    issuedDate: 'August 5, 2026',
    status: 'Certificate of Completion',
    domain: 'Networking & Protocols',
    description:
      'Knowledge of core Internet architecture, data packet routing, and fundamental network topology.',
  },
  {
    id: 'cert-4',
    title: 'Everyday Internet Skills',
    issuedDate: 'August 5, 2026',
    status: 'Certificate of Completion',
    domain: 'Daily Digital Literacy',
    description:
      'Mastery of essential everyday online practices: secure web browsing, cloud tools, and privacy hygiene.',
  },
  {
    id: 'cert-5',
    title: 'Searching the Web and Beyond',
    issuedDate: 'August 5, 2026',
    status: 'Certificate of Completion',
    domain: 'Information Retrieval & Fact-Checking',
    description:
      'Effective documentary research methods, online source validation, and critical assessment of web information.',
  },
];

export const DIGITAL_TOOLS_EN: DigitalTool[] = [
  {
    name: 'HTML',
    category: 'Web Development',
    icon: 'FileCode',
    description: 'Semantic structuring and accessible markup for modern web pages.',
  },
  {
    name: 'CSS',
    category: 'Web Development',
    icon: 'Palette',
    description: 'Visual styling, layout positioning, and responsive design.',
  },
  {
    name: 'JavaScript',
    category: 'Web Development',
    icon: 'Terminal',
    description: 'Client-side interactivity, logic, and dynamic event handling.',
  },
  {
    name: 'Bootstrap',
    category: 'Web Development',
    icon: 'Grid',
    description: 'CSS framework for rapid, orderly, and responsive UI layouts.',
  },
  {
    name: 'Visual Studio Code',
    category: 'Editor & Versioning',
    icon: 'Code',
    description: 'Versatile code editor enriched with web development extensions.',
  },
  {
    name: 'GitHub',
    category: 'Editor & Versioning',
    icon: 'GitBranch',
    description: 'Code repository hosting and distributed project version control.',
  },
  {
    name: 'GitHub Pages',
    category: 'Editor & Versioning',
    icon: 'Globe',
    description: 'Web hosting and online deployment for static websites.',
  },
  {
    name: 'Photoshop',
    category: 'Design & UI/UX',
    icon: 'Image',
    description: 'Pixel-level photo editing, precision clipping, and raster composition.',
  },
  {
    name: 'Photopea',
    category: 'Design & UI/UX',
    icon: 'Layers',
    description: 'Convenient browser-based graphic editing accessible on any workstation.',
  },
  {
    name: 'Canva',
    category: 'Design & UI/UX',
    icon: 'Sparkles',
    description: 'Fast design of marketing assets and multi-format communication templates.',
  },
  {
    name: 'Adobe XD',
    category: 'Design & UI/UX',
    icon: 'Layout',
    description: 'Wireframing and interactive prototyping for desktop and mobile apps.',
  },
  {
    name: 'Figma',
    category: 'Design & UI/UX',
    icon: 'Figma',
    description: 'Collaborative UI design, vector design systems, and digital mockups.',
  },
];
