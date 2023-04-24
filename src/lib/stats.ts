import { MAX_CHALLENGES } from '../constants/settings'
import {
  GameStats,
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

// In stats array elements 0-5 are successes in 1-6 trys

export const addStatsForCompletedGame = (
  gameStats: GameStats,
  count: number
) => {
  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }

  stats.totalGames += 1

  if (count >= MAX_CHALLENGES) {
    // A fail situation
    stats.currentStreak = 0
    stats.gamesFailed += 1
  } else {
    stats.winDistribution[count] += 1
    stats.currentStreak += 1

    if (stats.bestStreak < stats.currentStreak) {
      stats.bestStreak = stats.currentStreak
    }
  }

  stats.successRate = getSuccessRate(stats)
  stats.avgNumGuesses = getAverageNumberGuesses(stats)

  saveStatsToLocalStorage(stats)
  return stats
}

const defaultStats: GameStats = {
  winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
  score: 0,
  avgNumGuesses: 0,
}

export const loadStats = () => {
  return loadStatsFromLocalStorage() || defaultStats
}

export const getSuccessRate = (gameStats: GameStats) => {
  const { totalGames, gamesFailed } = gameStats

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  )
}

export const getAverageNumberGuesses = (gameStats: GameStats) => {
  const { winDistribution } = gameStats
  let totalGuesses = 0
  let totalGames = 0
  for (let i = 0; i < winDistribution.length; i++) {
    totalGames += winDistribution[i]
    totalGuesses += winDistribution[i] * (i + 1)
  }

  return Number((totalGuesses / totalGames).toFixed(2))
}

export const getScore = (gameStats: GameStats): number => {
  const WINBONUS = 256
  const LOSEBONUS = 32
  const SUCCESSRATEBONUS = 64
  const AVGGUESSBONUS = 512
  const STREAKBONUS = 8

  const gamesWon = gameStats.totalGames - gameStats.gamesFailed

  console.log(gameStats)

  const score =
    gamesWon * WINBONUS +
    gameStats.gamesFailed * LOSEBONUS +
    gameStats.successRate * SUCCESSRATEBONUS +
    (6 - gameStats.avgNumGuesses) * AVGGUESSBONUS +
    gameStats.currentStreak * STREAKBONUS +
    gameStats.bestStreak * STREAKBONUS

  return Math.round(score)
}
