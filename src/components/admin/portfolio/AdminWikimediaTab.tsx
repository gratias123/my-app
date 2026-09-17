import React from 'react';
import { Globe, Plus, Trash2, BookOpen, Database, Share2, Check } from 'lucide-react';
import { CustomPortfolioData, CustomWikimediaData } from '../../../types/portfolioBuilder';

interface AdminWikimediaTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

const DEFAULT_WIKIMEDIA: CustomWikimediaData = {
  enabled: true,
  title: 'Engagement dans la Culture Libre & Wikimedia',
  badge: 'Culture Libre & Partage',
  subtitle: 'Participer activement à la diffusion du savoir universel, structurer les données ouvertes et valoriser le patrimoine documentaire africain.',
  paragraphs: [
    'L’engagement dans l’univers Wikimedia représente pour moi une passerelle essentielle entre la technique informatique et la responsabilité citoyenne du numérique. Plutôt que de rester simple consommateur passif d’Internet, contribuer permet d’agir concrètement pour la qualité de l’information accessible à tous.',
    'Cette démarche implique une rigueur méthodologique permanente : respect strict de la neutralité de point de vue, vérification scrupuleuse de sources admissibles et indépendantes, et structuration minutieuse des données pour les rendre interopérables et pérennes.',
    'C’est également une formidable opportunité de valoriser les savoirs locaux, les personnalités, les institutions et les richesses culturelles du Bénin et d’Afrique sur les plateformes les plus consultées au monde.',
  ],
  highlights: [
    { label: 'Wikipédia', desc: 'Rédaction, relecture et vérification méthodique de sources documentaires vérifiables' },
    { label: 'Wikidata', desc: 'Alimentation du graphe mondial de données ouvertes et structurées' },
    { label: 'Culture Libre', desc: 'Partage du savoir sans barrière technique ou commerciale sous licences CC-BY-SA' },
    { label: 'Valorisation', desc: 'Documentation du patrimoine matériel et immatériel régional sur le web mondial' },
  ],
  links: [
    { label: 'Portail Wikimedia', url: 'https://meta.wikimedia.org' },
  ],
};

export const AdminWikimediaTab: React.FC<AdminWikimediaTabProps> = ({ data, onChange }) => {
  const wikimedia = data.wikimedia || DEFAULT_WIKIMEDIA;

  const updateWikimedia = (updates: Partial<CustomWikimediaData>) => {
    onChange({
      ...data,
      wikimedia: {
        ...wikimedia,
        ...updates,
      },
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Culture Libre & Mouvement Wikimedia</span>
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
            Personnalisez votre prise de parole, vos axes d'action et vos contributions au savoir libre universel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Badge d'en-tête
          </label>
          <input
            type="text"
            value={wikimedia.badge}
            onChange={(e) => updateWikimedia({ badge: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Culture Libre & Partage"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Titre de la section
          </label>
          <input
            type="text"
            value={wikimedia.title}
            onChange={(e) => updateWikimedia({ title: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            placeholder="Engagement dans la Culture Libre & Wikimedia"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Sous-titre explicatif
          </label>
          <input
            type="text"
            value={wikimedia.subtitle}
            onChange={(e) => updateWikimedia({ subtitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            placeholder="Participer activement à la diffusion du savoir..."
          />
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
