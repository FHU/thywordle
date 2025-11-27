import {
  Timestamp,
  collection,
  doc,
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  startAfter,
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
  stats: GameStats,
  completedSolution?: string,
  requestId?: string
): Promise<void> => {
  const docRef = doc(db, 'users', userId)

  // Use a transaction to make the write idempotent and prevent race conditions
  // where two concurrent callers both read the same current totalGames and
  // both attempt to write the same (or duplicate) stats which can result in
  // duplicated score effects.
  await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(docRef)
    if (!userDoc.exists()) {
      return
    }

    const currentTotalGames =
      userDoc.data().gameStats && userDoc.data().gameStats.totalGames
        ? userDoc.data().gameStats.totalGames
        : 0

    const storedLastCompleted =
      userDoc.data().gameStats && userDoc.data().gameStats.lastCompletedSolution
        ? userDoc.data().gameStats.lastCompletedSolution
        : undefined

    // If the incoming update reports the same completedSolution as the
    // stored marker, it is a duplicate — skip to avoid counting twice.
    if (completedSolution && storedLastCompleted === completedSolution) {
      return
    }

    // If the stored totalGames is already greater than or equal to the new
    // stats.totalGames, someone already recorded this (or a newer) completion,
    // so skip writing to avoid double-applying score.
    if (currentTotalGames >= stats.totalGames) {
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

    const updatePayload: any = {
      'gameStats.avgNumGuesses': stats.avgNumGuesses,
      'gameStats.bestStreak': stats.bestStreak,
      'gameStats.currentStreak': stats.currentStreak,
      'gameStats.gamesFailed': stats.gamesFailed,
      'gameStats.score': score,
      'gameStats.successRate': stats.successRate,
      'gameStats.totalGames': stats.totalGames,
      'gameStats.winDistribution': stats.winDistribution,
    }

    if (completedSolution) {
      updatePayload['gameStats.lastCompletedSolution'] = completedSolution
      updatePayload['gameStats.lastCompletedAt'] = Timestamp.now()
    }

    // Prepare an audit entry to record this transactional change
    const auditId = `${userId}_${requestId ?? String(Date.now())}`
    const auditRef = doc(db, 'userStatsAudit', auditId)

    const statsBefore = userDoc.data().gameStats || {}
    const statsAfter = {
      avgNumGuesses: stats.avgNumGuesses,
      bestStreak: stats.bestStreak,
      currentStreak: stats.currentStreak,
      gamesFailed: stats.gamesFailed,
      score: score,
      successRate: stats.successRate,
      totalGames: stats.totalGames,
      winDistribution: stats.winDistribution,
      lastCompletedSolution: completedSolution,
    }

    const auditPayload: any = {
      uid: userId,
      eventType: 'client_submit',
      requestId: requestId ?? null,
      source: 'web-client',
      completedSolution: completedSolution ?? null,
      totalGamesBefore: statsBefore.totalGames ?? null,
      totalGamesAfter: stats.totalGames,
      scoreBefore: statsBefore.score ?? null,
      scoreAfter: score,
      statsBefore: statsBefore,
      statsAfter: statsAfter,
      serverTimestamp: Timestamp.now(),
    }

    transaction.update(docRef, updatePayload)
    transaction.set(auditRef, auditPayload)
  })
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
    try {
      const auditId = `${userId}_state_${Date.now()}`
      const auditRef = doc(db, 'userStatsAudit', auditId)
      const auditPayload = {
        uid: userId,
        eventType: 'game_state_update',
        source: 'updateGameStateToFirestore',
        lastSolution: solution,
        guessesCount: guesses.length,
        serverTimestamp: Timestamp.now(),
      }
      await setDoc(auditRef, auditPayload)
    } catch (e) {
      // ignore audit failures
    }
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

/**
 * Recalculate every user's `gameStats.score` from their stored `gameStats` fields
 * and update Firestore when the stored score differs from the computed value.
 * Returns a summary of how many documents were updated, skipped, or errored.
 */
