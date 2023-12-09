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
  updateEmail,
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
  Group,
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
googleProvider.setCustomParameters({ prompt: 'select_account' })

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
    const res = await createUserWithEmailAndPassword(
      auth,
      email.toLocaleLowerCase(),
      password
    )
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
      email: u.email?.toLocaleLowerCase(),
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
      groups: [],
    })

    return u.uid
  }
}

export const updateFirestoreUsername = async (
  userId: string,
  newUsername: string
): Promise<boolean> => {
  try {
    const userDoc = await getUserDocByUid(userId)
    if (userDoc.exists()) {
      const docRef = doc(db, 'users', userId)
      await updateDoc(docRef, {
        name: newUsername,
      })
      return true
    }
  } catch {
    return false
  }

  return false
}

export const updateFirestoreEmail = async (
  user: User | null | undefined,
  newEmail: string,
  authProvider: string
): Promise<boolean> => {
  if (!user) {
    return false
  }

  const userDoc = await getUserDocByUid(user.uid)
  if (userDoc.exists()) {
    try {
      await updateEmail(user, newEmail.toLocaleLowerCase())
      const docRef = doc(db, 'users', user.uid)
      await updateDoc(docRef, {
        email: newEmail.toLocaleLowerCase(),
      })

      if (authProvider === 'google') {
        await updateDoc(docRef, {
          authProvider: 'password',
        })
      }

      return true
    } catch {
      return false
    }
  }

  return false
}

export const resetForgottenPassword = async (
  email: string | null
): Promise<boolean> => {
  if (email) {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        return true
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return false
}

export const checkIfEmailExistsInFirestore = async (
  email: string
): Promise<ValidEmailEnum> => {
  try {
    const users = query(
      collection(db, 'users'),
      where('email', '==', email.toLocaleLowerCase()),
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

export const getGroupsByUidFromFirestore = async (
  userId: string
): Promise<string[]> => {
  const userDoc = await getUserDocByUid(userId)
  if (!userDoc.exists()) {
    return []
  }

  return userDoc.data().groups
}

export const getCleanedGroupName = (groupName: string): string => {
  return groupName.toLocaleLowerCase().replace(/\s/g, '')
}

export const checkIfGroupExistsInFirestore = async (
  groupName: string
): Promise<any> => {
  try {
    const groups = query(
      collection(db, 'groups'),
      where('queryName', '==', getCleanedGroupName(groupName)),
      limit(1)
    )

    const querySnapshot = await getDocs(groups)
    const result = querySnapshot.docs[0]

    if (!result) {
      return null
    }

    return {
      groupName: result.data().groupName,
      queryName: result.data().queryName,
      isPrivate: result.data().isPrivate,
    }
  } catch (error) {
    console.log(error)
    return true
  }
}

export const getGroupLeaderboardByGroupNameFromFirestore = async (
  groupName: string | undefined,
  uid: string
): Promise<Group | null> => {
  if (!groupName) {
    return null
  }

  try {
    const groupQuery = query(
      collection(db, 'groups'),
      where('queryName', '==', getCleanedGroupName(groupName)),
      limit(1)
    )

    const querySnapshot = await getDocs(groupQuery)
    const result = querySnapshot.docs[0]

    if (!result) {
      return null
    }

    const groupLeaderboard: LeaderboardUser[] = []

    let rank = 1
    for (let i = 0; i < result.data().users.length; i++) {
      const userDoc = await getDoc(result.data().users[i])
      const userData: any = userDoc.data()
      if (userDoc.exists() && userDoc.data() !== undefined) {
        const u = {
          uid: userData.uid,
          rank: rank,
          name: userData.name,
          avgGuesses: userData.gameStats.avgNumGuesses,
          points: userData.gameStats.score,
          stats: {
            currentStreak: userData.gameStats.currentStreak,
            bestStreak: userData.gameStats.bestStreak,
            successRate: userData.gameStats.successRate,
          },
          highlightedUser: userData.uid === uid,
        }

        groupLeaderboard.push(u)
        rank++
      }
    }

    return {
      groupName: result.data().groupName,
      isPrivate: result.data().isPrivate,
      users: groupLeaderboard,
    }
  } catch (error) {
    console.log(error)
    return null
  }
}
