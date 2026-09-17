import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { CustomPortfolioData, CustomWikimediaData } from '../../../types/portfolioBuilder';

interface AdminWikimediaTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

const DEFAULT_WIKIMEDIA: CustomWikimediaData = {
  enabled: true,
  username: 'Semako64',
  contributionsUrl: 'https://commons.wikimedia.org/wiki/Special:Contributions/Semako64',
  profileUrl: 'https://commons.wikimedia.org/wiki/User:Semako64',
  title: 'Wikimedia',
  badge: 'Culture Libre & Communs',
  subtitle: 'Contribution & partage de connaissances',
  presentation:
    'Contributeur aux projets Wikimedia sous le pseudonyme « Semako64 ». Mon activité comprend notamment des contributions sur Wikimedia Commons.',
  showRecentUploads: true,
  paragraphs: [
    'L’engagement dans l’univers Wikimedia représente pour moi une passerelle essentielle entre la technique informatique et la responsabilité citoyenne du numérique. Plutôt que de rester simple consommateur passif d’Internet, contribuer permet d’agir concrètement pour la qualité de l’information accessible à tous.',
    'Cette démarche implique une rigueur méthodologique permanente : respect strict de la neutralité de point de vue, vérification scrupuleuse de sources admissibles et indépendantes, et structuration minutieuse des données pour les rendre interopérables et pérennes.',
  ],
  highlights: [
    { label: 'Wikimedia Commons', desc: 'Import et documentation de photographies et médias libres sous licence CC-BY-SA' },
    { label: 'Wikipédia & Wikidata', desc: 'Contributions aux données ouvertes et amélioration méthodique des contenus encyclopédiques' },
  ],
  links: [
    { label: 'Contributions Commons', url: 'https://commons.wikimedia.org/wiki/Special:Contributions/Semako64' },
    { label: 'Profil Utilisateur', url: 'https://commons.wikimedia.org/wiki/User:Semako64' },
  ],
};

