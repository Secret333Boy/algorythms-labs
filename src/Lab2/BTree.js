'use strict';

const BNode = require('./BNode.js');

class BTree {
  constructor(t, rootData = null) {
    this.t = t;
    this.root = [new BNode(rootData)];
  }

  find(key) {
    let node = this.root;
    while (true) {
      let leftP = 0;
      let rightP = node.length - 1;

      while (true) {
        if (Math.abs(leftP - rightP) === 1 || leftP === rightP) {
          if (node[leftP].data === key) return node[leftP];
          if (node[rightP].data === key) return node[rightP];

          break;
        }
        const middleP = Math.floor((rightP - leftP) / 2);
        const middle = node[middleP];

        if (key === middle.data) {
          return middle;
        } else if (key < middle.data) {
          rightP = middleP;
        } else {
          leftP = middleP;
        }
      }

      if (!this.#isLeaf(node)) {
        for (let i = 0; i < node.length; i++) {
          const currBNode = node[i];
          const nextBnode = node[i + 1];

          if (i === 0 && key <= currBNode.data) {
            node = currBNode.left;
            break;
          }
          if (!nextBnode || (key >= currBNode.data && key <= nextBnode.data)) {
            node = currBNode.right;
            break;
          }
        }
      } else {
        return false;
      }
    }
  }

  insert(k, node = this.root, prevNode = null) {
    if (this.root[0].data === null) {
      this.root[0].data = k;
      return this;
    }

    if (!this.#isLeaf(node)) {
      for (let i = 0; i < node.length; i++) {
        const currBNode = node[i];
        const nextBnode = node[i + 1];

        if (i === 0 && k <= currBNode.data) {
          this.insert(k, currBNode.left, node);
          break;
        }
        if (!nextBnode || (k >= currBNode.data && k <= nextBnode.data)) {
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
