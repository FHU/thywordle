import { useEffect, useState } from 'react'

import {
  buttonDisabledClasses,
  buttonEnabledClasses,
} from '../../../constants/classes'
import { PropToEditEnum, ValidEmailEnum } from '../../../constants/types'
import { useAlert } from '../../../context/AlertContext'
import {
  checkIfEmailExistsInFirestore,
  updateFirestorePublicDisplaySetting,
} from '../../../lib/firebase/firebaseAuth'
import { BaseModal } from '../BaseModal'
import { SettingsToggle } from '../SettingsToggle'

type Props = {
  userInfo: any
  propToEdit: PropToEditEnum
  isOpen: boolean
  handleClose: () => void
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
  setNewPropValue,
  setIsConfirmEditProfileModalOpen,
}: Props) => {
  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [toggle, setToggle] = useState<boolean>(false)
  const [signedInWithGoogle, setSignedInWithGoogle] = useState<boolean>(false)
  const [updateAccountText, setUpdateAccountText] =
    useState<string>('Update Account')

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.name)
      setEmail(userInfo.email)
      setToggle(userInfo.displayPublic)
      if (userInfo.authProvider === 'google') {
        setSignedInWithGoogle(true)
      }
    }
  }, [userInfo])

  useEffect(() => {
    switch (propToEdit) {
      case PropToEditEnum.Username:
        setUpdateAccountText('Update Username')
        return
      case PropToEditEnum.Email:
        if (signedInWithGoogle) {
          setUpdateAccountText('Update Email & Password')
          return
        }
        setUpdateAccountText('Update Email')
        return
      case PropToEditEnum.Password:
        setUpdateAccountText('Send Password Reset Email')
        return
      case PropToEditEnum.PublicDisplaySetting:
        setUpdateAccountText('Update Public Display Setting')
        return
      default:
        return
    }
  }, [propToEdit, signedInWithGoogle])

  const isValid = () => {
    switch (propToEdit) {
      case PropToEditEnum.Username:
        return Boolean(username.length)

      case PropToEditEnum.Email:
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        return emailRegex.test(email)

      case PropToEditEnum.Password:
        return true

      case PropToEditEnum.PublicDisplaySetting:
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
            showErrorAlert('That email is already associated with an account.')
            return
          }
          updatePropValue(email)
          return

        case PropToEditEnum.Password:
          handleClose()
          setIsConfirmEditProfileModalOpen(true)
          return

        case PropToEditEnum.PublicDisplaySetting:
          handleDisplayPublicInput()
          return

        default:
          return false
      }
    }
  }

  const handleDisplayPublicInput = async () => {
    const tryUpdate = await updateFirestorePublicDisplaySetting(
      userInfo.uid,
      toggle
    )

    if (tryUpdate) {
      showSuccessAlert('Public display setting updated!')
      handleClose()
    } else {
      showErrorAlert(
        'Unable to update public display setting. Please try again later.'
      )
    }
  }

  return (
    <BaseModal
      title={updateAccountText}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden text-black transition-all dark:text-white">
        <div className="my-2 flex flex-col justify-center">
          {propToEdit === PropToEditEnum.Username && (
            <div>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white sm:text-sm sm:leading-6"
                    placeholder="Name"
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
              {signedInWithGoogle && (
                <p className="text:black my-4 dark:text-white">
                  {'Are you sure you want to update your email?'} <br />{' '}
                  {'Your current account is tied to your '}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {userInfo.email}
                  </span>{' '}
                  {'google account.'} <br />{' '}
                  {
                    'Changing your email will require you to set a new password as well.'
                  }
                </p>
              )}
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

          {propToEdit === PropToEditEnum.PublicDisplaySetting && (
            <div>
              <div className="mt-2">
                <p>
                  Allow my name and stats to be publicly displayed on global
                  leaderboard?
                </p>
                <div className="my-4 flex items-center justify-center">
                  <SettingsToggle
                    settingName="Display Name"
                    flag={toggle}
                    handleFlag={() => setToggle(!toggle)}
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
