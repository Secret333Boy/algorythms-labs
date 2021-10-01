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

  findSolutionBFS(logger, ...counters) {
    setTimeout(() => {
      logger.send({ name: 'error', data: 'Time limit exeeded' });
      process.exit();
    }, 1000 * 60 * 30);
    return new Promise((resolve, reject) => {
      const rootNode = new Vertex({
        state: this.state,
        chosenChange: null,
        parent: null,
        depth: 0,
      });
      const tree = new Tree(rootNode);

      const open = [rootNode];
      const closed = [];
      while (true) {
        const parent = open.shift();
        const parentState = parent.data.state;

        if (parentState.matrix.isEqual(new Matrix(Puzzle.solutionTemplate))) {
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
          open.push(...newVerteces);
        }
        closed.push(parentState.matrix.toString());

        if (open.length === 0) {
          reject('Expandable is empty');
        }

        if (logger) {
          if (process.resourceUsage().maxRSS / 1000 > 512) {
            logger.send({ name: 'error', data: 'Maximum heap size exeeded' });
            process.exit();
          }
          logger.send({
            name: 'data',
            data: {
              memory: process.resourceUsage().maxRSS,
              depth: parent.data.depth,
            },
          });
        }

        for (const counter of counters) {
          if (counter.name === 'iterations') {
            counter.increment();
          } else if (counter.name === 'totalStates') {
            counter.c += newVerteces.length;
          } else if (counter.name === 'totalStatesInMemory') {
            counter.c = tree.matrix.xLength;
          }
        }
      }
    });
  }

  findSolutionRBFS(logger, ...counters) {
    setTimeout(() => {
      logger.send({ name: 'error', data: 'Time limit exeeded' });
      process.exit();
    }, 1000 * 60 * 30);
    return new Promise((resolve, reject) => {
      const rootNode = new Vertex({
        state: this.state,
        chosenChange: null,
        parent: null,
        depth: 0,
        f: this.state.h,
      });
      const tree = new Tree(rootNode);
      const open = new PriorityQueue(rootNode, Infinity, true);

      const rbfs = (parent, fLimit) => {
        if (!tree.verteces.includes(parent)) {
          return [false, false];
        }

        const parentState = parent.data.state;
        if (parentState.matrix.isEqual(new Matrix(Puzzle.solutionTemplate))) {
          return [parent, false];
        }

        for (const possibleChange of parentState.possibleChanges) {
          const newState = parentState.changeState(possibleChange);
          const newVertex = new Vertex({
            state: newState,
            chosenChange: possibleChange,
            parent,
            depth: parent.data.depth + 1,
            f: Math.max(parent.data.depth + 1 + newState.h, parent.data.f),
          });

          tree.expand(parent, newVertex);
          open.push(newVertex, newVertex.data.f);
        }

        for (const counter of counters) {
          if (counter.name === 'iterations') {
            counter.increment();
          } else if (counter.name === 'totalStates') {
            counter.c += parent.links.size;
          } else if (counter.name === 'totalStatesInMemory') {
            counter.c = tree.matrix.xLength;
          }
        }

        if (open.length === 0) reject('No open verteces left');

        while (true) {
          const best = open.pop();
          if (best.data.f > fLimit) {
            return [false, best.data.f];
          }

          if (logger) {
            if (process.resourceUsage().maxRSS / 1000 > 512) {
              logger.send({ name: 'error', data: 'Maximum heap size exeeded' });
              process.exit();
            }

            logger.send({
              name: 'data',
              data: {
                memory: process.resourceUsage().maxRSS,
                depth: parent.data.depth,
              },
            });
          }

          let pointer = open.head;
          while (pointer && pointer.priority <= best.data.f) {
            pointer = pointer.nextNode;
          }
          const alternative = pointer?.priority || open.head.data.data.f;

          let result = false;
          [result, best.data.f] = rbfs(best, Math.min(fLimit, alternative));
          if (best.data.f) {
            open.push(best, best.data.f);
            for (const child of best.links.values()) {
              tree.cut(child);
            }
          }
          if (result) {
            return [result, false];
          }
        }
      };

      resolve(rbfs(rootNode, Infinity));
    });
  }

  static solutionTemplate = State.GoalState;
}

module.exports = Puzzle;
