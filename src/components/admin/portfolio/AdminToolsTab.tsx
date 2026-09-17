import React, { useState } from 'react';
import { Plus, Trash2, Code2, Sparkles, Check, Search } from 'lucide-react';
import { CustomPortfolioData, CustomToolItem } from '../../../types/portfolioBuilder';

interface AdminToolsTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

const COMMON_PRESET_TOOLS = [
  { name: 'Photoshop', category: 'Design & Création' },
  { name: 'Canva', category: 'Design & Création' },
  { name: 'Figma', category: 'Design UI/UX' },
  { name: 'Visual Studio Code', category: 'Développement' },
  { name: 'Git & GitHub', category: 'Développement & Versioning' },
  { name: 'Node.js', category: 'Développement' },
  { name: 'Microsoft Word', category: 'Bureautique' },
  { name: 'Microsoft Excel', category: 'Bureautique & Données' },
  { name: 'Microsoft PowerPoint', category: 'Bureautique' },
  { name: 'Google Workspace', category: 'Collaboration' },
  { name: 'Trello', category: 'Organisation & Projet' },
  { name: 'Station à air chaud', category: 'Atelier & Micro-soudure' },
  { name: 'Multimètre numérique', category: 'Diagnostic & Électronique' },
  { name: 'Pince à sertir RJ45', category: 'Câblage & Réseaux' },
  { name: 'Testeur de câble réseau', category: 'Diagnostic Réseau' },
  { name: 'VirtualBox / VMware', category: 'Systèmes & Virtualisation' },
];

export const AdminToolsTab: React.FC<AdminToolsTabProps> = ({ data, onChange }) => {
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('Logiciel');
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize tools array: can be string[] or CustomToolItem[]
  const toolsList: CustomToolItem[] = data.tools.map((t, idx) => {
    if (typeof t === 'string') {
      return {
        id: `tool-${idx}-${t.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: t,
        category: 'Logiciel & Outil',
        level: 'Maîtrisé',
      };
    }
    return t;
  });

  const updateAllTools = (newTools: CustomToolItem[]) => {
    onChange({
      ...data,
      tools: newTools,
    });
  };

  const addCustomTool = (nameToAdd?: string, catToAdd?: string) => {
    const finalName = (nameToAdd || newToolName).trim();
    if (!finalName) return;

    // Avoid duplicates
    if (toolsList.some((t) => t.name.toLowerCase() === finalName.toLowerCase())) {
      setNewToolName('');
      return;
    }

    const newItem: CustomToolItem = {
      id: `tool-${Date.now()}`,
      name: finalName,
      category: catToAdd || newToolCategory || 'Outil technique',
      level: 'Maîtrisé',
    };

    updateAllTools([...toolsList, newItem]);
    setNewToolName('');
  };

  const removeTool = (name: string) => {
    updateAllTools(toolsList.filter((t) => t.name !== name));
  };

  const updateToolItem = (name: string, updates: Partial<CustomToolItem>) => {
    updateAllTools(
      toolsList.map((t) => (t.name === name ? { ...t, ...updates } : t))
    );
  };

  const filteredTools = toolsList.filter(
    (t) =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <span>Boîte à outils, Logiciels & Équipements ({toolsList.length})</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Tous les outils déclarés ici sont affichés sous forme de cartes d'outils interactives dans la section dédiée du portfolio.
        </p>
      </div>

      {/* Quick Add Bar */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
        <label className="text-xs font-semibold text-slate-300 block">
          Ajouter rapidement un outil
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={newToolName}
            onChange={(e) => setNewToolName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomTool();
              }
            }}
            placeholder="Nom du logiciel ou matériel (ex: Wireshark, Docker, Audacity...)"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            value={newToolCategory}
            onChange={(e) => setNewToolCategory(e.target.value)}
            placeholder="Catégorie (ex: Réseau)"
            className="w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-blue-300 placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />

          <button
            type="button"
            onClick={() => addCustomTool()}
            disabled={!newToolName.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>

        {/* Suggestions chips */}
        <div className="pt-2 border-t border-slate-900">
          <span className="text-[11px] text-slate-500 block mb-1.5">
            Suggestions rapides (cliquez pour ajouter directement) :
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {COMMON_PRESET_TOOLS.map((preset, idx) => {
              const alreadyAdded = toolsList.some((t) => t.name.toLowerCase() === preset.name.toLowerCase());
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addCustomTool(preset.name, preset.category)}
                  disabled={alreadyAdded}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                    alreadyAdded
                      ? 'bg-slate-900/50 text-slate-600 border-slate-900 opacity-60 cursor-default'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-blue-950/40 hover:text-blue-300 hover:border-blue-800'
                  }`}
                >
                  <span>{preset.name}</span>
                  {alreadyAdded ? <Check className="w-3 h-3 text-emerald-500" /> : <Plus className="w-3 h-3 text-slate-500" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filtrer parmi les outils configurés..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Active Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredTools.length === 0 ? (
          <div className="sm:col-span-3 p-8 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
            Aucun outil trouvé.
          </div>
        ) : (
          filteredTools.map((t) => (
            <div
              key={t.name}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => updateToolItem(t.name, { name: e.target.value })}
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-xs font-bold text-white focus:outline-none py-0.5"
                  />
                  <input
                    type="text"
                    value={t.category || ''}
                    onChange={(e) => updateToolItem(t.name, { category: e.target.value })}
                    placeholder="Catégorie"
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-[10px] text-blue-300 focus:outline-none py-0.5"
                  />
                </div>

                <button
                  type="button"
                  title="Supprimer l'outil"
                  onClick={() => removeTool(t.name)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                <select
                  value={t.level || 'Maîtrisé'}
                  onChange={(e) => updateToolItem(t.name, { level: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none"
                >
                  <option value="Maîtrisé">Maîtrisé</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Pratique quotidienne">Pratique quotidienne</option>
                </select>

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
