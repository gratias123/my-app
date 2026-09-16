import React from 'react';
import {
  MapPin,
  Mail,
  Phone,
  ArrowDown,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface HeroProps {
  onExploreClick: () => void;
  onOpenPrint?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onOpenPrint }) => {
  const portfolio = usePortfolio();
  const data = portfolio?.data;
  const isCustom = portfolio?.isCustom ?? false;
  const handleOpenPrint = onOpenPrint || portfolio?.onOpenPrint;

  // Extraction dynamique des données du profil (aucun champ en dur)
  const photoUrl = data?.identity?.photoUrl?.trim() || '';
  const fullName = data?.identity?.name?.trim() || (isCustom ? 'Nom complet' : 'Nom complet');
  const rawTitle =
    data?.identity?.mainTitle?.trim() || (isCustom ? 'Titre professionnel' : '');
  // Assure un titre professionnel sans mention « CONFIRMÉ » et avec « UI/UX DESIGNER »
  const professionalTitle = rawTitle
    ? rawTitle
        .replace(/\s*CONFIRMÉ\s*/gi, '')
        .replace(/UI\s+DESIGNER/i, 'UI/UX DESIGNER')
        .trim()
    : '';
  const shortBio =
    data?.about?.heroSummary?.trim() ||
    data?.about?.tagline?.trim() ||
    (isCustom ? 'Présentation de votre parcours et de vos objectifs professionnels...' : '');
  const email = data?.identity?.email?.trim() || '';
  const phone = data?.identity?.phone?.trim() || '';
  const location = data?.identity?.location?.trim() || '';

  // Initiales dynamiques calculées pour l'avatar en cas d'absence de photo
  const initials = fullName
    ? fullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SD';

  return (
    <section
      id="accueil"
      className="relative bg-slate-900 text-white overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-16 lg:py-20 border-b border-slate-800"
    >
      {/* Background pattern discret */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-8 animate-fade-in-up">
          
          {/* ================================================================= */}
          {/* EN-TÊTE STYLE CV PROFESSIONNEL MODERNE                            */}
          {/* Composition centrée et aérée (max-w-[1040px] sur desktop)         */}
          {/* Grille desktop : 230px (Photo) + minmax(0, 1fr) (Informations)    */}
          {/* Android / Mobile : Empilement vertical strict 100% conservé       */}
          {/* ================================================================= */}
          <div
            id="hero-profile-container"
            className="w-full md:max-w-[840px] lg:max-w-[1040px] mx-auto box-border"
          >
            <div className="flex flex-col md:grid md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[230px_minmax(0,1fr)] md:items-start gap-6 md:gap-8 lg:gap-10 w-full">
              
              {/* ------------------------------------------------------------- */}
              {/* 1. COLONNE PHOTO (GAUCHE)                                     */}
              {/* Proportions naturelles, bordure discrète, placeholder discret */}
              {/* ------------------------------------------------------------- */}
              <div className="shrink-0 flex flex-col items-start md:items-center justify-start md:pt-1">
                <div
                  id="hero-profile-photo-container"
                  className="w-32 h-36 sm:w-36 sm:h-44 md:w-[200px] md:h-[260px] lg:w-[230px] lg:h-[295px] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/80 shadow-lg ring-1 ring-slate-700/50 shrink-0"
                >
                  {photoUrl ? (
                    <img
                      id="hero-profile-photo"
                      src={photoUrl}
                      alt={fullName}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      id="hero-profile-placeholder"
                      className="w-full h-full flex items-center justify-center text-slate-400 font-semibold text-xl sm:text-2xl font-heading bg-gradient-to-br from-slate-800 to-slate-850"
                    >
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. COLONNE DROITE : INFORMATIONS AVEC VRAIE RESPIRATION       */}
              {/* Contenu équilibré, lisibilité optimale, CV moderne            */}
              {/* Ordre strict : Nom ↓ Titre ↓ Présentation ↓ Coordonnées       */}
              {/* ------------------------------------------------------------- */}
              <div className="w-full max-w-full min-w-0 flex flex-col justify-start">
                
                {/* 1. Nom et prénom - Élément principal, fort et élégant */}
                <h1
                  id="hero-profile-name"
                  className="text-2xl sm:text-3xl md:text-[32px] lg:text-[34px] font-extrabold tracking-tight text-white font-heading leading-tight w-full max-w-full break-words md:mt-0.5"
                >
                  {fullName}
                </h1>

                {/* 2. Titre professionnel - TECHNICIEN INFORMATIQUE & UI/UX DESIGNER (sans CONFIRMÉ) */}
                {professionalTitle && (
                  <p
                    id="hero-profile-title"
                    className="text-xs sm:text-sm md:text-[15px] lg:text-[16px] font-bold text-blue-400 font-heading tracking-wide uppercase w-full max-w-full mt-1.5 sm:mt-2"
                  >
                    {professionalTitle}
                  </p>
                )}

                {/* 3. Présentation - Forme 2 lignes équilibrées sur desktop sans saut forcé */}
                {shortBio && (
                  <p
                    id="hero-profile-bio"
                    className="text-sm sm:text-base md:text-[15px] lg:text-[15.5px] text-slate-300 font-normal leading-[1.6] w-full max-w-[700px] mt-3 sm:mt-3.5"
                  >
                    {shortBio}
                  </p>
                )}

                {/* 4. Coordonnées - Hauteur compacte, espaces verticaux optimisés, lisibilité parfaite */}
                <div className="w-full max-w-full mt-4 sm:mt-4.5 box-border">
                  <div
                    id="hero-contact-card"
                    className="w-full max-w-full box-border bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-sm backdrop-blur-xs flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/70">
                      <span className="text-[11px] md:text-[11.5px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                        Coordonnées
                      </span>
                      <span
                        className="inline-block w-2 h-2 rounded-full bg-emerald-400"
                        title="Coordonnées vérifiées"
                      />
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      {/* Email */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] md:text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                            Email
                          </span>
                          {email ? (
                            <a
                              href={`mailto:${email}`}
                              id="hero-contact-email"
                              className="text-[13.5px] lg:text-[14px] font-medium text-slate-200 hover:text-blue-300 transition-colors break-all leading-snug"
                              title={`Envoyer un email à ${email}`}
                            >
                              {email}
                            </a>
                          ) : (
                            <span className="text-[13.5px] text-slate-500 italic">Non renseigné</span>
                          )}
                        </div>
                      </div>

                      {/* Téléphone */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] md:text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                            Téléphone
                          </span>
                          {phone ? (
                            <a
                              href={`tel:${phone.replace(/\s+/g, '')}`}
                              id="hero-contact-phone"
                              className="text-[13.5px] lg:text-[14px] font-medium text-slate-200 hover:text-blue-300 transition-colors leading-snug"
                              title={`Appeler le ${phone}`}
                            >
                              {phone}
                            </a>
                          ) : (
                            <span className="text-[13.5px] text-slate-500 italic">Non renseigné</span>
                          )}
                        </div>
                      </div>

                      {/* Localisation */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] md:text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider leading-none">
                            Localisation
                          </span>
                          <span
                            id="hero-contact-location"
                            className="text-[13.5px] lg:text-[14px] font-medium text-slate-200 leading-snug"
                          >
                            {location || 'Non renseignée'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ================================================================= */}
          {/* ACTIONS & NAVIGATION SECONDAIRE DU HERO                           */}
          {/* Aligné avec le conteneur centré du profil                         */}
          {/* ================================================================= */}
          <div className="w-full md:max-w-[840px] lg:max-w-[1040px] mx-auto pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Action : Voir mon parcours */}
              <button
                type="button"
                onClick={onExploreClick}
                id="btn-hero-explore"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 hover:shadow-lg focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer w-full sm:w-auto"
              >
                <span>Voir mon parcours</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>

              {/* Action : Fiche CV */}
              {handleOpenPrint && (
                <button
                  type="button"
                  onClick={handleOpenPrint}
                  id="btn-hero-print"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-colors border border-slate-700 hover:border-slate-600 focus:ring-2 focus:ring-slate-500 focus:outline-none w-full sm:w-auto cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 text-slate-300" />
                  <span>Fiche CV</span>
                </button>
              )}

              {/* Action : Me contacter */}
              <a
                href="#contact"
                id="btn-hero-contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 active:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-colors border border-slate-700 hover:border-slate-600 focus:ring-2 focus:ring-slate-500 focus:outline-none w-full sm:w-auto cursor-pointer shadow-xs"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Me contacter</span>
              </a>
            </div>

            {/* Statut de disponibilité professionnelle */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 sm:pt-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {location
                  ? `Disponible pour opportunités professionnelles & missions à ${location}.`
                  : 'Disponible pour opportunités professionnelles & missions.'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
