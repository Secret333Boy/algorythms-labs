'use strict';

const State = require('./State.js');
const Matrix = require('./Matrix.js');
const Tree = require('./Tree.js');
const shuffle = require('./shuffle.js');
const Vertex = require('./Vertex.js');
const PriorityQueue = require('./PriorityQueue.js');

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

  findSolutionBFS(logger) {
    return new Promise((resolve, reject) => {
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

        if (logger) {
          logger.send({
            name: 'data',
            data: {
              memory: process.resourceUsage().maxRSS,
              depth: parent.data.depth,
            },
          });
        }
      }
    });
  }

  findSolutionRBFS(logger) {
    return new Promise((resolve, reject) => {
      const rootNode = new Vertex({
        state: this.state,
        chosenChange: null,
        parent: null,
        depth: 0,
      });
      const tree = new Tree(rootNode);
      const open = new PriorityQueue(rootNode, Infinity, true);

      const rbfs = (parent, fLimit) => {
        const parentState = parent.data.state;
        if (parentState.matrix.isEqual(new Matrix(Puzzle.solutionTemplate))) {
          return parent;
        }

        for (const possibleChange of parentState.possibleChanges) {
          const newState = parentState.changeState(possibleChange);
          const newVertex = new Vertex({
            state: newState,
            chosenChange: possibleChange,
            parent,
            depth: parent.data.depth + 1,
            f: parent.data.depth + 1 + newState.h,
          });

          tree.expand(parent, newVertex);
          open.push(newVertex, newVertex.data.f);
        }

        if (open.length === 0) reject('No open verteces left');

        const best = open.pop();
        if (best.data.f > fLimit) reject('Best f > fLimit');

        if (logger) {
          logger.send({
            name: 'data',
            data: {
              memory: process.resourceUsage().maxRSS,
              depth: parent.data.depth,
            },
          });
        }

        const alternative = open.head.data.f;
        return rbfs(best, Math.min(fLimit, alternative));
      };

      resolve(rbfs(rootNode, Infinity));
    });
  }

  static solutionTemplate = State.GoalState;
}

module.exports = Puzzle;
