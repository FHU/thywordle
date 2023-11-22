import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import Loading from './../components/gameState/Loading'
import { UserGroups } from './../components/groups/UserGroups'
import favicon from './../img/favicon.png'
import { auth, getGroupsByUidFromFirestore } from './../lib/firebase'

function Groups() {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [userGroups, setUserGroups] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const loadedUserGroups = user
        ? await getGroupsByUidFromFirestore(user.uid)
        : []

      setUserGroups(loadedUserGroups)
      setLoading(false)
    })()
  }, [user])

  const inputClasses =
    'w-full border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white sm:leading-6'
  const buttonDisabledClasses =
    'bg-indigo-300 focus-visible:outline-indigo-300 cursor-not-allowed'
  const buttonEnabledClasses =
    'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'

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
          Groups
        </h1>
        <p className="mx-auto mb-8 mt-4 text-base dark:text-white md:text-xl">
          Create or join a group to track your stats against your friends!
        </p>
      </div>

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
          <div className="col-span-10 col-start-2 mb-0 rounded-xl bg-gray-100 dark:bg-slate-800 lg:col-span-5 lg:col-start-2 lg:col-end-7 lg:mb-8">
            <h2 className="my-8 text-center text-2xl font-bold text-black dark:text-white">
              My Groups
            </h2>
            <div className="my-4 flex flex-col text-center">
              {Boolean(userGroups.length) ? (
                <UserGroups groups={userGroups} />
              ) : (
                <p className="text:black mx-auto w-3/4 text-base dark:text-white">
                  You are not in any groups currently. Join or Create a New
                  Group to start tracking points against your friends!
                </p>
              )}
            </div>
          </div>

          <div className="col-span-10 col-start-2 mb-8 rounded-xl bg-gray-100 dark:bg-slate-800 lg:col-span-5 lg:col-end-12">
            <h2 className="my-8 text-center text-2xl font-bold text-black dark:text-white">
              Create or Join a New Group
            </h2>
            <div className="my-12 flex flex-col text-center">
              {/* TODO: Create Group Form */}
              {/* TODO: Firebase Call: Create Group - only allowed if number of groups is less than 5 */}
              {/* TODO: Group List / Search Component */}
              {/* TODO: Firebase Call: Request to Join Group */}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Groups
