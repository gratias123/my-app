import React from 'react';
import {
  User,
  Wrench,
  Palette,
  Smartphone,
  Cpu,
  Server,
  CheckCircle2,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';
import { ABOUT_DATA } from '../data/portfolioData';
import { ABOUT_DATA_EN } from '../data/portfolioDataEn';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';
import { getToolName, formatToolsList } from '../utils/toolUtils';

// Helper to filter out any internal technical messages
const isInternalTechnicalMessage = (text?: string): boolean => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return (
    lower.includes('dynamiquement depuis') ||
    lower.includes('administration privée') ||
    lower.includes('mise à jour dynamiquement') ||
    lower.includes('base de données') ||
    lower.includes('synchronisation')
  );
};

// Pick an appropriate icon based on the domain / category name
const getDomainIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('gsm') || lower.includes('smartphone') || lower.includes('mobile')) {
    return <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (lower.includes('design') || lower.includes('graphique') || lower.includes('ui') || lower.includes('ux')) {
    return <Palette className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (lower.includes('réseau') || lower.includes('système') || lower.includes('installation') || lower.includes('linux')) {
    return <Server className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (lower.includes('électronique') || lower.includes('composant') || lower.includes('matériel')) {
    return <Cpu className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (lower.includes('web') || lower.includes('code') || lower.includes('logiciel')) {
    return <Terminal className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  return <Wrench className="w-4 h-4 text-blue-600 shrink-0" />;
};

interface DomainSection {
  title: string;
  items: string[];
}

export const About: React.FC = () => {
  const { data, isCustom } = usePortfolio();
  const { isEn, t } = useLanguage();

  // 1. Resolve professional presentation paragraphs (free of internal technical notes)
  const rawPresentation = data.about?.presentation;
  const hasValidCustomPresentation =
    isCustom &&
    typeof rawPresentation === 'string' &&
    rawPresentation.trim().length > 0 &&
    !isInternalTechnicalMessage(rawPresentation);

  const presentationParagraphs: string[] = hasValidCustomPresentation
    ? rawPresentation
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0 && !isInternalTechnicalMessage(p))
    : isEn
    ? ABOUT_DATA_EN.presentation
    : ABOUT_DATA.presentation;

  // 2. Resolve professional strengths / highlights
  const rawHighlights = data.about?.highlights;
  const highlights: string[] =
    Array.isArray(rawHighlights) && rawHighlights.length > 0
      ? rawHighlights.filter((h) => typeof h === 'string' && h.trim().length > 0)
      : isEn
      ? [
          'Methodical diagnostic and maintenance of computer systems and client workstations',
          'Graphic design, brand identity creation, and ergonomic UI/UX prototyping',
          'Hardware smartphone repairs (GSM) & micro-soldering with precision equipment',
          'Active engagement in digital knowledge sharing and open-source ecosystems',
        ]
      : [
          'Diagnostic méthodique et maintenance des parcs informatiques et postes de travail',
          'Design graphique, identités de marques et prototypage ergonomique d’interfaces (UI/UX)',
          'Maintenance matérielle des smartphones (GSM) & micro-soudure avec outillage adapté',
          'Engagement actif dans le partage de connaissances et les communs numériques',
        ];

  // 3. Resolve Domains / Pillars of Intervention (from real administration skills)
  const domains: DomainSection[] = React.useMemo(() => {
    if (isCustom && data.skills && data.skills.length > 0) {
      // Group skills by category
      const categoryMap = new Map<string, string[]>();

      data.skills.forEach((skill) => {
        const cat = (skill.category || (isEn ? 'General Competencies' : 'Compétences Générales')).trim();
        // Skip purely tool categories if we already have substantive domain categories
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, []);
        }
        const desc = skill.levelOrDesc ? `${skill.name} — ${skill.levelOrDesc}` : skill.name;
        categoryMap.get(cat)!.push(desc || skill.name);
      });

      // Filter out pure software lists if main technical domains exist
      const domainEntries = Array.from(categoryMap.entries()).filter(([cat]) => {
        const lower = cat.toLowerCase();
        return !lower.startsWith('outils de') && !lower.startsWith('outils web');
      });

      // If we filtered too much, fallback to all entries
      const finalEntries = domainEntries.length > 0 ? domainEntries : Array.from(categoryMap.entries());

      return finalEntries.slice(0, 3).map(([title, items]) => ({
        title,
        items: items.slice(0, 3),
      }));
    }

    // Default authentic domain pillars
    return isEn
      ? [
          {
            title: 'IT & Hardware Maintenance',
            items: [
              'Hardware & software troubleshooting on desktop and laptop computers',
              'Preventive maintenance, part replacement, and system cleaning',
              'Structured RJ45 network cabling and connectivity testing',
            ],
          },
          {
            title: 'System Installation & Configuration',
            items: [
              'Installation, partitioning, and hardening of Windows & Linux operating systems',
              'Driver deployment, BIOS/UEFI configuration, and software optimization',
            ],
          },
          {
            title: 'Graphic Design & UI/UX Prototyping',
            items: [
              'Creation of posters, promotional materials, and brand identity design',
              'Image editing, photo retouching, and vector compositions',
              'Ergonomic user interface prototyping and wireframing with Figma',
            ],
          },
        ]
      : [
          {
            title: 'Informatique & Maintenance',
            items: [
              'Diagnostic matériel et logiciel sur ordinateurs de bureau et portables',
              'Maintenance préventive, remplacement de composants et dépannage approfondi',
              'Réalisation de câblages réseau RJ45 et vérification de connectivité',
            ],
          },
          {
            title: 'Installation & Configuration',
            items: [
              'Installation et configuration des systèmes d’exploitation Windows & Linux',
              'Gestion des partitions, paramétrage BIOS/UEFI et sécurisation des postes',
            ],
          },
          {
            title: 'Design graphique & UI/UX',
            items: [
              'Conception d’affiches, chartes graphiques et supports de communication',
              'Retouche avancée, détourage photo et composition visuelle',
              'Prototypage d’interfaces ergonomiques et maquettes interactives (Figma)',
            ],
          },
        ];
  }, [isCustom, data.skills, isEn]);

  // 4. Safely extract key tools names (guaranteed never [object Object])
  const cleanTools = React.useMemo(() => {
    if (!data.tools || !Array.isArray(data.tools)) return [];
    return data.tools
      .map(getToolName)
      .filter((name): name is string => Boolean(name && name.length > 0));
  }, [data.tools]);

  return (
    <section
      id="a-propos"
      className="py-12 sm:py-16 bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================================== */}
          {/* COLONNE GAUCHE : PRÉSENTATION PROFESSIONNELLE (40 - 45 %)  */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <ScrollReveal animation="fade-left">
              {/* Badge & Titre de section */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100/80 mb-2">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isEn ? 'PRESENTATION' : 'PRÉSENTATION'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
                  {t('about.title')}
                </h2>
                {data.about?.tagline && (
                  <p className="text-xs sm:text-sm font-semibold text-blue-900/90 mt-1 leading-snug">
                    {data.about.tagline}
                  </p>
                )}
              </div>

              {/* Paragraphes de présentation éditoriale */}
              <div className="space-y-3.5 text-slate-700 text-xs sm:text-sm leading-relaxed text-justify sm:text-left">
                {presentationParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Séparateur élégant */}
              <div className="my-5 border-t border-slate-200/80" />

              {/* Points forts / Approche professionnelle */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {isEn ? 'Key Strengths & Approach' : 'Points forts & approche professionnelle'}
                  </span>
                </h3>
                <ul className="space-y-2">
                  {highlights.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* ========================================================== */}
          {/* COLONNE DROITE : PILIERS & DOMAINES D'INTERVENTION (55-60%) */}
          {/* ========================================================== */}
          <div className="lg:col-span-7">
            <ScrollReveal animation="fade-right" delay={150}>
              <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
                
                {/* En-tête de la colonne Piliers */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4 mb-4 border-b border-slate-200/80">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                      {isEn ? 'CORE PILLARS' : 'PILIERS D’INTERVENTION'}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                      {isCustom ? t('about.customPillarsTitle') : t('about.pillarsTitle')}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isEn
                      ? 'Structured fields of expertise'
                      : 'Aptitudes et savoir-faire vérifiés'}
                  </p>
                </div>

                {/* Liste des domaines d'intervention */}
                <div className="space-y-3.5">
                  {domains.map((domain, dIdx) => (
                    <div
                      key={dIdx}
                      className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 hover:border-blue-200 hover:shadow-2xs transition-all"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                          {getDomainIcon(domain.title)}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                          {domain.title}
                        </h4>
                      </div>

                      <ul className="space-y-1.5 pl-9">
                        {domain.items.map((item, iIdx) => (
                          <li
                            key={iIdx}
                            className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Synthèse des outils principaux (garantie sans bug [object Object]) */}
                {cleanTools.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-700 mr-1">
                      {isEn ? 'Key tools:' : 'Outils principaux :'}
                    </span>
                    {cleanTools.slice(0, 7).map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
