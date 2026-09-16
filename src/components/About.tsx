import React from 'react';
import { User, Wrench, Palette, CheckCircle2, Star } from 'lucide-react';
import { ABOUT_DATA } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';

export const About: React.FC = () => {
  const { data, isCustom } = usePortfolio();

  const presentationParagraphs = isCustom
    ? data.about.presentation
      ? data.about.presentation.split('\n\n').filter(Boolean)
      : [data.about.heroSummary || 'Présentation en cours de rédaction.']
    : ABOUT_DATA.presentation;

  return (
    <section id="a-propos" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              Présentation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              À propos de moi
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              {isCustom
                ? `Présentation de ${data.identity.name || 'mon parcours'}, de mes compétences et de mes orientations.`
                : 'Présentation de mon parcours, de ma formation et de mes orientations professionnelles.'}
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded-full mt-3"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Narrative text (factual, authentic, human) */}
          <ScrollReveal
            animation="fade-left"
            delay={100}
            className="lg:col-span-7 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed"
          >
            {presentationParagraphs.map((text, idx) => (
              <p key={idx} className="text-justify sm:text-left whitespace-pre-line">
                {text}
              </p>
            ))}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-6 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Démarche d'apprentissage et de rigueur</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                {isCustom
                  ? 'Pratique régulière, rigueur méthodologique et souci constant de la qualité dans l’exécution des tâches et projets.'
                  : 'Développer mes aptitudes par la pratique régulière en atelier, l\'analyse méthodique des pannes matérielles et logicielles, et la conception graphique appliquée aux besoins concrets.'}
              </p>
            </div>
          </ScrollReveal>

          {/* Two Main Axes or Key Pillars */}
          <ScrollReveal animation="fade-right" delay={200} className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
              <h3 className="text-base font-bold font-heading text-white tracking-wide">
                {isCustom ? 'Piliers & domaines d’intervention' : 'Mes deux axes principaux de construction'}
              </h3>

              {!isCustom ? (
                <>
                  {/* Axis 1 */}
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Axe 1</span>
                        <h4 className="text-sm font-bold text-white">Informatique & Maintenance</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-9">
                      Installation et maintenance informatique, diagnostic des postes de travail, maintenance des équipements, administration élémentaire, réseaux et câblage RJ45.
                    </p>
                  </div>

                  {/* Axis 2 */}
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-500 text-white shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Axe 2</span>
                        <h4 className="text-sm font-bold text-white">Design graphique & Création visuelle</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-9">
                      Conception graphique, création de supports visuels, mise en page, retouche d’images et élaboration de maquettes d’interfaces (UI/UX).
                    </p>
                  </div>

                  {/* Additional practical learning note */}
                  <div className="pt-2 text-xs text-slate-400 border-t border-slate-800">
                    <span className="text-slate-300 font-medium">Compléments pratiques : </span>
                    Maintenance GSM, Internet, culture du web, UI/UX et intelligence artificielle responsable.
                  </div>
                </>
              ) : (
                <>
                  {data.skills.length > 0 ? (
                    <div className="space-y-3">
                      {data.skills.slice(0, 3).map((skill, sIdx) => (
                        <div key={sIdx} className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
                          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold">
                            <Star className="w-3.5 h-3.5" />
                            <span>{skill.category || 'Compétence'}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{skill.name}</h4>
                          {skill.levelOrDesc && (
                            <p className="text-xs text-slate-300">{skill.levelOrDesc}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs text-center py-6">
                      Renseignez vos compétences clés dans l'éditeur pour les afficher ici.
                    </div>
                  )}

                  {data.tools && data.tools.length > 0 && (
                    <div className="pt-2 text-xs text-slate-400 border-t border-slate-800">
                      <span className="text-slate-300 font-medium">Outils principaux : </span>
                      {data.tools.slice(0, 6).join(', ')}
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
