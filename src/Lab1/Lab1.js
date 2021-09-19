'use strict';

const GUI = require('./GUI.js');
const Puzzle = require('./Puzzle.js');
class Lab1 {
  start() {
    const gui = new GUI();
    const puzzle = new Puzzle([
      [1, 4, 2],
      [3, null, 5],
      [6, 7, 8],
    ]);
    gui.clear();
    gui.sendMessage('Current state:\n');
    gui.sendMessage(puzzle.printState());

    console.time('Solution');
    puzzle.findSolution().then(data => {
      gui.sendMessage('Solution found:\n' + data);
      console.timeEnd('Solution');
    });
  }
}

module.exports = Lab1;
