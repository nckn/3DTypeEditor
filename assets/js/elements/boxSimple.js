import * as THREE from 'three'

export default class Box {
  constructor(_options) {
    this.size = _options.size;
    this.geom = new THREE.BoxGeometry(this.size.w, this.size.h, this.size.d)
    this.rotationX = 0
    this.rotationY = 0
    this.rotationZ = 0
  }
}
