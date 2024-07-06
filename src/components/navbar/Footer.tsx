import { Link } from 'react-router-dom'

import { buttonClasses } from './../../constants/classes'

export const Footer = () => {
  return (
    <div>
      <hr />
      <div className="mx-4 my-4 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <div className="flex items-center justify-center py-4">
          <p className="mr-4 text-sm text-black dark:text-white sm:text-lg">
            Create an account to save your stats!
          </p>
          <Link to="/profile" className={buttonClasses}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
