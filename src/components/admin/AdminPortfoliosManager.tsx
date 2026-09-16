import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Edit3,
  Trash2,
  Globe,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  User,
  Shield,
  Loader2,
  Filter,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { CustomPortfolioData } from '../../types/portfolioBuilder';

interface AdminPortfoliosManagerProps {
  onPreviewPortfolio: (data: CustomPortfolioData, title?: string) => void;
  onEditPortfolioModal: (portfolioId: string) => void;
}

interface PortfolioSummary {
  id: string;
  userId: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  stats: { viewsCount: number; cvDownloadsCount: number };
  ownerName: string;
  ownerEmail: string;
  isOwnerAdmin: boolean;
  mainTitle: string;
}

export const AdminPortfoliosManager: React.FC<AdminPortfoliosManagerProps> = ({
  onPreviewPortfolio,
  onEditPortfolioModal,
}) => {
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.getAdminPortfolios();
      if (res.success) {
        setPortfolios(res.portfolios);
      }
    } catch (e) {
      console.error('Erreur chargement portfolios', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleToggleStatus = async (p: PortfolioSummary) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    try {
      const res = await apiClient.updateAdminPortfolio(p.id, { status: newStatus });
      if (res.success) {
        setActionNotice(`Statut mis à jour pour ${p.ownerName} (${newStatus === 'published' ? 'Publié' : 'Brouillon'}).`);
        setPortfolios((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, status: newStatus } : item))
        );
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur mise à jour statut');
    }
  };

  const handleDelete = async (p: PortfolioSummary) => {
    if (p.isOwnerAdmin) {
      alert('Le portfolio du propriétaire de la plateforme ne peut pas être supprimé.');
      return;
    }

    if (!confirm(`Supprimer définitivement le portfolio de ${p.ownerName} ?`)) {
      return;
    }

    try {
      const res = await apiClient.deleteAdminPortfolio(p.id);
      if (res.success) {
        setActionNotice(`Portfolio de ${p.ownerName} supprimé.`);
        setPortfolios((prev) => prev.filter((item) => item.id !== p.id));
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur suppression');
    }
  };

  const handleOpenPreview = async (p: PortfolioSummary) => {
    try {
      const res = await apiClient.getAdminPortfolioById(p.id);
      if (res.success && res.portfolio && res.portfolio.data) {
        onPreviewPortfolio(res.portfolio.data, p.ownerName);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur prévisualisation');
    }
  };

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesSearch =
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.mainTitle || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && p.status === 'published') ||
      (statusFilter === 'draft' && p.status === 'draft');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email, identifiant ou titre..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              statusFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({portfolios.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              statusFilter === 'published' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Publiés ({portfolios.filter((p) => p.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium ${
              statusFilter === 'draft' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Brouillons ({portfolios.filter((p) => p.status === 'draft').length})
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
          <span>Chargement des portfolios de la plateforme...</span>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 border border-slate-800 rounded-2xl">
          Aucun portfolio trouvé correspondant aux critères.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPortfolios.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{p.ownerName}</span>
                    {p.isOwnerAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                        Principal
                      </span>
                    )}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      p.status === 'published'
                        ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                        : 'bg-amber-950/70 text-amber-400 border-amber-800/60'
                    }`}
                  >
                    {p.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>

                <p className="text-xs text-blue-400 font-medium truncate mb-1">
                  {p.mainTitle || 'Profil non renseigné'}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span>
                    Slug : <code className="text-slate-300 font-mono">/portfolio/{p.slug}</code>
                  </span>
                  <span>•</span>
                  <span>{p.stats?.viewsCount || 0} vues</span>
                  <span>•</span>
                  <span>{p.stats?.cvDownloadsCount || 0} téléchargements CV</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenPreview(p)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Prévisualiser</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditPortfolioModal(p.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-300" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(p)}
                    className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    title={p.status === 'published' ? 'Passer en brouillon' : 'Publier'}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{p.status === 'published' ? 'Dépublier' : 'Publier'}</span>
                  </button>
                </div>

                {!p.isOwnerAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDelete(p)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
