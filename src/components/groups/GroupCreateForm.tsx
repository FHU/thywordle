import { useState } from 'react'

import {
  buttonDisabledClasses,
  buttonEnabledClasses,
  inputClasses,
} from './../../constants/classes'
import { useAlert } from './../../context/AlertContext'
import ValidateGroupNameForm from './ValidateGroupNameForm'

interface props {
  isPrivate: boolean
}

const GroupCreateForm = ({ isPrivate }: props) => {
  const { showError: showErrorAlert } = useAlert()
  const [groupName, setGroupName] = useState<string>('')
  const [isGroupNameValid, setIsGroupNameValid] = useState<boolean>(false)

  const isValid = () => {
    return Boolean(groupName.length)
  }

  const handleCreateAccountButtonClick = async () => {
    // const signIn = await createAccountWithUsernameAndPassword(
    //   username,
    //   groupName,
    //   password
    // )
    // if (signIn === undefined) {
    showErrorAlert(
      'Sorry, unable to create a new group at this time. Please try again later.'
    )
    // }
    // TODO: do not allow any special characters in group Names
    // TODO: show confirm create group modal
  }

  return (
    <div className="my-6 text-black dark:text-white">
      <h2 className="text-xl font-bold md:text-2xl">
        {`Create a New ${isPrivate ? 'Private' : 'Public'} Group!`}
      </h2>
      <p className="mx-4 my-8">
        {isPrivate
          ? 'Manually accept each person allowed to join your group and control who has access to it.'
          : 'Allow anyone to join or leave your group at any time.'}
      </p>
      <div className="flex w-full flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full rounded-md shadow-sm md:w-1/2">
          {!isGroupNameValid && (
            <ValidateGroupNameForm
              groupName={groupName}
              setGroupName={setGroupName}
              setIsGroupNameValid={setIsGroupNameValid}
            />
          )}

          {isGroupNameValid && (
            <>
              <div>
                <label htmlFor="groupName" className="sr-only">
                  Email address
                </label>
                <input
                  id="groupName"
                  name="groupName"
                  type="text"
                  value={groupName}
                  required
                  className={`${inputClasses} rounded-t-md bg-gray-200 hover:cursor-not-allowed dark:bg-gray-600`}
                  placeholder="Group Name"
                  disabled={true}
                />
              </div>
              <div>
                <label htmlFor="groupType" className="sr-only">
                  Group Member Limit
                </label>
                <input
                  id="groupType"
                  name="groupType"
                  type="text"
                  value={isPrivate ? 'Private' : 'Public'}
                  required
                  className={`${inputClasses} rounded-b-md bg-gray-200 hover:cursor-not-allowed dark:bg-gray-600`}
                  placeholder="Group Member Limit"
                  disabled={true}
                />
              </div>
              <p
                className="my-4 cursor-pointer text-sm font-medium text-indigo-600 underline hover:text-indigo-500"
                onClick={() => {
                  setGroupName('')
                  setIsGroupNameValid(false)
                }}
              >
                Change Group Name
              </p>
            </>
          )}
        </div>

        <div className="w-64">
          {isGroupNameValid && (
            <button
              className={`${
                isValid() ? buttonEnabledClasses : buttonDisabledClasses
              } group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              onClick={handleCreateAccountButtonClick}
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
              {`Create ${isPrivate ? 'Private' : 'Public'} Group`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupCreateForm
