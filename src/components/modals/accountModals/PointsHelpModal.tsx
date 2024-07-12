import { BaseModal } from '../BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const PointsHelpModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal
      title="Points Explained"
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden transition-all">
        <p className="m-4 text-left text-lg text-black dark:text-white">
          {'Points are most impacted by '}
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            Games Won
          </span>
          {', '}
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            Average Number of Guesses
          </span>
          {', and '}
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            Success Rate
          </span>
          {
            '. Continue to improve your stats to see your point totals increase!'
          }
        </p>
        <button
          aria-label="close"
          onClick={() => handleClose()}
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
