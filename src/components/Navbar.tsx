import React, { useState, useEffect } from 'react';
import { FileText, Mail, Sparkles, User as UserIcon, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  onOpenPrint: () => void;
  onNavigate?: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPrint, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
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
        {/* Organisation fluide avec sélecteur de langue compact      */}
        {/* ========================================================= */}
        <div className="sm:hidden flex flex-col gap-2">
          {/* Ligne 1 : Identité à gauche + Actions rapides à droite */}
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            {/* Logo / Identité */}
            <a
              href="#accueil"
              className="flex items-center gap-1.5 text-white font-bold text-xs tracking-tight hover:text-blue-400 transition-colors shrink-0 min-w-0"
              title={`${currentName} - ${t('nav.home')}`}
            >
              <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-extrabold text-white shadow-xs shrink-0">
                {initials}
              </span>
              <span className="font-heading truncate max-w-[110px] min-[380px]:max-w-[140px] text-slate-100">
                {currentName}
              </span>
            </a>

            {/* Actions secondaires + Sélecteur de langue */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Sélecteur de langue mobile FR / EN */}
              <div
                id="lang-switcher-mobile"
                className="inline-flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5 text-[10px] font-bold shrink-0 shadow-xs"
                role="group"
                aria-label="Sélecteur de langue"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('fr')}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    language === 'fr' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Français"
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    language === 'en' ? 'bg-blue-600 text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

              {/* Bouton: Fiche CV */}
              <button
                type="button"
                onClick={onOpenPrint}
                id="btn-nav-print-mobile"
                title={t('nav.resume')}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-750 active:bg-slate-700 rounded-lg border border-slate-700 shadow-xs transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="hidden min-[360px]:inline">{t('nav.resume')}</span>
              </button>

              {/* Bouton: Me contacter */}
              <a
                href="#contact"
                id="btn-nav-contact-mobile"
                title={t('nav.contact')}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-lg shadow-xs transition-all whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{t('nav.contact')}</span>
              </a>
            </div>
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
            className="flex items-center gap-2 text-white font-bold text-sm tracking-tight hover:text-blue-400 transition-colors"
            title={`${currentName} - ${t('nav.home')}`}
          >
            <span className="w-7 h-7 rounded-lg bg-blue-600/90 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              {initials}
            </span>
            <span className="font-heading">{currentName}</span>
          </a>

          {/* Boutons d'actions alignés à droite sur Desktop */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Sélecteur de langue Desktop FR / EN */}
            <div
              id="lang-selector-desktop"
              className="inline-flex items-center rounded-lg bg-slate-800/90 border border-slate-700/80 p-0.5 text-xs font-semibold shadow-xs mr-1"
              role="group"
              aria-label="Sélecteur de langue"
            >
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                id="btn-lang-fr"
                title="Passer en français"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs ${
                  language === 'fr'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>FR</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                id="btn-lang-en"
                title="Switch to English"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer text-xs ${
                  language === 'en'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>EN</span>
              </button>
            </div>

            {/* Bouton: Créer mon portfolio / Mon espace */}
            <button
              type="button"
              onClick={handleCreatePortfolioClick}
              id="btn-nav-create-portfolio"
              title={isAuthenticated ? t('nav.mySpace') : t('nav.createPortfolio')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 hover:border-slate-600 shadow-xs transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/90 rounded-lg border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FileText className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span>{t('nav.resume')}</span>
            </button>

            {/* Bouton: Me contacter */}
            <a
              href="#contact"
              id="btn-nav-contact"
              title={t('nav.contact')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.contact')}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};


