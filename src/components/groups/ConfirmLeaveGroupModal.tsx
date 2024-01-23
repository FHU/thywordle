import { useNavigate } from 'react-router-dom'

import { removeUserFromGroup } from '../../lib/firebaseGroups'
import { BaseModal } from '../modals/BaseModal'

type Props = {
  groupName: string
  isGroupPrivate: boolean
  uid: string
  isAdmin: boolean
  showErrorAlert: (message: string, options?: any | undefined) => void
  isOpen: boolean
  handleClose: () => void
}

export const ConfirmLeaveGroupModal = ({
  groupName,
  isGroupPrivate,
  uid,
  isAdmin,
  showErrorAlert,
  isOpen,
  handleClose,
}: Props) => {
  const navigate = useNavigate()

  const handleLeaveGroupButtonClick = async () => {
    const tryRemove = await removeUserFromGroup(groupName, uid, isAdmin)
    if (!tryRemove) {
      showErrorAlert(
        'Sorry, unable to leave this group at this time. Please try again later.'
      )
    }

    navigate('/groups')
  }

  return (
    <BaseModal
      title={`Leave ${groupName}`}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden transition-all">
        <div className="my-2 flex flex-col justify-center">
          <p className="text-black dark:text-white">
            {`Are you sure you would like to leave this ${
              isGroupPrivate ? 'Private' : 'Public'
            } group?`}
          </p>
          {isAdmin && (
            <p className="my-6 text-red-600 dark:text-red-400">
              Since you are the creator of the group, leaving this group will
              also delete the entire group and automatically remove all users
              from it!
            </p>
          )}
          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => handleClose()}
          >
            No
          </button>
          <button
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-slate-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => handleLeaveGroupButtonClick()}
          >
            Leave Group
          </button>
        </div>

        <button
          onClick={handleClose}
          tabIndex={0}
          aria-label="close"
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
