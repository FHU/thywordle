import React from 'react'

function Error() {
  return (
    <React.Fragment>
      <div className="flex h-screen flex-col items-center justify-center">
        <h2 className="text-4xl text-indigo-600 dark:text-white">Sorry</h2>
        <p className="my-5 w-1/2 text-2xl text-indigo-600 dark:text-white">
          We are experiencing an unknown error right now. Please let us know you
          encountered this screen by sending us an email here:
        </p>
        <a
          href="mailto:thywordle@gmail.com"
          target="_blank"
          rel="noreferrer"
          className="my-5 transform text-lg font-semibold text-black transition-all delay-100 duration-300 hover:scale-105 hover:text-indigo-800 dark:text-white hover:dark:text-sky-400 md:text-2xl"
        >
          Send Feedback
        </a>
      </div>
    </React.Fragment>
  )
}

export default Error
