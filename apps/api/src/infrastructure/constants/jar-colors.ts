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

export function isValidJarColor(color: string): color is JarColor {
  return JAR_COLORS.includes(color as JarColor);
}
