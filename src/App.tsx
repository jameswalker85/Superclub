/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Player, Matchup, GameweekSchedule, AppPhase } from './types';
import SetupScreen from './components/SetupScreen';
import SixStarsLogo from './components/SixStarsLogo';
import { TEAM_COLORS, getTeamStyles } from './utils/color';
import OffSeason from './components/OffSeason';
import RulesReference from './components/RulesReference';
import Confetti from './components/Confetti';
import ResponsiveNav from './components/ResponsiveNav';
import {
  playKickOffWhistle,
  playFullTimeWhistle,
  playVictorySound,
} from './utils/audio';
import {
  Trophy,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Star,
  Users,
  Target,
  Smartphone,
  Check,
  Sword,
  Shield,
  Coins,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // State Initialization from LocalStorage
  const [players, setPlayers] = useState<Player[]>([]);
  const [seasonCount, setSeasonCount] = useState<number>(0);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [targetScore, setTargetScore] = useState<number>(100);
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('SETUP');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [gameMode, setGameMode] = useState<'STANDARD' | 'LONG'>('STANDARD');
  const [startingCash, setStartingCash] = useState<number>(120);

  // Gameweek results: key is `${roundIndex}-${homeId}-${awayId}` or `${roundIndex}-${playerId}-sim`
  const [matchResults, setMatchResults] = useState<Record<string, 'HOME' | 'AWAY' | 'DRAW' | 'WIN' | 'LOSS'>>({});

  // Victory tracking
  const [winnerName, setWinnerName] = useState<string>('');
  const [winReason, setWinReason] = useState<string>('');

  // Custom dialog state for safe iframe confirm/alerts
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  // Loaded state tracking
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('superclubManager');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.players && Array.isArray(s.players)) setPlayers(s.players);
        if (typeof s.seasonCount === 'number') setSeasonCount(s.seasonCount);
        if (typeof s.currentRound === 'number') setCurrentRound(s.currentRound);
        if (typeof s.targetScore === 'number') setTargetScore(s.targetScore);
        if (s.currentPhase) setCurrentPhase(s.currentPhase);
        if (s.matchResults) setMatchResults(s.matchResults);
        if (s.winnerName) setWinnerName(s.winnerName);
        if (s.winReason) setWinReason(s.winReason);
        if (s.gameMode) setGameMode(s.gameMode);
        if (typeof s.startingCash === 'number') setStartingCash(s.startingCash);
        if (s.currentPhase && s.currentPhase !== 'SETUP') {
          setActiveTab('dashboard');
        }
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    const state = {
      players,
      seasonCount,
      currentRound,
      targetScore,
      currentPhase,
      matchResults,
      winnerName,
      winReason,
      gameMode,
      startingCash,
    };
    localStorage.setItem('superclubManager', JSON.stringify(state));
  }, [players, seasonCount, currentRound, targetScore, currentPhase, matchResults, winnerName, winReason, gameMode, startingCash, isLoaded]);

  // Generate the matchday schedule based on player count
  const getSchedule = (count: number): GameweekSchedule[] => {
    if (count === 2) return ['ALL_SIM', [[0, 1]], 'ALL_SIM', [[1, 0]], 'ALL_SIM'];
    if (count === 3) return [[[0, 1], 2], 'ALL_SIM', [[0, 2], 1], 'ALL_SIM', [[1, 2], 0]];
    if (count === 4) return [[[0, 3], [1, 2]], 'ALL_SIM', [[0, 2], [1, 3]], 'ALL_SIM', [[0, 1], [2, 3]]];
    if (count === 5) return [[[0, 1], [2, 3], 4], [[0, 2], [1, 4], 3], [[0, 4], [1, 3], 2], [[0, 3], [2, 4], 1], [[1, 2], [3, 4], 0]];
    if (count === 6) return [[[0, 5], [1, 4], [2, 3]], [[0, 4], [1, 3], [2, 5]], [[0, 3], [1, 2], [4, 5]], [[0, 2], [1, 5], [3, 4]], [[0, 1], [2, 4], [3, 5]]];
    return [];
  };

  const reverseGameweek = (gw: GameweekSchedule): GameweekSchedule => {
    if (gw === 'ALL_SIM') {
      return 'ALL_SIM';
    }
    return gw.map((matchup) => {
      if (Array.isArray(matchup)) {
        return [matchup[1], matchup[0]];
      }
      return matchup;
    });
  };

  const baseSchedule = getSchedule(players.length);
  const schedule = gameMode === 'LONG'
    ? [...baseSchedule, ...baseSchedule.map(reverseGameweek)]
    : baseSchedule;

  // Setup completion
  const handleKickOff = (initialPlayers: Player[], target: number, mode: 'STANDARD' | 'LONG', cash: number) => {
    setPlayers(initialPlayers);
    setTargetScore(target);
    setGameMode(mode);
    setStartingCash(cash);
    setSeasonCount(0); // Starts in Off-Season/Pre-season setup phase
    setCurrentRound(0);
    setMatchResults({});
    setCurrentPhase('OFFSEASON');
    setActiveTab('offseason');
  };

  // Transition from off-season to matchday
  const handleProceedToNextSeason = () => {
    setSeasonCount((prev) => prev + 1);
    setCurrentRound(0);
    setMatchResults({});
    setCurrentPhase('DASHBOARD');
    setActiveTab('dashboard');
    playKickOffWhistle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset helper
  const handleReset = () => {
    setConfirmDialog({
      title: 'Reset Campaign?',
      message: 'Are you sure you want to permanently clear the current campaign data and start over? This action cannot be undone.',
      confirmText: 'Yes, Reset',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () => {
        localStorage.removeItem('superclubManager');
        setPlayers([]);
        setSeasonCount(0);
        setCurrentRound(0);
        setMatchResults({});
        setCurrentPhase('SETUP');
        setWinnerName('');
        setWinReason('');
        setActiveTab('dashboard');
        setConfirmDialog(null);
      }
    });
  };

  // Adjust player points manually
  const adjustPoints = (playerId: number, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, points: Math.max(0, p.points + delta) } : p))
    );
  };

  // Update player stars rating
  const updateStars = (playerId: number, stars: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, stars: Math.max(0, stars) } : p))
    );
  };

  // Check if all matchups of current round are resolved
  const isRoundComplete = (): boolean => {
    if (schedule.length === 0 || currentRound >= schedule.length) return false;
    const roundData = schedule[currentRound];
    if (roundData === 'ALL_SIM') {
      return players.every((p) => {
        const key = `${currentRound}-${p.id}-sim`;
        return !!matchResults[key];
      });
    } else {
      return roundData.every((matchup) => {
        if (Array.isArray(matchup)) {
          const [home, away] = matchup;
          const key = `${currentRound}-${home}-${away}`;
          return !!matchResults[key];
        } else {
          const key = `${currentRound}-${matchup}-sim`;
          return !!matchResults[key];
        }
      });
    }
  };

  // Record outcome for PvP match
  const resolvePvP = (homeId: number, awayId: number, result: 'HOME' | 'AWAY' | 'DRAW') => {
    const key = `${currentRound}-${homeId}-${awayId}`;
    if (matchResults[key]) return; // Avoid double recording

    setMatchResults((prev) => ({ ...prev, [key]: result }));

    const winPts = gameMode === 'LONG' ? 3 : 6;
    const drawPts = gameMode === 'LONG' ? 1 : 2;

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => {
        if (p.id === homeId) {
          if (result === 'HOME') return { ...p, points: p.points + winPts, wins: p.wins + 1 };
          if (result === 'DRAW') return { ...p, points: p.points + drawPts, draws: p.draws + 1 };
          return { ...p, losses: p.losses + 1 };
        }
        if (p.id === awayId) {
          if (result === 'AWAY') return { ...p, points: p.points + winPts, wins: p.wins + 1 };
          if (result === 'DRAW') return { ...p, points: p.points + drawPts, draws: p.draws + 1 };
          return { ...p, losses: p.losses + 1 };
        }
        return p;
      })
    );
  };

  // Record outcome for Sim match
  const resolveSim = (playerId: number, result: 'WIN' | 'DRAW' | 'LOSS') => {
    const key = `${currentRound}-${playerId}-sim`;
    if (matchResults[key]) return; // Avoid double recording

    setMatchResults((prev) => ({ ...prev, [key]: result }));

    const winPts = gameMode === 'LONG' ? 3 : 6;
    const drawPts = gameMode === 'LONG' ? 1 : 2;

    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => {
        if (p.id === playerId) {
          if (result === 'WIN') return { ...p, points: p.points + winPts, wins: p.wins + 1 };
          if (result === 'DRAW') return { ...p, points: p.points + drawPts, draws: p.draws + 1 };
          return { ...p, losses: p.losses + 1 };
        }
        return p;
      })
    );
  };

  // Go to next round
  const handleNextRound = () => {
    if (currentRound + 1 < schedule.length) {
      setCurrentRound((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // End season & evaluate outcomes
  const handleEndSeason = () => {
    playFullTimeWhistle();

    // Find winners
    const winners = players.filter((p) => p.points >= targetScore);
    if (winners.length === 1) {
      // Direct champion!
      setWinnerName(winners[0].name);
      setWinReason(`REACHED ${winners[0].points} POINTS & WON THE LEAGUE!`);
      setCurrentPhase('VICTORY');
      playVictorySound();
    } else if (winners.length > 1) {
      // Joint leadership tiebreak playoff
      setCurrentPhase('SUPERDUPER');
    } else {
      // Continue next season
      setCurrentPhase('OFFSEASON');
      setActiveTab('offseason');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle manual selection for SuperDuper playoff winner
  const resolveSuperDuperCup = (championName: string) => {
    setWinnerName(championName);
    setWinReason('CONQUERED THE SUPERDUPER CUP TIEBREAKER PLAYOFF!');
    setCurrentPhase('VICTORY');
    playVictorySound();
  };

  // Quick Supercup check/simulation
  const handleAttemptSupercup = () => {
    const leader = [...players].sort((a, b) => b.points - a.points)[0];
    if (!leader) return;

    setConfirmDialog({
      title: 'Attempt Supercup Final',
      message: `Is the current leader ${leader.name} attempting the legendary Supercup Final match against the ultimate opponent?`,
      confirmText: 'Yes, Attempt Match',
      cancelText: 'Cancel',
      variant: 'info',
      onConfirm: () => {
        setTimeout(() => {
          setConfirmDialog({
            title: 'Supercup Match Outcome',
            message: `Did ${leader.name} DEFEAT the board game's ultimate opponent to win the Supercup?`,
            confirmText: '🏆 Yes, Won!',
            cancelText: 'No, Lost',
            variant: 'warning',
            onConfirm: () => {
              setWinnerName(leader.name);
              setWinReason('CROWNED SUPERCUP CHAMPION!');
              setCurrentPhase('VICTORY');
              playVictorySound();
              setConfirmDialog(null);
            },
            onCancel: () => {
              setConfirmDialog({
                title: 'Match Outcome',
                message: 'Unlucky! The companion continues.',
                confirmText: 'OK',
                onConfirm: () => setConfirmDialog(null)
              });
            }
          });
        }, 300);
      }
    });
  };

  // Helper: sorted list of players for active table
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.stars - a.stars;
  });

  return (
    <div className="min-h-screen pb-24 md:pb-8 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <AnimatePresence>
        {currentPhase === 'VICTORY' && <Confetti />}
      </AnimatePresence>

      {/* Setup phase layout */}
      {currentPhase === 'SETUP' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-xl w-full text-center space-y-6">
            <div className="space-y-2">
              <SixStarsLogo size="xl" className="mx-auto mb-2" />
              <h1 className="text-3xl font-extrabold tracking-widest font-display text-white uppercase sm:text-4xl">
                Superclub Manager
              </h1>
            </div>
            <SetupScreen onKickOff={handleKickOff} />
          </div>
        </div>
      ) : (
        <>
          {/* Main game view with top desktop/bottom mobile nav */}
          <ResponsiveNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            seasonCount={seasonCount}
            targetScore={targetScore}
            currentPhase={currentPhase}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
            {/* SuperDuper Cup Playoff Overlay Card */}
            {currentPhase === 'SUPERDUPER' && (
              <div className="bg-slate-950/90 border border-amber-400/40 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl space-y-6 text-center animate-pulse">
                <div className="mx-auto w-16 h-16 bg-amber-400/10 border border-amber-400/20 rounded-full flex items-center justify-center text-amber-400">
                  <Sword className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black font-display tracking-tight text-amber-400 uppercase">
                    SuperDuper Cup Playoff
                  </h2>
                  <p className="text-sm text-slate-300 max-w-lg mx-auto">
                    A historic tie! Multiple managers crossed the{' '}
                    <span className="font-semibold text-white">{targetScore} Pts</span> threshold at the exact same
                    moment. Play the tiebreaker matches on your board, then select the final champion below:
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {players
                    .filter((p) => p.points >= targetScore)
                    .map((p) => {
                      const styles = getTeamStyles(p.color);
                      return (
                        <button
                          key={p.id}
                          onClick={() => resolveSuperDuperCup(p.name)}
                          className={`px-5 py-3 rounded-xl font-bold font-display text-slate-950 tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${
                            styles.bg || 'bg-white'
                          } ${p.color === 'Yellow' || styles.hex === '#facc15' ? 'text-slate-950' : 'text-white'}`}
                          style={styles.style}
                        >
                          <span>{p.name} Wins!</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Victory Display */}
            {currentPhase === 'VICTORY' && (
              <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl space-y-6 text-center">
                <div className="text-6xl animate-bounce">🏆</div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-black">
                    Campaign Champion
                  </span>
                  <h2 id="winner-banner-name" className="text-5xl font-black font-display tracking-tight text-white uppercase">
                    {winnerName}
                  </h2>
                  <p className="text-sm text-emerald-400 font-mono tracking-wider font-semibold uppercase">
                    {winReason}
                  </p>
                </div>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="bg-amber-400 text-slate-950 font-display font-black px-6 py-3 rounded-xl shadow-lg shadow-amber-400/10 hover:bg-amber-300 active:scale-95 transition-all text-sm tracking-wider uppercase"
                  >
                    Start New Campaign
                  </button>
                </div>
              </div>
            )}

            {/* Views router depending on active Tab selection */}
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && currentPhase !== 'VICTORY' && currentPhase !== 'SUPERDUPER' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left"
                >
                  {/* Standings Table Card: Responsive layout */}
                  <div className="lg:col-span-5 bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-display font-semibold text-white text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span>League Standings</span>
                      </h3>
                      <span className="text-[10px] font-mono tracking-wider bg-slate-950 px-2.5 py-1 rounded-full border border-white/5 text-slate-400 font-medium">
                        Target: {targetScore} Pts
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm font-sans border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase tracking-wider text-center">
                            <th className="py-2 px-1 text-left w-8">#</th>
                            <th className="py-2 px-2 text-left">Manager</th>
                            <th className="py-2 px-1 w-16">Stars</th>
                            <th className="py-2 px-2 text-right">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {sortedPlayers.map((p, idx) => {
                            const isLeader = idx === 0;
                            return (
                              <tr
                                key={p.id}
                                className={`group transition-all ${
                                  isLeader
                                    ? 'bg-gradient-to-r from-amber-500/10 via-transparent to-transparent border-l-4 border-amber-400'
                                    : ''
                                }`}
                              >
                                <td className="py-3 px-1 text-slate-400 font-mono text-center font-bold">
                                  {idx + 1}
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-3 h-3 rounded-full shrink-0 ${getTeamStyles(p.color).bg}`}
                                      style={getTeamStyles(p.color).bgStyle}
                                    />
                                    <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                                      {p.name}
                                    </span>
                                    {isLeader && <span className="text-xs">👑</span>}
                                  </div>
                                </td>
                                <td className="py-3 px-1 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <input
                                      type="number"
                                      value={p.stars}
                                      onChange={(e) => updateStars(p.id, parseInt(e.target.value) || 0)}
                                      className="w-10 bg-slate-950 border border-white/10 rounded px-1 py-0.5 text-center text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                      min="0"
                                    />
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex items-center justify-end gap-1 font-mono">
                                    <button
                                      onClick={() => adjustPoints(p.id, -1)}
                                      className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-8 text-center text-amber-400 font-bold text-base">
                                      {p.points}
                                    </span>
                                    <button
                                      onClick={() => adjustPoints(p.id, 1)}
                                      className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Gameweek Fixtures & Active Actions Card */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
                      {/* Round Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                            Matchday Panel
                          </span>
                          <h3 id="gameweek-panel-title" className="font-display font-semibold text-white text-lg">
                            Gameweek {currentRound + 1} of {schedule.length}
                          </h3>
                        </div>
                        {schedule[currentRound] === 'ALL_SIM' && (
                          <span className="text-[10px] font-mono tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full font-semibold">
                            ALL-SIMULATION
                          </span>
                        )}
                      </div>

                      {/* Matchups list */}
                      <div className="space-y-3.5">
                        {schedule[currentRound] === 'ALL_SIM' ? (
                          <div className="space-y-3">
                            {players.map((p) => {
                              const key = `${currentRound}-${p.id}-sim`;
                              const result = matchResults[key];

                              return (
                                <div
                                  key={p.id}
                                  className="p-4 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span
                                      className={`w-3 h-3 rounded-full ${getTeamStyles(p.color).bg}`}
                                      style={getTeamStyles(p.color).bgStyle}
                                    />
                                    <span className="font-semibold text-white text-sm">{p.name}</span>
                                    <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-white/5 text-slate-400 font-medium">
                                      SIM MATCH
                                    </span>
                                  </div>

                                  {result ? (
                                    <div className="flex items-center gap-2 font-mono text-sm font-bold">
                                      {result === 'WIN' && (
                                        <span className="text-emerald-400">WIN (+{gameMode === 'LONG' ? 3 : 6} Pts)</span>
                                      )}
                                      {result === 'DRAW' && (
                                        <span className="text-slate-300">DRAW (+{gameMode === 'LONG' ? 1 : 2} Pts)</span>
                                      )}
                                      {result === 'LOSS' && (
                                        <span className="text-rose-400">LOSS (0 Pts)</span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() => resolveSim(p.id, 'WIN')}
                                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                                      >
                                        Win
                                      </button>
                                      <button
                                        onClick={() => resolveSim(p.id, 'DRAW')}
                                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                                      >
                                        Draw
                                      </button>
                                      <button
                                        onClick={() => resolveSim(p.id, 'LOSS')}
                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                                      >
                                        Loss
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(schedule[currentRound] as Matchup[]).map((matchup, idx) => {
                              if (Array.isArray(matchup)) {
                                const [homeId, awayId] = matchup;
                                const h = players[homeId];
                                const a = players[awayId];
                                const key = `${currentRound}-${homeId}-${awayId}`;
                                const result = matchResults[key];
                                const hStyles = getTeamStyles(h.color);
                                const aStyles = getTeamStyles(a.color);

                                return (
                                  <div
                                    key={idx}
                                    className="p-4 bg-slate-950/40 rounded-xl border border-white/5 space-y-3.5 text-center sm:text-left"
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                      <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <span
                                          className={`w-3 h-3 rounded-full ${hStyles.bg}`}
                                          style={hStyles.bgStyle}
                                        />
                                        <span className="font-bold text-white text-sm">{h.name}</span>
                                      </div>
                                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                                        VS
                                      </span>
                                      <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <span className="font-bold text-white text-sm">{a.name}</span>
                                        <span
                                          className={`w-3 h-3 rounded-full ${aStyles.bg}`}
                                          style={aStyles.bgStyle}
                                        />
                                      </div>
                                    </div>

                                    {result ? (
                                      <div className="pt-1 border-t border-white/5 text-center font-mono font-black text-sm text-amber-400">
                                        {result === 'HOME' && `${h.name} Wins! (+${gameMode === 'LONG' ? 3 : 6})`}
                                        {result === 'AWAY' && `${a.name} Wins! (+${gameMode === 'LONG' ? 3 : 6})`}
                                        {result === 'DRAW' && `Draw (+${gameMode === 'LONG' ? 1 : 2} Each)`}
                                      </div>
                                    ) : (
                                      <div className="flex gap-1.5 justify-center sm:justify-end shrink-0 pt-1 border-t border-white/5">
                                        <button
                                          onClick={() => resolvePvP(homeId, awayId, 'HOME')}
                                          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-colors text-white ${
                                            hStyles.bg || 'bg-slate-800'
                                          } ${hStyles.hover || 'hover:bg-slate-700'}`}
                                          style={hStyles.style}
                                        >
                                          {h.name}
                                        </button>
                                        <button
                                          onClick={() => resolvePvP(homeId, awayId, 'DRAW')}
                                          className="flex-1 sm:flex-initial px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-black tracking-wider uppercase transition-colors"
                                        >
                                          Draw
                                        </button>
                                        <button
                                          onClick={() => resolvePvP(homeId, awayId, 'AWAY')}
                                          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-colors text-white ${
                                            aStyles.bg || 'bg-slate-800'
                                          } ${aStyles.hover || 'hover:bg-slate-700'}`}
                                          style={aStyles.style}
                                        >
                                          {a.name}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              } else {
                                const p = players[matchup];
                                const key = `${currentRound}-${p.id}-sim`;
                                const result = matchResults[key];
                                const pStyles = getTeamStyles(p.color);

                                return (
                                  <div
                                    key={idx}
                                    className="p-4 bg-slate-950/40 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span
                                        className={`w-3 h-3 rounded-full ${pStyles.bg}`}
                                        style={pStyles.bgStyle}
                                      />
                                      <span className="font-semibold text-white text-sm">{p.name}</span>
                                      <span className="text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-white/5 text-slate-400 font-medium">
                                        SIM MATCH
                                      </span>
                                    </div>

                                    {result ? (
                                      <div className="flex items-center gap-2 font-mono text-sm font-bold">
                                        {result === 'WIN' && (
                                          <span className="text-emerald-400">WIN (+{gameMode === 'LONG' ? 3 : 6} Pts)</span>
                                        )}
                                        {result === 'DRAW' && (
                                          <span className="text-slate-300">DRAW (+{gameMode === 'LONG' ? 1 : 2} Pts)</span>
                                        )}
                                        {result === 'LOSS' && (
                                          <span className="text-rose-400">LOSS (0 Pts)</span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          onClick={() => resolveSim(p.id, 'WIN')}
                                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                                        >
                                          Win
                                        </button>
                                        <button
                                          onClick={() => resolveSim(p.id, 'DRAW')}
                                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                                        >
                                          Draw
                                        </button>
                                        <button
                                          onClick={() => resolveSim(p.id, 'LOSS')}
                                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-colors"
                                        >
                                          Loss
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        )}
                      </div>

                      {/* Next controls / status indicator */}
                      {isRoundComplete() && (
                        <div className="pt-2 animate-fadeIn">
                          {currentRound + 1 < schedule.length ? (
                            <button
                              id="next-gw-btn"
                              type="button"
                              onClick={handleNextRound}
                              className="w-full bg-amber-400 text-slate-950 font-display font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-400/10 hover:bg-amber-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm tracking-wider uppercase"
                            >
                              <span>Next Gameweek</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              id="end-season-btn"
                              type="button"
                              onClick={handleEndSeason}
                              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-display font-black py-4 px-6 rounded-xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm tracking-wider uppercase"
                            >
                              <span>Full Time! End Season & Check Standings</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Secondary Actions Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Supercup attempts */}
                      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                        <div className="text-left space-y-0.5">
                          <h4 className="font-semibold text-white text-xs uppercase tracking-wide">
                            🏆 Supercup Final
                          </h4>
                          <p className="text-[10px] text-slate-400 max-w-[170px]">
                            Challenge the ultimate league boss.
                          </p>
                        </div>
                        <button
                          onClick={handleAttemptSupercup}
                          className="px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-white/10 rounded-xl text-[10px] font-bold text-amber-300 uppercase tracking-wider transition-colors shrink-0"
                        >
                          Attempt Match
                        </button>
                      </div>

                      {/* Reset app */}
                      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                        <div className="text-left space-y-0.5">
                          <h4 className="font-semibold text-white text-xs uppercase tracking-wide">
                            🔄 Reset Campaign
                          </h4>
                          <p className="text-[10px] text-slate-400 max-w-[170px]">
                            Wipe and start a new league.
                          </p>
                        </div>
                        <button
                          onClick={handleReset}
                          className="px-3 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0"
                        >
                          Reset App
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Off-season guide tab */}
              {activeTab === 'offseason' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <OffSeason
                    players={players}
                    seasonCount={seasonCount}
                    onProceedToNextSeason={handleProceedToNextSeason}
                    startingCash={startingCash}
                  />
                </motion.div>
              )}

              {/* Rules guide tab */}
              {activeTab === 'rules' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <RulesReference />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </>
      )}

      {/* Modern custom confirmation dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-display font-bold text-lg text-white">
              {confirmDialog.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              {confirmDialog.cancelText && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirmDialog.onCancel) confirmDialog.onCancel();
                    setConfirmDialog(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {confirmDialog.cancelText}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  confirmDialog.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30'
                    : confirmDialog.variant === 'warning'
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {confirmDialog.confirmText || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
