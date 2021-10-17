'use strict';

const BNode = require('./BNode.js');

class BTree {
  constructor(t, rootData = null) {
    this.t = t;
    this.root = [new BNode(rootData)];
  }

  find() {}

  insert() {}

  remove() {}

  static isBTree(obj) {
    return obj instanceof BTree;
  }
}

module.exports = BTree;
