import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { UserPortfolioRecord } from '../types/auth';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { PortfolioProvider } from '../context/PortfolioContext';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { About } from './About';
import { SkillsSection } from './SkillsSection';
import { PracticalExperiences } from './PracticalExperiences';
import { AcademicCurriculum } from './AcademicCurriculum';
import { AdditionalTraining } from './AdditionalTraining';
import { CertificationsSection } from './CertificationsSection';
import { ProjectsSection } from './ProjectsSection';
import { ToolsSection } from './ToolsSection';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { PrintResumeModal } from './PrintResumeModal';
import { DeploymentGuideModal } from './DeploymentGuideModal';
import { Sparkles, Edit3, ArrowLeft, Globe, Share2, Copy, Check, UserCheck, AlertCircle } from 'lucide-react';

interface PublicPortfolioViewProps {
  slug: string;
}

export const PublicPortfolioView: React.FC<PublicPortfolioViewProps> = ({ slug }) => {
  const { user } = useAuth();
  const { navigate } = useRouter();

  const [portfolioRecord, setPortfolioRecord] = useState<UserPortfolioRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setLoading(true);
    const rec = authService.getPortfolioBySlug(slug);
    setPortfolioRecord(rec);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const isOwner = user && portfolioRecord && user.id === portfolioRecord.userId;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!portfolioRecord) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">Portfolio introuvable</h1>
        <p className="text-sm text-slate-400 max-w-md mb-6">
          Aucun portfolio public n'est associé à l'adresse <code className="text-amber-300">/portfolio/{slug}</code>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Retourner à l'accueil
          </button>
          <button
            type="button"
            onClick={() => navigate('/connexion')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Créer mon propre portfolio
          </button>
        </div>
      </div>
    );
  }

  const customData = portfolioRecord.data;

  const portfolioContextValue = {
    data: customData,
    isCustom: true,
    onOpenPrint: () => setIsPrintOpen(true),
    onOpenBuilder: () => {
      if (isOwner) {
        navigate('/creer-mon-portfolio');
      } else {
        navigate('/connexion');
      }
    },
    onViewOriginalModel: () => navigate('/'),
  };

  return (
    <PortfolioProvider value={portfolioContextValue}>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-[100vw] overflow-x-hidden">
        
        {/* Owner Management Bar if logged in as the creator */}
        {isOwner ? (
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 shadow-md sticky top-0 z-50 text-xs font-medium border-b border-blue-600">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>
                  Vous visualisez votre <strong>portfolio public en ligne</strong> (<code>/portfolio/{slug}</code>)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/creer-mon-portfolio')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modifier</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/mon-espace')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 hover:bg-white/25 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Mon espace</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/25 hover:bg-black/40 rounded-md text-xs text-blue-100 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Lien copié' : 'Partager'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Visitor notice banner with model link & create link */
          <div className="bg-slate-900 text-slate-300 px-4 py-2 border-b border-slate-800 text-xs">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Portfolio officiel de <strong>{customData.identity.name}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Accueil
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/connexion')}
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Créer mon portfolio</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Standard Navigation */}
        <Navbar onOpenPrint={() => setIsPrintOpen(true)} />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('a-propos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <About />
          <SkillsSection />
          <PracticalExperiences />
          <AcademicCurriculum />
          <AdditionalTraining />
          <CertificationsSection />
          {customData.projects.enabled && <ProjectsSection />}
          <ToolsSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenPrint={() => setIsPrintOpen(true)}
        />

        {/* Floating Back to top */}
        <BackToTop />

        {/* Modals */}
        <PrintResumeModal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          customData={customData}
        />

        <DeploymentGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />
      </div>
    </PortfolioProvider>
  );
};
