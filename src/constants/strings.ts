export const GAME_TITLE = process.env.REACT_APP_GAME_NAME!

export const WIN_MESSAGES = ['Great Job!', 'Awesome', 'Well done!']
export const GAME_COPIED_MESSAGE = 'Game copied to clipboard'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Not enough letters'
export const INVALID_REFERENCE_MESSAGE = 'Must guess a valid Bible reference'
export const HARD_MODE_ALERT_MESSAGE =
  'Hard Mode can be enabled only at the start!'
export const HARD_MODE_DESCRIPTION =
  'Any revealed hints must be used in subsequent guesses'
export const AUTO_FILL_MODE_DESCRIPTION =
  'Auto-complete correct book names in subsequent guesses'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'For improved color vision'
export const CORRECT_WORD_MESSAGE = (solution: string) =>
  `The word was ${solution}`
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `Must use ${guess} in position ${position}`
export const NOT_CONTAINED_MESSAGE = (letter: string) =>
  `Guess must contain ${letter}`
export const ENTER_TEXT = 'Enter'
export const DELETE_TEXT = 'Delete'
export const STATISTICS_TITLE = 'Statistics'
export const GUESS_DISTRIBUTION_TEXT = 'Guess Distribution'
export const NEW_WORD_TEXT = 'New game in'
export const SHARE_TEXT = 'Share'
export const SHARE_FAILURE_TEXT =
  'Unable to share the results. This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.'
export const MIGRATE_BUTTON_TEXT = 'Transfer'
export const MIGRATE_DESCRIPTION_TEXT =
  'Transfer your local browser statistics to a new device.'
export const TOTAL_GAMES_TEXT = 'Total Games'
export const SUCCESS_RATE_TEXT = 'Success Rate'
export const CURRENT_STREAK_TEXT = 'Current Streak'
export const BEST_STREAK_TEXT = 'Best Streak'
export const AVG_NUM_GUESSES_TEXT = 'Average Number of Guesses'
export const POINTS_TEXT = 'Total Points'
export const DISCOURAGE_IN_APP_BROWSER_TEXT =
  "You are using an embedded browser and may experience problems sharing or saving your results. We encourage you rather to use your device's default browser."
export const UPDATE_TEXT =
  "NEW! View global stats for today's solution. Click HERE to learn more!"

export const DATEPICKER_TITLE = 'Choose a past date'
export const DATEPICKER_CHOOSE_TEXT = 'Choose'
export const DATEPICKER_TODAY_TEXT = 'today'
export const ARCHIVE_GAME_DATE_TEXT = 'Game date'

export const VERSE_TEXT_BUTTON = 'Read'
