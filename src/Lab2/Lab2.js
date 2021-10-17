'use strict';

const BTree = require('./BTree.js');

class Lab2 {
  start() {
    const t = 50;

    const btree = new BTree(t);
    btree.insert(10);
  }
}

module.exports = Lab2;
