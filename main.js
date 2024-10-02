import './style.css'
import * as THREE from 'three'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

// Creating Canvas
const canvasHTML = document.createElement('canvas')
canvasHTML.classList.add('webgl')
document.body.prepend(canvasHTML)

// Canvas Variable
const canvas = document.querySelector('.webgl')

// GUI
const gui = new GUI()
const paramaters = {
  materialColor: '#ffeded',
  count: 500 
}
gui
.addColor(paramaters, 'materialColor')
.onChange(() => {
  material.color.set(paramaters.materialColor)
  particlesMaterial.color.set(paramaters.materialColor)
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
  new THREE.OctahedronGeometry(1),
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
// Y
mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
// X
mesh1.position.x = 1
mesh2.position.x = - 1
mesh3.position.x = 1

// Particles
const positions = new Float32Array(paramaters.count)
for(let i = 0; i < paramaters.count; i++){
  positions[i * 3] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particlesMaterial = new THREE.PointsMaterial({
  color: paramaters.materialColor,
  size: 0.03,
  sizeAttenuation: true
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
cameraGroup.add(camera)

// Scroll
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)
  if(currentSection !== newSection){
    currentSection = newSection
    gsap.to(
      sectionMeshes[currentSection].rotation,
      {
        duration: 1.5,
        ease: 'back.inOut',
        x: '+=3',
        y: '+=6',
        z: '+=1.5'
      }
    )
  }
 })

// Cursor
const cursor = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5 // by dividing/ minus get a value between -0.5/0.5
  cursor.y = e.clientY / sizes.height - 0.5
})

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true // makes canvas transparent
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
  const delta = timer.getDelta()
  // rotation animation
  for(const mesh of sectionMeshes){
    mesh.rotation.x += delta * 0.1
    mesh.rotation.y += delta * 0.12
  }
  // camera scroll
  camera.position.y = - scrollY / sizes.height * objectsDistance
  // parralax
  const parralaxX = cursor.x * 0.5
  const parralaxY = - cursor.y * 0.5
  cameraGroup.position.x += (parralaxX - cameraGroup.position.x) * delta * 5
  cameraGroup.position.y += (parralaxY - cameraGroup.position.y) * delta * 5

  // rendering any changes
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()