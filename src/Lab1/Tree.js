'use strict';

const Graph = require('./Graph.js');
const Matrix = require('./Matrix.js');
const Vertex = require('./Vertex.js');

class Tree extends Graph {
  constructor(obj) {
    const vertex = Vertex.isVertex(obj) ? obj : new Vertex(obj);
    super([vertex], new Matrix([[0]]));
  }
}

module.exports = Tree;
