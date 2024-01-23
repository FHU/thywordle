import {
  ChevronDoubleRightIcon,
  GlobeIcon,
  InformationCircleIcon,
  MailIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/outline'
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
        className={`fixed left-0 top-0 z-10 h-full w-3/4 bg-indigo-100 p-8 text-white duration-300 ease-in-out dark:bg-slate-700 md:w-1/3 md:pl-8 ${
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
          <ChevronDoubleRightIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
          Play
        </Link>

        <Link
          to="/leaderboard"
          className={`mt-8 ${menuItemClasses}`}
          onClick={() => {
            setShowMenu(false)
          }}
        >
          <GlobeIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
          Leaderboard
        </Link>
        <Link
          to="/groups"
          className={`mt-8 ${menuItemClasses}`}
          onClick={() => {
            setShowMenu(false)
          }}
        >
          <UserGroupIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
          Groups
        </Link>

        <Link
          to="/profile"
          className={`mt-8 ${menuItemClasses}`}
          onClick={() => {
            setShowMenu(false)
          }}
        >
          <UserIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
          Profile
        </Link>

        <div className="mt-16  opacity-90">
          <Link
            to="/about"
            className={`mt-8 ${menuItemClasses} text-base font-normal`}
            onClick={() => {
              setShowMenu(false)
            }}
          >
            <InformationCircleIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
            About
          </Link>
          <Link
            to="/help"
            className={`mt-8 ${menuItemClasses} text-base font-normal`}
            onClick={() => {
              setShowMenu(false)
            }}
          >
            <QuestionMarkCircleIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />{' '}
            Help
          </Link>
        </div>

        <Link
          to="mailto:thywordle@gmail.com"
          target="_blank"
          className={
            menuItemClasses +
            ' absolute bottom-0 right-0 px-8 py-8 font-normal md:text-sm'
          }
          onClick={() => {
            setShowMenu(false)
          }}
        >
          <MailIcon className="mr-2 mt-0 h-4 w-4 cursor-pointer  dark:stroke-white" />{' '}
          Send Feedback
        </Link>
      </div>
    </React.Fragment>
  )
}
