import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { SkillsSection } from './components/SkillsSection';
import { PracticalExperiences } from './components/PracticalExperiences';
import { AcademicCurriculum } from './components/AcademicCurriculum';
import { AdditionalTraining } from './components/AdditionalTraining';
import { CertificationsSection } from './components/CertificationsSection';
import { WikimediaSection } from './components/WikimediaSection';
import { ToolsSection } from './components/ToolsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { PrintResumeModal } from './components/PrintResumeModal';
import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider } from './context/RouterContext';
import { LanguageProvider } from './context/LanguageContext';
import { useAppRouter } from './hooks/useAppRouter';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { CreatePortfolioPage } from './pages/CreatePortfolioPage';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { AdminPage } from './pages/AdminPage';
import { SEMAKO_MODEL_DATA } from './utils/portfolioModelAdapter';
import { CustomPortfolioData } from './types/portfolioBuilder';
import { apiClient } from './services/apiClient';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { route, slug, navigate } = useAppRouter();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [printCustomData, setPrintCustomData] = useState<CustomPortfolioData | undefined>(undefined);
  const [redirectReason, setRedirectReason] = useState<string | null>(null);
  const [ownerPortfolioData, setOwnerPortfolioData] = useState<CustomPortfolioData>(SEMAKO_MODEL_DATA);

  // Load latest owner portfolio data from server
  useEffect(() => {
    let isMounted = true;
    apiClient
      .getOwnerPortfolio()
      .then((res) => {
        if (isMounted && res.success && res.portfolio && res.portfolio.data) {
          setOwnerPortfolioData(res.portfolio.data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Route protection enforcement for private views
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && (route === 'creer-mon-portfolio' || route === 'mon-espace')) {
      setRedirectReason('Connectez-vous pour accéder au créateur de portfolio.');
      navigate('/connexion', { replace: true });
    }
  }, [route, isAuthenticated, isLoading, navigate]);

  // Click on "Créer mon portfolio" from reference model view
  const handleCreatePortfolioClick = () => {
    if (isAuthenticated) {
      navigate('/creer-mon-portfolio');
    } else {
      setRedirectReason(null);
      navigate('/connexion');
    }
  };

  const handleOpenPrintResume = (data?: CustomPortfolioData) => {
    setPrintCustomData(data || undefined);
    setIsPrintOpen(true);
  };

  // 1. Login page route (/connexion)
  if (route === 'connexion') {
    return (
      <LoginPage
        onNavigate={navigate}
        redirectReason={redirectReason}
      />
    );
  }

  // 2. Register page route (/inscription)
  if (route === 'inscription') {
    return (
      <RegisterPage
        onNavigate={navigate}
      />
    );
  }

  // 3. User Dashboard route (/mon-espace) - Protected
  if (route === 'mon-espace') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
          Vérification des droits d'accès...
        </div>
      );
    }
    return (
      <>
        <UserDashboardPage
          onNavigate={navigate}
          onOpenPrintCV={handleOpenPrintResume}
          onOpenLivePreview={(data) => {
            handleOpenPrintResume(data);
          }}
        />
        <PrintResumeModal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          customData={printCustomData}
        />
      </>
    );
  }

  // 4. Create / Edit Portfolio route (/creer-mon-portfolio) - Protected
  if (route === 'creer-mon-portfolio') {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
          Vérification des droits d'accès...
        </div>
      );
    }
    return (
      <>
        <CreatePortfolioPage
          onNavigate={navigate}
          onOpenPrintCV={handleOpenPrintResume}
        />
        <PrintResumeModal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          customData={printCustomData}
        />
      </>
    );
  }

  // 5. Public Portfolio page route (/portfolio/:slug)
  if (route === 'public-portfolio') {
    return (
      <PublicPortfolioPage
        slug={slug}
        onNavigate={navigate}
      />
    );
  }

  // 6. Private Admin Management Space (/admin)
  if (route === 'admin') {
    return <AdminPage onNavigate={navigate} />;
  }

  // 7. Default Home View (/): SEMAKO Déo-Gratias Official Reference Portfolio
  const portfolioContextValue = {
    data: ownerPortfolioData,
    isCustom: false,
    onOpenPrint: () => handleOpenPrintResume(ownerPortfolioData),
    onOpenBuilder: handleCreatePortfolioClick,
    onViewOriginalModel: () => navigate('/'),
  };

  return (
    <PortfolioProvider value={portfolioContextValue}>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white w-full max-w-[100vw] overflow-x-hidden">
        
        {/* Top Navbar with Fiche CV, Me contacter, and Créer mon portfolio */}
        <Navbar
          onOpenPrint={() => handleOpenPrintResume(ownerPortfolioData)}
          onNavigate={navigate}
        />

        {/* Main Content Sections of SEMAKO Déo-Gratias Portfolio */}
        <main className="flex-1">
          {/* Section 1: Accueil */}
          <Hero
            onExploreClick={() => {
              document.getElementById('a-propos')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenPrint={() => handleOpenPrintResume(ownerPortfolioData)}
          />

          {/* Section 2: À propos */}
          <About />

          {/* Section 3: Compétences */}
          <SkillsSection />

          {/* Section 4: Expériences pratiques */}
          <PracticalExperiences />

          {/* Section 5: Cursus académique */}
          <AcademicCurriculum />

          {/* Section 6: Formations complémentaires */}
          <AdditionalTraining />

          {/* Section 7: Certifications */}
          <CertificationsSection />

          {/* Section 8: Wikimedia & Communauté */}
          <WikimediaSection />

          {/* Section 9: Outils */}
          <ToolsSection />

          {/* Section 10: Contact */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenPrint={() => handleOpenPrintResume(ownerPortfolioData)}
          onNavigate={navigate}
        />

        {/* Floating Back to Top Button */}
        <BackToTop />

        {/* Deployment Guide Modal */}
        <DeploymentGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        {/* Print Resume Modal */}
        <PrintResumeModal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          customData={printCustomData}
        />
      </div>
    </PortfolioProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RouterProvider>
    </LanguageProvider>
  );
}
