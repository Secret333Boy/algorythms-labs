'use strict';

class BNode {
  constructor(key, data = null) {
    this.key = key;
    this.data = data;
    this.left = null;
    this.right = null;
  }

  static isBNode(obj) {
    return obj instanceof BNode;
  }
}

module.exports = BNode;
