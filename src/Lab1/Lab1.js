'use strict';

const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
class Lab1 {
  start() {
    const puzzle = new Puzzle();

    const child = fork(__dirname + '/ResourceScanner.js');
    child.send({
      name: 'start',
      initialState: puzzle.state.printState(),
      debug: false,
    });
    puzzle
      .findSolution(child)
      .then(vertex => {
        const res = [];
        while (vertex.data.chosenChange) {
          res.unshift(vertex.data.chosenChange);
          vertex = vertex.data.parent;
        }

        child.send({ name: 'end', data: res.join('->') });
      })
      .catch(reason => {
        child.send({ name: 'error', data: reason });
      });
  }
}

module.exports = Lab1;
