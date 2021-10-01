'use strict';

const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
const examples = require('./initialStatesExamples/examples.js');
class Lab1 {
  start() {
    const puzzle = new Puzzle(examples[19]);

    // const puzzle = new Puzzle();

    const child = fork(__dirname + '/ResourceScanner.js');
    child.send({
      name: 'start',
      initialState: puzzle.state.printState(),
      debug: false,
    });
    puzzle
      .findSolutionBFS(child)
      .then(data => {
        let vertex = Array.isArray(data) ? data[0] : data;
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
