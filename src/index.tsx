import React from 'react'
import ReactDOM from 'react-dom'

import { initializeApp } from 'firebase/app'

import App from './components/App'

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

const app = document.getElementById('app')

ReactDOM.render(<App />, app)
