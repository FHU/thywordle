import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <div>
      <hr />
      <div className="mx-4 my-4 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <div className="flex items-center justify-center py-4">
          <p className="mr-4 text-sm text-black dark:text-white sm:text-lg">
            Create an account to save your stats!
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
