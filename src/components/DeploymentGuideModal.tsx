import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Image as ImageIcon,
  UploadCloud,
  FolderTree,
  CheckCircle2,
  Copy,
  Check,
  Code,
  Globe,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'hosting' | 'structure' | 'seo'>('photo');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const gitCodeSnippet = `# 1. Initialiser le dépôt local
git init
git add .
git commit -m "Initialisation du portfolio SEMAKO Déo-Gratias"

# 2. Lier à votre dépôt GitHub
git branch -M main
git remote add origin https://github.com/votre-compte/semako-portfolio.git
git push -u origin main

# 3. Déploiement automatique sur GitHub Pages
# Installer gh-pages ou utiliser GitHub Actions pour Vite :
npm run build`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              GL
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-heading leading-tight">
                Guide d'administration & de publication
              </h2>
              <p className="text-xs text-slate-500">
                Livrables techniques et conseils pour SEMAKO Déo-Gratias
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'photo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>1. Photo & Icônes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hosting')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'hosting'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>2. Déploiement GitHub Pages</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('structure')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'structure'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>3. Structure des fichiers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>4. Référencement & Accessibilité</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* TAB 1: Photo & Icons */}
          {activeTab === 'photo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h3 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Méthode 1 : Changement immédiat en direct (navigateur)
                </h3>
                <p className="text-xs text-blue-800">
                  Sur la page d'accueil, cliquez simplement sur le bouton <strong>« Photo »</strong> en bas à droite du cadre de profil pour sélectionner un fichier image depuis votre ordinateur ou smartphone. Il sera automatiquement sauvegardé dans votre navigateur.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  Méthode 2 : Remplacement permanent dans le code
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-600">
                  <li>
                    Placez votre photo professionnelle au format carré (ex: 800x800 px, compressée en JPG ou WebP) dans le dossier public : <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">/public/photo-semako.jpg</code>.
                  </li>
                  <li>
                    Dans le fichier <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">/src/components/Hero.tsx</code>, définissez par exemple :
                    <pre className="mt-1 p-2 bg-slate-900 text-slate-200 rounded-md font-mono text-[11px] overflow-x-auto">
                      const [photoUrl, setPhotoUrl] = useState&lt;string | null&gt;('/photo-semako.jpg');
                    </pre>
                  </li>
                  <li>
                    Pour les icônes : Toutes les icônes du site proviennent du standard professionnel <strong>lucide-react</strong> (Wrench, Smartphone, Palette, Globe, etc.). Vous pouvez en ajouter ou modifier dans les fichiers de composants selon vos évolutions futures.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: Deployment & Hosting */}
          {activeTab === 'hosting' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Comme vous maîtrisez les concepts de <strong>GitHub / GitHub Pages</strong>, ce site a été conçu pour se publier en quelques minutes sur n'importe quel hébergeur statique moderne.
              </p>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900">Commandes Git recommandées :</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(gitCodeSnippet, 'git')}
                    className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold"
                  >
                    {copiedCode === 'git' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        Copié
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copier
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
                  {gitCodeSnippet}
                </pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-bold text-xs text-slate-900 mb-1">Option A : GitHub Pages</h4>
                  <p className="text-[11px] text-slate-600">
                    Activez GitHub Pages dans les réglages du dépôt (Settings → Pages → Source: GitHub Actions ou branche gh-pages). Idéal et 100% gratuit.
                  </p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <h4 className="font-bold text-xs text-slate-900 mb-1">Option B : Vercel / Netlify</h4>
                  <p className="text-[11px] text-slate-600">
                    Connectez votre compte GitHub à Vercel. Détection automatique de Vite, déploiement continu à chaque <code className="font-mono">git push</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: File Structure */}
          {activeTab === 'structure' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Architecture modulaire propre avec séparation stricte des données et des composants :
              </p>
              <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`portfolio-semako/
├── index.html                  # Point d'entrée avec balises meta SEO, OpenGraph et polices
├── metadata.json               # Métadonnées d'application
├── package.json                # Dépendances Vite, React, Lucide, Tailwind CSS
├── /src/
│   ├── main.tsx                # Initialisation React
│   ├── App.tsx                 # Composant racine assemblant toutes les sections
│   ├── index.css               # Import Tailwind CSS et règles typographiques Space Grotesk
│   ├── types.ts                # Typage TypeScript strict (Compétences, Expériences, etc.)
│   ├── data/
│   │   └── portfolioData.ts    # Contenu textuel authentique, vérifié sans invention
│   └── components/
│       ├── Navbar.tsx          # Barre de navigation sticky responsive avec menu mobile
│       ├── Hero.tsx            # Accueil avec présentation, accroche et photo
│       ├── About.tsx           # À propos (3 piliers, formation IMI, ancrage Porto-Novo)
│       ├── SkillsSection.tsx   # Compétences par catégories (sans faux pourcentages)
│       ├── PracticalExperiences.tsx # Section exacte "Expériences pratiques"
│       ├── EducationSection.tsx # Timeline IMI (3 ans) et formations complémentaires
│       ├── CertificationsSection.tsx # 5 certifications officielles (5 août 2026)
│       ├── WikimediaSection.tsx # Engagement Wikipédia & Wikidata
│       ├── ToolsSection.tsx    # Outils et technologies avec filtres
│       ├── ContactSection.tsx  # Coordonnées réelles (+229 0164690682) et formulaire
│       ├── PrintResumeModal.tsx # Fiche de synthèse imprimable pour recruteurs
│       └── Footer.tsx          # Pied de page et mention d'intégrité numérique`}
              </pre>
            </div>
          )}

          {/* TAB 4: SEO & Accessibility */}
          {activeTab === 'seo' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-xs text-slate-900 mb-1">Mots-clés naturels ciblés :</h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'SEMAKO Déo-Gratias',
                    'Porto-Novo Bénin',
                    'Installations et Maintenance en Informatique',
                    'Maintenance GSM',
                    'UI/UX design',
                    'IA responsable',
                    'Wikimedia',
                  ].map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-white border border-slate-300 text-slate-700">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <h4 className="font-bold text-slate-900">Qualité technique & Accessibilité :</h4>
                <p>• Balisage HTML sémantique (<code className="font-mono">header, nav, main, section, footer</code>)</p>
                <p>• Ratios de contraste WCAG AA respectés sur tous les textes et fonds</p>
                <p>• Navigation complète au clavier et support des lecteurs d'écran (aria-labels)</p>
                <p>• Chargement instantané sans librairies lourdes superflues</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {PERSONAL_INFO.name} • {PERSONAL_INFO.location}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
};
