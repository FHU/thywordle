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

export type GameStatsByDate = {
  solution: string
  winDistribution: number[]
  successRate: number
  totalGames: number
  avgNumGuesses: number
}

export type LeaderboardUser = {
  uid: string
  rank: number
  name: string
  avgGuesses: number
  points: number
  lastPlayed: string
  stats: { currentStreak: number; bestStreak: number; successRate: number }
  highlightedUser: boolean
}

export type Group = {
  groupName: string
  adminEmail: string
  isPrivate: boolean
  users: LeaderboardUser[]
  requestedUsers: any[]
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
  PublicDisplaySetting,
}

export type UpdateMetadata = {
  content: JSX.Element
  title: string
  date: string
}
