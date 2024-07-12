import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

import { Group, LeaderboardUser } from './../../constants/types'
import { getUserDocByUid } from './firebaseAuth'
import { db } from './firebaseConfig'

export const addGroupToUserDoc = async (
  userId: string,
  groupName: string,
  isRequest: boolean
): Promise<void> => {
  const userDoc = await getUserDocByUid(userId)
  if (userDoc.exists()) {
    const docRef = doc(db, 'users', userId)
    if (isRequest) {
      await updateDoc(docRef, {
        requestedGroups: arrayUnion(groupName),
      })
    } else {
      await updateDoc(docRef, {
        groups: arrayUnion(groupName),
      })
    }
  }
}

export const removeGroupFromUserDoc = async (
  userId: string,
  groupName: string,
  isRequest: boolean
): Promise<void> => {
  const userDoc = await getUserDocByUid(userId)
  if (userDoc.exists()) {
    const docRef = doc(db, 'users', userId)
    if (isRequest) {
      await updateDoc(docRef, {
        requestedGroups: arrayRemove(groupName),
      })
    } else {
      await updateDoc(docRef, {
        groups: arrayRemove(groupName),
      })
    }
  }
}

export const removeGroupFromAllUserDocs = async (
  groupName: string,
  users: any
): Promise<void> => {
  for (let i = 0; i < users.length; i++) {
    await removeGroupFromUserDoc(users[i].id, groupName, false)
  }
}

export const getGroupsByUidFromFirestore = async (
  userId: string
): Promise<string[]> => {
  const userDoc = await getUserDocByUid(userId)
  if (!userDoc.exists()) {
    return []
  }

  return userDoc.data().groups
}

export const getCleanedGroupName = (groupName: string): string => {
  return groupName.toLocaleLowerCase().replace(/\s/g, '')
}

export const getGroupByGroupName = async (groupName: string): Promise<any> => {
  try {
    const groups = query(
      collection(db, 'groups'),
      where('queryName', '==', getCleanedGroupName(groupName)),
      limit(1)
    )

    const querySnapshot = await getDocs(groups)
    return querySnapshot.docs[0]
  } catch (error) {
    console.log(error)
  }
}

export const getGroupInfoByGroupName = async (
  groupName: string
): Promise<any> => {
  try {
    const result = await getGroupByGroupName(groupName)
    if (!result) {
      return null
    }

    return {
      groupName: result.data().groupName,
      queryName: result.data().queryName,
      isPrivate: result.data().isPrivate,
      adminEmail: result.data().adminEmail,
    }
  } catch (error) {
    console.log(error)
    return true
  }
}

export const createNewGroup = async (
  groupName: string,
  isPrivate: boolean,
  adminEmail: string | null,
  uid: string
): Promise<boolean> => {
  if (adminEmail === null && isPrivate) {
    return false
  }

  try {
    const group = await getGroupByGroupName(groupName)
    if (!group) {
      await addDoc(collection(db, 'groups'), {
        groupName: groupName,
        queryName: getCleanedGroupName(groupName),
        adminEmail: adminEmail,
        isPrivate: isPrivate,
        users: [doc(db, `users/${uid}`)],
        requestedUsers: [],
      })

      await addGroupToUserDoc(uid, groupName, false)
    }
  } catch {
    return false
  }

  return true
}

export const addUserToGroup = async (
  groupName: string,
  uid: string,
  isPrivate: boolean
): Promise<boolean> => {
  try {
    const userGroups = await getGroupsByUidFromFirestore(uid)
    if (userGroups.length >= 5) {
      return false
    }

    const group = await getGroupByGroupName(groupName)
    if (group.exists()) {
      const docRef = doc(db, 'groups', group.id)
      if (isPrivate) {
        await addGroupToUserDoc(uid, groupName, true)
        await updateDoc(docRef, {
          requestedUsers: arrayUnion(doc(db, `users/${uid}`)),
        })
      } else {
        await addGroupToUserDoc(uid, groupName, false)
        await updateDoc(docRef, {
          users: arrayUnion(doc(db, `users/${uid}`)),
        })
      }

      return true
    }
  } catch {
    return false
  }
  return false
}

