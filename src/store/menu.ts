import * as _ from 'jsonous'
import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { catchError, map, Observable, of, switchMap, withLatestFrom } from 'rxjs'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { decodeAndGet } from '../utils'

import type { RootState } from '.'
import { menuDecoder } from './decoders'
import type { Menu } from './types'

type Status = 'idle' | 'fetching' | 'error' | 'success'

interface MenuState {
  status: Status
  errorMessage: string | null
  list: Menu[]
}

// --- INITAL STATE --- //

export const initialState: MenuState = {
  status: 'idle',
  errorMessage: null,
  list: [],
}

// --- SLICE --- //

export const slice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'idle'
      state.errorMessage = null
      state.list = []
    },

    loadStart: (state) => {
      state.status = 'fetching'
      state.errorMessage = null
    },
    loadFail: (state, { payload }: PayloadAction<string>) => {
      state.status = 'error'
      state.errorMessage = payload
    },
    loadSuccess: (state, { payload }: PayloadAction<Menu[]>) => {
      state.status = 'success'
      state.list = payload
      state.errorMessage = null
    },
  },
})

// --- EPICS --- //

const BASE_URL = process.env.BASE_URL

const loadEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('menu/loadStart'),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      ajax
        .get(`${BASE_URL}/arm/corner/categories`, {
          authorization: `Bearer ${state.auth.accessToken}`,
        })
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [data, errorMessage] = decodeAndGet(_.array(menuDecoder), response)

            if (data) {
              return slice.actions.loadSuccess(data)
            } else {
              return slice.actions.loadFail(errorMessage)
            }
          }),
          catchError((error: AjaxError) => {
            return of(slice.actions.loadFail(error.message))
          }),
        ),
    ),
  )

export const epics = combineEpics<any, any, any, unknown>(loadEpic)
