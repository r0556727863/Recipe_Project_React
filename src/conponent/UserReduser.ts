export type User = {
  Id: number
  UserName: string
  Name: string
  Email: string
  Phone: string
  Password: string
  Tz: string
}

export type UserAction = { type: "CREATE_USER"; payload: User } | { type: "RESET_USER" }

export const initialState: User = {
  Id: 0,
  UserName: "",
  Name: "",
  Email: "",
  Phone: "",
  Password: "",
  Tz: "",
}

export const userReducer = (state: User, action: UserAction): User => {
  switch (action.type) {
    case "CREATE_USER":
      return { ...state, ...action.payload }
    case "RESET_USER":
      return initialState
    default:
      return state
  }
}
