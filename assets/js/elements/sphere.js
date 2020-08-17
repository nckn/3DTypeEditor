import * as THREE from 'three'

import { radians } from '../helpers';

export default class Sphere {
  constructor(_options) {
    this.geom = new THREE.SphereGeometry(_options.size, 24, 24);
    this.rotationX = 0;
    this.rotationY = 0;
    // this.rotationZ = radians(-180);
    this.rotationZ = 0;
  }
}
