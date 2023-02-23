import { solution } from '../../lib/words'
import { Cell } from './Cell'

type Props = {
  solutionLength: number
}

export const EmptyRow = ({ solutionLength }: Props) => {
  const emptyCells = Array.from(Array(solution.length))

  return (
    <div className="mb-1 flex justify-center">
      {emptyCells.map((_, i) => (
        <Cell key={i} solutionLength={solutionLength} />
      ))}
    </div>
  )
}
