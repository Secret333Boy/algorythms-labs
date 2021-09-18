'use strict';

const State = require('./State.js');
const shuffle = require('./shuffle.js');
const Matrix = require('./Matrix.js');

class Puzzle {
  constructor(autoGenerate = true, initialState = false) {
    this.state =
      autoGenerate || !initialState ? this.#generateState() : initialState;
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
        row[row.indexOf(null)] = ' ';
      }

      res += row.join(' ') + '\n';
    }
    return res;
  }
}

module.exports = Puzzle;
