'use strict';

class BNode {
  constructor(...data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

module.exports = BNode;
