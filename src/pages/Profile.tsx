import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'

import { ConfirmDeleteAccountModal } from '../components/modals/accountModals/ConfirmDeleteAccountModal'
import { ConfirmEditProfileModal } from '../components/modals/accountModals/ConfirmEditProfileModal'
import { EditProfileModal } from '../components/modals/accountModals/EditProfileModal'
import { LogOutModal } from '../components/modals/accountModals/LogOutModal'
import SignInTabs from '../components/profile/SignInTabs'
import { getUserDataByUid } from '../lib/firebase/firebaseAuth'
import Loading from './../components/gameState/Loading'
import { GameStats, PropToEditEnum } from './../constants/types'
import { useAlert } from './../context/AlertContext'
import favicon from './../img/favicon.png'

interface Props {
  user: User | null | undefined
  stats: GameStats
}

function Profile({ user, stats }: Props) {
  const { showError: showErrorAlert } = useAlert()
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [isLogoutConfirmationModalOpen, setIsLogoutConfirmationModalOpen] =
    useState<boolean>(false)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [propToEdit, setPropToEdit] = useState<PropToEditEnum>(
    PropToEditEnum.Username
  )
  const [newPropValue, setNewPropValue] = useState<string>('')
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState<boolean>(false)
  const [isConfirmEditProfileModalOpen, setIsConfirmEditProfileModalOpen] =
    useState<boolean>(false)

  const handleLogOut = () => {
    setIsLogoutConfirmationModalOpen(true)
  }

  const handleEditProfile = () => {
    setIsEditProfileModalOpen(true)
  }

  const handleDeleteAccount = () => {
    setIsConfirmDeleteModalOpen(true)
  }

  const deleteAccountFailed = () => {
    showErrorAlert(
      'Unable to delete account at this time. Please try again later.'
    )
  }

  useEffect(() => {
    ;(async () => {
      if (user) {
        setLoading(true)
        const u = await getUserDataByUid(user.uid)
        setUserInfo(u)
        setLoading(false)
      }
    })()
  }, [user])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-10 col-start-2 mt-2 rounded-xl bg-gray-100 text-center dark:bg-slate-800">
        <img
          src={favicon}
          alt="Scripturle Favicon"
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
          handleDeleteAccount={handleDeleteAccount}
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
        userInfo={userInfo}
        propToEdit={propToEdit}
        editedValue={newPropValue}
        isOpen={isConfirmEditProfileModalOpen}
        handleClose={() => setIsConfirmEditProfileModalOpen(false)}
      />

      <ConfirmDeleteAccountModal
        user={user}
        isOpen={isConfirmDeleteModalOpen}
        handleClose={() => setIsConfirmDeleteModalOpen(false)}
        showError={deleteAccountFailed}
      />

      <LogOutModal
        isOpen={isLogoutConfirmationModalOpen}
        handleClose={() => setIsLogoutConfirmationModalOpen(false)}
      />
    </div>
  )
}

export default Profile
