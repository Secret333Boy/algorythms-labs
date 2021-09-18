'use strict';
const GUI = require('./GUI.js');
const Puzzle = require('./Puzzle.js');
class Lab1 {
  start() {
    const gui = new GUI();
    const puzzle = new Puzzle();
    gui.clear();
    gui.sendMessage('Current state:\n');
    gui.sendMessage(puzzle.printState());
  }
}

module.exports = Lab1;
