'use strict';

class Field {
  constructor(location = null, size = 1) {
    this.location = location;
    this.size = size;
    this.nectar = 0;
    this.bees = [];
    this.nearFields = [];
  }
}

module.exports = Field;
