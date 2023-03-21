import { DotsVerticalIcon } from '@heroicons/react/outline'

import { LeaderboardUser, users } from './users'

export const Rows = ({ updateSelectedUser }: any) => {
  const getActiveUser = () => {
    return users.find((user) => user.name === 'Kaden King')
  }

  const activeUser = getActiveUser()
  const topThreeUsers = users.slice(0, 3)
  const surroundingUsers = users.slice(
    activeUser!.rank - 4,
    activeUser!.rank + 3
  )

  const tableCellClasses = (user: any) => {
    if (user === activeUser) {
      return 'table-cell py-8 bg-indigo-600 text-white text-xl md:text-2xl'
    }

    if (user.rank % 2 === 0) {
      return 'table-cell py-4 bg-gray-200 dark:bg-slate-700'
    }

    return 'table-cell py-4'
  }

  const getLeaderboardRows = (usersList: LeaderboardUser[]) => {
    return usersList.map((user) => (
      <div
        key={user.rank}
        className="text-md table-row cursor-pointer text-black dark:text-white md:text-lg"
        onClick={() => updateSelectedUser(user)}
      >
        <div className={tableCellClasses(user)}>{user.rank}</div>
        <div className={tableCellClasses(user)}>{user.name}</div>
        <div className={tableCellClasses(user)}>{user.avgGuesses}</div>
        <div className={tableCellClasses(user)}>{user.points}</div>
      </div>
    ))
  }

  const topThreeRows = getLeaderboardRows(topThreeUsers)
  const surroundingRows = getLeaderboardRows(surroundingUsers)

  const spacer = (
    <div className="table-row">
      <span className="table-cell py-8">
        <DotsVerticalIcon className="mx-auto h-8 w-8 dark:stroke-white" />
      </span>
      <span className="table-cell"></span>
      <span className="table-cell"></span>
      <span className="table-cell py-8">
        <DotsVerticalIcon className="mx-auto h-8 w-8 dark:stroke-white" />
      </span>
    </div>
  )

  return (
    <div className="table-row-group">
      {topThreeRows}
      {spacer}
      {surroundingRows}
    </div>
  )
}
