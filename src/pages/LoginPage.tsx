import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, AlertCircle, CheckCircle2, ArrowLeft, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  redirectReason?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, redirectReason }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre e-mail et votre mot de passe.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ email, password });
      if (res.success) {
        // Redirect to /creer-mon-portfolio per requirement
        onNavigate('/creer-mon-portfolio');
      } else {
        setError(res.error || 'Identifiants invalides.');
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top bar with back to reference model */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>← Retour à l'accueil</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Plateforme de création de portfolio</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">
          
          {/* Subtle security banner */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-blue-300 bg-blue-950/60 border border-blue-800/60 py-1.5 px-3 rounded-full mx-auto w-fit">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Espace sécurisé • Données isolées par utilisateur</span>
          </div>

          {/* Discreet message if redirected */}
          {redirectReason && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{redirectReason}</p>
                <p className="text-amber-300/80 mt-0.5">
                  Veuillez vous authentifier pour accéder à votre espace de création personnalisé.
                </p>
              </div>
            </div>
          )}

          {/* The Login Card */}
          <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                Bienvenue
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Connectez-vous pour créer et gérer votre portfolio.
              </p>
            </div>

            {/* Switch tabs [ Se connecter ] [ Créer un compte ] */}
            <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
              <button
                type="button"
                className="py-2 rounded-lg bg-blue-600 text-white shadow-xs cursor-default"
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/inscription')}
                className="py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Créer un compte
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-email">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300" htmlFor="login-password">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotSuccess(false);
                      setShowForgotPasswordModal(true);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-submit-login"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer link to Register */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/inscription')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer ml-1"
                >
                  Créer un compte
                </button>
              </p>
            </div>

          </div>

          {/* Model info footnote */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Générez et publiez votre propre portfolio professionnel personnalisé et indépendant.
            </p>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Récupération de compte</h3>
            </div>

            {forgotSuccess ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Si un compte correspond à <strong>{forgotEmail}</strong>, un lien sécurisé de réinitialisation vous sera adressé.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Indiquez votre adresse e-mail pour recevoir les instructions de réinitialisation de votre mot de passe.
                </p>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold text-white"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        Plateforme professionnelle de portfolios numériques • Données isolées et sécurisées
      </footer>
    </div>
  );
};
