import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link, useParams } from 'react-router-dom'

import Loading from './../components/gameState/Loading'
import { LeaderboardRows } from './../components/leaderboard/LeaderboardRows'
import { PointsHelpModal } from './../components/leaderboard/PointsHelpModal'
import { StatSummaryModal } from './../components/leaderboard/StatSummaryModal'
import { Group } from './../constants/types'
import favicon from './../img/favicon.png'
import {
  auth,
  getGroupByGroupNameFromFirestore,
  getGroupsByUidFromFirestore,
} from './../lib/firebase'

function GroupLeaderboard() {
  const params = useParams()
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [unauthorized, setUnauthorized] = useState<boolean>(false)
  const [group, setGroup] = useState<Group>()

  const [isPointsModalOpen, setIsPointsModalOpen] = useState<boolean>(false)
  const [isStatSummaryModalOpen, setIsStatSummaryModalOpen] =
    useState<boolean>(false)

  const [selectedUser, setSelectedUser] = useState<any>(null)
  const updateSelectedUser = (user: any) => {
    setSelectedUser(user)
    setIsStatSummaryModalOpen(true)
  }

  useEffect(() => {
    ;(async () => {
      if (user && params.groupName) {
        setLoading(true)
        const loadedUserGroups = await getGroupsByUidFromFirestore(user.uid)

        if (!loadedUserGroups.includes(params.groupName)) {
          setUnauthorized(true)
        }

        const loadedGroup = await getGroupByGroupNameFromFirestore(
          params.groupName,
          user.uid
        )

        if (loadedGroup) {
          setGroup(loadedGroup)
        }

        setLoading(false)
      }
    })()
  }, [user, params.groupName])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="text-l font-bold dark:text-white sm:text-xl md:text-3xl">
          {group ? group.groupName : 'Group does not exist'}
        </h1>
        <p className="mx-auto mb-8 mt-4 text-base dark:text-white md:text-xl">
          Group Leaderboard
        </p>
      </div>

      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        {!user && (
          <>
            <p className="my-8 text-lg text-black dark:text-white">
              Please sign in or create an account to join a group.
            </p>
            <Link
              to="/profile"
              className="text-ll mb-12 inline-block rounded-lg bg-black p-4 px-12 text-center font-bold uppercase text-white transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
            >
              Sign in
            </Link>
          </>
        )}

        {!group && (
          <>
            <p className="my-8 text-lg text-black dark:text-white">
              Create a new group and invite your friends!
            </p>
            {/* TODO: link to create new group form */}
            <Link
              to="/"
              className="text-ll mb-12 inline-block rounded-lg bg-black p-4 px-12 text-center font-bold uppercase text-white transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
            >
              Create New Group
            </Link>
          </>
        )}

        {group && unauthorized && (
          <>
            <p className="my-8 text-lg text-black dark:text-white">
              You are not a member of this group. Request to join or create a
              new group.
            </p>
            {/* TODO: link to create new group form */}
            <Link
              to="/"
              className="text-ll mb-12 inline-block rounded-lg bg-black p-4 px-12 text-center font-bold uppercase text-white transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
            >
              Create New Group
            </Link>
          </>
        )}

        {group && !unauthorized && (
          <>
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
              <LeaderboardRows
                users={group.users}
                updateSelectedUser={updateSelectedUser}
              />
            </div>
          </>
        )}
      </div>

      <PointsHelpModal
        isOpen={isPointsModalOpen}
        handleClose={() => setIsPointsModalOpen(false)}
      />

      <StatSummaryModal
        isOpen={isStatSummaryModalOpen}
        handleClose={() => setIsStatSummaryModalOpen(false)}
        leaderboardUser={selectedUser}
      />
    </div>
  )
}

export default GroupLeaderboard
