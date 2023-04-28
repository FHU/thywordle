import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import React, { useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'

import favicon from './../img/favicon.png'

function AdditionalHelp() {
  const [isOldTestamentBooksOpen, setIsOldTestamentBooksOpen] =
    useState<boolean>(false)
  const [isNewTestamentBooksOpen, setIsNewTestamentBooksOpen] =
    useState<boolean>(false)

  const handleDropdowns = (testament: number) => {
    if (testament === 1) {
      setIsOldTestamentBooksOpen(!isOldTestamentBooksOpen)
      if (!isOldTestamentBooksOpen && isNewTestamentBooksOpen) {
        setIsNewTestamentBooksOpen(false)
      }
    }
    if (testament === 2) {
      setIsNewTestamentBooksOpen(!isNewTestamentBooksOpen)
      if (!isNewTestamentBooksOpen && isOldTestamentBooksOpen) {
        setIsOldTestamentBooksOpen(false)
      }
    }
  }

  const oldTestamentRef = useDetectClickOutside({
    onTriggered: () => setIsOldTestamentBooksOpen(false),
  })

  const newTestamentRef = useDetectClickOutside({
    onTriggered: () => setIsNewTestamentBooksOpen(false),
  })

  const oldTestamentBooks = [
    'GENESIS',
    'EXODUS',
    'LEVITICUS',
    'NUMBERS',
    'DEUTERONOMY',
    'JOSHUA',
    'JUDGES',
    'RUTH',
    '1SAMUEL',
    '2SAMUEL',
    '1KINGS',
    '2KINGS',
    '1CHRONICLES',
    '2CHRONICLES',
    'EZRA',
    'NEHEMIAH',
    'ESTHER',
    'JOB',
    'PSALM',
    'PROVERBS',
    'ECCLESIASTES',
    'SONGOFSOLOMON',
    'ISAIAH',
    'JEREMIAH',
    'LAMENTATIONS',
    'EZEKIEL',
    'DANIEL',
    'HOSEA',
    'JOEL',
    'AMOS',
    'OBADIAH',
    'JONAH',
    'MICAH',
    'NAHUM',
    'HABAKKUK',
    'ZEPHANIAH',
    'HAGGAI',
    'ZECHARIAH',
    'MALACHI',
  ]

  const newTestamentBooks = [
    'MATTHEW',
    'MARK',
    'LUKE',
    'JOHN',
    'ACTS',
    'ROMANS',
    '1CORINTHIANS',
    '2CORINTHIANS',
    'GALATIANS',
    'EPHESIANS',
    'PHILIPPIANS',
    'COLOSSIANS',
    '1THESSALONIANS',
    '2THESSALONIANS',
    '1TIMOTHY',
    '2TIMOTHY',
    'TITUS',
    'PHILEMON',
    'HEBREWS',
    'JAMES',
    '1PETER',
    '2PETER',
    '1JOHN',
    '2JOHN',
    '3JOHN',
    'JUDE',
    'REVELATION',
  ]

  const oldTestamentBookList = oldTestamentBooks.map((book) => (
    <li className="dark:text-white" key={book}>
      {book}
    </li>
  ))
  const newTestamentBookList = newTestamentBooks.map((book) => (
    <li className="dark:text-white" key={book}>
      {book}
    </li>
  ))

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="mb-8 text-2xl font-bold dark:text-white md:text-3xl">
          Additional Help
        </h1>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          ThyWordle uses a familiar color-coded hint sequence for previous
          guesses, with an additional few colors for clarity. For a reminder,
          open the{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            How to Play
          </span>{' '}
          menu by clicking on the{' '}
          <QuestionMarkCircleIcon className="inline-block h-5 w-5 dark:stroke-white md:h-7 md:w-7" />{' '}
          icon in the navbar.
        </p>
      </div>
      <div className="col-span-10 col-start-2 mt-2 mb-16 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <h1 className="my-8 text-2xl font-bold dark:text-white md:text-3xl">
          Valid Guess Syntax
        </h1>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          Guesses in ThyWordle must be valid Bible verses. A valid Bible verse
          includes a{' '}
          <span className="text-indigo-600 dark:text-indigo-400">book</span>,
          (if applicable) a{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            chapter number
          </span>{' '}
          and{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            colon (:)
          </span>
          {', '} and lastly, a{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            verse number
          </span>
          {'.'} Chapter numbers and colons are not necessary when the book only
          has one chapter.
        </p>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          {' '}
          Use the dropdowns below if you need a reminder for any books of the
          Bible or their spelling.
        </p>
        <div className="mx-auto flex justify-between px-4 md:w-1/2">
          <h2
            className={`${
              isOldTestamentBooksOpen
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-black dark:text-white'
            } mb-8 cursor-pointer text-lg font-bold transition-all delay-100 duration-300 hover:scale-105 md:text-2xl`}
            onClick={() => handleDropdowns(1)}
            ref={oldTestamentRef}
          >
            Old Testament Books{' '}
            <ChevronDownIcon
              className={`${
                isOldTestamentBooksOpen
                  ? 'stroke-indigo-600 dark:stroke-indigo-400'
                  : 'stroke-black dark:stroke-white'
              } inline-block h-5 w-5 stroke-black dark:stroke-white md:h-7 md:w-7`}
            />{' '}
          </h2>
          <h2
            className={`${
              isNewTestamentBooksOpen
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-black dark:text-white'
            } mb-8 cursor-pointer text-lg font-bold transition-all delay-100 duration-300 hover:scale-105 md:text-2xl`}
            onClick={() => handleDropdowns(2)}
            ref={newTestamentRef}
          >
            New Testament Books{' '}
            <ChevronDownIcon
              className={`${
                isNewTestamentBooksOpen
                  ? 'stroke-indigo-600 dark:stroke-indigo-400'
                  : 'stroke-black dark:stroke-white'
              } inline-block h-5 w-5 stroke-black dark:stroke-white md:h-7 md:w-7`}
            />{' '}
          </h2>
        </div>
        <div className="mb-8">
          {isOldTestamentBooksOpen && <ul>{oldTestamentBookList}</ul>}
          {isNewTestamentBooksOpen && <ul>{newTestamentBookList}</ul>}
        </div>
      </div>
    </div>
  )
}

export default AdditionalHelp
