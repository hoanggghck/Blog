export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export interface SeasonConfig {
  season: Season;
  month: number;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  description: string;
}

export function getSeason(date: Date = new Date()): SeasonConfig {
  const month = date.getMonth() + 1; // 1-12

  // Northern Hemisphere seasons
  if (month === 12 || month === 1 || month === 2) {
    return {
      season: 'winter',
      month,
      gradientFrom: 'from-blue-600',
      gradientTo: 'to-cyan-400',
      accentColor: 'text-blue-100',
      description: 'Winter',
    };
  }

  if (month === 3 || month === 4 || month === 5) {
    return {
      season: 'spring',
      month,
      gradientFrom: 'from-green-400',
      gradientTo: 'to-emerald-300',
      accentColor: 'text-green-100',
      description: 'Spring',
    };
  }

  if (month === 6 || month === 7 || month === 8) {
    return {
      season: 'summer',
      month,
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-yellow-300',
      accentColor: 'text-yellow-100',
      description: 'Summer',
    };
  }

  // Autumn
  return {
    season: 'autumn',
    month,
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-red-400',
    accentColor: 'text-orange-100',
    description: 'Autumn',
  };
}
