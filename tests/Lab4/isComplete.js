'use strict';

const Graph = require('../../src/Lab4/Graph');
const Vertex = require('../../src/Lab4/Vertex');

const graph = new Graph();

const v1 = new Vertex(1);
const v2 = new Vertex(2);
const v3 = new Vertex(3);

graph.insert(v1, v2, v3);
graph.connect(0, 1);
graph.connect(0, 2);
graph.connect(1, 0);
graph.connect(1, 2);
graph.connect(2, 0);
graph.connect(2, 1);

console.log(graph.connections);
console.log(graph.isComplete);
