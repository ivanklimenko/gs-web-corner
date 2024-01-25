import * as _ from 'jsonous'
import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { catchError, map, mapTo, Observable, of, switchMap, withLatestFrom } from 'rxjs'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { decodeAndGet } from '../utils'

import type { RootState } from '.'
import { orderDecoder } from './decoders'
import type { CornerStatus, Order, OutletOrderExt } from './types'

type Status = 'idle' | 'fetching' | 'error' | 'success'

interface OrderState {
  data: Order | null
  status: Status
  errorMessage: string | null
  isLoading: boolean
}

interface UpdateStatus {
  outletOrderId: number
  status: CornerStatus
}

// --- INITAL STATE --- //

export const initialState: OrderState = {
  data: null,
  status: 'idle',
  errorMessage: null,
  isLoading: false,
}

// --- SELECTORS --- //

export const getOutletOrder = (order: Order, outletId: number): OutletOrderExt | null => {
  const outlet = order.order_outlets.find((item) => item.outlet_id === outletId)
  return outlet ? { ...outlet, order } : null
}

// --- SLICE --- //

export const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    reset: (state) => {
      state.data = null
      state.status = 'idle'
      state.errorMessage = null
    },

    loadStart: (state, _: PayloadAction<number>) => {
      state.data = null
      state.status = 'fetching'
      state.errorMessage = null
    },
    loadFail: (state, { payload }: PayloadAction<string>) => {
      state.status = 'error'
      state.errorMessage = payload
    },
    loadSuccess: (state, { payload }: PayloadAction<Order>) => {
      state.status = 'success'
      state.data = payload
    },

    updateCornerStatusStart: (state, _: PayloadAction<UpdateStatus>) => {
      state.isLoading = true
    },
    updateCornerStatusFail: (state) => {
      state.isLoading = false
    },
    updateCornerStatusSuccess: (state, { payload }: PayloadAction<UpdateStatus>) => {
      state.isLoading = false

      if (state.data) {
        state.data.order_outlets.forEach((outletOrder) => {
          if (outletOrder.id === payload.outletOrderId) {
            outletOrder.status = payload.status
          }
        })
      }
    },
  },
})

// --- EPICS --- //

const BASE_URL = process.env.BASE_URL

const loadEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('order/loadStart'),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]: [{ payload: number }, RootState]) =>
      ajax.get(`${BASE_URL}/arm/corner/order/${payload}`, { authorization: `Bearer ${state.auth.accessToken}` }).pipe(
        map(({ response }: AjaxResponse<unknown>) => {
          const [data, errorMessage] = decodeAndGet(orderDecoder, response)

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

const updateCornerStatusEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('order/updateCornerStatusStart'),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]: [{ payload: UpdateStatus }, RootState]) =>
      ajax
        .get(`${BASE_URL}/arm/order/${payload.outletOrderId}/status/${payload.status}`, {
          authorization: `Bearer ${state.auth.accessToken}`,
        })
        .pipe(
          mapTo(slice.actions.updateCornerStatusSuccess(payload)),
          catchError(() => of(slice.actions.updateCornerStatusFail())),
        ),
    ),
  )

export const epics = combineEpics<any, any, any, unknown>(loadEpic, updateCornerStatusEpic)

// const PROXY_API = 'https://api.hungry.ninja'
