import { initializer } from "./initializer"
import {
  createRandomMesh,
  getRandomRadian,
  getRandomYDistnation
} from "./randomizer"
import { render } from "./render"
import { listener } from "./listener"

export const MIN_PARTICLE_DISTANCE = 10 // パーティクルを描写する際の原点からの最小距離
export const MAX_PARTICLE_DISTANCE = 15 // パーティクルを描写する際の原点からの最大距離
export const MIN_PARTICLE_DISTINATION_HEIGHT = 4 // パーティクルが到達するY軸方向の最小高度
export const MAX_PARTICLE_DISTINATION_HEIGHT = 5.5 // パーティクルが到達するY軸方向の最大高度
export const PARTICLE_INCREMENT_Y_SPEED = 0.005 // パーティクルのY軸方向の移動速度
export const PARTICLE_REDUCTION_PERCENTAGE = 0.98 // パーティクルが規定のY座標まで到達してからの大きさの縮小率
export const MAX_PARTICLE_ROTATION_RADIAN = 0.004 // パーティクルの回転の最大ラジアン (大きくするほど回転が速くなる)
export const PARTICLE_SIZE = 0.4 // パーティクルサイズ
export const PARTICLE_OPACITY = 0.7 // パーティクルの透明度
export const PARTICLE_COLORS = [0xf0779b, 0x6bd3d4, 0x7fe01b] // パーティクルの色セット

export const FLOOR_COLOR = 0x262626 // 床の色
export const POINT_LIGHT_INTENSITY = 1500 // ポイントライトの強さ
export const POINT_LIGHT_Y_POSITION = 25 // ポイントライトのY座標

export const YOUTUBE_ID = "4byaJ9w47uU" // iframe内でロードするYouTubeの動画ID
export const VIDEO_PATH = "/hello-morning.mp4" // ローカルで動画を再生する場合のパス

const { renderer, cssRenderer, scene, camera, stats, gui, lilGuiConfig } =
  initializer()

const { video, videoTexture, playButton, earth } = await render({
  scene,
  gui,
  lilGuiConfig
})

listener({ renderer, scene, camera, video, playButton })

setInterval(() => {
  const mesh = createRandomMesh()

  mesh.userData.autoAdded = true
  mesh.rotation.set(
    getRandomRadian(MAX_PARTICLE_ROTATION_RADIAN),
    getRandomRadian(MAX_PARTICLE_ROTATION_RADIAN),
    getRandomRadian(MAX_PARTICLE_ROTATION_RADIAN)
  )
  mesh.userData.rotateIncremental = [
    getRandomRadian(MAX_PARTICLE_ROTATION_RADIAN),
    getRandomRadian(MAX_PARTICLE_ROTATION_RADIAN),
    getRandomRadian(MAX_PARTICLE_ROTATION_RADIAN)
  ]
  mesh.userData.yDestination = getRandomYDistnation()

  scene.add(mesh)
}, 300)

const onReRendering = () => {
  // requestAnimationFrame(onReRendering) VR対応したいのでこれは使わない
  renderer.setAnimationLoop(onReRendering) // こっちを使う

  stats.begin()

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    videoTexture.needsUpdate = true
  }

  earth.rotation.x += 0.001
  earth.rotation.y += 0.001

  scene.children.forEach(obj => {
    if (!obj.userData.autoAdded) return

    obj.position.y += PARTICLE_INCREMENT_Y_SPEED

    const { rotateIncremental } = obj.userData
    obj.rotation.x += rotateIncremental[0]
    obj.rotation.y += rotateIncremental[1]
    obj.rotation.z += rotateIncremental[2]

    if (obj.position.y >= obj.userData.yDestination) {
      obj.scale.multiplyScalar(PARTICLE_REDUCTION_PERCENTAGE)
    }

    if (obj.scale.x < 0.01 && obj.scale.y < 0.01 && obj.scale.z < 0.01) {
      scene.remove(obj)
    }
  })

  stats.end()

  renderer.render(scene, camera)
  cssRenderer.render(scene, camera)
}

onReRendering()
