import React from 'react';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { ACADEMIC_CURRICULUM } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';

export const AcademicCurriculum: React.FC = () => {
  const { data, isCustom } = usePortfolio();

  return (
    <section id="cursus" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Parcours scolaire & professionnel
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Cursus académique
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Chronologie des études et des formations certifiantes.
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded-full mt-3"></div>
          </div>
        </ScrollReveal>

        {/* Chronological List of Academic Milestones */}
        <div className="space-y-6 max-w-4xl">
          {isCustom && data.education.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
              <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucun cursus académique enregistré pour le moment</p>
              <p className="text-xs text-slate-500 mt-1">Ajoutez vos diplômes ou études dans l'éditeur de portfolio.</p>
            </div>
          ) : isCustom ? (
            data.education.map((item, index) => (
              <ScrollReveal
                key={item.id || index}
                animation="fade-up"
                delay={index * 120}
              >
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <GraduationCap className="w-3 h-3 text-blue-600" />
                          {item.degree}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                        {item.institution}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))
          ) : (
            ACADEMIC_CURRICULUM.map((item, index) => {
              const isBehanzin = item.id === 'cursus-behanzin';
              return (
                <ScrollReveal
                  key={item.id}
                  animation="fade-up"
                  delay={index * 120}
                >
                  <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {isBehanzin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <Award className="w-3 h-3 text-emerald-600" />
                              Diplôme d'État obtenu
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              <GraduationCap className="w-3 h-3 text-blue-600" />
                              Enseignement Technique & Professionnel
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                          {item.institution}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{item.durationOrYear}</span>
                      </div>
                    </div>

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        {item.status}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {item.degreeOrField}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
