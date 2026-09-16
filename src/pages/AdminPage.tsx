import React, { useState, useEffect } from 'react';
import {
  Shield,
  User,
  Users,
  Layers,
  BarChart3,
  LogOut,
  ExternalLink,
  Lock,
  ArrowLeft,
  X,
  Eye,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminLoginView } from '../components/admin/AdminLoginView';
import { AdminOwnerPortfolioEditor } from '../components/admin/AdminOwnerPortfolioEditor';
import { AdminPortfoliosManager } from '../components/admin/AdminPortfoliosManager';
import { AdminUsersManager } from '../components/admin/AdminUsersManager';
import { AdminStatsView } from '../components/admin/AdminStatsView';
import { PublicPortfolioView } from '../components/PublicPortfolioView';
import { PrintResumeModal } from '../components/PrintResumeModal';
import { CustomPortfolioData } from '../types/portfolioBuilder';
import { apiClient } from '../services/apiClient';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'my-portfolio' | 'portfolios' | 'users' | 'stats'>('my-portfolio');
  
  // State for preview modal
  const [previewPortfolioData, setPreviewPortfolioData] = useState<CustomPortfolioData | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  // State for print resume modal
  const [printCvData, setPrintCvData] = useState<CustomPortfolioData | null>(null);

  // Edit modal for non-owner portfolio
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <span>Vérification des autorisations...</span>
      </div>
    );
  }

  // 1. If not authenticated at all -> show secure private login form
  if (!isAuthenticated || !user) {
    return (
      <AdminLoginView
        onSuccess={() => {
          // AuthContext handles state update
        }}
        onBackToHome={() => onNavigate('/')}
      />
    );
  }

  // 2. If authenticated as a standard user -> strictly DENY ACCESS (Test 2)
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-200">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-950/70 border border-red-800/80 mx-auto flex items-center justify-center text-red-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">
            Accès restreint
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Votre compte ({user.email}) ne dispose pas des privilèges nécessaires pour accéder à cet espace de gestion.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onNavigate('/mon-espace')}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              Aller sur mon espace portfolio
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="w-full py-2 px-4 text-slate-400 hover:text-white text-xs rounded-xl transition-all cursor-pointer"
            >
              Retourner à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authenticated as ADMIN -> show private administration panel
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white tracking-tight">
                Plateforme Portfolios
              </span>
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Espace privé
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Connecté : <strong className="text-slate-200 font-medium">{user.fullName || user.email}</strong>
            </span>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Site public</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('/');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/70 text-red-300 text-xs font-medium border border-red-900/50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto gap-2 text-xs pb-2">
          <button
            type="button"
            onClick={() => setActiveSection('my-portfolio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'my-portfolio'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mon portfolio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('portfolios')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'portfolios'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Portfolios plateforme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('users')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'users'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestion des utilisateurs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('stats')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'stats'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Système & Statistiques</span>
          </button>
        </div>

        {/* Section View */}
        {activeSection === 'my-portfolio' && (
          <AdminOwnerPortfolioEditor
            onPreview={(data) => {
              setPreviewPortfolioData(data);
              setPreviewTitle('Aperçu du portfolio personnel');
            }}
            onOpenPrintCV={(data) => {
              setPrintCvData(data);
            }}
          />
        )}

        {activeSection === 'portfolios' && (
          <AdminPortfoliosManager
            onPreviewPortfolio={(data, title) => {
              setPreviewPortfolioData(data);
              setPreviewTitle(title ? `Portfolio de ${title}` : 'Aperçu du portfolio');
            }}
            onEditPortfolioModal={(portfolioId) => {
              setEditingPortfolioId(portfolioId);
            }}
          />
        )}

        {activeSection === 'users' && (
          <AdminUsersManager
            onOpenPortfolioSlug={(slug) => onNavigate(`/portfolio/${slug}`)}
          />
        )}

        {activeSection === 'stats' && <AdminStatsView />}
      </main>

      {/* Preview Modal */}
      {previewPortfolioData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold">{previewTitle || 'Prévisualisation'}</span>
              <span className="text-[11px] text-slate-400 font-normal">
                (Mode d’inspection direct)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPreviewPortfolioData(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-slate-950">
            <PublicPortfolioView
              data={previewPortfolioData}
              onBack={() => setPreviewPortfolioData(null)}
            />
          </div>
        </div>
      )}

      {/* Print CV Modal */}
      {printCvData && (
        <PrintResumeModal
          isOpen={true}
          onClose={() => setPrintCvData(null)}
          data={printCvData}
        />
      )}
    </div>
  );
};
