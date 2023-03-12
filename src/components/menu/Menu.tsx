import React from 'react'

interface props {
  showMenu: boolean
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export const Menu = ({ showMenu, setShowMenu }: props) => {
  return (
    <React.Fragment>
      {showMenu && (
        <div
          className={`fixed top-0 left-0 z-40 h-full w-[35vw] bg-blue-600 p-10 pl-20 text-white transition-all duration-300 ease-in-out ${
            showMenu ? 'translate-x-0 ' : 'translate-x-full'
          }`}
        >
          <h2 className="mt-20 text-4xl font-semibold text-white">
            I am a sidebar
          </h2>
        </div>
      )}
    </React.Fragment>
  )
}
