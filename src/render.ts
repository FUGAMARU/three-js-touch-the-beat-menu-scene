import * as THREE from "three"
import { GLTFLoader, CSS3DObject } from "three/examples/jsm/Addons.js"
import { RangeHelper } from "./RangeHelper"
import {
  MAX_PARTICLE_DISTANCE,
  MIN_PARTICLE_DISTANCE,
  FLOOR_COLOR,
  POINT_LIGHT_INTENSITY,
  POINT_LIGHT_Y_POSITION,
  YOUTUBE_ID,
  VIDEO_PATH
} from "./main"
import GUI from "lil-gui"

export const render = async ({
  scene,
  gui,
  lilGuiConfig
}: {
  scene: THREE.Scene
  gui: GUI
  lilGuiConfig: Record<string, boolean>
}) => {
  /** ヘルパー */
  const gridHelper = new THREE.GridHelper(30, 30)
  scene.add(gridHelper)
  gridHelper.position.set(0, 0.1, 0)
  gui.add(lilGuiConfig, "showGridHelper").onChange((value: boolean) => {
    if (value) {
      scene.add(gridHelper)
    } else {
      scene.remove(gridHelper)
    }
  })
  const axesHelper = new THREE.AxesHelper(5)
  gui.add(lilGuiConfig, "showAxisHelper").onChange((value: boolean) => {
    if (value) {
      scene.add(axesHelper)
    } else {
      scene.remove(axesHelper)
    }
  })

  const minParticleDistanceHelper = new RangeHelper(
    MAX_PARTICLE_DISTANCE,
    0x00ff00
  )
  minParticleDistanceHelper.position.set(0, 0.1, 0)
  gui
    .add(lilGuiConfig, "showMinParticleDistanceHelper")
    .onChange((value: boolean) => {
      if (value) {
        scene.add(minParticleDistanceHelper)
      } else {
        scene.remove(minParticleDistanceHelper)
      }
    })

  const maxParticleDistanceHelper = new RangeHelper(
    MIN_PARTICLE_DISTANCE,
    0xff0000
  )
  maxParticleDistanceHelper.position.set(0, 0.2, 0)
  gui
    .add(lilGuiConfig, "showMaxParticleDistanceHelper")
    .onChange((value: boolean) => {
      if (value) {
        scene.add(maxParticleDistanceHelper)
      } else {
        scene.remove(maxParticleDistanceHelper)
      }
    })

  /** ライティング */
  const pointLight = new THREE.PointLight(0xffffff, POINT_LIGHT_INTENSITY)
  pointLight.position.set(0, POINT_LIGHT_Y_POSITION, 0)
  scene.add(pointLight)

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 3)
  gui.add(lilGuiConfig, "showPointLightHelper").onChange((value: boolean) => {
    if (value) {
      scene.add(pointLightHelper)
    } else {
      scene.remove(pointLightHelper)
    }
  })

  /** 円形の床 */
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(80, 64),
    new THREE.MeshStandardMaterial({ color: FLOOR_COLOR })
  )
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  /** 地球 (遊びで追加しただけ) */
  const nightEarthTexture = new THREE.TextureLoader().load(
    "./earth-nightmap.jpg"
  )
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({
      map: nightEarthTexture
    })
  )
  earth.position.set(-10, 10, -15)
  scene.add(earth)

  /** キズナアイの3Dモデル */
  const loader = new GLTFLoader()
  const kizunaAi = await loader.loadAsync("./kizuna-ai/scene.gltf")
  kizunaAi.scene.scale.set(0.00005, 0.00005, 0.00005)
  kizunaAi.scene.position.set(0, 1, -2)
  scene.add(kizunaAi.scene)

  /** YouTubeの埋め込み (WebXRは非対応) */
  const iframeContainer = document.createElement("div")
  iframeContainer.style.width = "720px"
  iframeContainer.style.height = "480px"
  iframeContainer.style.backgroundColor = "#000"

  const iframe = document.createElement("iframe")
  iframe.style.width = "720px"
  iframe.style.height = "480px"
  iframe.style.border = "0px"
  iframe.src = `https://www.youtube.com/embed/${YOUTUBE_ID}?controls=0`
  iframeContainer.appendChild(iframe)

  const cssObject = new CSS3DObject(iframeContainer)
  cssObject.position.set(-3, 1.5, -3)
  cssObject.scale.set(0.005, 0.005, 0.005)
  cssObject.rotation.y = 30 * (Math.PI / 180)
  scene.add(cssObject)

  /** 動画ファイルの埋め込み */
  const video = document.createElement("video")
  const videoTexture = new THREE.VideoTexture(video)
  video.src = VIDEO_PATH
  video.load()
  const planeGeometry = new THREE.PlaneGeometry(3.2, 1.8) // 16:9
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    side: THREE.DoubleSide
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.position.set(3, 1.5, -3)
  plane.rotation.y = -30 * (Math.PI / 180)
  scene.add(plane)

  /** 動画再生ボタン */
  const playButton = await loader.loadAsync("./youtube-button/scene.gltf")
  playButton.scene.scale.set(0.25, 0.25, 0.25)
  playButton.scene.position.set(2.5, 0.5, -2.5)
  playButton.scene.rotation.y = -30 * (Math.PI / 180)
  scene.add(playButton.scene)

  return {
    video,
    videoTexture,
    playButton,
    earth
  }
}
