import React from 'react';
import {
  CustomPortfolioData,
  CustomSkillItem,
  CustomExperienceItem,
  CustomEducationItem,
  CustomFormationItem,
  CustomCertificationItem,
  CustomProjectItem,
} from '../../types/portfolioBuilder';
import {
  Plus,
  Trash2,
  Upload,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Link,
  Layers,
  FolderGit2,
  CheckCircle2,
} from 'lucide-react';
import { getToolName, formatToolsList } from '../../utils/toolUtils';

interface StepProps {
  data: CustomPortfolioData;
  onChange: (updated: CustomPortfolioData) => void;
}

/* =========================================================================
   ÉTAPE 1 — IDENTITÉ
   ========================================================================= */
export const StepIdentity: React.FC<StepProps> = ({ data, onChange }) => {
  const handleIdentityChange = (field: keyof CustomPortfolioData['identity'], value: string) => {
    onChange({
      ...data,
      identity: {
        ...data.identity,
        [field]: value,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleIdentityChange('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Section 1 — Identité</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Vos coordonnées principales, nom, titre et photo professionnelle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nom complet <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex : Jean Dupont"
            value={data.identity.name}
            onChange={(e) => handleIdentityChange('name', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nom professionnel / pseudonyme
          </label>
          <input
            type="text"
            placeholder="Ex : JD Studio ou Jean Dev"
            value={data.identity.brandName}
            onChange={(e) => handleIdentityChange('brandName', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Titre professionnel <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex : DÉVELOPPEUR WEB / GRAPHISTE"
            value={data.identity.mainTitle}
            onChange={(e) => handleIdentityChange('mainTitle', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Ville / pays <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex : Cotonou, Bénin"
            value={data.identity.location}
            onChange={(e) => handleIdentityChange('location', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email de contact <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Ex : contact@example.com"
            value={data.identity.email}
            onChange={(e) => handleIdentityChange('email', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Téléphone <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            placeholder="Ex : +229 00 00 00 00"
            value={data.identity.phone}
            onChange={(e) => handleIdentityChange('phone', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Photo de profil */}
        <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <label className="block text-xs font-semibold text-slate-800">
            Photo de profil
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
              {data.identity.photoUrl ? (
                <img
                  src={data.identity.photoUrl}
                  alt="Aperçu profil"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-2 text-xs">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer font-medium shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Téléverser une image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-500">
                Ou collez ci-dessous une URL web directe vers votre photo :
              </p>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={data.identity.photoUrl}
                onChange={(e) => handleIdentityChange('photoUrl', e.target.value)}
                className="w-full text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   ÉTAPE 2 — PRÉSENTATION
   ========================================================================= */
export const StepAbout: React.FC<StepProps> = ({ data, onChange }) => {
  const handleAboutChange = (field: keyof CustomPortfolioData['about'], value: string) => {
    onChange({
      ...data,
      about: {
        ...data.about,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Section 2 — Présentation</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Votre résumé, votre phrase d'accroche et votre présentation complète.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phrase d'accroche (Tagline) <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Ex : Création d'expériences web modernes et ergonomiques"
            value={data.about.tagline}
            onChange={(e) => handleAboutChange('tagline', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Résumé professionnel (affiché en haut de page) <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Ex : Passionné(e) par la technologie et le design, j'accompagne les entreprises et particuliers dans leurs projets numériques avec rigueur et écoute."
            value={data.about.heroSummary}
            onChange={(e) => handleAboutChange('heroSummary', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Présentation personnelle détaillée (Section « À propos »)
          </label>
          <p className="text-[11px] text-slate-500 mb-1.5">
            Vous pouvez séparer vos paragraphes avec des sauts de ligne pour un affichage aéré.
          </p>
          <textarea
            rows={6}
            placeholder="Ex : Présentez brièvement votre parcours et vos objectifs..."
            value={data.about.presentation}
            onChange={(e) => handleAboutChange('presentation', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   ÉTAPE 3 — COMPÉTENCES
   ========================================================================= */
export const StepSkills: React.FC<StepProps> = ({ data, onChange }) => {
  const handleAddSkill = () => {
    const newSkill: CustomSkillItem = {
      id: `skill-${Date.now()}`,
      name: '',
      category: 'Général',
      levelOrDesc: '',
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkill],
    });
  };

  const handleUpdateSkill = (index: number, field: keyof CustomSkillItem, value: string) => {
    const updated = [...data.skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, skills: updated });
  };

  const handleRemoveSkill = (index: number) => {
    const updated = data.skills.filter((_, i) => i !== index);
    onChange({ ...data, skills: updated });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Section 3 — Compétences</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Ajoutez vos compétences clés avec leur niveau ou précision technique.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddSkill}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une compétence</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.skills.map((skill, idx) => (
          <div
            key={skill.id || idx}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Intitulé de la compétence
              </label>
              <input
                type="text"
                placeholder="Ex : Câblage réseau RJ45, Design UI..."
                value={skill.name}
                onChange={(e) => handleUpdateSkill(idx, 'name', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Catégorie
              </label>
              <input
                type="text"
                placeholder="Ex : Réseaux, Design, Dév..."
                value={skill.category || ''}
                onChange={(e) => handleUpdateSkill(idx, 'category', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Niveau ou description
              </label>
              <input
                type="text"
                placeholder="Ex : Avancé, Pratique..."
                value={skill.levelOrDesc || ''}
                onChange={(e) => handleUpdateSkill(idx, 'levelOrDesc', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-1 flex justify-end sm:justify-center pt-2 sm:pt-4">
              <button
                type="button"
                onClick={() => handleRemoveSkill(idx)}
                title="Supprimer cette compétence"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {data.skills.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500">Aucune compétence ajoutée pour le moment.</p>
            <button
              type="button"
              onClick={handleAddSkill}
              className="mt-2 text-xs text-blue-600 font-semibold hover:underline"
            >
              + Ajouter votre première compétence
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   ÉTAPE 4 — EXPÉRIENCES
   ========================================================================= */
export const StepExperiences: React.FC<StepProps> = ({ data, onChange }) => {
  const handleAddExperience = () => {
    const newExp: CustomExperienceItem = {
      id: `exp-${Date.now()}`,
      title: '',
      organization: '',
      location: '',
      period: '',
      description: '',
      missions: [],
      tools: [],
    };
    onChange({
      ...data,
      experiences: [...data.experiences, newExp],
    });
  };

  const handleUpdateExp = (index: number, field: keyof CustomExperienceItem, value: any) => {
    const updated = [...data.experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, experiences: updated });
  };

  const handleRemoveExp = (index: number) => {
    const updated = data.experiences.filter((_, i) => i !== index);
    onChange({ ...data, experiences: updated });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Section 4 — Expériences pratiques</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Vos postes, stages, projets concrets ou missions professionnelles.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une expérience</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.experiences.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Expérience #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveExp(idx)}
                title="Supprimer cette expérience"
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Intitulé de l'expérience / poste
                </label>
                <input
                  type="text"
                  placeholder="Ex : Maintenance informatique en atelier"
                  value={exp.title}
                  onChange={(e) => handleUpdateExp(idx, 'title', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Organisation / entreprise
                </label>
                <input
                  type="text"
                  placeholder="Ex : Atelier IMI ou Nom Entreprise"
                  value={exp.organization}
                  onChange={(e) => handleUpdateExp(idx, 'organization', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Ex : Porto-Novo, Bénin"
                  value={exp.location}
                  onChange={(e) => handleUpdateExp(idx, 'location', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Date ou période
                </label>
                <input
                  type="text"
                  placeholder="Ex : 2023 - 2024 ou 6 mois"
                  value={exp.period}
                  onChange={(e) => handleUpdateExp(idx, 'period', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Description générale
              </label>
              <textarea
                rows={2}
                placeholder="Explication synthétique du contexte et des objectifs..."
                value={exp.description}
                onChange={(e) => handleUpdateExp(idx, 'description', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Missions (une par ligne)
              </label>
              <textarea
                rows={3}
                placeholder="• Conception et réalisation des interfaces&#10;• Collaboration en équipe agile&#10;• Rédaction de documentation technique"
                value={exp.missions.join('\n')}
                onChange={(e) =>
                  handleUpdateExp(
                    idx,
                    'missions',
                    e.target.value.split('\n').filter((m) => m.trim().length > 0)
                  )
                }
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-[11px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   ÉTAPE 5 — CURSUS ACADÉMIQUE
   ========================================================================= */
export const StepEducation: React.FC<StepProps> = ({ data, onChange }) => {
  const handleAddEducation = () => {
    const newEdu: CustomEducationItem = {
      id: `edu-${Date.now()}`,
      period: '',
      institution: '',
      degree: '',
      description: '',
    };
    onChange({
      ...data,
      education: [...data.education, newEdu],
    });
  };

  const handleUpdateEdu = (index: number, field: keyof CustomEducationItem, value: string) => {
    const updated = [...data.education];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, education: updated });
  };

  const handleRemoveEdu = (index: number) => {
    const updated = data.education.filter((_, i) => i !== index);
    onChange({ ...data, education: updated });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Section 5 — Cursus académique</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Vos diplômes et formations scolaires/universitaires officielles.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une formation académique</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.education.map((edu, idx) => (
          <div
            key={edu.id || idx}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Formation #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveEdu(idx)}
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Année / période
                </label>
                <input
                  type="text"
                  placeholder="Ex : 2023 - 2026"
                  value={edu.period}
                  onChange={(e) => handleUpdateEdu(idx, 'period', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Établissement
                </label>
                <input
                  type="text"
                  placeholder="Ex : Lycée Technique et Professionnel"
                  value={edu.institution}
                  onChange={(e) => handleUpdateEdu(idx, 'institution', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Niveau ou diplôme
                </label>
                <input
                  type="text"
                  placeholder="Ex : Diplôme d'Études Professionnelles"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEdu(idx, 'degree', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Description éventuelle
              </label>
              <textarea
                rows={2}
                placeholder="Détails du programme ou compétences développées..."
                value={edu.description || ''}
                onChange={(e) => handleUpdateEdu(idx, 'description', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   ÉTAPE 6 — FORMATIONS COMPLÉMENTAIRES
   ========================================================================= */
export const StepFormations: React.FC<StepProps> = ({ data, onChange }) => {
  const handleAddFormation = () => {
    const newForm: CustomFormationItem = {
      id: `form-${Date.now()}`,
      title: '',
      institution: '',
      date: '',
      duration: '',
      description: '',
      hasAttestation: false,
    };
    onChange({
      ...data,
      formations: [...data.formations, newForm],
    });
  };

  const handleUpdateForm = (index: number, field: keyof CustomFormationItem, value: any) => {
    const updated = [...data.formations];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, formations: updated });
  };

  const handleRemoveForm = (index: number) => {
    const updated = data.formations.filter((_, i) => i !== index);
    onChange({ ...data, formations: updated });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Section 6 — Formations complémentaires</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Formations pratiques, ateliers intensifs ou bootcamps suivis.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddFormation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une formation</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.formations.map((form, idx) => (
          <div
            key={form.id || idx}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Formation #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveForm(idx)}
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Intitulé de la formation
                </label>
                <input
                  type="text"
                  placeholder="Ex : Formation en Sérigraphie"
                  value={form.title}
                  onChange={(e) => handleUpdateForm(idx, 'title', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Établissement / Organisme
                </label>
                <input
                  type="text"
                  placeholder="Facultatif si non mentionné"
                  value={form.institution || ''}
                  onChange={(e) => handleUpdateForm(idx, 'institution', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Durée
                </label>
                <input
                  type="text"
                  placeholder="Ex : 1 an, 3 mois (facultatif)"
                  value={form.duration || ''}
                  onChange={(e) => handleUpdateForm(idx, 'duration', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Attestation obtenue ?
                </label>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasAttestation}
                    onChange={(e) => handleUpdateForm(idx, 'hasAttestation', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-slate-700">
                    Oui, attestation obtenue
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Ex : Formation pratique et méthodologique..."
                value={form.description}
                onChange={(e) => handleUpdateForm(idx, 'description', e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   ÉTAPE 7 — CERTIFICATIONS
   ========================================================================= */
export const StepCertifications: React.FC<StepProps> = ({ data, onChange }) => {
  const handleAddCert = () => {
    const newCert: CustomCertificationItem = {
      id: `cert-${Date.now()}`,
      title: '',
      issuer: '',
      date: '',
      refNumber: '',
      verifyUrl: '',
    };
    onChange({
      ...data,
      certifications: [...data.certifications, newCert],
    });
  };

  const handleUpdateCert = (index: number, field: keyof CustomCertificationItem, value: string) => {
    const updated = [...data.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, certifications: updated });
  };

  const handleRemoveCert = (index: number) => {
    const updated = data.certifications.filter((_, i) => i !== index);
    onChange({ ...data, certifications: updated });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span>Section 7 — Certifications</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Certifications professionnelles obtenues, attestations en ligne et accréditations.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCert}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une certification</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.certifications.map((cert, idx) => (
          <div
            key={cert.id || idx}
            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Certification #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveCert(idx)}
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nom de la certification
                </label>
                <input
                  type="text"
                  placeholder="Ex : Découvrir la science des données"
                  value={cert.title}
                  onChange={(e) => handleUpdateCert(idx, 'title', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Organisme certificateur
                </label>
                <input
                  type="text"
                  placeholder="Ex : IBM SkillsBuild, Google, Cisco..."
                  value={cert.issuer}
                  onChange={(e) => handleUpdateCert(idx, 'issuer', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Date d'obtention
                </label>
                <input
                  type="text"
                  placeholder="Ex : Août 2026"
                  value={cert.date || ''}
                  onChange={(e) => handleUpdateCert(idx, 'date', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Numéro ou référence (facultatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex : ID-98234-CERT"
                  value={cert.refNumber || ''}
                  onChange={(e) => handleUpdateCert(idx, 'refNumber', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Lien de vérification en ligne (facultatif)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={cert.verifyUrl || ''}
                  onChange={(e) => handleUpdateCert(idx, 'verifyUrl', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   ÉTAPE 8 — PROJETS / RÉALISATIONS
   ========================================================================= */
export const StepProjects: React.FC<StepProps> = ({ data, onChange }) => {
  const handleToggleProjects = (enabled: boolean) => {
    onChange({
      ...data,
      projects: {
        ...data.projects,
        enabled,
      },
    });
  };

  const handleAddProject = () => {
    const newProj: CustomProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      imageUrl: '',
      link: '',
      tools: [],
    };
    onChange({
      ...data,
      projects: {
        ...data.projects,
        enabled: true,
        items: [...data.projects.items, newProj],
      },
    });
  };

  const handleUpdateProj = (index: number, field: keyof CustomProjectItem, value: any) => {
    const updated = [...data.projects.items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({
      ...data,
      projects: {
        ...data.projects,
        items: updated,
      },
    });
  };

  const handleRemoveProj = (index: number) => {
    const updated = data.projects.items.filter((_, i) => i !== index);
    onChange({
      ...data,
      projects: {
        ...data.projects,
        items: updated,
      },
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-blue-600" />
          <span>Section 8 — Projets / Réalisations (Optionnelle)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Vous choisissez si vous souhaitez afficher ou non une galerie de projets sur votre portfolio.
        </p>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
        <div>
          <span className="font-semibold text-xs text-slate-800 block">
            Afficher la section Projets sur mon portfolio
          </span>
          <span className="text-[11px] text-slate-500">
            {data.projects.enabled
              ? 'La section est activée et s’affichera sur votre site.'
              : 'La section est masquée.'}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={data.projects.enabled}
            onChange={(e) => handleToggleProjects(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {data.projects.enabled && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un projet</span>
            </button>
          </div>

          {data.projects.items.map((proj, idx) => (
            <div
              key={proj.id || idx}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">Projet #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProj(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nom du projet
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Site e-commerce, Identité visuelle..."
                    value={proj.name}
                    onChange={(e) => handleUpdateProj(idx, 'name', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Lien vers le projet (facultatif)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={proj.link || ''}
                    onChange={(e) => handleUpdateProj(idx, 'link', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Image d'illustration (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={proj.imageUrl || ''}
                    onChange={(e) => handleUpdateProj(idx, 'imageUrl', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Technologies / outils utilisés (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : React, Tailwind, Figma, Photoshop"
                    value={formatToolsList(proj.tools)}
                    onChange={(e) =>
                      handleUpdateProj(
                        idx,
                        'tools',
                        e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                      )
                    }
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Description du projet
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Objectifs, résultats obtenus, défis relevés..."
                    value={proj.description}
                    onChange={(e) => handleUpdateProj(idx, 'description', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   ÉTAPE 9 — OUTILS & LIENS
   ========================================================================= */
export const StepToolsAndLinks: React.FC<StepProps> = ({ data, onChange }) => {
  const handleToolsChange = (raw: string) => {
    const list = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onChange({
      ...data,
      tools: list,
    });
  };

  const handleLinkChange = (key: keyof CustomPortfolioData['links'], value: string) => {
    onChange({
      ...data,
      links: {
        ...data.links,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          <span>Section 9 — Outils & Section 10 — Réseaux / Liens</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Vos logiciels de prédilection et vos liens de contact professionnels.
        </p>
      </div>

      {/* Outils & Technologies */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Outils & Technologies maîtrisés
        </h4>
        <p className="text-[11px] text-slate-500">
          Saisissez vos outils séparés par des virgules (ex : HTML, CSS, JavaScript, Photoshop, Figma, VS Code...)
        </p>
        <textarea
          rows={3}
          value={formatToolsList(data.tools)}
          onChange={(e) => handleToolsChange(e.target.value)}
          className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {data.tools.map((t, idx) => {
            const name = getToolName(t);
            if (!name) return null;
            return (
              <span
                key={idx}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-2xs"
              >
                {name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Réseaux sociaux & liens */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Link className="w-3.5 h-3.5 text-blue-600" />
          <span>Réseaux & Liens professionnels (Facultatifs)</span>
        </h4>
        <p className="text-[11px] text-slate-500">
          Ne renseignez que les liens réels et actifs que vous souhaitez partager.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/..."
              value={data.links.linkedin || ''}
              onChange={(e) => handleLinkChange('linkedin', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              GitHub
            </label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={data.links.github || ''}
              onChange={(e) => handleLinkChange('github', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Site web personnel
            </label>
            <input
              type="url"
              placeholder="https://mon-site.com"
              value={data.links.website || ''}
              onChange={(e) => handleLinkChange('website', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Instagram
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/..."
              value={data.links.instagram || ''}
              onChange={(e) => handleLinkChange('instagram', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Facebook
            </label>
            <input
              type="url"
              placeholder="https://facebook.com/..."
              value={data.links.facebook || ''}
              onChange={(e) => handleLinkChange('facebook', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Autre lien
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={data.links.other || ''}
              onChange={(e) => handleLinkChange('other', e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
