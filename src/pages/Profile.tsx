import React, { useState } from 'react'

import ProfileContent from '../components/profile/ProfileContent'
import { LogOutModal } from './../components/profile/LogOutModal'
import favicon from './../img/favicon.png'

function Profile() {
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState<boolean>(false)

  const handleLogOut = () => {
    setIsLogoutConfirmationOpen(true)
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
        <ProfileContent handleLogOut={handleLogOut} />
      </div>

      <LogOutModal
        isOpen={isLogoutConfirmationOpen}
        handleClose={() => setIsLogoutConfirmationOpen(false)}
      />
    </div>
  )
}

export default Profile
