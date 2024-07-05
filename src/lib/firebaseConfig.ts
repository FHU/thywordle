import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBCp5wNSfqPfO9Od3wDdcJiZvf0h0w9Bkk',
  authDomain: 'thywordle-93fd5.firebaseapp.com',
  projectId: 'thywordle-93fd5',
  storageBucket: 'thywordle-93fd5.appspot.com',
  messagingSenderId: '779774332038',
  appId: '1:779774332038:web:d1c406b9c4da69679c1507',
  measurementId: 'G-4WR7Z6S51M',
}

const app = initializeApp(firebaseConfig)
getAnalytics(app)

export const auth = getAuth(app)
export const db = getFirestore(app)
