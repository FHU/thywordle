import { error } from 'console'
import { initializeApp } from 'firebase/app'
import {
  ActionCodeSettings,
  Auth,
  AuthError,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import { useCallback, useState } from 'react'
import {
  CreateUserOptions,
  EmailAndPasswordActionHook,
} from 'react-firebase-hooks/auth/dist/auth/types'
import { UpdateUserHook } from 'react-firebase-hooks/auth/dist/auth/useUpdateUser'

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
export const auth = getAuth(app)
export const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid
  } else {
  }
})

// Worth Looking at for help: https://github.com/CSFrequency/react-firebase-hooks
export default (
  auth: Auth,
  options?: CreateUserOptions
): EmailAndPasswordActionHook => {
  const [error, setError] = useState<AuthError>()
  const [registeredUser, setRegisteredUser] = useState<UserCredential>()
  const [loading, setLoading] = useState<boolean>(false)

  const createUserWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(undefined)
      try {
        const user = await firebaseCreateUserWithEmailAndPassword(
          auth,
          email,
          password
        )
        if (options && options.sendEmailVerification && user.user) {
          await sendEmailVerification(
            user.user,
            options.emailVerificationOptions
          )
        }
        setRegisteredUser(user)

        return user
      } catch (error) {
        setError(error as AuthError)
      } finally {
        setLoading(false)
      }
    },
    [auth, options]
  )

  return [createUserWithEmailAndPassword, registeredUser, loading, error]
}

type Profile = {
  displayName?: string | null
  photoURL?: string | null
}
export type UpdateProfileHook = UpdateUserHook<
  (profile: Profile) => Promise<boolean>
>
export type UpdateUserHook<M> = [M, boolean, AuthError | Error | undefined]
export type VerifyBeforeUpdateEmailHook = UpdateUserHook<
  (
    email: string,
    actionCodeSettings: ActionCodeSettings | null
  ) => Promise<boolean>
>

export const useUpdateProfile = (auth: Auth): UpdateProfileHook => {
  const [error, setError] = useState<AuthError>()
  const [loading, setLoading] = useState<boolean>(false)

  const updateProfile = useCallback(
    async (profile: Profile) => {
      setLoading(true)
      setError(undefined)
      try {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, profile)
          return true
        } else {
          throw new Error('No user is logged in')
        }
      } catch (err) {
        setError(err as AuthError)
        return false
      } finally {
        setLoading(false)
      }
    },
    [auth]
  )

  return [updateProfile, loading, error]
}

export const signInWithEmailAndPasswordWrapper = (
  email: string,
  password: string
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
    })
    //ask about error messaging help
    .catch((error) => {
      const errorCode = error.code
      const errorMessage =
        'Oops! Email or Password was incorrect. Please try again.'
    })
}

export const signInWithGoogle = async () => {
  console.log('sign in with Google')
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      })
    }
  } catch (err) {
    console.error(err)
  }
}

export const resetForgottenPassword = (email: string) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // email has been sent
    })
    .catch((error) => {
      console.log(error)
    })
}

export const logout = () => {
  signOut(auth)
}
