import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  Calendar,
  UserCheck,
  Star,
  ArrowRight,
  ImageIcon,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { getToolName } from '../utils/toolUtils';
import { CustomProjectItem } from '../types/portfolioBuilder';
import { ProjectDetailModal } from './projects/ProjectDetailModal';

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { isEn, t } = useLanguage();
  const { projects } = data;

  const [selectedProject, setSelectedProject] = useState<CustomProjectItem | null>(null);

  if (!projects || projects.enabled === false || !projects.items || projects.items.length === 0) {
    return null;
  }

  // Safe localized strings with guaranteed fallback to prevent any technical key display
  const rawTitle = t('projects.title');
  const sectionTitle =
    rawTitle && rawTitle !== 'projects.title'
      ? rawTitle
      : isEn
      ? 'Projects & Accomplishments'
      : 'Projets & Réalisations';

  const rawBadge = t('projects.badge');
  const sectionBadge =
    rawBadge && rawBadge !== 'projects.badge'
      ? rawBadge
      : isEn
      ? 'Projects & Realizations'
      : 'Projets & Réalisations';

  const rawSubtitle = t('projects.subtitle');
  const sectionSubtitle =
    rawSubtitle && rawSubtitle !== 'projects.subtitle'
      ? rawSubtitle
      : isEn
      ? 'Selection of recent projects, technical accomplishments, and visual designs.'
      : 'Sélection de projets récents, réalisations techniques et conceptions visuelles.';

  const viewProjectText = t('projects.viewProject') || (isEn ? 'View Project' : 'Voir le projet');
  const viewDetailsText = t('projects.viewDetails') || (isEn ? 'View Details' : 'Voir les détails');

  return (
    <section
      id="projets"
      className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200 relative overflow-hidden"
    >
      {/* Background subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3 border border-blue-200/80">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{sectionBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              {sectionTitle}
            </h2>

            <p className="text-slate-600 mt-3 text-sm sm:text-base font-normal max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>

            <div className="w-14 h-1 bg-blue-600 rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>

        {/* Dynamic Responsive Projects Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {projects.items.map((proj, idx) => {
            const hasRealImage = Boolean(proj.imageUrl && proj.imageUrl.trim());
            const galleryCount = proj.gallery?.length || 0;

            return (
              <ScrollReveal
                key={proj.id || idx}
                delay={idx * 60}
                className="h-full flex flex-col"
              >
                <div
                  id={`project-card-${proj.id || idx}`}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 flex flex-col h-full group cursor-pointer"
                  onClick={() => setSelectedProject(proj)}
                >
                  {/* Visual Top Zone (Strict 16:9 ratio) */}
                  <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative rounded-t-2xl border-b border-slate-100">
                    {hasRealImage ? (
                      /* Real Project Visual */
                      <img
                        src={proj.imageUrl}
                        alt={proj.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      /* Discreet, polished light placeholder (NO heavy dark box!) */
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-200/70 p-5 flex flex-col justify-between relative select-none">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-xl bg-white/90 text-blue-600 shadow-2xs border border-blue-100/80 flex items-center justify-center">
                            <FolderGit2 className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                            {proj.role || (isEn ? 'Documented' : 'Réalisation')}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">
                            {proj.name}
                          </p>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            <span>{isEn ? 'Project documented' : 'Projet documenté'}</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Top Overlays */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{t('projects.featured') || 'À la une'}</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 pointer-events-none">
                      {proj.period && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-mono font-medium shadow-xs">
                          {proj.period}
                        </span>
                      )}
                    </div>

                    {/* Gallery counter indicator */}
                    {galleryCount > 0 && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1 pointer-events-none shadow-xs">
                        <ImageIcon className="w-3 h-3 text-blue-400" />
                        <span>+{galleryCount} {isEn ? 'images' : 'visuels'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Role or category */}
                      {proj.role && (
                        <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block mb-1.5">
                          {proj.role}
                        </span>
                      )}

                      {/* Project Name */}
                      <h3
                        className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-snug group-hover:text-blue-600 transition-colors mb-2 line-clamp-2"
                        title={proj.name}
                      >
                        {proj.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed font-normal">
                        {proj.description}
                      </p>
                    </div>

                    {/* Bottom Area: Tools & Actions */}
                    <div className="pt-2">
                      {/* Technologies & Tools Pills */}
                      {proj.tools && proj.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {proj.tools.slice(0, 4).map((tItem, tIdx) => {
                            const name = getToolName(tItem);
                            if (!name) return null;
                            return (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80"
                              >
                                {name}
                              </span>
                            );
                          })}
                          {proj.tools.length > 4 && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200">
                              +{proj.tools.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Card Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(proj);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors py-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>{viewDetailsText}</span>
                        </button>

                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors py-1 group/link cursor-pointer"
                          >
                            <span>{viewProjectText}</span>
                            <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Detailed Project Modal with Full Description & Gallery */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
