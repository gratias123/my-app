import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  ExternalLink,
  Save,
  X,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PortfolioBuilder } from '../components/builder/PortfolioBuilder';
import { portfolioStorageService, createDefaultUserPortfolio } from '../services/portfolioStorageService';
import { CustomPortfolioData } from '../types/portfolioBuilder';

interface CreatePortfolioPageProps {
  onNavigate: (path: string) => void;
  onOpenPrintCV: (data: CustomPortfolioData) => void;
}

const getDraftKey = (userId: string) => `portfolio_draft_${userId}`;
const getDraftTimeKey = (userId: string) => `portfolio_draft_${userId}_time`;
const getLegacyDraftKey = (userId: string) => `pl_draft_portfolio_${userId}`;
const getLegacyDraftTimeKey = (userId: string) => `pl_draft_portfolio_${userId}_time`;

export const CreatePortfolioPage: React.FC<CreatePortfolioPageProps> = ({
  onNavigate,
  onOpenPrintCV,
}) => {
  const { user, saveUserPortfolio } = useAuth();
  const [portfolioData, setPortfolioData] = useState<CustomPortfolioData | null>(null);
  const [isGeneratedModalOpen, setIsGeneratedModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [autoSaveNotification, setAutoSaveNotification] = useState<string | null>(null);
  const [draftRestoredNotice, setDraftRestoredNotice] = useState<string | null>(null);

  // Indicateur pour s'assurer que le premier chargement est terminé avant de déclencher l'auto-save
  const isInitializedRef = useRef(false);

  // Keep a ref of latest in-progress draft for beforeunload flush
  const latestDraftRef = useRef<CustomPortfolioData | null>(null);

  // Load user draft from localStorage on mount (preserves typed data on accidental refresh)
  useEffect(() => {
    if (!user) return;

    const draftKey = getDraftKey(user.id);
    const legacyDraftKey = getLegacyDraftKey(user.id);
    const timeKey = getDraftTimeKey(user.id);
    const legacyTimeKey = getLegacyDraftTimeKey(user.id);
    let data: CustomPortfolioData | null = null;
    let isDraft = false;
    let savedTimeFormatted = '';

    // 1. Priorité 1 : Vérifier s'il existe un brouillon auto-sauvegardé dans localStorage
    try {
      const rawDraft = localStorage.getItem(draftKey) || localStorage.getItem(legacyDraftKey);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed && typeof parsed === 'object' && parsed.identity) {
          data = parsed as CustomPortfolioData;
          isDraft = true;

          const rawTime = localStorage.getItem(timeKey) || localStorage.getItem(legacyTimeKey);
          if (rawTime) {
            try {
              const d = new Date(rawTime);
              savedTimeFormatted = d.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              });
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (e) {
      console.warn('Erreur lors de la récupération du brouillon localStorage', e);
    }

    // 2. Priorité 2 : Si aucun brouillon local, charger le portfolio utilisateur enregistré
    if (!data) {
      data = portfolioStorageService.getUserPortfolio(user.id);
    }

    // 3. Priorité 3 : Si premier accès, initialiser un portfolio vierge pour cet utilisateur
    if (!data) {
      data = createDefaultUserPortfolio(user);
      portfolioStorageService.saveUserPortfolio(user.id, data, user.slug);
    }

    setPortfolioData(data);
    latestDraftRef.current = data;
    isInitializedRef.current = true;

    if (isDraft) {
      setDraftRestoredNotice(
        savedTimeFormatted
          ? `Vos données saisies ont été restaurées automatiquement depuis votre navigateur (sauvegardées à ${savedTimeFormatted}).`
          : 'Vos données saisies ont été restaurées automatiquement depuis la sauvegarde locale de votre navigateur.'
      );
    }
  }, [user?.id]);

  // Hook useEffect explicite : surveille les changements dans portfolioData (le formulaire)
  // et les enregistre automatiquement dans localStorage sous la clé dédiée à l'utilisateur
  useEffect(() => {
    if (!isInitializedRef.current || !user?.id || !portfolioData) return;

    try {
      const draftKey = getDraftKey(user.id);
      const timeKey = getDraftTimeKey(user.id);
      const now = new Date();

      // Sauvegarde automatique dans localStorage sous la clé dédiée à l'utilisateur
      localStorage.setItem(draftKey, JSON.stringify(portfolioData));
      localStorage.setItem(timeKey, now.toISOString());

      // Sauvegarde miroir pour rétrocompatibilité
      localStorage.setItem(getLegacyDraftKey(user.id), JSON.stringify(portfolioData));
      localStorage.setItem(getLegacyDraftTimeKey(user.id), now.toISOString());

      latestDraftRef.current = portfolioData;

      // Mise à jour synchrone du portfolio utilisateur
      portfolioStorageService.saveUserPortfolio(user.id, portfolioData, user.slug);

      const timeStr = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setAutoSaveNotification(`Enregistré auto à ${timeStr}`);
    } catch (err) {
      console.error('Erreur sauvegarde automatique localStorage (useEffect):', err);
    }
  }, [portfolioData, user?.id, user?.slug]);

  // Callback de mise à jour déclenché par les saisies du constructeur
  const handleAutoSave = useCallback(
    (newData: CustomPortfolioData) => {
      setPortfolioData(newData);
      latestDraftRef.current = newData;
    },
    []
  );

  // Filet de sécurité supplémentaire : flush synchrone lors de beforeunload (F5 / fermeture d'onglet)
  useEffect(() => {
    if (!user) return;

    const handleBeforeUnload = () => {
      if (latestDraftRef.current) {
        try {
          const draftKey = getDraftKey(user.id);
          const timeKey = getDraftTimeKey(user.id);
          localStorage.setItem(draftKey, JSON.stringify(latestDraftRef.current));
          localStorage.setItem(timeKey, new Date().toISOString());
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?.id]);

  if (!user || !portfolioData) {
    return null;
  }

  const handleGeneratePortfolio = (finalData: CustomPortfolioData) => {
    latestDraftRef.current = finalData;
    setPortfolioData(finalData);

    if (user) {
      // Synchroniser le brouillon dans localStorage avec la version générée
      try {
        const draftKey = getDraftKey(user.id);
        const timeKey = getDraftTimeKey(user.id);
        localStorage.setItem(draftKey, JSON.stringify(finalData));
        localStorage.setItem(timeKey, new Date().toISOString());
        localStorage.setItem(getLegacyDraftKey(user.id), JSON.stringify(finalData));
        localStorage.setItem(getLegacyDraftTimeKey(user.id), new Date().toISOString());
      } catch (e) {
        console.error('Erreur synchronisation draft finale', e);
      }

      // Sauvegarde et publication du portfolio
      portfolioStorageService.saveUserPortfolio(user.id, finalData, user.slug);
      portfolioStorageService.publishUserPortfolio(user.id, user.slug);
      saveUserPortfolio(finalData, true).catch(() => {});
    }

    // Ouvrir la modale de succès
    setIsGeneratedModalOpen(true);
  };

  const publicUrl = `${window.location.origin}/portfolio/${user.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDiscardRestoredDraft = () => {
    if (!user) return;
    const draftKey = getDraftKey(user.id);
    const timeKey = getDraftTimeKey(user.id);
    const legacyDraftKey = getLegacyDraftKey(user.id);
    const legacyTimeKey = getLegacyDraftTimeKey(user.id);

    localStorage.removeItem(draftKey);
    localStorage.removeItem(timeKey);
    localStorage.removeItem(legacyDraftKey);
    localStorage.removeItem(legacyTimeKey);

    const fresh = createDefaultUserPortfolio(user);
    setPortfolioData(fresh);
    latestDraftRef.current = fresh;
    setDraftRestoredNotice(null);
    setAutoSaveNotification('Brouillon réinitialisé');
    setTimeout(() => setAutoSaveNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Draft Restored Banner */}
      {draftRestoredNotice && (
        <div className="bg-blue-950/95 border-b border-blue-800/80 px-4 sm:px-6 py-2.5 text-xs text-blue-200 flex flex-wrap items-center justify-between gap-3 animate-fade-in z-50 sticky top-0 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{draftRestoredNotice}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscardRestoredDraft}
              className="text-slate-400 hover:text-rose-300 text-xs px-2 py-1 rounded hover:bg-rose-950/40 transition-colors cursor-pointer inline-flex items-center gap-1"
              title="Effacer ce brouillon et repartir d'un formulaire vide"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Repartir à zéro</span>
            </button>
            <button
              type="button"
              onClick={() => setDraftRestoredNotice(null)}
              className="text-blue-300 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Conserver</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Builder Area */}
      <main className="flex-1">
        <PortfolioBuilder
          initialData={portfolioData}
          onGeneratePortfolio={handleGeneratePortfolio}
          onBackToModel={() => onNavigate('/mon-espace')}
          onOpenPrintCV={onOpenPrintCV}
          onChange={handleAutoSave}
          autoSaveNotification={autoSaveNotification}
          onNavigateHome={() => onNavigate('/')}
        />
      </main>

      {/* Success Modal: "Votre portfolio est prêt" */}
      {isGeneratedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Votre portfolio est prêt !
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                Votre portfolio a été généré et publié avec succès pour votre profil.
              </p>
            </div>

            {/* Public Link Copy Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Lien de partage public
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-blue-300 font-mono select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
            </div>

            {/* Actions: Voir mon portfolio, Modifier, Télécharger CV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsGeneratedModalOpen(false);
                  onNavigate(`/portfolio/${user.slug}`);
                }}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Voir mon portfolio</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGeneratedModalOpen(false)}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-blue-400" />
                <span>Modifier</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsGeneratedModalOpen(false);
                  if (portfolioData) {
                    onOpenPrintCV(portfolioData);
                  }
                }}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Fiche CV</span>
              </button>
            </div>

            {/* Dashboard redirect */}
            <div className="text-center pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsGeneratedModalOpen(false);
                  onNavigate('/mon-espace');
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Accéder à mon tableau de bord personnel →
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
