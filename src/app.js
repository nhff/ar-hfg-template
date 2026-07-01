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

// Replaces every material on a loaded gltf-model with A-Frame's standard
// material (THREE.MeshStandardMaterial, the same PBR shader A-Frame's built-in
// `material` component uses by default). We traverse the loaded model because
// the built-in `material` component does not affect GLTF-embedded materials.
AFRAME.registerComponent('standard-material', {
  init() {
    const applyStandardMaterial = () => {
      this.el.object3D.traverse((object) => {
        if (object.material) {
          const wasArray = Array.isArray(object.material)
          const materials = wasArray ? object.material : [object.material]
          const converted = materials.map((material) => {
            const standard = new THREE.MeshStandardMaterial()
            // Carry over the source texture/color so the model still looks right.
            if (material.map) standard.map = material.map
            if (material.color) standard.color.copy(material.color)
            standard.transparent = material.transparent
            standard.alphaTest = material.alphaTest
            standard.side = material.side
            standard.needsUpdate = true
            return standard
          })
          // Preserve the original shape: a single-material mesh must keep a
          // single material, not a one-element array (three.js only renders
          // array materials against matching geometry groups).
          object.material = wasArray ? converted : converted[0]
        }
      })
    }
    if (this.el.getObject3D('mesh')) {
      applyStandardMaterial()
    }
    this.el.addEventListener('model-loaded', applyStandardMaterial)
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

