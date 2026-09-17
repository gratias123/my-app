import React, { useRef } from 'react';
import { Camera, Upload, Trash2, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CustomPortfolioData } from '../../../types/portfolioBuilder';

interface AdminIdentityTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

const PRESET_PHOTOS = [
  { label: 'Photo officielle (PNG)', url: '/semako_official.png' },
  { label: 'Photo de profil standard', url: '/profile.png' },
  { label: 'Photo HD Déo-Gratias', url: '/semako-deo-gratias.jpg' },
  { label: 'Portrait alternatif', url: '/profile.jpg' },
];

export const AdminIdentityTab: React.FC<AdminIdentityTabProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateIdentity = (field: keyof CustomPortfolioData['identity'], val: string) => {
    onChange({
      ...data,
      identity: {
        ...data.identity,
        [field]: val,
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('L’image est trop volumineuse. Veuillez choisir une image de moins de 5 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        updateIdentity('photoUrl', base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Identité personnelle & Photo de profil</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Ces informations définissent votre profil officiel sur l’ensemble du portfolio et sur la fiche CV générée.
        </p>
      </div>

      {/* Photo Management Box */}
      <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
        <label className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
          Photo de profil officielle
        </label>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-blue-500/40 overflow-hidden flex items-center justify-center shadow-lg">
              {data.identity.photoUrl ? (
                <img
                  src={data.identity.photoUrl}
                  alt={data.identity.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-2">
                  <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500">Pas de photo</span>
                </div>
              )}
            </div>
            {data.identity.photoUrl && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white text-[10px]">
                <Check className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Action Buttons & Upload */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="admin-photo-upload"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Téléverser depuis l'appareil</span>
              </button>

              {data.identity.photoUrl && (
                <button
                  type="button"
                  onClick={() => updateIdentity('photoUrl', '')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-300 border border-slate-700 hover:border-red-800/80 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer la photo</span>
                </button>
              )}
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">
                Ou choisir l'une des photos officielles enregistrées dans le projet :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PHOTOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateIdentity('photoUrl', preset.url)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      data.identity.photoUrl === preset.url
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500 font-medium'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct URL input */}
            <div>
              <input
                type="text"
                value={data.identity.photoUrl}
                onChange={(e) => updateIdentity('photoUrl', e.target.value)}
                placeholder="Ou collez une URL d'image web (https://...)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Identity Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Nom complet <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={data.identity.name}
            onChange={(e) => updateIdentity('name', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Ex: SEMAKO Déo-Gratias"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Nom de marque / Label professionnel
          </label>
          <input
            type="text"
            value={data.identity.brandName || ''}
            onChange={(e) => updateIdentity('brandName', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Ex: GratiaLink"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Titre professionnel principal <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={data.identity.mainTitle}
            onChange={(e) => updateIdentity('mainTitle', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Ex: Étudiant en Informatique de Gestion | Technicien Informatique & GSM | Graphiste"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Adresse email officielle <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={data.identity.email}
            onChange={(e) => updateIdentity('email', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="semakodeogratias64@gmail.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Numéro de téléphone / WhatsApp <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={data.identity.phone}
            onChange={(e) => updateIdentity('phone', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="+229 01 54 81 21 00"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Localisation géographique
          </label>
          <input
            type="text"
            value={data.identity.location}
            onChange={(e) => updateIdentity('location', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            placeholder="Ex: Porto-Novo, Ouémé, Bénin"
          />
        </div>
      </div>
    </div>
  );
};
