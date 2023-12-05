import { checkIfEmailExistsInFirestore } from '../../lib/firebase'
import {
  buttonDisabledClasses,
  buttonEnabledClasses,
  inputClasses,
} from './../../constants/classes'
import { ValidEmailEnum } from './../../constants/types'
import { useAlert } from './../../context/AlertContext'

interface props {
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setIsEmailValid: React.Dispatch<React.SetStateAction<boolean>>
  newAccount: boolean
}

const ValidateEmailForm = ({
  email,
  setEmail,
  setIsEmailValid,
  newAccount,
}: props) => {
  const { showError: showErrorAlert } = useAlert()
  const isValidEmail = () => {
    const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
    return emailRegex.test(email)
  }

  const emailNotAllowed = (errorMessage: string) => {
    setIsEmailValid(false)
    showErrorAlert(errorMessage)
  }

  const handleButtonClick = async () => {
    const isEmailInFirestore = await checkIfEmailExistsInFirestore(email)

    if (isEmailInFirestore === ValidEmailEnum.FoundGoogle) {
      emailNotAllowed(
        'That email is already associated with a Google account. Please Sign in with Google.'
      )
      return
    }

    if (isEmailInFirestore === ValidEmailEnum.FoundPassword) {
      if (newAccount) {
        emailNotAllowed(
          'That email is already associated with an account. Please sign in on the previous tab.'
        )
        return
      }
    }

    if (isEmailInFirestore === ValidEmailEnum.NotFound) {
      if (!newAccount) {
        emailNotAllowed(
          'That email does not exist. Please create an account or try signing in with a different email address.'
        )
        return
      }
    }

    setIsEmailValid(true)
  }

  return (
    <>
      <div>
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value)
          }}
          required
          className={`${inputClasses} rounded-md bg-white dark:bg-slate-800`}
          placeholder="Email address"
          disabled={false}
        />
      </div>

      <div className="mx-auto mt-5 w-64">
        <button
          className={`${
            isValidEmail() ? buttonEnabledClasses : buttonDisabledClasses
          } group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          onClick={handleButtonClick}
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
          Continue
        </button>
      </div>
    </>
  )
}

export default ValidateEmailForm
