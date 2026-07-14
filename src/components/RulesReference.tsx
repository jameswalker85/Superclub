import { Book, Award, DollarSign, Dumbbell, ShieldAlert, Star } from 'lucide-react';

export default function RulesReference() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-1 sm:p-4 text-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
          <Book className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-display text-white">Superclub Quick Reference</h2>
          <p className="text-sm text-emerald-400/80">Key rules, draft guidelines, and off-season rewards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placement Rewards Card */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 font-display font-semibold text-amber-400 text-lg">
            <Award className="w-5 h-5" />
            <span>Placement Rewards</span>
          </div>
          <p className="text-xs text-slate-300">
            Based on end-of-season table rankings, managers receive money to spend in the off-season.
          </p>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">🏆 1st Place (Leader)</span>
              <span className="font-bold text-amber-400">100M</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">🥈 2nd Place</span>
              <span className="font-bold text-slate-200">90M</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">🥉 3rd Place</span>
              <span className="font-bold text-slate-300">80M</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">🏅 4th Place</span>
              <span className="font-bold text-slate-300">70M</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-400">🏅 5th Place</span>
              <span className="font-bold text-slate-400">60M</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">🏅 6th Place</span>
              <span className="font-bold text-slate-400">50M</span>
            </div>
          </div>
        </div>

        {/* Squad Wages Card */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 font-display font-semibold text-rose-400 text-lg">
            <DollarSign className="w-5 h-5" />
            <span>Squad Wages & Finances</span>
          </div>
          <p className="text-xs text-slate-300">
            Keep your club's books balanced to avoid heavy penalties on payday.
          </p>
          <div className="space-y-3 text-sm">
            <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-3 flex gap-3 items-start">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-rose-300 text-xs uppercase tracking-wider">Star Wage Rule</h4>
                <p className="text-xs text-slate-300 mt-1">
                  You must pay <span className="font-semibold text-rose-400">1M wages per Star</span> currently in your active squad. Ensure you save enough from your placement rewards!
                </p>
              </div>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 flex gap-3 items-start">
              <Star className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-emerald-300 text-xs uppercase tracking-wider">Stadium Income</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Don't forget to collect passive income from your upgraded stadium stands during Step 1 of the Off-Season.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Off-Season Phases Bento */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center gap-2 font-display font-semibold text-emerald-400 text-lg border-b border-white/10 pb-3">
          <Dumbbell className="w-5 h-5" />
          <span>Off-Season Checklist & Flow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">Step 1</div>
            <h4 className="font-semibold text-white text-sm">Finances</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Collect placings, collect stand income, and pay 1M wage per squad star.
            </p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Step 2</div>
            <h4 className="font-semibold text-white text-sm">Training</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Roll training dice to upgrade developing stars. 1st plays clockwise.
            </p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wide">Step 3</div>
            <h4 className="font-semibold text-white text-sm">Scouting</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scout from qualified zones based on your scouting investment rating.
            </p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wide">Step 4</div>
            <h4 className="font-semibold text-white text-sm">Invest</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upgrade scouting, training, stadium, or hire key staff (max 2 actions).
            </p>
          </div>

          <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-2 border-emerald-500/30 bg-emerald-950/10">
            <div className="text-xs font-bold text-pink-400 uppercase tracking-wide">Step 5</div>
            <h4 className="font-semibold text-white text-sm">Deadline Day</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Draw managers + 1 players. Start bidding wars! Leader drafts 1st & last.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-5 flex gap-4 items-start">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
          <Book className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-white text-sm">Winning the Game</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The first manager to reach 100 points wins the League, triggering the option to play the final Supercup match against the game's formidable built-in team. If multiple managers cross 100 points in the exact same Gameweek, they enter the thrilling <span className="text-amber-400 font-semibold">SuperDuper Cup Playoff</span> to crown the ultimate champion!
          </p>
        </div>
      </div>
    </div>
  );
}
