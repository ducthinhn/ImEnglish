import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { axiosClient } from '@/api/axiosClient';
import { Bot, Headphones, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HealthData {
  status: string;
  service: string;
  version: string;
}

export function App() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [backendHealth, setBackendHealth] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    axiosClient
      .get<{ data: HealthData }>('/health')
      .then((res) => {
        // Axios interceptor returns response.data directly or full wrapper
        const data = (res as any)?.data || res;
        setBackendHealth(data);
      })
      .catch((err) => {
        console.warn('Backend not reached yet:', err.message);
      })
      .finally(() => setLoadingHealth(false));
  }, []);

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
            <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700">
              <span
                className={`w-2 h-2 rounded-full ${
                  backendHealth ? 'bg-emerald-400 animate-pulse' : loadingHealth ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
              <span className="text-slate-400">
                Backend:{' '}
                <strong className={backendHealth ? 'text-emerald-300' : 'text-slate-300'}>
                  {backendHealth ? 'Online (8080)' : loadingHealth ? 'Checking...' : 'Disconnected'}
                </strong>
              </span>
            </div>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-300">
                  Hi, <strong className="text-white">{user.fullName || user.username}</strong>
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25 transition-all"
                >
                  Bắt đầu ngay
                </a>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary-400" />
          <span>Nền tảng luyện giao tiếp tiếng Anh kết hợp AI & P2P Call</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight sm:leading-tight mb-6">
          Tự tin phản xạ tiếng Anh cùng{' '}
          <span className="text-gradient">AI Companion</span> &{' '}
          <span className="text-white underline decoration-primary-500 decoration-wavy">Bạn học 1-1</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-10">
          Luyện nói không áp lực với trợ lý ảo GenAI đa kịch bản hoặc kết nối thoại P2P chất lượng cao qua WebRTC để ghép cặp cùng người thật.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <a
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 via-sky-500 to-accent-500 hover:opacity-95 text-white font-semibold flex items-center justify-center space-x-2 shadow-xl shadow-primary-500/20 transition-all hover:scale-105"
          >
            <span>Tạo tài khoản học thử</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card text-slate-200 hover:text-white font-medium hover:border-slate-600 transition-all"
          >
            Đăng nhập tài khoản
          </a>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
          <div className="glass-card p-6 rounded-2xl hover:border-primary-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Companion 1-1</h3>
            <p className="text-sm text-slate-400">
              Nhập vai 20+ tình huống thực tế (Phỏng vấn xin việc, Du lịch, Thuyết trình). Nhận gợi ý diễn đạt real-time khi nghẽn từ.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:border-accent-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400 mb-4 group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">P2P Voice Match</h3>
            <p className="text-sm text-slate-400">
              Ghép cặp người thật thông minh theo trình độ CEFR. Đàm thoại WebRTC độ trễ siêu thấp cùng bộ câu hỏi mở Ice-breaker.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Báo Cáo & Trí Nhớ AI</h3>
            <p className="text-sm text-slate-400">
              Chấm điểm phát âm, ngữ pháp sau mỗi buổi. AI ghi nhớ điểm yếu và sở thích của bạn để thiết kế lộ trình cá nhân hóa.
            </p>
          </div>
        </div>

        {/* Phase 0 Scaffolding Checklist status */}
        <div className="mt-16 w-full max-w-xl glass-card p-4 rounded-xl text-left border-dashed border-slate-700">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
            Trạng thái nền tảng Frontend (Phase 0):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Vite 8 + React 19 + TypeScript</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tailwind CSS + Glassmorphism</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zustand Auth Store (Persist)</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Axios Interceptor (401 Refresh)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
