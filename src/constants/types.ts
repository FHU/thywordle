export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
  score: number
  avgNumGuesses: number
}

export type LeaderboardUser = {
  uid: string
  rank: number
  name: string
  avgGuesses: number
  points: number
  stats: { currentStreak: number; bestStreak: number; successRate: number }
  highlightedUser: boolean
}

export enum ValidEmailEnum {
  NotFound,
  FoundPassword,
  FoundGoogle,
}

export enum PropToEditEnum {
  Username,
  Email,
  Password,
  Image,
}
