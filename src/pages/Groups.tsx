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
            <p className="my-8 text-lg text-black dark:text-white">
              Please sign or create an account to join a group.
            </p>
            <Link
              to="/"
              className="text-ll mb-12 inline-block rounded-lg bg-black p-4 px-12 text-center font-bold uppercase text-white transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
            >
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
