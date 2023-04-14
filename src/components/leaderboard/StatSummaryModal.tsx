import {
  BEST_STREAK_TEXT,
  CURRENT_STREAK_TEXT,
  SUCCESS_RATE_TEXT,
} from './../../constants/strings'
import { BaseModal } from './../modals/BaseModal'
import { StatItem } from './../stats/StatBar'

type Props = {
  isOpen: boolean
  handleClose: () => void
  user: any
}

export const StatSummaryModal = ({ isOpen, handleClose, user }: Props) => {
  return (
    <BaseModal
      title={`${user?.name} Stats`}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <div className="transform overflow-hidden transition-all">
        <div className="my-2 flex justify-center">
          <StatItem
            label={SUCCESS_RATE_TEXT}
            value={`${user?.stats.successRate}%`}
          />
          <StatItem
            label={CURRENT_STREAK_TEXT}
            value={user?.stats.currentStreak}
          />
          <StatItem label={BEST_STREAK_TEXT} value={user?.stats.bestStreak} />
        </div>

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
