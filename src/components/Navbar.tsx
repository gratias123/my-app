import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';
import { PERSONAL_INFO } from '../data/portfolioData';
import semakoLogo from '../assets/images/semako_logo_1789639914967.jpg';

interface NavbarProps {
  onOpenPrint: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPrint, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  let currentName = PERSONAL_INFO.name;
  try {
    const portfolio = usePortfolio();
    if (portfolio?.isCustom && portfolio?.data?.identity?.name) {
      currentName = portfolio.data.identity.name;
    }
  } catch {
    currentName = PERSONAL_INFO.name;
  }

  const initials = currentName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SD';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCreatePortfolioClick = () => {
    if (onNavigate) {
      if (isAuthenticated) {
        onNavigate('/mon-espace');
      } else {
        onNavigate('/connexion');
      }
    } else {
      if (isAuthenticated) {
        router.navigate('/mon-espace');
      } else {
        router.navigate('/connexion');
      }
    }
  };

  const displayName = user?.fullName ? user.fullName.split(' ')[0] : 'Profil';

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 w-full max-w-[100vw] overflow-x-hidden ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md py-2 sm:py-3.5'
          : 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800/60 py-2.5 sm:py-4'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* 1. DISPOSITION MOBILE (Android & écrans < 640px)          */}
        {/* ========================================================= */}
        <div className="sm:hidden flex flex-col gap-2">
          {/* Ligne 1 : Identité à gauche + Fiche CV à droite */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            {/* Logo / Identité */}
            <a
              href="#accueil"
              className="flex items-center gap-1.5 text-white font-bold text-xs tracking-tight hover:text-blue-400 transition-colors shrink-0 min-w-0"
              title={`${currentName} - ${t('nav.home')}`}
            >
              <img
                src={semakoLogo}
                alt="Logo SEMAKO"
                className="w-6 h-6 rounded-md object-cover ring-1 ring-blue-500/50 shadow-xs shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="font-heading truncate max-w-[150px] min-[380px]:max-w-[190px] text-slate-100">
                {currentName}
              </span>
            </a>

            {/* Bouton: Fiche CV */}
            <button
              type="button"
              onClick={onOpenPrint}
              id="btn-nav-print-mobile"
              title={t('nav.resume')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-750 active:bg-slate-700 rounded-lg border border-slate-700 shadow-xs transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-blue-500 shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>{t('nav.resume')}</span>
            </button>
          </div>

          {/* Ligne 2 : « Créer mon portfolio » */}
          <button
            type="button"
            onClick={handleCreatePortfolioClick}
            id="btn-nav-create-portfolio-mobile"
            title={isAuthenticated ? t('nav.mySpace') : t('nav.createPortfolio')}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-750 active:bg-slate-700 rounded-lg border border-slate-700 hover:border-slate-600 shadow-xs transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isAuthenticated ? (
              <>
                <UserIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{t('nav.mySpace')} ({displayName})</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('nav.createPortfolio')}</span>
              </>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. DISPOSITION DESKTOP (sm: et plus)                     */}
        {/* ========================================================= */}
        <div className="hidden sm:flex sm:items-center sm:justify-between">
          {/* Identité sur Desktop */}
          <a
            href="#accueil"
            className="flex items-center gap-2.5 text-white font-bold text-sm tracking-tight hover:text-blue-400 transition-colors group"
            title={`${currentName} - ${t('nav.home')}`}
          >
            <img
              src={semakoLogo}
              alt="Logo SEMAKO"
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/50 shadow-xs group-hover:ring-blue-400 transition-all"
              referrerPolicy="no-referrer"
            />
            <span className="font-heading">{currentName}</span>
          </a>

          {/* Boutons d'actions alignés à droite sur Desktop */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Bouton: Créer mon portfolio / Mon espace */}
            <button
              type="button"
              onClick={handleCreatePortfolioClick}
              id="btn-nav-create-portfolio"
              title={isAuthenticated ? t('nav.mySpace') : t('nav.createPortfolio')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-slate-600 shadow-xs transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isAuthenticated ? (
                <>
                  <UserIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{t('nav.mySpace')} ({displayName})</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t('nav.createPortfolio')}</span>
                </>
              )}
            </button>

            {/* Bouton: Fiche CV */}
            <button
              type="button"
              onClick={onOpenPrint}
              id="btn-nav-print"
              title={t('nav.resume')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 rounded-lg border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>{t('nav.resume')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


