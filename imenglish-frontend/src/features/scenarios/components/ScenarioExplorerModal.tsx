import { useState, useEffect } from 'react';
import { scenarioApi } from '@/api/scenarioApi';
import type { Scenario } from '@/types/scenario';
import type { EnglishLevel } from '@/types/auth';
import {
  Search,
  X,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Target,
  User,
  Bot,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface ScenarioExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: Scenario) => void;
  initialLevel?: EnglishLevel;
}

const CEFR_LEVELS: Array<{ label: string; value?: EnglishLevel }> = [
  { label: 'All Levels' },
  { label: 'A1 Beginner', value: 'A1' },
  { label: 'A2 Elementary', value: 'A2' },
  { label: 'B1 Intermediate', value: 'B1' },
  { label: 'B2 Upper-Int', value: 'B2' },
  { label: 'C1 Advanced', value: 'C1' },
  { label: 'C2 Mastery', value: 'C2' },
];

export function ScenarioExplorerModal({
  isOpen,
  onClose,
  onSelectScenario,
  initialLevel,
}: ScenarioExplorerModalProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<EnglishLevel | undefined>(initialLevel);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewScenario, setPreviewScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTopics();
      loadScenarios();
    }
  }, [isOpen, selectedTopic, selectedLevel]);

  const loadTopics = async () => {
    try {
      const res = await scenarioApi.getTopics();
      const data = (res as any)?.data || res;
      setTopics(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Failed to load topics:', err);
    }
  };

  const loadScenarios = async () => {
    try {
      setIsLoading(true);
      const res = await scenarioApi.getScenarios({
        topic: selectedTopic,
        level: selectedLevel,
        keyword: keyword.trim() || undefined,
        size: 24,
      });
      const data = (res as any)?.data || res;
      const items = data?.items || [];
      setScenarios(items);
    } catch (err) {
      console.error('Failed to load scenarios:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadScenarios();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="card-surface rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                Explore Conversation Scenarios
              </h2>
              <p className="text-xs text-slate-400">
                Choose from 20+ realistic roleplays calibrated to CEFR standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 space-y-3">
          {/* Search input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by topic, keywords (e.g. coffee, interview, airport)..."
              className="w-full pl-9 pr-24 py-2 rounded-xl input-surface text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* CEFR Level filter pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CEFR_LEVELS.map((item, idx) => {
              const isSelected = selectedLevel === item.value;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedLevel(item.value)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Topics filter pills */}
          {topics.length > 0 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedTopic(undefined)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  !selectedTopic
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Topics
              </button>
              {topics.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedTopic === t
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scenarios Grid & Detail Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
              <span className="text-xs">Loading scenarios from database…</span>
            </div>
          ) : scenarios.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <p className="text-sm">No scenarios match your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedTopic(undefined);
                  setSelectedLevel(undefined);
                  setKeyword('');
                }}
                className="mt-2 text-xs text-sky-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {scenarios.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => setPreviewScenario(sc)}
                  className="card-surface card-surface-hover rounded-xl p-4 border border-slate-800 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <span className="text-xl">{sc.icon || '💬'}</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-sky-500/20 text-sky-300">
                          {sc.cefrLevel}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{sc.estimatedDurationMinutes}m</span>
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                      {sc.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {sc.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[140px]">{sc.topic}</span>
                    <span className="text-sky-400 font-medium flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {scenarios.length} scenarios</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Detail Preview Sub-Modal */}
      {previewScenario && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="card-surface rounded-2xl w-full max-w-lg border border-slate-700 p-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewScenario(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Level */}
            <div className="flex items-start space-x-3 mb-4">
              <span className="text-3xl p-2 rounded-xl bg-slate-800">{previewScenario.icon || '💬'}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                    {previewScenario.cefrLevel}
                  </span>
                  <span className="text-xs text-slate-400">{previewScenario.topic}</span>
                </div>
                <h3 className="text-lg font-bold font-display text-white mt-1">
                  {previewScenario.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {previewScenario.description}
            </p>

            {/* Role Breakdown */}
            <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-sky-400 font-semibold mb-1">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Anna's Role</span>
                </div>
                <p className="text-slate-300">{previewScenario.aiRole}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold mb-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Your Role</span>
                </div>
                <p className="text-slate-300">{previewScenario.userRole}</p>
              </div>
            </div>

            {/* Initial Greeting Preview */}
            <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 mb-4 text-xs">
              <span className="font-semibold text-sky-300 block mb-1">Opening line from Anna:</span>
              <p className="italic text-slate-200">“{previewScenario.initialGreeting}”</p>
            </div>

            {/* Conversation Goals */}
            {previewScenario.conversationGoals?.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>Conversation Goals:</span>
                </span>
                <ul className="space-y-1">
                  {previewScenario.conversationGoals.map((goal, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Vocabulary Pills */}
            {previewScenario.suggestedVocabulary?.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>Suggested Vocabulary:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {previewScenario.suggestedVocabulary.map((vocab, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {vocab}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setPreviewScenario(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onSelectScenario(previewScenario);
                  setPreviewScenario(null);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Select &amp; Start Practice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
