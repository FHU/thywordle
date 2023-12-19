import { PropToEditEnum } from './../../constants/types'

interface props {
  userInfo: any
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
  setPropToEdit: React.Dispatch<React.SetStateAction<PropToEditEnum>>
  handleEditProfile: any
  handleDeleteAccount: any
}

const EditProfileForm = ({
  userInfo,
  setIsEdit,
  setPropToEdit,
  handleEditProfile,
  handleDeleteAccount,
}: props) => {
  const editProp = (prop: PropToEditEnum) => {
    setPropToEdit(prop)
    handleEditProfile()
  }

  const inputClasses =
    'my-4 mr-4 rounded-md bg-gray-200 hover:cursor-not-allowed dark:bg-gray-600 w-full border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:text-white sm:leading-6'

  return (
    <div className="my-6">
      <h2 className="text-xl font-bold dark:text-white md:text-2xl">
        EditProfile
      </h2>
      <div className="flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-md md:w-1/2">
          <div className="flex items-center justify-between">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="name"
              value={userInfo.name ?? ''}
              required
              className={inputClasses}
              placeholder="Name"
              disabled={true}
            />
            <button
              className="h-full w-full items-center rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
              onClick={() => editProp(PropToEditEnum.Username)}
            >
              <span>Edit Username</span>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              value={userInfo.email}
              required
              className={inputClasses}
              placeholder="Email address"
              disabled={true}
            />
            <button
              className="h-full w-full items-center rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
              onClick={() => editProp(PropToEditEnum.Email)}
            >
              Edit Email
            </button>
          </div>
          {userInfo.authProvider === 'password' && (
            <div className="flex items-center justify-between">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={'dummyPassword'}
                required
                className={inputClasses}
                placeholder="Password"
                disabled={true}
              />
              <button
                className="h-full w-full items-center rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
                onClick={() => editProp(PropToEditEnum.Password)}
              >
                Edit Password
              </button>
            </div>
          )}
        </div>

        <div className="my-8 w-full text-black dark:text-white">
          <p>
            Allow my name and stats to be publicly displayed on global
            leaderboard?
          </p>
          <button
            className="my-4 h-full items-center rounded-md bg-indigo-600 px-2 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
            onClick={() => editProp(PropToEditEnum.PublicDisplaySetting)}
          >
            Edit Public Display Setting
          </button>
        </div>

        <div className="w-64">
          <button
            className="w-full items-center justify-between rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
            onClick={() => setIsEdit(false)}
          >
            Return to Profile
          </button>

          <button
            className="mt-8 w-full items-center justify-between rounded-lg bg-gray-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600/90"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileForm
