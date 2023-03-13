import React from 'react'
import { Link } from 'react-router-dom'

interface props {
  showMenu: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export const Menu = ({ showMenu, setShowMenu }: props) => {
  return (
    <React.Fragment>
      <div
        className={`z-5 fixed top-0 left-0 h-full w-3/4 bg-slate-400 p-10 pl-20 text-white duration-300 ease-in-out dark:bg-slate-700 md:w-1/2 md:w-2/5 ${
          showMenu ? 'translate-x-0 ' : '-translate-x-full'
        }`}
      >
        <Link
          to="/"
          className="mt-20 flex transform items-end text-2xl font-semibold text-black transition-all delay-100 duration-300 hover:scale-105 hover:text-white focus:outline-none dark:text-white hover:dark:text-black"
          onClick={() => {
            setShowMenu(false)
          }}
        >
          Home
        </Link>
        <Link
          to="/about"
          className="mt-5 flex transform items-end text-2xl font-semibold text-black transition-all delay-100 duration-300 hover:scale-105 hover:text-white focus:outline-none dark:text-white hover:dark:text-black"
          onClick={() => {
            setShowMenu(false)
          }}
        >
          About ThyWordle
        </Link>
      </div>
    </React.Fragment>
  )
}