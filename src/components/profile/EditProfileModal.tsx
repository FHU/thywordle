import { useEffect, useState } from 'react'

import { PropToEditEnum, ValidEmailEnum } from './../../constants/types'
import { checkIfEmailExistsInFirestore } from './../../lib/firebase'
import { BaseModal } from './../modals/BaseModal'

type Props = {
  userInfo: any
  propToEdit: PropToEditEnum
  isOpen: boolean
  handleClose: () => void
  handleError: any
  setNewPropValue: React.Dispatch<React.SetStateAction<string>>
  setIsConfirmEditProfileModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}

export const EditProfileModal = ({
  userInfo,
  propToEdit,
  isOpen,
  handleClose,
  handleError,
  setNewPropValue,
  setIsConfirmEditProfileModalOpen,
}: Props) => {
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [updateAccountText, setUpdateAccountText] =
    useState<string>('Update Account')

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.name)
      setEmail(userInfo.email)
    }
  }, [userInfo])

  useEffect(() => {
    switch (propToEdit) {
      case PropToEditEnum.Username:
        setUpdateAccountText('Update Username')
        return
      case PropToEditEnum.Email:
        setUpdateAccountText('Update Email')
        return
      case PropToEditEnum.Password:
        setUpdateAccountText('Send Password Reset Email')
        return
      default:
        return
    }
  }, [propToEdit])

  const buttonDisabledClasses =
    'bg-indigo-300 focus-visible:outline-indigo-300 cursor-not-allowed'
  const buttonEnabledClasses =
    'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'

  const isValid = () => {
    switch (propToEdit) {
      case PropToEditEnum.Username:
        return Boolean(username.length)

      case PropToEditEnum.Email:
        const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
        return emailRegex.test(email)

      case PropToEditEnum.Password:
        return true

      default:
        return false
    }
  }

  const updatePropValue = (newValue: string) => {
    handleClose()
    setNewPropValue(newValue)
    setIsConfirmEditProfileModalOpen(true)
  }

  const handleEditAccountButtonClick = async () => {
    if (isValid()) {
      switch (propToEdit) {
        case PropToEditEnum.Username:
          updatePropValue(username)
          return

        case PropToEditEnum.Email:
          const isEmailInFirestore = await checkIfEmailExistsInFirestore(email)
          if (isEmailInFirestore !== ValidEmailEnum.NotFound) {
            handleError('That email is already associated with an account.')
            return
          }
          updatePropValue(email)
          return

        case PropToEditEnum.Password:
          handleClose()
          setIsConfirmEditProfileModalOpen(true)
          return

        default:
          return false
      }
    }
  }

  return (
    <BaseModal
      title={updateAccountText}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden transition-all">
        <div className="my-2 flex flex-col justify-center">
          {propToEdit === PropToEditEnum.Username && (
            <div>
              <label
                htmlFor="username"
                className="text-md block font-medium leading-6 text-black dark:text-white"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white sm:text-sm sm:leading-6"
                    placeholder="Name (Example: John Doe)"
                    value={username}
                    onChange={(e: any) => {
                      setUsername(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {propToEdit === PropToEditEnum.Email && (
            <div>
              <label
                htmlFor="email"
                className="text-md mt-4 block font-medium leading-6 text-black dark:text-white"
              >
                Email
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white sm:text-sm sm:leading-6"
                    placeholder="Email address"
                    value={email}
                    onChange={(e: any) => {
                      setEmail(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mx-auto mt-8 w-64">
            <button
              className={`${
                isValid() ? buttonEnabledClasses : buttonDisabledClasses
              } group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              onClick={() => handleEditAccountButtonClick()}
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
              {updateAccountText}
            </button>
          </div>
        </div>

        <button
          onClick={() => handleClose()}
          tabIndex={0}
          aria-label="close"
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
