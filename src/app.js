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

