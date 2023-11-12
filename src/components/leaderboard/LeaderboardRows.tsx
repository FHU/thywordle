import { DotsVerticalIcon } from '@heroicons/react/outline'

import { LeaderboardUser } from './../../constants/types'

interface Props {
  users: LeaderboardUser[] | undefined
  updateSelectedUser: any
}

export const LeaderboardRows = ({ users, updateSelectedUser }: Props) => {
  const tableCellClasses = (user: any) => {
    if (user.highlightedUser) {
      return 'table-cell py-8 bg-indigo-600 text-white text-xl md:text-2xl'
    }

    if (user.rank % 2 === 0) {
      return 'table-cell py-4 bg-gray-200 dark:bg-slate-700'
    }

    return 'table-cell py-4'
  }

  const getLeaderboardRows = (usersList: LeaderboardUser[]) => {
    if (!usersList) {
      return <></>
    }

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

  let leaderboardRows
  let topThreeRows
  let surroundingRows

  if (users) {
    if (users.length <= 20) {
      leaderboardRows = getLeaderboardRows(users)
      return <div className="table-row-group">{leaderboardRows}</div>
    }

    if (users.slice(0, 20).some((u) => u.highlightedUser)) {
      leaderboardRows = getLeaderboardRows(users.slice(0, 20))
      return <div className="table-row-group">{leaderboardRows}</div>
    }

    const highlightedUserRank = users.findIndex((u) => u.highlightedUser) + 1
    const surroundingUsers = users.slice(
      highlightedUserRank - 4,
      highlightedUserRank + 3
    )

    topThreeRows = getLeaderboardRows(users.slice(0, 3))
    surroundingRows = getLeaderboardRows(surroundingUsers)

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

  return <></>
}
