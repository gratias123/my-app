import React, { useState } from 'react';
import {
  Layers,
  Code,
  FileCode,
  Palette,
  Terminal,
  Grid,
  GitBranch,
  Sparkles,
  Layout,
  Image as ImageIcon,
  Cpu,
  CheckCircle,
} from 'lucide-react';
import { DIGITAL_TOOLS } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';

export const ToolsSection: React.FC = () => {
  const { data, isCustom } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  const categories = ['Tous', 'Design & UI/UX', 'Développement Web', 'Éditeur & Versioning'];

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'Photoshop':
        return <ImageIcon className="w-5 h-5 text-blue-600" />;
      case 'Photopea':
        return <Layers className="w-5 h-5 text-blue-600" />;
      case 'Adobe XD':
      case 'Figma':
        return <Layout className="w-5 h-5 text-blue-600" />;
      case 'Canva':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'Visual Studio Code':
        return <Code className="w-5 h-5 text-blue-600" />;
      case 'HTML':
        return <FileCode className="w-5 h-5 text-blue-600" />;
      case 'CSS':
        return <Palette className="w-5 h-5 text-blue-600" />;
      case 'JavaScript':
        return <Terminal className="w-5 h-5 text-blue-600" />;
      case 'Bootstrap':
        return <Grid className="w-5 h-5 text-blue-600" />;
      case 'GitHub':
      case 'GitHub Pages':
      case 'GitHub / Pages':
        return <GitBranch className="w-5 h-5 text-blue-600" />;
      default:
        return <Cpu className="w-5 h-5 text-blue-600" />;
    }
  };

  const filteredTools =
    selectedCategory === 'Tous'
      ? DIGITAL_TOOLS
      : DIGITAL_TOOLS.filter((t) => t.category === selectedCategory);

  return (
    <section id="outils" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-3">
                <Code className="w-3.5 h-3.5" />
                Environnement technique
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
                Outils & Technologies
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Logiciels, langages et environnements réellement pratiqués dans le cadre des formations et projets.
              </p>
            </div>

            {/* Category Filter Pills (Only on model view) */}
            {!isCustom && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Tools Cards Grid */}
        {isCustom ? (
          data.tools.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
              <Code className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucun outil renseigné pour le moment</p>
              <p className="text-xs text-slate-500 mt-1">Ajoutez vos logiciels et technologies dans l'éditeur de portfolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.tools.map((toolName, idx) => (
                <ScrollReveal
                  key={idx}
                  animation="scale"
                  delay={(idx % 6) * 50}
                  className="h-full"
                >
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group h-full">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        {getToolIcon(toolName)}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 font-heading leading-tight mb-1">
                        {toolName}
                      </h3>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Maîtrisé</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredTools.map((tool, idx) => (
              <ScrollReveal
                key={idx}
                animation="scale"
                delay={(idx % 6) * 60}
                className="h-full"
              >
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group h-full">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      {getToolIcon(tool.name)}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 font-heading leading-tight mb-1">
                      {tool.name}
                    </h3>

                    <span className="text-[10px] font-medium text-blue-600 block mb-2">
                      {tool.category}
                    </span>

                    <p className="text-[11px] text-slate-500 leading-snug">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Pratiqué</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
