import { fetchCollectionsForUser } from 'api/collectionAPI'
import { fetchUserFromAuthId } from 'api/userAPI'
import { CardInterface } from 'components/cardform/CardForm'
import Card from 'components/cards/Card'
import React, { useContext, useEffect, useReducer } from 'react'
import { USER_ACTIONS } from './../Constants'
import { useAuth } from './AuthContext'
const UserContext = React.createContext({})
const UserUpdateContext = React.createContext({})

export function useUser() {
  return useContext(UserContext)
}

export function useUserUpdate() {
  return useContext(UserUpdateContext)
}

interface Props {
  children: JSX.Element;
}

export interface User {
  _id: string;
  authId: string;
  following: string[];
  ownedCards: CardInterface[]
  collections: string[];
}

export enum UserActions {
  FetchUser,
  FetchUserCards,
  FetchUserCollections,
  AddCollection,
  ResetUser,
}

interface UserReducerAction {
  type: UserActions;
  payload: any;
}

const UserProvider : React.FC<Props> = ({children}) => {

  function userReducer(user: User, action: UserReducerAction ): User {
    switch (action.type) {
      case UserActions.FetchUser:
        return { ...user, ...action.payload.userFromServer }
      //---------------------------------
      case UserActions.FetchUserCollections:
        return { ...user, collections:  action.payload.userCollectionsFromServer}
      //---------------------------------
      case UserActions.FetchUserCards:
        return { ...user, ...action.payload.userCardsFromServer }
      //---------------------------------
      case UserActions.AddCollection:
        return { ...user, collections: [...user.collections, action.payload.newCollection]}
      //---------------------------------
      case UserActions.ResetUser:
        return { _id: "",  authId: "", following: [], ownedCards: [], collections: [] }
      default:
        return user; 
    }
  }

  const [user, userDispatch] = useReducer(userReducer, {
  _id: "", 
  authId: "",
  following: [],
  ownedCards: [],
  collections: [] 
  } ) 

  const { currentUser } = useAuth()
  useEffect(() => {
    if(currentUser) {
      // if currentUser doesn't exist (not signed in), don't do anything
      // else fetch data and update state
          const fetchUser = async () => {
            if(user._id === "") {
              // if user state is empty
              const userFromServer = await fetchUserFromAuthId(currentUser?.uid)
              userDispatch({type: UserActions.FetchUser, payload: { userFromServer }})
              const collections = await fetchCollectionsForUser(userFromServer._id)
              userDispatch({type: UserActions.FetchUserCollections, payload: { userCollectionsFromServer: collections }})
            }
      }
      fetchUser()
    }
  }, [currentUser])


  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={userDispatch}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  )

}

export default UserProvider;