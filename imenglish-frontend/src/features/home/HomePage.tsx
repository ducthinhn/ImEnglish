import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { axiosClient } from '@/api/axiosClient';
import { authApi } from '@/api/authApi';
import {
  Bot,
  Headphones,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  LogOut,
  User,
  GraduationCap,
  Target,
  RefreshCw,
  Key,
} from 'lucide-react';

interface HealthData {
  status: string;
  service: string;
  version: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshToken, logout } = useAuthStore();
  const [backendHealth, setBackendHealth] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [manualRefreshStatus, setManualRefreshStatus] = useState<string | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = () => {
    setLoadingHealth(true);
    axiosClient
      .get<{ data: HealthData }>('/health')
      .then((res) => {
        const data = (res as any)?.data || res;
        setBackendHealth(data);
      })
      .catch((err) => {
        console.warn('Backend not reached yet:', err.message);
        setBackendHealth(null);
      })
      .finally(() => setLoadingHealth(false));
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      if (refreshToken) {
        await authApi.logout({ refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      logout();
      setIsLoggingOut(false);
      navigate('/login');
    }
  };

  const handleManualRefreshToken = async () => {
    if (!refreshToken) return;
    try {
      setManualRefreshStatus('Refreshing...');
      const res = await authApi.refreshToken({ refreshToken });
      const authData = (res as any)?.data || res;
      useAuthStore.getState().setTokens(authData.accessToken, authData.refreshToken);
      setManualRefreshStatus('Token refreshed successfully!');
      setTimeout(() => setManualRefreshStatus(null), 3000);
    } catch (err: any) {
      setManualRefreshStatus('Refresh failed: ' + (err?.response?.data?.message || err.message));
      setTimeout(() => setManualRefreshStatus(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-primary-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Im<span className="text-gradient">English</span>
              </span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 font-medium">
                v1.0
              </span>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            {/* Backend Connectivity Indicator */}
            <button
              onClick={checkHealth}
              title="Click to re-check backend health"
              className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth ? 'bg-emerald-400 animate-pulse' : loadingHealth ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
              <span className="text-slate-400">
                Backend:{' '}
                <strong className={backendHealth ? 'text-emerald-300' : 'text-slate-300'}>
                  {loadingHealth ? 'Checking...' : backendHealth ? 'Connected (8080)' : 'Offline'}
                </strong>
              </span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-all text-slate-300 cursor-pointer disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isLoggingOut ? 'Leaving...' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-medium text-white px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 transition-all shadow-md shadow-primary-500/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col justify-center">
        {isAuthenticated && user ? (
          /* Authenticated User Dashboard Preview */
          <div className="space-y-8 animate-fade-in">
            {/* Greeting Banner */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>JWT Session Active &bull; Spring Security Authenticated</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Welcome back, <span className="text-gradient">{user.fullName || user.username}</span>!
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Your English learning workspace is ready. Practice speaking anytime with AI or connect with peers worldwide.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleManualRefreshToken}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
                    title="Test Refresh Token Rotation endpoint"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                    <span>Test Token Refresh</span>
                  </button>
                </div>
              </div>

              {manualRefreshStatus && (
                <div className="mt-4 p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs animate-fade-in flex items-center space-x-2">
                  <Key className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>{manualRefreshStatus}</span>
                </div>
              )}
            </div>

            {/* User Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Overview */}
              <div className="glass-card rounded-2xl p-6 border border-slate-700/60">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{user.fullName || user.username}</h2>
                    <p className="text-xs text-slate-400">@{user.username}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Account ID:</span>
                    <span className="font-mono text-slate-300 text-[11px] truncate max-w-[160px]">{user.id}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Roles:</span>
                    <span className="font-medium text-primary-300">{user.roles?.join(', ') || 'ROLE_USER'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* CEFR Level & Target */}
              <div className="glass-card rounded-2xl p-6 border border-slate-700/60">
                <div className="flex items-center space-x-2 mb-4 text-primary-400">
                  <GraduationCap className="w-5 h-5" />
                  <h3 className="font-semibold text-white">English Proficiency</h3>
                </div>
                <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 text-center mb-4">
                  <span className="text-3xl font-black text-primary-300">{user.englishLevel || 'B1'}</span>
                  <p className="text-xs text-primary-400 mt-1 font-medium">CEFR Standard Level</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The AI Companion adapts speaking vocabulary, grammar difficulty, and roleplay complexity directly to your level.
                </p>
              </div>

              {/* Learning Goal */}
              <div className="glass-card rounded-2xl p-6 border border-slate-700/60">
                <div className="flex items-center space-x-2 mb-4 text-accent-400">
                  <Target className="w-5 h-5" />
                  <h3 className="font-semibold text-white">Learning Focus</h3>
                </div>
                <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 text-center mb-4">
                  <span className="text-xl font-bold text-accent-300">{user.learningGoal || 'CONVERSATION'}</span>
                  <p className="text-xs text-accent-400 mt-1 font-medium">Current Goal</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored prompts, contextual ice-breaker cards, and real-time pronunciation suggestions target this domain.
                </p>
              </div>
            </div>

            {/* Quick Feature Launchers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 border border-slate-700/60 relative group hover:border-primary-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 font-medium">
                    Phase 1 Feature
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">AI Voice Companion</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Practice natural English dialogue with Google Gemini AI. Instant speech recognition, natural voice synthesis, and grammar correction.
                </p>
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold flex items-center justify-center space-x-2 cursor-not-allowed border border-slate-700"
                >
                  <span>Ready in Phase 1</span>
                </button>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-slate-700/60 relative group hover:border-accent-500/50 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 font-medium">
                    Phase 2 Feature
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">P2P Peer Voice Calling</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Match with English learners worldwide based on CEFR level and mutual learning goals via WebRTC &amp; Coturn TURN server.
                </p>
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold flex items-center justify-center space-x-2 cursor-not-allowed border border-slate-700"
                >
                  <span>Ready in Phase 2</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Public Hero Section */
          <div className="text-center py-12 relative">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-medium mb-6 animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Phase 0: Architecture &amp; Authentication Complete</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Master English Communication with{' '}
              <span className="text-gradient">GenAI &amp; Peer Calls</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Break language barriers with AI roleplay scenarios and 1-on-1 peer conversations powered by WebRTC. Safe, engaging, and always available.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold text-sm shadow-xl shadow-primary-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Architecture Highlights */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="glass-card rounded-2xl p-6 border border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">GenAI Companion</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Powered by Google Gemini 1.5. Real-time grammar correction, vocabulary expansion, and CEFR-adaptive roleplay.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-accent-500/20 text-accent-400 flex items-center justify-center mb-4">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">P2P Voice Network</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Low-latency browser-to-browser voice calling via WebRTC, Spring WebSocket signaling, and Coturn TURN.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 border border-slate-700/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Enterprise Security</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dual-database architecture (PostgreSQL + MongoDB), JWT with refresh token rotation, and bcrypt encryption.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ImEnglish Platform &bull; Java 17 + Spring Boot 3 + React 19 + TypeScript + Vite</p>
        </div>
      </footer>
    </div>
  );
}
