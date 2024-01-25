import * as _ from 'jsonous'
import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { catchError, map, mapTo, Observable, of, switchMap, withLatestFrom } from 'rxjs'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { decodeAndGet } from '../utils'

import type { RootState } from '.'
import { positionDecoder } from './decoders'
import type { Position } from './types'

type Status = 'idle' | 'fetching' | 'error' | 'success'

interface PositionExt extends Position {
  isOpened: boolean
}

interface PositionsState {
  status: Status
  errorMessage: string | null
  list: PositionExt[]
  isEnabledPositionLoading: boolean
  isEnabledOptionLoading: boolean
}

interface OptionState {
  positionId: number
  optionId: number
}

// --- INITAL STATE --- //

export const initialState: PositionsState = {
  status: 'idle',
  errorMessage: null,
  list: [],
  isEnabledPositionLoading: false,
  isEnabledOptionLoading: false,
}

// --- SLICE --- //

export const slice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'idle'
      state.errorMessage = null
      state.list = []
      state.isEnabledPositionLoading = false
      state.isEnabledOptionLoading = false
    },

    loadStart: (state) => {
      state.status = 'fetching'
      state.errorMessage = null
    },
    loadFail: (state, { payload }: PayloadAction<string>) => {
      state.status = 'error'
      state.errorMessage = payload
    },
    loadSuccess: (state, { payload }: PayloadAction<Position[]>) => {
      state.status = 'success'
      state.list = payload.map((position) => ({ ...position, isOpened: false }))
      state.errorMessage = null
    },
    togglePosition: (state, { payload }: PayloadAction<number>) => {
      state.list.forEach((position) => {
        if (position.id === payload) {
          position.isOpened = !position.isOpened
        }
      })
    },

    toggleEnabledPositionStart: (state, _: PayloadAction<number>) => {
      state.isEnabledPositionLoading = true
    },
    toggleEnabledPositionFail: (state) => {
      state.isEnabledPositionLoading = false
    },
    toggleEnabledPositionSuccess: (state, { payload }: PayloadAction<number>) => {
      state.isEnabledPositionLoading = false
      state.list.forEach((position) => {
        if (position.id === payload) {
          position.is_available_for_orders = !position.is_available_for_orders
        }
      })
    },

    toggleEnabledOptionStart: (state, _: PayloadAction<OptionState>) => {
      state.isEnabledOptionLoading = true
    },
    toggleEnabledOptionFail: (state) => {
      state.isEnabledPositionLoading = false
    },
    toggleEnabledOptionSuccess: (state, { payload }: PayloadAction<OptionState>) => {
      state.isEnabledOptionLoading = false
      state.list.forEach((position) => {
        if (position.id === payload.positionId) {
          position.options.forEach((option) => {
            if (option.id === payload.optionId)
              option.is_available_for_orders = option.is_available_for_orders ? false : true
          })
        }
      })
    },
  },
})

// --- EPICS --- //

const BASE_URL = process.env.BASE_URL // 'https://development.hungry.ninja/api'

const loadEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('menu/loadStart'),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      ajax
        .get(`${BASE_URL}/arm/corner/products`, {
          authorization: `Bearer ${state.auth.accessToken}`,
        })
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [data, errorMessage] = decodeAndGet(_.array(positionDecoder), response)

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

const toggleEnabledPositionEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('positions/toggleEnabledPositionStart'),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]: [{ payload: number }, RootState]) => {
      const position = state.positions.list.find((position) => position.id === payload)

      if (!position) return of(slice.actions.toggleEnabledPositionFail())

      return ajax
        .post(
          `${BASE_URL}/arm/corner/enabled/product/`,
          {
            product_id: position.id,
            enabled: position.is_available_for_orders ? 0 : 1,
          },
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          mapTo(slice.actions.toggleEnabledPositionSuccess(payload)),
          catchError(() => of(slice.actions.toggleEnabledPositionFail())),
        )
    }),
  )

const toggleEnabledOptionEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('positions/toggleEnabledOptionStart'),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]: [{ payload: OptionState }, RootState]) => {
      const position = state.positions.list.find((position) => position.id === payload.positionId)

      if (!position) return of(slice.actions.toggleEnabledOptionFail())

      const option = position?.options.find((option) => option.id === payload.optionId)

      if (!option) return of(slice.actions.toggleEnabledOptionFail())

      return ajax
        .post(
          `${BASE_URL}/arm/corner/enabled/options/`,
          {
            option_id: option.id,
            enabled: option.is_available_for_orders ? 0 : 1,
          },
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          mapTo(slice.actions.toggleEnabledOptionSuccess(payload)),
          catchError(() => of(slice.actions.toggleEnabledOptionFail())),
        )
    }),
  )

export const epics = combineEpics<any, any, any, unknown>(loadEpic, toggleEnabledPositionEpic, toggleEnabledOptionEpic)
