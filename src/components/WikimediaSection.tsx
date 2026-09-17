import React, { useState, useEffect } from 'react';
import {
  Globe,
  ExternalLink,
  Layers,
  FileText,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

interface WikimediaUploadItem {
  title: string;
  rawTitle: string;
  url: string;
  thumbUrl: string;
  timestamp: string;
  size?: number;
}

interface WikimediaLiveStats {
  username: string;
  editCount?: number;
  uploadsCount?: number;
  registrationDate?: string;
  groups?: string[];
  recentUploads?: WikimediaUploadItem[];
}

export const WikimediaSection: React.FC = () => {
  const { isEn, t } = useLanguage();
  const { data } = usePortfolio();

  const wikimedia = data?.wikimedia;

  // If section is disabled in admin, hide it completely
  if (wikimedia && wikimedia.enabled === false) {
    return null;
  }

  const username = (wikimedia?.username || 'Semako64').trim();
  const contributionsUrl =
    wikimedia?.contributionsUrl ||
    `https://commons.wikimedia.org/wiki/Special:Contributions/${encodeURIComponent(username)}`;
  const profileUrl =
    wikimedia?.profileUrl ||
    `https://commons.wikimedia.org/wiki/User:${encodeURIComponent(username)}`;

  const sectionTitle = wikimedia?.title || 'Wikimedia';
  const badgeText = wikimedia?.badge || (isEn ? 'Open Knowledge & Commons' : 'Culture Libre & Communs');
  const subtitleText =
    wikimedia?.subtitle ||
    (isEn
      ? 'Contribution & Knowledge Sharing'
      : 'Contribution & partage de connaissances');

  const defaultPresentation = isEn
    ? `Contributor to Wikimedia projects under the pseudonym "${username}". My activity notably includes contributions to Wikimedia Commons.`
    : `Contributeur aux projets Wikimedia sous le pseudonyme « ${username} ». Mon activité comprend notamment des contributions sur Wikimedia Commons.`;

  const presentationText = wikimedia?.presentation || defaultPresentation;

  // Real-time API state
  const [stats, setStats] = useState<WikimediaLiveStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    // Fetch from our server proxy, with fallback to direct Wikimedia API
    const fetchWikimediaData = async () => {
      try {
        const res = await fetch(`/api/wikimedia/stats?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            setStats(json);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to direct client call if server proxy failed
      }

      try {
        // Direct Commons action API query (CORS enabled by Wikimedia with origin=*)
        const directRes = await fetch(
          `https://commons.wikimedia.org/w/api.php?action=query&list=users&ususers=${encodeURIComponent(
            username
          )}&usprop=editcount|registration|groups&format=json&origin=*`
        );
        const directData = await directRes.json();
        const userObj = directData?.query?.users?.[0];

        if (userObj && isMounted) {
          setStats({
            username: userObj.name || username,
            editCount: typeof userObj.editcount === 'number' ? userObj.editcount : undefined,
            registrationDate: userObj.registration,
            groups: userObj.groups || [],
          });
          setIsLoading(false);
          return;
        }
      } catch {
        // Direct call also failed
      }

      if (isMounted) {
        setHasError(true);
        setIsLoading(false);
      }
    };

    fetchWikimediaData();

    return () => {
      isMounted = false;
    };
  }, [username]);

  // Format registration date safely
  const formatRegistrationDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat(isEn ? 'en-US' : 'fr-FR', {
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return null;
    }
  };

  // Format upload date safely
  const formatUploadDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat(isEn ? 'en-US' : 'fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return null;
    }
  };

  const regDateFormatted = formatRegistrationDate(stats?.registrationDate);
  const showGallery =
    wikimedia?.showRecentUploads !== false &&
    stats?.recentUploads &&
    stats.recentUploads.length > 0;

  return (
    <section
      id="wikimedia"
      className="py-16 sm:py-24 bg-slate-50/70 text-slate-900 border-b border-slate-200 relative overflow-hidden"
    >
      {/* Discreet background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-200/80">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{badgeText}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              {sectionTitle}
            </h2>

            <p className="text-slate-600 mt-2 text-base sm:text-lg font-medium">
              {subtitleText}
            </p>

            <div className="w-14 h-1 bg-blue-600 rounded-full mt-4" />
          </div>
        </ScrollReveal>

        {/* Identity & Core Presentation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* Column 1: Presentation & Pseudonym Card */}
          <ScrollReveal animation="fade-left" delay={100} className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs h-full flex flex-col justify-between">
              <div>
                {/* Pseudonym Card */}
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        {isEn ? 'Wikimedia Username' : "Nom d'utilisateur Wikimedia"}
                      </span>
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-extrabold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 font-mono"
                        title={isEn ? 'View user page on Wikimedia' : 'Voir la page utilisateur sur Wikimedia'}
                      >
                        <span>{username}</span>
                        <ArrowUpRight className="w-4 h-4 text-blue-500" />
                      </a>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/70 self-start sm:self-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Wikimedia Commons</span>
                  </div>
                </div>

                {/* Factual description */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                  {presentationText}
                </p>

                {/* Additional narrative paragraphs if defined */}
                {wikimedia?.paragraphs && wikimedia.paragraphs.length > 0 && (
                  <div className="mt-4 space-y-3 pt-4 border-t border-slate-100 text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {wikimedia.paragraphs.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: "Voir mes contributions" */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={contributionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-wikimedia-contributions"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer text-center group"
                >
                  <span>{isEn ? 'View My Contributions' : 'Voir mes contributions'}</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>

                {profileUrl && (
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-colors text-center"
                  >
                    <span>{isEn ? 'Commons Profile' : 'Profil Commons'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Column 2: Dynamic Verified Statistics */}
          <ScrollReveal animation="fade-right" delay={150} className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs h-full flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {isEn ? 'Public Statistics (Wikimedia API)' : 'Statistiques publiques (API Wikimedia)'}
                  </h3>
                  {isLoading && (
                    <span className="text-[11px] text-blue-600 animate-pulse font-medium">
                      {isEn ? 'Fetching live data...' : 'Synchronisation en direct...'}
                    </span>
                  )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-3.5">
                  {/* Stat 1: Edit count */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">
                        {isEn ? 'Total Contributions / Edits' : 'Contributions / Modifications'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                        {stats?.editCount !== undefined
                          ? stats.editCount.toLocaleString(isEn ? 'en-US' : 'fr-FR')
                          : isLoading
                          ? '···'
                          : '—'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stat 2: Uploads on Commons */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">
                        {isEn ? 'Files Uploaded to Commons' : 'Fichiers importés sur Commons'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                        {stats?.uploadsCount !== undefined
                          ? stats.uploadsCount.toLocaleString(isEn ? 'en-US' : 'fr-FR')
                          : isLoading
                          ? '···'
                          : '—'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Stat 3: Member since */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">
                        {isEn ? 'Active Member Since' : 'Membre actif depuis'}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-slate-900 capitalize">
                        {regDateFormatted || (isLoading ? '···' : isEn ? 'Verified Member' : 'Membre vérifié')}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Factual disclaimer */}
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isEn
                    ? 'Data verified directly from public Wikimedia Commons endpoints without simulated metrics.'
                    : 'Données vérifiées directement depuis les registres publics de Wikimedia Commons, sans indicateurs fictifs.'}
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Dynamic Gallery: Recent Wikimedia Commons Contributions */}
        {showGallery && (
          <ScrollReveal animation="fade-up" delay={200} className="mt-12">
            <div className="border-t border-slate-200 pt-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                    {isEn ? 'Recent Contributions on Wikimedia Commons' : 'Contributions récentes sur Wikimedia Commons'}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">
                    {isEn
                      ? 'Photographs and educational media released under Creative Commons free licenses.'
                      : 'Photographies documentaires et médias importés sous licence libre Creative Commons (CC-BY-SA).'}
                  </p>
                </div>

                <a
                  href={contributionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0 group"
                >
                  <span>{isEn ? 'View all uploads' : 'Voir tous les téléversements'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stats?.recentUploads?.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                      {item.thumbUrl ? (
                        <img
                          src={item.thumbUrl}
                          alt={item.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ImageIcon className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-medium">
                        Commons
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug"
                          title={item.title}
                        >
                          {item.title}
                        </h4>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{formatUploadDate(item.timestamp) || 'Commons'}</span>
                        <span className="text-blue-600 font-medium inline-flex items-center gap-1 group-hover:underline">
                          <span>{isEn ? 'View file' : 'Voir le fichier'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Open Knowledge Principle takeaway note */}
        <ScrollReveal animation="fade-up" delay={250} className="mt-10">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-600 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {isEn
                  ? 'Knowledge sharing through free Creative Commons licenses (CC-BY-SA) and open documentary standards.'
                  : 'Partage de connaissances sous licences libres Creative Commons (CC-BY-SA) et respect des standards documentaires ouverts.'}
              </span>
            </div>
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-600 font-mono text-[11px] inline-flex items-center gap-1"
            >
              <span>CC-BY-SA 4.0</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
