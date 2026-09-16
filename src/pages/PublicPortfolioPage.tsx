import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  ArrowLeft,
  Share2,
  Check,
  Copy,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { portfolioStorageService } from '../services/portfolioStorageService';
import { authService } from '../services/authService';
import { apiClient } from '../services/apiClient';
import { CustomPortfolioData } from '../types/portfolioBuilder';
import { decodePortfolioFromUrl } from '../utils/portfolioModelAdapter';
import { PortfolioProvider } from '../context/PortfolioContext';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { SkillsSection } from '../components/SkillsSection';
import { PracticalExperiences } from '../components/PracticalExperiences';
import { AcademicCurriculum } from '../components/AcademicCurriculum';
import { AdditionalTraining } from '../components/AdditionalTraining';
import { CertificationsSection } from '../components/CertificationsSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ToolsSection } from '../components/ToolsSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { PrintResumeModal } from '../components/PrintResumeModal';
import { useAuth } from '../context/AuthContext';

interface PublicPortfolioPageProps {
  slug?: string;
  onNavigate: (path: string) => void;
}

export const PublicPortfolioPage: React.FC<PublicPortfolioPageProps> = ({
  slug,
  onNavigate,
}) => {
  const { isAuthenticated } = useAuth();
  const [portfolioData, setPortfolioData] = useState<CustomPortfolioData | null>(null);
  const [ownerName, setOwnerName] = useState<string>('');
  const [notFound, setNotFound] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // 1. Check if URL contains encoded portfolio (?p=...)
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('p');
    if (encoded) {
      const decoded = decodePortfolioFromUrl(encoded);
      if (decoded && decoded.identity && decoded.identity.name) {
        setPortfolioData(decoded);
        setOwnerName(decoded.identity.name);
        return;
      }
    }

    // 2. Check slug in server repository
    if (slug) {
      let isMounted = true;
      apiClient
        .getPublicPortfolioBySlug(slug)
        .then((res) => {
          if (!isMounted) return;
          if (res.success && res.portfolio && res.portfolio.data) {
            setPortfolioData(res.portfolio.data);
            setOwnerName(res.portfolio.data.identity?.name || 'Profil public');
            return;
          }
          throw new Error('Non trouvé');
        })
        .catch(() => {
          if (!isMounted) return;
          // Fallback to local storage if offline or preview
          const localResult = portfolioStorageService.getPublicPortfolioBySlug(slug);
          if (localResult) {
            setPortfolioData(localResult.data);
            setOwnerName(localResult.data.identity.name || 'Profil public');
            return;
          }
          setNotFound(true);
        });

      return () => {
        isMounted = false;
      };
    }

    setNotFound(true);
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateClick = () => {
    if (isAuthenticated) {
      onNavigate('/creer-mon-portfolio');
    } else {
      onNavigate('/connexion');
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">
            Portfolio introuvable ou non publié
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Le portfolio recherché n'a pas encore été généré publiquement ou l'identifiant « {slug} » est incorrect.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Retour à l'accueil
            </button>
            <button
              type="button"
              onClick={handleCreateClick}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Créer mon portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
        Chargement du portfolio...
      </div>
    );
  }

  const contextValue = {
    data: portfolioData,
    isCustom: true,
    onOpenPrint: () => setIsPrintOpen(true),
    onOpenBuilder: handleCreateClick,
    onViewOriginalModel: () => onNavigate('/'),
  };

  return (
    <PortfolioProvider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        
        {/* Top Public Notification & Action Bar */}
        <header className="bg-slate-950 text-white border-b border-slate-800 px-4 py-2.5 sticky top-0 z-50 text-xs shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">
                Portfolio public de <strong className="text-white">{ownerName}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Lien copié' : 'Partager'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Fiche CV</span>
              </button>

              <button
                type="button"
                onClick={handleCreateClick}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Créer le mien</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs px-2 py-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Accueil</span>
              </button>
            </div>

          </div>
        </header>

        {/* Content Sections Rendering User's Custom Data */}
        <main className="flex-1">
          <Hero onExploreClick={() => {
            document.getElementById('a-propos')?.scrollIntoView({ behavior: 'smooth' });
          }} />
          <About />
          <SkillsSection />
          <PracticalExperiences />
          <AcademicCurriculum />
          <AdditionalTraining />
          <CertificationsSection />
          {portfolioData.projects?.enabled && <ProjectsSection />}
          <ToolsSection />
          <ContactSection />
        </main>

        <Footer
          onOpenGuide={() => {}}
          onOpenPrint={() => setIsPrintOpen(true)}
        />

        <BackToTop />

        <PrintResumeModal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          customData={portfolioData}
        />
      </div>
    </PortfolioProvider>
  );
};
