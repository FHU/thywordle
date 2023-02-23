import { getGuessStatuses } from '../../lib/statuses'
import { unicodeSplit } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solutionLength: number
  solution: string
  guess: string
  isRevealing?: boolean
}

export const CompletedRow = ({
  solutionLength,
  solution,
  guess,
  isRevealing,
}: Props) => {
  const statuses = getGuessStatuses(solution, guess)
  const splitGuess = unicodeSplit(guess)

  return (
    <div className="mb-1 flex max-w-full justify-center overflow-x-hidden">
      {splitGuess.map((letter, i) => (
        <Cell
          key={i}
          solutionLength={solutionLength}
          value={letter}
          status={statuses[i]}
          position={i}
          isRevealing={isRevealing}
          isCompleted
        />
      ))}
    </div>
  )
}
