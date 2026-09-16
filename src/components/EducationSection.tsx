import React from 'react';
import { GraduationCap, Calendar, CheckCircle2, Clock, MapPin, Award } from 'lucide-react';
import { EDUCATION_LIST } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';

export const EducationSection: React.FC = () => {
  return (
    <section id="formation" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              Parcours d'apprentissage
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Formation
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Le socle théorique et pratique qui structure mes compétences en maintenance, en réseaux et en technologies du numérique.
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded-full mt-4"></div>
          </div>
        </ScrollReveal>

        {/* Timeline representation */}
        <div className="space-y-6 max-w-4xl">
          {EDUCATION_LIST.map((edu, index) => (
            <ScrollReveal
              key={edu.id}
              animation="fade-up"
              delay={index * 100}
            >
              <div
                className={`rounded-2xl p-6 sm:p-7 border transition-all hover:shadow-md ${
                  edu.isMain
                    ? 'bg-white border-blue-300 shadow-md ring-1 ring-blue-100'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {edu.isMain ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                          <Award className="w-3 h-3" />
                          Formation principale (Socle technique)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          Formation complémentaire
                        </span>
                      )}

                      {edu.status === 'en-cours' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <Clock className="w-3 h-3" />
                          En cours
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Complétée
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                      {edu.title}
                    </h3>

                    {edu.institution && (
                      <p className="text-sm font-semibold text-blue-700 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {edu.institution}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-center">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{edu.duration}</span>
                  </div>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  {edu.description}
                </p>

                {/* Key learnings */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Notions clés abordées :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {edu.keyLearnings.map((learning, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>{learning}</span>
                      </div>
                    ))}
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

