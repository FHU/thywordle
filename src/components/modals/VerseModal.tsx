import openQuote from '../../img/open-quote.png'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  verseText: string
}

export const VerseModal = ({ isOpen, handleClose, verseText }: Props) => {
  const copiedTextMessage = `Thou shalt not steal nor attempt to cheat at ThyWordle.com`

  return (
    <BaseModal title="Verse" isOpen={isOpen} handleClose={handleClose}>
      <img
        src={openQuote}
        alt=""
        className="absolute left-4 top-8 w-10 md:top-16"
      />
      <div
        className="transform overflow-hidden px-4 pt-5 pb-4 text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle"
        onCopy={(e) => {
          e.preventDefault()
          navigator.clipboard.writeText(copiedTextMessage)
        }}
      >
        <p className="text-center dark:text-white">{verseText}</p>

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
