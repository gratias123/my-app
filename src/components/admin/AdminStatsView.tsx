import React, { useState, useEffect } from 'react';
import {
  Users,
  Layers,
  Globe,
  FileEdit,
  Eye,
  Download,
  ShieldCheck,
  Server,
  Key,
  Database,
  Lock,
  Loader2,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const AdminStatsView: React.FC = () => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalPortfolios: number;
    publishedPortfolios: number;
    draftPortfolios: number;
    totalViews: number;
    activeSessions: number;
    uptime: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.getAdminStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (e) {
        console.error('Erreur stats', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
        <span>Chargement des métriques...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Utilisateurs inscrits</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalUsers}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Comptes enregistrés</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Portfolios en ligne</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.publishedPortfolios}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Sur {stats.totalPortfolios} au total</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Brouillons</span>
            <FileEdit className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.draftPortfolios}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">En cours de rédaction</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Consultations cumulées</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{stats.totalViews}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Vues des portfolios</span>
        </div>
      </div>

      {/* Security and Architecture Verification */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            Architecture et garanties de sécurité côté serveur
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Hachage cryptographique sécurisé</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Aucun mot de passe n'est stocké en clair. Le système utilise l'algorithme robuste PBKDF2 avec sel cryptographique aléatoire de 16 octets et 100 000 itérations SHA-512.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Cloisonnement strict des données</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Toutes les modifications de portfolio sont liées au <code className="text-slate-300 font-mono">user_id</code> validé côté serveur via le jeton de session. Un utilisateur ordinaire ne peut en aucun cas altérer les données d'un tiers.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Server className="w-4 h-4 text-purple-400" />
              <span>Contrôle d’accès côté serveur</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              La vérification des privilèges s'effectue strictement sur le serveur Express avant toute lecture ou écriture des données d'administration.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Protection anti-bruteforce</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              L'accès à la route privée d'administration dispose d'un limiteur de tentatives par adresse IP (blocage temporaire après échecs consécutifs) et de messages d'erreur génériques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