export const AdminWikimediaTab: React.FC<AdminWikimediaTabProps> = ({ data, onChange }) => {
  const wikimedia = data.wikimedia || DEFAULT_WIKIMEDIA;

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const updateWikimedia = (updates: Partial<CustomWikimediaData>) => {
    onChange({
      ...data,
      wikimedia: {
        ...wikimedia,
        ...updates,
      },
    });
  };

  const handleTestApi = async () => {
    const userToTest = (wikimedia.username || 'Semako64').trim();
    setIsTesting(true);
    setTestResult(null);
    setTestError(null);

    try {
      const res = await fetch(`/api/wikimedia/stats?username=${encodeURIComponent(userToTest)}`);
      if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setTestResult(json);
      } else {
        setTestError(json.error || 'Erreur lors de la récupération des statistiques');
      }
    } catch (err: any) {
      setTestError(err.message || 'Impossible de joindre le serveur ou l’API Wikimedia');
    } finally {
      setIsTesting(false);
    }
  };

  const addParagraph = () => {
    const paras = wikimedia.paragraphs || [];
    updateWikimedia({
      paragraphs: [...paras, 'Nouveau paragraphe de réflexion ou d’engagement.'],
    });
  };

  const updateParagraph = (idx: number, val: string) => {
    const paras = [...(wikimedia.paragraphs || [])];
    paras[idx] = val;
    updateWikimedia({ paragraphs: paras });
  };

  const removeParagraph = (idx: number) => {
    const paras = (wikimedia.paragraphs || []).filter((_, i) => i !== idx);
    updateWikimedia({ paragraphs: paras });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Wikimedia / Contributions</span>
            </h3>

            <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={wikimedia.enabled}
                onChange={(e) => updateWikimedia({ enabled: e.target.checked })}
                className="rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className={wikimedia.enabled ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                {wikimedia.enabled ? 'Section active' : 'Section masquée'}
              </span>
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gérez votre présence Wikimedia, votre pseudonyme de contribution, vos statistiques en direct et vos téléversements Commons.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestApi}
          disabled={isTesting}
          className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium border border-blue-500/30 flex items-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
          <span>Tester la synchronisation API</span>
        </button>
      </div>

      {/* Live API Tester Banner */}
      {testResult && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Données API Wikimedia vérifiées pour « {testResult.username} »</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-slate-900/80 p-2 rounded border border-emerald-900/50">
              <span className="text-slate-400 block text-[10px]">Contributions</span>
              <span className="text-white font-bold text-sm">{testResult.editCount ?? 'N/A'}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-emerald-900/50">
              <span className="text-slate-400 block text-[10px]">Fichiers Commons</span>
              <span className="text-white font-bold text-sm">{testResult.uploadsCount ?? 'N/A'}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-emerald-900/50">
              <span className="text-slate-400 block text-[10px]">ID Utilisateur</span>
              <span className="text-white font-bold text-sm">{testResult.userId ?? 'N/A'}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-emerald-900/50">
              <span className="text-slate-400 block text-[10px]">Médias récents</span>
              <span className="text-white font-bold text-sm">{testResult.recentUploads?.length || 0} trouvés</span>
            </div>
          </div>
        </div>
      )}

      {testError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{testError}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Nom d'utilisateur Wikimedia (Pseudonyme)
          </label>
          <input
            type="text"
            value={wikimedia.username || 'Semako64'}
            onChange={(e) => updateWikimedia({ username: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            placeholder="Semako64"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Utilisé pour récupérer automatiquement les statistiques et contributions via l'API.
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            URL vers vos contributions
          </label>
          <input
            type="url"
            value={wikimedia.contributionsUrl || 'https://commons.wikimedia.org/wiki/Special:Contributions/Semako64'}
            onChange={(e) => updateWikimedia({ contributionsUrl: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="https://commons.wikimedia.org/wiki/Special:Contributions/Semako64"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Lien ouvert lors du clic sur le bouton « Voir mes contributions ».
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            URL du profil Wikimedia (optionnel)
          </label>
          <input
            type="url"
            value={wikimedia.profileUrl || 'https://commons.wikimedia.org/wiki/User:Semako64'}
            onChange={(e) => updateWikimedia({ profileUrl: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="https://commons.wikimedia.org/wiki/User:Semako64"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Badge d'en-tête
          </label>
          <input
            type="text"
            value={wikimedia.badge || 'Culture Libre & Communs'}
            onChange={(e) => updateWikimedia({ badge: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Culture Libre & Communs"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Titre de la section
          </label>
          <input
            type="text"
            value={wikimedia.title || 'Wikimedia'}
            onChange={(e) => updateWikimedia({ title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            placeholder="Wikimedia"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Sous-titre
          </label>
          <input
            type="text"
            value={wikimedia.subtitle || 'Contribution & partage de connaissances'}
            onChange={(e) => updateWikimedia({ subtitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            placeholder="Contribution & partage de connaissances"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Texte de présentation factuel
          </label>
          <textarea
            rows={2}
            value={
              wikimedia.presentation ||
              'Contributeur aux projets Wikimedia sous le pseudonyme « Semako64 ». Mon activité comprend notamment des contributions sur Wikimedia Commons.'
            }
            onChange={(e) => updateWikimedia({ presentation: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
            placeholder="Contributeur aux projets Wikimedia sous le pseudonyme..."
          />
          <span className="text-[10px] text-slate-500 mt-1 block">
            Formulation professionnelle et factuelle, sans qualificatifs non vérifiables.
          </span>
        </div>

        <div className="sm:col-span-2">
          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wikimedia.showRecentUploads !== false}
              onChange={(e) => updateWikimedia({ showRecentUploads: e.target.checked })}
              className="rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-white font-medium">
              Afficher automatiquement l'aperçu des contributions récentes (galerie dynamique de 3 à 6 téléversements Commons)
            </span>
          </label>
        </div>
      </div>

      {/* Paragraphs */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            Paragraphes narratifs & Réflexion citoyenne ({(wikimedia.paragraphs || []).length})
          </label>
          <button
            type="button"
            onClick={addParagraph}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Ajouter un paragraphe</span>
          </button>
        </div>

        {(wikimedia.paragraphs || []).map((p, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono flex items-center justify-center shrink-0 mt-2">
              {idx + 1}
            </span>
            <textarea
              rows={3}
              value={p}
              onChange={(e) => updateParagraph(idx, e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
            />
            <button
              type="button"
              title="Supprimer ce paragraphe"
              onClick={() => removeParagraph(idx)}
              className="p-2 text-slate-500 hover:text-red-400 rounded-lg cursor-pointer mt-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
