export default function Rows() {
  const activeUser = 'Kenan Casey'

  const users = [
    {
      rank: 1,
      name: 'Kenan Casey',
      avgGuesses: 2,
      points: 1000,
    },
    {
      rank: 2,
      name: 'Dallas Yarnell',
      avgGuesses: 3.5,
      points: 500,
    },
    {
      rank: 3,
      name: 'Kaden King',
      avgGuesses: 5,
      points: 0,
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
      className="text-md table-row text-black dark:text-white md:text-lg"
    >
      <div className={tableCellClasses(user)}>{user.rank}</div>
      <div className={tableCellClasses(user)}>{user.name}</div>
      <div className={tableCellClasses(user)}>{user.avgGuesses}</div>
      <div className={tableCellClasses(user)}>{user.points}</div>
    </div>
  ))
  return <div className="table-row-group">{leaderboardRows}</div>
}
