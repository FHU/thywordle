import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'

import { ConfirmDeleteAccountModal } from '../components/modals/accountModals/ConfirmDeleteAccountModal'
import { ConfirmEditProfileModal } from '../components/modals/accountModals/ConfirmEditProfileModal'
import { EditProfileModal } from '../components/modals/accountModals/EditProfileModal'
import { LogOutModal } from '../components/modals/accountModals/LogOutModal'
import SignInTabs from '../components/profile/SignInTabs'
import { getUserDataByUid } from '../lib/firebase/firebaseAuth'
import { recalculateAllScoresFromGameStats } from '../lib/firebase/firebaseStats'
import Loading from './../components/gameState/Loading'
import { GameStats, PropToEditEnum } from './../constants/types'
import { useAlert } from './../context/AlertContext'
import favicon from './../img/favicon.png'

interface Props {
  user: User | null | undefined
  stats: GameStats
}

function Profile({ user, stats }: Props) {
  const { showError: showErrorAlert, showSuccess } = useAlert()
  const [loading, setLoading] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>()
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [isRecalcRunning, setIsRecalcRunning] = useState<boolean>(false)
  const [isLogoutConfirmationModalOpen, setIsLogoutConfirmationModalOpen] =
    useState<boolean>(false)
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] =
    useState<boolean>(false)
  const [propToEdit, setPropToEdit] = useState<PropToEditEnum>(
    PropToEditEnum.Username,
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
      'Unable to delete account at this time. Please try again later.',
    )
  }

  useEffect(() => {
    ;(async () => {
      if (user) {
        setLoading(true)
        const u = await getUserDataByUid(user.uid)
        setUserInfo(u)
        setIsAdmin(Boolean(u?.isAdmin))
        setLoading(false)
      }
    })()
  }, [user, isAdmin])

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

        {user && isAdmin && (
          <div className="my-6">
            <button
              onClick={async () => {
                setIsRecalcRunning(true)
                try {
                  const res = await recalculateAllScoresFromGameStats(100)
                  showSuccess(
                    `Recalc complete: ${res.updated} updated, ${res.skipped} skipped, ${res.errors} errors`,
                  )
                } catch (err: any) {
                  showErrorAlert(
                    `Recalc failed: ${err?.message ?? String(err)}`,
                  )
                } finally {
                  setIsRecalcRunning(false)
                }
              }}
              disabled={isRecalcRunning}
              className="mx-auto inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isRecalcRunning ? 'Running...' : 'Admin: Recalculate All Scores'}
            </button>
          </div>
        )}
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
