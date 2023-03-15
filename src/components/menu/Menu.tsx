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
    'flex origin-left transform text-xl md:text-2xl font-semibold text-black transition-all delay-100 duration-300 hover:scale-125 hover:text-white dark:text-white hover:dark:text-sky-400'

  return (
    <React.Fragment>
      <div
        ref={ref}
        className={`fixed top-0 left-0 z-10 h-full w-3/4 bg-slate-400 p-10 text-white duration-300 ease-in-out dark:bg-slate-700 md:w-1/2 md:w-2/5 md:pl-20 ${
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
          Play the Game
        </Link>
        <Link
          to="/about"
          className={`mt-8 ${menuItemClasses}`}
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
