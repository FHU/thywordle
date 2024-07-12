import { doc, getDoc, increment, setDoc, updateDoc } from 'firebase/firestore'

import { getAverageNumberGuesses } from '../stats'
import { MAX_CHALLENGES } from './../../constants/settings'
import { GameStatsByDate } from './../../constants/types'
import { dailyStatDb } from './firebaseConfig'

const getStatDocByDate = async (dateString: string): Promise<any> => {
  const docRef = doc(dailyStatDb, 'stats', dateString)
  return await getDoc(docRef)
}

export const loadDailyStatsByDate = async (
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

export const saveDailyStatsToFirestore = async (
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
    await setDoc(doc(dailyStatDb, 'stats', dateString), {
      totalGames: 1,
      avgNumGuesses: numGuesses + 1,
      winDistribution: initialWinDistribution,
    })
  } else {
    const loadedWinDistribution = statDoc.data().winDistribution
    loadedWinDistribution[numGuesses] += 1

    const avgGuesses = getAverageNumberGuesses(loadedWinDistribution)
    const docRef = doc(dailyStatDb, 'stats', dateString)
    await updateDoc(docRef, {
      totalGames: increment(1),
      avgNumGuesses: avgGuesses,
      winDistribution: loadedWinDistribution,
    })
  }
}
