import React from 'react';
import { Sparkles, MessageSquare, Info, Clock } from 'lucide-react';
import { CustomPortfolioData } from '../../../types/portfolioBuilder';

interface AdminAboutTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

export const AdminAboutTab: React.FC<AdminAboutTabProps> = ({ data, onChange }) => {
  const updateAbout = (field: keyof CustomPortfolioData['about'], val: string) => {
    onChange({
      ...data,
      about: {
        ...data.about,
        [field]: val,
      },
    });
  };

  const updateAvailability = (val: string) => {
    onChange({
      ...data,
      availabilityNotice: val,
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Présentation, Slogan & Bio détaillée</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Rédigez ici vos textes de présentation visibles dans la section d'accueil (Hero), la section "À propos" et l'en-tête du CV.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Slogan d'accroche (Tagline Hero)
          </label>
          <input
            type="text"
            value={data.about.tagline}
            onChange={(e) => updateAbout('tagline', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Ex: Rigueur technique, créativité graphique & engagement communautaire."
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Phrase courte et percutante affichée sous le titre principal.
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Résumé d'introduction rapide (Pitch Hero)
          </label>
          <textarea
            rows={3}
            value={data.about.heroSummary}
            onChange={(e) => updateAbout('heroSummary', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
            placeholder="Court résumé professionnel de 2 à 4 phrases résumant votre proposition de valeur."
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Texte de présentation détaillé (Section "À propos de moi")
          </label>
          <textarea
            rows={8}
            value={data.about.presentation}
            onChange={(e) => updateAbout('presentation', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
            placeholder="Présentez votre parcours, vos motivations, votre méthode de travail, vos valeurs techniques et humaines..."
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Astuce : Séparez vos paragraphes par un double saut de ligne pour qu'ils s'affichent proprement sur le portfolio.
          </span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Avis de disponibilité & Déplacements</span>
          </label>
          <input
            type="text"
            value={data.availabilityNotice || ''}
            onChange={(e) => updateAvailability(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Ex: Disponible pour interventions en maintenance informatique, dépannage GSM et créations graphiques."
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Texte affiché dans le badge de statut et dans les modules d'accueil.
          </span>
        </div>
      </div>
    </div>
  );
};
