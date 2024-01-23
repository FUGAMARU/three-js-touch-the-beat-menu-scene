import * as THREE from "three"
import { GLTF, XRControllerModelFactory } from "three/examples/jsm/Addons.js"

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

export const listener = ({
  renderer,
  scene,
  camera,
  video,
  playButton
}: {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  video: HTMLVideoElement
  playButton: GLTF
}) => {
  const onClick = (e: MouseEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObject(playButton.scene, true)

    if (intersects.length > 0) {
      video.play()
    }
  }

  const addController = (idx: number) => {
    const controller = renderer.xr.getController(idx)
    scene.add(controller)

    const controllerGrip = renderer.xr.getControllerGrip(idx)
    controllerGrip.add(
      controllerModelFactory.createControllerModel(controllerGrip)
    )
    scene.add(controllerGrip)

    controller.add(line.clone())
    return controller
  }

  const controllerModelFactory = new XRControllerModelFactory()

  const ray = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1)
  ])
  const line = new THREE.Line(ray)
  line.name = "line"
  line.scale.z = 5

  // コントローラー用のクリックイベントを書くのが面倒なので、今回は表示するだけに留める。
  addController(0)
  addController(1)

  window.addEventListener("mousedown", onClick, false)
}
