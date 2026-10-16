import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { axiosClient } from '@/api/axiosClient';
import { authApi } from '@/api/authApi';
import {
  Headphones,
  ArrowRight,
  LogOut,
  Flame,
  Target,
  GraduationCap,
  Sparkles,
  Volume2,
  Mic,
  Shield,
  Zap,
  Users,
  Play,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface HealthData {
  status: string;
  service: string;
  version: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshToken, logout } = useAuthStore();
  const [, setBackendHealth] = useState<HealthData | null>(null);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    axiosClient
      .get<{ data: HealthData }>('/health')
      .then((res) => {
        const data = (res as any)?.data || res;
        setBackendHealth(data);
      })
      .catch((err) => {
        console.warn('Backend connection note:', err.message);
      });
  }, []);

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

  const toggleDemoAudio = () => {
    setIsPlayingDemo(!isPlayingDemo);
    if (!isPlayingDemo) {
      // Simulate 4s sample speech
      setTimeout(() => setIsPlayingDemo(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:bg-sky-500 transition-colors">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white">
              Im<span className="text-sky-400">English</span>
            </span>
          </Link>

          {/* Right Navigation */}
          <nav className="flex items-center space-x-3 sm:space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* Streak Counter */}
                <div
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
                  title="3-Day Speaking Streak"
                >
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>3 Days</span>
                </div>

                {/* Daily Goal Progress */}
                <div
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
                  title="Daily speaking target: 15 minutes"
                >
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>0 / 15m</span>
                </div>

                {/* User Profile Tag */}
                <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full card-surface border border-slate-700/80">
                  <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                    {user.fullName || user.username}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-sky-500/20 text-sky-300">
                    {user.englishLevel || 'B1'}
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-medium text-white px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 transition-all shadow-md shadow-sky-600/20"
                >
                  Start Free
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col justify-center">
        {isAuthenticated && user ? (
          /* ========================================================================= */
          /* AUTHENTICATED LEARNER DASHBOARD (HABIT-FORMING EDTECH HUB)                */
          /* ========================================================================= */
          <div className="space-y-8 animate-fade-in">
            {/* Greeting & Hero Practice Launcher */}
            <div className="card-surface rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                <div className="max-w-xl">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Daily Conversation Ready</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Ready for your daily practice,{' '}
                    <span className="text-sky-400">{user.fullName || user.username}</span>?
                  </h1>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    Today’s recommended warmup:{' '}
                    <strong className="text-slate-200">
                      “Describing your dream vacation spot &amp; why you love it”
                    </strong>
                    . A 5-minute conversation with Anna to build natural fluency.
                  </p>
                </div>

                {/* Primary CTA Button */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() =>
                      alert('Phase 1 Feature: Anna AI Voice Companion session will launch here!')
                    }
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center space-x-3 cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                    <span>Start 5-min Warmup with Anna</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Learner Progress & Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Daily Target Card */}
              <div className="card-surface rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                    <span className="flex items-center space-x-1.5 text-emerald-400">
                      <Target className="w-4 h-4" />
                      <span>Daily Speaking Target</span>
                    </span>
                    <span className="text-white">0 / 15 mins</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div className="h-full bg-emerald-500 rounded-full w-[10%]" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Hit 15 minutes of speaking today to advance your fluency level faster.
                </p>
              </div>

              {/* CEFR Level Milestone */}
              <div className="card-surface rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                    <span className="flex items-center space-x-1.5 text-sky-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>Speaking Level</span>
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold bg-sky-500/20 text-sky-300">
                      {user.englishLevel || 'B1'}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">Intermediate Speaker</div>
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Goal: <span className="text-slate-300 font-medium">{user.learningGoal || 'Daily Conversation'}</span>. AI vocabulary is adapted to your pace.
                </p>
              </div>

              {/* Vocabulary & Streaks */}
              <div className="card-surface rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                    <span className="flex items-center space-x-1.5 text-amber-400">
                      <BookOpen className="w-4 h-4" />
                      <span>Vocabulary Mastered</span>
                    </span>
                    <span className="text-amber-400 font-bold">14 Words</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">spontaneous</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">articulate</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">resilient</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                  Review words from previous AI speaking sessions to cement your memory.
                </p>
              </div>
            </div>

            {/* Curated Scenarios Row */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold font-display text-white">
                  Curated Scenarios for Level {user.englishLevel || 'B1'}
                </h2>
                <span className="text-xs text-slate-400">Choose any scenario to practice</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Ordering at a Specialty Café', duration: '3 min', tag: 'Casual', icon: '☕' },
                  { title: 'Job Interview: Tell Me About Yourself', duration: '5 min', tag: 'Career', icon: '💼' },
                  { title: 'Airport Baggage & Customs', duration: '4 min', tag: 'Travel', icon: '✈️' },
                  { title: 'Talking About Movies & Series', duration: '5 min', tag: 'Chit-chat', icon: '🍿' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="card-surface card-surface-hover rounded-xl p-4 border border-slate-800 flex flex-col justify-between cursor-pointer group"
                    onClick={() =>
                      alert(`Selected scenario: ${item.title}. AI conversation will start in Phase 1!`)
                    }
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                          {item.duration}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>{item.tag}</span>
                      <span className="text-sky-400 font-medium flex items-center space-x-1">
                        <span>Practice</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peer Practice Launcher Card */}
            <div className="card-surface rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white">Live Peer Voice Matching</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    18 English learners at your level are currently online and looking to practice conversation.
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert('Phase 2 Feature: WebRTC Peer Matching will be live here!')}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
              >
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>Find a Conversation Partner</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* PUBLIC LANDING PAGE (HUMAN EDTECH EXPERIENCE)                              */
          /* ========================================================================= */
          <div className="py-8 sm:py-12 animate-fade-in">
            {/* Hero Main Copy */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-judgment speaking space</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
                Speak English naturally without{' '}
                <span className="text-brand-gradient">fear of making mistakes</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Practice 1-on-1 voice conversations with Anna, your patient AI tutor, and connect with peer learners worldwide. Safe, engaging, and always available.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Start Practicing Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl card-surface hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-800 transition-all flex items-center justify-center"
                >
                  I have an account
                </Link>
              </div>
            </div>

            {/* Interactive Speech Studio Widget (The Product Hook) */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="card-surface rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-white">Live Voice Simulation</span>
                  </div>
                  <span>Level B1 Practice</span>
                </div>

                {/* AI Dialogue Bubble */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    A
                  </div>
                  <div className="flex-1 bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-sky-400">Anna (AI Tutor)</span>
                      <button
                        type="button"
                        onClick={toggleDemoAudio}
                        className="inline-flex items-center space-x-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-700/60 transition-colors cursor-pointer"
                      >
                        {isPlayingDemo ? <Volume2 className="w-3 h-3 text-sky-400 animate-pulse" /> : <Play className="w-3 h-3" />}
                        <span>{isPlayingDemo ? 'Speaking…' : 'Listen'}</span>
                      </button>
                    </div>
                    <p className="text-sm text-slate-200">
                      “Hi there! How was your weekend? Did you do anything exciting or just relax at home?”
                    </p>
                  </div>
                </div>

                {/* User Simulated Prompt Bubble */}
                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1 bg-sky-500/10 p-3.5 rounded-xl border border-sky-500/20 text-right">
                    <div className="text-xs font-semibold text-slate-300 mb-1">Your Turn to Speak</div>
                    <p className="text-sm text-sky-200">
                      “I went to a cozy coffee shop with my friend and we talked about our plans!”
                    </p>
                    <div className="mt-2 flex items-center justify-end space-x-2 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Natural phrasing &bull; Great vocabulary</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold flex-shrink-0">
                    You
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Real Human Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-surface rounded-2xl p-6 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-display text-white mb-2">Zero Judgment Space</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Overcome the fear of speaking English. No anxiety or awkward pauses—make mistakes freely and learn with a patient AI.
                </p>
              </div>

              <div className="card-surface rounded-2xl p-6 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-display text-white mb-2">Instant Feedback</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Understand how native speakers would naturally express your sentences with gentle grammar and vocabulary suggestions.
                </p>
              </div>

              <div className="card-surface rounded-2xl p-6 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-display text-white mb-2">Level-Matched Peer Calls</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect 1-on-1 with learners at your exact CEFR level via low-latency WebRTC audio for realistic practice.
                </p>
              </div>
            </div>

            {/* Social Proof Bar */}
            <div className="mt-14 pt-8 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">
                Trusted by English learners worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-semibold text-slate-400">
                <div>
                  <span className="text-white font-bold text-lg">10,000+</span> minutes spoken
                </div>
                <div>
                  <span className="text-white font-bold text-lg">4.9 / 5</span> learner rating
                </div>
                <div>
                  <span className="text-white font-bold text-lg">94%</span> reduced hesitation
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} ImEnglish Platform &bull; Speak English naturally.</p>
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-slate-300 transition-colors">
              Home
            </Link>
            <Link to="/login" className="hover:text-slate-300 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-slate-300 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
