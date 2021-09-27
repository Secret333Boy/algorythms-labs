'use strict';

const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
class Lab1 {
  start() {
    const puzzle = new Puzzle([
      [5, 1, null],
      [6, 3, 2],
      [4, 7, 8],
    ]);

    const child = fork(__dirname + '/ResourceScanner.js');
    child.send({
      name: 'start',
      initialState: puzzle.state.printState(),
      debug: false,
    });
    puzzle
      .findSolutionRBFS(child)
      .then(([vertex]) => {
        const res = [];
        while (vertex.data.chosenChange) {
          res.unshift(vertex.data.chosenChange);
          vertex = vertex.data.parent;
        }

        // console.log(res.join('->'));
        child.send({ name: 'end', data: res.join('->') });
      })
      .catch(reason => {
        // console.error(reason);
        child.send({ name: 'error', data: reason.toString() });
      });
  }
}

module.exports = Lab1;
