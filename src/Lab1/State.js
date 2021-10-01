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

  printState() {
    let res = '';
    for (const row of this.matrix.rows) {
      const newRow = row.slice(0);

      if (newRow.includes(null)) {
        newRow[newRow.indexOf(null)] = ' ';
      }
      res += newRow.join(' ') + '\n';
    }
    return res;
  }

  changeState(dir) {
    let { x, y } = this.matrix.find(null);
    x = Number(x);
    y = Number(y);

    const arr = this.matrix.copy().arr;

    let buf;
    if (dir === 't') {
      buf = arr[y + 1][x];
      arr[y + 1][x] = null;
    } else if (dir === 'b') {
      buf = arr[y - 1][x];
      arr[y - 1][x] = null;
    } else if (dir === 'l') {
      buf = arr[y][x + 1];
      arr[y][x + 1] = null;
    } else if (dir === 'r') {
      buf = arr[y][x - 1];
      arr[y][x - 1] = null;
    }
    arr[y][x] = buf;
    const newMatrix = new Matrix(arr);
    return new State(newMatrix);
  }

  get possibleChanges() {
    let { x, y } = this.matrix.find(null);
    x = Number(x);
    y = Number(y);
    return State.possible[y][x];
  }

  get h() {
    let res = 0;

    for (const i in this.matrix.arr) {
      for (const j in this.matrix.arr[i]) {
        if (State.GoalState[i][j] !== this.matrix.arr[i][j]) res++;
      }
    }

    return res;
  }

  static possible = [
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

  static GoalState = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ];
}

module.exports = State;
