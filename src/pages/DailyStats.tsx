import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Link } from 'react-router-dom'

import { auth } from '../lib/firebase/firebaseConfig'
import Loading from './../components/gameState/Loading'
import { DatePickerModal } from './../components/modals/DatePickerModal'
import { Histogram } from './../components/stats/Histogram'
import { StatItem } from './../components/stats/StatBar'
import { buttonClasses } from './../constants/classes'
import { DATE_LOCALE } from './../constants/settings'
import {
  AVG_NUM_GUESSES_TEXT,
  GUESS_DISTRIBUTION_TEXT,
  SUCCESS_RATE_TEXT,
  TOTAL_GAMES_TEXT,
} from './../constants/strings'
import { GameStatsByDate } from './../constants/types'
import favicon from './../img/favicon.png'
import { loadDailyStatsByDate } from './../lib/firebase/firebaseDailyStats'

interface props {
  isGamePlayed: boolean
}

const DailyStats: React.FC<props> = ({ isGamePlayed }) => {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState<boolean>(false)
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] =
    useState<boolean>(false)
  const [gameDate, setGameDate] = useState<Date>(new Date())
  const [gameStatsByDate, setGameStatsByDate] = useState<GameStatsByDate>({
    solution: '',
    winDistribution: [],
    successRate: 0,
    totalGames: 0,
    avgNumGuesses: 0,
  })

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const stats = await loadDailyStatsByDate(gameDate)
      setGameStatsByDate(stats)
      setLoading(false)
    })()
  }, [gameDate])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="Scripturle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="text-l my-8 font-bold dark:text-white sm:text-xl md:text-3xl">
          Today's Stats & Leaderboard
        </h1>
      </div>

      {!user && (
        <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
          <div className="mx-auto my-2 flex items-center justify-center">
            <p className="mr-4 text-sm text-black dark:text-white sm:text-lg">
              Want to see how you compare?
            </p>
            <Link to="/profile" className={buttonClasses}>
              Sign In
            </Link>
          </div>
        </div>
      )}

      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        {!isGamePlayed ? (
          <Link to="/" className={`my-8 ${buttonClasses}`}>
            Play Game
          </Link>
        ) : (
          <div className="mt-8">
            <div
              onClick={() => setIsDatePickerModalOpen(true)}
              className={buttonClasses}
            >
              <ClockIcon className="h-6 w-6 stroke-white" />
              <p className="text-base text-white">
                {format(gameDate, 'MMMM d, yyyy', { locale: DATE_LOCALE })}
              </p>
            </div>

            {gameStatsByDate.solution === '' ? (
              <p className="mt-8 text-gray-900 dark:text-gray-100">
                No stat information is available for the selected date.
              </p>
            ) : (
              <>
                <h1 className="text-l my-8 font-bold dark:text-white sm:text-xl md:text-3xl">
                  {gameStatsByDate.solution}
                </h1>
                <h4 className="mb-4 mt-8 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Stats
                </h4>
                <div className="flex flex-wrap justify-center">
                  <StatItem
                    label={TOTAL_GAMES_TEXT}
                    value={gameStatsByDate.totalGames}
                  />
                  <StatItem
                    label={SUCCESS_RATE_TEXT}
                    value={`${gameStatsByDate.successRate}%`}
                  />
                  <StatItem
                    label={AVG_NUM_GUESSES_TEXT}
                    value={gameStatsByDate.avgNumGuesses}
                  />
                </div>

                <h4 className="mt-8 text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  {GUESS_DISTRIBUTION_TEXT}
                </h4>
                <div className="mx-auto w-4/5 md:w-1/2 2xl:w-1/3">
                  <Histogram
                    isLatestGame={false}
                    winDistribution={gameStatsByDate.winDistribution}
                    isGameWon={true}
                    numberOfGuessesMade={2}
                  />
                </div>
              </>
            )}
            <Link to="/leaderboard" className={`my-8 ${buttonClasses}`}>
              Back
            </Link>
          </div>
        )}
      </div>

      <DatePickerModal
        isOpen={isDatePickerModalOpen}
        initialDate={gameDate}
        handleSelectDate={(d) => {
          setIsDatePickerModalOpen(false)
          setGameDate(d)
        }}
        handleClose={() => setIsDatePickerModalOpen(false)}
      />
    </div>
  )
}

export default DailyStats
