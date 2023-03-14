import React from 'react'

interface props {
  isOpen: boolean
  handleClick: any
}

export const MenuButton = ({ isOpen, handleClick }: props) => {
  return (
    <button
      className={`mt-2 h-10 w-10 transform rounded-full p-2 transition-all delay-100 duration-300 hover:scale-150 focus:outline-none lg:h-12 lg:w-12 ${
        isOpen ? 'bg-black dark:bg-white' : 'bg-white dark:bg-slate-900'
      }`}
      onClick={() => handleClick()}
    >
      <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
        <span
          className={`absolute top-0 left-0 h-0.5 w-5 transform transition duration-300 ease-in-out ${
            isOpen
              ? 'rotate-45 bg-white delay-200 dark:bg-black'
              : '-translate-y-1.5 bg-black dark:bg-white'
          }`}
        ></span>
        <span
          className={`absolute top-0 left-0 h-0.5 transform transition-all duration-200 ease-in-out ${
            isOpen
              ? 'w-0 bg-white opacity-50 dark:bg-black'
              : 'w-5 bg-black opacity-100 delay-200 dark:bg-white'
          }`}
        ></span>
        <span
          className={`absolute top-0 left-0  h-0.5 w-5 transform transition duration-300 ease-in-out ${
            isOpen
              ? '-rotate-45 bg-white delay-200 dark:bg-black'
              : 'translate-y-1.5 bg-black dark:bg-white'
          }`}
        ></span>
      </div>
    </button>
  )
}
