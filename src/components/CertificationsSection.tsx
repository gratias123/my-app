import React from 'react';
import { Award, CheckCircle2, Calendar, Shield, ExternalLink, BookmarkCheck } from 'lucide-react';
import { CERTIFICATIONS_LIST } from '../data/portfolioData';
import { CERTIFICATIONS_LIST_EN } from '../data/portfolioDataEn';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';
import { useLanguage } from '../context/LanguageContext';

export const CertificationsSection: React.FC = () => {
  const { data, isCustom } = usePortfolio();
  const { isEn, t } = useLanguage();

  const certList = isEn ? CERTIFICATIONS_LIST_EN : CERTIFICATIONS_LIST;

  return (
    <section id="certifications" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <BookmarkCheck className="w-3.5 h-3.5" />
              {t('certifications.badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              {t('certifications.title')}
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              {isEn
                ? 'Official certificates of completion verifying mastered technical and professional skills.'
                : 'Certificats de réussite officiellement obtenus confirmant l\'assimilation de compétences professionnelles.'}
            </p>
            <div className="w-16 h-1 bg-emerald-600 rounded-full mt-4"></div>
          </div>
        </ScrollReveal>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isCustom && data.certifications.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
              <BookmarkCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {isEn ? 'No certifications recorded yet' : 'Aucune certification enregistrée pour le moment'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isEn
                  ? 'Add your verified certificates and credentials in the portfolio builder.'
                  : "Ajoutez vos certificats ou attestations professionnelles dans l'éditeur de portfolio."}
              </p>
            </div>
          ) : isCustom ? (
            data.certifications.map((cert, index) => (
              <ScrollReveal
                key={cert.id || index}
                animation="scale"
                delay={index * 80}
                className="h-full"
              >
                <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {isEn ? 'Certified' : 'Certifié'}
                      </span>

                      {cert.date && (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{cert.date}</span>
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      {cert.issuer}
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 font-heading mb-3 group-hover:text-blue-900 transition-colors">
                      {cert.title}
                    </h3>

                    {cert.refNumber && (
                      <p className="text-xs text-slate-500 font-mono mb-2">
                        {isEn ? 'Ref: ' : 'Réf : '}{cert.refNumber}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      {isEn ? 'Verified Authenticity' : 'Authenticité confirmée'}
                    </span>

                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>{isEn ? 'Verify' : 'Vérifier'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            certList.map((cert, index) => (
              <ScrollReveal
                key={cert.id}
                animation="scale"
                delay={index * 80}
                className="h-full"
              >
                <div className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-full">
                  <div>
                    {/* Header with badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {cert.status}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{cert.issuedDate}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      {cert.domain}
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 font-heading mb-3 group-hover:text-blue-900 transition-colors">
                      {cert.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      {isEn ? 'Verified Authenticity' : 'Authenticité confirmée'}
                    </span>

                    <span className="font-semibold text-blue-600">
                      {isEn ? 'Recognized' : 'Reconnue'}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
