import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Headphones } from 'lucide-react';

interface AuthLayoutProps {
  children?: ReactNode;
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 relative selection:bg-sky-500 selection:text-white">
      {/* Subtle organic ambient gradient (warm and quiet, not neon) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-sky-950/30 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-xl mx-auto flex flex-col items-center pt-4 sm:pt-6 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center space-x-2.5 group transition-transform duration-150 hover:opacity-90 mb-4"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-white">
            Im<span className="text-sky-400">English</span>
          </span>
        </Link>

        {/* Progress Bar (Visible in Multi-step wizard) */}
        {currentStep && totalSteps && (
          <div className="w-full max-w-md px-4 mb-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>Step {currentStep} of {totalSteps}</span>
              <span className="text-sky-400">
                {currentStep === 1 && 'Learning Goal'}
                {currentStep === 2 && 'English Level'}
                {currentStep === 3 && 'Account Setup'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </header>

      {/* Main Form Container */}
      <main className="w-full max-w-lg my-6 relative z-10">
        <div className="card-surface rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} ImEnglish &bull; Speak English naturally with GenAI &amp; peer calls.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/" className="hover:text-slate-300 transition-colors">
            Home
          </Link>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Privacy Policy
          </a>
          <span>&bull;</span>
          <a href="#" className="hover:text-slate-300 transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
