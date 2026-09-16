import React, { useState, useEffect } from 'react';
import {
  CustomPortfolioData,
} from '../../types/portfolioBuilder';
import {
  StepIdentity,
  StepAbout,
  StepSkills,
  StepExperiences,
  StepEducation,
  StepFormations,
  StepCertifications,
  StepProjects,
  StepToolsAndLinks,
} from './BuilderSteps';
import {
  saveCustomPortfolioToStorage,
  loadCustomPortfolioFromStorage,
  clearCustomPortfolioStorage,
  encodePortfolioToUrl,
  EMPTY_STARTER_DATA,
} from '../../utils/portfolioModelAdapter';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { authService } from '../../services/authService';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  Sparkles,
  Eye,
  CheckCircle,
  CheckCircle2,
  Share2,
  Download,
  Upload,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Monitor,
  Smartphone,
  ExternalLink,
  LogOut,
  UserCheck,
  Globe,
  FileText,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface PortfolioBuilderProps {
  initialData?: CustomPortfolioData;
  onGeneratePortfolio: (data: CustomPortfolioData) => void;
  onBackToModel: () => void;
  onOpenPrintCV: (data: CustomPortfolioData) => void;
  onChange?: (data: CustomPortfolioData) => void;
  autoSaveNotification?: string | null;
  onNavigateHome?: () => void;
}

