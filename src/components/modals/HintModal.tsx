// import EndQuote from '../../img/EndQuote.png'
// import openQuote from '../../img/OpenQuote.png'
// import quoteOpen from '../../img/quote-close.svg'
// import quoteClose from '../../img/quote-close.svg'
// import { referenceUrl } from '../../lib/words'
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
      <div className="transform overflow-hidden px-4 pt-5 pb-4 text-left align-bottom transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-md sm:p-6 sm:align-middle">
        <svg
          viewBox="0 0 800 800"
          className="light:text-black absolute top-0 left-0 h-8 w-8 fill-current opacity-30 dark:text-white"
        >
          <path d="M587.3 664c64.4 0 116.6-53.7 116.6-120 0-66.2-52.2-120-116.6-120-116.6 0-38.9-232 116.6-232v-56c-277.5 0-386.2 528-116.6 528zm-336 0c64.4 0 116.6-53.7 116.6-120 0-66.2-52.2-120-116.6-120-116.6 0-38.9-232 116.6-232v-56C90.4 136-18.3 664 251.3 664z" />
        </svg>
        {/* <img
          src={quoteClose}
          className="color-white absolute top-0 left-0 w-8 opacity-50"
        /> */}
        <p className="z-10 text-center dark:text-white">{verseText}</p>
        <button
          onClick={() => handleClose()}
          tabIndex={0}
          aria-pressed="false"
          className="absolute right-4 top-4"
        ></button>

        <svg
          viewBox="0 0 20 20"
          className="light:text-black absolute bottom-0 right-4 h-8 w-8 fill-current opacity-30 dark:text-white"
        >
          <path d="M5.315 3.401c-1.61 0-2.916 1.343-2.916 3 0 1.656 1.306 3 2.916 3 2.915 0 .972 5.799-2.916 5.799v1.4c6.939.001 9.658-13.199 2.916-13.199zm8.4 0c-1.609 0-2.915 1.343-2.915 3 0 1.656 1.306 3 2.915 3 2.916 0 .973 5.799-2.915 5.799v1.4c6.938.001 9.657-13.199 2.915-13.199z" />
        </svg>

        {/* <img src={EndQuote} className="absolute bottom-0 right-4 w-4" /> */}
      </div>
    </BaseModal>
  )
}
