import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/useAuthStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      const res = await authApi.login({
        email: data.email,
        password: data.password,
      });

      const authData = (res as any)?.data || res;
      setAuth(authData);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        err?.message ||
        'Incorrect email or password. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Continue your daily English speaking journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 text-xs sm:text-sm">{errorMessage}</div>
          </div>
        )}

        {/* Social Google Login Button */}
        <button
          type="button"
          onClick={() => alert('Google OAuth integration will be active in next update.')}
          className="w-full py-2.5 px-4 rounded-xl card-surface border border-slate-700 hover:bg-slate-800/80 text-slate-200 text-xs sm:text-sm font-medium transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-3">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 absolute font-medium">
            or sign in with email
          </span>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-300 mb-1"
          >
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="alex@example.com"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl input-surface text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-1 ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'focus:border-sky-500 focus:ring-sky-500'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300"
            >
              Password
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link will be sent to your email.');
              }}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              {...register('password')}
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl input-surface text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-1 ${
                errors.password
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'focus:border-sky-500 focus:ring-sky-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-sky-500/20 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs text-slate-400 select-none cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            <>
              <span>Sign In to ImEnglish</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Navigation to Register */}
        <div className="text-center pt-4 border-t border-slate-800/80 mt-5">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-medium text-sky-400 hover:text-sky-300 transition-colors"
            >
              Create account free
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
