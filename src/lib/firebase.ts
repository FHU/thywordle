import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import {
  GameStats,
  LeaderboardUser,
  ValidEmailEnum,
} from './../constants/types'
import { StoredGameState } from './localStorage'
import { defaultStats } from './stats'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
getAnalytics(app)

export const auth = getAuth(app)
export const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async (): Promise<void> => {
  try {
    signInWithPopup(auth, googleProvider)
      .then(async (res) => {
        await addUserToFirestoreCollection(
          res.user,
          res.user.displayName,
          'google'
        )
      })
      .catch((error) => {
        console.log(error)
      })
  } catch (err) {
    console.error(err)
  }
}

export const createAccountWithUsernameAndPassword = async (
  username: string,
  email: string,
  password: string
): Promise<string | undefined> => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    const uid = await addUserToFirestoreCollection(
      res.user,
      username,
      'password'
    )
    return uid
  } catch (err) {
    console.error(err)
  }
}

const getUserDocByUid = async (userId: string): Promise<any> => {
  const docRef = doc(db, 'users', userId)
  return await getDoc(docRef)
}

export const getUserDataByUid = async (userId: string): Promise<any> => {
  const user = await getUserDocByUid(userId)
  if (!user.exists) {
    return null
  }

  return user.data()
}

const addUserToFirestoreCollection = async (
  u: User,
  username: string | null,
  provider: string
): Promise<string | undefined> => {
  const user = await getUserDocByUid(u.uid)
  if (!user.exists()) {
    await setDoc(doc(db, 'users', u.uid), {
      uid: u.uid,
      name: username,
      email: u.email,
      authProvider: provider,
      photoURL: u.photoURL ?? '',
      gameState: {
        lastUpdated: Timestamp.now(),
        guesses: [],
        lastSolution: '',
      },
      gameStats: {
        avgNumGuesses: defaultStats.avgNumGuesses,
        bestStreak: defaultStats.bestStreak,
        currentStreak: defaultStats.currentStreak,
        gamesFailed: defaultStats.gamesFailed,
        score: defaultStats.score,
        successRate: defaultStats.successRate,
        totalGames: defaultStats.totalGames,
        winDistribution: defaultStats.winDistribution,
      },
    })

    return u.uid
  }
}

export const resetForgottenPassword = async (
  email: string
): Promise<boolean> => {
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      return true
    })
    .catch((error) => {
      console.log(error)
    })

  return false
}

export const checkIfEmailExistsInFirestore = async (
  email: string
): Promise<ValidEmailEnum> => {
  try {
    const users = query(
      collection(db, 'users'),
      where('email', '==', email),
      limit(1)
    )

    const querySnapshot = await getDocs(users)
    const result = querySnapshot.docs[0]

    if (!result) {
      return ValidEmailEnum.NotFound
    }

    if (result.data().authProvider === 'google') {
      return ValidEmailEnum.FoundGoogle
    }

    return ValidEmailEnum.FoundPassword
  } catch (error) {
    console.log(error)
    return ValidEmailEnum.NotFound
  }
}

export const logout = () => {
  signOut(auth)
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

export const saveStatsToFirestore = async (
  userId: string,
  stats: GameStats,
  solution: string
): Promise<void> => {
  const userDoc = await getUserDocByUid(userId)
  if (userDoc.exists()) {
    const docRef = doc(db, 'users', userId)

    if (userDoc.data().gameStats.totalGames >= stats.totalGames) {
      return
    }

    await updateDoc(docRef, {
      gameStats: {
        avgNumGuesses: stats.avgNumGuesses,
        bestStreak: stats.bestStreak,
        currentStreak: stats.currentStreak,
        gamesFailed: stats.gamesFailed,
        score: stats.score,
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
  }
}

export const getLeaderBoardFromFirestore = async (
  userId?: string
): Promise<LeaderboardUser[]> => {
  let leaderBoard: LeaderboardUser[] = []

  // TODO: probably want to add limits to the number returned in the future -- will impact how rank is calculated currently
  const q = query(collection(db, 'users'), orderBy('gameStats.score', 'desc'))
  const querySnapshot = await getDocs(q)

  let rank = 1
  querySnapshot.forEach((doc) => {
    leaderBoard.push({
      uid: doc.data().uid,
      rank: rank,
      name: doc.data().name,
      avgGuesses: doc.data().gameStats.avgNumGuesses,
      points: doc.data().gameStats.score,
      stats: {
        currentStreak: doc.data().gameStats.currentStreak,
        bestStreak: doc.data().gameStats.bestStreak,
        successRate: doc.data().gameStats.successRate,
      },
      highlightedUser: doc.data().uid === userId,
    })

    rank++
  })

  return leaderBoard
}
