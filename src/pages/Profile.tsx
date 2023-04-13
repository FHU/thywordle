import React, { useState } from 'react'

import SignInTabs from '../components/profile/SignInTabs'
import { ForgotPasswordModal } from './../components/profile/ForgotPasswordModal'
import { LogOutModal } from './../components/profile/LogOutModal'
import favicon from './../img/favicon.png'

function Profile() {
  const [isLogoutConfirmationModalOpen, setIsLogoutConfirmationModalOpen] =
    useState<boolean>(false)

  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState<boolean>(false)

  const handleLogOut = () => {
    setIsLogoutConfirmationModalOpen(true)
  }

  const handleForgotPassword = () => {
    setIsForgotPasswordModalOpen(true)
  }

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="mb-4 text-2xl font-bold dark:text-white md:text-3xl">
          Profile
        </h1>
      </div>

      <div className="col-span-10 col-start-2 mt-2 mb-16 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <SignInTabs
          handleLogOut={handleLogOut}
          handleForgotPassword={handleForgotPassword}
        />
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        handleClose={() => setIsForgotPasswordModalOpen(false)}
      />

      <LogOutModal
        isOpen={isLogoutConfirmationModalOpen}
        handleClose={() => setIsLogoutConfirmationModalOpen(false)}
      />
    </div>
  )
}

export default Profile
