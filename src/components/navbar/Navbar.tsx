import {
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline'

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
        <div className="flex justify-start sm:w-1/4">
          <BellTowerLogo className="-mt-1 h-10 w-auto fill-black dark:fill-white sm:h-11" />
        </div>
        <div className="flex grow justify-start sm:w-1/2 sm:justify-center">
          <ThyWordleLogo className="-ml-8 mt-2 h-36 w-auto fill-black dark:fill-white sm:mx-0 sm:h-56" />
        </div>
        <div className="right-icons space-around mt-2 w-1/4 justify-end">
          <div className="mr-4 flex flex-row">
            <InformationCircleIcon
              className="h-7 w-7 cursor-pointer dark:stroke-white"
              onClick={() => setIsInfoModalOpen(true)}
            />
            {ENABLE_ARCHIVED_GAMES && (
              <CalendarIcon
                className="ml-4 h-7 w-7 cursor-pointer dark:stroke-white"
                onClick={() => setIsDatePickerModalOpen(true)}
              />
            )}
          </div>
          <ChartBarIcon
            className="mr-4 h-7 w-7 cursor-pointer dark:stroke-white"
            onClick={() => setIsStatsModalOpen(true)}
          />
          <CogIcon
            className="h-7 w-7 cursor-pointer dark:stroke-white"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr></hr>
    </div>
  )
}
