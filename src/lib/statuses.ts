import { unicodeSplit } from './words'

export type CharStatus =
  | 'absent'
  | 'present'
  | 'correct'
  | 'incorrectCharType'
  | 'high'
  | 'low'

type CharType = 'letter' | 'number' | 'colon'

export const getStatuses = (
  solution: string,
  guesses: string[]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {}
  const splitSolution = unicodeSplit(solution)

  guesses.forEach((word) => {
    unicodeSplit(word).forEach((letter, i) => {
      if (!splitSolution.includes(letter)) {
        // make status absent
        return (charObj[letter] = 'absent')
      }

      if (letter === splitSolution[i]) {
        //make status correct
        return (charObj[letter] = 'correct')
      }

      if (charObj[letter] !== 'correct') {
        //make status present
        return (charObj[letter] = 'present')
      }
    })
  })

  return charObj
}

export const getGuessStatuses = (
  solution: string,
  guess: string
): CharStatus[] => {
  const splitSolution = unicodeSplit(solution)
  const splitGuess = unicodeSplit(guess)

  const solutionCharsTaken = splitSolution.map((_) => false)

  const splitSolutionCharTypes = splitSolution.map((c) => {
    return getCharType(c)
  })

  const statuses: CharStatus[] = Array.from(Array(guess.length))

  // handle all correct cases first
  splitGuess.forEach((char, i) => {
    if (char === splitSolution[i]) {
      statuses[i] = 'correct'
      solutionCharsTaken[i] = true
      return
    }
  })

  splitGuess.forEach((char, i) => {
    if (statuses[i]) return

    // handle the inchorrectCharType
    if (getCharType(char) !== splitSolutionCharTypes[i]) {
      statuses[i] = 'incorrectCharType'
    }

    if (statuses[i]) return

    // handle the letter type
    if (getCharType(char) === 'letter') {
      if (!splitSolution.includes(char)) {
        // handles the absent case
        statuses[i] = 'absent'
        return
      }

      // now we are left with "present"s
      const indexOfPresentChar = splitSolution.findIndex(
        (x, index) => x === char && !solutionCharsTaken[index]
      )

      if (indexOfPresentChar > -1) {
        statuses[i] = 'present'
        solutionCharsTaken[indexOfPresentChar] = true
        return
      } else {
        statuses[i] = 'absent'
        return
      }
    }

    // handle the number type
    if (
      getCharType(char) === 'number' &&
      splitSolutionCharTypes[i] === 'number'
    ) {
      if (parseInt(char) < parseInt(splitSolution[i])) {
        statuses[i] = 'low'
      }

      if (parseInt(char) > parseInt(splitSolution[i])) {
        statuses[i] = 'high'
      }
    }
  })

  return statuses
}

const getCharType = (char: string): CharType => {
  if (char >= '0' && char <= '9') {
    return 'number'
  }
  if (char === ':') {
    return 'colon'
  }
  return 'letter'
}
