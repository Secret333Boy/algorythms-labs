'use strict';

class BNode {
  constructor(...data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  static isBNode(obj) {
    return obj instanceof BNode;
  }
}

module.exports = BNode;
