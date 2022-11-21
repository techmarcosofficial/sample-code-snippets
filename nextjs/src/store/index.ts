// import { useLayoutEffect } from 'react';
// import create from 'zustand';
// import createContext from 'zustand/context';

// let store: any;

// interface userProps {
//     email: string,
//     password: string,
// }

// interface InitialStateProps {
//     user?: userProps,
//     token?: string,
//     isLoggedIn?: boolean,
// }

// const initialState = {
//   user: null,
//   token: null,
//   isLoggedIn: !1,
// }

// const zustandContext = createContext()
// export const Provider = zustandContext.Provider
// // An example of how to get types
// /** 
//  * @type {import('zustand/index').UseStore<typeof initialState>}
//  * */
// export const useStore = zustandContext.useStore

// export const initializeStore = (preloadedState = {}) => {
//   return create((set) => ({
//     ...initialState,
//     ...preloadedState,
//     setUser: (user: userProps) => {
//         set({
//             user,
//             token: '123456',
//             isLoggedIn: !0,
//         })
//     }
//     // tick: (lastUpdate, light) => {
//     //   set({
//     //     lastUpdate,
//     //     light: !!light,
//     //   })
//     // },
//     // increment: () => {
//     //   set({
//     //     count: get().count + 1,
//     //   })
//     // },
//     // decrement: () => {
//     //   set({
//     //     count: get().count - 1,
//     //   })
//     // },
//     // reset: () => {
//     //   set({
//     //     count: initialState.count,
//     //   })
//     // },
//   }))
// }

// export function useCreateStore(initialState: InitialStateProps) {
//   // For SSR & SSG, always use a new store.
//   if (typeof window === 'undefined') {
//     return () => initializeStore(initialState)
//   }

//   // For CSR, always re-use same store.
//   store = store ?? initializeStore(initialState)
//   // And if initialState changes, then merge states in the next render cycle.
//   //
//   // eslint complaining "React Hooks must be called in the exact same order in every component render"
//   // is ignorable as this code runs in same order in a given environment
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   useLayoutEffect(() => {
//     if (initialState && store) {
//       store.setState({
//         ...store.getState(),
//         ...initialState,
//       })
//     }
//   }, [initialState])

//   return () => store
// }


import create from 'zustand';

export const useStore = create(set => ({
    bears: 0,
    // increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 })
}))
