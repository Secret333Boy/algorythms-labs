'use strict';

const State = require('./State.js');
const Matrix = require('./Matrix.js');
const Tree = require('./Tree.js');
const shuffle = require('./shuffle.js');
const Vertex = require('./Vertex.js');

class Puzzle {
  constructor(initialState = false) {
    this.state = !initialState
      ? this.#generateState()
      : new State(new Matrix(initialState));
  }

  #generateState() {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, null];
    const shuffledIds = shuffle(ids);
    const arr = new Matrix([
      shuffledIds.slice(0, 3),
      shuffledIds.slice(3, 6),
      shuffledIds.slice(6, 9),
    ]);
    return new State(arr);
  }

  findSolution(logger) {
    return new Promise(resolve => {
      const rootNode = new Vertex({
        state: this.state,
        chosenChange: null,
        parent: null,
      });
      const tree = new Tree(rootNode);
      let solution = false;
      while (!solution) {
        const parent = tree.expandable[0];
        const childVerteces = [];
        for (const possibleChange of parent.data.state.possibleChanges) {
          const newVertex = new Vertex({
            state: parent.data.state.changeState(possibleChange),
            chosenChange: possibleChange,
            parent,
          });
          if (
            newVertex.data.state.matrix.isEqual(
              new Matrix(Puzzle.solutionTemplate)
            )
          ) {
            solution = newVertex;
            break;
          }
          childVerteces.push(newVertex);
        }
        tree.expand(parent, ...childVerteces);
        logger.send({ name: 'memory', data: process.memoryUsage() });
      }
      resolve(solution);
    });
  }

  static solutionTemplate = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ];
}

module.exports = Puzzle;
