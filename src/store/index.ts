import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { combineEpics, createEpicMiddleware } from 'redux-observable'

import { configureStore } from '@reduxjs/toolkit'

import * as auth from './auth'
import * as menu from './menu'
import * as order from './order'
import * as orders from './orders'
import * as outlet from './outlet'
import * as position from './positions'
import * as socket from './socket'

const epicMiddleware = createEpicMiddleware()

export const store = configureStore({
  reducer: {
    [auth.slice.name]: auth.slice.reducer,
    [outlet.slice.name]: outlet.slice.reducer,
    [orders.slice.name]: orders.slice.reducer,
    [order.slice.name]: order.slice.reducer,
    [menu.slice.name]: menu.slice.reducer,
    [position.slice.name]: position.slice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
})

epicMiddleware.run(
  combineEpics(auth.epics, outlet.epics, orders.epics, order.epics, socket.epics, menu.epics, position.epics),
)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
