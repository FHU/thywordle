export const Rows = ({ updateSelectedUser }: any) => {
  // TODO: Pagination of users

  const activeUser = 'Kenan Casey'

  const users = [
    {
      rank: 1,
      name: 'Kenan Casey',
      avgGuesses: 2,
      points: 1000,
      stats: {
        currentStreak: 10,
        bestStreak: 10,
        successRate: 100,
      },
    },
    {
      rank: 2,
      name: 'Dallas Yarnell',
      avgGuesses: 3.5,
      points: 500,
      stats: {
        currentStreak: 7,
        bestStreak: 8,
        successRate: 80,
      },
    },
    {
      rank: 3,
      name: 'Kaden King',
      avgGuesses: 5,
      points: 50,
      stats: {
        currentStreak: 3,
        bestStreak: 5,
        successRate: 60,
      },
    },
  ]

  const tableCellClasses = (user: any) => {
    if (user.name === activeUser) {
      return 'table-cell py-8 bg-indigo-600 text-white text-xl md:text-2xl'
    }

    if (user.rank % 2 === 0) {
      return 'table-cell py-4 bg-gray-200 dark:bg-slate-700'
    }

    return 'table-cell py-4'
  }

  const leaderboardRows = users.map((user) => (
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
  return <div className="table-row-group">{leaderboardRows}</div>
}
