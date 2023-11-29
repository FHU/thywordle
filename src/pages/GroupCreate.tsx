import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import Loading from './../components/gameState/Loading'
import GroupCreateForm from './../components/groups/GroupCreateForm'
import favicon from './../img/favicon.png'
import { auth, getGroupsByUidFromFirestore } from './../lib/firebase'

function GroupCreate() {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [isAllowedToCreateGroup, setIsAllowedToCreateGroup] =
    useState<boolean>(true)

  const tabs = ['Private Group', 'Public Group']
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const loadedUserGroups = user
        ? await getGroupsByUidFromFirestore(user.uid)
        : []

      if (loadedUserGroups.length > 5) {
        setIsAllowedToCreateGroup(false)
      }

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
          Create Group
        </h1>
        <p className="mx-4 mb-8 mt-4 text-base dark:text-white md:text-xl">
          Create or a new group to track your stats against your friends!
        </p>
      </div>

      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center text-black dark:bg-slate-800 dark:text-white">
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
              <GroupCreateForm
                isPrivate={activeTabIndex === 0}
                inputClasses={inputClasses}
                buttonDisabledClasses={buttonDisabledClasses}
                buttonEnabledClasses={buttonEnabledClasses}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GroupCreate
