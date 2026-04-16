export const JAR_COLORS = [
  'blue',
  'green',
  'red',
  'yellow',
  'purple',
  'orange',
  'pink',
  'cyan',
  'amber',
  'slate',
] as const;

export type JarColor = (typeof JAR_COLORS)[number];

const colorMap: Record<JarColor, string> = {
  blue: '#3b82f6',
  green: '#10b981',
  red: '#ef4444',
  yellow: '#fbbf24',
  purple: '#a855f7',
  orange: '#f97316',
  pink: '#ec4899',
  cyan: '#06b6d4',
  amber: '#f59e0b',
  slate: '#64748b',
};

export function getColorHex(color: JarColor): string {
  return colorMap[color];
}

export function getColorTailwind(color: JarColor): string {
  const tailwindMap: Record<JarColor, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-500',
  };
  return tailwindMap[color];
}
