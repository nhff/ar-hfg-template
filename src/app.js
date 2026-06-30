import './index.css'
import {
  registerDmsMirrorShards,
  setupDmsWorldLifecycle,
  showRuntimeWarning,
  wireDmsControls,
} from './integrations/dms/mirror-shards'

setupDmsWorldLifecycle()

function boot() {
  if (window.AFRAME) {
    registerDmsMirrorShards()
    return
  }

  console.warn('A-Frame runtime was not available when bundle.js ran')
  showRuntimeWarning('A-Frame runtime did not load. Build the project, serve it over HTTPS, and test on a supported mobile browser.')
}

boot()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireDmsControls, { once: true })
} else {
  wireDmsControls()
}
