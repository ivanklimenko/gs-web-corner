import * as _ from 'jsonous'
import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { catchError, map, mapTo, Observable, of, switchMap, withLatestFrom } from 'rxjs'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { decodeAndGet } from '../utils'

import type { RootState } from '.'
import { outletDecoder } from './decoders'
import type { OutletDescription } from './types'

type Status = 'idle' | 'fetching' | 'error' | 'success'

interface OutletState {
  status: Status
  data: OutletDescription | null
  errorMessage: string | null
  isLoading: boolean
}

// --- INITAL STATE --- //

export const initialState: OutletState = {
  status: 'idle',
  errorMessage: null,
  data: null,
  isLoading: false,
}

// --- SLICE --- //

export const slice = createSlice({
  name: 'outlet',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'idle'
      state.errorMessage = null
      state.data = null
      state.isLoading = false
    },
    loadStart: (state) => {
      state.status = 'fetching'
      state.errorMessage = null
    },
    loadFail: (state, { payload }: PayloadAction<string>) => {
      state.status = 'error'
      state.errorMessage = payload
    },
    loadSuccess: (state, { payload }: PayloadAction<OutletDescription>) => {
      state.status = 'success'
      state.errorMessage = null
      state.data = payload
    },
    toggleEnabledOutletStart: (state) => {
      state.isLoading = true
    },
    toggleEnabledOutletFail: (state) => {
      state.isLoading = false
    },
    toggleEnabledOutletSuccess: (state) => {
      state.isLoading = false
      if (state.data) {
        state.data.is_available_for_orders = !state.data.is_available_for_orders
      }
    },
  },
})

// --- EPICS --- //

const PROXY_API = 'https://api.hungry.ninja'
const BASE_URL = process.env.BASE_URL
console.log(BASE_URL)
const loadEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('outlet/loadStart'),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      ajax
        .post(
          `${BASE_URL}/arm/corner/outlet`,
          {},
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [data, errorMessage] = decodeAndGet(outletDecoder, response)

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

const toggleEnabledEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('outlet/toggleEnabledOutletStart'),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      ajax
        .post(
          `${BASE_URL}/arm/corner/enabled/outlet`,
          {
            enabled: state.outlet.data?.is_available_for_orders ? 0 : 1,
          },
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          mapTo(slice.actions.toggleEnabledOutletSuccess()),
          catchError(() => of(slice.actions.toggleEnabledOutletFail())),
        ),
    ),
  )

export const epics = combineEpics<any, any, any, unknown>(loadEpic, toggleEnabledEpic)
