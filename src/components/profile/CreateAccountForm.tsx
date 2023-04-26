import React, { useState } from 'react'

import {
  createAccountWithUsernameAndPassword,
  signInWithGoogle,
} from '../../lib/firebase'

const CreateAccountForm = () => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')

  const buttonDisabledClasses =
    'bg-indigo-300 focus-visible:outline-indigo-300 cursor-not-allowed'
  const buttonEnabledClasses =
    'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'

  const isValid = () => {
    if (
      username.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      if (password === confirmPassword) {
        return true
      }
    }

    return false
  }

  const handleCreateAccountButtonClick = async () => {
    if (isValid()) {
      await createAccountWithUsernameAndPassword(username, email, password)
    }
  }

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
              className="w-full rounded-t-md border-0 bg-white py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white sm:leading-6"
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
              className="w-full border-0 bg-white py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white sm:leading-6"
              placeholder="Email address"
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
              className="w-full border-0 bg-white py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white sm:leading-6"
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
              className="w-full rounded-b-md border-0 bg-white py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-white sm:leading-6"
              placeholder="Confirm Password"
            />
          </div>
        </div>

        <div className="w-64">
          <button
            className={`${
              isValid() ? buttonEnabledClasses : buttonDisabledClasses
            } group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            onClick={() => handleCreateAccountButtonClick()}
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

          <p className="my-4 text-black dark:text-white">or</p>

          <button
            className="inline-flex w-full items-center justify-between rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
            onClick={signInWithGoogle}
          >
            <svg
              className="mr-2 -ml-1 h-4 w-4"
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
