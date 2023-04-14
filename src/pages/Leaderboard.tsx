import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import { LeaderboardRows } from '../components/leaderboard/LeaderboardRows'
import { auth } from '../lib/firebase'
import { PointsHelpModal } from './../components/leaderboard/PointsHelpModal'
import { StatSummaryModal } from './../components/leaderboard/StatSummaryModal'
import favicon from './../img/favicon.png'

function Leaderboard() {
  const [user] = useAuthState(auth)

  const [isPointsModalOpen, setIsPointsModalOpen] = useState<boolean>(false)
  const [isStatSummaryModalOpen, setIsStatSummaryModalOpen] =
    useState<boolean>(false)

  const [selectedUser, setSelectedUser] = useState<any>(null)

  const updateSelectedUser = (user: any) => {
    setSelectedUser(user)
    setIsStatSummaryModalOpen(true)
  }

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="mb-4 text-2xl font-bold dark:text-white md:text-3xl">
          Leaderboard
        </h1>
        <p className="mb-8 dark:text-white">
          Select a User for more detailed game stats.
        </p>
      </div>

      {!user && (
        <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
          <div className="mx-auto my-2 flex items-center justify-center">
            <p className="mr-2 text-sm text-black dark:text-white sm:text-lg">
              Want to see how you compare?
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      <div className="col-span-10 col-start-2 mt-2 mb-16 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <div className="table w-full border-collapse">
          <div className="table-header-group rounded-xl bg-gray-300 dark:bg-slate-700">
            <div className="text-md table-row font-semibold text-black dark:text-white md:text-2xl">
              <div className="table-cell border-b border-black py-8 pl-2 text-center dark:border-white">
                Rank
              </div>
              <div className="table-cell border-b border-black py-8 text-center dark:border-white">
                User
              </div>
              <div className="table-cell border-b border-black py-8 text-center dark:border-white">
                Avg Guesses
              </div>
              <div className="table-cell border-b border-black py-8 dark:border-white">
                <div className="flex flex-none justify-center">
                  <span className="mr-1">Points</span>
                  <QuestionMarkCircleIcon
                    className="h-5 w-5 cursor-pointer dark:stroke-white md:h-7 md:w-7"
                    onClick={() => setIsPointsModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>
          <LeaderboardRows updateSelectedUser={updateSelectedUser} />
        </div>
      </div>

      <PointsHelpModal
        isOpen={isPointsModalOpen}
        handleClose={() => setIsPointsModalOpen(false)}
      />

      <StatSummaryModal
        isOpen={isStatSummaryModalOpen}
        handleClose={() => setIsStatSummaryModalOpen(false)}
        user={selectedUser}
      />
    </div>
  )
}

export default Leaderboard
