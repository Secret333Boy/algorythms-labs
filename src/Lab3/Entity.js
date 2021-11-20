'use strict';

class Entity {
  constructor(genes, items) {
    this.genes = genes;
    this.items = items;
  }

  get weight() {
    let w = 0;
    for (const item of this.items) {
      w += item.weight;
    }
    return w;
  }

  get value() {
    let v = 0;
    for (const item of this.items) {
      v += item.value;
    }
    return v;
  }
}

module.exports = Entity;
