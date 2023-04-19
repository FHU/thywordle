import { useState } from 'react'

import { resetForgottenPassword } from './../../lib/firebase'
import { BaseModal } from './../modals/BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const ForgotPasswordModal = ({ isOpen, handleClose }: Props) => {
  const [email, setEmail] = useState<string>('')
  const [emailSent, setEmailSent] = useState<boolean>(false)

  const buttonDisabledClasses =
    'bg-indigo-300 focus-visible:outline-indigo-300 cursor-not-allowed'
  const buttonEnabledClasses =
    'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'

  const isValid = () => {
    if (email.length > 0) {
      return true
    }

    return false
  }

  const handleForgotPasswordButtonClick = () => {
    if (isValid()) {
      resetForgottenPassword(email)
      setEmailSent(true)
    }
  }

  const closeModal = () => {
    handleClose()
    setEmail('')
    setEmailSent(false)
  }

  return (
    <BaseModal title="Forgot Password" isOpen={isOpen} handleClose={closeModal}>
      <div className="transform overflow-hidden transition-all">
        {!emailSent ? (
          <div className="my-2 flex flex-col justify-center">
            <p className="text-black dark:text-white">
              Enter the email address associated with your account to reset your
              password.
            </p>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e: any) => {
                  setEmail(e.target.value)
                }}
                required
                className="my-6 w-full rounded-md border-0 bg-white py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <button
              className={`${
                isValid() ? buttonEnabledClasses : buttonDisabledClasses
              } group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
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
              <span className="text-indigo-400">{email}</span>. Visit the link
              provided to reset your password.
            </p>
          </div>
        )}

        <button
          onClick={() => closeModal()}
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
