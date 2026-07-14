import { Player } from '../types';
import { LayoutDashboard, Users, RefreshCw, BookOpen, Trophy } from 'lucide-react';
import SixStarsLogo from './SixStarsLogo';

interface ResponsiveNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  seasonCount: number;
  targetScore: number;
  currentPhase: string;
}

export default function ResponsiveNav({
  activeTab,
  setActiveTab,
  seasonCount,
  targetScore,
  currentPhase,
}: ResponsiveNavProps) {
  const tabs = currentPhase === 'OFFSEASON'
    ? [
        { id: 'offseason', label: 'Off-Season', icon: RefreshCw },
        { id: 'rules', label: 'Rules Guide', icon: BookOpen },
      ]
    : [
        { id: 'dashboard', label: 'Matchday', icon: LayoutDashboard },
        { id: 'rules', label: 'Rules Guide', icon: BookOpen },
      ];

  return (
    <>
      {/* Desktop Header & Nav Bar */}
      <header className="hidden md:block sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <SixStarsLogo size="md" />
            <div>
              <h1 className="text-lg font-black font-display tracking-widest text-white uppercase">
                Superclub Manager
              </h1>
              <div className="flex gap-2 items-center text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold">
                <span>Season {seasonCount}</span>
                <span className="text-white/30">•</span>
                <span>Target: {targetScore} Pts</span>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              // Highlight off-season tab if game is currently in off-season phase
              const isOffSeasonHighlight = tab.id === 'offseason' && currentPhase === 'OFFSEASON';

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                      : isOffSeasonHighlight
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 animate-pulse'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Sticky Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/15 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <SixStarsLogo size="sm" />
          <div>
            <h1 className="text-xs font-black font-display tracking-wider text-white uppercase leading-none">
              Superclub Manager
            </h1>
            <span className="text-[9px] uppercase font-mono text-emerald-400 font-semibold leading-none mt-0.5 block">
              Season {seasonCount} • Target: {targetScore} Pts
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-full border border-white/10 text-[10px] font-mono tracking-wider font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE</span>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-white/15 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isOffSeasonHighlight = tab.id === 'offseason' && currentPhase === 'OFFSEASON';

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center w-20 h-full gap-1 transition-all relative ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {/* Active Underline/Pill dot */}
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-emerald-400 rounded-full" />
                )}
                {/* Off-season pulse banner */}
                {isOffSeasonHighlight && !isActive && (
                  <span className="absolute top-1 right-5 w-2.5 h-2.5 bg-amber-400 border border-slate-950 rounded-full animate-bounce" />
                )}
                <Icon className={`w-5 h-5 ${isOffSeasonHighlight && !isActive ? 'text-amber-400 animate-pulse' : ''}`} />
                <span className="text-[10px] tracking-wide uppercase font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
