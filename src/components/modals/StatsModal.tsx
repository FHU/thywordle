import {
  BookOpenIcon,
  ClockIcon,
  ShareIcon,
  UserIcon,
} from '@heroicons/react/outline'
import { format } from 'date-fns'
import Countdown from 'react-countdown'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import {
  DATE_LOCALE,
  ENABLE_ARCHIVED_GAMES,
  ENABLE_MIGRATE_STATS,
} from '../../constants/settings'
import {
  ARCHIVE_GAMEDATE_TEXT,
  GUESS_DISTRIBUTION_TEXT,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  STATISTICS_TITLE,
  VERSE_TEXT_BUTTON,
} from '../../constants/strings'
import { GameStats } from '../../constants/types'
import { shareStatus } from '../../lib/share'
import { referenceUrl, solutionGameDate, tomorrow } from '../../lib/words'
import { Histogram } from '../stats/Histogram'
import { MigrationIntro } from '../stats/MigrationIntro'
import { StatBar } from '../stats/StatBar'
import { auth } from './../../lib/firebase'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  solution: string
  displayReference: string
  guesses: string[]
  gameStats: GameStats
  isLatestGame: boolean
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  handleShareFailure: () => void
  handleMigrateStatsButton: () => void
  isHardMode: boolean
  isDarkMode: boolean
  isHighContrastMode: boolean
  numberOfGuessesMade: number
}

export const StatsModal = ({
  isOpen,
  handleClose,
  solution,
  displayReference,
  guesses,
  gameStats,
  isLatestGame,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  handleShareFailure,
  handleMigrateStatsButton,
  isHardMode,
  isDarkMode,
  isHighContrastMode,
  numberOfGuessesMade,
}: Props) => {
  const [user] = useAuthState(auth)

  if (gameStats.totalGames <= 0) {
    return (
      <BaseModal
        title={STATISTICS_TITLE}
        isOpen={isOpen}
        handleClose={handleClose}
      >
        <StatBar gameStats={gameStats} />
        {ENABLE_MIGRATE_STATS && (
          <MigrationIntro handleMigrateStatsButton={handleMigrateStatsButton} />
        )}
      </BaseModal>
    )
  }
  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <StatBar gameStats={gameStats} />
      <h4 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram
        isLatestGame={isLatestGame}
        gameStats={gameStats}
        isGameWon={isGameWon}
        numberOfGuessesMade={numberOfGuessesMade}
      />
      {(isGameLost || isGameWon) && (
        <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
          <div className="inline-block w-full text-left">
            {(!ENABLE_ARCHIVED_GAMES || isLatestGame) && (
              <div>
                <h5>{NEW_WORD_TEXT}</h5>
                <Countdown
                  className="text-lg font-medium text-gray-900 dark:text-gray-100"
                  date={tomorrow}
                  daysInHours={true}
                />
              </div>
            )}
            {ENABLE_ARCHIVED_GAMES && !isLatestGame && (
              <div className="mt-2 inline-flex">
                <ClockIcon className="mr-1 mt-1 mt-2 h-5 w-5 stroke-black dark:stroke-white" />
                <div className="ml-1 mt-1 text-center text-sm sm:text-base">
                  <strong>{ARCHIVE_GAMEDATE_TEXT}:</strong>
                  <br />
                  {format(solutionGameDate, 'd MMMM yyyy', {
                    locale: DATE_LOCALE,
                  })}
                </div>
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
              onClick={() => {
                shareStatus(
                  solution,
                  guesses,
                  isGameLost,
                  isHardMode,
                  isDarkMode,
                  isHighContrastMode,
                  handleShareToClipboard,
                  handleShareFailure
                )
              }}
            >
              <ShareIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
              {SHARE_TEXT}
            </button>
          </div>
        </div>
      )}
      {ENABLE_MIGRATE_STATS && (
        <div>
          <hr className="-mb-4 mt-4 border-gray-500" />
          <MigrationIntro handleMigrateStatsButton={handleMigrateStatsButton} />
        </div>
      )}
      {(isGameLost || isGameWon) && (
        <>
          <hr className="-mb-4 mt-4 border-gray-500" />
          <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
            <div className="mt-3 text-xs">
              <p>Read {displayReference} at Bible.com</p>
            </div>
            <a href={referenceUrl} target="_blank" rel="noreferrer">
              <button
                type="button"
                className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
              >
                <BookOpenIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
                {VERSE_TEXT_BUTTON}
              </button>
            </a>
          </div>
        </>
      )}

      <hr className="-mb-4 mt-4 border-gray-500" />
      <div className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
        <div className="mt-3 text-xs">
          {user ? <p>View your profile</p> : <p>Want to save your stats?</p>}
        </div>
        {user ? (
          <Link
            to="/profile"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => handleClose()}
          >
            <UserIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
            Profile
          </Link>
        ) : (
          <Link
            to="/profile"
            className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            onClick={() => handleClose()}
          >
            <UserIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
            Sign In
          </Link>
        )}
      </div>
    </BaseModal>
  )
}
