'use strict';

const Tree = require('../src/Lab1/Tree.js');
const Vertex = require('../src/Lab1/Vertex.js');

const rootNode = new Vertex({
  parent: null,
  depth: 0,
});

const tree = new Tree(rootNode);

const childNode1 = new Vertex({
  parent: rootNode,
  depth: 1,
});

const childNode2 = new Vertex({
  parent: rootNode,
  depth: 2,
});

const childNode3 = new Vertex({
  parent: rootNode,
  depth: 2,
});

tree.expand(rootNode, childNode1);
tree.expand(childNode1, childNode2);
tree.expand(childNode2, childNode3);
tree.cut(childNode1);
console.dir(tree, { depth: null });
