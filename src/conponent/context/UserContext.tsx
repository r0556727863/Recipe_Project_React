import type React from "react"
import { createContext, useReducer, type ReactNode } from "react"
import { initialState, type User, type UserAction, userReducer } from "../UserReduser"

interface UserContextProps {
  state: User
  dispatch: React.Dispatch<UserAction>
}

export const UserContext = createContext<UserContextProps | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>
}
