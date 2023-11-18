import { useAuthState } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import { LeaderboardUser } from '@/constants/types'

import {
  BEST_STREAK_TEXT,
  CURRENT_STREAK_TEXT,
  SUCCESS_RATE_TEXT,
} from './../../constants/strings'
import { auth } from './../../lib/firebase'
import { BaseModal } from './../modals/BaseModal'
import { StatItem } from './../stats/StatBar'

type Props = {
  isOpen: boolean
  handleClose: () => void
  leaderboardUser: LeaderboardUser
}

export const StatSummaryModal = ({
  isOpen,
  handleClose,
  leaderboardUser,
}: Props) => {
  const [user] = useAuthState(auth)

  let messageText = 'View how you compare'
  const profileLinkText = user ? 'Profile' : 'Sign In'

  if (user && leaderboardUser) {
    if (user.uid === leaderboardUser.uid) {
      messageText = 'Keep up the good work!'
    }
  }

  return (
    <BaseModal
      title={`${leaderboardUser?.name} Stats`}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden transition-all">
        <div className="my-2 flex justify-around">
          <StatItem
            label={BEST_STREAK_TEXT}
            value={leaderboardUser?.stats.bestStreak}
          />
          <StatItem
            label={CURRENT_STREAK_TEXT}
            value={leaderboardUser?.stats.currentStreak}
          />
        </div>

        <div className="my-2 flex justify-around">
          <StatItem
            label={SUCCESS_RATE_TEXT}
            value={`${leaderboardUser?.stats.successRate}%`}
          />
          <div className="m-1 w-1/4 items-center dark:text-white">
            <div className="-ml-2 text-lg font-bold md:mx-0 lg:text-xl">
              {leaderboardUser?.lastPlayed}
            </div>
            <div className="text-xs">Last Played</div>
          </div>
        </div>

        <div className="mx-auto mb-2 mt-6 flex items-center justify-center">
          <p className="mr-2 text-sm text-black dark:text-white sm:text-lg">
            {messageText}
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
          >
            {profileLinkText}
          </Link>
        </div>

        <button
          onClick={() => handleClose()}
          aria-label="close"
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
