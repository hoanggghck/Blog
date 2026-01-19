export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export interface SeasonConfig {
  season: Season;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  description: string;
}

const seasonConfig: Record<Season, SeasonConfig> = {
  winter: {
    season: 'winter',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-cyan-400',
    accentColor: 'text-blue-100',
    description: 'Winter',
  },
  spring: {
    season: 'spring',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-300',
    accentColor: 'text-green-100',
    description: 'Spring',
  },
  summer: { 
    season: 'summer',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-yellow-300',
    accentColor: 'text-yellow-100',
    description: 'Summer',
  },
  autumn: { 
    season: 'autumn',
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-red-400',
    accentColor: 'text-orange-100',
    description: 'Autumn',
  },
};
export function getSeason(date: Date = new Date()): SeasonConfig {
  const month = date.getMonth() + 1; // 1-12

  switch (month) {
    case 12:
    case 1:
    case 2:
      return seasonConfig.winter;
    case 3:
    case 4:
    case 5:
      return seasonConfig.spring;
    case 6:
    case 7:
    case 8:
      return seasonConfig.summer;
    default:
      return seasonConfig.autumn;
  }
}
