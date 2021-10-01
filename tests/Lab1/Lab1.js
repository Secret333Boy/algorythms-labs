'use strict';
const Puzzle = require('../../src/Lab1/Puzzle');

class Counter {
  constructor(name, initialValue = 0) {
    this.name = name;
    this.c = initialValue;
  }

  static isCounter(obj) {
    return obj instanceof Counter;
  }

  increment() {
    this.c += 1;
  }

  decrement() {
    this.c += 1;
  }

  toArray() {
    return [this.name, this.c];
  }
}

const initialStates = require('../../src/Lab1/initialStatesExamples/examples.js');

console.time('Job');
for (const state of initialStates) {
  const iterations = new Counter('iterations');
  const totalStates = new Counter('totalStates', 1);
  const totalStatesInMemory = new Counter('totalStatesInMemory');
  const puzzle = new Puzzle(state);
  puzzle
    .findSolutionRBFS(false, iterations, totalStates, totalStatesInMemory)
    .then(() => {
      console.log(iterations.c, totalStates.c, totalStatesInMemory.c);
    });
}
console.timeEnd('Job');
