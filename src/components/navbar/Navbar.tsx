import {
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

import { ENABLE_ARCHIVED_GAMES } from '../../constants/settings'
import BellTowerLogo from '../logo/BellTowerLogo'
import ThyWordleLogo from '../logo/ThyWordleLogo'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsDatePickerModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsStatsModalOpen,
  setIsDatePickerModalOpen,
  setIsSettingsModalOpen,
}: Props) => {
  const transitionHoverClasses =
    'origin-center transition delay-100 duration-100 ease-in-out'

  return (
    <div className="navbar">
      <div className="navbar-content px-5">
        <Link to="/about" className="flex justify-start py-4 pr-6 md:w-1/4">
          <BellTowerLogo
            className={`${transitionHoverClasses} -mt-1 h-8 w-auto fill-black hover:scale-125 dark:fill-white md:h-11`}
          />
        </Link>
        <Link
          to="/"
          className="flex grow justify-start md:w-1/2 md:justify-center"
        >
          <ThyWordleLogo
            className={`${transitionHoverClasses} mt-2 -ml-6 h-auto w-40 fill-black hover:scale-110 dark:fill-white md:mx-0 md:w-72`}
          />
        </Link>
        <div className="right-icons space-around mt-2 w-1/2 justify-end md:w-1/4">
          <div className="mr-4 flex flex-row">
            <QuestionMarkCircleIcon
              className="h-5 w-5 cursor-pointer dark:stroke-white md:h-7 md:w-7"
              onClick={() => setIsInfoModalOpen(true)}
            />
            {ENABLE_ARCHIVED_GAMES && (
              <CalendarIcon
                className="ml-4 h-5 w-5 cursor-pointer dark:stroke-white md:h-7 md:w-7"
                onClick={() => setIsDatePickerModalOpen(true)}
              />
            )}
          </div>
          <ChartBarIcon
            className="mr-4 h-5 w-5 cursor-pointer dark:stroke-white md:h-7 md:w-7"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className="h-5 w-5 cursor-pointer dark:stroke-white md:h-7 md:w-7"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
