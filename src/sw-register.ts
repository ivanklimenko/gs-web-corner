import { Workbox } from 'workbox-window'

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/service-worker.js')

  wb.register()
} else {
  console.log('no service worker API')
}
