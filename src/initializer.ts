import {
  CSS3DRenderer,
  OrbitControls,
  VRButton
} from "three/examples/jsm/Addons.js"
import { PerspectiveCamera } from "three"
import * as THREE from "three"
import Stats from "three/examples/jsm/libs/stats.module.js"
import GUI from "lil-gui"

const renderer = new THREE.WebGLRenderer({ antialias: true })
document.body.appendChild(renderer.domElement)

const cssRenderer = new CSS3DRenderer()
cssRenderer.setSize(window.innerWidth, window.innerHeight)
cssRenderer.domElement.style.position = "absolute"
cssRenderer.domElement.style.top = "0"
cssRenderer.domElement.style.pointerEvents = "none"
document.body.appendChild(cssRenderer.domElement)

let camera: PerspectiveCamera | undefined = undefined

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)
document.body.appendChild(VRButton.createButton(renderer))

const gui = new GUI()
const lilGuiConfig = {
  showGridHelper: false,
  showAxisHelper: false,
  showMinParticleDistanceHelper: false,
  showMaxParticleDistanceHelper: false,
  showPointLightHelper: false
}

export const initializer = () => {
  const scene = new THREE.Scene()
  const width = window.innerWidth
  const height = window.innerHeight

  camera = new THREE.PerspectiveCamera(45, width / height)
  camera.position.set(0, 10, 10) // W ebXRではこのカメラ座標は無視される(?)

  new OrbitControls(camera, renderer.domElement)

  renderer.xr.enabled = true

  onResize()

  return {
    renderer,
    cssRenderer,
    scene,
    camera,
    stats,
    gui,
    lilGuiConfig
  } as const
}

const onResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)

  if (!camera) return
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}
window.addEventListener("resize", onResize)
