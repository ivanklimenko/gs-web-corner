import * as _ from 'jsonous'
import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { catchError, filter, map, mapTo, Observable, of, switchMap, withLatestFrom } from 'rxjs'
import { ajax, AjaxError, AjaxResponse } from 'rxjs/ajax'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { decodeAndGet, playSound } from '../utils'

import type { RootState } from '.'
import { orderLazyDecoder } from './decoders'
import { Order, OutletOrderExt } from './types'

type Status = 'idle' | 'fetching' | 'error' | 'success'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sound = require('url:../assets/mp3/new-order.mp3')

interface OrderList {
  status: Status
  errorMessage: string | null
  list: Order[]
}

interface OrdersState {
  active: OrderList
  ready: OrderList
  today: OrderList
  threeDays: OrderList
  sevenDays: OrderList
  newOrders: string[]
}

// --- INITAL STATE --- //

const listInitialState: OrderList = {
  list: [],
  status: 'idle',
  errorMessage: null,
}

export const initialState: OrdersState = {
  active: listInitialState,
  ready: listInitialState,
  today: listInitialState,
  threeDays: listInitialState,
  sevenDays: listInitialState,
  newOrders: [],
}

// --- SELECTORS --- //

export const getOutletOrders = (list: Order[], outletId: number): OutletOrderExt[] =>
  list.reduce((list: OutletOrderExt[], order) => {
    const outlet = order.order_outlets.find((outlet) => outlet.outlet_id === outletId)
    return outlet ? [...list, { ...outlet, order }] : list
  }, [])

// --- SLICE --- //

export const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    reset: (state) => {
      state.active = listInitialState
      state.ready = listInitialState
    },

    activeRequestStart: (state) => {
      state.active.status = 'fetching'
    },
    activeRequestFail: (state, { payload }: PayloadAction<string>) => {
      state.active.status = 'error'
      state.active.errorMessage = payload
    },
    activeRequestSuccess: (state, { payload }: PayloadAction<Order[]>) => {
      state.active.status = 'success'
      state.active.list = payload
    },

    readyRequestStart: (state) => {
      state.ready.status = 'fetching'
    },
    readyRequestFail: (state, { payload }: PayloadAction<string>) => {
      state.ready.status = 'error'
      state.ready.errorMessage = payload
    },
    readyRequestSuccess: (state, { payload }: PayloadAction<Order[]>) => {
      state.ready.status = 'success'
      state.ready.list = payload
    },

    addNewOrder: (state, { payload }: PayloadAction<string>) => {
      if (state.newOrders.includes(payload)) return
      state.newOrders.push(payload)
      playSound(new Audio(sound))
    },
    resetNewOrders: (state) => {
      state.newOrders = []
    },
    // --------
    sevendaysRequestStart: (state) => {
      state.sevenDays.status = 'fetching'
    },
    sevendaysRequestFail: (state, { payload }: PayloadAction<string>) => {
      state.sevenDays.status = 'error'
      state.sevenDays.errorMessage = payload
    },
    sevendaysRequestSuccess: (state, { payload }: PayloadAction<Order[]>) => {
      state.sevenDays.status = 'success'
      state.sevenDays.list = payload
    },
    // --------
    todayRequestStart: (state) => {
      state.today.status = 'fetching'
    },
    todayRequestFail: (state, { payload }: PayloadAction<string>) => {
      state.today.status = 'error'
      state.today.errorMessage = payload
    },
    todayRequestSuccess: (state, { payload }: PayloadAction<Order[]>) => {
      state.today.status = 'success'
      state.today.list = payload
    },
    // --------
    treedaysRequestStart: (state) => {
      state.active.status = 'fetching'
    },
    threedaysRequestFail: (state, { payload }: PayloadAction<string>) => {
      state.active.status = 'error'
      state.active.errorMessage = payload
    },
    threedaysRequestSuccess: (state, { payload }: PayloadAction<Order[]>) => {
      state.active.status = 'success'
      state.active.list = payload
    },
  },
})

// --- EPICS --- //

const BASE_URL = process.env.BASE_URL

const activeRequestEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('orders/activeRequestStart'),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      ajax
        .post(
          `${BASE_URL}/arm/corner/orders/in_process`,
          {},
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [data, errorMessage] = decodeAndGet(_.field('orders', _.array(orderLazyDecoder)), response)

            if (data) {
              return slice.actions.activeRequestSuccess(data)
            } else {
              return slice.actions.activeRequestFail(errorMessage)
            }
          }),
          catchError((error: AjaxError) => {
            return of(slice.actions.activeRequestFail(error.message))
          }),
        ),
    ),
  )

const readyRequestEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('orders/readyRequestStart'),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      ajax
        .post(
          `${BASE_URL}/arm/corner/orders/ready`,
          {},
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [data, errorMessage] = decodeAndGet(_.field('orders', _.array(orderLazyDecoder)), response)

            if (data) {
              return slice.actions.readyRequestSuccess(data)
            } else {
              return slice.actions.readyRequestFail(errorMessage)
            }
          }),
          catchError((error: AjaxError) => {
            return of(slice.actions.readyRequestFail(error.message))
          }),
        ),
    ),
  )

const todayRequestEpic = (action$: Observable<any>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType('orders/todayRequestStart'),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      ajax
        .post(
          `${BASE_URL}/arm/corner/orders/history`,
          {},
          {
            authorization: `Bearer ${state.auth.accessToken}`,
          },
        )
        .pipe(
          map(({ response }: AjaxResponse<unknown>) => {
            const [data, errorMessage] = decodeAndGet(_.field('orders', _.array(orderLazyDecoder)), response)

            if (data) {
              return slice.actions.todayRequestSuccess(data)
            } else {
              return slice.actions.todayRequestFail(errorMessage)
            }
          }),
          catchError((error: AjaxError) => {
            return of(slice.actions.todayRequestFail(error.message))
          }),
        ),
    ),
  )

const resetEpic = (action$: Observable<any>) => action$.pipe(ofType('auth/reset'), mapTo(slice.actions.reset()))

const newOrderEpic = (action$: Observable<any>) =>
  action$.pipe(
    ofType('SOCKET/NEW_ORDER'),
    map(({ data }: { data: string }) => slice.actions.addNewOrder(data)),
  )

const resetNewOrderEpic = (actions$: Observable<any>, state$: StateObservable<RootState>) =>
  actions$.pipe(
    ofType('orders/resetNewOrders'),
    withLatestFrom(state$),
    filter(([, state]) => state.orders.active.status === 'success'),
    mapTo(slice.actions.activeRequestStart()),
  )

export const epics = combineEpics<any, any, any, unknown>(
  activeRequestEpic,
  readyRequestEpic,
  resetEpic,
  newOrderEpic,
  resetNewOrderEpic,
  todayRequestEpic,
)
