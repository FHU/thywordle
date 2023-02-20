import { useState } from 'react'

import { referenceUrl } from '../../lib/words'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  verseText: string
  referenceUrl: string
}

export const HintModal = ({ isOpen, handleClose, verseText }: Props) => {
  const [hintModal, openHintModal] = useState(false)

  const toggleHintModal = () => {
    openHintModal(!hintModal)
  }
  return (
    <BaseModal title="Hint" isOpen={isOpen} handleClose={handleClose}>
      <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
        <button
          onClick={() => handleClose()}
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
      <div className="mt-2 flex flex-col divide-y">
        <p>{verseText}</p>
        <a
          href={referenceUrl}
          className="text-center text-black dark:text-white"
        >
          bible.com
        </a>
      </div>
    </BaseModal>
  )
}
