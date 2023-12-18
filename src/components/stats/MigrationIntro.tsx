import { LogoutIcon, UserIcon } from '@heroicons/react/outline'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import {
  MIGRATE_BUTTON_TEXT,
  MIGRATE_DESCRIPTION_TEXT,
} from '../../constants/strings'
import { auth } from './../../lib/firebase'

type props = {
  handleMigrateStatsButton: () => void
  handleClose: any
}

export const MigrationIntro = ({
  handleMigrateStatsButton,
  handleClose,
}: props) => {
  const [user] = useAuthState(auth)

  return (
    <div className="mt-5 flex columns-2 flex-col items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
      <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
        <div className="mt-3 text-xs">{MIGRATE_DESCRIPTION_TEXT}</div>
        <button
          type="button"
          className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          onClick={handleMigrateStatsButton}
        >
          <LogoutIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
          {MIGRATE_BUTTON_TEXT}
        </button>
      </div>

      <hr className="-mb-4 mt-4 border-gray-500" />

      <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
        <div className="mt-3 text-xs">
          {user ? (
            <p>View your profile</p>
          ) : (
            <p>Want to save your stats online?</p>
          )}
        </div>
        {user ? (
          <Link
            to="/profile"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => handleClose()}
          >
            <UserIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
            Profile
          </Link>
        ) : (
          <Link
            to="/profile"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => handleClose()}
          >
            <UserIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
            Sign In
          </Link>
        )}
      </div>
    </div>
  )
}
