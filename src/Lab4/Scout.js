'use strict';

const Bee = require('./Bee.js');

class Scout extends Bee {
  constructor(field) {
    super(field);
  }

  static isScout(obj) {
    return obj instanceof Scout;
  }
}

module.exports = Scout;
