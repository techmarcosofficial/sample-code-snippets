import { authConstants  } from '../constants';

let user = localStorage.getItem('user');
if (user) {
  user = JSON.parse(user);
}

const initialState = {
  loading: false,
  user: null || user,
  token: null || localStorage.getItem('accessToken'),
}

export function authReducer(state = initialState, action: any) {
  switch (action.type) {
    case authConstants.FETCH:
      return {
        ...state,
        loading: action.loading,
      }
    case authConstants.LOGIN:
      return {
        ...state,
        user: action.user,
        token: action.token,
      };
    case authConstants.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
      };
    case authConstants.UPDATE_PROFILE:
      return {
        ...state,
        user: action.user
      };
    default:
      return {
        ...state,
      };
  }
}