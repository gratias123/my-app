import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Calendar,
  UserCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Target,
  Award,
} from 'lucide-react';
import { CustomProjectItem } from '../../types/portfolioBuilder';
import { useLanguage } from '../../context/LanguageContext';
import { getToolName } from '../../utils/toolUtils';

interface ProjectDetailModalProps {
  project: CustomProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { isEn, t } = useLanguage();

  // Combine main image and gallery images into one list
  const allImages = React.useMemo(() => {
    if (!project) return [];
    const list: string[] = [];
    if (project.imageUrl && project.imageUrl.trim()) {
      list.push(project.imageUrl.trim());
    }
    if (project.gallery && Array.isArray(project.gallery)) {
      project.gallery.forEach((g) => {
        const clean = g.trim();
        if (clean && !list.includes(clean)) {
          list.push(clean);
        }
      });
    }
    return list;
  }, [project]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Reset active image when project changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [project?.id]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (allImages.length > 1) {
        if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) => (prev + 1) % allImages.length);
        } else if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, allImages.length]);

  if (!project) return null;

  const currentActiveImage = allImages[activeImageIndex] || project.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar with close button */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
              {project.role || (isEn ? 'Project Details' : 'Détails du projet')}
            </span>
            {project.featured && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                {t('projects.featured') || 'À la une'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('projects.closeModal') || 'Fermer'}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6 flex-1">
          {/* Visual Showcase (16:9 ratio) */}
          <div className="space-y-3">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 relative shadow-xs">
              {currentActiveImage ? (
                <img
                  src={currentActiveImage}
                  alt={project.name}
                  className="w-full h-full object-cover transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              ) : (
                /* Clean light aesthetic placeholder if no image exists */
                <div className="w-full h-full bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-200 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 shadow-sm border border-blue-100 flex items-center justify-center mb-3">
                    <Layers className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 font-heading">
                    {project.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    {project.role || (isEn ? 'Technical & Visual Project' : 'Réalisation technique & visuelle')}
                  </p>
                </div>
              )}

              {/* Prev / Next controls for gallery if more than 1 image */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title={isEn ? 'Previous image' : 'Image précédente'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs transition-colors cursor-pointer"
                    title={isEn ? 'Next image' : 'Image suivante'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-xs font-mono backdrop-blur-xs">
                    {activeImageIndex + 1} / {allImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Gallery thumbnails (if multiple visuals exist) */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-[16/9] w-20 sm:w-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Visuel ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Title & Meta Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mb-2">
              {project.period && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{project.period}</span>
                </span>
              )}
              {project.role && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-100">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{project.role}</span>
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
              {project.name}
            </h3>
          </div>

          {/* Full Description */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isEn ? 'Project Overview' : 'Présentation de la réalisation'}
            </h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line">
              {project.fullDescription || project.description}
            </p>
          </div>

          {/* Context / Scope (if defined) */}
          {project.context && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Target className="w-4 h-4 text-blue-600" />
                <span>{t('projects.context') || 'Contexte & Enjeux'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.context}
              </p>
            </div>
          )}

          {/* Results / Impact */}
          {project.results && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('projects.results') || 'Résultats & Impact concret'}</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                {project.results}
              </p>
            </div>
          )}

          {/* Tools & Technologies */}
          {project.tools && project.tools.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('projects.tools') || 'Technologies & Outils mobilisés'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tItem, idx) => {
                  const name = getToolName(tItem);
                  if (!name) return null;
                  return (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
          >
            {t('projects.closeModal') || 'Fermer'}
          </button>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer text-center group"
            >
              <span>{t('projects.liveDemo') || 'Consulter le projet en ligne'}</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
