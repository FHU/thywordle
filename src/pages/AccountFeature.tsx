import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PointsHelpModal } from '../components/leaderboard/PointsHelpModal'
import favicon from './../img/favicon.png'

function AccountFeature() {
  const [isPointsModalOpen, setIsPointsModalOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const buttonEnabledClasses =
    'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="mb-8 text-2xl font-bold dark:text-white md:text-3xl">
          ThyWordle Accounts
        </h1>
      </div>
      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <h2 className="my-8 text-xl font-bold dark:text-white md:text-3xl">
          Create Your Own <br /> ThyWordle Account
        </h2>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          Keep your stats with you wherever you go. With a new ThyWordle
          account, save your stats online and view them on any device.
        </p>
        <div className="mx-auto w-64">
          <button
            className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            onClick={() => navigate('/profile')}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
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
            Sign in
          </button>
        </div>

        <h2 className="mt-16 text-xl font-bold dark:text-white md:text-3xl">
          Compete Against Others
        </h2>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          {'Improve your '}
          <span
            className="cursor-pointer font-bold text-indigo-600 dark:text-indigo-400"
            onClick={() => setIsPointsModalOpen(true)}
          >
            points
          </span>
          {
            " by completing each day's game in as few of guesses as possible. Track your stats compared to others by viewing the global leaderboard!"
          }
        </p>
        <div className="mx-auto mb-16 w-64">
          <button
            className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            onClick={() => navigate('/leaderboard')}
          >
            View Leaderboard
          </button>
        </div>

        <h2 className="mt-16 text-xl font-bold dark:text-white md:text-3xl">
          Form New Friend Groups
        </h2>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          Want to narrow your competitive sights? Form a group of ThyWordler's
          and see who knows their Bible the best!
        </p>
        <div className="mx-auto mb-16 w-64">
          <button
            className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            onClick={() => navigate('/groups')}
          >
            View Groups
          </button>
        </div>
      </div>

      <PointsHelpModal
        isOpen={isPointsModalOpen}
        handleClose={() => setIsPointsModalOpen(false)}
      />
    </div>
  )
}

export default AccountFeature
