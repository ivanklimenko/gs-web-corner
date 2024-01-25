import { isAndroid, isDesktop, isIOS } from 'react-device-detect'

import Decoder, * as _ from 'jsonous'
import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { catchError, debounce, filter, interval, map, mapTo, Observable, of, switchMap, withLatestFrom } from 'rxjs'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { decodeAndGet, nullOr } from '../utils'

import type { RootState } from '.'

export interface User {
  email: string | null
  username: string
  code: number
  firstName: string | null
  lastName: string | null
  roles: string[]
}

type Status = 'checking' | 'loggedOut' | 'loggedIn'
type LoginStatus = 'idle' | 'fetching' | 'error' | 'success'

interface AuthState {
  status: Status
  loginStatus: LoginStatus
  errorMessage: string | null
  accessToken: string | null
  pushToken: string | null
  user: User | null
}

interface AuthResponse {
  user: User
  token: string
}

export interface Credentials {
  login: string
  password: string
}

interface TokenStart {
  userId: number
  token: string
}

// --- INITAL STATE --- //

const accessToken = localStorage.getItem('accessToken')

export const initialState: AuthState = {
  status: accessToken === null ? 'loggedOut' : 'checking',
  loginStatus: 'idle',
  errorMessage: null,
  accessToken,
  pushToken: null,
  user: null,
}

// --- SLICE --- //

export const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'loggedOut'
      state.loginStatus = 'idle'
      state.user = null
      state.accessToken = null
      state.errorMessage = null

      localStorage.removeItem('accessToken')
    },

    refreshStart: () => {
      return
    },

    loginStart: (state, _: PayloadAction<Credentials>) => {
      state.loginStatus = 'fetching'
    },
    loginFail: (state, { payload }: PayloadAction<string>) => {
      state.loginStatus = 'error'
      state.errorMessage = payload
    },
    loginSuccess: (state, { payload }: PayloadAction<string>) => {
      state.accessToken = payload
      state.errorMessage = null
      localStorage.setItem('accessToken', payload)
    },
    userLoadSuccess: (state, { payload }: PayloadAction<User>) => {
      state.user = payload
      state.status = 'loggedIn'
      state.loginStatus = 'success'
    },
    saveTokenStart: (state, { payload }: PayloadAction<TokenStart>) => {
      state.pushToken = payload.token
    },
    removeTokenStart: (_, __: PayloadAction<string>) => {
      return
    },
  },
})

// --- EPICS --- //

const BASE_URL = process.env.BASE_URL

const initRefreshEpic = () =>
  of(1).pipe(
    filter(() => Boolean(accessToken)),
    mapTo(slice.actions.loginSuccess(accessToken ?? '')),
  )

const loginEpic = (action$: Observable<any>) =>
  action$.pipe(
    ofType('auth/loginStart'),
    switchMap((action) =>
      ajax
        .post(`${BASE_URL}/auth/login_by_username`, {
          username: action.payload.login,
          password: action.payload.password,
        })
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [accessToken, errorMessage] = decodeAndGet(authDecode, response)

            if (errorMessage) {
              console.log('login decoder fail', errorMessage)
            }

            if (accessToken) {
              return slice.actions.loginSuccess(accessToken)
            } else {
              return slice.actions.loginFail(errorMessage)
            }
          }),
          catchError((error: AjaxError) => of(slice.actions.loginFail(error.message))),
        ),
    ),
  )

const loadUserEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('auth/loginSuccess'),
    withLatestFrom(state$),
    switchMap(([_, state]) =>
      ajax
        .get(`${BASE_URL}/users/me`, {
          authorization: `Bearer ${state.auth.accessToken}`,
        })
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [data, errorMessage] = decodeAndGet(userDecoder, response)

            if (errorMessage) {
              console.log('login decoder fail', errorMessage)
            }

            if (data) {
              return slice.actions.userLoadSuccess(data)
            } else {
              return slice.actions.loginFail(errorMessage)
            }
          }),
          catchError((error: AjaxError) => of(slice.actions.loginFail(error.message))),
        ),
    ),
  )

const pushTokenEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('auth/saveTokenStart'),
    withLatestFrom(state$),
    switchMap(([action, state]: [{ payload: TokenStart }, RootState]) =>
      ajax
        .post(
          `${BASE_URL}/fcm/register`,
          {
            token: action.payload.token,
            platform: isDesktop ? 'Desktop' : isAndroid ? 'Android' : isIOS ? 'Ios' : 'Other',
            type: 'Web',
            clientApp: 'ARM',
          },
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          catchError((error: AjaxError) => {
            console.log('Ошибка или баг', error)
            return of(false)
          }),
        ),
    ),
    filter(() => false),
  )
const removeTokenEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('auth/removeTokenStart'),
    withLatestFrom(state$),
    switchMap(([action, state]: [{ payload: string }, RootState]) =>
      ajax
        .post(
          `${BASE_URL}/fcm/revoke`,
          {
            token: action.payload,
          },
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          catchError((error: AjaxError) => {
            console.log('Ошибка или баг', error)
            return of(false)
          }),
        ),
    ),
    filter(() => false),
  )

const refreshDebounceEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('auth/loginSuccess'),
    debounce(() => interval(300000)),
    withLatestFrom(state$),
    filter(([, state]) => state.auth.status === 'loggedIn'),
    mapTo(slice.actions.refreshStart()),
  )

export const epics = combineEpics<any, any, any, unknown>(
  initRefreshEpic,
  loginEpic,
  loadUserEpic,
  refreshDebounceEpic,
  removeTokenEpic,
  pushTokenEpic,
)

// --- DECODERS --- //

const authDecode: Decoder<string> = _.field('access_token', _.string)

const userDecoder: Decoder<User> = _.succeed({})
  .assign('firstName', _.field('firstName', nullOr(_.string)))
  .assign('lastName', _.field('lastName', nullOr(_.string)))
  .assign('email', _.field('email', nullOr(_.string)))
  .assign('username', _.field('username', _.string))
  .assign('code', _.field('id', _.number))
  .assign('roles', _.field('roles', _.array(_.string)))

// const PROXY_API = 'https://api.hungry.ninja/api'
// const PROXY_TOKEN_API = 'https://api.hungry.ninja/ninja/token'
// const refreshEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
//   action$.pipe(
//     ofType('auth/refreshStart'),
//     withLatestFrom(state$),
//     switchMap(([, state]) =>
//       ajax
//         .get(`${PROXY_API}/refresh`, {
//           authorization: `Bearer ${state.auth.refreshToken}`,
//         })
//         .pipe(
//           map(({ response }: AjaxResponse<unknown>) => {
//             const [data, _] = decodeAndGet(authDecode, response)

//             if (data) {
//               localStorage.setItem('refreshToken', data.refresh)
//               return slice.actions.loginSuccess(data)
//             } else {
//               localStorage.removeItem('refreshToken')
//               return slice.actions.reset()
//             }
//           }),
//           catchError(() => {
//             localStorage.removeItem('refreshToken')
//             return of(slice.actions.reset())
//           }),
//         ),
//     ),
//   )
