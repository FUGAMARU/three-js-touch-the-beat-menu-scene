import * as THREE from "three"
import {
  MAX_PARTICLE_DISTANCE,
  MIN_PARTICLE_DISTANCE,
  MAX_PARTICLE_DISTINATION_HEIGHT,
  MIN_PARTICLE_DISTINATION_HEIGHT,
  PARTICLE_COLORS,
  PARTICLE_SIZE,
  PARTICLE_OPACITY
} from "./main"

/** 0～360°の範囲でランダムな角度を生成する */
const generateRandomAngle = () => Math.floor(Math.random() * 361)

/** ランダムなラジアンを生成する */
export const getRandomRadian = (max: number) => Math.random() * max

/** 指定されている範囲内でランダムな原点からの距離を生成する */
const generateRandomDistance = () =>
  Math.floor(
    Math.random() * (MAX_PARTICLE_DISTANCE - MIN_PARTICLE_DISTANCE + 1)
  ) + MIN_PARTICLE_DISTANCE

/** ランダムなY座標を生成する */
export const getRandomYDistnation = () =>
  Math.random() *
    (MAX_PARTICLE_DISTINATION_HEIGHT - MIN_PARTICLE_DISTINATION_HEIGHT) +
  MIN_PARTICLE_DISTINATION_HEIGHT

/** ランダムな平面座標を生成する */
const generateRandomPlaneCoordinates = () => {
  const randomizedAngle = generateRandomAngle()
  const rad = randomizedAngle * (Math.PI / 180)

  const randomizedDistance = generateRandomDistance()

  const cos = Math.cos(rad)
  const x = cos * randomizedDistance

  const sin = Math.sin(rad)
  const z = sin * randomizedDistance

  return { x, z } as const
}

/** ランダムな色を生成する */
const generateRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PARTICLE_COLORS.length)
  return PARTICLE_COLORS[randomIndex]
}

/** ランダムなジオメトリを生成する */
const generateRandomGeometry = () => {
  /** 三角形 */
  const triangleShape = new THREE.Shape()
  triangleShape.moveTo(0, 0)
  triangleShape.lineTo(1, 0)
  triangleShape.lineTo(0, 1)
  triangleShape.lineTo(0, 0)

  const geometries = [
    new THREE.TetrahedronGeometry(0.8),
    new THREE.ShapeGeometry(triangleShape)
  ]
  const randomIndex = Math.floor(Math.random() * geometries.length)
  return geometries[randomIndex]
}

/** ランダムなメッシュを生成する */
export const createRandomMesh = () => {
  const geometry = generateRandomGeometry()
  const material = new THREE.MeshBasicMaterial({
    color: generateRandomColor(),
    wireframe: true,
    transparent: true,
    opacity: PARTICLE_OPACITY
  })
  const mesh = new THREE.Mesh(geometry, material)

  const { x, z } = generateRandomPlaneCoordinates()
  mesh.position.set(x, -0.5, z)
  mesh.scale.set(PARTICLE_SIZE, PARTICLE_SIZE, PARTICLE_SIZE)

  return mesh
}
