'use strict';

class Vertex {
  constructor(data = null) {
    this.data = data;
  }

  static isVertex(obj) {
    return obj instanceof Vertex;
  }
}

module.exports = Vertex;
