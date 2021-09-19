'use strict';

const State = require('./State.js');
const Matrix = require('./Matrix.js');
const Tree = require('./Tree.js');
const shuffle = require('./shuffle.js');

class Puzzle {
  constructor(initialState = false) {
    this.state = !initialState
      ? this.#generateState()
      : new State(new Matrix(initialState));
  }

  #generateState() {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, null];
    const shuffledIds = shuffle(ids);
    const arr = new Matrix([
      shuffledIds.slice(0, 3),
      shuffledIds.slice(3, 6),
      shuffledIds.slice(6, 9),
    ]);
    return new State(arr);
  }

  printState() {
    let res = '';
    for (const row of this.state.matrix.rows) {
      const newRow = row.slice(0);

      if (newRow.includes(null)) {
        newRow[newRow.indexOf(null)] = ' ';
      }
      res += newRow.join(' ') + '\n';
    }
    return res;
  }

  async findSolution() {
    return new Promise(resolve => {
      const tree = new Tree(this.state);
      resolve(tree);
    });
  }
}

module.exports = Puzzle;
