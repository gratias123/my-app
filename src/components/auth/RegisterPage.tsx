import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/creer-mon-portfolio');
    }
  }, [isAuthenticated, navigate]);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Sécurisé', 'Très sécurisé'];
  const strengthColors = ['bg-slate-700', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Veuillez saisir votre nom complet.');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (!/[0-9]/.test(password) && !/[^A-Za-z0-9]/.test(password)) {
      setError('Pour votre sécurité, incluez au moins un chiffre ou un caractère spécial.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(trimmedName, trimmedEmail, password);
      if (res.success) {
        // Automatically redirect to /creer-mon-portfolio as requested
        navigate('/creer-mon-portfolio');
      } else {
        setError(res.error || "Une erreur est survenue lors de l'inscription.");
      }
    } catch {
      setError("Une erreur imprévue est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top navigation back to model */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">Modèle & Plateforme Portfolio</span>
      </div>

      {/* Main card container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-8">
        <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 p-7 sm:p-9 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Créer un compte
            </h1>
            <p className="text-sm text-slate-400">
              Inscrivez-vous pour créer et publier votre portfolio professionnel.
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom complet */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex : Jean Dupont"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Mot de passe (8 caractères minimum)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`flex-1 transition-all ${strength >= 1 ? strengthColors[strength] : 'bg-transparent'}`} />
                    <div className={`flex-1 transition-all ${strength >= 2 ? strengthColors[strength] : 'bg-transparent'}`} />
                    <div className={`flex-1 transition-all ${strength >= 3 ? strengthColors[strength] : 'bg-transparent'}`} />
                    <div className={`flex-1 transition-all ${strength >= 4 ? strengthColors[strength] : 'bg-transparent'}`} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Sécurité : <strong className="text-slate-200">{strengthLabels[strength]}</strong></span>
                    <span>Recommandé : 8+ car., chiffres, majuscules</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Confirmation du mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-700/80 focus:border-blue-500'
                  }`}
                />
              </div>
              {confirmPassword && confirmPassword === password && (
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Les mots de passe correspondent
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Créer mon compte</span>
                  <Sparkles className="w-4 h-4 text-blue-200" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            <span>Déjà un compte ? </span>
            <button
              type="button"
              onClick={() => navigate('/connexion')}
              className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer"
            >
              Se connecter
            </button>
          </div>

          {/* Guarantee notice */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Vos données sont cloisonnées et vous restez propriétaire de votre profil. Aucun écrasement du modèle original.
            </span>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center text-xs text-slate-500 relative z-10">
        Portfolio Pro • Plateforme de génération de portfolios indépendants
      </div>
    </div>
  );
};
