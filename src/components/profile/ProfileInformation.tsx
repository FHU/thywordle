import React, { useState } from 'react'

const ProfileInformation = ({ handleLogOut, handleEditProfile }: any) => {
  const [signedInWithGoogle, setSignedInWithGoogle] = useState<boolean>(false)

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
      <div
        className={`${
          signedInWithGoogle ? 'w-64' : 'w-4/5 md:w-96'
        } mx-auto flex`}
      >
        {!signedInWithGoogle && (
          <button
            className="group relative mx-2 flex w-full justify-center rounded-md bg-slate-400 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => handleEditProfile()}
          >
            Edit Profile
          </button>
        )}
        <button
          className="group relative mx-2 flex w-full justify-center rounded-md bg-slate-400 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => handleLogOut()}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-slate-800 group-hover:text-indigo-400"
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
          Logout
        </button>
      </div>
    </div>
  )
}

export default ProfileInformation
