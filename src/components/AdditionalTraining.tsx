import React from 'react';
import { BookMarked, Clock, CheckCircle2, Wrench, Smartphone, Palette, Printer, Award } from 'lucide-react';
import { ADDITIONAL_TRAINING } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';

export const AdditionalTraining: React.FC = () => {
  const { data, isCustom } = usePortfolio();

  const getTrainingIcon = (id: string) => {
    switch (id) {
      case 'formation-info-1an':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'formation-maintenance-gsm':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'formation-graphisme':
        return <Palette className="w-5 h-5 text-blue-600" />;
      case 'formation-serigraphie':
        return <Printer className="w-5 h-5 text-blue-600" />;
      default:
        return <BookMarked className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section id="formations" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <BookMarked className="w-3.5 h-3.5" />
              Apprentissages ciblés
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Formations complémentaires
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              {isCustom
                ? 'Formations pratiques et ateliers techniques suivis pour approfondir des compétences ciblées.'
                : 'Formations pratiques réellement suivies pour développer des compétences spécifiques en informatique, téléphonie, graphisme et sérigraphie.'}
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded-full mt-3"></div>
          </div>
        </ScrollReveal>

        {/* Training Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
          {isCustom && data.formations.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
              <BookMarked className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucune formation complémentaire enregistrée pour le moment</p>
              <p className="text-xs text-slate-500 mt-1">Ajoutez vos ateliers et formations complémentaires dans l'éditeur de portfolio.</p>
            </div>
          ) : isCustom ? (
            data.formations.map((item, index) => (
              <ScrollReveal
                key={item.id || index}
                animation="fade-up"
                delay={index * 80}
                className="h-full"
              >
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 text-blue-600 shadow-2xs">
                      <BookMarked className="w-5 h-5 text-blue-600" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                      {item.title}
                    </h3>

                    {item.institution && (
                      <p className="text-xs text-blue-700 font-semibold mb-2">
                        {item.institution}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex flex-col gap-1.5 text-xs">
                    {item.duration && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.hasAttestation ? 'Attestation obtenue' : 'Formation validée'}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            ADDITIONAL_TRAINING.map((item, index) => (
              <ScrollReveal
                key={item.id}
                animation="fade-up"
                delay={index * 80}
                className="h-full"
              >
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 text-blue-600 shadow-2xs">
                      {getTrainingIcon(item.id)}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex flex-col gap-1.5 text-xs">
                    {item.duration && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.validationStatus}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
