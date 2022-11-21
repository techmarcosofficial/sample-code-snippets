import { authConstants } from "../constants";

export const loginAction = (user: any, token: string) => {
  return {
    type: authConstants.LOGIN,
    user,
    token,
  }
}

export const logoutAction = () => {
  return {
    type: authConstants.LOGOUT,
  }
}

export const updateProfileAction = (user: any) => {
  return {
    type: authConstants.UPDATE_PROFILE,
    user,
  }
}