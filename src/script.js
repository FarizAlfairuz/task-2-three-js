import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// Texture Loader
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Points
 */
const points = [
  // Netherlands
  {
    position: new THREE.Vector3(1.039, 1.599, 0.639),
    element: document.querySelector(".point-0"),
  },
  // Belgium
  {
    position: new THREE.Vector3(
      1.0474336392473954,
      1.5759827730142242,
      0.6541163668576022
    ),
    element: document.querySelector(".point-1"),
  },
  // Germany
  {
    position: new THREE.Vector3(1.085, 1.567, 0.627),
    element: document.querySelector(".point-2"),
  },
  // Austria
  {
    position: new THREE.Vector3(
      1.2426404425158757,
      1.474155333132694,
      0.5743228052618519
    ),
    element: document.querySelector(".point-3"),
  },
  // Sweden
  {
    position: new THREE.Vector3(
      0.957581403913772,
      1.7323074711188417,
      0.3389883586574791
    ),
    element: document.querySelector(".point-4"),
  },
  // Finland
  {
    position: new THREE.Vector3(
      0.9225527393557189,
      1.776733697555847,
      0.15735593968196138
    ),
    element: document.querySelector(".point-5"),
  },
  // Norway
  {
    position: new THREE.Vector3(
      0.8600184970045821,
      1.756543946229239,
      0.45329169799987445
    ),
    element: document.querySelector(".point-6"),
  },
  // Denmark
  {
    position: new THREE.Vector3(
      1.0133435518936371,
      1.66737194263437,
      0.504723231964263
    ),
    element: document.querySelector(".point-7"),
  },
  // UK
  {
    position: new THREE.Vector3(
      0.9369259782249957,
      1.6211983854271854,
      0.7127550168023249
    ),
    element: document.querySelector(".point-8"),
  },
]

/**
 * Model
 */
const earthTexture = textureLoader.load("./earth.jpg")
earthTexture.colorSpace = THREE.SRGBColorSpace
const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture })
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
earth.rotateY(Math.PI * -0.2)
scene.add(earth)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.autoRotate = true
controls.autoRotateSpeed = 0.5
controls.target.set(0, 0, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update controls
  controls.update()

  for (const point of points) {
    const screenPosition = point.position.clone()
    screenPosition.project(camera)

    raycaster.setFromCamera(screenPosition, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length === 0) {
      point.element.classList.add("visible")
    } else {
      const intersectionDistance = intersects[0].distance
      const pointDistance = point.position.distanceTo(camera.position)

      if (intersectionDistance < pointDistance) {
        point.element.classList.remove("visible")
      } else {
        point.element.classList.add("visible")
      }
    }

    const translateX = screenPosition.x * sizes.width * 0.5
    const translateY = -screenPosition.y * sizes.height * 0.5
    point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
