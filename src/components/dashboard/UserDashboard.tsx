import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import {
  Sparkles,
  Edit3,
  Eye,
  FileText,
  Share2,
  Copy,
  Check,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Globe,
  Clock,
  User,
  PlusCircle,
} from 'lucide-react';

interface UserDashboardProps {
  onOpenPrintCV: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onOpenPrintCV }) => {
  const { user, logout, userPortfolio, saveUserPortfolio } = useAuth();
  const { navigate } = useRouter();

  const [copiedLink, setCopiedLink] = useState(false);
  const [generateNotice, setGenerateNotice] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const userSlug = user.slug;
  const isPublished = userPortfolio?.status === 'published';
  const hasCustomized =
    userPortfolio &&
    (userPortfolio.data.identity.mainTitle !== '' ||
      userPortfolio.data.skills.length > 0 ||
      userPortfolio.data.experiences.length > 0 ||
      isPublished);

  // Generate public link
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicUrl = `${origin}/portfolio/${userSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleQuickPublish = () => {
    if (userPortfolio) {
      saveUserPortfolio(userPortfolio.data, true);
      setGenerateNotice('Votre portfolio est désormais publié et accessible publiquement.');
      setTimeout(() => setGenerateNotice(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
              {user.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white font-heading">
                  Bienvenue, {user.fullName}
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Espace personnel
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                {user.email} • Identifiant : <code className="text-blue-300">@{userSlug}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Accueil
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/connexion');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-950/60 border border-slate-800 hover:border-rose-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Notice alert */}
        {generateNotice && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-md">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{generateNotice}</span>
          </div>
        )}

        {/* Section: Mon portfolio */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Mon portfolio
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Gérez vos informations, prévisualisez et partagez votre lien public personnalisé.
              </p>
            </div>

            {/* Quick status badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isPublished
                    ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                    : 'bg-amber-950 border border-amber-700 text-amber-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPublished ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                {isPublished ? 'Portfolio prêt & publié' : 'Brouillon en cours'}
              </span>
            </div>
          </div>

          {/* Conditional state: Not yet created / freshly registered */}
          {!hasCustomized ? (
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 p-8 text-center space-y-5 shadow-xl max-w-2xl mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white font-heading">
                  Portfolio non encore créé
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Votre espace est initialisé. Renseignez vos compétences, vos expériences et votre parcours pour générer votre premier portfolio professionnel.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/creer-mon-portfolio')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 cursor-pointer hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Commencer la création de mon portfolio</span>
                </button>
              </div>
            </div>
          ) : (
            /* Created / in-progress state */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Main summary card */}
              <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-7 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-blue-600 border border-slate-700 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {userPortfolio?.data.identity.photoUrl ? (
                        <img
                          src={userPortfolio.data.identity.photoUrl}
                          alt={userPortfolio.data.identity.name}
                          className="w-full h-full object-cover object-top"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        user.fullName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                        {userPortfolio?.data.identity.name || user.fullName}
                      </h2>
                      <p className="text-xs sm:text-sm text-blue-400 font-medium">
                        {userPortfolio?.data.identity.mainTitle || 'Titre professionnel non défini'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {userPortfolio?.data.identity.location || 'Localisation non renseignée'}
                      </p>
                    </div>
                  </div>

                  {/* Public link copy pill */}
                  <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
                    <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-300 truncate max-w-[180px] sm:max-w-[200px]">
                      /portfolio/{userSlug}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copier le lien"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Content stats counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                    <span className="block text-xl font-extrabold text-white">
                      {userPortfolio?.data.skills.length || 0}
                    </span>
                    <span className="text-[11px] text-slate-400">Compétences</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                    <span className="block text-xl font-extrabold text-white">
                      {userPortfolio?.data.experiences.length || 0}
                    </span>
                    <span className="text-[11px] text-slate-400">Expériences</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                    <span className="block text-xl font-extrabold text-white">
                      {userPortfolio?.data.formations.length || 0}
                    </span>
                    <span className="text-[11px] text-slate-400">Formations</span>
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                    <span className="block text-xl font-extrabold text-white">
                      {userPortfolio?.data.certifications.length || 0}
                    </span>
                    <span className="text-[11px] text-slate-400">Certifications</span>
                  </div>
                </div>

                {/* Main Action Buttons Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/creer-mon-portfolio')}
                    className="flex items-center justify-center gap-2 p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Modifier mes informations</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/portfolio/${userSlug}`)}
                    className="flex items-center justify-center gap-2 p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                    <span>Prévisualiser / Voir mon portfolio</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickPublish}
                    className="flex items-center justify-center gap-2 p-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Générer & Publier mon portfolio</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenPrintCV}
                    className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Télécharger mon CV (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Side Info & Checklist */}
              <div className="lg:col-span-4 space-y-4">
                {/* Shareable Link Box */}
                <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm font-heading">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <span>Lien public de partage</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ce lien permet à toute personne ou recruteur d'accéder directement à votre portfolio personnalisé en ligne.
                  </p>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300 break-all">
                    {publicUrl}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Lien copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le lien</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/portfolio/${userSlug}`)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Ouvrir le portfolio"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Isolation & Data Architecture badge */}
                <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cloisonnement garanti</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Votre portfolio est strictement individuel, isolé et sécurisé. Vos modifications n'affectent aucun autre profil ni le portfolio d'accueil.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>

      </main>
    </div>
  );
};
