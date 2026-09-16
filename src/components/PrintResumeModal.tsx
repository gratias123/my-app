import React, { useEffect, useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import {
  ArrowLeft,
  Printer,
  Download,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { CustomPortfolioData } from '../types/portfolioBuilder';
import { SEMAKO_MODEL_DATA } from '../utils/portfolioModelAdapter';

interface PrintResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  customData?: CustomPortfolioData;
  data?: CustomPortfolioData;
}

// Generates sanitized file name: CV-[Nom-complet].pdf
const getPdfFileName = (fullName: string): string => {
  if (!fullName || fullName.trim() === '') return 'CV-Professionnel.pdf';
  const clean = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents (e.g. é -> e)
    .replace(/[^a-zA-Z0-9\s-_]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-');
  return `CV-${clean}.pdf`;
};

// Compute initials for placeholder if no photo
const getInitials = (name: string): string => {
  if (!name) return 'CV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper validators for dynamic presence of data
const isNonEmptyString = (val?: string | null): boolean => {
  return typeof val === 'string' && val.trim().length > 0;
};

const isNonEmptyArray = <T,>(arr?: T[] | null): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

// Supported resume section keys
export type ResumeSectionKey =
  | 'header'
  | 'profile'
  | 'skills'
  | 'experiences'
  | 'education'
  | 'formations'
  | 'certifications'
  | 'projects'
  | 'tools'
  | 'contributions'
  | 'languages'
  | 'interests'
  | 'references';

// Atomic block identifier for the dynamic pagination engine
export interface ResumeBlock {
  id: string;
  sectionKey: ResumeSectionKey;
  isFirstInSection: boolean;
  itemIndex?: number;
}

// Interface for each mapped resume section
export interface MappedResumeSection {
  key: ResumeSectionKey;
  title: string;
  hasData: boolean;
  blocks: ResumeBlock[];
  estimateHeight: (block: ResumeBlock) => number;
  renderBlock: (block: ResumeBlock, pageIndex: number) => React.ReactNode;
}

// ---------------------------------------------------------------------------------
// DATA MAPPING UTILITY: Iterates over customData and constructs valid sections only
// Guarantees empty sections are not created or rendered.
// ---------------------------------------------------------------------------------
export const mapCustomDataToResumeSections = (
  portfolio: CustomPortfolioData
): MappedResumeSection[] => {
  const name = portfolio.identity?.name || 'Nom & Prénom';
  const mainTitle = portfolio.identity?.mainTitle || 'Titre Professionnel';
  const location = portfolio.identity?.location || '';
  const phone = portfolio.identity?.phone || '';
  const email = portfolio.identity?.email || '';
  const photoUrl = portfolio.identity?.photoUrl || '';
  const initials = getInitials(name);
  const links = portfolio.links || {};

  const aboutText = portfolio.about?.presentation || portfolio.about?.heroSummary || '';

  // Filter skills to ensure non-empty names
  const validSkills = (portfolio.skills || []).filter((s) => isNonEmptyString(s.name));

  // Group skills by category
  const groupedSkills: Record<string, typeof validSkills> = {};
  validSkills.forEach((s) => {
    const cat = s.category && s.category.trim() !== '' ? s.category.trim() : 'Général';
    if (!groupedSkills[cat]) groupedSkills[cat] = [];
    groupedSkills[cat].push(s);
  });
  const skillCategoryKeys = Object.keys(groupedSkills);

  // Filter and split experiences
  const rawExperiences = portfolio.experiences || [];
  const validExperiences = rawExperiences.filter(
    (e) => isNonEmptyString(e.title) || isNonEmptyString(e.organization)
  );

  const contributionExps = validExperiences.filter(
    (exp) =>
      exp.title.toUpperCase().includes('WIKIMEDIA') ||
      exp.title.toUpperCase().includes('CONTRIBUTION') ||
      exp.title.toUpperCase().includes('ENGAGEMENT') ||
      exp.organization.toUpperCase().includes('WIKIMEDIA')
  );

  const practicalExps = validExperiences.filter(
    (exp) =>
      !exp.title.toUpperCase().includes('WIKIMEDIA') &&
      !exp.title.toUpperCase().includes('CONTRIBUTION') &&
      !exp.title.toUpperCase().includes('ENGAGEMENT') &&
      !exp.organization.toUpperCase().includes('WIKIMEDIA')
  );

  const customActivities = (portfolio.activities || []).filter((a) =>
    isNonEmptyString(a.title)
  );

  const validEducation = (portfolio.education || []).filter(
    (edu) => isNonEmptyString(edu.degree) || isNonEmptyString(edu.institution)
  );

  const validFormations = (portfolio.formations || []).filter((f) =>
    isNonEmptyString(f.title)
  );

  const validCertifications = (portfolio.certifications || []).filter((c) =>
    isNonEmptyString(c.title)
  );

  const validProjects =
    portfolio.projects?.enabled && Array.isArray(portfolio.projects?.items)
      ? portfolio.projects.items.filter((p) => isNonEmptyString(p.name))
      : [];

  const validTools = (portfolio.tools || []).filter(isNonEmptyString);

  const validLanguages = (portfolio.languages || []).filter((l) =>
    isNonEmptyString(l.name)
  );

  const validInterests = (portfolio.interests || []).filter(isNonEmptyString);

  const validReferences = (portfolio.references || []).filter((r) =>
    isNonEmptyString(r.name)
  );

  // Define section schema definitions with strict presence checks
  const sectionDefinitions: Array<{
    key: ResumeSectionKey;
    title: string;
    checkData: () => boolean;
    buildBlocks: () => ResumeBlock[];
    estimateHeight: (block: ResumeBlock) => number;
    render: (block: ResumeBlock, pageIndex: number) => React.ReactNode;
  }> = [
    // 1. Header / Identity (Always present if identity exists)
    {
      key: 'header',
      title: 'En-tête & Coordonnées',
      checkData: () => isNonEmptyString(name) || isNonEmptyString(email) || isNonEmptyString(phone),
      buildBlocks: () => [{ id: 'block-header', sectionKey: 'header', isFirstInSection: true }],
      estimateHeight: () => 175,
      render: () => (
        <header className="border-b-2 border-slate-900 pb-4 mb-4 flex flex-row items-center gap-5 sm:gap-6 break-inside-avoid">
          {photoUrl ? (
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-slate-300 shrink-0 bg-slate-100 shadow-2xs">
              <img
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            </div>
          ) : (
            <div
              className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-slate-400 font-bold text-2xl sm:text-3xl font-heading shrink-0 shadow-2xs"
              title={name}
            >
              <span>{initials}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-[27px] font-extrabold text-slate-950 font-heading tracking-tight leading-tight">
              {name}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wide mt-1">
              {mainTitle}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-700">
              {email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800">{email}</span>
                </span>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800">{phone}</span>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800">{location}</span>
                </span>
              )}
              {links.website && (
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800">{links.website}</span>
                </span>
              )}
            </div>
          </div>
        </header>
      ),
    },

    // 2. Profil Professionnel
    {
      key: 'profile',
      title: 'Profil professionnel',
      checkData: () => isNonEmptyString(aboutText),
      buildBlocks: () => [{ id: 'block-profile', sectionKey: 'profile', isFirstInSection: true }],
      estimateHeight: () => {
        const lineCount = Math.ceil((aboutText?.length || 100) / 95);
        return 35 + lineCount * 18;
      },
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2">
            Profil professionnel
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {aboutText}
          </p>
        </section>
      ),
    },

    // 3. Compétences
    {
      key: 'skills',
      title: 'Compétences',
      checkData: () => isNonEmptyArray(validSkills),
      buildBlocks: () => [{ id: 'block-skills', sectionKey: 'skills', isFirstInSection: true }],
      estimateHeight: () => {
        if (skillCategoryKeys.length > 1) {
          return 35 + Math.ceil(skillCategoryKeys.length / 2) * 58;
        }
        return 35 + Math.ceil(validSkills.length / 3) * 24;
      },
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2.5">
            Compétences
          </h2>
          {skillCategoryKeys.length > 1 && !skillCategoryKeys.includes('Général') ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              {skillCategoryKeys.map((catKey) => (
                <div key={catKey} className="break-inside-avoid">
                  <span className="font-bold text-blue-800 text-[11.5px] uppercase tracking-wide block mb-1">
                    {catKey}
                  </span>
                  <ul className="space-y-0.5 pl-3">
                    {groupedSkills[catKey].map((sk) => (
                      <li key={sk.id} className="text-slate-800 text-[11.5px] list-disc">
                        <span className="font-medium">{sk.name}</span>
                        {sk.levelOrDesc && (
                          <span className="text-slate-500 text-[10.5px] ml-1 font-normal">
                            ({sk.levelOrDesc})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
              {validSkills.map((sk) => (
                <div key={sk.id} className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold leading-none mt-0.5">•</span>
                  <span className="font-medium text-slate-800 leading-snug">{sk.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      ),
    },

    // 4. Expériences pratiques & professionnelles
    {
      key: 'experiences',
      title: 'Expériences pratiques & professionnelles',
      checkData: () => isNonEmptyArray(practicalExps),
      buildBlocks: () =>
        practicalExps.map((_, idx) => ({
          id: `block-exp-${idx}`,
          sectionKey: 'experiences' as const,
          isFirstInSection: idx === 0,
          itemIndex: idx,
        })),
      estimateHeight: (block: ResumeBlock) => {
        const idx = block.itemIndex ?? 0;
        const exp = practicalExps[idx];
        if (!exp) return 120;
        const missionCount = exp.missions?.length || 0;
        const descLines = exp.description ? Math.ceil(exp.description.length / 90) : 0;
        return (
          (block.isFirstInSection ? 35 : 0) +
          40 +
          descLines * 16 +
          missionCount * 18 +
          (exp.tools?.length ? 22 : 0) +
          14
        );
      },
      render: (block: ResumeBlock, pageIndex: number) => {
        const idx = block.itemIndex ?? 0;
        const exp = practicalExps[idx];
        if (!exp) return null;

        return (
          <div className="mb-3 break-inside-avoid">
            {block.isFirstInSection && (
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2.5">
                {pageIndex > 0
                  ? 'Expériences pratiques & professionnelles (suite)'
                  : 'Expériences pratiques & professionnelles'}
              </h2>
            )}
            <div className="text-xs">
              <div className="flex flex-wrap justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900 text-xs sm:text-[13px]">
                  {exp.title}
                </span>
                {exp.period && (
                  <span className="text-[11px] text-slate-500 font-medium shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                    {exp.period}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {exp.organization && (
                  <span className="text-blue-700 font-semibold text-xs">
                    {exp.organization}
                  </span>
                )}
                {exp.location && (
                  <span className="text-slate-500 text-[11px]">
                    • {exp.location}
                  </span>
                )}
              </div>
              {exp.description && (
                <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                  {exp.description}
                </p>
              )}
              {exp.missions && exp.missions.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-xs text-slate-600 pl-4 list-disc">
                  {exp.missions.map((m, mIdx) => (
                    <li key={mIdx}>{m}</li>
                  ))}
                </ul>
              )}
              {exp.tools && exp.tools.length > 0 && (
                <p className="text-[11px] text-slate-500 mt-1">
                  <strong className="text-slate-700">Outils & technologies :</strong>{' '}
                  {exp.tools.join(', ')}
                </p>
              )}
            </div>
          </div>
        );
      },
    },

    // 5. Cursus académique
    {
      key: 'education',
      title: 'Cursus académique',
      checkData: () => isNonEmptyArray(validEducation),
      buildBlocks: () =>
        validEducation.map((_, idx) => ({
          id: `block-edu-${idx}`,
          sectionKey: 'education' as const,
          isFirstInSection: idx === 0,
          itemIndex: idx,
        })),
      estimateHeight: (block: ResumeBlock) => {
        const idx = block.itemIndex ?? 0;
        const edu = validEducation[idx];
        return (block.isFirstInSection ? 35 : 0) + 45 + (edu?.description ? 22 : 0);
      },
      render: (block: ResumeBlock, pageIndex: number) => {
        const idx = block.itemIndex ?? 0;
        const edu = validEducation[idx];
        if (!edu) return null;

        return (
          <div className="mb-2.5 break-inside-avoid">
            {block.isFirstInSection && (
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2.5">
                {pageIndex > 0 ? 'Cursus académique (suite)' : 'Cursus académique'}
              </h2>
            )}
            <div className="text-xs">
              <div className="flex flex-wrap justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{edu.degree}</span>
                {edu.period && (
                  <span className="text-[11px] text-slate-500 font-medium shrink-0">
                    {edu.period}
                  </span>
                )}
              </div>
              {edu.institution && (
                <p className="text-blue-700 font-medium text-xs mt-0.5">
                  {edu.institution}
                </p>
              )}
              {edu.description && (
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        );
      },
    },

    // 6. Formations complémentaires
    {
      key: 'formations',
      title: 'Formations complémentaires',
      checkData: () => isNonEmptyArray(validFormations),
      buildBlocks: () =>
        validFormations.map((_, idx) => ({
          id: `block-form-${idx}`,
          sectionKey: 'formations' as const,
          isFirstInSection: idx === 0,
          itemIndex: idx,
        })),
      estimateHeight: (block: ResumeBlock) => {
        const idx = block.itemIndex ?? 0;
        const form = validFormations[idx];
        return (block.isFirstInSection ? 35 : 0) + 40 + (form?.description ? 22 : 0);
      },
      render: (block: ResumeBlock, pageIndex: number) => {
        const idx = block.itemIndex ?? 0;
        const form = validFormations[idx];
        if (!form) return null;

        return (
          <div className="mb-2.5 break-inside-avoid">
            {block.isFirstInSection && (
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2.5">
                {pageIndex > 0
                  ? 'Formations complémentaires (suite)'
                  : 'Formations complémentaires'}
              </h2>
            )}
            <div className="text-xs">
              <div className="flex flex-wrap justify-between items-baseline gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{form.title}</span>
                  {form.hasAttestation && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Attestation obtenue
                    </span>
                  )}
                </div>
                {(form.date || form.duration) && (
                  <span className="text-[11px] text-slate-500 font-medium shrink-0">
                    {form.date || form.duration}
                  </span>
                )}
              </div>
              {form.institution &&
                form.institution !== 'Formation continue' &&
                form.institution !== 'Formation pratique' && (
                  <p className="text-blue-700 font-medium text-xs mt-0.5">
                    {form.institution}
                  </p>
                )}
              {form.description && (
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  {form.description}
                </p>
              )}
            </div>
          </div>
        );
      },
    },

    // 7. Certifications & Attestations
    {
      key: 'certifications',
      title: 'Certifications & Attestations',
      checkData: () => isNonEmptyArray(validCertifications),
      buildBlocks: () => [
        { id: 'block-certifications', sectionKey: 'certifications', isFirstInSection: true },
      ],
      estimateHeight: () => 35 + Math.ceil(validCertifications.length / 2) * 56,
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2.5">
            Certifications & Attestations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {validCertifications.map((cert, cIdx) => (
              <div
                key={cert.id || cIdx}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50/70 break-inside-avoid"
              >
                <div className="flex justify-between items-baseline gap-1">
                  <span className="font-bold text-slate-900 text-xs">{cert.title}</span>
                  {cert.date && (
                    <span className="text-slate-400 text-[10px] shrink-0">{cert.date}</span>
                  )}
                </div>
                {cert.issuer && (
                  <p className="text-emerald-700 font-medium text-[11px] mt-0.5">
                    {cert.issuer}
                  </p>
                )}
                {cert.refNumber && (
                  <p className="text-slate-400 text-[10px] mt-0.5">Réf : {cert.refNumber}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    },

    // 8. Projets & Réalisations
    {
      key: 'projects',
      title: 'Projets & Réalisations',
      checkData: () => isNonEmptyArray(validProjects),
      buildBlocks: () => [{ id: 'block-projects', sectionKey: 'projects', isFirstInSection: true }],
      estimateHeight: () => 35 + validProjects.length * 68,
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2.5">
            Projets & Réalisations
          </h2>
          <div className="space-y-2.5">
            {validProjects.map((proj, pIdx) => (
              <div key={proj.id || pIdx} className="text-xs break-inside-avoid">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                  {proj.link && (
                    <span className="text-blue-600 text-[11px] hover:underline">
                      {proj.link}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  {proj.description}
                </p>
                {proj.tools && proj.tools.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    <strong className="text-slate-700">Technologies :</strong>{' '}
                    {proj.tools.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    },

    // 9. Outils & Technologies
    {
      key: 'tools',
      title: 'Outils & Technologies',
      checkData: () => isNonEmptyArray(validTools),
      buildBlocks: () => [{ id: 'block-tools', sectionKey: 'tools', isFirstInSection: true }],
      estimateHeight: () => {
        const lineCount = Math.ceil(validTools.join(' • ').length / 85);
        return 35 + lineCount * 20;
      },
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2">
            Outils & Technologies
          </h2>
          <p className="text-xs text-slate-800 font-medium leading-relaxed">
            {validTools.join(' • ')}
          </p>
        </section>
      ),
    },

    // 10. Activités, Engagements & Contributions (Wikimedia, associations)
    {
      key: 'contributions',
      title: 'Activités & Contributions',
      checkData: () => isNonEmptyArray(contributionExps) || isNonEmptyArray(customActivities),
      buildBlocks: () => [
        { id: 'block-contributions', sectionKey: 'contributions', isFirstInSection: true },
      ],
      estimateHeight: () => {
        let h = 35;
        contributionExps.forEach((exp) => {
          h += 35 + (exp.missions?.length || 0) * 18 + (exp.description ? 20 : 0);
        });
        customActivities.forEach((act) => {
          h += 35 + (act.description ? 20 : 0);
        });
        return h;
      },
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2.5">
            Activités & Contributions
          </h2>
          <div className="space-y-2.5">
            {contributionExps.map((act, aIdx) => (
              <div key={act.id || aIdx} className="text-xs break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-slate-900">{act.title}</span>
                  {act.period && (
                    <span className="text-[11px] text-slate-500 font-medium shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                      {act.period}
                    </span>
                  )}
                </div>
                {act.description && (
                  <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                )}
                {act.missions && act.missions.length > 0 && (
                  <ul className="mt-1 space-y-0.5 text-xs text-slate-600 pl-4 list-disc">
                    {act.missions.map((m, mIdx) => (
                      <li key={mIdx}>{m}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {customActivities.map((cAct, cIdx) => (
              <div key={cAct.id || cIdx} className="text-xs break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="font-bold text-slate-900">{cAct.title}</span>
                  {cAct.period && (
                    <span className="text-[11px] text-slate-500 font-medium shrink-0 bg-slate-100 px-1.5 py-0.5 rounded">
                      {cAct.period}
                    </span>
                  )}
                </div>
                {cAct.description && (
                  <p className="text-slate-700 text-xs mt-0.5 leading-relaxed">
                    {cAct.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    },

    // 11. Langues (uniquement si renseignées)
    {
      key: 'languages',
      title: 'Langues',
      checkData: () => isNonEmptyArray(validLanguages),
      buildBlocks: () => [{ id: 'block-languages', sectionKey: 'languages', isFirstInSection: true }],
      estimateHeight: () => 35 + Math.ceil(validLanguages.length / 3) * 22,
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2">
            Langues
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-800">
            {validLanguages.map((lang, lIdx) => (
              <div key={lang.id || lIdx} className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{lang.name}</span>
                {lang.level && (
                  <span className="text-slate-500 text-[11px]">({lang.level})</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    },

    // 12. Centres d'intérêt (uniquement si renseignés)
    {
      key: 'interests',
      title: "Centres d'intérêt",
      checkData: () => isNonEmptyArray(validInterests),
      buildBlocks: () => [{ id: 'block-interests', sectionKey: 'interests', isFirstInSection: true }],
      estimateHeight: () => 35 + 24,
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-1.5">
            Centres d'intérêt
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {validInterests.join(' • ')}
          </p>
        </section>
      ),
    },

    // 13. Références professionnelles (uniquement si renseignées)
    {
      key: 'references',
      title: 'Références',
      checkData: () => isNonEmptyArray(validReferences),
      buildBlocks: () => [{ id: 'block-references', sectionKey: 'references', isFirstInSection: true }],
      estimateHeight: () => 35 + Math.ceil(validReferences.length / 2) * 60,
      render: () => (
        <section className="mb-4 break-inside-avoid">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading border-b border-slate-300 pb-1 mb-2">
            Références
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {validReferences.map((ref, rIdx) => (
              <div key={ref.id || rIdx} className="p-2 rounded border border-slate-200 bg-slate-50">
                <span className="font-bold text-slate-900 block">{ref.name}</span>
                {ref.title && (
                  <span className="text-blue-700 text-[11px] block">{ref.title}</span>
                )}
                {ref.organization && (
                  <span className="text-slate-600 text-[11px] block">{ref.organization}</span>
                )}
                {ref.contact && (
                  <span className="text-slate-500 text-[10px] block mt-0.5">{ref.contact}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      ),
    },
  ];

  // Iterate over each candidate section and accumulate ONLY those with confirmed data
  const mappedSections: MappedResumeSection[] = [];

  for (const def of sectionDefinitions) {
    const hasData = def.checkData();
    if (hasData) {
      mappedSections.push({
        key: def.key,
        title: def.title,
        hasData: true,
        blocks: def.buildBlocks(),
        estimateHeight: def.estimateHeight,
        renderBlock: def.render,
      });
    }
  }

  return mappedSections;
};

export const PrintResumeModal: React.FC<PrintResumeModalProps> = ({
  isOpen,
  onClose,
  customData,
  data,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null);
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Resolve dynamic portfolio data (strictly dynamic for any user)
  const portfolio = customData || data || SEMAKO_MODEL_DATA;
  const name = portfolio.identity?.name || 'Nom & Prénom';
  const mainTitle = portfolio.identity?.mainTitle || 'Titre Professionnel';

  // ---------------------------------------------------------------------------------
  // 1. DATA MAPPING: Execute mapping utility over customData
  // Only non-empty sections are returned in mappedSections.
  // ---------------------------------------------------------------------------------
  const mappedSections = useMemo(() => {
    return mapCustomDataToResumeSections(portfolio);
  }, [portfolio]);

  // Map for instant O(1) block rendering and height calculation
  const mappedSectionsMap = useMemo(() => {
    const map: Partial<Record<ResumeSectionKey, MappedResumeSection>> = {};
    mappedSections.forEach((s) => {
      map[s.key] = s;
    });
    return map;
  }, [mappedSections]);

  // Flatten active atomic blocks from valid sections only
  const allBlocks = useMemo(() => {
    return mappedSections.flatMap((s) => s.blocks);
  }, [mappedSections]);

  // Exact target file name specified: CV-[Nom-Complet].pdf
  const targetFileName = getPdfFileName(name);

  // ---------------------------------------------------------------------------------
  // 2. Pure Functional A4 Page Partitioning Algorithm
  // Standard A4 width = 794px, height = 1123px at 96 DPI
  // ---------------------------------------------------------------------------------
  const pages = useMemo(() => {
    const PAGE_HEIGHT_LIMIT_P1 = 960; // Page 1: no running top subheader
    const PAGE_HEIGHT_LIMIT_SUBSEQUENT = 920; // Pages 2+: top running header takes ~35px

    const calculatedPages: ResumeBlock[][] = [[]];
    let currentHeight = 0;
    let pageIdx = 0;

    allBlocks.forEach((block) => {
      const section = mappedSectionsMap[block.sectionKey];
      const h = section ? section.estimateHeight(block) : 100;
      const limit = pageIdx === 0 ? PAGE_HEIGHT_LIMIT_P1 : PAGE_HEIGHT_LIMIT_SUBSEQUENT;

      if (currentHeight + h > limit && calculatedPages[pageIdx].length > 0) {
        // Break to new A4 page
        pageIdx++;
        calculatedPages.push([block]);
        currentHeight = h;
      } else {
        calculatedPages[pageIdx].push(block);
        currentHeight += h;
      }
    });

    return calculatedPages;
  }, [allBlocks, mappedSectionsMap]);

  const totalPages = pages.length;

  // Manage modal open/close lifecycle safely
  useEffect(() => {
    if (isOpen) {
      setDownloadSuccess(false);
      setStatusMessage(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Native Print function
  const handlePrint = () => {
    window.print();
  };

  // High-Resolution Multi-Page PDF Generator
  const generateAndDownloadPdf = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setDownloadSuccess(false);
    setStatusMessage(null);
    setGenerationStep('Préparation des pages A4 haute résolution...');

    try {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font loading error
        }
      }

      // Query all rendered A4 page elements directly
      const pageElements = document.querySelectorAll<HTMLElement>('.cv-a4-page-render');
      if (!pageElements || pageElements.length === 0) {
        throw new Error('Aucune page A4 disponible pour le rendu.');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < pageElements.length; i++) {
        setGenerationStep(`Rendu haute définition de la page ${i + 1} sur ${pageElements.length}...`);

        const pageEl = pageElements[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2, // 2x DPI for ultra crisp typography and zero blur
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1024,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage();
        }

        // Each A4 page is exactly 210mm x 297mm
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setGenerationStep('Téléchargement du fichier PDF...');

      // Trigger instant save
      pdf.save(targetFileName);

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      setDownloadBlobUrl(blobUrl);

      setDownloadSuccess(true);
      setDownloadedFileName(targetFileName);
      setStatusMessage(
        `Le CV complet « ${targetFileName} » (${totalPages} page${totalPages > 1 ? 's' : ''}) a été généré et téléchargé avec succès.`
      );
    } catch (error) {
      console.error('Erreur lors de la génération PDF:', error);
      setStatusMessage('Une erreur est survenue lors de la création du fichier PDF.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div
      id="cv-preview-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex flex-col text-slate-100 print-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-header-title"
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. INTERFACE DE LA FICHE CV — BARRE SUPÉRIEURE FIXE           */}
      {/* ------------------------------------------------------------- */}
      <header
        id="cv-top-bar"
        className="sticky top-0 z-30 w-full bg-slate-900/95 border-b border-slate-800 px-4 sm:px-8 py-3 backdrop-blur-md flex items-center justify-between gap-4 no-print shrink-0"
      >
        {/* Bouton retour */}
        <button
          type="button"
          onClick={onClose}
          id="btn-return-portfolio"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au portfolio</span>
        </button>

        {/* Titre & Sous-titre centrés */}
        <div className="text-center flex-1 min-w-[200px]">
          <h1
            id="cv-header-title"
            className="text-sm sm:text-base font-extrabold text-white font-heading tracking-tight leading-tight uppercase"
          >
            FICHE CV
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
            Synthèse professionnelle personnalisée • {totalPages} page{totalPages > 1 ? 's' : ''} A4
          </p>
        </div>

        {/* Boutons d'actions fonctionnels */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Télécharger le CV PDF */}
          <button
            type="button"
            onClick={generateAndDownloadPdf}
            disabled={isGenerating}
            id="btn-download-pdf"
            title={`Télécharger le CV complet : ${targetFileName}`}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Génération PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Télécharger le CV PDF</span>
              </>
            )}
          </button>

          {/* Imprimer */}
          <button
            type="button"
            onClick={handlePrint}
            disabled={isGenerating}
            id="btn-print-cv"
            title="Imprimer le document complet au format A4"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Imprimer</span>
          </button>
        </div>
      </header>

      {/* Bannière de notification si génération en cours */}
      {isGenerating && (
        <div
          id="cv-generation-banner"
          className="w-full bg-blue-900/40 border-b border-blue-700/50 px-6 py-2.5 text-xs text-blue-200 flex items-center justify-center gap-2 no-print shrink-0"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400 shrink-0" />
          <span>{generationStep || 'Génération du document PDF haute résolution en cours...'}</span>
        </div>
      )}

      {/* Bannière de succès ou statut */}
      {statusMessage && !isGenerating && (
        <div
          id="cv-status-banner"
          className={`w-full px-6 py-2.5 border-b text-xs flex items-center justify-between gap-3 no-print shrink-0 ${
            downloadSuccess
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
              : 'bg-amber-950/70 border-amber-800 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${downloadSuccess ? 'text-emerald-400' : 'text-amber-400'}`}
            />
            <span>{statusMessage}</span>
          </div>
          {downloadBlobUrl && (
            <a
              href={downloadBlobUrl}
              download={downloadedFileName || targetFileName}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300 hover:underline shrink-0"
            >
              <span>Télécharger à nouveau</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. APERÇU DU CV MULTI-PAGES A4 AU CENTRE                      */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 w-full px-3 sm:px-6 py-8 flex flex-col items-center gap-8 print:p-0 print:m-0 print:gap-0">
        {pages.map((pageBlocks, pageIdx) => (
          <div key={pageIdx} className="w-full flex flex-col items-center gap-2.5 print:m-0 print:p-0">
            {/* Indicateur discret de numéro de page au-dessus de chaque feuille A4 */}
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80 shadow-xs no-print">
              Page {pageIdx + 1} sur {totalPages}
            </div>

            {/* Feuille A4 visible */}
            <div
              id={`cv-page-${pageIdx}`}
              className="cv-a4-page cv-a4-page-render w-full max-w-[794px] min-h-[1123px] bg-white text-slate-900 rounded-md shadow-2xl border border-slate-300/90 p-8 sm:p-11 flex flex-col justify-between box-border transition-all print:p-0 print:m-0 print:shadow-none print:border-none print:max-w-none print:w-full print:min-h-0"
            >
              {/* Corps de la page */}
              <div className="flex-1 flex flex-col">
                {/* En-tête discret pour les pages 2 et suivantes */}
                {pageIdx > 0 && (
                  <div className="border-b border-slate-300 pb-2 mb-4 flex justify-between items-baseline text-xs text-slate-500 font-medium break-inside-avoid">
                    <div>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{name}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <span className="text-blue-700 font-semibold uppercase text-[11px]">
                        {mainTitle}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Curriculum Vitae</span>
                  </div>
                )}

                {/* Blocs de contenu affectés à cette page: rendu dynamique selon présence de données */}
                <div className="space-y-3">
                  {pageBlocks.map((block) => {
                    const section = mappedSectionsMap[block.sectionKey];
                    if (!section || !section.hasData) return null;
                    return (
                      <div key={block.id}>
                        {section.renderBlock(block, pageIdx)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pied de page de la feuille A4 */}
              <footer className="pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 break-inside-avoid shrink-0 mt-4">
                <span>Fiche CV • {name}</span>
                <span className="font-semibold text-slate-500">
                  Page {pageIdx + 1} / {totalPages}
                </span>
              </footer>
            </div>
          </div>
        ))}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEUILLE DE STYLE D'IMPRESSION A4 COMPLÈTE                  */}
      {/* ------------------------------------------------------------- */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          .no-print,
          #cv-top-bar,
          #cv-generation-banner,
          #cv-status-banner,
          nav,
          header#navbar,
          footer {
            display: none !important;
          }
          #cv-preview-backdrop {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            display: block !important;
          }
          .cv-a4-page {
            page-break-after: always !important;
            break-after: page !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
          }
          .cv-a4-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
            break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};
