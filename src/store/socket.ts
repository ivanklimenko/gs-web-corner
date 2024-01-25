import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { filter, fromEvent, map, Observable, switchMapTo, take, withLatestFrom } from 'rxjs'
import { io } from 'socket.io-client'

import { RootState } from '.'

console.log('socket')

const connection = io('wss://api.hungry.ninja', {
  path: '/pusher',
  transports: ['websocket', 'polling'],
  autoConnect: false,
})

const socketAction$: Observable<any> = fromEvent(connection, 'action')

const socketRegisterEpic$ = (action$: Observable<any>, state$: StateObservable<RootState>) => {
  return socketAction$.pipe(
    filter(({ type }) => type === 'SOCKET/CONNECTED'),
    switchMapTo(
      state$.pipe(
        take(1),
        map((state) => {
          const outletId = state.auth.user?.outlet

          if (outletId) connection.emit('setUser', outletId)

          return false
        }),
        filter(() => false),
      ),
    ),
  )
}

const socketConnectEpic = (action$: Observable<any>) => {
  return action$.pipe(
    ofType('auth/loginSuccess'),
    map(() => {
      connection.connect()
      return false
    }),
    filter(() => false),
  )
}

const socketDisconnectEpic = (action$: Observable<any>) => {
  return action$.pipe(
    ofType('auth/reset'),
    map(() => {
      connection.disconnect()
      return false
    }),
    filter(() => false),
  )
}

const socketEpic$ = () => socketAction$

export const epics = combineEpics(socketRegisterEpic$, socketEpic$, socketConnectEpic, socketDisconnectEpic)
