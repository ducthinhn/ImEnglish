import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  MessageSquare,
  Award,
  Briefcase,
  Compass,
  Check,
} from 'lucide-react';
import { AuthLayout } from '@/layouts/AuthLayout';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/stores/useAuthStore';
import type { EnglishLevel, LearningGoal } from '@/types/auth';

const LEARNING_GOALS: Array<{
  goal: LearningGoal;
  title: string;
  subtitle: string;
  icon: typeof MessageSquare;
}> = [
  {
    goal: 'CONVERSATION',
    title: 'Daily Conversation',
    subtitle: 'Chat freely about hobbies, daily life & weekend plans without awkward silences.',
    icon: MessageSquare,
  },
  {
    goal: 'IELTS',
    title: 'IELTS / Speaking Test',
    subtitle: 'Practice structured topic drills to boost fluency, grammar and lexical resource.',
    icon: Award,
  },
  {
    goal: 'BUSINESS',
    title: 'Business & Career',
    subtitle: 'Master workplace meetings, presentations, interviews, and salary negotiations.',
    icon: Briefcase,
  },
  {
    goal: 'TRAVEL',
    title: 'Travel & Culture',
    subtitle: 'Navigate airports, order at cafes, book hotels, and explore new countries easily.',
    icon: Compass,
  },
];

const ENGLISH_LEVELS: Array<{
  level: EnglishLevel;
  badge: string;
  title: string;
  desc: string;
}> = [
  {
    level: 'A1',
    badge: 'Beginner',
    title: 'A1 • Beginner',
    desc: 'Basic greetings, self-introductions, and simple everyday words.',
  },
  {
    level: 'A2',
    badge: 'Elementary',
    title: 'A2 • Elementary',
    desc: 'Short conversations about daily routines, family, and shopping.',
  },
  {
    level: 'B1',
    badge: 'Intermediate',
    title: 'B1 • Intermediate',
    desc: 'Express opinions and discuss work, travel, and personal experiences.',
  },
  {
    level: 'B2',
    badge: 'Upper-Int',
    title: 'B2 • Upper-Intermediate',
    desc: 'Spontaneous fluent discussions on abstract topics with native speakers.',
  },
  {
    level: 'C1',
    badge: 'Advanced',
    title: 'C1 • Advanced',
    desc: 'Express complex ideas effortlessly in academic and professional settings.',
  },
  {
    level: 'C2',
    badge: 'Mastery',
    title: 'C2 • Mastery',
    desc: 'Complete native-level fluency, subtle nuance, and precision.',
  },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const selectedGoal = watch('learningGoal');
  const selectedLevel = watch('englishLevel');
  const passwordValue = watch('password');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 3) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(passwordValue);

  const handleNextFromStep1 = () => {
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    setCurrentStep(3);
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2) : 1));
  };

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
      title={
        currentStep === 1
          ? 'What brings you to ImEnglish?'
          : currentStep === 2
          ? 'What is your current speaking level?'
          : 'Create your learner profile'
      }
      subtitle={
        currentStep === 1
          ? 'We tailor speaking topics and AI roleplay scenarios to your personal goals.'
          : currentStep === 2
          ? 'We calibrate your conversation pace and peer matching to this level.'
          : 'Save your learning streaks and track your daily speaking progress.'
      }
      currentStep={currentStep}
      totalSteps={3}
    >
      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start space-x-2.5 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1 text-xs sm:text-sm">{errorMessage}</div>
        </div>
      )}

      {/* STEP 1: LEARNING GOAL */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-2.5">
            {LEARNING_GOALS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedGoal === item.goal;
              return (
                <button
                  key={item.goal}
                  type="button"
                  onClick={() => setValue('learningGoal', item.goal)}
                  className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start space-x-3.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 ring-2 ring-sky-500/30 shadow-md'
                      : 'card-surface border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextFromStep1}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: CEFR LEVEL SELECTION */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            {ENGLISH_LEVELS.map((item) => {
              const isSelected = selectedLevel === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setValue('englishLevel', item.level)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500 ring-2 ring-sky-500/30 shadow-md'
                      : 'card-surface border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-10 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.level}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{item.badge}</div>
                      <p className="text-xs text-slate-400 truncate">{item.desc}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-400 flex-shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNextFromStep2}
              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ACCOUNT CREATION */}
      {currentStep === 3 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in" noValidate>
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
              or register with email
            </span>
          </div>

          {/* Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-medium text-slate-300 mb-1">
                Full name <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Alex Johnson"
                {...register('fullName')}
                className="w-full px-3 py-2 rounded-xl input-surface text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label htmlFor="reg-username" className="block text-xs font-medium text-slate-300 mb-1">
                Username <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="alex_dev"
                  {...register('username')}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl input-surface text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
                    errors.username
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'focus:border-sky-500 focus:ring-sky-500'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.username.message}</p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-medium text-slate-300 mb-1">
              Email address <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reg-email"
                type="email"
                placeholder="alex@example.com"
                {...register('email')}
                className={`w-full pl-9 pr-3 py-2 rounded-xl input-surface text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'focus:border-sky-500 focus:ring-sky-500'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div>
            <label htmlFor="reg-pass" className="block text-xs font-medium text-slate-300 mb-1">
              Password <span className="text-sky-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="reg-pass"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                {...register('password', {
                  onChange: (e) => {
                    // Auto-sync confirm password to reduce cognitive friction
                    setValue('confirmPassword', e.target.value);
                  },
                })}
                className={`w-full pl-9 pr-9 py-2 rounded-xl input-surface text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 ${
                  errors.password
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'focus:border-sky-500 focus:ring-sky-500'
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
            {/* Password Strength Meter */}
            {passwordValue && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden flex space-x-1">
                  <div
                    className={`h-full flex-1 rounded-full ${
                      strength.score >= 1 ? strength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      strength.score >= 2 ? strength.color : 'bg-transparent'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      strength.score >= 3 ? strength.color : 'bg-transparent'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{strength.label}</span>
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.password.message}</p>
            )}
            <input type="hidden" {...register('confirmPassword')} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account…</span>
                </>
              ) : (
                <>
                  <span>Create Account &amp; Start</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Link to Login */}
      <div className="text-center pt-4 border-t border-slate-800/80 mt-5">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-sky-400 hover:text-sky-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
