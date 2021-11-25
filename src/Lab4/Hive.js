'use strict';

const Bee = require('./Bee.js');
const Scout = require('./Scout.js');
const Field = require('./Field.js');

const percentageWorkers = 0.9;

class Hive {
  bees = {
    workers: [],
    scouts: [],
  };
  constructor(graph, beesNum = 1000, location = null) {
    this.graph = graph;
    for (let i = 0; i < beesNum; i++) {
      if (i <= Math.round(percentageWorkers * beesNum) - 1) {
        this.bees.workers.push(new Bee(location));
      } else {
        this.bees.scouts.push(new Scout(location));
      }
    }
    this.location = location;
  }

  sendScouts(...fields) {
    const newFields = [];
    for (const field of fields) {
      const scout = this.freeScouts[0];
      if (this.freeScouts.length < this.bees.scouts.length * 0.05) {
        const randomLocation = [];
        for (let i = 0; i < field.location.length; i++) {
          randomLocation.push(Math.random() < 0.4 ? 1 : 0);
        }
        scout?.moveTo(new Field(randomLocation));
        continue;
      }

      scout?.moveTo(field);
    }

    for (const scout of this.bees.scouts) {
      if (!scout.field) break;
      const verteces = this.#getVertecesFromLocation(scout.field.location);
      if (this.graph.subgraph(verteces).isComplete) {
        scout.field.nectar = verteces.length;
        newFields.push(scout.field);
      }
      scout.moveTo(this.location);
    }
    return newFields;
  }

  sendWorkers(...fields) {
    const newFields = [];
    const sumNectar = fields.reduce((acc, el) =>
      typeof acc === 'number' ? acc + el.nectar : acc.nectar + el.nectar
    );
    const possibilities = fields.map(el => el.nectar / sumNectar);

    for (const worker of this.bees.workers) {
      const possibility = Math.random();

      let i = 0;
      let sum = 0;
      while (sum < possibility && i < possibilities.length - 1) {
        sum += possibilities[i];
        i++;
      }

      worker.moveTo(fields[i]);

      for (let i = 0; i < 10; i++) {
        worker.moveToNeighbour();
        const verteces = this.#getVertecesFromLocation(worker.field.location);
        if (
          this.graph.subgraph(verteces).isComplete &&
          verteces.length > fields[i].nectar
        ) {
          newFields.push(worker.field);
        }
      }
    }

    this.bees.workers.forEach(el => el.moveTo(this.location));
    return newFields.concat(fields);
  }

  #getVertecesFromLocation(location) {
    return location
      .map((el, i) => (el !== 0 ? this.graph.verteces[i] : 0))
      .filter(el => el !== 0);
  }

  get freeScouts() {
    return this.bees.scouts.filter(scout => scout.field === this.location);
  }

  get freeWorkers() {
    return this.bees.workers.filter(scout => scout.field === this.location);
  }
}

module.exports = Hive;
