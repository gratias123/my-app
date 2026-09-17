import React from 'react';
import { FolderGit2, ExternalLink, Code2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { getToolName } from '../utils/toolUtils';

export const ProjectsSection: React.FC = () => {
  const { data } = usePortfolio();
  const { isEn, t } = useLanguage();
  const { projects } = data;

  if (!projects || !projects.enabled || !projects.items || projects.items.length === 0) {
    return null;
  }

  return (
    <section id="projets" className="py-20 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-3 border border-blue-200">
              <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('projects.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              {t('projects.title')}
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              {isEn
                ? 'Selection of technical accomplishments, web apps, and visual designs.'
                : 'Sélection de projets récents, réalisations techniques et conceptions visuelles.'}
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto mt-4"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.items.map((proj, idx) => (
            <ScrollReveal key={proj.id || idx} delay={idx * 80} className="h-full">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                {proj.imageUrl ? (
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={proj.imageUrl}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-slate-900 flex items-center justify-center text-slate-400">
                    <Code2 className="w-10 h-10 text-blue-400" />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading mb-2">
                      {proj.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div>
                    {proj.tools && proj.tools.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.tools.map((tItem, tIdx) => {
                          const name = getToolName(tItem);
                          if (!name) return null;
                          return (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>{t('projects.viewProject')}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
