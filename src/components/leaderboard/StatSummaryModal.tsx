import { Link } from 'react-router-dom'

import {
  BEST_STREAK_TEXT,
  CURRENT_STREAK_TEXT,
  SUCCESS_RATE_TEXT,
} from './../../constants/strings'
import { BaseModal } from './../modals/BaseModal'
import { StatItem } from './../stats/StatBar'

type Props = {
  isOpen: boolean
  handleClose: () => void
  user: any
}

export const StatSummaryModal = ({ isOpen, handleClose, user }: Props) => {
  const signedIn = false

  const profileLinkText = signedIn ? 'Profile' : 'Sign In'

  return (
    <BaseModal
      title={`${user?.name} Stats`}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden transition-all">
        <div className="my-2 flex justify-center">
          <StatItem
            label={SUCCESS_RATE_TEXT}
            value={`${user?.stats.successRate}%`}
          />
          <StatItem
            label={CURRENT_STREAK_TEXT}
            value={user?.stats.currentStreak}
          />
          <StatItem label={BEST_STREAK_TEXT} value={user?.stats.bestStreak} />
        </div>

        <div className="mx-auto mt-6 mb-2 flex items-center justify-center">
          <p className="mr-2 text-sm text-black dark:text-white sm:text-lg">
            View how you compare
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
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
