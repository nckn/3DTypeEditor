import RoundedBoxGeometry from './roundedBox';

export default class Box {
  constructor(_options) {
    this.size = _options.size;
    this.geom = new RoundedBoxGeometry(this.size, this.size, this.size, .02, .2);
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
  }
}
