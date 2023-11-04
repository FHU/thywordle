import { Alert, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'

import {
  auth,
  checkIfEmailExistsInFirebase,
  signInWithGoogle,
} from '../../lib/firebase'

const SignInForm = ({ handleForgotPassword }: any) => {
  const [email, setEmail] = useState<string>('')
  const [validEmail, setValidEmail] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [alertMessage, setAlertMessage] = useState<string>('')
  const buttonDisabledClasses =
    'bg-indigo-300 focus-visible:outline-indigo-300 cursor-not-allowed'
  const buttonEnabledClasses =
    'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'

  const isValid = (validatePassword: boolean) => {
    if (!validatePassword) {
      const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
      return emailRegex.test(email)
    }

    if (password.length === 0) {
      return false
    }

    return true
  }

  const handleSignInButtonClick = async (validEmail: boolean) => {
    if (!validEmail) {
      const isValidEmail = await checkIfEmailExistsInFirebase(email)
      setValidEmail(isValidEmail)
      if (!isValidEmail) {
        setAlertMessage(
          'That email does not exist. Please create an account or try signing in with a different email address.'
        )
        setIsAlertOpen(true)
      }
      return
    }

    const signIn = await signInWithEmailAndPassword(email, password)
    if (signIn === undefined) {
      setAlertMessage(
        'That password does not match for this account. Please try again or reset your password.'
      )
      setIsAlertOpen(true)
    }
  }

  const inputClasses =
    'w-full rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white sm:leading-6'

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold dark:text-white md:text-2xl">Sign In</h2>
      <div className="flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <input type="hidden" name="remember" value="true" />
        <div className="w-full md:w-1/2">
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
                  : 'bg-white dark:bg-slate-800'
              }`}
              placeholder="Email address"
              disabled={validEmail}
            />
          </div>

          {validEmail && (
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
                className={`${inputClasses} mt-4 bg-white dark:bg-slate-800`}
                placeholder="Password"
              />
              <p
                className="my-4 cursor-pointer text-sm font-medium text-indigo-600 underline hover:text-indigo-500 dark:text-white"
                onClick={() => {
                  setEmail('')
                  setValidEmail(false)
                }}
              >
                Switch Email
              </p>
              <p
                className="my-4 cursor-pointer text-sm font-medium text-indigo-600 underline hover:text-indigo-500 dark:text-white"
                onClick={() => handleForgotPassword()}
              >
                Forgot your password?
              </p>
            </div>
          )}
        </div>

        <div className="w-64">
          <button
            className={`${
              isValid(validEmail) ? buttonEnabledClasses : buttonDisabledClasses
            } group relative my-4 flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            onClick={() => handleSignInButtonClick(validEmail)}
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
            {validEmail ? 'Sign in' : 'Continue'}
          </button>

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

export default SignInForm
