import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const firebaseDailyStatsConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_DAILY_STATS_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DAILY_STATS_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_DAILY_STATS_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_DAILY_STATS_STORAGE_BUCKET,
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_DAILY_STATS_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_DAILY_STATS_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_DAILY_STATS_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const dailyStatApp = initializeApp(firebaseDailyStatsConfig, 'scripturle-today')
getAnalytics(app)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const dailyStatDb = getFirestore(dailyStatApp)
