'use strict';

const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
class Lab1 {
  start() {
    const puzzle = new Puzzle();

    const child = fork(__dirname + '/ResourceScanner.js');
    child.send({ name: 'start', initialState: puzzle.state.printState() });
    puzzle.findSolution(child).then(data => {
      child.send({ name: 'end', data });
    });
  }
}

module.exports = Lab1;
