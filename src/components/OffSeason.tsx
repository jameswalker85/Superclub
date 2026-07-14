import { Player } from '../types';
import { TEAM_COLORS, getTeamStyles } from '../utils/color';
import {
  Coins,
  Dumbbell,
  Compass,
  Building,
  CalendarRange,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';

interface OffSeasonProps {
  players: Player[];
  seasonCount: number;
  onProceedToNextSeason: () => void;
  startingCash?: number;
}

export default function OffSeason({ players, seasonCount, onProceedToNextSeason, startingCash = 120 }: OffSeasonProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  // Sort players by points desc, then stars desc for rewards calculation
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.stars - a.stars;
  });

  const rewardTiers = [100, 90, 80, 70, 60, 50];

  const getBandName = (pts: number) => {
    if (pts >= 80) return { name: 'Title Contender', cls: 'border-amber-400 text-amber-300 bg-amber-500/5' };
    if (pts >= 60) return { name: 'Mid-table', cls: 'border-orange-400 text-orange-300 bg-orange-500/5' };
    if (pts >= 40) return { name: 'Established', cls: 'border-blue-400 text-blue-300 bg-blue-500/5' };
    return { name: 'Newly Promoted', cls: 'border-emerald-400 text-emerald-300 bg-emerald-500/5' };
  };

  const isPreSeason1 = seasonCount === 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left p-1 sm:p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display tracking-tight text-white uppercase">
            {isPreSeason1 ? 'Pre-Season Briefing' : 'Off-Season Hub'}
          </h2>
          <p className="text-sm text-emerald-400/80 mt-1">
            {isPreSeason1
              ? 'Complete initial draft and prepare clubs for Season 1'
              : `Review finances, train players, and invest in assets after Season ${seasonCount}`}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 px-4 py-2 rounded-xl border border-white/5 font-mono text-xs">
          <span className="text-slate-400 uppercase tracking-widest">CURRENT:</span>
          <span className="font-bold text-amber-400">
            {isPreSeason1 ? 'PRE-SEASON' : `SEASON ${seasonCount} COMPLETE`}
          </span>
        </div>
      </div>

      {/* Finances & Placements Table */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-semibold text-amber-400 text-lg">
            <Coins className="w-5 h-5" />
            <span>Step 1: Board Allocations & Wages</span>
          </div>
          <button
            onClick={() => toggleStep(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              completedSteps[1]
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{completedSteps[1] ? 'Step Completed' : 'Mark Complete'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300">
          {isPreSeason1
            ? `All clubs receive uniform board backing of ${startingCash}M to recruit their initial squad.`
            : 'Boards pay rewards based on placement rankings. Squad wages are immediately deducted at 1M per Squad Star.'}
        </p>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/40">
          <table className="w-full text-sm font-sans border-collapse text-left">
            <thead>
              <tr className="bg-slate-950 border-b border-white/15 text-xs text-slate-400 font-mono tracking-wider uppercase">
                <th className="py-3 px-4">Manager</th>
                <th className="py-3 px-4">Ranking Info</th>
                <th className="py-3 px-4 text-right">Award</th>
                {!isPreSeason1 && <th className="py-3 px-4 text-right">Wages</th>}
                <th className="py-3 px-4 text-right text-emerald-400">Net Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isPreSeason1 ? (
                players.map((p) => {
                  const styles = getTeamStyles(p.color);
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${styles.bg}`} style={styles.bgStyle} />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 border rounded-md border-emerald-500 text-emerald-400 bg-emerald-500/5">
                          New Franchise
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-300">{startingCash}M</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{startingCash}M</td>
                    </tr>
                  );
                })
              ) : (
                sortedPlayers.map((p, idx) => {
                  const award = rewardTiers[idx] || 50;
                  const wages = p.stars;
                  const net = award - wages;
                  const band = getBandName(p.points);
                  const styles = getTeamStyles(p.color);

                  return (
                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${styles.bg}`} style={styles.bgStyle} />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                          <span className="text-xs font-mono font-bold text-slate-300 shrink-0">
                            #{idx + 1} ({p.points} Pts)
                          </span>
                          <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 border rounded-md font-bold tracking-wider ${band.cls}`}>
                            {band.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-300">{award}M</td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-rose-400">-{wages}M</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{net}M</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {!isPreSeason1 && (
          <p className="text-[10px] text-slate-400 italic">
            💡 Reminder: Collect passive stadium stand income from upgrades in addition to the Board Allocation above.
          </p>
        )}
      </div>

      {/* Checklist & guides */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold text-white text-lg px-1">Off-Season Checklist</h3>

        {/* Step 2: Training */}
        <div className={`p-5 rounded-2xl border transition-all ${
          completedSteps[2] ? 'bg-slate-900/40 border-emerald-500/20' : 'bg-slate-900/80 border-white/10'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3.5">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold">Step 2</span>
                <h4 className="font-semibold text-white text-base">Club Training & Star Upgrades</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Roll the training dice to upgrade eligible players in your squad!
                  <br />
                  <span className="font-semibold text-slate-300">Player Order:</span> {isPreSeason1 ? 'First Manager' : 'League Leader'} ➡️ Clockwise around the table.
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleStep(2)}
              className={`p-1.5 rounded-lg border transition-all ${
                completedSteps[2]
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/15 hover:text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step 3: Scouting */}
        <div className={`p-5 rounded-2xl border transition-all ${
          completedSteps[3] ? 'bg-slate-900/40 border-emerald-500/20' : 'bg-slate-900/80 border-white/10'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3.5">
              <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold">Step 3</span>
                <h4 className="font-semibold text-white text-base">Scouting Operations</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Draw and buy new talent cards based on your scout investment level!
                  <br />
                  <span className="font-semibold text-slate-300">Player Order:</span> {isPreSeason1 ? 'First Manager' : 'League Leader'} ➡️ Clockwise around the table.
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleStep(3)}
              className={`p-1.5 rounded-lg border transition-all ${
                completedSteps[3]
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/15 hover:text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step 4: Investments */}
        <div className={`p-5 rounded-2xl border transition-all ${
          completedSteps[4] ? 'bg-slate-900/40 border-emerald-500/20' : 'bg-slate-900/80 border-white/10'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3.5">
              <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold">Step 4</span>
                <h4 className="font-semibold text-white text-base">Asset Upgrades & Key Staff</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Spend money to upgrade Training, Scouting, Stadium stands, or hire game-changing staff.
                  <br />
                  <span className="font-semibold text-amber-300">Rule: Max 2 investment actions per manager</span> per off-season.
                  <br />
                  <span className="font-semibold text-slate-300">Player Order:</span> {isPreSeason1 ? 'First Manager' : 'League Leader'} ➡️ Clockwise around the table.
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleStep(4)}
              className={`p-1.5 rounded-lg border transition-all ${
                completedSteps[4]
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/15 hover:text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step 5: Deadline Day */}
        <div className={`p-5 rounded-2xl border transition-all ${
          completedSteps[5] ? 'bg-slate-900/40 border-emerald-500/20' : 'bg-slate-900/80 border-white/10'
        }`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3.5">
              <div className="p-2.5 bg-pink-500/10 rounded-xl border border-pink-500/20 text-pink-400 shrink-0">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-bold">Step 5</span>
                <h4 className="font-semibold text-white text-base">Deadline Day Draft & Bidding</h4>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  The marquee event of the off-season! Draw <span className="font-bold text-pink-300">one more player than there are managers</span>.
                  <br />
                  The {isPreSeason1 ? 'first manager' : 'league leader'} starts the bidding for a player of choice. The leader also draws the first and final player card. Bidding is open to all!
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleStep(5)}
              className={`p-1.5 rounded-lg border transition-all ${
                completedSteps[5]
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/15 hover:text-white'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Launch Action */}
      <div className="pt-4 pb-8">
        <button
          id="offseason-start-season-btn"
          type="button"
          onClick={onProceedToNextSeason}
          className="w-full bg-emerald-500 text-slate-950 font-display font-bold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-500/10 hover:bg-emerald-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base tracking-wide"
        >
          <span>PROCEED TO SEASON {seasonCount + 1} MATCHES</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
