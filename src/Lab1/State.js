'use strict';

const Matrix = require('./Matrix.js');

class State {
  constructor(matrix) {
    this.#checkMatrix(matrix);
    this.matrix = matrix;
  }

  #checkMatrix(matrix) {
    if (
      Matrix.isMatrix(matrix) &&
      matrix.yLength !== 3 &&
      matrix.xLength !== 3 &&
      matrix.arr.some(el => !Array.isArray(el))
    ) {
      throw new Error('Unappropriate state structure');
    }
  }
}

module.exports = State;
