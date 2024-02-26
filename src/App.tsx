import './App.css'

import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'

import { AlertContainer } from './components/alerts/AlertContainer'
import Error from './components/gameState/Error'
import Loading from './components/gameState/Loading'
import { Menu } from './components/menu/Menu'
import { DatePickerModal } from './components/modals/DatePickerModal'
import { InfoModal } from './components/modals/InfoModal'
import { MigrateStatsModal } from './components/modals/MigrateStatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { VerseModal } from './components/modals/VerseModal'
import { Footer } from './components/navbar/Footer'
import { Navbar } from './components/navbar/Navbar'
import {
  DISCOURAGE_IN_APP_BROWSERS,
  LONG_ALERT_TIME_MS,
  MAX_CHALLENGES,
  WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_IN_APP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
  SHARE_FAILURE_TEXT,
} from './constants/strings'
import { GameStats } from './constants/types'
import { useAlert } from './context/AlertContext'
import { isInAppBrowser } from './lib/browser'
import { auth } from './lib/firebaseConfig'
import {
  loadGameStateFromFirestore,
  loadStatsFromFirestoreCollection,
  updateGameStateToFirestore,
} from './lib/firebaseStats'
import {
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
  shouldOverrideLocalStorageState,
} from './lib/localStorage'
import { loadStats } from './lib/stats'
import {
  displayReference,
  getIsLatestGame,
  setGameDate,
  solution,
  solutionGameDate,
  verseText,
} from './lib/words'
import About from './pages/About'
import AccountFeature from './pages/AccountFeature'
import Game from './pages/Game'
import GroupCreate from './pages/GroupCreate'
import GroupLeaderboard from './pages/GroupLeaderboard'
import Groups from './pages/Groups'
import Help from './pages/Help'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'

function App() {
  const [user, loading, error] = useAuthState(auth)
  const isLatestGame = getIsLatestGame()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [isGameWon, setIsGameWon] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false)
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState<boolean>(
    getStoredIsHighContrastMode()
  )
  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )
  const [isAutoFillMode, setIsAutoFillMode] = useState(
    localStorage.getItem('autoFillMode')
      ? localStorage.getItem('autoFillMode') === 'true'
      : false
  )
  const [stats, setStats] = useState<GameStats>(() => loadStats())
  const setGameState = (guesses: string[]): string[] => {
    const gameWasWon = guesses.includes(solution)
    if (gameWasWon) {
      setIsGameWon(true)
    }
    if (guesses.length === MAX_CHALLENGES && !gameWasWon) {
      setIsGameLost(true)
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        persist: true,
      })
    }
    return guesses
  }

  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage(isLatestGame)
    if (loaded?.solution !== solution) {
      return []
    }

    const gameState = setGameState(loaded.guesses)
    return gameState
  })

  const loadGameFromFirestore = async (uid: string) => {
    const loadedStats = await loadStatsFromFirestoreCollection(uid)
    if (loadedStats) setStats(loadedStats)

    const loadedStateFromFirestore = await loadGameStateFromFirestore(uid)
    if (!loadedStateFromFirestore) {
      return
    }

    if (shouldOverrideLocalStorageState(loadedStateFromFirestore, solution)) {
      if (guesses.length > loadedStateFromFirestore.guesses.length) {
        // Don't allow extra guesses while signed out => add local guesses to firebase
        await updateGameStateToFirestore(uid, solution, guesses)
      } else {
        // override local stats with firebase stats
        setGuesses(loadedStateFromFirestore.guesses)
        setGameState(loadedStateFromFirestore.guesses)
      }
    } else {
      setGuesses([])
      setGameState([])
    }
  }

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true)) {
      saveGameStateToLocalStorage(getIsLatestGame(), {
        guesses,
        solution,
        date: new Date(),
      })
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  })

  useEffect(() => {
    if (user) loadGameFromFirestore(user.uid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    DISCOURAGE_IN_APP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_IN_APP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (guesses.length === 0 || localStorage.getItem('gameMode') === 'hard') {
      setIsHardMode(isHard)
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE)
    }
  }

  const handleAutoFillMode = (isAutoFill: boolean) => {
    setIsAutoFillMode(isAutoFill)
    localStorage.setItem('autoFillMode', isAutoFill ? 'true' : 'false')
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
  }

  if (loading || error) {
    return (
      <>
        {loading && <Loading />}
        {error && <Error />}
      </>
    )
  }

  return (
    <Router>
      <Div100vh>
        <div className="flex h-full w-full flex-col">
          <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
          <Navbar
            showMenu={showMenu}
            setShowMenu={setShowMenu}
            setIsInfoModalOpen={setIsInfoModalOpen}
            setIsStatsModalOpen={setIsStatsModalOpen}
            setIsDatePickerModalOpen={setIsDatePickerModalOpen}
            setIsSettingsModalOpen={setIsSettingsModalOpen}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Game
                  stats={stats}
                  setStats={setStats}
                  isHardMode={isHardMode}
                  isAutoFillMode={isAutoFillMode}
                  isLatestGame={isLatestGame}
                  isGameWon={isGameWon}
                  setIsGameWon={setIsGameWon}
                  isGameLost={isGameLost}
                  setIsGameLost={setIsGameLost}
                  guesses={guesses}
                  setGuesses={setGuesses}
                  showErrorAlert={showErrorAlert}
                  showSuccessAlert={showSuccessAlert}
                  setIsVerseModalOpen={setIsVerseModalOpen}
                  setIsStatsModalOpen={setIsStatsModalOpen}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route
              path="/profile"
              element={<Profile user={user} stats={stats} />}
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/create" element={<GroupCreate />} />
            <Route path="/groups/:groupName" element={<GroupLeaderboard />} />
            <Route path="/accounts-feature" element={<AccountFeature />} />
            {/* Any other urls redirect to / */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            solution={solution}
            displayReference={displayReference}
            guesses={guesses}
            gameStats={stats}
            isLatestGame={isLatestGame}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
            handleShareFailure={() =>
              showErrorAlert(SHARE_FAILURE_TEXT, {
                durationMs: LONG_ALERT_TIME_MS,
              })
            }
            handleMigrateStatsButton={() => {
              setIsStatsModalOpen(false)
              setIsMigrateStatsModalOpen(true)
            }}
            isHardMode={isHardMode}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            numberOfGuessesMade={guesses.length}
          />
          <DatePickerModal
            isOpen={isDatePickerModalOpen}
            initialDate={solutionGameDate}
            handleSelectDate={(d) => {
              setIsDatePickerModalOpen(false)
              setGameDate(d)
            }}
            handleClose={() => setIsDatePickerModalOpen(false)}
          />
          <MigrateStatsModal
            stats={stats}
            isOpen={isMigrateStatsModalOpen}
            handleClose={() => setIsMigrateStatsModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isAutoFillMode={isAutoFillMode}
            handleAutoFillMode={handleAutoFillMode}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
          />
          <VerseModal
            isOpen={isVerseModalOpen}
            handleClose={() => setIsVerseModalOpen(false)}
            verseText={verseText}
          />
          <AlertContainer />

          {!user && <Footer />}
        </div>
      </Div100vh>
    </Router>
  )
}

export default App
