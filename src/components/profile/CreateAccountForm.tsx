import { Alert, Snackbar } from '@mui/material'
import React, { useState } from 'react'

import {
  checkIfEmailExistsInFirebase,
  createAccountWithUsernameAndPassword,
  signInWithGoogle,
} from '../../lib/firebase'
import AccountButton from './AccountButton'

const CreateAccountForm = () => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [validEmail, setValidEmail] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')

  const isValidEmail = () => {
    if (username) {
      const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
      return emailRegex.test(email)
    }
  }

  const isValidPassword = () => {
    if (password.length < 8 || confirmPassword.length < 8) {
      setAlertMessage('Passwords must be at least 8 characters long.')
      setIsAlertOpen(true)
      return false
    }

    if (password !== confirmPassword) {
      setAlertMessage('Passwords must match.')
      setIsAlertOpen(true)
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

  const handleContinueButtonClick = async () => {
    const isValidEmail = await checkIfEmailExistsInFirebase(email)
    setValidEmail(!isValidEmail)
    if (isValidEmail) {
      setAlertMessage(
        'That email is already associated with an account. Please sign in on the previous tab.'
      )
      setIsAlertOpen(true)
    }
  }

  const handleCreateAccountButtonClick = async () => {
    const signIn = await createAccountWithUsernameAndPassword(
      username,
      email,
      password
    )
    if (signIn === undefined) {
      setAlertMessage(
        'Sorry, unable to create an account at this time. Please try again later.'
      )
      setIsAlertOpen(true)
    }
  }

  const inputClasses =
    'w-full border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white sm:leading-6'

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold dark:text-white md:text-2xl">
        Create New Account
      </h2>
      <div className="flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <input type="hidden" name="remember" value="true" />
        <div className="mb-8 w-full rounded-md shadow-sm md:w-1/2">
          <div>
            <label htmlFor="username" className="sr-only">
              Name (Example: John Doe)
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
              placeholder="Name (Example: John Doe)"
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
              onChange={(e: any) => {
                setEmail(e.target.value)
              }}
              required
              className={`${inputClasses} ${
                validEmail
                  ? 'bg-gray-200 hover:cursor-not-allowed dark:bg-gray-600'
                  : 'rounded-b-md bg-white dark:bg-slate-800'
              }`}
              placeholder="Email address"
              disabled={validEmail}
            />
          </div>

          {validEmail && (
            <>
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
                className="mt-4 cursor-pointer text-sm font-medium text-indigo-600 underline hover:text-indigo-500 dark:text-white"
                onClick={() => {
                  setEmail('')
                  setValidEmail(false)
                }}
              >
                Switch Email
              </p>
            </>
          )}
        </div>

        <div className="w-64">
          {!validEmail ? (
            <AccountButton
              isValid={isValidEmail}
              handleClick={handleContinueButtonClick}
              buttonText="Continue"
            />
          ) : (
            <AccountButton
              isValid={isValid}
              handleClick={handleCreateAccountButtonClick}
              buttonText="Create Account"
            />
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

          <Snackbar
            open={isAlertOpen}
            autoHideDuration={6000}
            onClose={() => setIsAlertOpen(false)}
          >
            <Alert
              onClose={() => setIsAlertOpen(false)}
              severity="error"
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  )
}

export default CreateAccountForm
