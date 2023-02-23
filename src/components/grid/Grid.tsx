import { MAX_CHALLENGES } from '../../constants/settings'
import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  solution: string
  guesses: string[]
  currentGuess: string
  isRevealing?: boolean
  currentRowClassName: string
}

export const Grid = ({
  solution,
  guesses,
  currentGuess,
  isRevealing,
  currentRowClassName,
}: Props) => {
  const empties =
    guesses.length < MAX_CHALLENGES - 1
      ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
      : []

  const solutionLength = solution.length

  return (
    <>
      {guesses.map((guess, i) => (
        <CompletedRow
          key={i}
          solutionLength={solutionLength}
          solution={solution}
          guess={guess}
          isRevealing={isRevealing && guesses.length - 1 === i}
        />
      ))}
      {guesses.length < MAX_CHALLENGES && (
        <CurrentRow
          guess={currentGuess}
          className={currentRowClassName}
          solutionLength={solutionLength}
        />
      )}
      {empties.map((_, i) => (
        <EmptyRow key={i} solutionLength={solutionLength} />
      ))}
    </>
  )
}
