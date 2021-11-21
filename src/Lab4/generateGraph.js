'use strict';
const generateRandom = require('./generateRandom.js');
const Graph = require('./Graph.js');
const Vertex = require('./Vertex.js');
const fs = require('fs');

module.exports = (vertecesNum, minPower, maxPower) => {
  const graph = new Graph();

  for (let i = 0; i < vertecesNum; i++) {
    const vertex = new Vertex({});
    graph.insert(vertex);
  }

  for (let i = 0; i < vertecesNum; i++) {
    const vertex1 = graph.verteces[i];
    const expectedPower = Math.round(generateRandom(minPower, maxPower));
    while (vertex1.power < expectedPower) {
      const j = Math.round(Math.random() * (vertecesNum - 1));
      const vertex2 = graph.verteces[j];

      if (vertex2.power < maxPower) {
        graph.connect(i, j);
        graph.connect(j, i);
      }
    }
  }

  fs.writeFileSync('./graph.log', JSON.stringify(graph.matrix.arr));
  return graph;
};
