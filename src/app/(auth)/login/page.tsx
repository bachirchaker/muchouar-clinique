'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Activity, Lock, Mail, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        setError(json.error || 'Une erreur est survenue');
        return;
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-blue-900 to-indigo-800 p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">MUCHOUAR CLINIQUE</h1>
          </div>
          <h2 className="text-4xl font-light mt-16 leading-tight">
            Système Intégré de <br/>
            <span className="font-bold">Gestion Médicale</span>
          </h2>
          <p className="mt-6 text-lg text-blue-100 max-w-md font-light">
            Excellence, innovation et soins de qualité au cœur d'Alger. 
            Connectez-vous pour accéder à votre espace de travail.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} MUCHOUAR CLINIQUE. Tous droits réservés.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-24 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:hidden gap-2 mb-6">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MUCHOUAR</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Bon retour
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Veuillez entrer vos identifiants pour continuer
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            {error && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email professionnel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white shadow-sm transition-colors"
                    placeholder="nom@muchouar.dz"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white shadow-sm transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
          
          <div className="lg:hidden mt-8 text-center">
             <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} MUCHOUAR CLINIQUE
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
