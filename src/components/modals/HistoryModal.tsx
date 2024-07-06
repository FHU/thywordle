import { ClockIcon } from '@heroicons/react/outline'

import { UpdateMetadata } from './../../constants/types'
import { BaseModal } from './BaseModal'

type Props = {
  update: UpdateMetadata
  isOpen: boolean
  handleClose: () => void
}

export const HistoryModal = ({ update, isOpen, handleClose }: Props) => {
  return (
    <BaseModal title={update.title} isOpen={isOpen} handleClose={handleClose}>
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
          <div className="mx-auto my-4 flex justify-center">
            <ClockIcon className="h-6 w-6 dark:stroke-white" />
            <p className="text-base dark:text-white">{update.date}</p>
          </div>
          <h1 className="my-4 text-2xl font-bold dark:text-white md:text-3xl">
            {update.title}
          </h1>
        </div>
        {update.content}
      </div>
    </BaseModal>
  )
}
