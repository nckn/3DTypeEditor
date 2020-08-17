import * as THREE from 'three'

// import { radians } from '../helpers';

export default class Cylinder {
  constructor(_options) {
    this.size = _options.size
    this.geom = new THREE.CylinderGeometry(this.size.w, this.size.w, this.size.d, 64)
    this.rotationX = 0;
    this.rotationY = 0;
    // this.rotationZ = radians(-180);
  }
}
