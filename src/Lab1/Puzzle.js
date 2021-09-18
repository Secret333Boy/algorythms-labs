'use strict';

const State = require('./State.js');
const shuffle = require('./shuffle.js');
const Matrix = require('./Matrix.js');
const Tree = require('./Tree.js');

class Puzzle {
  constructor(initialState = false) {
    this.state = !initialState ? this.#generateState() : initialState;
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
      if (row.includes(null)) {
        if (row.indexOf(null) !== 0) {
          res +=
            row.slice(0, row.indexOf(null)).join(' ') +
            '  ' +
            row.slice(row.indexOf(null)).join(' ') +
            '\n';
        } else {
          res += ' ' + row.join(' ') + '\n';
        }
      } else {
        res += row.join(' ') + '\n';
      }
    }
    return res;
  }

  findSolution() {
    const tree = new Tree();
    tree.insert([this.state]);
    console.dir(tree, { depth: null });
  }
}

module.exports = Puzzle;
