export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

export interface SeasonConfig {
  season: Season;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  description: string;
  textColor: string;
}

const seasonConfig: Record<Season, SeasonConfig> = {
  winter: {
    season: 'winter',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-cyan-400',
    accentColor: 'text-blue-100',
    description: 'Winter',
    textColor: 'text-white'
  },
  spring: {
    season: 'spring',
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-300',
    accentColor: 'text-green-100',
    description: 'Spring',
    textColor: 'text-black'
  },
  summer: { 
    season: 'summer',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-yellow-300',
    accentColor: 'text-yellow-100',
    description: 'Summer',
    textColor: 'text-white'
  },
  autumn: { 
    season: 'autumn',
    gradientFrom: 'from-orange-600',
    gradientTo: 'to-red-400',
    accentColor: 'text-orange-100',
    description: 'Autumn',
    textColor: 'text-white'
  },
};
export function getSeason(date: Date = new Date()): SeasonConfig {
  const month = date.getMonth() + 1; // 1-12

  switch (month) {
    case 10:
    case 11:
    case 12:
      return seasonConfig.winter;
    case 1:
    case 2:
    case 3:
      return seasonConfig.spring;
    case 4:
    case 5:
    case 6:
      return seasonConfig.summer;
    default:
      return seasonConfig.autumn;
  }
}
