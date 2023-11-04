import { User } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { GameStats } from '@/constants/types'

import { Histogram } from '../stats/Histogram'
import {
  AVG_NUM_GUESSES_TEXT,
  BEST_STREAK_TEXT,
  CURRENT_STREAK_TEXT,
  GUESS_DISTRIBUTION_TEXT,
  POINTS_TEXT,
  SUCCESS_RATE_TEXT,
  TOTAL_GAMES_TEXT,
} from './../../constants/strings'
import './../../lib/stats'
import { StatItem } from './../stats/StatBar'

interface Props {
  user: User
  userInfo: any
  stats: GameStats
  handleLogOut: any
  handleEditProfile: any
}

const ProfileInformation = ({
  user,
  userInfo,
  stats,
  handleLogOut,
  handleEditProfile,
}: Props) => {
  const [signedInWithGoogle, setSignedInWithGoogle] = useState<boolean>(false)

  useEffect(() => {
    if (user.providerData[0].providerId === 'google.com') {
      setSignedInWithGoogle(true)
    }
  }, [user.providerData])

  const gameStats: GameStats = {
    winDistribution: stats.winDistribution,
    gamesFailed: stats.gamesFailed,
    currentStreak: stats.currentStreak,
    bestStreak: stats.bestStreak,
    totalGames: stats.totalGames,
    successRate: stats.successRate,
    score: stats.score,
    avgNumGuesses: stats.avgNumGuesses,
  }

  return (
    <div className="my-8">
      {user.photoURL !== '' && (
        <img
          src={user.photoURL!}
          alt=""
          className="mx-auto my-5 rounded-full"
        />
      )}

      <p className="text-2xl font-bold dark:text-white">
        Welcome{' '}
        {user && (
          <span className="text-indigo-600 dark:text-indigo-400">
            {userInfo?.name || user.displayName || user.email}
          </span>
        )}
        !
      </p>
      {user && (
        <p className="my-2 text-base text-indigo-600 dark:text-indigo-400">
          {user.email}
        </p>
      )}

      <div>
        <h4 className="mb-4 mt-8 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
          Stats
        </h4>
        <div className="flex flex-wrap justify-center">
          <StatItem label={TOTAL_GAMES_TEXT} value={gameStats.totalGames} />
          <StatItem
            label={SUCCESS_RATE_TEXT}
            value={`${gameStats.successRate}%`}
          />
          <StatItem
            label={CURRENT_STREAK_TEXT}
            value={gameStats.currentStreak}
          />
          <StatItem label={BEST_STREAK_TEXT} value={gameStats.bestStreak} />
          <StatItem
            label={AVG_NUM_GUESSES_TEXT}
            value={gameStats.avgNumGuesses}
          />
          <StatItem label={POINTS_TEXT} value={gameStats.score} />
        </div>

        <h4 className="mt-8 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
          {GUESS_DISTRIBUTION_TEXT}
        </h4>
        <div className="mx-auto w-4/5 md:w-1/2 2xl:w-1/3">
          <Histogram
            isLatestGame={false}
            gameStats={gameStats}
            isGameWon={true}
            numberOfGuessesMade={2}
          />
        </div>

        <div className="my-12 flex items-center justify-center">
          {' '}
          <h4 className="mr-4 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
            View Your Ranking
          </h4>
          <Link
            to="/leaderboard"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
          >
            Leaderboard
          </Link>
        </div>
      </div>

      <div
        className={`${
          signedInWithGoogle ? 'w-64' : 'w-4/5 md:w-96'
        } mx-auto flex`}
      >
        {!signedInWithGoogle && (
          <button
            className="group relative mx-2 flex w-full justify-center rounded-md bg-slate-400 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleEditProfile()}
          >
            Edit Profile
          </button>
        )}
        <button
          className="group relative mx-2 flex w-full justify-center rounded-md bg-slate-400 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => handleLogOut()}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-slate-800 group-hover:text-indigo-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileInformation
