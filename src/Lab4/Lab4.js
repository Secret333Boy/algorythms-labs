'use strict';

const generateGraph = require('./generateGraph.js');

const vertecesNum = 300;
const minPower = 2;
const maxPower = 30;

class Lab4 {
  start() {
    generateGraph(vertecesNum, minPower, maxPower);
  }
}

module.exports = Lab4;
