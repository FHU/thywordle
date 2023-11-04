import { User } from 'firebase/auth'
import React, { useState } from 'react'

import { GameStats } from '@/constants/types'

import CreateAccountForm from './CreateAccountForm'
import ProfileInformation from './ProfileInformation'
import SignInForm from './SignInForm'

interface props {
  user: User | null | undefined
  userInfo: any
  stats: GameStats
  handleLogOut: any
  handleEditProfile: any
  handleForgotPassword: any
}

const SignInTabs = ({
  user,
  userInfo,
  stats,
  handleLogOut,
  handleEditProfile,
  handleForgotPassword,
}: props) => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0)
  const tabs = ['Sign In', 'Create New Account']

  if (user) {
    return (
      <ProfileInformation
        user={user}
        userInfo={userInfo}
        stats={stats}
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
