import classnames from 'classnames'

import { REVEAL_TIME_MS } from '../../constants/settings'
import { getStoredIsHighContrastMode } from '../../lib/localStorage'
import { CharStatus } from '../../lib/statuses'

type Props = {
  solutionLength: number
  value?: string
  status?: CharStatus
  isRevealing?: boolean
  isCompleted?: boolean
  position?: number
}

export const Cell = ({
  solutionLength,
  value,
  status,
  isRevealing,
  isCompleted,
  position = 0,
}: Props) => {
  const isFilled = value && !isCompleted
  const shouldReveal = isRevealing && isCompleted
  const animationDelay = `${position * REVEAL_TIME_MS}ms`
  const isHighContrast = getStoredIsHighContrastMode()

  function getCellSize() {
    if (solutionLength > 10) {
      return 'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-8 h-8 min-w-8 text-l sm:w-10 sm:h-10 sm:text-2xl lg:w-12 lg:h-12 lg:text-3xl'
    }

    return 'xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-14 h-14 text-4xl'
  }

  const classes = classnames(
    `${getCellSize()} border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded dark:text-white`,
    {
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
        !status,
      'border-black dark:border-slate-100': value && !status,
      'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
        status === 'absent',
      'correct shadowed bg-red-500 text-white border-red-500':
        status === 'correct' && isHighContrast,
      'present shadowed bg-cyan-500 text-white border-cyan-500':
        status === 'present' && isHighContrast,
      'correct shadowed bg-green-500 text-white border-green-500':
        status === 'correct' && !isHighContrast,
      'present shadowed bg-yellow-500 text-white border-yellow-500':
        status === 'present' && !isHighContrast,
      'high shadowed bg-red-600 text-white border-red-600':
        status === 'high' && !isHighContrast,
      'high shadowed bg-green-500 text-white border-green-500':
        status === 'high' && isHighContrast,
      'low shadowed bg-sky-600 text-white border-sky-600':
        status === 'low' && !isHighContrast,
      'low shadowed bg-orange-500 text-white border-orange-500':
        status === 'low' && isHighContrast,
      'incorrectCharType shadowed bg-purple-600 text-white border-purple-600':
        status === 'incorrectCharType' && !isHighContrast,
      'incorrectCharType shadowed bg-yellow-400 text-white border-yellow-400':
        status === 'incorrectCharType' && isHighContrast,
      'cell-fill-animation': isFilled,
      'cell-reveal': shouldReveal,
    }
  )

  const getClassByCharType = (char: string | undefined): string => {
    console.log(char)
    if (char) {
      if (char >= 'A' && char <= 'Z') {
        return 'letter-container mt-2'
      }
      if (char >= '0' && char <= '9') {
        return 'letter-container mt-1.5'
      }
    }
    return 'letter-container'
  }

  return (
    <div className={classes} style={{ animationDelay }}>
      <div className={getClassByCharType(value)} style={{ animationDelay }}>
        {value}
      </div>
    </div>
  )
}
