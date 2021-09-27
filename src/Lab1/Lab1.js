'use strict';

const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
class Lab1 {
  start() {
    const puzzle = new Puzzle([
      [2, 3, 6],
      [4, 1, 5],
      [7, null, 8],
    ]);

    const child = fork(__dirname + '/ResourceScanner.js');
    child.send({
      name: 'start',
      initialState: puzzle.state.printState(),
      debug: false,
    });
    puzzle
      .findSolutionRBFS(child)
      .then(vertex => {
        const res = [];
        while (vertex.data.chosenChange) {
          res.unshift(vertex.data.chosenChange);
          vertex = vertex.data.parent;
        }

        child.send({ name: 'end', data: res.join('->') });
      })
      .catch(reason => {
        child.send({ name: 'error', data: reason.toString() });
      });
  }
}

module.exports = Lab1;
