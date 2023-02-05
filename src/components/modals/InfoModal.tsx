import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        Guess the word in 6 tries. After each guess, the color of the tiles will
        change to show how close your guess was to the word.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="W"
          status="correct"
        />
        <Cell value="E" isCompleted={true} />
        <Cell value="A" isCompleted={true} />
        <Cell value="R" isCompleted={true} />
        <Cell value="Y" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter W is in the word and in the correct spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="P" isCompleted={true} />
        <Cell value="I" isCompleted={true} />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="L"
          status="present"
        />
        <Cell value="O" isCompleted={true} />
        <Cell value="T" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter L is in the word but in the wrong spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="V" isCompleted={true} />
        <Cell value="A" isCompleted={true} />
        <Cell value="G" isCompleted={true} />
        <Cell isRevealing={true} isCompleted={true} value="U" status="absent" />
        <Cell value="E" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter U is not in the word in any spot.
      </p>
      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="D" isCompleted={true} />
        <Cell value="R" isCompleted={true} />
        <Cell value="E" isCompleted={true} />
        <Cell isCompleted={true} value="A" />
        <Cell
          value="M"
          isRevealing={true}
          isCompleted={true}
          status="wrongChar"
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter M is an incorrect character type, try a number or colon.
      </p>
      <div className="mb-1 mt-4 flex justify-center">
        <Cell isCompleted={true} value="2" />
        <Cell value="1" isRevealing={true} isCompleted={true} status="low" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 1 is too low, try a larger number.
      </p>
      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="3" isCompleted={true} status="high" />
        <Cell isCompleted={true} value="2" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 3 is too high, try a smaller number.
      </p>
      <p className="mt-6 text-sm italic text-gray-500 dark:text-gray-300">
        This is an open source version of the word guessing game we all know and
        love -{' '}
        <a
          href="https://github.com/cwackerfuss/react-wordle"
          className="font-bold underline"
        >
          check out the code here
        </a>{' '}
      </p>
    </BaseModal>
  )
}
