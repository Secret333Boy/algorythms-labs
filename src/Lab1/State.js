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

  changeState(dir) {
    const { nullX, nullY } = this.matrix.find(null);
    const arr = this.matrix.arr.slice(0);
    let buf;
    if (dir === 't') {
      buf = arr[nullX][nullY + 1];
      arr[nullX][nullY + 1] = null;
    } else if (dir === 'b') {
      buf = arr[nullX][nullY - 1];
      arr[nullX][nullY - 1] = null;
    } else if (dir === 'l') {
      buf = arr[nullX + 1][nullY];
      arr[nullX + 1][nullY] = null;
    } else if (dir === 'r') {
      buf = arr[nullX - 1][nullY];
      arr[nullX - 1][nullY - 1] = null;
    }
    arr[nullX][nullY] = buf;
    const newMatrix = new Matrix(arr);
    return new State(newMatrix);
  }

  get possibleChanges() {
    const { nullX, nullY } = this.matrix.find(null);

    const possible = [
      [
        ['t', 'l'],
        ['t', 'l', 'r'],
        ['t', 'r'],
      ],
      [
        ['t', 'b', 'l'],
        ['t', 'b', 'l', 'r'],
        ['t', 'b', 'r'],
      ],
      [
        ['b', 'l'],
        ['b', 'l', 'r'],
        ['b', 'r'],
      ],
    ];
    return possible[nullX][nullY];
  }
}

module.exports = State;
