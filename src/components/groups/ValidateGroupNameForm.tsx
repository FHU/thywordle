import { checkIfGroupNameExistsInFirestore } from '../../lib/firebase'
import { useAlert } from './../../context/AlertContext'

interface props {
  groupName: string
  setGroupName: React.Dispatch<React.SetStateAction<string>>
  setIsGroupNameValid: React.Dispatch<React.SetStateAction<boolean>>
  inputClasses: string
  buttonDisabledClasses: string
  buttonEnabledClasses: string
}

const ValidateGroupNameForm = ({
  groupName,
  setGroupName,
  setIsGroupNameValid,
  inputClasses,
  buttonDisabledClasses,
  buttonEnabledClasses,
}: props) => {
  const { showError: showErrorAlert } = useAlert()

  const groupNameNotAllowed = (errorMessage: string) => {
    setIsGroupNameValid(false)
    showErrorAlert(errorMessage)
  }

  const handleButtonClick = async () => {
    const isGroupNameInFirestore = await checkIfGroupNameExistsInFirestore(
      groupName
    )

    if (isGroupNameInFirestore) {
      groupNameNotAllowed(
        'A group with that name already exists. Please choose a different name.'
      )
      return
    }

    setIsGroupNameValid(true)
  }

  return (
    <>
      <div>
        <label htmlFor="groupName" className="sr-only">
          Group Name
        </label>
        <input
          id="groupName"
          name="groupName"
          type="text"
          value={groupName}
          onChange={(e: any) => {
            setGroupName(e.target.value)
          }}
          required
          className={`${inputClasses} rounded-md bg-white dark:bg-slate-800`}
          placeholder="Group Name"
          disabled={false}
        />
      </div>

      <div className="mx-auto mt-5 w-64">
        <button
          className={`${
            Boolean(groupName.length)
              ? buttonEnabledClasses
              : buttonDisabledClasses
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
          Check if Name is Available
        </button>
      </div>
    </>
  )
}

export default ValidateGroupNameForm
