'use strict';

const Field = require('./Field.js');

class Bee {
  constructor(field) {
    this.field = field;
  }

  moveTo(field) {
    this.field?.bees.splice(this.field?.bees.indexOf(this), 1);
    this.field = field;
    this.field?.bees.push(this);
  }

  moveToNeighbour() {
    const randomIndex = Math.round(
      Math.random() * (this.field.location.length - 1)
    );
    const neighbourLocation = new Array(...this.field.location);
    neighbourLocation[randomIndex] =
      neighbourLocation[randomIndex] === 0 ? 1 : 0;
    const neighbour = new Field(neighbourLocation);
    this.moveTo(neighbour);
  }

  static isBee(obj) {
    return obj instanceof Bee;
  }
}

module.exports = Bee;
