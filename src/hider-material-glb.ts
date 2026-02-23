import * as ecs from '@8thwall/ecs'

const {THREE} = (window as any)

const applyHiderMaterial = (mesh: any) => {
  const hiderMaterial = new THREE.MeshStandardMaterial()
  hiderMaterial.colorWrite = false

  if (!mesh) {
    return
  }
  if (mesh.material) {
    mesh.material = hiderMaterial
  }
  mesh.traverse((node: any) => {
    if (node.isMesh) {
      node.material = hiderMaterial
    }
  })
}

ecs.registerComponent({
  name: 'hider-material-glb',
  schema: {
    targetEntity: ecs.eid,  // Entity ID for the entity to apply the hider material
  },
  data: {
    applied: ecs.boolean,
  },
  add: (world, component) => {
    const {targetEntity} = component.schema

    if (!targetEntity) {
      console.error('Target entity not set in schema')
      return
    }

    component.data.applied = false
  },
  tick: (world, component) => {
    const {targetEntity} = component.schema

    if (component.data.applied) {
      return
    }

    const object3D = world.three.entityToObject.get(targetEntity)
    if (object3D && object3D.userData.gltf) {
      applyHiderMaterial(object3D)
      component.data.applied = true
    }
  },
})
