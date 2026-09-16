import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Shield,
  Trash2,
  CheckCircle,
  Ban,
  ExternalLink,
  Eye,
  Calendar,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { UserAccount } from '../../types/auth';

interface UserSummaryItem extends UserAccount {
  portfolioStatus: string;
  portfolioSlug: string;
  viewsCount: number;
  cvDownloadsCount: number;
  lastUpdated: string;
}

interface AdminUsersManagerProps {
  onOpenPortfolioSlug: (slug: string) => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({ onOpenPortfolioSlug }) => {
  const [users, setUsers] = useState<UserSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.getAdminUsers();
      if (res.success) {
        setUsers(res.users);
      }
    } catch (e) {
      console.error('Erreur chargement utilisateurs', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: UserSummaryItem) => {
    if (user.role === 'admin') {
      alert('Le compte principal de la plateforme ne peut pas être suspendu.');
      return;
    }

    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await apiClient.updateAdminUserStatus(user.id, nextStatus);
      if (res.success) {
        setActionNotice(`Statut de ${user.fullName} mis à jour : ${nextStatus === 'active' ? 'Actif' : 'Suspendu'}.`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur mise à jour');
    }
  };

  const handleDeleteUser = async (user: UserSummaryItem) => {
    if (user.role === 'admin') {
      alert('Le compte principal de la plateforme ne peut pas être supprimé.');
      return;
    }

    if (!confirm(`Supprimer définitivement l'utilisateur ${user.fullName} (${user.email}) et toutes ses données associées ?`)) {
      return;
    }

    try {
      const res = await apiClient.deleteAdminUser(user.id);
      if (res.success) {
        setActionNotice(`Utilisateur ${user.fullName} supprimé.`);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setTimeout(() => setActionNotice(null), 3500);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur suppression');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un utilisateur par nom ou email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Total : <span className="text-white font-bold">{users.length}</span> compte(s)
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
          <span>Chargement des utilisateurs de la plateforme...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 border border-slate-800 rounded-2xl">
          Aucun utilisateur trouvé.
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Statut compte</th>
                  <th className="py-3 px-4">Portfolio</th>
                  <th className="py-3 px-4">Consultations</th>
                  <th className="py-3 px-4">Inscrit le</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{u.fullName}</span>
                          {u.role === 'admin' && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-blue-900/80 text-blue-300 rounded border border-blue-700/60 font-mono">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      {u.role}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          u.status === 'active'
                            ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                            : 'bg-red-950/70 text-red-400 border-red-800/60'
                        }`}
                      >
                        {u.status === 'active' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${
                            u.portfolioStatus === 'published'
                              ? 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {u.portfolioStatus === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                        {u.portfolioSlug && (
                          <button
                            type="button"
                            onClick={() => onOpenPortfolioSlug(u.portfolioSlug)}
                            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-0.5 text-[11px] cursor-pointer"
                            title="Consulter le portfolio"
                          >
                            <span>Ouvrir</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{u.viewsCount} vues</div>
                      <div className="text-[10px] text-slate-500">{u.cvDownloadsCount} CV téléch.</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'admin' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'text-amber-400 hover:bg-amber-950/50'
                                : 'text-emerald-400 hover:bg-emerald-950/50'
                            }`}
                            title={u.status === 'active' ? 'Suspendre l’accès' : 'Réactiver l’accès'}
                          >
                            {u.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Supprimer définitivement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic pr-2">
                          Compte protégé
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
