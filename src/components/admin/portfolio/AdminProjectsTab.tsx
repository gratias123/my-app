import React, { useState } from 'react';
import { Plus, Trash2, FolderGit2, ExternalLink, Calendar, UserCheck, CheckCircle2 } from 'lucide-react';
import { CustomPortfolioData, CustomProjectItem } from '../../../types/portfolioBuilder';
import { formatToolsList } from '../../../utils/toolUtils';

interface AdminProjectsTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({ data, onChange }) => {
  const projects = data.projects || { enabled: true, items: [] };

  const toggleProjectsSection = (enabled: boolean) => {
    onChange({
      ...data,
      projects: {
        ...projects,
        enabled,
      },
    });
  };

  const addProject = () => {
    const newProject: CustomProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'Nouveau projet réalisé',
      role: 'Concepteur / Technicien',
      period: '2024',
      description: 'Description des objectifs, du déroulement et des solutions apportées.',
      tools: ['Outil 1', 'Technologie 2'],
      results: 'Résultats concrets ou impact positif.',
      link: '',
    };
    onChange({
      ...data,
      projects: {
        ...projects,
        enabled: true,
        items: [newProject, ...projects.items],
      },
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: {
        ...projects,
        items: projects.items.filter((p) => p.id !== id),
      },
    });
  };

  const updateProject = (id: string, updates: Partial<CustomProjectItem>) => {
    onChange({
      ...data,
      projects: {
        ...projects,
        items: projects.items.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      },
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              <span>Projets & Réalisations concrètes ({projects.items.length})</span>
            </h3>

            <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={projects.enabled}
                onChange={(e) => toggleProjectsSection(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className={projects.enabled ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                {projects.enabled ? 'Section active' : 'Section masquée'}
              </span>
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mettez en avant vos réalisations emblématiques en graphisme, maintenance, développement et organisation.
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un projet</span>
        </button>
      </div>

      <div className="space-y-4">
        {projects.items.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
            Aucun projet enregistré pour l'instant. Cliquez sur "Ajouter un projet" ci-dessus.
          </div>
        ) : (
          projects.items.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Nom / Titre du projet
                    </label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                      placeholder="Ex: GratiaLink - Identité visuelle de marque"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Période / Date
                    </label>
                    <input
                      type="text"
                      value={proj.period}
                      onChange={(e) => updateProject(proj.id, { period: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="Ex: 2023 - 2024"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  title="Supprimer ce projet"
                  onClick={() => removeProject(proj.id)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Votre rôle dans le projet
                  </label>
                  <input
                    type="text"
                    value={proj.role}
                    onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Designer Graphique & Concepteur"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Lien externe ou Démo (URL)
                  </label>
                  <input
                    type="text"
                    value={proj.link || ''}
                    onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="https://..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Description détaillée du projet
                  </label>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                    placeholder="Expliquez la problématique, la démarche technique et la réalisation."
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Outils & Technologies (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={formatToolsList(proj.tools)}
                    onChange={(e) =>
                      updateProject(proj.id, {
                        tools: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-blue-300 focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Photoshop, Canva, TypeScript, Vite"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Résultats ou Impact obtenu
                  </label>
                  <input
                    type="text"
                    value={proj.results || ''}
                    onChange={(e) => updateProject(proj.id, { results: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
                    placeholder="Ex: Identité validée, plus de 50 livrables réalisés avec succès"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
