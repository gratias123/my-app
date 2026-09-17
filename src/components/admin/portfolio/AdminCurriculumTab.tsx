import React from 'react';
import { Plus, Trash2, GraduationCap, Award, BookOpen, Check } from 'lucide-react';
import { CustomPortfolioData, CustomEducationItem, CustomFormationItem } from '../../../types/portfolioBuilder';

interface AdminCurriculumTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

export const AdminCurriculumTab: React.FC<AdminCurriculumTabProps> = ({ data, onChange }) => {
  // Education helpers
  const addEducation = () => {
    const newEdu: CustomEducationItem = {
      id: `edu-${Date.now()}`,
      period: 'Année - Présent',
      institution: 'Établissement / Université',
      degree: 'Diplôme ou Spécialité',
      description: 'Détails du programme et compétences clés acquises.',
    };
    onChange({
      ...data,
      education: [...data.education, newEdu],
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((e) => e.id !== id),
    });
  };

  const updateEducation = (id: string, updates: Partial<CustomEducationItem>) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  // Formation helpers
  const addFormation = () => {
    const newTr: CustomFormationItem = {
      id: `train-${Date.now()}`,
      title: 'Intitulé de la formation',
      institution: 'Organisme formateur',
      date: 'Période / Date',
      duration: '30 heures',
      description: 'Contenu synthétique abordé.',
      hasAttestation: true,
    };
    onChange({
      ...data,
      formations: [...data.formations, newTr],
    });
  };

  const removeFormation = (id: string) => {
    onChange({
      ...data,
      formations: data.formations.filter((f) => f.id !== id),
    });
  };

  const updateFormation = (id: string, updates: Partial<CustomFormationItem>) => {
    onChange({
      ...data,
      formations: data.formations.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Academic Curriculum */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Cursus académique & Diplômes ({data.education.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Formations universitaires, secondaires et diplômes officiels d'état.
            </p>
          </div>

          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un diplôme / cursus</span>
          </button>
        </div>

        <div className="space-y-4">
          {data.education.length === 0 ? (
            <div className="p-6 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
              Aucun diplôme ou cursus renseigné.
            </div>
          ) : (
            data.education.map((edu) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Diplôme ou Niveau d'études
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                        placeholder="Ex: Licence Professionnelle en Informatique de Gestion"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Période / Année
                      </label>
                      <input
                        type="text"
                        value={edu.period}
                        onChange={(e) => updateEducation(edu.id, { period: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        placeholder="Ex: 2023 - 2024"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    title="Supprimer ce cursus"
                    onClick={() => removeEducation(edu.id)}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Établissement / Université
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Université d'Abomey-Calavi (UAC)"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Description & Spécialisation
                    </label>
                    <input
                      type="text"
                      value={edu.description || ''}
                      onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Option Réseaux et Maintenance / En cours"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Formations Complémentaires & Ateliers */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Formations complémentaires & Ateliers continus ({data.formations.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Modules techniques intensifs, bootcamps, séminaires et attestations de participation.
            </p>
          </div>

          <button
            type="button"
            onClick={addFormation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une formation</span>
          </button>
        </div>

        <div className="space-y-4">
          {data.formations.length === 0 ? (
            <div className="p-6 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
              Aucune formation complémentaire renseignée.
            </div>
          ) : (
            data.formations.map((tr) => (
              <div
                key={tr.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Intitulé de la formation
                      </label>
                      <input
                        type="text"
                        value={tr.title}
                        onChange={(e) => updateFormation(tr.id, { title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                        placeholder="Ex: Maintenance matérielle et micro-soudure GSM"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Période ou Durée
                      </label>
                      <input
                        type="text"
                        value={tr.duration || tr.date}
                        onChange={(e) =>
                          updateFormation(tr.id, { duration: e.target.value, date: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Ex: 3 mois (60h)"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    title="Supprimer cette formation"
                    onClick={() => removeFormation(tr.id)}
                    className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Description des compétences pratiques acquises
                    </label>
                    <input
                      type="text"
                      value={tr.description}
                      onChange={(e) => updateFormation(tr.id, { description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                      placeholder="Ex: Diagnostic pannes, remplacement connecteurs, station à air chaud..."
                    />
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <input
                      type="checkbox"
                      id={`attestation-${tr.id}`}
                      checked={tr.hasAttestation}
                      onChange={(e) => updateFormation(tr.id, { hasAttestation: e.target.checked })}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <label
                      htmlFor={`attestation-${tr.id}`}
                      className="text-xs text-slate-300 select-none cursor-pointer flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>Attestation obtenue</span>
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
