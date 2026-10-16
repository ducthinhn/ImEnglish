import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children?: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center shadow-xl shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Im<span className="text-gradient">English</span>
          </span>
        </Link>
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Main Glassmorphism Card */}
      <main className="w-full max-w-md sm:max-w-lg relative z-10">
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 border border-slate-700/60 relative">
          <div className="absolute top-0 right-0 -mt-2 -mr-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-[10px] font-semibold text-white uppercase tracking-wider flex items-center space-x-1 shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>AI Powered</span>
          </div>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} ImEnglish. Master English with GenAI &amp; P2P Voice.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/" className="hover:text-slate-400 transition-colors">
            Home
          </Link>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-400 transition-colors">
            Privacy Policy
          </a>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-400 transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
