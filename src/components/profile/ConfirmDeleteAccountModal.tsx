import { User } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { deleteAccount } from '../../lib/firebaseAuth'
import { BaseModal } from './../modals/BaseModal'

type Props = {
  user: User | null | undefined
  isOpen: boolean
  handleClose: () => void
  showError: any
}

export const ConfirmDeleteAccountModal = ({
  user,
  isOpen,
  handleClose,
  showError,
}: Props) => {
  const navigate = useNavigate()

  const handleDelete = async () => {
    const tryDelete = await deleteAccount(user)
    if (tryDelete) {
      navigate('/')
      return
    }

    showError()
  }

  return (
    <BaseModal title="Delete Account" isOpen={isOpen} handleClose={handleClose}>
      <div className="transform overflow-hidden transition-all">
        <div className="my-2 flex flex-col justify-center">
          <p className="text-black dark:text-white">
            Are you sure you would like to delete your account?
          </p>
          <p className="my-4 text-red-600 dark:text-red-400">
            This will also remove you from all groups and delete any groups you
            created.
          </p>
          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-slate-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={handleDelete}
          >
            Yes
          </button>
          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => handleClose()}
          >
            No
          </button>
        </div>

        <button
          onClick={() => handleClose()}
          aria-label="close"
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
