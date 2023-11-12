import Lottie from 'lottie-react'
import React from 'react'

import loading from './../../img/loading.json'

function Loading() {
  return (
    <React.Fragment>
      <div className="flex h-screen flex-col items-center justify-center">
        <Lottie animationData={loading} loop={true} className="w-96" />
        <h2 className="text-4xl text-indigo-600 dark:text-white">Loading...</h2>
      </div>
    </React.Fragment>
  )
}

export default Loading
