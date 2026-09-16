import React, { useState, useEffect } from 'react';
import {
  Save,
  Check,
  Globe,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Link as LinkIcon,
  Sparkles,
  Camera,
  Loader2,
} from 'lucide-react';
import { CustomPortfolioData, CustomSkillItem, CustomExperienceItem, CustomEducationItem, CustomFormationItem, CustomCertificationItem } from '../../types/portfolioBuilder';
import { apiClient } from '../../services/apiClient';

interface AdminOwnerPortfolioEditorProps {
  onPreview: (data: CustomPortfolioData) => void;
  onOpenPrintCV: (data: CustomPortfolioData) => void;
}

export const AdminOwnerPortfolioEditor: React.FC<AdminOwnerPortfolioEditorProps> = ({
  onPreview,
  onOpenPrintCV,
}) => {
  const [data, setData] = useState<CustomPortfolioData | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'identity' | 'about' | 'skills' | 'experiences' | 'curriculum' | 'certifications' | 'links'>('identity');

  // Load admin portfolio on mount
  useEffect(() => {
    let mounted = true;
    async function loadPortfolio() {
      try {
        const res = await apiClient.getAdminMyPortfolio();
        if (mounted && res.success && res.portfolio) {
          setData(res.portfolio.data);
          setStatus(res.portfolio.status || 'published');
        }
      } catch (e) {
        console.error('Erreur chargement portfolio propriétaire', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadPortfolio();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (newStatus?: 'draft' | 'published') => {
    if (!data) return;
    setIsSaving(true);
    setFeedbackNotice(null);

    const targetStatus = newStatus || status;
    try {
      const res = await apiClient.saveAdminMyPortfolio(data, targetStatus);
      if (res.success) {
        setStatus(targetStatus);
        setFeedbackNotice(targetStatus === 'published' ? 'Portfolio enregistré et publié en ligne avec succès !' : 'Modifications enregistrées sous forme de brouillon.');
      } else {
        setFeedbackNotice('Erreur lors de l’enregistrement');
      }
    } catch (e: any) {
      setFeedbackNotice(e.message || 'Erreur lors de l’enregistrement');
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
        <span>Chargement des données du portfolio...</span>
      </div>
    );
  }

  // Helpers for array modifications
  const addSkill = () => {
    const newSkill: CustomSkillItem = {
      id: `skill-${Date.now()}`,
      name: 'Nouvelle compétence',
      category: 'Maintenance & Réseaux',
      levelOrDesc: 'Pratique confirmée',
    };
    setData({ ...data, skills: [...data.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  };

  const updateSkill = (id: string, updates: Partial<CustomSkillItem>) => {
    setData({
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const addExperience = () => {
    const newExp: CustomExperienceItem = {
      id: `exp-${Date.now()}`,
      title: 'Poste ou mission',
      organization: 'Structure / Entreprise',
      location: 'Porto-Novo, Bénin',
      period: '2024 - Présent',
      description: 'Description globale de l’activité.',
      missions: ['Mission principale', 'Activité technique'],
      tools: ['Outils utilisés'],
    };
    setData({ ...data, experiences: [newExp, ...data.experiences] });
  };

  const removeExperience = (id: string) => {
    setData({ ...data, experiences: data.experiences.filter((e) => e.id !== id) });
  };

  const updateExperience = (id: string, updates: Partial<CustomExperienceItem>) => {
    setData({
      ...data,
      experiences: data.experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    });
  };

  const addEducation = () => {
    const newEdu: CustomEducationItem = {
      id: `edu-${Date.now()}`,
      period: '2023 - 2026',
      institution: 'Établissement académique',
      degree: 'Intitulé de la filière / Diplôme',
      description: 'Détails des apprentissages.',
    };
    setData({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    setData({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  const addFormation = () => {
    const newForm: CustomFormationItem = {
      id: `form-${Date.now()}`,
      title: 'Formation pratique',
      institution: 'Atelier / Centre',
      date: '2024',
      duration: 'Formation pratique',
      description: 'Acquis pratiques.',
      hasAttestation: true,
    };
    setData({ ...data, formations: [...data.formations, newForm] });
  };

  const removeFormation = (id: string) => {
    setData({ ...data, formations: data.formations.filter((f) => f.id !== id) });
  };

  const addCertification = () => {
    const newCert: CustomCertificationItem = {
      id: `cert-${Date.now()}`,
      title: 'Intitulé de la certification',
      issuer: 'Organisme certificateur',
      date: '2024',
      refNumber: '',
      verifyUrl: '',
    };
    setData({ ...data, certifications: [...data.certifications, newCert] });
  };

  const removeCertification = (id: string) => {
    setData({ ...data, certifications: data.certifications.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Édition directe du portfolio personnel
            </h2>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                status === 'published'
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80'
                  : 'bg-amber-950/60 text-amber-400 border-amber-800/80'
              }`}
            >
              {status === 'published' ? 'En ligne (Publié)' : 'Brouillon privé'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Toutes les modifications apportées ici s'appliquent immédiatement à la présentation officielle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(data)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Prévisualiser</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenPrintCV(data)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-300" />
            <span>Fiche CV</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(status === 'published' ? 'published' : 'draft')}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-300" />
            <span>Sauvegarder</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
            <span>Publier sur la plateforme</span>
          </button>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-800/80 text-blue-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Editor Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-1 text-xs pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'identity' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Identité & Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'about' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Présentation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'skills' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Compétences ({data.skills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'experiences' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Expériences ({data.experiences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'curriculum' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Cursus & Formations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'certifications' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certifications ({data.certifications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'links' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Contact & Réseaux</span>
        </button>
      </div>

      {/* 1. Identity Tab */}
      {activeTab === 'identity' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-slate-700 overflow-hidden flex items-center justify-center relative group shrink-0">
              {data.identity.photoUrl ? (
                <img
                  src={data.identity.photoUrl}
                  alt="Aperçu"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-8 h-8 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                URL de la photo de profil
              </label>
              <input
                type="text"
                value={data.identity.photoUrl}
                onChange={(e) =>
                  setData({
                    ...data,
                    identity: { ...data.identity, photoUrl: e.target.value },
                  })
                }
                placeholder="/src/assets/images/profile.jpg ou https://..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={data.identity.name}
                onChange={(e) =>
                  setData({
                    ...data,
                    identity: { ...data.identity, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nom de marque / Signature (ex. GratiaLink)
              </label>
              <input
                type="text"
                value={data.identity.brandName}
                onChange={(e) =>
                  setData({
                    ...data,
                    identity: { ...data.identity, brandName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Titre professionnel principal
              </label>
              <input
                type="text"
                value={data.identity.mainTitle}
                onChange={(e) =>
                  setData({
                    ...data,
                    identity: { ...data.identity, mainTitle: e.target.value },
                  })
                }
                placeholder="Ex. Technicien Informatique & Designer Graphique"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Localisation
              </label>
              <input
                type="text"
                value={data.identity.location}
                onChange={(e) =>
                  setData({
                    ...data,
                    identity: { ...data.identity, location: e.target.value },
                  })
                }
                placeholder="Ex. Porto-Novo, Bénin"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Adresse e-mail
              </label>
              <input
                type="email"
                value={data.identity.email}
                onChange={(e) =>
                  setData({
                    ...data,
                    identity: { ...data.identity, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="text"
                value={data.identity.phone}
                onChange={(e) =>
                  setData({
                    ...data,
                    identity: { ...data.identity, phone: e.target.value },
                  })
                }
                placeholder="+229 01 64 69 06 82"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. About Tab */}
      {activeTab === 'about' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Slogan / Phrase d’accroche (Tagline)
            </label>
            <input
              type="text"
              value={data.about.tagline}
              onChange={(e) =>
                setData({
                  ...data,
                  about: { ...data.about, tagline: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Résumé d'introduction (Hero summary)
            </label>
            <textarea
              rows={3}
              value={data.about.heroSummary}
              onChange={(e) =>
                setData({
                  ...data,
                  about: { ...data.about, heroSummary: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Texte de présentation détaillé (Section À propos)
            </label>
            <textarea
              rows={8}
              value={data.about.presentation}
              onChange={(e) =>
                setData({
                  ...data,
                  about: { ...data.about, presentation: e.target.value },
                })
              }
              placeholder="Rédigez ici votre biographie et vos axes directeurs..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Vous pouvez séparer les paragraphes par une ligne vide.
            </p>
          </div>
        </div>
      )}

      {/* 3. Skills Tab */}
      {activeTab === 'skills' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200">
              Liste des compétences ({data.skills.length})
            </span>
            <button
              type="button"
              onClick={addSkill}
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une compétence</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.skills.map((skill, index) => (
              <div
                key={skill.id || index}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-wrap items-center gap-3"
              >
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    placeholder="Intitulé de la compétence"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div className="w-48">
                  <select
                    value={skill.category || 'Maintenance & Réseaux'}
                    onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-300 outline-none"
                  >
                    <option value="Maintenance & Réseaux">Maintenance & Réseaux</option>
                    <option value="Design Graphique">Design Graphique</option>
                    <option value="Maintenance GSM">Maintenance GSM</option>
                    <option value="Compétence transverse">Compétence transverse</option>
                  </select>
                </div>

                <div className="w-40">
                  <input
                    type="text"
                    value={skill.levelOrDesc || ''}
                    onChange={(e) => updateSkill(skill.id, { levelOrDesc: e.target.value })}
                    placeholder="Niveau ou précision"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-300 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Experiences Tab */}
      {activeTab === 'experiences' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200">
              Expériences et pratiques terrain ({data.experiences.length})
            </span>
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une expérience</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.experiences.map((exp, index) => (
              <div
                key={exp.id || index}
                className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-blue-400 font-mono">
                    #{index + 1} Expérience
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="text-slate-500 hover:text-red-400 text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Intitulé du poste / fonction
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Organisation ou badge
                    </label>
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) => updateExperience(exp.id, { organization: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Période
                    </label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Missions (une mission par ligne)
                  </label>
                  <textarea
                    rows={3}
                    value={(exp.missions || []).join('\n')}
                    onChange={(e) =>
                      updateExperience(exp.id, {
                        missions: e.target.value.split('\n').filter((m) => m.trim().length > 0),
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Curriculum & Formations Tab */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Cursus */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">
                Cursus académique ({data.education.length})
              </span>
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un diplôme</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.education.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">
                      Diplôme #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="text-slate-500 hover:text-red-400 text-xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        setData({
                          ...data,
                          education: data.education.map((item) =>
                            item.id === edu.id ? { ...item, degree: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="Diplôme ou filière"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        setData({
                          ...data,
                          education: data.education.map((item) =>
                            item.id === edu.id ? { ...item, institution: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="Établissement"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) =>
                        setData({
                          ...data,
                          education: data.education.map((item) =>
                            item.id === edu.id ? { ...item, period: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="Année ou durée"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={edu.description || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        education: data.education.map((item) =>
                          item.id === edu.id ? { ...item, description: e.target.value } : item
                        ),
                      })
                    }
                    placeholder="Description du cursus"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Formations complémentaires */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200">
                Formations complémentaires ({data.formations.length})
              </span>
              <button
                type="button"
                onClick={addFormation}
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une formation</span>
              </button>
            </div>

            <div className="space-y-3">
              {data.formations.map((form, idx) => (
                <div
                  key={form.id || idx}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">
                      Formation #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFormation(form.id)}
                      className="text-slate-500 hover:text-red-400 text-xs cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setData({
                          ...data,
                          formations: data.formations.map((item) =>
                            item.id === form.id ? { ...item, title: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="Intitulé de la formation"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={form.duration || ''}
                      onChange={(e) =>
                        setData({
                          ...data,
                          formations: data.formations.map((item) =>
                            item.id === form.id ? { ...item, duration: e.target.value } : item
                          ),
                        })
                      }
                      placeholder="Durée / Période"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-300 flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={form.hasAttestation}
                          onChange={(e) =>
                            setData({
                              ...data,
                              formations: data.formations.map((item) =>
                                item.id === form.id ? { ...item, hasAttestation: e.target.checked } : item
                              ),
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Attestation obtenue</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200">
              Certifications ({data.certifications.length})
            </span>
            <button
              type="button"
              onClick={addCertification}
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une certification</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.certifications.map((cert, idx) => (
              <div
                key={cert.id || idx}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">
                    Certification #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCertification(cert.id)}
                    className="text-slate-500 hover:text-red-400 text-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={cert.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        certifications: data.certifications.map((item) =>
                          item.id === cert.id ? { ...item, title: e.target.value } : item
                        ),
                      })
                    }
                    placeholder="Intitulé"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) =>
                      setData({
                        ...data,
                        certifications: data.certifications.map((item) =>
                          item.id === cert.id ? { ...item, issuer: e.target.value } : item
                        ),
                      })
                    }
                    placeholder="Organisme émetteur"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    value={cert.date || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        certifications: data.certifications.map((item) =>
                          item.id === cert.id ? { ...item, date: e.target.value } : item
                        ),
                      })
                    }
                    placeholder="Date d’obtention"
                    className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Contact & Links Tab */}
      {activeTab === 'links' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lien GitHub
              </label>
              <input
                type="text"
                value={data.links?.github || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    links: { ...(data.links || {}), github: e.target.value },
                  })
                }
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lien LinkedIn
              </label>
              <input
                type="text"
                value={data.links?.linkedin || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    links: { ...(data.links || {}), linkedin: e.target.value },
                  })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Site web / Portfolio externe
              </label>
              <input
                type="text"
                value={data.links?.website || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    links: { ...(data.links || {}), website: e.target.value },
                  })
                }
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Autre lien (Facebook, Instagram, etc.)
              </label>
              <input
                type="text"
                value={data.links?.facebook || ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    links: { ...(data.links || {}), facebook: e.target.value },
                  })
                }
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
