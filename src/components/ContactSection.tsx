import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Facebook,
  MessageCircle,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';
import { usePortfolio } from '../context/PortfolioContext';

export const ContactSection: React.FC = () => {
  const { data, isCustom } = usePortfolio();

  const currentEmail = isCustom ? (data.identity.email || '') : PERSONAL_INFO.email;
  const currentPhone = isCustom ? (data.identity.phone || '') : PERSONAL_INFO.phone;
  const currentLocation = isCustom ? (data.identity.location || '') : PERSONAL_INFO.location;
  const currentName = isCustom ? (data.identity.name || '') : PERSONAL_INFO.name;
  const currentTitle = isCustom ? (data.identity.mainTitle || '') : PERSONAL_INFO.mainTitle;
  const currentBrand = isCustom ? (data.identity.brandName || currentName || 'Mon Portfolio') : PERSONAL_INFO.brandName;

  const facebookUrl = isCustom
    ? (data.links?.facebook || PERSONAL_INFO.facebookUrl)
    : PERSONAL_INFO.facebookUrl;

  const whatsappUrl = isCustom
    ? (data.links?.whatsapp || PERSONAL_INFO.whatsappUrl)
    : PERSONAL_INFO.whatsappUrl;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus('error');
      setStatusMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!currentEmail) {
      setFormStatus('error');
      setStatusMessage("L'adresse e-mail de contact n'est pas encore configurée.");
      return;
    }

    const mailtoSubject = encodeURIComponent(
      formData.subject.trim()
        ? `[Contact Portfolio] ${formData.subject}`
        : `[Contact Portfolio] Message de ${formData.name}`
    );
    const mailtoBody = encodeURIComponent(
      `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${currentEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setFormStatus('success');
    setStatusMessage(
      'Votre message est prêt. Si votre client mail ne s’ouvre pas automatiquement, utilisez le lien direct ci-dessous.'
    );

    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Mail className="w-3.5 h-3.5" />
              Entrer en relation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              Contact
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Vous avez un besoin d'intervention technique, une question sur mon cursus ou un projet collaboratif ? N'hésitez pas à me joindre directement.
            </p>
            <div className="w-16 h-1 bg-blue-600 rounded-full mt-4"></div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Coordinates Column */}
          <ScrollReveal animation="fade-left" delay={120} className="lg:col-span-5 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-800">
              <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider block mb-1">
                Coordonnées directes
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                {currentName}
              </h3>
              <p className="text-xs text-blue-400 font-semibold mt-0.5 uppercase tracking-wide">
                {currentTitle}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Identité numérique : <span className="font-semibold text-white">{currentBrand}</span>
              </p>

              <div className="mt-6 space-y-4">
                
                {/* Email Item */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 block">Adresse e-mail :</span>
                      {currentEmail ? (
                        <a
                          href={`mailto:${currentEmail}`}
                          className="text-xs sm:text-sm font-semibold text-white hover:text-blue-300 truncate block transition-colors"
                        >
                          {currentEmail}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-slate-400 italic block">
                          Non renseignée
                        </span>
                      )}
                    </div>
                  </div>

                  {currentEmail && (
                    <button
                      type="button"
                      onClick={() => handleCopy(currentEmail, 'email')}
                      title="Copier l'adresse e-mail"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
                    >
                      {copiedItem === 'email' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Phone Item */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 block">Téléphone / WhatsApp :</span>
                      {currentPhone ? (
                        <a
                          href={`tel:${currentPhone.replace(/\s+/g, '')}`}
                          className="text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 truncate block transition-colors"
                        >
                          {currentPhone}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm text-slate-400 italic block">
                          Non renseigné
                        </span>
                      )}
                    </div>
                  </div>

                  {currentPhone && (
                    <button
                      type="button"
                      onClick={() => handleCopy(currentPhone, 'phone')}
                      title="Copier le numéro"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
                    >
                      {copiedItem === 'phone' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Location Item */}
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Localisation :</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {currentLocation || 'Non renseignée'}
                    </span>
                  </div>
                </div>

                {/* Social Networks & Direct Messaging (Facebook & WhatsApp) */}
                {(facebookUrl || whatsappUrl) && (
                  <div className="pt-2 border-t border-slate-700/80">
                    <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                      Réseaux sociaux & Messagerie directe :
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {facebookUrl && (
                        <a
                          href={facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          id="contact-link-facebook"
                          title="Ouvrir ma page Facebook (dans un nouvel onglet)"
                          className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-blue-500/60 flex items-center gap-2.5 text-slate-200 hover:text-white transition-all group cursor-pointer shadow-xs"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                            <Facebook className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block truncate">Facebook</span>
                            <span className="text-[10px] text-slate-400 group-hover:text-blue-300 block truncate">Profil direct</span>
                          </div>
                        </a>
                      )}

                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          id="contact-link-whatsapp"
                          title="Ouvrir directement mon lien WhatsApp"
                          className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/60 flex items-center gap-2.5 text-slate-200 hover:text-white transition-all group cursor-pointer shadow-xs"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                            <MessageCircle className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block truncate">WhatsApp</span>
                            <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 block truncate">Message direct</span>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Réponse attentive assurée sous 24 à 48 heures.</span>
              </div>
            </div>

            {/* Availability reminder */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block mb-0.5">Disponibilité pour échanges professionnels</strong>
                <p>
                  {isCustom
                    ? 'Prêt à étudier toute proposition de stage, mission professionnelle ou opportunité de collaboration.'
                    : 'Prêt à étudier toute proposition de stage, mission technique, intervention de maintenance informatique ou projet de design graphique.'}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Form Column */}
          <ScrollReveal animation="fade-right" delay={150} className="lg:col-span-7">
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-heading mb-1">
                Envoyer un message direct
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Remplissez les informations ci-dessous. Le message sera préparé avec votre client de messagerie habituel.
              </p>

              {formStatus === 'error' && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {formStatus === 'success' && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Adresse e-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nom@exemple.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Objet de votre prise de contact
                  </label>
                  <input
                    type="text"
                    placeholder="Proposition d'intervention, stage, projet graphique..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Votre message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Détaillez ici votre besoin ou votre message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer le message</span>
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
