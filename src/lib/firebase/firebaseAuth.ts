import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signOut,
  updateEmail,
} from 'firebase/auth'
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

import { ValidEmailEnum } from './../../constants/types'
import { defaultStats } from './../stats'
import { auth, db } from './firebaseConfig'
import {
  getGroupInfoByGroupName,
  getGroupsByUidFromFirestore,
  removeUserFromGroup,
} from './firebaseGroups'

export const googleProvider = new GoogleAuthProvider()
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

export const deleteAccount = async (
  user: User | null | undefined
): Promise<boolean> => {
  if (!user) {
    return false
  }

  try {
    const groups = await getGroupsByUidFromFirestore(user.uid)
    for (let i = 0; i < groups.length; i++) {
      const groupInfo = await getGroupInfoByGroupName(groups[i])
      const isAdmin = Boolean(groupInfo.adminEmail === user.email)
      await removeUserFromGroup(groups[i], user.uid, isAdmin)
    }

    await deleteDoc(doc(db, 'users', user.uid))
    user.delete()
    return true
  } catch {
    return false
  }
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
      displayPublic: true,
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
      requestedGroups: [],
    })

    return u.uid
  }
}

export const getUserDocByUid = async (userId: string): Promise<any> => {
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

export const getScoreByUid = async (userId: string): Promise<number> => {
  const userData = await getUserDataByUid(userId)
  if (userData) {
    return userData.gameStats.score
  }

  return 0
}

export const getPublicDisplaySetting = async (
  userId: string
): Promise<boolean> => {
  const userData = await getUserDataByUid(userId)
  if (userData) {
    return userData.displayPublic
  }

  return false
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

export const updateFirestorePublicDisplaySetting = async (
  userId: string,
  shouldDisplayPublic: boolean
): Promise<boolean> => {
  try {
    const userDoc = await getUserDocByUid(userId)
    if (userDoc.exists()) {
      const docRef = doc(db, 'users', userId)
      await updateDoc(docRef, {
        displayPublic: shouldDisplayPublic,
      })
      return true
    }
  } catch {
    return false
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
