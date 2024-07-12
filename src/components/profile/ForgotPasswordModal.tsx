import { useState } from 'react'

import { resetForgottenPassword } from '../../lib/firebase/firebaseAuth'
import { buttonEnabledClasses } from './../../constants/classes'
import { BaseModal } from './../modals/BaseModal'

type Props = {
  email: string
  isOpen: boolean
  handleClose: () => void
}

export const ForgotPasswordModal = ({ email, isOpen, handleClose }: Props) => {
  const [emailSent, setEmailSent] = useState<boolean>(false)

  const handleForgotPasswordButtonClick = () => {
    resetForgottenPassword(email)
    setEmailSent(true)
  }

  const closeModal = () => {
    handleClose()
    setEmailSent(false)
  }

  return (
    <BaseModal title="Forgot Password" isOpen={isOpen} handleClose={closeModal}>
      <div className="transform overflow-hidden transition-all">
        {!emailSent ? (
          <div className="my-2 flex flex-col justify-center">
            <p className="text-black dark:text-white">
              Are you sure you would like to <br /> reset your Password?
            </p>
            <button
              className={`${buttonEnabledClasses} group relative mt-5 flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              onClick={() => handleForgotPasswordButtonClick()}
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
              Reset Password
            </button>
          </div>
        ) : (
          <div className="my-2 flex flex-col justify-center">
            <p className="text-black dark:text-white">
              An email has been sent to{' '}
              <span className="bold text-indigo-700 dark:text-indigo-300">
                {email}
              </span>
              . Visit the link provided to reset your password.
            </p>
          </div>
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
