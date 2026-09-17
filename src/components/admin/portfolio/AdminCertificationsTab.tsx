import React from 'react';
import { Plus, Trash2, Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { CustomPortfolioData, CustomCertificationItem } from '../../../types/portfolioBuilder';

interface AdminCertificationsTabProps {
  data: CustomPortfolioData;
  onChange: (newData: CustomPortfolioData) => void;
}

export const AdminCertificationsTab: React.FC<AdminCertificationsTabProps> = ({ data, onChange }) => {
  const addCertification = () => {
    const newCert: CustomCertificationItem = {
      id: `cert-${Date.now()}`,
      title: 'Nouvelle Certification',
      issuer: 'Organisme délivreur (ex: Cisco, Google, Microsoft)',
      date: '2024',
      refNumber: '',
      verifyUrl: '',
    };
    onChange({
      ...data,
      certifications: [...data.certifications, newCert],
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id),
    });
  };

  const updateCertification = (id: string, updates: Partial<CustomCertificationItem>) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Certifications & Titres professionnels ({data.certifications.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Valorisez vos accréditations officielles, certificats en ligne et examens réussis.
          </p>
        </div>

        <button
          type="button"
          onClick={addCertification}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une certification</span>
        </button>
      </div>

      <div className="space-y-4">
        {data.certifications.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
            Aucune certification enregistrée.
          </div>
        ) : (
          data.certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Intitulé officiel de la certification
                    </label>
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => updateCertification(cert.id, { title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                      placeholder="Ex: CCNA: Introduction to Networks (Formation achevée)"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Date ou Année d'obtention
                    </label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="Ex: Mars 2024"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  title="Supprimer la certification"
                  onClick={() => removeCertification(cert.id)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Organisme / Autorité émettrice
                  </label>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Cisco Networking Academy"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Numéro de licence / Référence
                  </label>
                  <input
                    type="text"
                    value={cert.refNumber || ''}
                    onChange={(e) => updateCertification(cert.id, { refNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="Ex: CERT-892147-BEN"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Lien de vérification en ligne (URL)
                  </label>
                  <input
                    type="text"
                    value={cert.verifyUrl || ''}
                    onChange={(e) => updateCertification(cert.id, { verifyUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="https://credly.com/..."
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
