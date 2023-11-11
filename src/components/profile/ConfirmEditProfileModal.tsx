import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PropToEditEnum } from './../../constants/types'
import { useAlert } from './../../context/AlertContext'
import {
  resetForgottenPassword,
  updateFirestoreEmail,
  updateFirestoreUsername,
} from './../../lib/firebase'
import { BaseModal } from './../modals/BaseModal'

type Props = {
  user: User | null | undefined
  propToEdit: PropToEditEnum
  editedValue: string
  isOpen: boolean
  handleClose: () => void
}

export const ConfirmEditProfileModal = ({
  user,
  propToEdit,
  editedValue,
  isOpen,
  handleClose,
}: Props) => {
  const { showError: showErrorAlert } = useAlert()
  const [label, setLabel] = useState<string>('')
  const [passwordReset, setPasswordReset] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    switch (propToEdit) {
      case PropToEditEnum.Username:
        setLabel('Username')
        return
      case PropToEditEnum.Email:
        setLabel('Email')
        return
      case PropToEditEnum.Password:
        setLabel('Password')
        return
      default:
        return
    }
  }, [propToEdit])

  const updateFailed = (errorMessage: string) => {
    showErrorAlert(errorMessage)
    handleClose()
  }

  const updateUsernameAndReload = async () => {
    const update = await updateFirestoreUsername(user!.uid, editedValue)
    if (!update) {
      updateFailed(
        'Unable to update username at this time. Please try again later.'
      )
      return
    }

    navigate(0)
  }

  const updateEmailAndReload = async () => {
    const update = await updateFirestoreEmail(user!, editedValue)
    if (!update) {
      updateFailed(
        'Unable to update email at this time. Please log out, log back in, and try again.'
      )
      return
    }

    navigate(0)
  }

  const handleConfirmButtonClick = async () => {
    switch (propToEdit) {
      case PropToEditEnum.Username:
        await updateUsernameAndReload()
        return
      case PropToEditEnum.Email:
        await updateEmailAndReload()
        return
      case PropToEditEnum.Password:
        resetForgottenPassword(user!.email)
        setPasswordReset(true)
        return
      default:
        return
    }
  }

  return (
    <BaseModal
      title="Confirm Account Update"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden transition-all">
        {passwordReset ? (
          <div className="my-2 flex flex-col justify-center">
            <p className="text-black dark:text-white">
              An email has been sent to{' '}
              <span className="bold text-indigo-700 dark:text-indigo-300">
                {user!.email}
              </span>
              . Visit the link provided to reset your password.
            </p>
          </div>
        ) : (
          <div className="my-2 flex flex-col justify-center">
            <p className="text-black dark:text-white">
              {propToEdit === PropToEditEnum.Password ? (
                <>
                  Are you sure you would like to <br /> update your{' '}
                  <span className="bold text-indigo-700 dark:text-indigo-300">
                    {label}
                  </span>
                  {'?'}
                </>
              ) : (
                <>
                  Are you sure you would like to update your
                  <br />
                  <span className="bold text-indigo-700 dark:text-indigo-300">
                    {label}
                  </span>
                  {' to '}
                  <span className="bold text-indigo-700 dark:text-indigo-300">
                    {editedValue}
                  </span>
                  {'?'}
                </>
              )}
            </p>
            <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-slate-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
              onClick={() => {
                handleConfirmButtonClick()
                handleClose()
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
              onClick={() => handleClose()}
            >
              No
            </button>
          </div>
        )}

        <button
          onClick={() => handleClose()}
          aria-label="close"
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
