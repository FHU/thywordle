import {
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'

import { STAT_BONUS_POINTS } from './../../constants/settings'
import { GameStats, LeaderboardUser } from './../../constants/types'
import { StoredGameState } from './../localStorage'
import { getUserDocByUid } from './firebaseAuth'
import { db } from './firebaseConfig'

export const loadStatsFromFirestoreCollection = async (
  userId: string
): Promise<GameStats | null> => {
  const userDoc = await getUserDocByUid(userId)
  if (!userDoc.exists()) {
    return null
  }

  const stats: GameStats = {
    avgNumGuesses: userDoc.data().gameStats.avgNumGuesses,
    bestStreak: userDoc.data().gameStats.bestStreak,
    currentStreak: userDoc.data().gameStats.currentStreak,
    gamesFailed: userDoc.data().gameStats.gamesFailed,
    score: userDoc.data().gameStats.score,
    successRate: userDoc.data().gameStats.successRate,
    totalGames: userDoc.data().gameStats.totalGames,
    winDistribution: userDoc.data().gameStats.winDistribution,
  }

  return stats
}

export const loadGameStateFromFirestore = async (
  userId: string
): Promise<StoredGameState | undefined> => {
  const userDoc = await getUserDocByUid(userId)
  if (!userDoc.exists()) {
    return
  }

  return {
    guesses: userDoc.data().gameState.guesses,
    solution: userDoc.data().gameState.lastSolution,
    date: userDoc.data().gameState.lastUpdated.toDate(),
  }
}

export const saveUserStatsToFirestore = async (
  userId: string,
  stats: GameStats
): Promise<void> => {
  const userDoc = await getUserDocByUid(userId)
  if (userDoc.exists()) {
    const docRef = doc(db, 'users', userId)

    if (userDoc.data().gameStats.totalGames >= stats.totalGames) {
      return
    }

    const gamesWon = stats.totalGames - stats.gamesFailed

    const score = Math.round(
      gamesWon * STAT_BONUS_POINTS.WIN_BONUS +
        stats.gamesFailed * STAT_BONUS_POINTS.LOSE_BONUS +
        stats.successRate * STAT_BONUS_POINTS.SUCCESS_RATE_BONUS +
        (6 - stats.avgNumGuesses) * STAT_BONUS_POINTS.AVG_GUESS_BONUS +
        stats.currentStreak * STAT_BONUS_POINTS.STREAK_BONUS +
        stats.bestStreak * STAT_BONUS_POINTS.STREAK_BONUS
    )

    await updateDoc(docRef, {
      gameStats: {
        avgNumGuesses: stats.avgNumGuesses,
        bestStreak: stats.bestStreak,
        currentStreak: stats.currentStreak,
        gamesFailed: stats.gamesFailed,
        score: score,
        successRate: stats.successRate,
        totalGames: stats.totalGames,
        winDistribution: stats.winDistribution,
      },
    })
  }
}

export const updateGameStateToFirestore = async (
  userId: string,
  solution: string,
  guesses: string[]
): Promise<void> => {
  const userDoc = await getUserDocByUid(userId)
  if (userDoc.exists()) {
    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      gameState: {
        lastUpdated: Timestamp.now(),
        lastSolution: solution,
        guesses: guesses,
      },
    })
  }
}

export const getLeaderboardFromFirestore = async (
  userId?: string
): Promise<LeaderboardUser[]> => {
  let leaderBoard: LeaderboardUser[] = []

  // TODO: probably want to add limits to the number returned in the future -- will impact how rank is calculated currently
  const q = query(collection(db, 'users'), orderBy('gameStats.score', 'desc'))
  const querySnapshot = await getDocs(q)

  let rank = 1
  querySnapshot.forEach((doc) => {
    if (doc.data().displayPublic) {
      const lastPlayed = doc
        .data()
        .gameState.lastUpdated.toDate()
        .toLocaleDateString()

      leaderBoard.push({
        uid: doc.data().uid,
        rank: rank,
        name: doc.data().name,
        avgGuesses: doc.data().gameStats.avgNumGuesses,
        points: doc.data().gameStats.score,
        lastPlayed: lastPlayed,
        stats: {
          currentStreak: doc.data().gameStats.currentStreak,
          bestStreak: doc.data().gameStats.bestStreak,
          successRate: doc.data().gameStats.successRate,
        },
        highlightedUser: doc.data().uid === userId,
      })

      rank++
    }
  })

  return leaderBoard
}
