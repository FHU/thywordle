import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../../lib/firebase'
import CreateAccountForm from './CreateAccountForm'
import SignInForm from './SignInForm'

const SignInTabs = ({ handleLogOut, handleForgotPassword }: any) => {
  const [user, loading, error] = useAuthState(auth)
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)
  const tabs = ['Sign In', 'Create New Account']

  if (loading) {
    return (
      <div className="my-4 text-2xl font-bold dark:text-white">
        <p>Loading...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="my-4 text-2xl font-bold dark:text-white">
        <p>Error: {error}</p>
      </div>
    )
  }
  if (user) {
    return (
      <div className="my-8">
        <p className="my-4 text-2xl font-bold dark:text-white">
          UserName
          {/* {user.name} */}
        </p>
        <p className="my-4 text-2xl font-bold dark:text-white">
          Email
          {/* Email: {user.email} */}
        </p>
        <p className="my-4 text-2xl font-bold dark:text-white">Stats</p>
        <div className="mx-auto w-64">
          <button
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleLogOut()}
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex space-x-3 border-b">
        <div className="mx-auto">
          {tabs.map((tab, idx) => {
            return (
              <button
                key={idx}
                className={`mx-4 border-b-4 py-2 transition-colors duration-300 dark:text-white ${
                  idx === activeTabIndex
                    ? 'border-indigo-600'
                    : 'border-transparent hover:border-gray-200 dark:hover:border-slate-500'
                }`}
                onClick={() => setActiveTabIndex(idx)}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>
      <div className="py-4">
        {activeTabIndex === 0 ? (
          <SignInForm handleForgotPassword={handleForgotPassword} />
        ) : (
          <CreateAccountForm />
        )}
      </div>
    </div>
  )
}

export default SignInTabs
