'use strict';

const BTree = require('./BTree.js');

class Lab2 {
  start() {
    const t = 3;

    const btree = new BTree(t);
    btree
      .insert(8)
      .insert(12)
      .insert(5)
      .insert(0)
      .insert(15)
      .insert(7)
      .insert(23)
      .insert(48)
      .insert(16)
      .insert(51);
    console.dir(btree, { depth: null });
  }
}

module.exports = Lab2;
