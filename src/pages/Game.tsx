import './../App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../lib/firebase/firebaseConfig'
import { Grid } from './../components/grid/Grid'
import { Keyboard } from './../components/keyboard/Keyboard'
import { BOOKS } from './../constants/booklist'
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
import { GameStats } from './../constants/types'
import { updateGameStateToFirestore } from './../lib/firebase/firebaseStats'
import { addStatsForCompletedGame } from './../lib/stats'
import {
  findFirstUnusedReveal,
  getCustomSolutionErrorMessage,
  getGameDate,
  isValidReference,
  isWinningWord,
  solution,
  unicodeLength,
} from './../lib/words'

interface props {
  stats: GameStats
  setStats: React.Dispatch<React.SetStateAction<any>>
  isHardMode: boolean
  isAutoFillMode: boolean
  isLatestGame: boolean
  isGameWon: boolean
  setIsGameWon: React.Dispatch<React.SetStateAction<boolean>>
  isGameLost: boolean
  setIsGameLost: React.Dispatch<React.SetStateAction<boolean>>
  guesses: string[]
  setGuesses: React.Dispatch<React.SetStateAction<string[]>>
  showErrorAlert: any
  showSuccessAlert: any
  setIsVerseModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsStatsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Game: React.FC<props> = ({
  stats,
  setStats,
  isHardMode,
  isAutoFillMode,
  isLatestGame,
  isGameWon,
  setIsGameWon,
  isGameLost,
  setIsGameLost,
  guesses,
  setGuesses,
  showErrorAlert,
  showSuccessAlert,
  setIsVerseModalOpen,
  setIsStatsModalOpen,
}) => {
  const gameDate = getGameDate()
  const [user] = useAuthState(auth)
  const [currentGuess, setCurrentGuess] = useState('')
  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)
  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

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

  const verseButtonRef = useRef<HTMLButtonElement>(null)
  const updateStats = async (stats: GameStats, count: number) => {
    setStats(await addStatsForCompletedGame(stats, count, user))
  }

  const revealNextGuess = (guess: string) => {
    if (isAutoFillMode) {
      // eslint-disable-next-line array-callback-return
      BOOKS.some((book) => {
        if (
          solution.startsWith(book) &&
          guess.startsWith(book) &&
          guess !== solution
        ) {
          setCurrentGuess(book)
        }
      })
    }
  }

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

  const onEnter = async () => {
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === solution.length)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    const customSolutionErrorMessage =
      getCustomSolutionErrorMessage(currentGuess)

    if (customSolutionErrorMessage !== null) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(customSolutionErrorMessage, {
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
      revealNextGuess(currentGuess)
    }, REVEAL_TIME_MS * solution.length + 1000)

    const winningWord = isWinningWord(currentGuess)

    if (
      unicodeLength(currentGuess) === solution.length &&
      guesses.length < MAX_CHALLENGES &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess])
      setCurrentGuess('')

      // only save game state for today's game
      if (user && isLatestGame) {
        await updateGameStateToFirestore(user.uid, solution, [
          ...guesses,
          currentGuess,
        ])
      }

      if (winningWord) {
        if (isLatestGame) {
          updateStats(stats, guesses.length)
        }
        return setIsGameWon(true)
      }

      if (guesses.length === MAX_CHALLENGES - 1) {
        if (isLatestGame) {
          updateStats(stats, guesses.length + 1)
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
            {format(gameDate, 'MMMM d, yyyy', { locale: DATE_LOCALE })}
          </p>
        </div>
      )}

      <div className="mx-auto flex w-full grow flex-col px-1 pb-8 pt-2 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
        <div className="flex grow flex-col justify-center pb-6 short:pb-2">
          <Grid
            solution={solution}
            guesses={guesses}
            currentGuess={currentGuess}
            isRevealing={isRevealing}
            currentRowClassName={currentRowClass}
          />
          <button
            onClick={() => {
              setIsVerseModalOpen(true)
              verseButtonRef.current!.blur()
            }}
            type="button"
            ref={verseButtonRef}
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
