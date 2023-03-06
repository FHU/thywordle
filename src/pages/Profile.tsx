import { Auth } from 'aws-amplify'
import React from 'react'

const username = 'Dallas'
const password = 'BadPassword'
const email = 'daya@freed.com'

function Profile() {
  async function signUp() {
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email, // optional
          // phone_number, // optional - E.164 number convention
          // other custom attributes
        },
        autoSignIn: {
          // optional - enables auto sign in after user is confirmed
          enabled: true,
        },
      })
      console.log(user)
    } catch (error) {
      console.log('error signing up:', error)
    }
  }
  return (
    <div className="grid w-full grid-cols-8 gap-4">
      <div className="col-span-6 col-start-2 mt-2 min-h-screen rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <h1 className="text-l my-12 font-bold dark:text-white sm:text-xl md:text-3xl">
          Profile
        </h1>

        <div>
          <button
            onClick={signUp}
            className="my-2 mx-auto w-48 rounded-md bg-slate-200 p-4 text-black"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
