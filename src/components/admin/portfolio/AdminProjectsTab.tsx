import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  FolderGit2,
  ExternalLink,
  Calendar,
  UserCheck,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Upload,
  Star,
  Layers,
  X,
  Sparkles,
  Link2,
} from 'lucide-react';
import { CustomPortfolioData, CustomProjectItem } from '../../../types/portfolioBuilder';
import { formatToolsList } from '../../../utils/toolUtils';

interface AdminProjectsTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({ data, onChange }) => {
  const projects = data.projects || { enabled: true, items: [] };

  // Track upload states
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [newGalleryUrl, setNewGalleryUrl] = useState<{ [projId: string]: string }>({});

  const toggleProjectsSection = (enabled: boolean) => {
    onChange({
      ...data,
      projects: {
        ...projects,
        enabled,
      },
    });
  };

  const addProject = () => {
    const newProject: CustomProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'Nouveau projet réalisé',
      role: 'Concepteur / Technicien',
      period: `${new Date().getFullYear()}`,
      description: 'Courte description des objectifs, du déroulement et des solutions apportées.',
      fullDescription:
        'Description détaillée de la réalisation : problématique initiale, démarche technique et créative, méthodologie de travail et valeur ajoutée.',
      tools: ['Photoshop', 'Canva', 'TypeScript'],
      results: 'Résultats concrets ou impact positif mesurable.',
      link: '',
      imageUrl: '',
      gallery: [],
      featured: false,
    };
    onChange({
      ...data,
      projects: {
        ...projects,
        enabled: true,
        items: [newProject, ...projects.items],
      },
    });
  };

  const removeProject = (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce projet de votre portfolio ?')) {
      return;
    }
    onChange({
      ...data,
      projects: {
        ...projects,
        items: projects.items.filter((p) => p.id !== id),
      },
    });
  };

  const updateProject = (id: string, updates: Partial<CustomProjectItem>) => {
    onChange({
      ...data,
      projects: {
        ...projects,
        items: projects.items.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      },
    });
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.items.length) return;

    const newItems = [...projects.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    onChange({
      ...data,
      projects: {
        ...projects,
        items: newItems,
      },
    });
  };

  // Upload handler for project main image or gallery
  const handleImageFile = async (
    projectId: string,
    file: File,
    target: 'cover' | 'gallery'
  ) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('L’image est trop volumineuse (maximum 8 Mo).');
      return;
    }

    setUploadingForId(projectId);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        let finalUrl = base64;

        // Try server upload endpoint to store a neat file path
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64,
              filename: file.name,
            }),
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.url) {
              finalUrl = json.url;
            }
          }
        } catch {
          // Fall back to base64 data URL seamlessly
        }

        const currentProj = projects.items.find((p) => p.id === projectId);
        if (target === 'cover') {
          updateProject(projectId, { imageUrl: finalUrl });
        } else if (currentProj) {
          const currentGallery = currentProj.gallery || [];
          updateProject(projectId, { gallery: [...currentGallery, finalUrl] });
        }

        setUploadingForId(null);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingForId(null);
      alert('Erreur lors du traitement de l’image.');
    }
  };

  const removeGalleryImage = (projectId: string, imgIdx: number) => {
    const currentProj = projects.items.find((p) => p.id === projectId);
    if (!currentProj) return;
    const gallery = (currentProj.gallery || []).filter((_, i) => i !== imgIdx);
    updateProject(projectId, { gallery });
  };

  const addGalleryFromUrl = (projectId: string) => {
    const url = (newGalleryUrl[projectId] || '').trim();
    if (!url) return;
    const currentProj = projects.items.find((p) => p.id === projectId);
    if (!currentProj) return;
    const gallery = [...(currentProj.gallery || []), url];
    updateProject(projectId, { gallery });
    setNewGalleryUrl({ ...newGalleryUrl, [projectId]: '' });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-blue-400" />
              <span>Projets & Réalisations ({projects.items.length})</span>
            </h3>

            <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={projects.enabled}
                onChange={(e) => toggleProjectsSection(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className={projects.enabled ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                {projects.enabled ? 'Section active' : 'Section masquée'}
              </span>
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gérez vos projets réels, ajoutez vos images de couverture (format 16:9), organisez vos galeries et contrôlez l’ordre d'affichage.
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un projet</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.items.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
            Aucun projet enregistré pour l'instant. Cliquez sur « Ajouter un projet » ci-dessus.
          </div>
        ) : (
          projects.items.map((proj, index) => {
            const hasCover = Boolean(proj.imageUrl && proj.imageUrl.trim());
            const gallery = proj.gallery || [];
            const isUploading = uploadingForId === proj.id;

            return (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-5 transition-all shadow-xs"
              >
                {/* Top Control Bar: Reordering, Featured, Delete */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                      {index + 1}
                    </span>

                    {/* Move controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveProject(index, 'up')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
                        title="Monter d'un rang"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === projects.items.length - 1}
                        onClick={() => moveProject(index, 'down')}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed"
                        title="Descendre d'un rang"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Featured toggle */}
                    <button
                      type="button"
                      onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        proj.featured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          proj.featured ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                      <span>{proj.featured ? 'À la une' : 'Standard'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    title="Supprimer ce projet"
                    onClick={() => removeProject(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 1. VISUAL ASSET MANAGEMENT (Image de couverture 16:9 & Galerie) */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      <span>Visuel de couverture principal (Format 16:9 recommandé)</span>
                    </label>

                    {hasCover && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Image active sur le portfolio</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Visual Preview Box (16:9) */}
                    <div className="md:col-span-5">
                      <div className="aspect-[16/9] w-full rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative group flex items-center justify-center shadow-inner">
                        {hasCover ? (
                          <>
                            <img
                              src={proj.imageUrl}
                              alt={proj.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                              <button
                                type="button"
                                onClick={() => updateProject(proj.id, { imageUrl: '' })}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-1.5" />
                            <span className="text-xs font-medium text-slate-400 block">
                              Aucune image de couverture
                            </span>
                            <span className="text-[10px] text-slate-500">
                              (Le portfolio affichera un placeholder sobre)
                            </span>
                          </div>
                        )}

                        {isUploading && (
                          <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-xs text-blue-400 font-medium">
                            Téléversement en cours...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image Controls: File upload & URL input */}
                    <div className="md:col-span-7 space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Option 1 : Téléverser depuis votre ordinateur ou téléphone
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-sm transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{hasCover ? "Remplacer l'image" : 'Choisir une image'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFile(proj.id, file, 'cover');
                                e.target.value = '';
                              }}
                            />
                          </label>

                          {hasCover && (
                            <button
                              type="button"
                              onClick={() => updateProject(proj.id, { imageUrl: '' })}
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                          Option 2 : Ou renseigner l'URL directe d'une image web
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={proj.imageUrl || ''}
                            onChange={(e) => updateProject(proj.id, { imageUrl: e.target.value })}
                            placeholder="https://... ou /uploads/..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Format recommandé : ratio 16:9 (ex: 1920×1080 ou 1280×720).
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. OPTIONAL PROJECT GALLERY (Multi-visuels pour la vue détaillée) */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>Galerie d'images supplémentaires ({gallery.length})</span>
                      </span>

                      <label className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer">
                        <Plus className="w-3 h-3" />
                        <span>Ajouter un visuel</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(proj.id, file, 'gallery');
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>

                    {gallery.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {gallery.map((imgUrl, gIdx) => (
                          <div
                            key={gIdx}
                            className="aspect-[16/9] w-24 rounded-lg overflow-hidden border border-slate-800 relative group bg-slate-950 shrink-0"
                          >
                            <img
                              src={imgUrl}
                              alt={`Galerie ${gIdx + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(proj.id, gIdx)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Supprimer cette image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. INFORMATIONS TEXTUELLES & DÉTAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Nom / Titre du projet *
                    </label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                      placeholder="Ex: GratiaLink — Identité visuelle & solutions graphiques"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Période / Date
                    </label>
                    <input
                      type="text"
                      value={proj.period || ''}
                      onChange={(e) => updateProject(proj.id, { period: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="Ex: 2024"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Votre rôle dans le projet
                    </label>
                    <input
                      type="text"
                      value={proj.role || ''}
                      onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Designer Graphique & Concepteur"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Lien du projet / Démo en ligne (URL)
                    </label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Short description (Card) */}
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Description courte (affichée sur la carte du portfolio)
                    </label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                      placeholder="Résumé concis de la réalisation en 2-3 phrases."
                    />
                  </div>

                  {/* Full description (Modal) */}
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Description complète & démarche (affichée dans la fiche détaillée)
                    </label>
                    <textarea
                      rows={3}
                      value={proj.fullDescription || ''}
                      onChange={(e) => updateProject(proj.id, { fullDescription: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                      placeholder="Développez la problématique, votre démarche méthodologique, les choix techniques ou graphiques opérés..."
                    />
                  </div>

                  {/* Context / Scope */}
                  <div className="sm:col-span-3">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Contexte & Enjeux (facultatif)
                    </label>
                    <input
                      type="text"
                      value={proj.context || ''}
                      onChange={(e) => updateProject(proj.id, { context: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Refonte complète d'une identité visuelle pour accroître la notoriété locale."
                    />
                  </div>

                  {/* Tools */}
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Technologies & Outils (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={formatToolsList(proj.tools)}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          tools: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-blue-300 focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="Photoshop, Canva, Figma, Typographie"
                    />
                  </div>

                  {/* Results */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Résultats ou Impact obtenu
                    </label>
                    <input
                      type="text"
                      value={proj.results || ''}
                      onChange={(e) => updateProject(proj.id, { results: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
                      placeholder="Ex: Identité validée, plus de 50 livrables réalisés"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
