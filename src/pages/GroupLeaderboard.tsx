import { useParams } from 'react-router-dom'

import favicon from './../img/favicon.png'

function GroupLeaderboard() {
  const params = useParams()

  // TODO: lookup group by group name and populate page
  // TODO: return group does not exist page if no group found

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="text-l font-bold dark:text-white sm:text-xl md:text-3xl">
          {params.groupName}
        </h1>
        <p className="mx-auto mb-8 mt-4 text-base dark:text-white md:text-xl">
          Group Leaderboard
        </p>
      </div>

      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <p className="my-8 text-lg text-black dark:text-white">
          Please sign or create an account to join a group.
        </p>
      </div>
    </div>
  )
}

export default GroupLeaderboard
