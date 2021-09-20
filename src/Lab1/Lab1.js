'use strict';

const GUI = require('./GUI.js');
const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
class Lab1 {
  start() {
    const gui = new GUI();
    const puzzle = new Puzzle();

    const child = fork(__dirname + '/ResourceScanner.js');
    child.send({ name: 'start', initialState: puzzle.printState() });
    puzzle.findSolution(child).then(data => {
      gui.sendMessage('Solution found:\n', data);
      child.send({ name: 'end' });
    });
  }
}

module.exports = Lab1;
