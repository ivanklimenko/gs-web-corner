import React from 'react'
import { Redirect, useLocation } from 'react-router-dom'

import { getMessaging, getToken, onMessage } from 'firebase/messaging'

import { useAppDispatch, useAppSelector } from '../store'
import { slice as authSlice } from '../store/auth'
import { slice as outletSlice } from '../store/outlet'

const LOGIN_ROUTE = '/login'

interface Props {
  children: React.ReactNode
}

const RefreshToken: React.FC<Props> = ({ children }) => {
  // --- EXTERNAL STATE --- //

  const location = useLocation()

  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  // --- CONSTANTS --- //

  const isLoginRoute = location.pathname === LOGIN_ROUTE

  // --- EFFECTS --- //

  React.useEffect(() => {
    if (auth.status !== 'loggedIn') return

    dispatch(outletSlice.actions.loadStart())
  }, [auth.status])

  React.useEffect(() => {
    if (auth.user && 'serviceWorker' in navigator) {
      const user = auth.user
      const messaging = getMessaging()

      navigator.serviceWorker
        .getRegistration()
        .then((reg) => getToken(messaging, { serviceWorkerRegistration: reg }))
        .then((token) => {
          if (token) {
            dispatch(authSlice.actions.saveTokenStart({ userId: user.code, token }))
            onMessage(messaging, (payload) => {
              console.log('Message received. ', payload)
            })
          } else {
            console.log('No registration token available. Request permission to generate one.')
          }
        })
        .catch((err) => {
          console.log('Unable to get permission to notify', err)
        })
    }
  }, [auth.user])

  // --- RENDERING --- //

  return auth.status === 'checking' ? (
    <div>
      <p>...</p>
    </div>
  ) : isLoginRoute && auth.status === 'loggedIn' ? (
    <Redirect to="/orders" />
  ) : !isLoginRoute && auth.status === 'loggedOut' ? (
    <Redirect to={LOGIN_ROUTE} />
  ) : (
    <>{children}</>
  )
}

export default RefreshToken
