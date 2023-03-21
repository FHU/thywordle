import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import React from 'react'

import Rows from './../components/leaderboard/Rows'
import favicon from './../img/favicon.png'

function Leaderboard() {
  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="mb-8 text-2xl font-bold dark:text-white md:text-3xl">
          Leaderboard
        </h1>
      </div>

      <div className="col-span-10 col-start-2 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <div className="table w-full border-collapse">
          <div className="table-header-group rounded-xl bg-gray-300 dark:bg-slate-700">
            <div className="text-md table-row font-semibold text-black dark:text-white md:text-2xl">
              <div className="table-cell border-b border-black py-8 pl-2 text-center dark:border-white">
                Rank
              </div>
              <div className="table-cell border-b border-black py-8 text-center dark:border-white">
                User
              </div>
              <div className="table-cell border-b border-black py-8 text-center dark:border-white">
                Avg Guesses
              </div>
              <div className="table-cell border-b border-black py-8 dark:border-white">
                <div className="flex flex-none justify-center">
                  <span className="mr-1">Points</span>
                  <QuestionMarkCircleIcon className="h-5 w-5 cursor-pointer dark:stroke-white md:h-7 md:w-7" />
                </div>
              </div>
            </div>
          </div>
          <Rows />
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
