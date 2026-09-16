import React, { useState } from 'react';
import {
  Wrench,
  Smartphone,
  Palette,
  Layers,
  Layout,
  Globe,
  CheckCircle2,
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { SKILL_CATEGORIES_EN } from '../data/portfolioDataEn';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';

export const SkillsSection: React.FC = () => {
  const { data, isCustom } = usePortfolio();
  const { isEn, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const baseCategories = isEn ? SKILL_CATEGORIES_EN : SKILL_CATEGORIES;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-blue-600" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-blue-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-blue-600" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-600" />;
      default:
        return <Wrench className="w-5 h-5 text-blue-600" />;
    }
  };

  // Group custom skills by category if custom
  const customCategories = React.useMemo(() => {
    if (!isCustom) return [];
    const map = new Map<string, Array<{ name: string; levelOrDesc?: string }>>();
    data.skills.forEach((s) => {
      const cat = s.category || (isEn ? 'General' : 'Général');
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push({ name: s.name, levelOrDesc: s.levelOrDesc });
    });
    return Array.from(map.entries()).map(([title, skills], idx) => ({
      id: `custom-cat-${idx}`,
      title,
      description: isEn
        ? `Key skills and proficiencies in ${title}.`
        : `Compétences et savoir-faire clés en ${title}.`,
      iconName: idx % 2 === 0 ? 'Wrench' : 'Palette',
      skills,
    }));
  }, [isCustom, data.skills, isEn]);

  const categoriesToDisplay = isCustom
    ? (activeFilter === 'all'
        ? customCategories
        : customCategories.filter((c) => c.id === activeFilter))
    : (activeFilter === 'all'
        ? baseCategories
        : baseCategories.filter((cat) => cat.id === activeFilter));

  const filterTabs = isCustom
    ? customCategories.map((c) => ({ id: c.id, title: c.title }))
    : baseCategories.map((c) => ({ id: c.id, title: c.title }));

  return (
    <section id="competences" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('skills.badge')}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
                {t('skills.title')}
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                {isEn
                  ? 'Methodical organization of technical and practical skills, without artificial percentages.'
                  : 'Organisation méthodique des compétences techniques et pratiques, sans pourcentages artificiels.'}
              </p>
              <div className="w-16 h-1 bg-blue-600 rounded-full mt-3"></div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {isEn ? `All (${filterTabs.length})` : `Toutes (${filterTabs.length})`}
              </button>
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isCustom && customCategories.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {isEn ? 'No skills added yet' : 'Aucune compétence ajoutée pour le moment'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? 'Add your technical or general skills in the portfolio builder.'
                  : "Ajoutez vos compétences techniques ou générales dans l'éditeur de portfolio."}
              </p>
            </div>
          ) : isCustom ? (
            categoriesToDisplay.map((category: any, index: number) => (
              <ScrollReveal
                key={category.id}
                animation="fade-up"
                delay={index * 60}
                className="h-full"
              >
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        {getIcon(category.iconName)}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading leading-tight">
                          {category.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    <ul className="space-y-2 mb-2">
                      {category.skills.map((skill: any, sIdx: number) => (
                        <li key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <div className="leading-snug">
                            <span className="font-medium text-slate-900">{skill.name}</span>
                            {skill.levelOrDesc && (
                              <span className="block text-[11px] text-blue-700 font-medium mt-0.5">
                                {skill.levelOrDesc}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            baseCategories.filter((c) => activeFilter === 'all' || c.id === activeFilter).map((category, index) => (
              <ScrollReveal
                key={category.id}
                animation="fade-up"
                delay={index * 60}
                className="h-full"
              >
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        {getIcon(category.iconName)}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading leading-tight">
                          {category.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    <ul className="space-y-2 mb-2">
                      {category.skills.map((skill, sIdx) => {
                        const isSerigraphie = skill === 'Sérigraphie' || skill === 'Screen Printing';
                        return (
                          <li key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <div className="leading-snug">
                              <span className={isSerigraphie ? 'font-semibold text-slate-900' : ''}>
                                {skill}
                              </span>
                              {isSerigraphie && (
                                <span className="block text-[11px] text-blue-700 font-medium mt-0.5">
                                  {isEn
                                    ? 'Complementary skill related to graphic design and visual creation'
                                    : 'Compétence complémentaire liée au graphisme et à la création visuelle'}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>

        {/* Note on approach */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                <strong>{isEn ? 'Hands-on practice: ' : 'Pratique concrète : '}</strong>
                {isEn
                  ? 'Skills developed through direct lab and workshop manipulation, practical training, and continuous learning.'
                  : "Compétences développées par la manipulation directe en atelier, la formation et l'apprentissage continu."}
              </span>
            </span>
            <a
              href="#experiences"
              className="text-blue-600 font-semibold hover:underline"
            >
              {isEn ? 'View practical experiences →' : 'Consulter les expériences pratiques →'}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
