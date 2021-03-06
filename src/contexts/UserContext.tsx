import { fetchCollectionsForUser } from "api/collectionAPI";
import { fetchCreateUser, fetchUserFromAuthId } from "api/userAPI";
import { CardInterface } from "components/cardform/CardForm";
import React, { useContext, useEffect, useReducer } from "react";
import { useAuth } from "./AuthContext";

const UserContext = React.createContext({});
const UserUpdateContext = React.createContext({});

interface Props {
  children: JSX.Element;
}

export interface Collection {
  _id: string;
  title: string;
  ownerId: string;
  cardsIds?: string[];
  tags?: string[];
}

export interface User {
  _id: string;
  authId: string;
  following?: string[];
  ownedCards?: CardInterface[];
  collections?: Collection[];
}

export enum UserActions {
  FetchUser,
  FetchUserCards,
  FetchUserCollections,
  AddCollection,
  UpdateCollection,
  DeleteCollection,
  AddCardIdToCollection,
  ResetUser,
}

interface UserReducerAction {
  type: UserActions;
  payload?: any;
}

export function useUser(): User {
  return useContext(UserContext) as User;
}

export function useUserUpdate(): React.Dispatch<UserReducerAction> {
  return useContext(UserUpdateContext) as React.Dispatch<UserReducerAction>;
}

const UserProvider: React.FC<Props> = ({ children }) => {
  function userReducer(user: User, action: UserReducerAction): User {
    switch (action.type) {
      case UserActions.FetchUser:
        return { ...user, ...action.payload.userFromServer };
      //---------------------------------
      case UserActions.FetchUserCollections:
        return {
          ...user,
          collections: action.payload.userCollectionsFromServer,
        };
      //---------------------------------
      case UserActions.FetchUserCards:
        return { ...user, ...action.payload.userCardsFromServer };
      //---------------------------------
      case UserActions.AddCollection:
        const collections = user.collections === undefined ? [] : user.collections
        return {
          ...user,
          collections: [...collections, action.payload.newCollection],
        };
      //---------------------------------
      case UserActions.UpdateCollection:
        const colls = user.collections === undefined ? [] : user.collections
        const col = colls.filter((col) => col._id === action.payload.collectionId)?.[0]
        if (!col) {
          console.error("Collection ID not found, can't update collection.")
          return user
        }
        colls.forEach((col) => {
          if (col._id === action.payload.collectionId) {
            col.title = action.payload.collectionTitle
          }
        });
        return {
          ...user,
          collections: colls,
        };
      //---------------------------------
      case UserActions.DeleteCollection:
        const cols = user.collections === undefined ? [] : user.collections
        return {
          ...user,
          collections: cols.filter((col) => col._id !== action.payload.collectionId)
        }
      //---------------------------------
      case UserActions.AddCardIdToCollection:
        const updatedCollections = user.collections?.map((col: Collection) => {
          if(col._id === action.payload.collectionId){
            let cardsIds = col.cardsIds
            if(col.cardsIds === undefined) {
              cardsIds = []
            }
            return {...col, cardsIds: [...(cardsIds as string[]), action.payload.cardId ]}
          }
          return col;
        })
        return {
          ...user,
          collections: updatedCollections,
        }
      //---------------------------------
      case UserActions.ResetUser:
        return {
          _id: "",
          authId: "",
          following: undefined,
          ownedCards: undefined,
          collections: undefined,
        };
      default:
        return user;
    }
  }

  const [user, userDispatch] = useReducer(userReducer, {
    _id: "",
    authId: "",
    following: undefined,
    ownedCards: undefined,
    collections: undefined,
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) return;
      if (!currentUser.emailVerified) return
      // if (user._id !== "") return

      // check if there is a user with same uid (auth id)
      let user_ = await fetchUserFromAuthId(currentUser?.uid)
      const idToken = await currentUser.getIdToken(true);
      if (!user_) {
        user_ = await fetchCreateUser(currentUser.uid, idToken );
      }
      const userFromServer = {
        _id: user_._id,
        authId: user_.authId,
        // collections,
      }
      userDispatch({
        type: UserActions.FetchUser,
        // payload: userFromServer,
        payload: { userFromServer }
      })

      let collections = []
      try {
        collections = await fetchCollectionsForUser(userFromServer._id);
      } catch(err) {
        console.log(err)
      }
      userDispatch({
        type: UserActions.FetchUserCollections,
        payload: { userCollectionsFromServer: collections },
      });
    }
    fetchUser();
  }, [currentUser]);

  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={userDispatch}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
};

export default UserProvider;
