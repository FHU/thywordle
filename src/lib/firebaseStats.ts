import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { MAX_CHALLENGES, STAT_BONUS_POINTS } from './../constants/settings'
import {
  GameStats,
  GameStatsByDate,
  LeaderboardUser,
} from './../constants/types'
import { getScoreByUid, getUserDocByUid } from './firebaseAuth'
import { db } from './firebaseConfig'
import { updateGroupScores } from './firebaseGroups'
import { StoredGameState } from './localStorage'
import { getAverageNumberGuesses } from './stats'

export const getStatDocByDate = async (dateString: string): Promise<any> => {
  const docRef = doc(db, 'stats', dateString)
  return await getDoc(docRef)
}

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

export const loadGameStatsByDate = async (
  date: Date
): Promise<GameStatsByDate> => {
  const dateString =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

  const statDoc = await getStatDocByDate(dateString)
  if (!statDoc.exists()) {
    return {
      solution: '',
      winDistribution: [],
      successRate: 0,
      totalGames: 0,
      avgNumGuesses: 0,
    }
  }

  const gamesWon = statDoc
    .data()
    .winDistribution.reduce((x: number, y: number) => x + y, 0)
  const totalGames = statDoc.data().totalGames

  return {
    solution: statDoc.data().solution,
    winDistribution: statDoc.data().winDistribution,
    avgNumGuesses: statDoc.data().avgNumGuesses,
    totalGames: totalGames,
    successRate: Math.round(
      (100 * (totalGames - (totalGames - gamesWon))) / Math.max(totalGames, 1)
    ),
  }
}

export const saveGameStatsToFirestore = async (
  numGuesses: number,
  date: Date
): Promise<void> => {
  const dateString =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

  const statDoc = await getStatDocByDate(dateString)

  if (!statDoc.exists()) {
    const initialWinDistribution = Array.from(
      new Array(MAX_CHALLENGES),
      () => 0
    )
    initialWinDistribution[numGuesses] += 1
    await setDoc(doc(db, 'stats', dateString), {
      totalGames: 1,
      avgNumGuesses: numGuesses,
      winDistribution: initialWinDistribution,
    })
  } else {
    const loadedWinDistribution = statDoc.data().winDistribution
    loadedWinDistribution[numGuesses] += 1

    const avgGuesses = getAverageNumberGuesses(loadedWinDistribution)
    const docRef = doc(db, 'stats', dateString)
    await updateDoc(docRef, {
      totalGames: increment(1),
      avgNumGuesses: avgGuesses,
      winDistribution: loadedWinDistribution,
    })
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

    const oldScore = await getScoreByUid(userId)
    const gamesWon = stats.totalGames - stats.gamesFailed
    const score = Math.round(
      gamesWon * STAT_BONUS_POINTS.WIN_BONUS +
        stats.gamesFailed * STAT_BONUS_POINTS.LOSE_BONUS +
        stats.successRate * STAT_BONUS_POINTS.SUCCESS_RATE_BONUS +
        (6 - stats.avgNumGuesses) * STAT_BONUS_POINTS.AVG_GUESS_BONUS +
        stats.currentStreak * STAT_BONUS_POINTS.STREAK_BONUS +
        stats.bestStreak * STAT_BONUS_POINTS.STREAK_BONUS
    )

    await updateGroupScores(userId, score - oldScore)
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
  // TODO: probably want to add limits to the number returned in the future -- will impact how rank is calculated currently
  const q = query(collection(db, 'users'), orderBy('gameStats.score', 'desc'))
  const querySnapshot = await getDocs(q)
  let leaderBoard: LeaderboardUser[] = []
  let rank = 1
  querySnapshot.forEach((doc: any) => {
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
