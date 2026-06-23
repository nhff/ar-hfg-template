import css from './index.css'

const onxrloaded = () => {
  console.log('XR8 loaded, configuring image targets...')
  XR8.XrController.configure({
    imageTargetData: [
      require('./image-targets/video-target.json'),
    ],
  })
  console.log('Image target configured')
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
AFRAME.registerComponent('no-frustrum-cull', {
  init() {
    const models = this.el.querySelectorAll('[gltf-model]')
    models.forEach((el) => {
      el.addEventListener('model-loaded', () => {
        el.object3D.traverse((object) => {
          object.frustumCulled = false
        })
      })
    })
  },
})

window.addEventListener('xrimagefound', (e) => {
  console.log('IMAGE FOUND:', JSON.stringify(e.detail))
})
window.addEventListener('xrimageupdated', (e) => {
  console.log('IMAGE UPDATED:', JSON.stringify(e.detail))
})
window.addEventListener('xrimagelost', (e) => {
  console.log('IMAGE LOST')
})

window.addEventListener('realityerror', (e) => {
  console.error('REALITY ERROR (window):', e.detail && e.detail.error)
  if (e.detail && e.detail.error) {
    console.error('Message:', e.detail.error.message)
    console.error('Stack:', e.detail.error.stack)
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene')
  if (scene) {
    scene.addEventListener('realityerror', (e) => {
      console.error('REALITY ERROR (scene):', e.detail && e.detail.error)
      if (e.detail && e.detail.error) {
        console.error('Message:', e.detail.error.message)
      }
    })
  }
})