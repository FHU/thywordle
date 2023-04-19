import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../../lib/firebase'
import CreateAccountForm from './CreateAccountForm'
import ProfileInformation from './ProfileInformation'
import SignInForm from './SignInForm'

const SignInTabs = ({
  handleLogOut,
  handleEditProfile,
  handleForgotPassword,
}: any) => {
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
      <ProfileInformation
        handleLogOut={handleLogOut}
        handleEditProfile={handleEditProfile}
      />
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
