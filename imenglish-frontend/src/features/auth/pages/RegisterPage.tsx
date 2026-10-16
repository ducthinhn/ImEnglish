import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  GraduationCap,
  Target,
  MessageSquare,
  Briefcase,
  Compass,
  Award,
} from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/useAuthStore';
import type { EnglishLevel, LearningGoal } from '@/types/auth';

const ENGLISH_LEVELS: Array<{ level: EnglishLevel; label: string; desc: string }> = [
  { level: 'A1', label: 'A1 Beginner', desc: 'Basic phrases & introductions' },
  { level: 'A2', label: 'A2 Elementary', desc: 'Simple everyday routines' },
  { level: 'B1', label: 'B1 Intermediate', desc: 'Work & travel conversations' },
  { level: 'B2', label: 'B2 Upper-Int', desc: 'Spontaneous fluent discussions' },
  { level: 'C1', label: 'C1 Advanced', desc: 'Complex academic & professional topics' },
  { level: 'C2', label: 'C2 Mastery', desc: 'Native-like proficiency' },
];

const LEARNING_GOALS: Array<{
  goal: LearningGoal;
  label: string;
  icon: typeof MessageSquare;
}> = [
  { goal: 'CONVERSATION', label: 'Daily Conversation', icon: MessageSquare },
  { goal: 'IELTS', label: 'IELTS / Exam', icon: Award },
  { goal: 'BUSINESS', label: 'Business & Career', icon: Briefcase },
  { goal: 'TRAVEL', label: 'Travel & Culture', icon: Compass },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      englishLevel: 'B1',
      learningGoal: 'CONVERSATION',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);
      const res = await authApi.register({
        email: data.email,
        username: data.username,
        password: data.password,
        fullName: data.fullName || undefined,
        englishLevel: data.englishLevel,
        learningGoal: data.learningGoal,
      });

      const authData = (res as any)?.data || res;
      setAuth(authData);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0] ||
        err?.message ||
        'Registration failed. Please check your information and try again.';
      setErrorMessage(message);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join ImEnglish to practice English with GenAI & peer calls"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 text-xs sm:text-sm">{errorMessage}</div>
          </div>
        )}

        {/* Basic Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1"
            >
              Username <span className="text-primary-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="alex_dev"
                {...register('username')}
                className={`w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.username
                    ? 'border-rose-500/80 focus:ring-rose-500/40'
                    : 'border-slate-700/80 focus:border-primary-500 focus:ring-primary-500/30'
                }`}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-[11px] text-rose-400 animate-fade-in">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1"
            >
              Full Name <span className="text-slate-500 font-normal">(optional)</span>
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Alex Johnson"
              {...register('fullName')}
              className="w-full px-3 py-2 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 border-slate-700/80 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all duration-200"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="reg-email"
            className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1"
          >
            Email Address <span className="text-primary-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="alex@example.com"
              {...register('email')}
              className={`w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-rose-500/80 focus:ring-rose-500/40'
                  : 'border-slate-700/80 focus:border-primary-500 focus:ring-primary-500/30'
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-rose-400 animate-fade-in">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Password */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1"
            >
              Password <span className="text-primary-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full pl-9 pr-9 py-2 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-rose-500/80 focus:ring-rose-500/40'
                    : 'border-slate-700/80 focus:border-primary-500 focus:ring-primary-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-400 animate-fade-in">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1"
            >
              Confirm Password <span className="text-primary-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={`w-full pl-9 pr-9 py-2 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-rose-500/80 focus:ring-rose-500/40'
                    : 'border-slate-700/80 focus:border-primary-500 focus:ring-primary-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] text-rose-400 animate-fade-in">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* English Level Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-primary-400" />
            <span>Current English Level (CEFR)</span>
          </label>
          <Controller
            control={control}
            name="englishLevel"
            render={({ field }) => (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {ENGLISH_LEVELS.map((item) => {
                  const isSelected = field.value === item.level;
                  return (
                    <button
                      key={item.level}
                      type="button"
                      onClick={() => field.onChange(item.level)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all duration-150 border cursor-pointer ${
                        isSelected
                          ? 'bg-primary-600/30 border-primary-500 text-primary-300 ring-2 ring-primary-500/30 shadow-md'
                          : 'bg-slate-800/40 border-slate-700/70 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                      title={item.desc}
                    >
                      {item.level}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* Learning Goal Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-accent-400" />
            <span>Primary Learning Goal</span>
          </label>
          <Controller
            control={control}
            name="learningGoal"
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {LEARNING_GOALS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = field.value === item.goal;
                  return (
                    <button
                      key={item.goal}
                      type="button"
                      onClick={() => field.onChange(item.goal)}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-accent-600/20 border-accent-500 text-white ring-2 ring-accent-500/30'
                          : 'bg-slate-800/40 border-slate-700/70 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-accent-500/30 text-accent-300'
                            : 'bg-slate-700/40 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-medium text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Login Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
