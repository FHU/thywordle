import { DuplicateIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { ConfirmJoinGroupModal } from '../components/modals/accountModals/ConfirmJoinGroupModal'
import { ConfirmLeaveGroupModal } from '../components/modals/accountModals/ConfirmLeaveGroupModal'
import { PointsHelpModal } from '../components/modals/accountModals/PointsHelpModal'
import { StatSummaryModal } from '../components/modals/accountModals/StatSummaryModal'
import {
  acceptJoinPrivateGroup,
  denyJoinPrivateGroup,
  getCleanedGroupName,
  getGroupLeaderboardByGroupNameFromFirestore,
  getGroupsByUidFromFirestore,
} from '../lib/firebase/firebaseGroups'
import Loading from './../components/gameState/Loading'
import { LeaderboardRows } from './../components/leaderboard/LeaderboardRows'
import { buttonEnabledClasses } from './../constants/classes'
import { Group } from './../constants/types'
import { useAlert } from './../context/AlertContext'
import favicon from './../img/favicon.png'
import { copyTextToClipboard } from './../lib/clipboard'
import { auth } from './../lib/firebase/firebaseConfig'

function GroupLeaderboard() {
  const params = useParams()
  const navigate = useNavigate()
  const [user] = useAuthState(auth)
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [loading, setLoading] = useState<boolean>(false)
  const [unauthorized, setUnauthorized] = useState<boolean>(false)
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const [isCopyButtonEnabled, setIsCopyButtonEnabled] = useState(true)
  const [group, setGroup] = useState<Group>()
  const [numUserGroups, setNumUserGroups] = useState<number>(0)

  const [isPointsModalOpen, setIsPointsModalOpen] = useState<boolean>(false)
  const [isStatSummaryModalOpen, setIsStatSummaryModalOpen] =
    useState<boolean>(false)
  const [isConfirmJoinGroupModalOpen, setIsConfirmJoinGroupModalOpen] =
    useState<boolean>(false)
  const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] =
    useState<boolean>(false)

  const [selectedUser, setSelectedUser] = useState<any>()
  const updateSelectedUser = (user: any) => {
    setSelectedUser(user)
    setIsStatSummaryModalOpen(true)
  }

  useEffect(() => {
    ;(async () => {
      if (user && params.groupName) {
        setLoading(true)
        const loadedUserGroups = await getGroupsByUidFromFirestore(user.uid)
        const cleanedLoadedGroupNames: string[] = []
        loadedUserGroups.forEach((group) => {
          cleanedLoadedGroupNames.push(getCleanedGroupName(group))
        })

        if (!cleanedLoadedGroupNames.includes(params.groupName)) {
          setUnauthorized(true)
        }

        setNumUserGroups(cleanedLoadedGroupNames.length)
        const loadedGroup = await getGroupLeaderboardByGroupNameFromFirestore(
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

  const copyLinkToClipboard = () => {
    copyTextToClipboard(`scripturle.com/groups/${params.groupName}`)
    setCopyButtonText('Copied!')
    setIsCopyButtonEnabled(false)
  }

  const handleJoinAlert = (isFailure: boolean, message: string) => {
    if (isFailure) {
      showErrorAlert(message)
    } else {
      showSuccessAlert(message)
    }
  }

  const handleUserJoinRequestClick = async (uid: string, isDeny: boolean) => {
    const tryRequest = isDeny
      ? await denyJoinPrivateGroup(group?.groupName!, uid)
      : await acceptJoinPrivateGroup(group?.groupName!, uid)

    if (!tryRequest) {
      showErrorAlert(
        'Unable to process user request at this time. Please try again later. Reminder, users can only be in 5 groups at one time.'
      )
      return
    }

    navigate(0)
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
        <h1 className="text-l text-3xl font-bold dark:text-white">
          <span>{group ? group.groupName : 'Group does not exist'}</span>
          {group && (
            <>
              <br /> Leaderboard
            </>
          )}
        </h1>
        <p className="mx-auto mb-8 mt-4 text-base dark:text-white md:text-xl">
          {group ? (group.isPrivate ? 'Private Group' : 'Public Group') : ''}
        </p>
        {group && (
          <div className="my-8 flex flex-col items-center justify-center">
            <p className="text-black dark:text-white">
              Share group link with friends!
            </p>
            <button
              disabled={!isCopyButtonEnabled}
              onClick={copyLinkToClipboard}
              type="button"
              className="mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-left text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:border-gray-200
          disabled:bg-white disabled:text-gray-900 disabled:focus:outline-none disabled:dark:border-gray-600 disabled:dark:bg-gray-800 disabled:dark:text-gray-400 sm:text-sm"
            >
              {isCopyButtonEnabled && (
                <DuplicateIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
              )}
              {copyButtonText}
            </button>
          </div>
        )}
      </div>

      {!user && (
        <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
          <p className="my-8 text-lg text-black dark:text-white">
            Please sign in or create an account to join a group.
          </p>
          <Link
            to="/profile"
            className="group relative mx-auto mb-12 flex w-40 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
      )}

      {user && !group && (
        <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
          <p className="my-8 text-lg text-black dark:text-white">
            Create a new group and invite your friends!
          </p>
          <Link
            to="/groups/create"
            className="text-ll mb-12 inline-block rounded-lg bg-black p-4 px-12 text-center font-bold uppercase text-white transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
          >
            Create New Group
          </Link>
        </div>
      )}

      {user && group && unauthorized && (
        <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
          <p className="mx-8 my-8 text-lg text-black dark:text-white">
            You are not a member of this group. Request to join or create a new
            group.
          </p>
          <div className="mx-auto flex w-1/2 flex-col">
            <Link
              to="/groups/create"
              className="text-ll mb-12 inline-block rounded-lg bg-black p-4 px-12 text-center font-bold uppercase text-white transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
            >
              Create New Group
            </Link>
            <button
              className="text-ll mb-12 inline-block rounded-lg bg-black p-4 px-12 text-center font-bold uppercase text-white transition-all hover:scale-105 dark:bg-white dark:text-slate-900"
              onClick={() => setIsConfirmJoinGroupModalOpen(true)}
            >
              {`${group?.isPrivate! ? 'Request to' : ''} Join Group`}
            </button>
          </div>
        </div>
      )}

      {user && group && !unauthorized && (
        <>
          <div className="col-span-10 col-start-2 my-4 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
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
                showAllUsers={true}
              />
            </div>
          </div>

          {Boolean(group.adminEmail === user.email) &&
            Boolean(group.requestedUsers.length) && (
              <div className="col-span-10 col-start-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
                <p className="my-4 text-lg dark:text-white">
                  Users Requested to Join Group
                </p>
                <div className="my-4 table w-full table-fixed">
                  {group?.requestedUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="text-md table-row text-black dark:text-white md:text-lg"
                    >
                      <div className="table-cell py-4">{user.name}</div>
                      <div className="table-cell py-4">
                        <button
                          className="group relative mx-auto flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:w-32"
                          onClick={() =>
                            handleUserJoinRequestClick(user.uid, true)
                          }
                        >
                          Deny
                        </button>
                      </div>
                      <div className="table-cell py-4">
                        <button
                          className={`${buttonEnabledClasses} group relative mx-auto flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:w-32`}
                          onClick={() =>
                            handleUserJoinRequestClick(user.uid, false)
                          }
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div
            className={`${
              Boolean(group.adminEmail === user.email) &&
              Boolean(group.requestedUsers.length)
                ? 'mt-4'
                : ''
            } col-span-10 col-start-2 mb-16 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800`}
          >
            <p className="my-4 text-lg text-black dark:text-white">
              {`Leave ${group.groupName}`}
            </p>
            <button
              className={`${buttonEnabledClasses} group relative mx-auto mb-8 flex w-32 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              onClick={() => setIsLeaveGroupModalOpen(true)}
            >
              Leave
            </button>
          </div>
        </>
      )}

      <PointsHelpModal
        isOpen={isPointsModalOpen}
        handleClose={() => setIsPointsModalOpen(false)}
      />

      <StatSummaryModal
        isOpen={isStatSummaryModalOpen}
        handleClose={() => setIsStatSummaryModalOpen(false)}
        leaderboardUser={selectedUser}
      />

      <ConfirmJoinGroupModal
        groupName={group?.groupName!}
        numUserGroups={numUserGroups}
        isGroupPrivate={group?.isPrivate!}
        uid={user?.uid ?? ''}
        alreadyJoined={false}
        showAlert={handleJoinAlert}
        isOpen={isConfirmJoinGroupModalOpen}
        handleClose={() => setIsConfirmJoinGroupModalOpen(false)}
      />

      <ConfirmLeaveGroupModal
        groupName={group?.groupName!}
        isGroupPrivate={group?.isPrivate!}
        uid={user?.uid ?? ''}
        isAdmin={Boolean(user?.email === group?.adminEmail)}
        showErrorAlert={showErrorAlert}
        isOpen={isLeaveGroupModalOpen}
        handleClose={() => setIsLeaveGroupModalOpen(false)}
      />
    </div>
  )
}

export default GroupLeaderboard
