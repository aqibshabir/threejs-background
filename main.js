import './style.css'
import * as THREE from 'three'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

// Creating Canvas
const canvasHTML = document.createElement('canvas')
canvasHTML.classList.add('webgl')
document.body.prepend(canvasHTML)

// Canvas Variable
const canvas = document.querySelector('.webgl')

// GUI
const gui = new GUI()
const paramaters = {
  materialColor: '#ffeded' 
}
gui
.addColor(paramaters, 'materialColor')
.onChange(() => {
  material.color.set(paramaters.materialColor)
})


// Scene
const scene = new THREE.Scene()

// Texture
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load('textures/gradients/3.jpg')
gradient.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
  color: paramaters.materialColor,
  gradientMap: gradient
})

// Meshes
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)
const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)
scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

// Positioning
const objectsDistance = 4
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2


// Lighting
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)

// Size Object
const sizes = {
  height: window.innerHeight,
  width: window.innerWidth
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio),2)
renderer.render(scene, camera)

// Updating Screen Size
window.addEventListener('resize', () => {
  sizes.height = window.innerHeight
  sizes.width = window.innerWidth

  camera.aspect = sizes.width / sizes.height

  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio),2)
})

// Timer
const timer = new Timer()

// Animation
const tick = () => {
  // timer for animation
  timer.update()
  const elapsed = timer.getElapsed()
  //rotation animation
  for(const mesh of sectionMeshes){
    mesh.rotation.x = elapsed * 0.1
    mesh.rotation.y = elapsed * 0.12
  }

  // rendering any changes
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()