import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { HistoryModal } from './../components/modals/HistoryModal'
import { buttonClasses } from './../constants/classes'
import { UpdateMetadata } from './../constants/types'
import favicon from './../img/favicon.png'

function UpdateHistory() {
  const defaultUpdate = {
    content: <></>,
    title: '',
    date: '',
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [update, setUpdate] = useState<UpdateMetadata>(defaultUpdate)
  const navigate = useNavigate()
  const buttonEnabledClasses =
    'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'

  const todayStatsUpdate = (
    <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
      <h2 className="my-8 text-xl font-bold dark:text-white md:text-3xl">
        Today's Stats
      </h2>
      <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
        View stats for today's solution once you've also played! Compare the
        number of guesses you needed to everyone else who has played today.
      </p>
      <div className="mx-auto mb-8 w-64">
        <button
          className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          onClick={() => navigate('/leaderboard/today')}
        >
          Today's Stats
        </button>
      </div>
    </div>
  )

  const rebrandUpdate = (
    <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
      <h2 className="my-8 text-xl font-bold dark:text-white md:text-3xl">
        <s>[Redacted Name]</s> becomes Scripturle!
      </h2>
      <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
        Due to some legal advice, [Redacted Name] changed its name and branding
        within a few short weeks of a massive update that brought online
        accounts, groups, and leaderboard functionality to the game.
      </p>
      <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
        Scripturle has continued to grow more and more popular since. We hope
        you continue to share our game and the task of daily Bible trivia with
        others!
      </p>
      <div className="mx-auto mb-8 w-64">
        <button
          className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          onClick={() => navigate('/about')}
        >
          About
        </button>
      </div>
    </div>
  )

  const accountsUpdate = (
    <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
      <h2 className="my-8 text-xl font-bold dark:text-white md:text-3xl">
        Create Your Own <br /> Scripturle Account
      </h2>
      <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
        Keep your stats with you wherever you go. With a new Scripturle account,
        save your stats online and view them on any device.
      </p>
      <div className="mx-auto w-64">
        <button
          className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          onClick={() => navigate('/profile')}
        >
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          Sign in
        </button>
      </div>

      <h2 className="mt-16 text-xl font-bold dark:text-white md:text-3xl">
        Compete Against Others
      </h2>
      <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
        Improve your points by completing each day's game in as few of guesses
        as possible. Track your stats compared to others by viewing the global
        leaderboard!
      </p>
      <div className="mx-auto mb-16 w-64">
        <button
          className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          onClick={() => navigate('/leaderboard')}
        >
          View Leaderboard
        </button>
      </div>

      <h2 className="mt-16 text-xl font-bold dark:text-white md:text-3xl">
        Form New Friend Groups
      </h2>
      <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
        Want to narrow your competitive sights? Form a group of Scripturler's
        and see who knows their Bible the best!
      </p>
      <div className="mx-auto mb-16 w-64">
        <button
          className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          onClick={() => navigate('/groups')}
        >
          View Groups
        </button>
      </div>
    </div>
  )

  const launchUpdate = (
    <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
      <h2 className="my-8 text-xl font-bold dark:text-white md:text-3xl">
        <s>[Redacted Name]</s> goes LIVE!
      </h2>
      <p className="mx-auto my-12 w-4/5 text-base dark:text-white md:text-xl">
        After a semester of hard work, Freed-Hardeman University's senior
        capstone students launched the first version of this game!
      </p>
      <div className="mx-auto mb-8 w-64">
        <button
          className={`${buttonEnabledClasses} group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          onClick={() => navigate('/about')}
        >
          About
        </button>
      </div>
    </div>
  )

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="Scripturle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="mb-8 text-2xl font-bold dark:text-white md:text-3xl">
          Update History
        </h1>
        <p className="mx-auto mb-8 w-4/5 dark:text-white">
          Periodically we update our game by adding new features and
          improvements. A summary of what has been changed is below.
        </p>
      </div>
      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <button
          onClick={() => {
            setUpdate({
              content: todayStatsUpdate,
              title: "Today's Stats Update",
              date: 'July, 2024',
            })
            setIsModalOpen(true)
          }}
          className={`my-8 ${buttonClasses}`}
        >
          July, 2024 - Today's Stats
        </button>

        <hr className="mx-auto w-1/4" />

        <button
          onClick={() => {
            setUpdate({
              content: rebrandUpdate,
              title: 'Rebrand Update',
              date: 'February, 2024',
            })
            setIsModalOpen(true)
          }}
          className={`my-8 ${buttonClasses}`}
        >
          February, 2024 - Rebrand
        </button>

        <hr className="mx-auto w-1/4" />

        <button
          onClick={() => {
            setUpdate({
              content: accountsUpdate,
              title: 'Accounts Update',
              date: 'January, 2024',
            })
            setIsModalOpen(true)
          }}
          className={`my-8 ${buttonClasses}`}
        >
          January, 2024 - Accounts
        </button>

        <hr className="mx-auto w-1/4" />

        <button
          onClick={() => {
            setUpdate({
              content: launchUpdate,
              title: 'Initial Launch',
              date: 'May, 2023',
            })
            setIsModalOpen(true)
          }}
          className={`my-8 ${buttonClasses}`}
        >
          May, 2023 - Initial Launch
        </button>
      </div>

      <HistoryModal
        update={update}
        isOpen={isModalOpen}
        handleClose={() => {
          setUpdate(defaultUpdate)
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default UpdateHistory
