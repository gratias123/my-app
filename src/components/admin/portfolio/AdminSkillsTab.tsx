import React, { useState } from 'react';
import { Plus, Trash2, Wrench, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { CustomPortfolioData, CustomSkillItem } from '../../../types/portfolioBuilder';

interface AdminSkillsTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

const DEFAULT_CATEGORIES = [
  'Informatique & Maintenance',
  'Téléphonie & GSM',
  'Graphisme & Identité visuelle',
  'Bureautique & Gestion',
  'Réseaux & Câblage',
  'Systèmes & Environnements',
  'Culture libre & Wikimedia',
  'Compétences transversales',
];

export const AdminSkillsTab: React.FC<AdminSkillsTabProps> = ({ data, onChange }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addSkill = () => {
    const newSkill: CustomSkillItem = {
      id: `skill-${Date.now()}`,
      name: 'Nouvelle compétence',
      category: filterCategory !== 'all' ? filterCategory : 'Informatique & Maintenance',
      levelOrDesc: 'Pratique confirmée',
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkill],
    });
  };

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    });
  };

  const updateSkill = (id: string, updates: Partial<CustomSkillItem>) => {
    onChange({
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const newSkills = [...data.skills];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSkills.length) return;
    const temp = newSkills[index];
    newSkills[index] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;
    onChange({ ...data, skills: newSkills });
  };

  // Get unique categories present in skills + defaults
  const allCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...data.skills.map((s) => s.category).filter(Boolean)])
  );

  const filteredSkills = data.skills.filter((s) => {
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.levelOrDesc && s.levelOrDesc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span>Compétences techniques & Savoir-faire ({data.skills.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Gérez la liste complète de vos compétences affichées sur le portfolio et sur la fiche CV.
          </p>
        </div>

        <button
          type="button"
          onClick={addSkill}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une compétence</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une compétence..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="shrink-0">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filtrer par catégorie de compétence"
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Toutes les catégories ({data.skills.length})</option>
            {allCategories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat} ({data.skills.filter((s) => s.category === cat).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
            <p className="text-xs text-slate-500">Aucune compétence ne correspond à vos critères.</p>
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const rawIndex = data.skills.findIndex((s) => s.id === skill.id);
            return (
              <div
                key={skill.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center gap-3"
              >
                {/* Reorder buttons */}
                <div className="flex md:flex-col items-center gap-1 shrink-0 text-slate-500">
                  <button
                    type="button"
                    title="Monter"
                    onClick={() => moveSkill(rawIndex, 'up')}
                    disabled={rawIndex === 0}
                    className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    title="Descendre"
                    onClick={() => moveSkill(rawIndex, 'down')}
                    disabled={rawIndex === data.skills.length - 1}
                    className="p-1 hover:text-white disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                {/* Skill Title */}
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="Intitulé de la compétence"
                  />
                </div>

                {/* Skill Category */}
                <div className="w-full md:w-56">
                  <input
                    list="category-suggestions"
                    type="text"
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                    placeholder="Catégorie"
                  />
                </div>

                {/* Skill Level / Description */}
                <div className="w-full md:w-48">
                  <input
                    type="text"
                    value={skill.levelOrDesc || ''}
                    onChange={(e) => updateSkill(skill.id, { levelOrDesc: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Niveau ou détail (ex: Avancé)"
                  />
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  title="Supprimer la compétence"
                  onClick={() => removeSkill(skill.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      <datalist id="category-suggestions">
        {allCategories.map((cat, idx) => (
          <option key={idx} value={cat} />
        ))}
      </datalist>
    </div>
  );
};
