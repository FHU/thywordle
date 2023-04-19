import React from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { Link } from 'react-router-dom'

import { MenuButton } from '../navbar/MenuButton'

interface props {
  showMenu: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export const Menu = ({ showMenu, setShowMenu }: props) => {
  const closeMenu = () => {
    if (showMenu) {
      setShowMenu(false)
    }
  }

  const ref = useDetectClickOutside({ onTriggered: closeMenu })
  const menuItemClasses =
    'flex origin-left transform text-lg md:text-2xl font-semibold text-black transition-all delay-100 duration-300 hover:scale-105 hover:text-white dark:text-white hover:dark:text-sky-400'

  return (
    <React.Fragment>
      <div
        ref={ref}
        className={`fixed top-0 left-0 z-10 h-full w-3/4 bg-slate-400 p-8 text-white duration-300 ease-in-out dark:bg-slate-700 md:w-1/2 md:w-1/3 md:pl-8 ${
          showMenu ? 'translate-x-0 ' : '-translate-x-full'
        }`}
      >
        <MenuButton isOpen={true} handleClick={() => setShowMenu(false)} />
        <Link
          to="/"
          className={`mt-10 ${menuItemClasses}`}
          onClick={() => {
            setShowMenu(false)
          }}
        >
          Play
        </Link>
        <Link
          to="/about"
          className={`mt-8 ${menuItemClasses}`}
          onClick={() => {
            setShowMenu(false)
          }}
        >
          About
        </Link>
        <Link
          to="/leaderboard"
          className={`mt-8 ${menuItemClasses}`}
          onClick={() => {
            setShowMenu(false)
          }}
        >
          Leaderboard
        </Link>
        <Link
          to="/profile"
          className={`mt-8 ${menuItemClasses}`}
          onClick={() => {
            setShowMenu(false)
          }}
        >
          Profile
        </Link>
        <Link
          to="mailto:thywordle@gmail.com"
          target="_blank"
          className={
            menuItemClasses +
            ' absolute bottom-0 right-0 py-16 px-8 md:py-8 md:text-lg'
          }
          onClick={() => {
            setShowMenu(false)
          }}
        >
          Send Feedback
        </Link>
      </div>
    </React.Fragment>
  )
}
