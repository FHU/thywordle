import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { GameStats } from './../constants/types'

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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.uid)
  } else {
    console.log('signed out')
  }
})

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
): Promise<void> => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    await addUserToFirestoreCollection(res.user, username, 'password')
  } catch (err) {
    console.error(err)
  }
}

const getDocByUid = async (
  userId: string,
  collection: string
): Promise<any> => {
  const docRef = doc(db, collection, userId)
  return await getDoc(docRef)
}

const addUserToFirestoreCollection = async (
  u: User,
  username: string | null,
  provider: string
): Promise<void> => {
  const user = await getDocByUid(u.uid, 'users')
  if (!user.exists()) {
    await setDoc(doc(db, 'users', u.uid), {
      uid: u.uid,
      name: username,
      photoURL: u.photoURL,
      authProvider: provider,
      email: u.email,
    })
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

export const logout = () => {
  signOut(auth)
}

export const loadStatsFromFirestoreCollection = async (
  userId: string
): Promise<GameStats | null> => {
  const statsDoc = await getDocByUid(userId, 'stats')
  if (!statsDoc.exists()) {
    return null
  }

  const stats: GameStats = {
    avgNumGuesses: statsDoc.avgNumGuesses,
    bestStreak: statsDoc.bestStreak,
    currentStreak: statsDoc.currentStreak,
    gamesFailed: statsDoc.gamesFailed,
    score: statsDoc.score,
    successRate: statsDoc.successRate,
    totalGames: statsDoc.totalGames,
    winDistribution: statsDoc.winDistribution,
  }

  return stats
}

export const saveStatsToFirestoreCollection = async (
  userId: string,
  stats: GameStats
): Promise<void> => {
  const statsDoc = await getDocByUid(userId, 'stats')

  // if stat object exists, update it
  if (statsDoc.exists()) {
    const statRef = doc(db, 'stats', userId)

    // make sure stat object being passed is not behind db
    if (statsDoc.totalGames >= stats.totalGames) {
      return
    }

    await updateDoc(statRef, {
      lastUpdated: Timestamp.now(),
      avgNumGuesses: stats.avgNumGuesses,
      bestStreak: stats.bestStreak,
      currentStreak: stats.currentStreak,
      gamesFailed: stats.gamesFailed,
      score: stats.score,
      successRate: stats.successRate,
      totalGames: stats.totalGames,
      winDistribution: stats.winDistribution,
    })
  } else {
    // otherwise, create new stat object and initialize it
    await setDoc(doc(db, 'stats', userId), {
      uid: userId,
      lastUpdated: Timestamp.now(),
      avgNumGuesses: stats.avgNumGuesses,
      bestStreak: stats.bestStreak,
      currentStreak: stats.currentStreak,
      gamesFailed: stats.gamesFailed,
      score: stats.score,
      successRate: stats.successRate,
      totalGames: stats.totalGames,
      winDistribution: stats.winDistribution,
    })
  }
}

// export const getLeaderBoardByGroup = async (
//   groupName: string
// ): Promise<any[]> => {
//   const group = await getGroupByGroupName(groupName)
//   const leaderBoard: any[] = []

//   if (group) {
//     const groupUsers = group.data().users
//     for (let i = 0; i < groupUsers.length; i++) {
//       const user = await getDoc(groupUsers[i])
//       if (user.exists() && user.data() !== undefined) {
//         leaderBoard.push(user.data())
//       }
//     }
//   }

//   leaderBoard.sort(
//     (a, b) =>
//       b.totalSteps - a.totalSteps || b.userSteps.length - a.userSteps.length
//   )
//   return leaderBoard
// }
