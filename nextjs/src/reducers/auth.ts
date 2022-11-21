import create from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, UserResponseProps, UserProps } from "../lib/types";
// import {
//   atom,
//   selector,
// } from 'recoil';
// import { recoilPersist } from 'recoil-persist';
// const { persistAtom } = recoilPersist();

// export const userAtom = atom({
//   key: 'userAtom', // unique ID (with respect to other atoms/selectors)
//   default: null, // default value (aka initial value)
//   effects_UNSTABLE: [persistAtom],
// });

// export const tokenAtom = atom({
//   key: 'tokenAtom',
//   default: null,
//   effects_UNSTABLE: [persistAtom],
// });

// export const getUser = selector({
//   key: 'getUser',
//   get: ({get}) => {
//     const user = get(userAtom);
//     return user;
//   },
// });

// export const getToken = selector({
//   key: 'getToken',
//   get: ({get}) => {
//     const token = get(tokenAtom);
//     return token;
//   },
// });

export const useStore = create(persist<AuthState>(
  (set) => ({
    // initial state
    user: null,
    token: null,
    isLoggedIn: !1,
    // methods to update the state
    login: (response: UserResponseProps) => {
      set((state) => ({
        ...state,
        user: response.user,
        token: response.token,
        isLoggedIn: response.token ? !0 : !1,
      }));
    },
    logout: () => {
      localStorage.clear();
      set((state) => ({
        ...state,
        user: null,
        token: null,
        isLoggedIn: !1,
      }));
    },
    updateUser: (user: UserProps) => {
      set((state) => ({
        ...state,
        user,
      }));
    },
  }), {
    name: "Auth Reducer", // unique name
  })
);