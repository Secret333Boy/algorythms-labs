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
    return new Promise((resolve, reject) => {
      process.on('uncaughtException', e => {
        logger.send({ name: 'error', data: e });
      });

      const rootNode = new Vertex({
        state: this.state,
        chosenChange: null,
        parent: null,
        depth: 0,
      });
      const tree = new Tree(rootNode);

      const closed = [];
      while (true) {
        const parent = tree.expandable.shift();
        const parentState = parent.data.state;

        if (parentState.matrix.isEqual(new Matrix(Puzzle.solutionTemplate))) {
          console.log(parentState.printState());
          resolve(parent);
          break;
        }

        const newVerteces = [];
        for (const possibleChange of parentState.possibleChanges) {
          const newState = parentState.changeState(possibleChange);
          if (!closed.includes(newState.matrix.toString())) {
            newVerteces.push(
              new Vertex({
                state: newState,
                chosenChange: possibleChange,
                parent,
                depth: parent.data.depth + 1,
              })
            );
          }
        }

        if (newVerteces.length !== 0) {
          tree.expand(parent, ...newVerteces);
          tree.expandable.push(...newVerteces);
        }
        closed.push(parentState.matrix.toString());

        if (tree.expandable.length === 0) {
          reject('Expandable is empty');
        }

        logger.send({
          name: 'data',
          data: {
            memory: process.resourceUsage().maxRSS,
            depth: parent.data.depth,
          },
        });
      }
    });
  }

  static solutionTemplate = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, null],
  ];
}

module.exports = Puzzle;
