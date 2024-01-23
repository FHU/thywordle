import { ChevronDownIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import { Cell } from '../components/grid/Cell'
import favicon from './../img/favicon.png'

function Help() {
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
        <p className="mx-auto my-8 w-4/5 text-base dark:text-white md:text-xl">
          ThyWordle uses a familiar color-coded hint sequence for previous
          guesses, with an additional few colors for clarity.{' '}
        </p>
        <table className="mx-auto mb-8 w-4/5 max-w-xl table-auto border-spacing-0 text-left dark:text-white">
          <thead className="font-bold">
            <td className="border border-slate-600 p-4">Color</td>
            <td className="border border-slate-600 p-4">Meaning</td>
          </thead>
          <tr className="border border-slate-600">
            <td className="flex justify-center border-none border-slate-600 p-4">
              <Cell
                isRevealing={true}
                isCompleted={true}
                value="J"
                status="correct"
                position={0}
                solutionLength={8}
              />
            </td>
            <td className="border border-slate-600 p-4">
              <p>Correct Letter, Correct Spot</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                The letter J is in the solution and in the correct spot.
              </p>
            </td>
          </tr>
          <tr className="border border-slate-600 ">
            <td className="flex justify-center border-none border-slate-600 p-4">
              <Cell
                isRevealing={true}
                isCompleted={true}
                value="M"
                status="present"
                position={1}
                solutionLength={8}
              />
            </td>
            <td className="border border-slate-600 p-4">
              <p>Correct Letter, Wrong Spot</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                The letter M is in the solution but in the wrong spot.
              </p>
            </td>
          </tr>

          <tr className="border border-slate-600 ">
            <td className="flex justify-center border-none border-slate-600 p-4">
              <Cell
                isRevealing={true}
                isCompleted={true}
                value="K"
                status="absent"
                position={2}
                solutionLength={8}
              />
            </td>
            <td className="border border-slate-600 p-4">
              <p>Incorrect Letter</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                The letter K is not in the solution.
              </p>
            </td>
          </tr>

          <tr className="border border-slate-600 ">
            <td className="flex justify-center border-none border-slate-600 p-4">
              <Cell
                isRevealing={true}
                isCompleted={true}
                value="2"
                status="incorrectCharType"
                position={3}
                solutionLength={8}
              />
            </td>
            <td className="border border-slate-600 p-4">
              <p>Incorrect Character Type</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                The number 2 is an incorrect character type; Try a colon or a
                letter.
              </p>
            </td>
          </tr>

          <tr className="border border-slate-600 p-4">
            <td className="flex justify-center border-none border-slate-600 p-4">
              <Cell
                isRevealing={true}
                isCompleted={true}
                value="P"
                status="incorrectCharType"
                position={3}
                solutionLength={8}
              />
            </td>
            <td className="border border-slate-600 p-4">
              <p>Incorrect Character Type</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                The letter P is an incorrect character type; Try a colon or a
                number.
              </p>
            </td>
          </tr>

          <tr className="border border-slate-600 ">
            <td className="flex justify-center border-none border-slate-600 p-4">
              <Cell
                isRevealing={true}
                isCompleted={true}
                value="1"
                status="low"
                position={4}
                solutionLength={8}
              />
            </td>
            <td className="border border-slate-600 p-4">
              <p>Number Too Low</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                The number 1 is lower than the solution's number.
              </p>
            </td>
          </tr>

          <tr className="border border-slate-600 ">
            <td className="flex justify-center border-none border-slate-600 p-4">
              <Cell
                isRevealing={true}
                isCompleted={true}
                value="9"
                status="high"
                position={5}
                solutionLength={8}
              />
            </td>
            <td className="border border-slate-600 p-4">
              <p>Number Too High</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                The number 9 is bigger than the solution's number.
              </p>
            </td>
          </tr>
        </table>
      </div>
      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-left dark:bg-slate-800">
        <h1 className="my-8 text-center text-2xl font-bold dark:text-white md:text-3xl">
          Valid Guess Syntax
        </h1>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          Guesses in ThyWordle must be valid Bible verses without spaces. A
          valid Bible verse includes a{' '}
          <span className="text-indigo-600 dark:text-indigo-400">book</span>, a{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            chapter number
          </span>{' '}
          and{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            colon (:)
          </span>{' '}
          (if applicable)
          {', '} and lastly, a{' '}
          <span className="text-indigo-600 dark:text-indigo-400">
            verse number
          </span>
          .
        </p>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          Examples: "
          <span className="text-indigo-600 dark:text-indigo-400">
            GENESIS24:12
          </span>
          " , "
          <span className="text-indigo-600 dark:text-indigo-400">
            2CORINTHIANS6:1
          </span>
          " , "
          <span className="text-indigo-600 dark:text-indigo-400">OBADIAH5</span>
          "
        </p>
        <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
          Chapter numbers and colons are not necessary (or allowed) when the
          book only has one chapter, for example, "
          <span className="text-indigo-600 dark:text-indigo-400">3JOHN4</span>"
          (not "
          <s className="text-indigo-600 dark:text-indigo-400"> 3 JOHN 1:4 </s>"
          ).
        </p>
        <p className="mx-auto my-12 w-4/5 text-center text-base dark:text-white md:text-xl">
          {' '}
          Use the dropdowns below to see a list of book names.
        </p>
        <div className="mx-auto flex flex-col px-4 text-center md:w-2/3">
          <h2
            className={`${
              isOldTestamentBooksOpen
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-black dark:text-white'
            } mb-8 cursor-pointer text-lg font-bold transition-all delay-100 duration-300 hover:scale-105 md:text-2xl`}
            onClick={() => handleDropdowns(1)}
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
          <div className="text-center">
            {isOldTestamentBooksOpen && (
              <ul className="mb-8">{oldTestamentBookList}</ul>
            )}
          </div>
          <h2
            className={`${
              isNewTestamentBooksOpen
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-black dark:text-white'
            } mb-8 cursor-pointer text-lg font-bold transition-all delay-100 duration-300 hover:scale-105 md:text-2xl`}
            onClick={() => handleDropdowns(2)}
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
          <div className="text-center">
            {isNewTestamentBooksOpen && (
              <ul className="mb-8">{newTestamentBookList}</ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help
