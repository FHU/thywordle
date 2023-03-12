import React from 'react'

interface props {
  showMenu: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export const MenuButton = ({ showMenu, setShowMenu }: props) => {
  return (
    <button
      className={`z-50 mt-2 h-10 w-10 transform rounded-full bg-black p-2 shadow transition-all delay-100 duration-300 hover:scale-150 focus:outline-none lg:h-12 lg:w-12 ${
        showMenu ? 'bg-black' : 'bg-white'
      }`}
      onClick={() => setShowMenu(!showMenu)}
    >
      <div className="absolute left-1/2 top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 transform">
        <span
          className={`absolute top-0 left-0 h-0.5 w-5 transform transition duration-300 ease-in-out ${
            showMenu
              ? 'rotate-45 bg-white delay-200'
              : '-translate-y-1.5 bg-black'
          }`}
        ></span>
        <span
          className={`absolute top-0 left-0 h-0.5 transform transition-all duration-200 ease-in-out ${
            showMenu
              ? 'w-0 bg-white opacity-50'
              : 'w-5 bg-black opacity-100 delay-200'
          }`}
        ></span>
        <span
          className={`absolute top-0 left-0  h-0.5 w-5 transform transition duration-300 ease-in-out ${
            showMenu
              ? '-rotate-45 bg-white delay-200'
              : 'translate-y-1.5 bg-black'
          }`}
        ></span>
      </div>
    </button>
  )
}
