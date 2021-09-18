'use strict';

const Graph = require('./Graph');

class Tree extends Graph {
  constructor(vertices, matrix) {
    super(vertices, matrix);
  }
}

module.exports = Tree;
