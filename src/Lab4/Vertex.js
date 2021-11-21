'use strict';

class Vertex {
  constructor(data = null) {
    this.data = data;
    this.links = new Set();
  }

  linkTo(...verteces) {
    verteces.forEach(this.links.add, this.links);
  }

  unlinkFrom(...verteces) {
    verteces.forEach(this.links.delete, this.links);
  }

  static isVertex(obj) {
    return obj instanceof Vertex;
  }

  get power() {
    return this.links.size;
  }
}

module.exports = Vertex;
