'use strict';

class Vertix {
  constructor(x, y, data = null) {
    this.x = x;
    this.y = y;
    this.data = data;
  }

  static isVertix(obj) {
    return obj instanceof Vertix;
  }
}

module.exports = Vertix;
