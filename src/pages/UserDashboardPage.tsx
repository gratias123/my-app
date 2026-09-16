import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  LogOut,
  Edit3,
  Eye,
  Sparkles,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Clock,
  ShieldCheck,
  ArrowRight,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { portfolioStorageService, createDefaultUserPortfolio } from '../services/portfolioStorageService';
import { CustomPortfolioData } from '../types/portfolioBuilder';
import { UserProfileRecord } from '../types/auth';

interface UserDashboardPageProps {
  onNavigate: (path: string) => void;
  onOpenPrintCV: (data: CustomPortfolioData) => void;
  onOpenLivePreview: (data: CustomPortfolioData) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onNavigate,
  onOpenPrintCV,
  onOpenLivePreview,
}) => {
  const { user, logout } = useAuth();
  const [profileRecord, setProfileRecord] = useState<UserProfileRecord | null>(null);
  const [portfolioData, setPortfolioData] = useState<CustomPortfolioData | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!user) return;
    const record = portfolioStorageService.getUserProfileRecord(user.id);
    setProfileRecord(record);

    let data = portfolioStorageService.getUserPortfolio(user.id);
    if (!data) {
      // Create initial default for this user
      data = createDefaultUserPortfolio(user);
      portfolioStorageService.saveUserPortfolio(user.id, data, user.slug);
    }
    setPortfolioData(data);
  }, [user?.id]);

  if (!user) {
    return null;
  }

  const isPublished = !!profileRecord?.isPublished;
  const publicUrl = `${window.location.origin}/portfolio/${user.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleGenerateClick = () => {
    if (user && portfolioData) {
      portfolioStorageService.publishUserPortfolio(user.id, user.slug);
      const updated = portfolioStorageService.getUserProfileRecord(user.id);
      setProfileRecord(updated);
    }
  };

  // 6-step progress calculation
  const hasCustomized = portfolioData && (
    portfolioData.identity.title !== '' ||
    portfolioData.skills.length > 0 ||
    portfolioData.experiences.length > 0
  );

  const steps = [
    { number: 1, title: 'Découverte', status: 'completed' },
    { number: 2, title: 'Authentification', status: 'completed' },
    { number: 3, title: 'Informations', status: hasCustomized ? 'completed' : 'current' },
    { number: 4, title: 'Prévisualisation', status: hasCustomized ? 'current' : 'upcoming' },
    { number: 5, title: 'Génération', status: isPublished ? 'completed' : 'upcoming' },
    { number: 6, title: 'Partage & CV', status: isPublished ? 'completed' : 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-sm">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block leading-tight">Espace Personnel</span>
              <span className="text-sm font-bold text-white font-heading">
                Bienvenue, {user.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Accueil</span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('/connexion');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-slate-700/80 hover:border-red-500/40 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 6-step progress pipeline */}
        <section className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Progression de création de votre portfolio
            </h2>
            <span className="text-xs text-blue-400 font-semibold">
              Étape {isPublished ? '6 / 6' : '3 / 6'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {steps.map((step) => {
              const isDone = step.status === 'completed';
              const isCurr = step.status === 'current';
              return (
                <div
                  key={step.number}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isCurr
                      ? 'bg-blue-600/15 border-blue-500/50 text-blue-200 ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[10px] uppercase tracking-wider">
                      Étape {step.number}
                    </span>
                    {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <p className="font-semibold text-slate-200 truncate">{step.title}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Status Card: Mon Portfolio */}
        <section className="bg-slate-950/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Espace Gestion
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Compte actif
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Mon portfolio
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {isPublished ? (
                  <span>
                    Votre portfolio est en ligne et accessible via votre lien public unique ou au format CV PDF.
                  </span>
                ) : (
                  <span>
                    Votre espace est initialisé. Remplissez vos compétences, expériences et formations pour générer votre portfolio.
                  </span>
                )}
              </p>
            </div>

            {/* Publication state badge */}
            <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
              {isPublished ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Portfolio publié & actif</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Portfolio non encore créé / brouillon</span>
                </div>
              )}

              {profileRecord?.lastModifiedAt && (
                <span className="text-[11px] text-slate-500">
                  Dernière mise à jour : {new Date(profileRecord.lastModifiedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>

          </div>

          {/* Action buttons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6">
            
            {/* 1. Modifier mes informations */}
            <button
              type="button"
              onClick={() => onNavigate('/creer-mon-portfolio')}
              id="btn-dash-edit"
              className="p-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/20 flex flex-col justify-between h-32 group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <Edit3 className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
                <ChevronRight className="w-4 h-4 text-blue-200" />
              </div>
              <div className="text-left">
                <p className="font-bold text-base">Modifier mes informations</p>
                <p className="text-xs text-blue-100 font-normal">Identité, expériences, compétences...</p>
              </div>
            </button>

            {/* 2. Prévisualiser */}
            <button
              type="button"
              onClick={() => {
                if (portfolioData) {
                  onOpenLivePreview(portfolioData);
                } else {
                  onNavigate('/creer-mon-portfolio');
                }
              }}
              id="btn-dash-preview"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex flex-col justify-between h-32 group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <Eye className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-base">Prévisualiser</p>
                <p className="text-xs text-slate-400 font-normal">Voir l'affichage dynamique complet</p>
              </div>
            </button>

            {/* 3. Générer mon portfolio */}
            <button
              type="button"
              onClick={() => {
                handleGenerateClick();
                onNavigate(`/portfolio/${user.slug}`);
              }}
              id="btn-dash-generate"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex flex-col justify-between h-32 group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-base">Générer mon portfolio</p>
                <p className="text-xs text-slate-400 font-normal">Publier et activer le lien unique</p>
              </div>
            </button>

            {/* 4. Télécharger mon CV */}
            <button
              type="button"
              onClick={() => {
                if (portfolioData) {
                  onOpenPrintCV(portfolioData);
                }
              }}
              id="btn-dash-cv"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs sm:text-sm transition-all flex flex-col justify-between h-32 group cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <FileText className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-base">Télécharger mon CV</p>
                <p className="text-xs text-slate-400 font-normal">Fiche A4 prête à imprimer ou PDF</p>
              </div>
            </button>

          </div>

          {/* Public Link Share Section (if published) */}
          {isPublished && (
            <div className="mt-8 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Votre lien de portfolio public
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">Accessible publiquement</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 select-all font-mono"
                />
                
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copié !' : 'Copier le lien'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate(`/portfolio/${user.slug}`)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Voir en ligne</span>
                </button>
              </div>
            </div>
          )}

        </section>

        {/* Architecture & Security transparency notice */}
        <section className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Architecture & Isolation des données</span>
          </div>
          <p className="leading-relaxed">
            Chaque compte utilisateur dispose de son propre identifiant unique (<strong>{user.id}</strong>) et de ses données totalement isolées des autres membres. Vos données sont privées, cloisonnées et sécurisées.
          </p>
        </section>

      </main>
    </div>
  );
};
