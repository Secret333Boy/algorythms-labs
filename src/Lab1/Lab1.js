'use strict';

const GUI = require('./GUI.js');
const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
class Lab1 {
  start() {
    const gui = new GUI();
    const puzzle = new Puzzle();
    gui.clear();
    gui.sendMessage('Current state:\n');
    gui.sendMessage(puzzle.printState());

    const child = fork(__dirname + '/ResourceScanner.js');
    child.send('start');
    puzzle.findSolution().then(data => {
      gui.sendMessage('Solution found:\n', data);
      child.send('end');
    });
  }
}

module.exports = Lab1;
