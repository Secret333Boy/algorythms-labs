'use strict';

const Graph = require('../../src/Lab4/Graph.js');
const Vertex = require('../../src/Lab4/Vertex.js');

const graph = new Graph();

const v1 = new Vertex(1);
const v2 = new Vertex(2);
const v3 = new Vertex(3);
const v4 = new Vertex(4);
const v5 = new Vertex(5);
const v6 = new Vertex(6);
const v7 = new Vertex(7);

graph.insert(v1, v2, v3, v4, v5, v6, v7);
graph.connect(0, 2);
graph.connect(2, 3);
graph.connect(3, 5);
graph.connect(5, 0);

const subgraph = graph.subgraph([v1, v3, v4, v2]);

console.dir(graph, { depth: null });
console.dir(subgraph, { depth: null });
