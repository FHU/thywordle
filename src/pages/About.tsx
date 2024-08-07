import { Link } from 'react-router-dom'

import ScripturleLogo from '../components/logo/ScripturleLogo'
import BellTowerLogo from './../components/logo/BellTowerLogo'
import { buttonClasses } from './../constants/classes'
import favicon from './../img/favicon.png'
import gitLogoWhite from './../img/github-mark-white.png'
import gitLogo from './../img/github-mark.png'

function About() {
  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="Scripturle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="text-l font-bold dark:text-white sm:text-xl md:text-3xl">
          About
        </h1>
        <ScripturleLogo className="mx-auto mb-16 h-auto w-64 fill-black dark:fill-white sm:w-80 md:w-96" />
        <p className="mx-auto -mt-10 w-4/5 text-center text-base dark:text-white md:text-xl">
          Scripturle is a daily puzzle game that tests users knowledge of
          Biblical references.
        </p>
        <p className="mx-auto mt-4 w-4/5 text-center text-base dark:text-white md:text-xl">
          Scripturle is not affiliated with "Wordle" by NYTimes in any way.
        </p>
        <p className="mx-auto mt-4 w-4/5 text-center text-base dark:text-white md:text-xl ">
          The game was designed and developed by Computer Science students{' '}
          <b>Kaden King</b> and <b>Dallas Yarnell</b> at
          <a href="https://fhu.edu" className="text-sky-400">
            {' '}
            Freed-Hardeman University
          </a>
          , Henderson, TN as part of their senior capstone course.
        </p>
        <div className="m-auto my-8 flex w-64 flex-col">
          <Link to="/" className={buttonClasses}>
            Play the Game
          </Link>
          <Link to="/help" className={`my-8 ${buttonClasses}`}>
            How to Play
          </Link>
          <Link to="/update-history" className={buttonClasses}>
            Update History
          </Link>
        </div>
      </div>
      <div className="col-span-10 col-start-2 mb-0 rounded-xl bg-gray-100 dark:bg-slate-800 lg:col-span-5 lg:col-start-2 lg:col-end-7 lg:mb-8">
        <BellTowerLogo className="mx-auto my-8 h-auto w-24 fill-black dark:fill-white md:w-32" />
        <h2 className="text-center text-2xl font-bold text-black dark:text-white">
          About Freed-Hardeman University
        </h2>
        <p className="p-8 text-center text-black dark:text-white">
          The mission of Freed-Hardeman University is to help students develop
          their God-given talents for His glory by empowering them with an
          education that integrates Christian faith, scholarship, and service.
        </p>
        <div className="my-4 flex flex-col text-center">
          <a
            href="https://fhu.edu"
            target="_blank"
            rel="noreferrer noopener"
            className={`mx-auto my-2 w-64 ${buttonClasses}`}
          >
            Freed-Hardeman <br /> University
          </a>
          <a
            href="https://fhu.edu/cs"
            target="_blank"
            rel="noreferrer noopener"
            className={`mx-auto my-2 w-64 ${buttonClasses}`}
          >
            FHU Computer <br /> Science
          </a>
        </div>
      </div>
      <div className="col-span-10 col-start-2 mb-8 rounded-xl bg-gray-100 dark:bg-slate-800 lg:col-span-5 lg:col-end-12">
        <img
          src={gitLogo}
          alt="GitHub"
          className="mx-auto mb-10 mt-20 block h-auto w-24 dark:hidden md:w-32 lg:mb-16"
        />
        <img
          src={gitLogoWhite}
          alt="GitHub"
          className="mx-auto mb-10 mt-20 hidden h-auto w-24 dark:block md:w-32 lg:mb-16"
        />
        <h2 className="text-center text-2xl font-bold text-black dark:text-white">
          About the Code
        </h2>
        <p className="p-8 text-center text-black dark:text-white">
          Scripturle is an open-source project that was forked from an amazing
          open-source template that no longer exists. Check out the Scripturle
          code on Github below.
        </p>
        <div className="my-4 flex flex-col text-center">
          <a
            href="https://github.com/FHU/thywordle"
            target="_blank"
            rel="noreferrer noopener"
            className={`mx-auto my-2 w-64 ${buttonClasses}`}
          >
            Scripturle <br /> Repo
          </a>
        </div>
      </div>
    </div>
  )
}

export default About
