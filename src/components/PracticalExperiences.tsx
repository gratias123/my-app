import React, { useState } from 'react';
import {
  Briefcase,
  CheckCircle,
  Wrench,
  Smartphone,
  Palette,
  Layout,
  Globe,
  ArrowRight,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
} from 'lucide-react';
import { PRACTICAL_EXPERIENCES } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';

export const PracticalExperiences: React.FC = () => {
  const { data, isCustom } = usePortfolio();

  const experiencesList = React.useMemo(() => {
    if (!isCustom) return PRACTICAL_EXPERIENCES;
    if (data.experiences && data.experiences.length > 0) {
      return data.experiences.map((exp, idx) => ({
        id: exp.id || `custom-exp-${idx}`,
        title: exp.title || 'Expérience',
        category: exp.organization || 'Pratique',
        badge: exp.period || 'Validée',
        description: exp.description || '',
        activities: exp.missions && exp.missions.length > 0 ? exp.missions : ['Missions pratiques associées'],
        tools: exp.tools && exp.tools.length > 0 ? exp.tools : ['Outils techniques'],
        location: exp.location,
      }));
    }
    return [];
  }, [isCustom, data.experiences]);

  const [selectedExpId, setSelectedExpId] = useState<string>(experiencesList[0]?.id || 'exp-0');

  // Keep selection valid if list changes
  const activeExp = experiencesList.find((e) => e.id === selectedExpId) || experiencesList[0];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'exp-maintenance-info':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'exp-maintenance-gsm':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'exp-graphisme':
        return <Palette className="w-5 h-5 text-blue-600" />;
      case 'exp-uiux':
        return <Layout className="w-5 h-5 text-blue-600" />;
      case 'exp-wikimedia':
        return <Globe className="w-5 h-5 text-blue-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="experiences" className="py-16 sm:py-20 bg-white border-b border-slate-200 relative">
      <div id="experiences-pratiques" className="absolute -top-24 left-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              Pratique réelle & Atelier
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Expériences pratiques
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              {isCustom
                ? 'Présentation des missions, stages et réalisations concrètes menées sur le terrain.'
                : 'Présentation des domaines d\'application dans lesquels j\'ai réellement pratiqué, sans postes ou entreprises inventés.'}
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded-full mt-3"></div>
          </div>
        </ScrollReveal>

        {/* Master-Detail Interactive Presentation */}
        {experiencesList.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Aucune expérience enregistrée pour le moment</p>
            <p className="text-xs text-slate-500 mt-1">Ajoutez vos expériences ou projets pratiques dans l'espace de création de portfolio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Navigation list on the left */}
            <ScrollReveal animation="fade-left" delay={100} className="lg:col-span-4 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1 mb-2">
                Domaines de pratique ({experiencesList.length}) :
              </span>

              {experiencesList.map((exp) => {
                const isSelected = exp.id === activeExp?.id;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setSelectedExpId(exp.id)}
                    id={`btn-exp-${exp.id}`}
                    className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-800 shadow-md translate-x-1'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-blue-600'
                      }`}
                    >
                      {getCategoryIcon(exp.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[11px] font-medium text-blue-400">
                          {exp.category}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-bold font-heading line-clamp-1 ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {exp.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </ScrollReveal>

            {/* Detailed Experience Display Card */}
            {activeExp && (
              <ScrollReveal animation="fade-right" delay={150} className="lg:col-span-8">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
                  {/* Header Badge and Category */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                        {getCategoryIcon(activeExp.id)}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                          {activeExp.category}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                          {activeExp.title}
                        </h3>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {activeExp.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="py-5">
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                      {activeExp.description}
                    </p>
                  </div>

                  {/* Practical Activities Breakdown */}
                  <div className="space-y-3 pb-5 border-b border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                      Activités et tâches pratiques réalisées :
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {activeExp.activities.map((act, aIdx) => (
                        <div
                          key={aIdx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Environment Used */}
                  <div className="pt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-500">Outils & environnement :</span>
                      {activeExp.tools.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-slate-700 border border-slate-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