export const recalculateAllScoresFromGameStats = async (
  batchSize = 100
): Promise<{
  updated: number
  skipped: number
  errors: number
}> => {
  let updated = 0
  let skipped = 0
  let errors = 0

  const computeScore = (s: GameStats) => {
    const gamesWon = s.totalGames - s.gamesFailed
    return Math.round(
      gamesWon * STAT_BONUS_POINTS.WIN_BONUS +
        s.gamesFailed * STAT_BONUS_POINTS.LOSE_BONUS +
        s.successRate * STAT_BONUS_POINTS.SUCCESS_RATE_BONUS +
        (6 - s.avgNumGuesses) * STAT_BONUS_POINTS.AVG_GUESS_BONUS +
        s.currentStreak * STAT_BONUS_POINTS.STREAK_BONUS +
        s.bestStreak * STAT_BONUS_POINTS.STREAK_BONUS
    )
  }

  let lastDoc: any | undefined = undefined
  let batchIndex = 0

  while (true) {
    const batchQuery = lastDoc
      ? query(
          collection(db, 'users'),
          orderBy(documentId()),
          startAfter(lastDoc),
          limit(batchSize)
        )
      : query(collection(db, 'users'), orderBy(documentId()), limit(batchSize))

    batchIndex += 1
    const snap = await getDocs(batchQuery)
    if (snap.empty) break

    for (const userDocSnap of snap.docs) {
      try {
        const data = userDocSnap.data()
        if (!data || !data.gameStats) {
          skipped++
          continue
        }

        const stats: GameStats = {
          avgNumGuesses: data.gameStats.avgNumGuesses,
          bestStreak: data.gameStats.bestStreak,
          currentStreak: data.gameStats.currentStreak,
          gamesFailed: data.gameStats.gamesFailed,
          score: data.gameStats.score,
          successRate: data.gameStats.successRate,
          totalGames: data.gameStats.totalGames,
          winDistribution: data.gameStats.winDistribution,
        }

        const expectedScore = computeScore(stats)

        // If stored score already matches expected, skip updating
        if (stats.score === expectedScore) {
          skipped++
          continue
        }

        const docRef = doc(db, 'users', userDocSnap.id)

        const didUpdate = await runTransaction(db, async (transaction) => {
          const fresh = await transaction.get(docRef)
          if (!fresh.exists()) {
            return false
          }

          const freshStats = fresh.data().gameStats
          if (!freshStats) {
            return false
          }

          const freshGameStats: GameStats = {
            avgNumGuesses: freshStats.avgNumGuesses,
            bestStreak: freshStats.bestStreak,
            currentStreak: freshStats.currentStreak,
            gamesFailed: freshStats.gamesFailed,
            score: freshStats.score,
            successRate: freshStats.successRate,
            totalGames: freshStats.totalGames,
            winDistribution: freshStats.winDistribution,
          }

          const freshComputed = computeScore(freshGameStats)

          if (freshGameStats.score !== freshComputed) {
              transaction.update(docRef, { 'gameStats.score': freshComputed })

              // Add an audit entry for recalculation changes
              const auditId = `${userDocSnap.id}_recalc_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2)}`
              const auditRef = doc(db, 'userStatsAudit', auditId)
              const auditPayload = {
                uid: userDocSnap.id,
                eventType: 'recalc',
                source: 'recalculateAllScoresFromGameStats',
                scoreBefore: freshGameStats.score,
                scoreAfter: freshComputed,
                serverTimestamp: Timestamp.now(),
              }
              transaction.set(auditRef, auditPayload)
            return true
          }

          return false
        })

        if (didUpdate) {
          updated++
        } else {
          skipped++
        }
      } catch (e) {
        errors++
        console.error(`Recalc: error processing ${userDocSnap.id}:`, e)
      }
    }
    // Prepare for next batch
    console.log(`Recalc: batch ${batchIndex} complete!`)
    lastDoc = snap.docs[snap.docs.length - 1]
    if (snap.size < batchSize) break
  }

  console.log(
    `Recalc: complete — total updated=${updated} skipped=${skipped} errors=${errors}`
  )

  return { updated, skipped, errors }
}
