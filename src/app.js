import css from './index.css'


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

