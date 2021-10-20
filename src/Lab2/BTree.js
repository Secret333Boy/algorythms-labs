'use strict';

const BNode = require('./BNode.js');

class BTree {
  constructor(t, rootData = null) {
    this.t = t;
    this.root = [new BNode(rootData)];
  }

  find() {}

  insert(k, node = this.root, prevNode = null) {
    if (this.root[0].data === null) {
      this.root[0].data = k;
      return this;
    }

    if (!this.#isLeaf(node)) {
      for (let i = 0; i < node.length; i++) {
        const currBNode = node[i];

        if (i === 0 && k <= currBNode.left[currBNode.left.length - 1]) {
          this.insert(k, currBNode.left, node);
          break;
        } else if (k >= currBNode.right[0].data) {
          this.insert(k, currBNode.right, node);
          break;
        }
      }
    } else {
      let i = 0;
      while (i < node.length && k > node[i].data) {
        i++;
      }
      node.splice(i, 0, new BNode(k));
    }

    if (node.length === 2 * this.t - 1) {
      const nodeL = node.slice(0, this.t - 1);
      const middleNode = node.slice(this.t - 1, this.t);
      const nodeR = node.slice(this.t);

      const middleItem = middleNode[0];
      middleItem.left = nodeL;
      middleItem.right = nodeR;
      if (!prevNode) {
        this.root = middleNode;
      } else {
        let i = 0;
        while (i < prevNode.length && k > prevNode[i].data) {
          i++;
        }
        prevNode.splice(i, 0, middleItem);
        for (const bnode of prevNode) {
          if (bnode.left.includes(middleItem)) {
            bnode.left = nodeR;
          }

          if (bnode.right.includes(middleItem)) {
            bnode.right = nodeL;
          }
        }
      }
    }
    return this;
  }

  remove() {}

  #isLeaf(arr) {
    let flag = true;
    for (const el of arr) {
      if (el.left || el.right) {
        flag = false;
      }
    }
    return flag;
  }

  static isBTree(obj) {
    return obj instanceof BTree;
  }
}

module.exports = BTree;
