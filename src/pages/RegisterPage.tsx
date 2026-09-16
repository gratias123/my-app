import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, AlertCircle, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength check
  const isPasswordLongEnough = password.length >= 6;
  const hasLettersAndNumbers = /[a-zA-Z]/.test(password) && /\d/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (res.success) {
        // Automatically redirect to /creer-mon-portfolio per requirement
        onNavigate('/creer-mon-portfolio');
      } else {
        setError(res.error || 'Erreur lors de la création du compte.');
      }
    } catch {
      setError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top bar */}
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

          {/* Subheader badge */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-blue-300 bg-blue-950/60 border border-blue-800/60 py-1.5 px-3 rounded-full mx-auto w-fit">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Création de compte • Données isolées et indépendantes</span>
          </div>

          <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                Créer un compte
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Rejoignez la plateforme pour créer et publier votre propre portfolio professionnel.
              </p>
            </div>

            {/* Switch tabs [ Se connecter ] [ Créer un compte ] */}
            <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onNavigate('/connexion')}
                className="py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Se connecter
              </button>
              <button
                type="button"
                className="py-2 rounded-lg bg-blue-600 text-white shadow-xs cursor-default"
              >
                Créer un compte
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-name">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex. Jean Dupont"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-email">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean.dupont@exemple.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-password">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Au moins 6 caractères"
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

                {/* Password checks */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1 text-xs">
                    <div className={`flex items-center gap-1.5 ${isPasswordLongEnough ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Au moins 6 caractères</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLettersAndNumbers ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Lettres et chiffres recommandés</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="reg-confirm">
                  Confirmation du mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez le mot de passe"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {confirmPassword.length > 0 && (
                  <div className="mt-1.5 text-xs">
                    {passwordsMatch ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Les mots de passe correspondent
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Les mots de passe ne correspondent pas
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-submit-register"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                {isSubmitting ? (
                  <span>Création en cours...</span>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer link to Login */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/connexion')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer ml-1"
                >
                  Se connecter
                </button>
              </p>
            </div>

          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Vos informations sont strictement personnelles et restent sous votre entier contrôle.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        Plateforme professionnelle de portfolios numériques • Données isolées et sécurisées
      </footer>
    </div>
  );
};
