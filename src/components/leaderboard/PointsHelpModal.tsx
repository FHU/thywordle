import { BaseModal } from './../modals/BaseModal'

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
        <p className="m-4 text-left text-lg">
          Points are calculated by a combination of <b>Current Steak</b> and{' '}
          <b>Average Number of Guesses</b>. Continue to improve your stats to
          see your point totals increase!
        </p>
        <button
          onClick={() => handleClose()}
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
