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
  return (
    <BaseModal title="Hint" isOpen={isOpen} handleClose={handleClose}>
      <div className="transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
        <p className="dark:text-white">{verseText}</p>
        <a
          href={referenceUrl}
          className="place-content-center text-center text-black dark:text-white dark:hover:text-neutral-500"
        >
          bible.com
        </a>
        <button
          onClick={() => handleClose()}
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>
      </div>
    </BaseModal>
  )
}
