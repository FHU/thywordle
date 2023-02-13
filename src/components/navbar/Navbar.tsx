import {
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
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
  return (
    <div className="navbar">
      <div className="navbar-content px-5 short:h-auto">
        <div className="flex justify-start md:w-1/4">
          <Link to="/about">
            <BellTowerLogo className="-mt-1 mr-6 h-10 w-auto fill-black dark:fill-white md:h-11" />
          </Link>
        </div>
        <div className="flex grow justify-start md:w-1/2 md:justify-center">
          <Link to="/">
            <ThyWordleLogo className="-ml-8 mt-2 h-40 w-auto fill-black dark:fill-white md:mx-0 md:h-56" />
          </Link>
        </div>
        <div className="right-icons space-around mt-2 w-1/2 justify-end md:w-1/4">
          <div className="mr-4 flex flex-row">
            <InformationCircleIcon
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
