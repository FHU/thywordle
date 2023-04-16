import { error } from 'console'
import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword, // GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup, // signInWithEmailAndPassword,
  // signInWithPopup,
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

export const createAccountWithEmailandPassword = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  //ask about username and confirm password db entry when using the createUserWithEmailAndPassword at https://firebase.google.com/docs/auth/web/password-auth?authuser=1
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      // updateProfile(auth.currentUser, {
      //   displayName: username
      // }).then(() => {
      //   console.log(user, 'updated')
      //
      // }).catch((error) => {
      //   console.log(error)
      // });
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
    })
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
