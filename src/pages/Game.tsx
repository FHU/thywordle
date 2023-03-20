import './../App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'

import { Grid } from './../components/grid/Grid'
import { Keyboard } from './../components/keyboard/Keyboard'
import {
  DATE_LOCALE,
  MAX_CHALLENGES,
  REVEAL_TIME_MS,
} from './../constants/settings'
import {
  CORRECT_WORD_MESSAGE,
  INVALID_REFERENCE_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WIN_MESSAGES,
} from './../constants/strings'
import { saveGameStateToLocalStorage } from './../lib/localStorage'
import { addStatsForCompletedGame } from './../lib/stats'
import {
  findFirstUnusedReveal,
  getGameDate,
  getIsLatestGame,
  isValidReference,
  isWinningWord,
  solution,
  unicodeLength,
} from './../lib/words'

interface props {
  stats: any
  setStats: React.Dispatch<React.SetStateAction<any>>
  setIsStatsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isHardMode: boolean
  isLatestGame: boolean
  isGameWon: boolean
  setIsGameWon: React.Dispatch<React.SetStateAction<boolean>>
  isGameLost: boolean
  setIsGameLost: React.Dispatch<React.SetStateAction<boolean>>
  guesses: string[]
  setGuesses: React.Dispatch<React.SetStateAction<string[]>>
  showSuccessAlert: any
  showErrorAlert: any
  setIsVerseModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Game: React.FC<props> = ({
  stats,
  setStats,
  setIsStatsModalOpen,
  isHardMode,
  isLatestGame,
  isGameWon,
  setIsGameWon,
  isGameLost,
  setIsGameLost,
  guesses,
  setGuesses,
  showSuccessAlert,
  showErrorAlert,
  setIsVerseModalOpen,
}) => {
  const gameDate = getGameDate()
  const [currentGuess, setCurrentGuess] = useState('')
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)
  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage(getIsLatestGame(), { guesses, solution })
  }, [guesses])

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * solution.length

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, (solution.length + 1) * REVEAL_TIME_MS)
    }
  }, [isGameWon, isGameLost, showSuccessAlert, setIsStatsModalOpen])

  const onChar = (value: string) => {
    if (!isGameWon || !isGameLost) {
      if (
        unicodeLength(`${currentGuess}${value}`) <= solution.length &&
        guesses.length < MAX_CHALLENGES &&
        !isGameWon
      ) {
        setCurrentGuess(`${currentGuess}${value}`)
      }
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isValidReference(currentGuess)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(INVALID_REFERENCE_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(currentGuess, guesses)
      if (firstMissingReveal) {
        setCurrentRowClass('jiggle')
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        })
      }
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
    }, REVEAL_TIME_MS * solution.length)

    const winningWord = isWinningWord(currentGuess)

    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      if (winningWord) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length))
        }
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        }
        setIsGameLost(true)
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          persist: true,
          delayMs: REVEAL_TIME_MS * solution.length + 1,
        })
      }
    }
  }

  return (
    <div className="flex h-full flex-col">
      {!isLatestGame && (
        <div className="flex items-center justify-center">
          <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
          <p className="text-base text-gray-600 dark:text-gray-300">
            {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
          </p>
        </div>
      )}

      <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
        <div className="flex grow flex-col justify-center pb-6 short:pb-2">
          <Grid
            solution={solution}
            guesses={guesses}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
            currentRowClassName={currentRowClass}
          />
          <button
            onClick={() => setIsVerseModalOpen(true)}
            type="button"
            className={`mx-auto mt-2 inline-flex w-32 items-center justify-center rounded-md border-2 border-slate-200 px-3 py-1.5 text-center align-middle text-sm font-medium shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:border-gray-200 disabled:bg-gray-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-700 sm:text-base`}
          >
            Read Verse
          </button>
        </div>
        <Keyboard
          onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          solution={solution}
          guesses={guesses}
          isRevealing={isRevealing}
        />
      </div>
    </div>
  )
}

export default Game
