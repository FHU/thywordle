import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link, useNavigate } from 'react-router-dom'

import { auth } from '../lib/firebaseConfig'
import Loading from './../components/gameState/Loading'
import { ConfirmJoinGroupModal } from './../components/groups/ConfirmJoinGroupModal'
import { UserGroups } from './../components/groups/UserGroups'
import {
  buttonDisabledClasses,
  buttonEnabledClasses,
  inputClasses,
} from './../constants/classes'
import { useAlert } from './../context/AlertContext'
import favicon from './../img/favicon.png'
import {
  getCleanedGroupName,
  getGroupInfoByGroupName,
  getGroupsByUidFromFirestore,
} from './../lib/firebaseGroups'

function Groups() {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [loading, setLoading] = useState<boolean>(false)
  const [userGroups, setUserGroups] = useState<string[]>([])
  const [searchedGroupName, setSearchedGroupName] = useState<string>('')
  const [isGroupPrivate, setIsGroupPrivate] = useState<boolean>(true)
  const [isConfirmJoinGroupModalOpen, setIsConfirmJoinGroupModalOpen] =
    useState<boolean>(false)

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

  const handleSearchButtonClick = async () => {
    const isGroupNameInFirestore = await getGroupInfoByGroupName(
      searchedGroupName
    )

    if (isGroupNameInFirestore === null) {
      showErrorAlert(
        'That group does not exist. Please enter the exact group name you would like to find.'
      )
      return
    }

    setSearchedGroupName(isGroupNameInFirestore.groupName)
    setIsGroupPrivate(isGroupNameInFirestore.isPrivate)
    setIsConfirmJoinGroupModalOpen(true)
  }

  const hasAlreadyJoined = (groupName: string): boolean => {
    const cleanedGroupNames: string[] = []
    userGroups.forEach((group) => {
      cleanedGroupNames.push(getCleanedGroupName(group))
    })

    if (cleanedGroupNames.includes(getCleanedGroupName(groupName))) {
      return true
    }

    return false
  }

  const handleCreateGroupButtonClick = () => {
    if (userGroups.length < 5) {
      navigate('/groups/create')
    }
  }

  const handleJoinAlert = (isFailure: boolean, message: string) => {
    if (isFailure) {
      showErrorAlert(message)
    } else {
      showSuccessAlert(message)
    }
  }

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
        <h1 className="text-xl font-bold dark:text-white md:text-3xl">
          Groups
        </h1>
        <p className="mx-4 mb-8 mt-4 text-base dark:text-white md:text-xl">
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
            <h2 className="mt-8 text-center text-xl font-bold text-black dark:text-white md:text-2xl">
              My Groups
            </h2>
            <p className="my-4 text-center text-black dark:text-white">
              You can only be in 5 groups at one time.
            </p>
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
            <h2 className="my-8 text-center text-xl font-bold text-black dark:text-white md:text-2xl">
              Create or Join a New Group
            </h2>
            <div className="my-12 flex flex-col text-center">
              <button
                disabled={userGroups.length >= 5}
                onClick={handleCreateGroupButtonClick}
                className={`${
                  userGroups.length < 5
                    ? buttonEnabledClasses
                    : buttonDisabledClasses
                } group relative mx-auto mb-12 flex w-64 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
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
                Create New Group
              </button>

              <div>
                <h2 className="text-l my-4 text-center font-bold text-black dark:text-white md:text-xl">
                  Search for Existing Group
                </h2>
                <div className="mx-auto w-3/4">
                  <label htmlFor="searchedGroupName" className="sr-only">
                    Group Name
                  </label>
                  <input
                    id="searchedGroupName"
                    name="searchedGroupName"
                    type="text"
                    value={searchedGroupName}
                    onChange={(e: any) => {
                      setSearchedGroupName(e.target.value)
                    }}
                    required
                    className={`${inputClasses} rounded-md bg-white dark:bg-slate-800`}
                    placeholder="Group Name"
                    disabled={false}
                  />
                </div>

                <div className="mx-auto mt-5 w-64">
                  <button
                    className={`${
                      Boolean(searchedGroupName.length)
                        ? buttonEnabledClasses
                        : buttonDisabledClasses
                    } group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                    onClick={handleSearchButtonClick}
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
                    Search for Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmJoinGroupModal
        groupName={searchedGroupName}
        numUserGroups={userGroups.length}
        isGroupPrivate={isGroupPrivate}
        uid={user?.uid ?? ''}
        alreadyJoined={hasAlreadyJoined(searchedGroupName)}
        showAlert={handleJoinAlert}
        isOpen={isConfirmJoinGroupModalOpen}
        handleClose={() => setIsConfirmJoinGroupModalOpen(false)}
      />
    </div>
  )
}

export default Groups
