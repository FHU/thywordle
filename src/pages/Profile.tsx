import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'

import SignInTabs from '../components/profile/SignInTabs'
import { ConfirmEditProfileModal } from './../components/profile/ConfirmEditProfileModal'
import { EditProfileModal } from './../components/profile/EditProfileModal'
import { LogOutModal } from './../components/profile/LogOutModal'
import { GameStats, PropToEditEnum } from './../constants/types'
import favicon from './../img/favicon.png'
import { getUserDataByUid } from './../lib/firebase'

interface Props {
  user: User | null | undefined
  stats: GameStats
}

function Profile({ user, stats }: Props) {
  const [userInfo, setUserInfo] = useState<any>()
  const [isLogoutConfirmationModalOpen, setIsLogoutConfirmationModalOpen] =
    useState<boolean>(false)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [propToEdit, setPropToEdit] = useState<PropToEditEnum>(
    PropToEditEnum.Username
  )
  const [newPropValue, setNewPropValue] = useState<string>('')
  const [isConfirmEditProfileModalOpen, setIsConfirmEditProfileModalOpen] =
    useState<boolean>(false)

  const handleLogOut = () => {
    setIsLogoutConfirmationModalOpen(true)
  }

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true)
  }

  useEffect(() => {
    ;(async () => {
      if (user) {
        const u = await getUserDataByUid(user.uid)
        setUserInfo(u)
      }
    })()
  }, [user])

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="ThyWordle Favicon"
          className="mx-auto my-12 w-48"
        />
        <h1 className="mb-4 text-2xl font-bold dark:text-white md:text-3xl">
          Profile
        </h1>
      </div>

      <div className="col-span-10 col-start-2 mb-16 mt-2 overflow-hidden rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <SignInTabs
          user={user}
          userInfo={userInfo}
          stats={stats}
          setPropToEdit={setPropToEdit}
          handleLogOut={handleLogOut}
          handleEditProfile={handleEditProfile}
        />
      </div>

      <EditProfileModal
        userInfo={userInfo}
        propToEdit={propToEdit}
        isOpen={isEditProfileModalOpen}
        handleClose={() => setIsEditProfileModalOpen(false)}
        setNewPropValue={setNewPropValue}
        setIsConfirmEditProfileModalOpen={setIsConfirmEditProfileModalOpen}
      />

      <ConfirmEditProfileModal
        user={user}
        propToEdit={propToEdit}
        editedValue={newPropValue}
        isOpen={isConfirmEditProfileModalOpen}
        handleClose={() => setIsConfirmEditProfileModalOpen(false)}
      />

      <LogOutModal
        isOpen={isLogoutConfirmationModalOpen}
        handleClose={() => setIsLogoutConfirmationModalOpen(false)}
      />
    </div>
  )
}

export default Profile
