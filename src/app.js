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
// Sets the alphaTest threshold on all materials of a loaded gltf-model.
// The built-in `material` component does not affect GLTF-embedded materials,
// so we traverse the loaded model and set alphaTest directly.
AFRAME.registerComponent('alpha-test', {
  schema: {default: 0.5},
  init() {
    const applyAlphaTest = () => {
      this.el.object3D.traverse((object) => {
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => {
            material.alphaTest = this.data
            material.needsUpdate = true
          })
        }
      })
    }
    if (this.el.getObject3D('mesh')) {
      applyAlphaTest()
    }
    this.el.addEventListener('model-loaded', applyAlphaTest)
  },
})

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

