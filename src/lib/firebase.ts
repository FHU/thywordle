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
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'

// import { UpdateUserHook } from 'react-firebase-hooks/auth/dist/auth/useUpdateUser'

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
    console.log(user.uid)
  } else {
  }
})

export const signInWithGoogle = async () => {
  console.log('sign in with Google')
  try {
    const res = await signInWithPopup(auth, googleProvider)
    await addUserToCollection(res.user, res.user.displayName, 'google')
  } catch (err) {
    console.error(err)
  }
}

export const createAccountWithUsernameAndPassword = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    await addUserToCollection(res.user, username, 'password')
  } catch (err) {
    console.error(err)
  }
}

const addUserToCollection = async (
  user: User,
  name: string | null,
  provider: string
) => {
  const q = query(collection(db, 'users'), where('uid', '==', user.uid))
  const docs = await getDocs(q)
  if (docs.docs.length === 0) {
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name: name,
      authProvider: provider,
      email: user.email,
      stats: {},
    })
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
