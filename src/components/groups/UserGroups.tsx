import React from 'react'
import { Link } from 'react-router-dom'

import { getCleanedGroupName } from './../../lib/firebase'

interface props {
  groups: string[]
}

export const UserGroups: React.FC<props> = ({ groups }) => {
  const tableCellClasses = (index: number) => {
    if (index % 2 === 0) {
      return 'table-cell p-4 bg-gray-200 dark:bg-slate-700'
    }

    return 'table-cell p-4'
  }

  const userGroups = groups.map((group, index) => (
    <div
      key={index}
      className="text-md table-row cursor-pointer text-black dark:text-white md:text-lg"
    >
      <div className={tableCellClasses(index)}>{index + 1}</div>
      <div className={tableCellClasses(index)}>{group}</div>
      <div className={tableCellClasses(index)}>
        <Link
          to={`/groups/${getCleanedGroupName(group)}`}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
        >
          View
        </Link>
      </div>
    </div>
  ))

  return (
    <div className="table w-full table-fixed border-collapse border-y border-indigo-400">
      {userGroups}
    </div>
  )
}