export const removeUserFromGroup = async (
  groupName: string,
  uid: string,
  isAdmin: boolean
): Promise<boolean> => {
  try {
    const group = await getGroupByGroupName(groupName)
    if (group.exists()) {
      const docRef = doc(db, 'groups', group.id)
      if (isAdmin) {
        await removeGroupFromAllUserDocs(groupName, group.data().users)
        await deleteDoc(docRef)
      }

      if (!isAdmin) {
        await removeGroupFromUserDoc(uid, groupName, false)
        await updateDoc(docRef, {
          users: arrayRemove(doc(db, `users/${uid}`)),
        })
      }

      return true
    }
  } catch {
    return false
  }
  return false
}

export const acceptJoinPrivateGroup = async (
  groupName: string,
  uid: string
): Promise<boolean> => {
  try {
    const userGroups = await getGroupsByUidFromFirestore(uid)
    if (userGroups.length >= 5) {
      return false
    }

    const group = await getGroupByGroupName(groupName)
    if (group.exists()) {
      const docRef = doc(db, 'groups', group.id)
      await removeGroupFromUserDoc(uid, groupName, true)
      await addGroupToUserDoc(uid, groupName, false)

      await updateDoc(docRef, {
        users: arrayUnion(doc(db, `users/${uid}`)),
        requestedUsers: arrayRemove(doc(db, `users/${uid}`)),
      })
    }
    return true
  } catch {
    return false
  }
}

export const denyJoinPrivateGroup = async (
  groupName: string,
  uid: string
): Promise<boolean> => {
  try {
    const group = await getGroupByGroupName(groupName)
    if (group.exists()) {
      const docRef = doc(db, 'groups', group.id)
      await removeGroupFromUserDoc(uid, groupName, true)
      await updateDoc(docRef, {
        requestedUsers: arrayRemove(doc(db, `users/${uid}`)),
      })
    }
    return true
  } catch {
    return false
  }
}

export const getGroupLeaderboardByGroupNameFromFirestore = async (
  groupName: string | undefined,
  uid: string
): Promise<Group | null> => {
  if (!groupName) {
    return null
  }

  try {
    const result = await getGroupByGroupName(groupName)
    if (!result) {
      return null
    }

    const groupLeaderboard: LeaderboardUser[] = []
    for (let i = 0; i < result.data().users.length; i++) {
      const userDoc = await getDoc(result.data().users[i])
      const userData: any = userDoc.data()
      if (userDoc.exists() && userDoc.data() !== undefined) {
        const lastPlayed = userData.gameState.lastUpdated
          .toDate()
          .toLocaleDateString()

        const u = {
          uid: userData.uid,
          rank: 0,
          name: userData.name,
          avgGuesses: userData.gameStats.avgNumGuesses,
          points: userData.gameStats.score,
          lastPlayed: lastPlayed,
          stats: {
            currentStreak: userData.gameStats.currentStreak,
            bestStreak: userData.gameStats.bestStreak,
            successRate: userData.gameStats.successRate,
          },
          highlightedUser: userData.uid === uid,
        }

        groupLeaderboard.push(u)
      }
    }

    const requestedUsersList: any[] = []
    for (let i = 0; i < result.data().requestedUsers.length; i++) {
      const userDoc = await getDoc(result.data().requestedUsers[i])
      const userData: any = userDoc.data()
      if (userDoc.exists() && userDoc.data() !== undefined) {
        const reqU = {
          uid: userData.uid,
          name: userData.name,
        }

        requestedUsersList.push(reqU)
      }
    }

    groupLeaderboard.sort((a, b) => b.points - a.points)
    let xRank = 1
    groupLeaderboard.forEach((x) => {
      x.rank = xRank
      xRank++
    })

    return {
      groupName: result.data().groupName,
      adminEmail: result.data().adminEmail,
      isPrivate: result.data().isPrivate,
      users: groupLeaderboard,
      requestedUsers: requestedUsersList,
    }
  } catch (error) {
    console.log(error)
    return null
  }
}
