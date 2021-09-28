'use strict';

const Puzzle = require('./Puzzle.js');
const { fork } = require('child_process');
class Lab1 {
  start() {
    const puzzle = new Puzzle([
      [2, 6, 5],
      [1, 3, 8],
      [null, 4, 7],
    ]);

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
