/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { Link } from 'react-router-dom'

import BellTowerLogo from './../components/logo/BellTowerLogo'
import ThyWordleLogo from './../components/logo/ThyWordleLogo'
import favicon from './../img/favicon.png'
import gitLogoWhite from './../img/github-mark-white.png'
import gitLogo from './../img/github-mark.png'

function About() {
  return (
    <div className="grid w-full grid-cols-8 gap-4">
      <div className="col-span-6 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="text-l font-bold dark:text-white sm:text-xl md:text-3xl">
          Welcome and thanks for playing
        </h1>
        <ThyWordleLogo className="mx-auto -mt-12 h-auto w-64 fill-black dark:fill-white sm:w-80 md:-mt-16 md:w-96" />
        <p className="mx-auto -mt-10 w-4/5 text-base dark:text-white md:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam
          molestias temporibus aspernatur, mollitia odio aperiam, inventore
          repellat eos quam facilis earum dolorem, facere commodi cum at nobis
          dicta corrupti quaerat.
        </p>
        <div className="my-12">
          <Link
            to="/"
            className="text-ll rounded-lg bg-black p-4 text-center font-bold uppercase text-white dark:bg-white dark:text-slate-900"
          >
            Play the Game
          </Link>
        </div>
      </div>
      <div className="col-span-6 col-start-2 rounded-xl bg-gray-100 dark:bg-slate-800 lg:col-span-3 lg:col-start-2 lg:col-end-5">
        <BellTowerLogo className="mx-auto my-8 h-auto w-24 fill-black dark:fill-white md:w-32" />
        <h2 className="text-center text-2xl font-bold text-black dark:text-white">
          Learn More <br className="block md:hidden" /> about FHU
        </h2>
        <div className="my-12 flex flex-col text-center">
          <a
            href="https://fhu.edu"
            target="_blank"
            className="text-l mx-auto my-2 w-64 rounded-lg bg-black p-4 text-center font-bold uppercase text-white dark:bg-white dark:text-slate-900"
          >
            FHU
          </a>
          <a
            href="https://fhu.edu/cs"
            target="_blank"
            className="text-l my-2 mx-auto w-64 rounded-lg bg-black p-4 text-center font-bold uppercase text-white dark:bg-white dark:text-slate-900"
          >
            FHU Computer Science
          </a>
        </div>
      </div>
      <div className="col-span-6 col-start-2 rounded-xl bg-gray-100 dark:bg-slate-800 lg:col-span-3 lg:col-end-8">
        <img
          src={gitLogo}
          alt="GitHub"
          className="mx-auto mt-20 mb-10 block h-auto w-24 dark:hidden md:w-32 lg:mb-16"
        />
        <img
          src={gitLogoWhite}
          alt="GitHub"
          className="mx-auto mt-20 mb-10 hidden h-auto w-24 dark:block md:w-32 lg:mb-16"
        />
        <h2 className="text-center text-2xl font-bold text-black dark:text-white">
          Learn More <br className="block md:hidden" /> about the code
        </h2>
        <div className="my-12 flex flex-col text-center">
          <a
            href="https://github.com/FHU/thywordle"
            target="_blank"
            className="text-l mx-auto my-2 w-64 rounded-lg bg-black p-4 text-center font-bold uppercase text-white dark:bg-white dark:text-slate-900"
          >
            ThyWordle Repo
          </a>
          <a
            href="https://github.com/cwackerfuss/react-wordle"
            target="_blank"
            className="text-l mx-auto my-2 w-64 rounded-lg bg-black p-4 text-center font-bold uppercase text-white dark:bg-white dark:text-slate-900"
          >
            Reactle Repo
          </a>
        </div>
      </div>
    </div>
  )
}

export default About
