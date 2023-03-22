import { DotsVerticalIcon } from '@heroicons/react/outline'

import { LeaderboardUser, users } from './users'

export const LeaderboardRows = ({ updateSelectedUser }: any) => {
  const tableCellClasses = (user: any) => {
    if (user === activeUser) {
      return 'table-cell py-8 bg-indigo-600 text-white text-xl md:text-2xl'
    }

    if (user.rank % 2 === 0) {
      return 'table-cell py-4 bg-gray-200 dark:bg-slate-700'
    }

    return 'table-cell py-4'
  }

  const getActiveUser = () => {
    return users.find((user) => user.name === 'Kaden King')
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

  const activeUser = getActiveUser()

  if (users.slice(0, 10).includes(activeUser!) || activeUser === null) {
    const usersToDisplay = users.slice(0, 10)
    const displayRows = getLeaderboardRows(usersToDisplay)

    return <div className="table-row-group">{displayRows}</div>
  }

  const surroundingUsers = users.slice(
    activeUser!.rank - 4,
    activeUser!.rank + 3
  )

  const topThreeRows = getLeaderboardRows(users.slice(0, 3))
  const surroundingRows = getLeaderboardRows(surroundingUsers)

  const spacer = (
    <div className="table-row bg-white dark:bg-slate-900">
      <span className="table-cell py-8">
        <DotsVerticalIcon className="mx-auto h-6 w-6 dark:stroke-white" />
      </span>
      <span className="table-cell py-8">
        <DotsVerticalIcon className="mx-auto h-6 w-6 dark:stroke-white" />
      </span>
      <span className="table-cell py-8">
        <DotsVerticalIcon className="mx-auto h-6 w-6 dark:stroke-white" />
      </span>
      <span className="table-cell py-8">
        <DotsVerticalIcon className="mx-auto h-6 w-6 dark:stroke-white" />
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
