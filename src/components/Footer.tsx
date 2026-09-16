import React from 'react';
import { ArrowUp, ShieldCheck, Facebook, MessageCircle } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenGuide: () => void;
  onOpenPrint: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrint, onNavigate }) => {
  const { data, isCustom } = usePortfolio();
  const { isEn, t } = useLanguage();

  const currentName = isCustom ? (data.identity.name || '') : PERSONAL_INFO.name;
  const currentTitle = isCustom
    ? (data.identity.mainTitle || '')
    : (isEn ? 'IT TECHNICIAN & UI/UX DESIGNER' : PERSONAL_INFO.mainTitle);
  const currentLocation = isCustom
    ? (data.identity.location || '')
    : (isEn ? 'Porto-Novo, Benin' : PERSONAL_INFO.location);
  const currentEmail = isCustom ? (data.identity.email || '') : PERSONAL_INFO.email;
  const currentPhone = isCustom ? (data.identity.phone || '') : PERSONAL_INFO.phone;
  const currentPhoto = isCustom ? data.identity.photoUrl : PERSONAL_INFO.photoUrl;

  const facebookUrl = isCustom
    ? (data.links?.facebook || PERSONAL_INFO.facebookUrl)
    : PERSONAL_INFO.facebookUrl;

  const whatsappUrl = isCustom
    ? (data.links?.whatsapp || PERSONAL_INFO.whatsappUrl)
    : PERSONAL_INFO.whatsappUrl;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal animation="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
            
            {/* Identity column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-600 border border-slate-700 flex items-center justify-center text-white font-bold text-base shrink-0">
                  {currentPhoto ? (
                    <img
                      src={currentPhoto}
                      alt={currentName}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    currentName.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'CV'
                  )}
                </div>
                <div>
                  <span className="text-lg font-bold text-white font-heading block leading-tight">
                    {currentName}
                  </span>
                  <span className="text-xs text-blue-400 font-medium">
                    {currentTitle}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                {isCustom
                  ? (data.about.heroSummary || (isEn ? 'Professional portfolio created in builder.' : 'Portfolio professionnel créé dans le générateur.'))
                  : (isEn
                      ? 'Multidisciplinary digital profile: computer installations & hardware maintenance, smartphone (GSM) diagnostics, visual design, UI/UX, and open knowledge initiatives.'
                      : 'Profil numérique polyvalent : installations et maintenance en informatique, maintenance de smartphones (GSM), création graphique, UI/UX et diffusion de la connaissance libre.')}
              </p>

              {currentLocation && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{currentLocation}</span>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-heading">
                {isEn ? 'Portfolio Navigation' : 'Plan du portfolio'}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a href="#accueil" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.home')}
                </a>
                <a href="#a-propos" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.about')}
                </a>
                <a href="#competences" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.skills')}
                </a>
                <a href="#experiences" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.experiences')}
                </a>
                <a href="#cursus" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.curriculum')}
                </a>
                <a href="#formations" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.trainings')}
                </a>
                <a href="#certifications" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.certifications')}
                </a>
                {!isCustom && (
                  <a href="#wikimedia" className="text-slate-400 hover:text-white transition-colors">
                    • {t('nav.wikimedia')}
                  </a>
                )}
                {isCustom && data.projects.enabled && (
                  <a href="#projets" className="text-slate-400 hover:text-white transition-colors">
                    • {t('nav.projects')}
                  </a>
                )}
                <a href="#outils" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.tools')}
                </a>
                <a href="#contact" className="text-slate-400 hover:text-white transition-colors">
                  • {t('nav.contact')}
                </a>
              </div>
            </div>

            {/* Contact & Tools Links */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-heading">
                {isEn ? 'Resources & Access' : 'Ressources & Accès'}
              </span>
              
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={onOpenPrint}
                  className="block text-left text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                >
                  → {isEn ? 'Resume PDF / Print Sheet' : 'Fiche CV (Imprimer / PDF)'}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate?.('/admin')}
                  id="footer-admin-link"
                  className="block text-left text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-xs"
                >
                  🔒 {isEn ? 'Owner Administration Space' : 'Espace Administration (Gestion)'}
                </button>

                {currentEmail && (
                  <a
                    href={`mailto:${currentEmail}`}
                    className="block text-slate-400 hover:text-white transition-colors truncate"
                  >
                    {currentEmail}
                  </a>
                )}

                {currentPhone && (
                  <a
                    href={`tel:${currentPhone.replace(/\s+/g, '')}`}
                    className="block text-slate-400 hover:text-white transition-colors"
                  >
                    {currentPhone}
                  </a>
                )}

                {/* Social links */}
                {(facebookUrl || whatsappUrl) && (
                  <div className="pt-2 flex items-center gap-2">
                    {facebookUrl && (
                      <a
                        href={facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="footer-social-facebook"
                        title="Facebook"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 border border-slate-800 hover:border-blue-500/40 transition-colors text-xs"
                      >
                        <Facebook className="w-3.5 h-3.5 text-blue-400" />
                        <span>Facebook</span>
                      </a>
                    )}

                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id="footer-social-whatsapp"
                        title="WhatsApp"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 transition-colors text-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {isCustom
                ? (currentName ? (isEn ? `Professional Portfolio of ${currentName}` : `Portfolio professionnel de ${currentName}`) : 'Portfolio professionnel généré')
                : (isEn ? 'Verified & authentic profile content • SEMAKO Déo-Gratias' : 'Contenu vérifié et authentique • SEMAKO Déo-Gratias')}
            </span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            id="btn-scroll-to-top"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <span>{isEn ? 'Back to top' : 'Haut de page'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
