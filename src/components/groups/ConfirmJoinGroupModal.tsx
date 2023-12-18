import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { buttonEnabledClasses } from '../../constants/classes'
import { BaseModal } from '../modals/BaseModal'
import { addUserToGroup, getCleanedGroupName } from './../../lib/firebaseGroups'

type Props = {
  groupName: string
  isGroupPrivate: boolean
  uid: string
  alreadyJoined: boolean
  showAlert: any
  isOpen: boolean
  handleClose: () => void
}

export const ConfirmJoinGroupModal = ({
  groupName,
  isGroupPrivate,
  uid,
  alreadyJoined,
  showAlert,
  isOpen,
  handleClose,
}: Props) => {
  const navigate = useNavigate()
  const [groupJoined, setGroupJoined] = useState<boolean>(false)

  const handleJoinGroup = async () => {
    const tryJoinGroup = await addUserToGroup(groupName, uid, isGroupPrivate)
    if (!tryJoinGroup) {
      handleClose()
      showAlert(
        true,
        'Unable to join this group at this time. Please try again later.'
      )
      return
    }

    if (isGroupPrivate) {
      handleClose()
      setGroupJoined(true)
      showAlert(
        false,
        `A request to join this group has been sent to the group admin. Please check back later to see if you have been accepted into ${groupName}.`
      )
      return
    }

    navigate(`/groups/${getCleanedGroupName(groupName)}`)
  }

  const closeModal = () => {
    setGroupJoined(false)
    handleClose()
  }

  return (
    <BaseModal
      title={`Join ${groupName}`}
      isOpen={isOpen}
      handleClose={closeModal}
    >
      <div className="transform overflow-hidden transition-all">
        {alreadyJoined ? (
          <div className="my-2 flex flex-col justify-center">
            <p className="text-black dark:text-white">
              You are already a member of this group!
            </p>
          </div>
        ) : (
          <>
            {!groupJoined ? (
              <div className="my-2 flex flex-col justify-center">
                <p className="text-black dark:text-white">
                  {`Are you sure you would like to join this ${
                    isGroupPrivate ? 'Private' : 'Public'
                  } group?`}
                </p>
                <button
                  className={`${buttonEnabledClasses} group relative mt-5 flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                  onClick={() => handleJoinGroup()}
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
                  {isGroupPrivate ? 'Request to Join Group' : 'Join Group'}
                </button>
              </div>
            ) : (
              <div className="my-2 flex flex-col justify-center">
                {isGroupPrivate ? (
                  <p className="text-black dark:text-white">
                    {'A request has been made to join '}
                    <span className="bold text-indigo-700 dark:text-indigo-300">
                      {groupName}
                    </span>
                    {
                      '. Ask the group admin or check back later to see if you are accepted.'
                    }
                  </p>
                ) : (
                  <>
                    <p className="my-4 text-black dark:text-white">
                      {'Welcome to '}
                      <span className="bold text-indigo-700 dark:text-indigo-300">
                        {groupName}
                      </span>
                      {'!'}
                    </p>
                    <Link
                      to={`/groups/${groupName}`}
                      className="my-4 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
                    >
                      View
                    </Link>
                  </>
                )}
              </div>
            )}
          </>
        )}

        <button
          onClick={() => closeModal()}
          tabIndex={0}
          aria-label="close"
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
