import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { UPDATE_TEXT } from './../../constants/strings'

type props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  message: string
  variant?: 'success' | 'error'
  topMost?: boolean
}

export const Alert = ({
  isOpen,
  setIsOpen,
  message,
  variant = 'error',
  topMost = false,
}: props) => {
  const navigate = useNavigate()

  const isClickable = (): boolean => {
    return message === UPDATE_TEXT
  }

  const handleClick = () => {
    if (isClickable()) {
      setIsOpen(false)
      navigate('/update-history')
    }
  }

  const classes = classNames(
    `fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${
      isClickable() && 'cursor-pointer'
    }`,
    {
      'bg-rose-500 text-white': variant === 'error',
      'bg-blue-500 text-white': variant === 'success',
    }
  )

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="ease-out duration-300 transition"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={classes} onClick={handleClick}>
        <div className="p-2">
          <p className="text-center text-sm font-medium">{message}</p>
        </div>
      </div>
    </Transition>
  )
}
