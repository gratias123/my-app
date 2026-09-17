import React, { useState, useEffect } from 'react';
import {
  Save,
  Check,
  Globe,
  Eye,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  FolderGit2,
  Code2,
} from 'lucide-react';
import { CustomPortfolioData } from '../../types/portfolioBuilder';
import { apiClient } from '../../services/apiClient';
import { AdminIdentityTab } from './portfolio/AdminIdentityTab';
import { AdminAboutTab } from './portfolio/AdminAboutTab';
import { AdminSkillsTab } from './portfolio/AdminSkillsTab';
import { AdminExperiencesTab } from './portfolio/AdminExperiencesTab';
import { AdminCurriculumTab } from './portfolio/AdminCurriculumTab';
import { AdminCertificationsTab } from './portfolio/AdminCertificationsTab';
import { AdminProjectsTab } from './portfolio/AdminProjectsTab';
import { AdminToolsTab } from './portfolio/AdminToolsTab';
import { AdminWikimediaTab } from './portfolio/AdminWikimediaTab';
import { AdminLinksTab } from './portfolio/AdminLinksTab';

interface AdminOwnerPortfolioEditorProps {
  onPreview: (data: CustomPortfolioData) => void;
  onOpenPrintCV: (data: CustomPortfolioData) => void;
}

type AdminTab =
  | 'identity'
  | 'about'
  | 'skills'
  | 'experiences'
  | 'curriculum'
  | 'certifications'
  | 'projects'
  | 'tools'
  | 'wikimedia'
  | 'links';

export const AdminOwnerPortfolioEditor: React.FC<AdminOwnerPortfolioEditorProps> = ({
  onPreview,
  onOpenPrintCV,
}) => {
  const [data, setData] = useState<CustomPortfolioData | null>(null);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('identity');

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
        setFeedbackNotice(
          targetStatus === 'published'
            ? 'Portfolio enregistré et publié en direct sur le site officiel !'
            : 'Modifications enregistrées sous forme de brouillon.'
        );
      } else {
        setFeedbackNotice('Erreur lors de l’enregistrement');
      }
    } catch (e: any) {
      setFeedbackNotice(e.message || 'Erreur lors de l’enregistrement');
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedbackNotice(null), 5000);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-400 text-xs">
        <Loader2 className="w-7 h-7 animate-spin text-blue-500 mb-3" />
        <span className="font-medium text-slate-300">
          Chargement de toutes les données du portfolio...
        </span>
      </div>
    );
  }

  const projectsCount = data.projects?.items?.length || 0;
  const toolsCount = data.tools?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white">
              Éditeur Centralisé du Portfolio (Base Admin)
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                status === 'published'
                  ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/80'
                  : 'bg-amber-950/70 text-amber-400 border-amber-800/80'
              }`}
            >
              {status === 'published' ? '● En ligne (Publié)' : '○ Brouillon privé'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Modifiez chaque section de votre portfolio en temps réel. Toute sauvegarde se reflète immédiatement sur le portfolio public et sur la Fiche CV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(data)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Aperçu public</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenPrintCV(data)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-300" />
            <span>Fiche CV</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(status === 'published' ? 'published' : 'draft')}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-300" />
            <span>Enregistrer</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span>Publier en direct</span>
          </button>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5 shadow-sm">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{feedbackNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-1 text-xs pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'identity'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Identité & Photo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'about'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Présentation & Bio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Compétences ({data.skills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'experiences'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Expériences ({data.experiences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Cursus & Formations</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'certifications'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certifications ({data.certifications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Projets ({projectsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tools')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'tools'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Outils & Logiciels ({toolsCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wikimedia')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'wikimedia'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Wikimedia & Libre</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'links'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Contact, Langues & Réseaux</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'identity' && (
        <AdminIdentityTab data={data} onChange={setData} />
      )}

      {activeTab === 'about' && (
        <AdminAboutTab data={data} onChange={setData} />
      )}

      {activeTab === 'skills' && (
        <AdminSkillsTab data={data} onChange={setData} />
      )}

      {activeTab === 'experiences' && (
        <AdminExperiencesTab data={data} onChange={setData} />
      )}

      {activeTab === 'curriculum' && (
        <AdminCurriculumTab data={data} onChange={setData} />
      )}

      {activeTab === 'certifications' && (
        <AdminCertificationsTab data={data} onChange={setData} />
      )}

      {activeTab === 'projects' && (
        <AdminProjectsTab data={data} onChange={setData} />
      )}

      {activeTab === 'tools' && (
        <AdminToolsTab data={data} onChange={setData} />
      )}

      {activeTab === 'wikimedia' && (
        <AdminWikimediaTab data={data} onChange={setData} />
      )}

      {activeTab === 'links' && (
        <AdminLinksTab data={data} onChange={setData} />
      )}
    </div>
  );
};
