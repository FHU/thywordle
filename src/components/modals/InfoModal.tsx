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
        Guess the Bible Reference in 6 tries. After each guess, the color of the
        tiles will change to show how close your guess was to the solution.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="J"
          status="correct"
        />
        <Cell value="O" isCompleted={true} />
        <Cell value="H" isCompleted={true} />
        <Cell value="N" isCompleted={true} />
        <Cell value="3" isCompleted={true} />
        <Cell value=":" isCompleted={true} />
        <Cell value="1" isCompleted={true} />
        <Cell value="6" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter J is in the solution and in the correct spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="A" isCompleted={true} />
        <Cell
          isRevealing={true}
          isCompleted={true}
          value="M"
          status="present"
        />
        <Cell value="O" isCompleted={true} />
        <Cell value="S" isCompleted={true} />
        <Cell value="4" isCompleted={true} />
        <Cell value=":" isCompleted={true} />
        <Cell value="0" isCompleted={true} />
        <Cell value="9" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter O is in the solution but in the wrong spot.
      </p>

      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="L" isCompleted={true} />
        <Cell value="U" isCompleted={true} />
        <Cell isRevealing={true} isCompleted={true} value="K" status="absent" />
        <Cell value="E" isCompleted={true} />
        <Cell value="9" isCompleted={true} />
        <Cell value=":" isCompleted={true} />
        <Cell value="2" isCompleted={true} />
        <Cell value="1" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter K is not in the solution.
      </p>
      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="J" isCompleted={true} />
        <Cell value="O" isCompleted={true} />
        <Cell value="B" isCompleted={true} />
        <Cell value="2" isCompleted={true} status="incorrectCharType" />
        <Cell value="3" isCompleted={true} />
        <Cell value=":" isCompleted={true} />
        <Cell value="1" isCompleted={true} />
        <Cell value="6" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 2 is an incorrect character type, try a number or colon.
      </p>
      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="1" isCompleted={true} />
        <Cell value="J" isCompleted={true} />
        <Cell value="O" isCompleted={true} />
        <Cell value="H" isCompleted={true} />
        <Cell value="N" isCompleted={true} />
        <Cell value="1" isCompleted={true} status="low" />
        <Cell value=":" isCompleted={true} />
        <Cell value="6" isCompleted={true} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 1 is too low, try a larger number.
      </p>
      <div className="mb-1 mt-4 flex justify-center">
        <Cell value="J" isCompleted={true} />
        <Cell value="U" isCompleted={true} />
        <Cell value="D" isCompleted={true} />
        <Cell value="E" isCompleted={true} />
        <Cell value="2" isCompleted={true} />
        <Cell value="2" isCompleted={true} status="high" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The number 2 is too high, try a smaller number.
      </p>
    </BaseModal>
  )
}
