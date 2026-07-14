import { useState } from 'react';
import { Player } from '../types';
import { Plus, Trash2, Play, Users, Target, Smartphone, AlertCircle, Calendar, Coins } from 'lucide-react';
import { TEAM_COLORS, getTeamStyles } from '../utils/color';

export { TEAM_COLORS };

export const COLOR_OPTIONS = [
  'Red',
  'Blue',
  'Yellow',
  'Purple',
  'Green',
  'Pink',
  'Custom'
];

interface SetupScreenProps {
  onKickOff: (players: Player[], target: number, gameMode: 'STANDARD' | 'LONG', startingCash: number) => void;
}

export default function SetupScreen({ onKickOff }: SetupScreenProps) {
  const [targetScore, setTargetScore] = useState<number>(100);
  const [gameMode, setGameMode] = useState<'STANDARD' | 'LONG'>('STANDARD');
  const [startingCash, setStartingCash] = useState<number>(120);
  const [managers, setManagers] = useState<Array<{ name: string; color: string }>>([
    { name: '', color: 'Red' },
    { name: '', color: 'Blue' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const addManager = () => {
    if (managers.length >= 6) {
      setError('A maximum of 6 managers can participate.');
      return;
    }
    const availableColor = COLOR_OPTIONS.filter(c => c !== 'Custom').find(c => !managers.some(m => m.color === c)) || COLOR_OPTIONS[0];
    setManagers([...managers, { name: '', color: availableColor }]);
    setError(null);
  };

  const removeManager = (index: number) => {
    if (managers.length <= 2) {
      setError('At least 2 managers are required.');
      return;
    }
    setManagers(managers.filter((_, i) => i !== index));
    setError(null);
  };

  const updateManagerName = (index: number, name: string) => {
    const updated = [...managers];
    updated[index].name = name;
    setManagers(updated);
    setError(null);
  };

  const updateManagerColor = (index: number, color: string) => {
    const updated = [...managers];
    updated[index].color = color;
    setManagers(updated);
    setError(null);
  };

  const handleKickOff = () => {
    // Validations
    const activeManagers = managers.filter(m => m.name.trim() !== '');
    if (activeManagers.length < 2) {
      setError('Please provide names for at least 2 managers.');
      return;
    }

    const colorsUsed = activeManagers.map(m => m.color);
    const uniqueColors = new Set(colorsUsed);
    if (uniqueColors.size !== colorsUsed.length) {
      setError('Two managers cannot have the same team color!');
      return;
    }

    if (!targetScore || targetScore <= 0) {
      setError('Please provide a valid target score greater than 0.');
      return;
    }

    const playersList: Player[] = activeManagers.map((m, idx) => ({
      id: idx,
      name: m.name.trim(),
      color: m.color,
      stars: 0,
      points: 20, // Start of game base points
      wins: 0,
      draws: 0,
      losses: 0,
    }));

    onKickOff(playersList, targetScore, gameMode, startingCash);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-white/10 shadow-2xl space-y-6 text-left">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-display text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Match Setup</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure target score, choose starting cash, and add managers to begin the campaign.
          </p>
        </div>

        {/* Target Points Input */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Target Points to Win</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="setup-target-score"
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(parseInt(e.target.value) || 100)}
              className="w-28 bg-slate-900 border border-white/15 rounded-lg px-3 py-2 text-white font-mono font-bold text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-400">
              Managers start at 20 points. First to reach {targetScore} wins!
            </span>
          </div>
        </div>

        {/* Starting Cash Option Selector */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-3">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Starting Cash (Board Backing)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Slow', amount: 90, desc: '90 Million' },
              { label: 'Normal', amount: 120, desc: '120 Million' },
              { label: 'Quick', amount: 150, desc: '150 Million' },
            ].map((option) => (
              <button
                key={option.amount}
                type="button"
                onClick={() => setStartingCash(option.amount)}
                className={`p-3 rounded-xl border text-center transition-all focus:outline-none flex flex-col items-center justify-center gap-1 ${
                  startingCash === option.amount
                    ? 'bg-amber-400/10 border-amber-400 text-white shadow-md shadow-amber-400/5'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-xs">{option.label}</div>
                <div className={`font-mono text-[11px] font-black ${startingCash === option.amount ? 'text-amber-300' : 'text-slate-400'}`}>
                  {option.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Game Length / Mode Selector */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-3">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Game Length / Mode</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGameMode('STANDARD')}
              className={`p-3.5 rounded-xl border text-left transition-all focus:outline-none flex flex-col justify-between ${
                gameMode === 'STANDARD'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs text-white">Standard Game</div>
              <div className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                5 matches per season. Wins give 6 points, draws give 2 points.
              </div>
            </button>
            <button
              type="button"
              onClick={() => setGameMode('LONG')}
              className={`p-3.5 rounded-xl border text-left transition-all focus:outline-none flex flex-col justify-between ${
                gameMode === 'LONG'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs text-white">Long Game (Home & Away)</div>
              <div className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                10 matches per season. Standard 5 matches repeated with reversed roles. Win gives 3 points, draw gives 1 point.
              </div>
            </button>
          </div>
        </div>

        {/* Managers List */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Managers ({managers.length} / 6)
          </label>

          <div className="space-y-2">
            {managers.map((m, idx) => {
              const managerStyles = getTeamStyles(m.color);
              const isHex = m.color.startsWith('#');
              const selectValue = isHex ? 'Custom' : m.color;

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 bg-slate-950/40 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-2.5 flex-1 w-full">
                    <div
                      className={`w-3.5 h-3.5 rounded-full shrink-0 ${managerStyles.bg}`}
                      style={managerStyles.bgStyle}
                    />
                    <input
                      type="text"
                      placeholder={`Manager Name ${idx + 1}`}
                      value={m.name}
                      onChange={(e) => updateManagerName(idx, e.target.value)}
                      className="flex-1 bg-slate-900/60 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                    <select
                      value={selectValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Custom') {
                          updateManagerColor(idx, '#ea580c'); // Default custom orange
                        } else {
                          updateManagerColor(idx, val);
                        }
                      }}
                      className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1 sm:flex-initial"
                    >
                      {COLOR_OPTIONS.map((c) => (
                        <option key={c} value={c} className="bg-slate-900 text-white">
                          {c}
                        </option>
                      ))}
                    </select>

                    {isHex && (
                      <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg px-2 py-1">
                        <input
                          type="color"
                          value={m.color}
                          onChange={(e) => updateManagerColor(idx, e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                          title="Custom Palette Picker"
                        />
                        <input
                          type="text"
                          value={m.color}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.startsWith('#') && val.length <= 7) {
                              updateManagerColor(idx, val);
                            }
                          }}
                          className="w-14 bg-transparent text-[10px] font-mono text-white text-center focus:outline-none uppercase shrink-0"
                          maxLength={7}
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeManager(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title="Remove manager"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 flex gap-2 items-start text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              id="setup-add-manager-btn"
              type="button"
              onClick={addManager}
              className="flex-1 py-2 border border-dashed border-white/20 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Manager</span>
            </button>
          </div>
        </div>

        {/* Kick off CTA */}
        <button
          id="setup-kickoff-btn"
          type="button"
          onClick={handleKickOff}
          className="w-full bg-amber-400 text-slate-950 font-display font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-400/15 hover:bg-amber-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base tracking-wide"
        >
          <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
          <span>KICK OFF SEASON 1!</span>
        </button>
      </div>

      {/* QR Code section */}
      <div className="bg-slate-900/60 rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-center gap-4 text-left">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://jameswalker85.github.io/Superclub/assistant.html"
          alt="QR Code for Assistant App"
          className="w-24 h-24 bg-white p-1 rounded-xl border border-white/10 shrink-0 shadow-lg"
        />
        <div className="space-y-1">
          <h4 className="font-display font-semibold text-white flex items-center gap-1.5 text-sm">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Mobile Assistant App</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Scan this code to launch Superclub Assistant. Use this to track your squad, money, injuries and more!
          </p>
        </div>
      </div>
    </div>
  );
}
