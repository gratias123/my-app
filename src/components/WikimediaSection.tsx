import React from 'react';
import { Globe, Database, BookOpen, Share2, CheckCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';

export const WikimediaSection: React.FC = () => {
  const { isEn, t } = useLanguage();
  const { data } = usePortfolio();

  const wikimedia = data?.wikimedia;
  if (wikimedia && wikimedia.enabled === false) {
    return null;
  }

  const title = wikimedia?.title || t('wikimedia.title');
  const badge = wikimedia?.badge || t('wikimedia.badge');
  const subtitle =
    wikimedia?.subtitle ||
    (isEn
      ? 'Actively contributing to encyclopedic open knowledge, structuring open data, and spotlighting local cultural heritage.'
      : 'Participer activement à la diffusion du savoir encyclopédique, structurer les données ouvertes et valoriser le patrimoine documentaire.');

  const paragraphs =
    wikimedia?.paragraphs && wikimedia.paragraphs.length > 0
      ? wikimedia.paragraphs
      : isEn
      ? [
          'Involvement in the Wikimedia movement represents an essential bridge between technical computer skills and civic digital responsibility. Rather than remaining a passive consumer of the Internet, contributing empowers me to take concrete action for the quality of information accessible to everyone.',
          'This commitment demands constant methodological rigor: strict adherence to neutral point of view, meticulous verification of reliable and independent sources, and precise data modeling to make knowledge interoperable and lasting.',
          'It also presents an invaluable opportunity to document and highlight local knowledge, prominent figures, institutions, and cultural heritage of Benin and Africa across the most widely consulted platforms in the world.',
        ]
      : [
          "L'engagement dans l'univers Wikimedia représente pour moi une passerelle essentielle entre la technique informatique et la responsabilité citoyenne du numérique. Plutôt que de rester simple consommateur passif d'Internet, contribuer permet d'agir concrètement pour la qualité de l'information accessible à tous.",
          'Cette démarche implique une rigueur méthodologique permanente : respect strict de la neutralité de point de vue, vérification scrupuleuse de sources admissibles et indépendantes, et structuration minutieuse des données pour les rendre interopérables et pérennes.',
          "C'est également une formidable opportunité de valoriser les savoirs locaux, les personnalités, les institutions et les richesses culturelles du Bénin et d'Afrique sur les plateformes les plus consultées au monde.",
        ];

  return (
    <section id="wikimedia" className="py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-900/60 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-700/50">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              {badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
              {title}
            </h2>
            <p className="text-slate-300 mt-2 text-sm sm:text-base">
              {subtitle}
            </p>
            <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
          </div>
        </ScrollReveal>

        {/* Core narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          
          <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-7">
            <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 flex flex-col justify-between h-full">
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                {paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-700 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-white font-heading block">
                    {isEn ? 'Wikipedia' : 'Wikipédia'}
                  </span>
                  <span className="text-xs text-blue-300">
                    {isEn ? 'Editing & source verification' : 'Rédaction & vérification de sources'}
                  </span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-white font-heading block">
                    Wikidata
                  </span>
                  <span className="text-xs text-blue-300">
                    {isEn ? 'Structured & linked open data' : 'Données ouvertes et structurées'}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Pillars Cards */}
          <ScrollReveal animation="fade-right" delay={180} className="lg:col-span-5 space-y-3">
            
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">
                  {isEn ? 'Open Knowledge & Sharing' : 'Connaissance libre & partage'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isEn
                    ? 'Advocating universal, barrier-free access to verified knowledge without commercial locks or paywalls.'
                    : "Défendre l'accès universel et gratuit au savoir vérifié, accessible sans restriction commerciale ou barrière technique."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">
                  {isEn ? 'Data Structuring (Wikidata)' : 'Structuration de données (Wikidata)'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isEn
                    ? 'Enriching global knowledge graphs with precise identifiers, empowering open metadata interconnection.'
                    : "Alimenter le graphe de connaissances avec des identifiants précis, facilitant l'interconnexion mondiale des métadonnées."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">
                  {isEn ? 'Content Outreach & Preservation' : 'Valorisation des contenus'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isEn
                    ? 'Documenting regional tangible and intangible heritage to bridge linguistic and cultural gaps online.'
                    : 'Documenter le patrimoine matériel et immatériel régional pour combler les fossés linguistiques et documentaires sur le web.'}
                </p>
              </div>
            </div>

          </ScrollReveal>

        </div>

        {/* Practical takeaway */}
        <ScrollReveal animation="fade-up" delay={220}>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isEn
                  ? 'Collaborative digital contribution is a cornerstone of my dedication to open-source culture and knowledge sharing.'
                  : "La contribution numérique participative est une composante à part entière de mon engagement pour la culture du libre et du partage de connaissances."}
              </span>
            </div>
            <span className="font-mono text-slate-500">{isEn ? 'Creative Commons Licenses (CC-BY-SA)' : 'Licences Creative Commons (CC-BY-SA)'}</span>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
