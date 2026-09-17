import React, { useState } from 'react';
import { Link as LinkIcon, Plus, Trash2, Globe, Phone, Mail, MessageSquare, Heart, Languages } from 'lucide-react';
import { CustomPortfolioData } from '../../../types/portfolioBuilder';

interface AdminLinksTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

export const AdminLinksTab: React.FC<AdminLinksTabProps> = ({ data, onChange }) => {
  const [newInterest, setNewInterest] = useState('');

  const updateLink = (field: keyof CustomPortfolioData['links'], val: string) => {
    onChange({
      ...data,
      links: {
        ...data.links,
        [field]: val,
      },
    });
  };

  // Language helpers
  const addLanguage = () => {
    const langs = data.languages || [];
    onChange({
      ...data,
      languages: [
        ...langs,
        { id: `lang-${Date.now()}`, name: 'Nouvelle langue', level: 'Notions élémentaires' },
      ],
    });
  };

  const updateLanguage = (id: string, updates: { name?: string; level?: string }) => {
    const langs = data.languages || [];
    onChange({
      ...data,
      languages: langs.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    });
  };

  const removeLanguage = (id: string) => {
    const langs = data.languages || [];
    onChange({
      ...data,
      languages: langs.filter((l) => l.id !== id),
    });
  };

  // Interest helpers
  const addInterest = () => {
    if (!newInterest.trim()) return;
    const interests = data.interests || [];
    onChange({
      ...data,
      interests: [...interests, newInterest.trim()],
    });
    setNewInterest('');
  };

  const removeInterest = (index: number) => {
    const interests = (data.interests || []).filter((_, idx) => idx !== index);
    onChange({
      ...data,
      interests,
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Contact & Social Links */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-blue-400" />
            <span>Coordonnées de contact & Réseaux sociaux</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Liens directs accessibles depuis la barre de navigation, la section Contact et le pied de page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              WhatsApp (Lien wa.me ou numéro international)
            </label>
            <input
              type="text"
              value={data.links.whatsapp || ''}
              onChange={(e) => updateLink('whatsapp', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              placeholder="https://wa.me/2290154812100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Profil Facebook officiel
            </label>
            <input
              type="text"
              value={data.links.facebook || ''}
              onChange={(e) => updateLink('facebook', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              placeholder="https://www.facebook.com/..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Profil GitHub
            </label>
            <input
              type="text"
              value={data.links.github || ''}
              onChange={(e) => updateLink('github', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Profil LinkedIn
            </label>
            <input
              type="text"
              value={data.links.linkedin || ''}
              onChange={(e) => updateLink('linkedin', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Site web ou portfolio alternatif
            </label>
            <input
              type="text"
              value={data.links.website || ''}
              onChange={(e) => updateLink('website', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              placeholder="https://semako.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Profil Instagram
            </label>
            <input
              type="text"
              value={data.links.instagram || ''}
              onChange={(e) => updateLink('instagram', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              placeholder="https://instagram.com/..."
            />
          </div>
        </div>
      </div>

      {/* 2. Languages */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-400" />
              <span>Langues maîtrisées ({(data.languages || []).length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Indiquez les langues de travail et vos niveaux de pratique pour les recruteurs.
            </p>
          </div>

          <button
            type="button"
            onClick={addLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une langue</span>
          </button>
        </div>

        <div className="space-y-3">
          {(data.languages || []).length === 0 ? (
            <div className="p-6 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
              Aucune langue déclarée.
            </div>
          ) : (
            (data.languages || []).map((lang) => (
              <div
                key={lang.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3"
              >
                <div className="w-48">
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="Langue (ex: Français)"
                  />
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    value={lang.level}
                    onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                    placeholder="Niveau (ex: Langue de travail, Parlé couramment...)"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeLanguage(lang.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Interests / Hobbies */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Centres d'intérêt & Passions techniques ({(data.interests || []).length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Activités annexes et centres d'intérêt affichés en fin de Fiche CV.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest();
              }
            }}
            placeholder="Ex: Micro-électronique, Veille technologique, Typographie..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={addInterest}
            disabled={!newInterest.trim()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-white border border-slate-700 cursor-pointer"
          >
            Ajouter
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(data.interests || []).map((interest, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => removeInterest(idx)}
                className="text-slate-500 hover:text-red-400 cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
