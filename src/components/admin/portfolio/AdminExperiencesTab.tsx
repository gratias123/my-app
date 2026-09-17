import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, ChevronDown, ChevronUp, MapPin, Calendar, Wrench, CheckCircle } from 'lucide-react';
import { CustomPortfolioData, CustomExperienceItem } from '../../../types/portfolioBuilder';
import { formatToolsList } from '../../../utils/toolUtils';

interface AdminExperiencesTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

export const AdminExperiencesTab: React.FC<AdminExperiencesTabProps> = ({ data, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(data.experiences[0]?.id || null);

  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newExp: CustomExperienceItem = {
      id: newId,
      title: 'Nouvelle mission ou poste',
      organization: 'Entreprise / Atelier',
      location: 'Porto-Novo, Bénin',
      period: '2024 - Présent',
      description: 'Description globale de l’activité et des responsabilités.',
      missions: ['Activité technique principale', 'Deuxième responsabilité'],
      tools: ['Outil 1', 'Outil 2'],
    };
    onChange({
      ...data,
      experiences: [newExp, ...data.experiences],
    });
    setExpandedId(newId);
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experiences: data.experiences.filter((e) => e.id !== id),
    });
  };

  const updateExperience = (id: string, updates: Partial<CustomExperienceItem>) => {
    onChange({
      ...data,
      experiences: data.experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const addMission = (expId: string) => {
    const exp = data.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const missions = exp.missions || [];
    updateExperience(expId, { missions: [...missions, 'Nouvelle tâche ou mission réalisée'] });
  };

  const updateMission = (expId: string, mIdx: number, val: string) => {
    const exp = data.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const missions = [...(exp.missions || [])];
    missions[mIdx] = val;
    updateExperience(expId, { missions });
  };

  const removeMission = (expId: string, mIdx: number) => {
    const exp = data.experiences.find((e) => e.id === expId);
    if (!exp) return;
    const missions = (exp.missions || []).filter((_, idx) => idx !== mIdx);
    updateExperience(expId, { missions });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span>Expériences pratiques & Missions techniques ({data.experiences.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Détaillez vos postes, interventions en atelier, stages et missions indépendantes.
          </p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une expérience</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.experiences.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
            <p className="text-xs text-slate-500">Aucune expérience enregistrée. Cliquez ci-dessus pour en ajouter.</p>
          </div>
        ) : (
          data.experiences.map((exp) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="rounded-xl bg-slate-950/70 border border-slate-800 overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white truncate">{exp.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/60">
                        {exp.organization}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {exp.period}
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Supprimer l'expérience"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExperience(exp.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Form Fields */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-slate-900 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Intitulé du poste / Mission
                        </label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Entreprise / Organisation / Atelier
                        </label>
                        <input
                          type="text"
                          value={exp.organization}
                          onChange={(e) => updateExperience(exp.id, { organization: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Période (ex: 2024 - Présent)
                        </label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Lieu géographique
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          placeholder="Porto-Novo, Bénin"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Description synthétique
                        </label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                          placeholder="Contexte et objectifs principaux de la mission..."
                        />
                      </div>
                    </div>

                    {/* Missions / Activities List */}
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-300">
                          Missions & Activités détaillées (Puces)
                        </label>
                        <button
                          type="button"
                          onClick={() => addMission(exp.id)}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Ajouter une mission</span>
                        </button>
                      </div>

                      {(exp.missions || []).map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <input
                            type="text"
                            value={m}
                            onChange={(e) => updateMission(exp.id, mIdx, e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                            placeholder="Description de la tâche ou responsabilité..."
                          />
                          <button
                            type="button"
                            onClick={() => removeMission(exp.id, mIdx)}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Tools used in this experience */}
                    <div className="pt-2 border-t border-slate-900">
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Outils & Équipements mobilisés (séparés par des virgules)
                      </label>
                      <input
                        type="text"
                        value={formatToolsList(exp.tools)}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            tools: e.target.value
                              .split(',')
                              .map((t) => t.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-blue-300 focus:outline-none focus:border-blue-500 font-mono"
                        placeholder="Ex: Station à air chaud, Multimètre, Photoshop, Visual Studio Code"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
