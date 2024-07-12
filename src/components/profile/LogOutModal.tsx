import { logout } from '../../lib/firebase/firebaseAuth'
import { BaseModal } from './../modals/BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const LogOutModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Log Out" isOpen={isOpen} handleClose={handleClose}>
      <div className="transform overflow-hidden transition-all">
        <div className="my-2 flex flex-col justify-center">
          <p className="text-black dark:text-white">
            Are you sure you would like to sign out?
          </p>
          <button
            type="button"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-slate-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => {
              logout()
              handleClose()
            }}
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
