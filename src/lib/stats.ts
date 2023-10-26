import { User } from 'firebase/auth'

import { GameStats } from '@/constants/types'

import { MAX_CHALLENGES } from '../constants/settings'
import {
  loadStatsFromFirestoreCollection,
  saveStatsToFirestoreCollection,
} from './firebase'
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './localStorage'

export const defaultStats: GameStats = {
  winDistribution: Array.from(new Array(MAX_CHALLENGES), () => 0),
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
  score: 0,
  avgNumGuesses: 0,
}

// In stats array elements 0-5 are successes in 1-6 tries

export const addStatsForCompletedGame = async (
  gameStats: GameStats,
  count: number,
  user: User | null | undefined
) => {
  // Count is number of incorrect guesses before end.
  let stats = { ...gameStats }

  if (user) {
    const loadedStats = await loadStatsFromFirestoreCollection(user.uid)
    if (loadedStats) {
      stats = { ...loadedStats }
    }
  }

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

  if (user) {
    stats.score = getScore(stats)
    await saveStatsToFirestoreCollection(user.uid, stats)
  }

  return stats
}

export const loadStats = async (
  user: User | null | undefined
): Promise<GameStats> => {
  const localStorageStats = loadStatsFromLocalStorage() || defaultStats

  if (user) {
    const firestoreStats = await loadStatsFromFirestoreCollection(user.uid)

    if (firestoreStats) {
      return firestoreStats
    }
  }

  return localStorageStats
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
  const WIN_BONUS = 256
  const LOSE_BONUS = 32
  const SUCCESS_RATE_BONUS = 64
  const AVG_GUESS_BONUS = 512
  const STREAK_BONUS = 8

  const gamesWon = gameStats.totalGames - gameStats.gamesFailed

  const score =
    gamesWon * WIN_BONUS +
    gameStats.gamesFailed * LOSE_BONUS +
    gameStats.successRate * SUCCESS_RATE_BONUS +
    (6 - gameStats.avgNumGuesses) * AVG_GUESS_BONUS +
    gameStats.currentStreak * STREAK_BONUS +
    gameStats.bestStreak * STREAK_BONUS

  return Math.round(score)
}
