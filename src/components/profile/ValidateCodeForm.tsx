import { useState } from 'react'

import { useAlert } from './../../context/AlertContext'

interface props {
  email: string
  verificationCode: string
  handleIsValidCode: any
  inputClasses: string
  buttonDisabledClasses: string
  buttonEnabledClasses: string
}

const ValidateCodeForm = ({
  email,
  verificationCode,
  handleIsValidCode,
  inputClasses,
  buttonDisabledClasses,
  buttonEnabledClasses,
}: props) => {
  const { showError: showErrorAlert } = useAlert()
  const [space1, setSpace1] = useState<string>('')
  const [space2, setSpace2] = useState<string>('')
  const [space3, setSpace3] = useState<string>('')
  const [space4, setSpace4] = useState<string>('')
  const [space5, setSpace5] = useState<string>('')
  const [space6, setSpace6] = useState<string>('')

  const inputEntered = (char: any, index: number) => {
    if (index === 1) {
      setSpace1(char)
      document.getElementById('space2')?.focus()
    }

    if (index === 2) {
      setSpace2(char)
      document.getElementById('space3')?.focus()
    }

    if (index === 3) {
      setSpace3(char)
      document.getElementById('space4')?.focus()
    }

    if (index === 4) {
      setSpace4(char)
      document.getElementById('space5')?.focus()
    }

    if (index === 5) {
      setSpace5(char)
      document.getElementById('space6')?.focus()
    }

    if (index === 6) {
      setSpace6(char)
    }
  }

  const isValidCode = () => {
    const code = `${space1}${space2}${space3}${space4}${space5}${space6}`
    return code.length === 6
  }

  const handleButtonClick = async () => {
    const code = `${space1}${space2}${space3}${space4}${space5}${space6}`

    if (code !== verificationCode) {
      showErrorAlert('That code does not match. Please try again.')
    }

    if (code === verificationCode) {
      handleIsValidCode(true)
    }
  }

  return (
    <>
      <p className="text-md mb-4 text-center text-black dark:text-white">
        Enter the verification code that was sent to the email below:
      </p>
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
          required
          className={`${inputClasses} rounded-md bg-gray-200 hover:cursor-not-allowed dark:bg-gray-600`}
          placeholder="Email address"
          disabled={true}
        />
      </div>

      <div className="my-8 flex space-x-3">
        <input
          id="space1"
          type="text"
          className="block w-full rounded-md border-gray-200 text-center text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="⚬"
          value={space1}
          onChange={(e: any) => inputEntered(e.target.value, 1)}
          maxLength={1}
          disabled={space1 === null}
          autoFocus
        />
        <input
          id="space2"
          type="text"
          className="block w-full rounded-md border-gray-200 text-center text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="⚬"
          value={space2}
          onChange={(e: any) => inputEntered(e.target.value, 2)}
          maxLength={1}
          disabled={space2 === null}
        />
        <input
          id="space3"
          type="text"
          className="block w-full rounded-md border-gray-200 text-center text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="⚬"
          value={space3}
          onChange={(e: any) => inputEntered(e.target.value, 3)}
          maxLength={1}
          disabled={space3 === null}
        />
        <input
          id="space4"
          type="text"
          className="block w-full rounded-md border-gray-200 text-center text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="⚬"
          value={space4}
          onChange={(e: any) => inputEntered(e.target.value, 4)}
          maxLength={1}
          disabled={space4 === null}
        />
        <input
          id="space5"
          type="text"
          className="block w-full rounded-md border-gray-200 text-center text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="⚬"
          value={space5}
          onChange={(e: any) => inputEntered(e.target.value, 5)}
          maxLength={1}
          disabled={space5 === null}
        />
        <input
          id="space6"
          type="text"
          className="block w-full rounded-md border-gray-200 text-center text-lg focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:focus:ring-gray-600 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="⚬"
          value={space6}
          onChange={(e: any) => inputEntered(e.target.value, 6)}
          maxLength={1}
          disabled={space6 === null}
        />
      </div>

      <div className="mx-auto mt-5 w-64">
        <button
          className={`${
            isValidCode() ? buttonEnabledClasses : buttonDisabledClasses
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
          Verify Code
        </button>
      </div>
    </>
  )
}

export default ValidateCodeForm
