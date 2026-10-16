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

      // Backend returns ApiResponse<AuthResponse>
      // When axiosClient response interceptor returns response.data:
      const authData = (res as any)?.data || res;
      setAuth(authData);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        err?.message ||
        'Failed to log in. Please check your credentials and try again.';
      setErrorMessage(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your English learning journey"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 text-xs sm:text-sm">{errorMessage}</div>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="alex@example.com"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-700/80 focus:border-primary-500 focus:ring-primary-500/30'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-rose-400 animate-fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-300 uppercase tracking-wider"
            >
              Password
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset feature will be available in Phase 1.');
              }}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-10 pr-11 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-700/80 focus:border-primary-500 focus:ring-primary-500/30'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400 animate-fade-in">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Demo Credentials Hint */}
        <div className="mt-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 text-[11px] text-slate-400">
          <p className="font-medium text-slate-300">💡 Quick Test Hint:</p>
          <p>Register a new account or sign in with your created credentials to test the JWT flow.</p>
        </div>

        {/* Register Navigation Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