const STEPS = [
  { id: 1, label: 'Identité', short: 'Identité' },
  { id: 2, label: 'À propos', short: 'Présentation' },
  { id: 3, label: 'Compétences', short: 'Compétences' },
  { id: 4, label: 'Expériences', short: 'Expériences' },
  { id: 5, label: 'Cursus', short: 'Cursus' },
  { id: 6, label: 'Formations', short: 'Formations' },
  { id: 7, label: 'Certifications', short: 'Certifications' },
  { id: 8, label: 'Projets', short: 'Projets' },
  { id: 9, label: 'Outils & liens', short: 'Outils' },
  { id: 10, label: 'Génération', short: 'Générer' },
];

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({
  initialData,
  onGeneratePortfolio,
  onBackToModel,
  onOpenPrintCV,
  onChange,
  autoSaveNotification,
  onNavigateHome,
}) => {
  const { user, logout, saveUserPortfolio, userPortfolio } = useAuth();
  const { navigate } = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomPortfolioData>(() => {
    if (initialData) return initialData;
    if (userPortfolio?.data) return userPortfolio.data;
    const fromLocal = loadCustomPortfolioFromStorage();
    if (fromLocal && (fromLocal.identity.name || fromLocal.skills.length > 0)) {
      if (fromLocal.identity.name?.toLowerCase().includes('semako') || fromLocal.identity.email?.toLowerCase().includes('semako')) {
        clearCustomPortfolioStorage();
      } else {
        return fromLocal;
      }
    }
    const starter = JSON.parse(JSON.stringify(EMPTY_STARTER_DATA)) as CustomPortfolioData;
    if (user) {
      starter.identity.name = user.fullName;
      starter.identity.email = user.email;
    }
    return starter;
  });

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isReadyModalOpen, setIsReadyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  const userSlug = user?.slug || 'mon-portfolio';

  // Auto-save draft in localStorage & user isolated record without state churn
  useEffect(() => {
    saveCustomPortfolioToStorage(formData);
    if (user?.id) {
      authService.saveUserPortfolio(user.id, user.slug, formData, 'draft');
    }
    onChange?.(formData);
  }, [formData, user?.id, user?.slug, onChange]);

  const handleManualSave = () => {
    saveCustomPortfolioToStorage(formData);
    if (user) {
      saveUserPortfolio(formData, false);
    }
    onChange?.(formData);
    setSaveStatus('Informations enregistrées avec succès dans votre espace');
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleGenerate = () => {
    saveCustomPortfolioToStorage(formData);
    if (user) {
      saveUserPortfolio(formData, true);
    }
    onGeneratePortfolio(formData);
    setIsReadyModalOpen(true);
  };

  const handleReset = () => {
    clearCustomPortfolioStorage();
    const starter = JSON.parse(JSON.stringify(EMPTY_STARTER_DATA)) as CustomPortfolioData;
    if (user) {
      starter.identity.name = user.fullName;
      starter.identity.email = user.email;
    }
    setFormData(starter);
    onChange?.(starter);
    setShowResetConfirm(false);
    setCurrentStep(1);
    setSaveStatus('Formulaire réinitialisé');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio_${(formData.identity.name || 'custom').replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.identity && parsed.about) {
            setFormData(parsed);
            onChange?.(parsed);
            setSaveStatus('Configuration JSON importée avec succès');
            setTimeout(() => setSaveStatus(null), 3500);
          } else {
            alert('Le fichier JSON ne semble pas respecter le format de configuration du portfolio.');
          }
        } catch {
          alert('Impossible de lire le fichier JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCopyShareLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/portfolio/${userSlug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const progressPercentage = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/mon-espace')}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Retourner à mon espace personnel"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white font-heading leading-tight">
                  Créez votre portfolio professionnel
                </h1>
                {user && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    Bienvenue, {user.fullName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Espace privé de création • Aperçu interactif en direct de votre portfolio.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {autoSaveNotification ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-medium animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{autoSaveNotification}</span>
              </span>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-1 text-[11px] text-slate-400">
                <Save className="w-3 h-3 text-blue-400" />
                <span>Sauvegarde auto active</span>
              </span>
            )}

            <button
              type="button"
              onClick={onNavigateHome || (() => navigate('/'))}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer hidden lg:inline-flex"
            >
              Accueil
            </button>

            <button
              type="button"
              onClick={() => navigate('/mon-espace')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Mon espace personnel"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Mon espace</span>
            </button>

            <button
              type="button"
              onClick={handleManualSave}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
              title="Sauvegarder les modifications"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Enregistrer</span>
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Générer mon portfolio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/connexion');
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Step Workflow Progression Roadmap */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/80 hidden sm:grid grid-cols-6 gap-2 text-[10px]">
          <div className="flex items-center gap-1 text-slate-400">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px]">✓</span>
            <span className="truncate">1. Demande</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[9px]">✓</span>
            <span className="truncate">2. Compte lié</span>
          </div>
          <div className="flex items-center gap-1 text-blue-300 font-semibold">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px]">3</span>
            <span className="truncate">3. Remplissage</span>
          </div>
          <div className="flex items-center gap-1 text-blue-300">
            <span className="w-4 h-4 rounded-full bg-blue-900 text-blue-300 flex items-center justify-center font-bold text-[9px]">4</span>
            <span className="truncate">4. Prévisualisation</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[9px]">5</span>
            <span className="truncate">5. Génération</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[9px]">6</span>
            <span className="truncate">6. Partage / CV</span>
          </div>
        </div>

        {/* Save confirmation toast */}
        {saveStatus && (
          <div className="max-w-7xl mx-auto mt-2 px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}
      </header>

      {/* Mobile Mode Switcher (Formulaire vs Aperçu en direct) */}
      <div className="lg:hidden bg-slate-950/90 border-b border-slate-800 p-2 flex gap-2">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg text-center transition-colors ${
            mobileTab === 'editor'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-800/70 text-slate-300'
          }`}
        >
          Formulaire d'édition (Étape {currentStep}/10)
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-800/70 text-slate-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Aperçu en direct</span>
        </button>
      </div>

      {/* Main Split Layout: Editor (Left) & Real-time Live Preview (Right) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Stepper + Form */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-slate-900 border-r border-slate-800 overflow-y-auto ${
            mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Stepper progress bar */}
          <div className="p-4 sm:p-6 bg-slate-950/50 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="text-blue-400 font-heading">
                Étape {currentStep} sur {STEPS.length} — {STEPS[currentStep - 1].label}
              </span>
              <span>{progressPercentage}% complété</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Stepper Pills */}
            <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    currentStep === s.id
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : s.id < currentStep
                      ? 'bg-slate-800 text-blue-300 hover:bg-slate-700'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="mr-1 font-mono">{s.id}.</span>
                  <span>{s.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Step Body (Clean white card for high contrast inputs) */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xl">
              {currentStep === 1 && (
                <StepIdentity data={formData} onChange={setFormData} />
              )}
              {currentStep === 2 && (
                <StepAbout data={formData} onChange={setFormData} />
              )}
              {currentStep === 3 && (
                <StepSkills data={formData} onChange={setFormData} />
              )}
              {currentStep === 4 && (
                <StepExperiences data={formData} onChange={setFormData} />
              )}
              {currentStep === 5 && (
                <StepEducation data={formData} onChange={setFormData} />
              )}
              {currentStep === 6 && (
                <StepFormations data={formData} onChange={setFormData} />
              )}
              {currentStep === 7 && (
                <StepCertifications data={formData} onChange={setFormData} />
              )}
              {currentStep === 8 && (
                <StepProjects data={formData} onChange={setFormData} />
              )}
              {currentStep === 9 && (
                <StepToolsAndLinks data={formData} onChange={setFormData} />
              )}
              {currentStep === 10 && (
                <div className="space-y-6 animate-fade-in text-slate-900">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span>Section 10 — Prévisualisation & Génération</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Votre portfolio personnalisé est prêt. Choisissez vos options d'export et de diffusion.
                    </p>
                  </div>

                  {/* Summary recap */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200">
                      <span className="text-slate-500">Nom & Titre :</span>
                      <span className="font-semibold text-slate-900">
                        {formData.identity.name || '(Non renseigné)'} — {formData.identity.mainTitle || '(Non renseigné)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200">
                      <span className="text-slate-500">Sections renseignées :</span>
                      <span className="font-medium text-blue-700">
                        {formData.skills.length} compétences, {formData.experiences.length} expériences, {formData.certifications.length} certifications
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Projets :</span>
                      <span className="font-medium">
                        {formData.projects.enabled ? `${formData.projects.items.length} projet(s) affiché(s)` : 'Section masquée'}
                      </span>
                    </div>
                  </div>

                  {/* Main Generation Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onGeneratePortfolio(formData)}
                      className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                    >
                      <Eye className="w-5 h-5" />
                      <span>Afficher le portfolio en plein écran</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenPrintCV(formData)}
                      className="p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Printer className="w-5 h-5 text-blue-400" />
                      <span>Exporter la Fiche CV en PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyShareLink}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all border border-slate-300 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Lien copié dans le presse-papier !</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4 text-blue-600" />
                          <span>Copier le lien de partage</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all border border-slate-300 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                      <span>Télécharger la configuration (JSON)</span>
                    </button>
                  </div>

                  {/* Template helpers */}
                  <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2 justify-end items-center text-xs">
                    <label className="text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Importer un fichier JSON</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJson}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Step Navigation Controls */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    currentStep === 1
                      ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                {currentStep < STEPS.length ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onGeneratePortfolio(formData)}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer"
                  >
                    <span>Terminer & Générer</span>
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Preview */}
        <div
          className={`w-full lg:w-1/2 flex-col bg-slate-950 overflow-hidden ${
            mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview Toolbar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Aperçu interactif en direct</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-800 rounded-lg p-0.5 flex items-center border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${
                    previewDevice === 'desktop'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vue Ordinateur"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${
                    previewDevice === 'mobile'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vue Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onGeneratePortfolio(formData)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 cursor-pointer"
                title="Ouvrir en plein écran"
              >
                <span>Plein écran</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Live Preview Stage */}
          <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start bg-slate-950/80">
            <div
              className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden text-slate-900 ${
                previewDevice === 'mobile'
                  ? 'w-[360px] min-h-[640px] text-[11px]'
                  : 'w-full max-w-2xl min-h-[500px]'
              }`}
            >
              {/* Mini Simulated Header */}
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold text-xs font-heading truncate max-w-[180px]">
                  {formData.identity.name || 'Nom complet'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                    Fiche CV
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] text-white font-medium">
                    Me contacter
                  </span>
                </div>
              </div>

              {/* Mini Simulated Hero - Style CV Professionnel Moderne */}
              <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Photo Frame */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0 flex items-center justify-center md:self-center">
                    {formData.identity.photoUrl ? (
                      <img
                        src={formData.identity.photoUrl}
                        alt="Photo de profil"
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center text-slate-500 text-xs font-bold">
                        PHOTO
                      </div>
                    )}
                  </div>

                  {/* Identity text & Coordonnées (Droite) */}
                  <div className="flex-1 min-w-0 space-y-2 w-full">
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-white font-heading">
                        {formData.identity.name || 'Votre nom complet'}
                      </h2>
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                        {formData.identity.mainTitle || 'Votre titre professionnel'}
                      </p>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                        {formData.about.heroSummary || formData.about.tagline || 'Votre résumé professionnel s’affichera ici.'}
                      </p>
                    </div>

                    {/* Coordonnées sous la présentation */}
                    <div className="w-full bg-slate-800/60 rounded-lg p-2.5 border border-slate-700 text-[10px] space-y-1.5 text-slate-300">
                      <div className="font-bold text-[9px] uppercase tracking-wider text-slate-400 border-b border-slate-700/60 pb-1">
                        Coordonnées
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{formData.identity.email || 'email@exemple.com'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{formData.identity.phone || '+229 016 469 06 82'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{formData.identity.location || 'Porto-Novo, Bénin'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Sections */}
              <div className="p-5 space-y-6 text-xs text-slate-800 bg-white">
                {/* About presentation */}
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 mb-2 font-heading">
                    À propos
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {formData.about.presentation || 'Votre présentation détaillée apparaîtra dans cette section.'}
                  </p>
                </div>

                {/* Skills overview */}
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 mb-2 font-heading">
                    Compétences ({formData.skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-medium"
                      >
                        {s.name || `Compétence ${idx + 1}`}
                      </span>
                    ))}
                    {formData.skills.length === 0 && (
                      <span className="text-slate-400 italic text-[11px]">Aucune compétence renseignée</span>
                    )}
                  </div>
                </div>

                {/* Experiences overview */}
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 mb-2 font-heading">
                    Expériences ({formData.experiences.length})
                  </h3>
                  <div className="space-y-2">
                    {formData.experiences.slice(0, 3).map((exp, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                        <div className="font-bold text-slate-900">{exp.title || 'Intitulé de poste'}</div>
                        <div className="text-slate-500 text-[10px]">{exp.organization} • {exp.period}</div>
                        <div className="text-slate-600 text-[10px] mt-1 line-clamp-2">{exp.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formations & Certifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-[11px] mb-1">Formations</h4>
                    <p className="text-[10px] text-slate-600">
                      {formData.formations.length} formation(s) complémentaire(s)
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 text-[11px] mb-1">Certifications</h4>
                    <p className="text-[10px] text-slate-600">
                      {formData.certifications.length} certification(s) validée(s)
                    </p>
                  </div>
                </div>

                {/* Projects overview if enabled */}
                {formData.projects.enabled && (
                  <div>
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1 mb-2 font-heading">
                      Projets ({formData.projects.items.length})
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {formData.projects.items.map((p, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px]">
                          <div className="font-bold text-slate-900">{p.name || 'Projet'}</div>
                          <div className="text-slate-600 text-[10px]">{p.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Votre portfolio est prêt */}
      {isReadyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                Votre portfolio est prêt
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                Votre portfolio personnalisé a été généré et publié avec succès. Il est désormais consultable en ligne.
              </p>
            </div>

            {/* Public URL Box */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="block text-[11px] font-semibold text-slate-400">
                Lien public personnel :
              </span>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-mono text-xs text-blue-300 truncate flex-1 select-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/portfolio/${userSlug}` : `/portfolio/${userSlug}`}
                </span>
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copier le lien"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
            </div>

            {/* 4 Action buttons requested in section 12 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {/* 1. Voir mon portfolio */}
              <button
                type="button"
                onClick={() => navigate(`/portfolio/${userSlug}`)}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Voir mon portfolio</span>
              </button>

              {/* 2. Modifier */}
              <button
                type="button"
                onClick={() => setIsReadyModalOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>Modifier</span>
              </button>

              {/* 3. Télécharger ma fiche CV */}
              <button
                type="button"
                onClick={() => {
                  setIsReadyModalOpen(false);
                  onOpenPrintCV(formData);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Télécharger ma fiche CV</span>
              </button>

              {/* 4. Copier le lien */}
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Lien copié dans le presse-papier !' : 'Copier le lien public'}</span>
              </button>
            </div>

            {/* Back to dashboard button */}
            <div className="pt-2 text-center border-t border-slate-800">
              <button
                type="button"
                onClick={() => navigate('/mon-espace')}
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Aller à mon espace personnel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-heading">Confirmer la réinitialisation ?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toutes les informations actuellement saisies dans ce formulaire seront réinitialisées à zéro.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer"
              >
                Oui, réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
