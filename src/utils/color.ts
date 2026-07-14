import { CSSProperties } from 'react';

export interface ColorStyle {
  bg: string;
  text: string;
  badge: string;
  hover: string;
  border: string;
  bgLight: string;
  hex: string;
}

export const TEAM_COLORS: Record<string, ColorStyle> = {
  'Red': { bg: 'bg-red-600', text: 'text-red-400', badge: 'bg-red-600', hover: 'hover:bg-red-700', border: 'border-red-500', bgLight: 'bg-red-500/10', hex: '#dc2626' },
  'Blue': { bg: 'bg-blue-600', text: 'text-blue-400', badge: 'bg-blue-600', hover: 'hover:bg-blue-700', border: 'border-blue-500', bgLight: 'bg-blue-500/10', hex: '#2563eb' },
  'Yellow': { bg: 'bg-yellow-400', text: 'text-yellow-400', badge: 'bg-yellow-400', hover: 'hover:bg-yellow-500', border: 'border-yellow-400', bgLight: 'bg-yellow-400/10', hex: '#facc15' },
  'Purple': { bg: 'bg-purple-600', text: 'text-purple-400', badge: 'bg-purple-600', hover: 'hover:bg-purple-700', border: 'border-purple-500', bgLight: 'bg-purple-500/10', hex: '#9333ea' },
  'Green': { bg: 'bg-emerald-600', text: 'text-emerald-400', badge: 'bg-emerald-600', hover: 'hover:bg-emerald-700', border: 'border-emerald-500', bgLight: 'bg-emerald-500/10', hex: '#059669' },
  'Pink': { bg: 'bg-pink-600', text: 'text-pink-400', badge: 'bg-pink-600', hover: 'hover:bg-pink-700', border: 'border-pink-500', bgLight: 'bg-pink-500/10', hex: '#db2777' },
};

export function getTeamStyles(color: string) {
  const preset = TEAM_COLORS[color];
  if (preset) {
    return {
      bg: preset.bg,
      text: preset.text,
      badge: preset.badge,
      hover: preset.hover,
      border: preset.border,
      bgLight: preset.bgLight,
      hex: preset.hex,
      style: {} as CSSProperties,
      bgStyle: {} as CSSProperties,
      textStyle: {} as CSSProperties,
      borderStyle: {} as CSSProperties,
      bgLightStyle: {} as CSSProperties,
    };
  }

  // Handle custom hex colors
  if (color.startsWith('#')) {
    return {
      bg: '',
      text: '',
      badge: '',
      hover: '',
      border: '',
      bgLight: '',
      hex: color,
      style: { backgroundColor: color, borderColor: color, color: '#ffffff' } as CSSProperties,
      bgStyle: { backgroundColor: color } as CSSProperties,
      textStyle: { color: color } as CSSProperties,
      borderStyle: { borderColor: color } as CSSProperties,
      bgLightStyle: { backgroundColor: `${color}15` } as CSSProperties,
    };
  }

  // Fallback
  const fallback = TEAM_COLORS['Red'];
  return {
    bg: fallback.bg,
    text: fallback.text,
    badge: fallback.badge,
    hover: fallback.hover,
    border: fallback.border,
    bgLight: fallback.bgLight,
    hex: fallback.hex,
    style: {} as CSSProperties,
    bgStyle: {} as CSSProperties,
    textStyle: {} as CSSProperties,
    borderStyle: {} as CSSProperties,
    bgLightStyle: {} as CSSProperties,
  };
}
