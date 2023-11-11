import { useState } from 'react'

import {
  createAccountWithUsernameAndPassword,
  signInWithGoogle,
} from '../../lib/firebase'
import { useAlert } from './../../context/AlertContext'
import ValidateCodeForm from './ValidateCodeForm'
import ValidateEmailForm from './ValidateEmailForm'

interface props {
  inputClasses: string
  buttonDisabledClasses: string
  buttonEnabledClasses: string
}

const CreateAccountForm = ({
  inputClasses,
  buttonDisabledClasses,
  buttonEnabledClasses,
}: props) => {
  const { showError: showErrorAlert } = useAlert()
  const [email, setEmail] = useState<string>('')
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false)
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [verifyCodeFormOpen, setVerifyCodeFormOpen] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const handleIsValidEmail = (isValid: boolean) => {
    if (isValid) {
      const code = String(Math.floor(100000 + Math.random() * 900000))
      // TODO: send email with code
      console.log(code)
      setVerificationCode(code)
      setVerifyCodeFormOpen(true)
    }

    if (!isValid) {
      setIsEmailValid(false)
    }
  }

  const handleIsValidCode = (isValid: boolean) => {
    if (isValid) {
      setVerifyCodeFormOpen(false)
      setIsEmailValid(true)
    }
  }

  const isValidPassword = () => {
    if (password.length < 8 || confirmPassword.length < 8) {
      showErrorAlert('Passwords must be at least 8 characters long.')
      return false
    }

    if (password !== confirmPassword) {
      showErrorAlert('Passwords must match.')
      return false
    }

    return true
  }

  const isValid = () => {
    if (username.length === 0 || email.length === 0) {
      return false
    }

    return isValidPassword()
  }

  const handleCreateAccountButtonClick = async () => {
    const signIn = await createAccountWithUsernameAndPassword(
      username,
      email,
      password
    )
    if (signIn === undefined) {
      showErrorAlert(
        'Sorry, unable to create an account at this time. Please try again later.'
      )
    }
  }

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold dark:text-white md:text-2xl">
        Create New Account
      </h2>
      <div className="flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-md shadow-sm md:w-1/2">
          {!isEmailValid && !verifyCodeFormOpen && (
            <ValidateEmailForm
              email={email}
              setEmail={setEmail}
              handleIsValidEmail={handleIsValidEmail}
              newAccount={true}
              inputClasses={inputClasses}
              buttonDisabledClasses={buttonDisabledClasses}
              buttonEnabledClasses={buttonEnabledClasses}
            />
          )}

          {verifyCodeFormOpen && (
            <ValidateCodeForm
              email={email}
              verificationCode={verificationCode}
              handleIsValidCode={handleIsValidCode}
              inputClasses={inputClasses}
              buttonDisabledClasses={buttonDisabledClasses}
              buttonEnabledClasses={buttonEnabledClasses}
            />
          )}

          {isEmailValid && (
            <>
              <div>
                <label htmlFor="username" className="sr-only">
                  Name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="name"
                  value={username}
                  onChange={(e: any) => {
                    setUsername(e.target.value)
                  }}
                  required
                  className={`${inputClasses} rounded-t-md bg-white dark:bg-slate-800`}
                  placeholder="Name"
                />
              </div>
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
                  required
                  className={`${inputClasses} bg-gray-200 hover:cursor-not-allowed dark:bg-gray-600`}
                  placeholder="Email address"
                  disabled={true}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e: any) => {
                    setPassword(e.target.value)
                  }}
                  required
                  className={`${inputClasses} bg-white dark:bg-slate-800`}
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: any) => {
                    setConfirmPassword(e.target.value)
                  }}
                  required
                  className={`${inputClasses} rounded-b-md bg-white dark:bg-slate-800`}
                  placeholder="Confirm Password"
                />
              </div>
              <p
                className="my-4 cursor-pointer text-sm font-medium text-indigo-600 underline hover:text-indigo-500 dark:text-white"
                onClick={() => {
                  setEmail('')
                  setIsEmailValid(false)
                }}
              >
                Switch Email
              </p>
            </>
          )}
        </div>

        <div className="w-64">
          {isEmailValid && (
            <button
              className={`${
                isValid() ? buttonEnabledClasses : buttonDisabledClasses
              } group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              onClick={handleCreateAccountButtonClick}
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
              Create Account
            </button>
          )}

          <p className="my-4 text-black dark:text-white">or</p>

          <button
            className="inline-flex w-full items-center justify-between rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
            onClick={signInWithGoogle}
          >
            <svg
              className="-ml-1 mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google<div></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountForm
