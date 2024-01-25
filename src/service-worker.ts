import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import { offlineFallback } from 'workbox-recipes'
import { setDefaultHandler } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'

initializeApp({
  apiKey: 'AIzaSyC8xAMaoRYNCjzI_aDtX_bOaoZtxKW9Q2U',
  authDomain: 'hungryninja-4c3a9.firebaseapp.com',
  databaseURL: 'https://hungryninja-4c3a9.firebaseio.com',
  projectId: 'hungryninja-4c3a9',
  storageBucket: 'hungryninja-4c3a9.appspot.com',
  messagingSenderId: '967337440965',
  appId: '1:967337440965:web:7770bcefe3e8ab26a2e2ac',
  measurementId: 'G-P9GYMMLE8X',
})

const messaging = getMessaging()

onBackgroundMessage(messaging, (payload) => {
  console.log('SW got message', payload?.notification)
  if (!payload.data) return

  const notification = payload?.notification

  const notificationTitle = notification?.title
  const notificationOptions = {
    body: notification?.body,
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

setDefaultHandler(new NetworkOnly())

offlineFallback()
