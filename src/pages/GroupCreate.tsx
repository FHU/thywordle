import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import { auth } from '../lib/firebase/firebaseConfig'
import Loading from './../components/gameState/Loading'
import GroupCreateForm from './../components/groups/GroupCreateForm'
import { buttonEnabledClasses } from './../constants/classes'
import favicon from './../img/favicon.png'
import { getGroupsByUidFromFirestore } from './../lib/firebase/firebaseGroups'

function GroupCreate() {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [isAllowedToCreateGroup, setIsAllowedToCreateGroup] =
    useState<boolean>(true)

  const tabs = ['Public Group', 'Private Group']
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const loadedUserGroups = user
        ? await getGroupsByUidFromFirestore(user.uid)
        : []

      if (loadedUserGroups.length >= 5) {
        setIsAllowedToCreateGroup(false)
      }

      setLoading(false)
    })()
  }, [user])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="Scripturle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="text-l font-bold dark:text-white sm:text-xl md:text-3xl">
          Create Group
        </h1>
        <p className="mx-4 mb-8 mt-4 text-base dark:text-white md:text-xl">
          Create or a new group to track your stats against your friends!
        </p>
      </div>

      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center text-black dark:bg-slate-800 dark:text-white">
        {!user ? (
          <>
            <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
              <p className="mx-4 my-8 text-lg text-black dark:text-white">
                Please sign or create an account to join a group.
              </p>
              <Link
                to="/profile"
                className={`${buttonEnabledClasses} group relative mx-auto mb-12 flex w-40 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
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
              </Link>
            </div>
          </>
        ) : (
          <>
            {!isAllowedToCreateGroup ? (
              <>
                <h2 className="my-8 text-xl font-bold md:text-2xl">
                  Unable to Create a New Group
                </h2>
                <p className="mx-4 my-8">
                  You are only allowed to be in 5 groups at one time. Consider
                  leaving a group if you wish to create a new one.
                </p>
              </>
            ) : (
              <>
                <div className="flex space-x-3 border-b">
                  <div className="mx-auto">
                    {tabs.map((tab, idx) => {
                      return (
                        <button
                          key={idx}
                          className={`mx-4 border-b-4 py-2 transition-colors duration-300 dark:text-white ${
                            idx === activeTabIndex
                              ? 'border-indigo-600'
                              : 'border-transparent hover:border-gray-200 dark:hover:border-slate-500'
                          }`}
                          onClick={() => setActiveTabIndex(idx)}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="py-4">
                  <GroupCreateForm isPrivate={activeTabIndex === 1} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default GroupCreate
