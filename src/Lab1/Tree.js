'use strict';

const Graph = require('./Graph.js');
const Matrix = require('./Matrix.js');
const Vertex = require('./Vertex.js');

class Tree extends Graph {
  constructor(obj) {
    const vertex = Vertex.isVertex(obj) ? obj : new Vertex(obj);
    super([vertex], new Matrix([[0]]));
    this.expandable = [vertex];
  }

  expand(vertex, ...verteces) {
    this.insert(verteces);
    const v1 = this.verteces.indexOf(vertex);
    for (const v of verteces) {
      const v2 = this.verteces.indexOf(v);
      this.connect(v1, v2);
    }

    this.expandable.push(...verteces);
  }
}

module.exports = Tree;
