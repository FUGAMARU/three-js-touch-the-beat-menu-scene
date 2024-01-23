// ChatGPT作

import * as THREE from "three"

// カスタムの範囲ヘルパー
export class RangeHelper extends THREE.Object3D {
  constructor(radius: number, color: number) {
    super()

    // ヘルパーオブジェクトを作成
    const geometry = new THREE.CircleGeometry(radius, 64)
    const material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    })
    const mesh = new THREE.Mesh(geometry, material)

    // メッシュをヘルパーオブジェクトに追加
    this.add(mesh)

    // ヘルパーオブジェクトの回転を設定
    this.rotation.x = Math.PI / 2
  }
}
