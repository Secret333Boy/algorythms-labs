'use strict';

const BNode = require('./BNode.js');

class BTree {
  constructor(t, key, rootData = null) {
    this.t = t;
    this.root = key ? [new BNode(key, rootData)] : [];
  }

  find(key) {
    if (this.root.length === 0) return false;
    let node = this.root;
    while (true) {
      let leftP = 0;
      let rightP = node.length - 1;

      while (true) {
        if (Math.abs(leftP - rightP) === 1 || leftP === rightP) {
          if (node[leftP].key === key) return node[leftP];
          if (node[rightP].key === key) return node[rightP];

          break;
        }
        const middleP = Math.floor((rightP + leftP) / 2);
        const middle = node[middleP];

        if (key === middle.key) {
          return middle;
        } else if (key < middle.key) {
          rightP = middleP;
        } else {
          leftP = middleP;
        }
      }

      if (!this.#isLeaf(node)) {
        for (let i = 0; i < node.length; i++) {
          const currBNode = node[i];
          const nextBnode = node[i + 1];

          if (i === 0 && key <= currBNode.key) {
            node = currBNode.left;
            break;
          }
          if (!nextBnode || (key >= currBNode.key && key <= nextBnode.key)) {
            node = currBNode.right;
            break;
          }
        }
      } else {
        return false;
      }
    }
  }

  insert(key, data, node = this.root, prevNode = null) {
    if (this.root.length === 0) {
      this.root.push(new BNode(key, data));
      return this;
    }

    if (!this.#isLeaf(node)) {
      for (let i = 0; i < node.length; i++) {
        const currBNode = node[i];
        const nextBnode = node[i + 1];

        if (i === 0 && key <= currBNode.key) {
          this.insert(key, data, currBNode.left, node);
          break;
        }
        if (!nextBnode || (key >= currBNode.key && key <= nextBnode.key)) {
          this.insert(key, data, currBNode.right, node);
          break;
        }
      }
    } else {
      let i = 0;
      while (i < node.length && key > node[i].key) {
        i++;
      }
      node.splice(i, 0, new BNode(key, data));
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
        while (i < prevNode.length && key > prevNode[i].key) {
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

  remove(key, node = this.root, prevNode = null) {
    let leftP = 0;
    let rightP = node.length - 1;

    let bnode = null;
    while (true) {
      if (Math.abs(leftP - rightP) === 1 || leftP === rightP) {
        if (node[leftP].key === key) {
          bnode = node[leftP];
        }
        if (node[rightP].key === key) {
          bnode = node[rightP];
        }

        break;
      }
      const middleP = Math.floor((rightP + leftP) / 2);
      const middle = node[middleP];

      if (key === middle.key) {
        bnode = middle;
        break;
      } else if (key < middle.key) {
        rightP = middleP;
      } else {
        leftP = middleP;
      }
    }

    const index = node.indexOf(bnode);
    let result = false;
    if (bnode && !(bnode.left || bnode.right)) {
      if (index >= 0) {
        node.splice(index, 1);
      }
    } else if (bnode) {
      const leftNode = bnode.left;
      const rightNode = bnode.right;

      let rightLeaf = bnode.right;
      while (true) {
        if (rightLeaf[0].left === null) break;
        rightLeaf = rightLeaf[0].left;
      }

      let leftLeaf = bnode.left;
      while (true) {
        if (leftLeaf[leftLeaf.length - 1].right === null) break;
        leftLeaf = leftLeaf[leftLeaf.length - 1].right;
      }

      if (
        leftNode.length === this.t - 1 &&
        rightNode.length === leftNode.length
      ) {
        const prevBNode = node[index - 1];
        const nextBNode = node[index + 1];

        node.splice(index, 1);

        let newNode = bnode.left.concat([bnode]).concat(bnode.right);
        bnode.left = newNode[newNode.indexOf(bnode) - 1].right || null;
        bnode.right = newNode[newNode.indexOf(bnode) + 1].left || null;
        if (prevBNode) prevBNode.right = newNode;
        if (nextBNode) nextBNode.left = newNode;
        if (node.length === 0) {
          node.push(...newNode);
          newNode = node;
        }
        result = this.remove(key, newNode, node);
      } else if (leftLeaf.length >= this.t) {
        const swapBNode = leftLeaf.pop();

        node.splice(index, 1);
        leftLeaf.push(bnode);
        node.splice(index, 0, swapBNode);

        const buf = { left: bnode.left, right: bnode.right };
        bnode.left = swapBNode.left;
        bnode.right = swapBNode.right;
        swapBNode.left = buf.left;
        swapBNode.right = buf.right;
        result = this.remove(key, swapBNode.left, node);
      } else if (rightLeaf.length >= this.t) {
        const swapBNode = rightLeaf.shift();

        node.splice(index, 1);

        rightLeaf.unshift(bnode);
        node.splice(index, 0, swapBNode);

        const buf = { left: bnode.left, right: bnode.right };
        bnode.left = swapBNode.left;
        bnode.right = swapBNode.right;
        swapBNode.left = buf.left;
        swapBNode.right = buf.right;
        result = this.remove(key, swapBNode.right, node);
      }
    } else {
      for (let i = 0; i < node.length; i++) {
        const currBNode = node[i];
        const nextBnode = node[i + 1];

        if (i === 0 && key <= currBNode.key) {
          result = this.remove(key, currBNode.left, node);
          break;
        }
        if (!nextBnode || (key >= currBNode.key && key <= nextBnode.key)) {
          result = this.remove(key, currBNode.right, node);
          break;
        }
      }
    }

    if (prevNode && node.length <= this.t - 1) {
      let parentBNode = null;
      for (const bnode of prevNode) {
        if (bnode.left === node || bnode.right === node) {
          parentBNode = bnode;
          break;
        }
      }
      const parentIndex = prevNode.indexOf(parentBNode);

      let swapBNode = null;
      if (parentBNode.left === node && parentBNode.right.length > this.t - 1) {
        swapBNode = parentBNode.right.shift();

        prevNode.splice(parentIndex, 1);
        const buf = { left: parentBNode.left, right: parentBNode.right };

        parentBNode.left = node[node.length - 1]?.right || null;
        parentBNode.right = swapBNode.left || null;

        swapBNode.left = buf.left;
        swapBNode.right = buf.right;

        node.push(parentBNode);
        prevNode.splice(parentIndex, 0, swapBNode);
      } else if (
        parentBNode.right === node &&
        parentBNode.left.length > this.t - 1
      ) {
        swapBNode = parentBNode.left.pop();

        prevNode.splice(parentIndex, 1);
        node.unshift(parentBNode);
        const buf = { left: parentBNode.left, right: parentBNode.right };

        parentBNode.left = swapBNode.right;
        parentBNode.right = node[0].left;

        swapBNode.left = buf.left;
        swapBNode.right = buf.right;

        prevNode.splice(parentIndex, 0, swapBNode);
      } else if (
        (parentBNode.left === node &&
          parentBNode.right.length === this.t - 1) ||
        (parentBNode.right === node && parentBNode.left.length === this.t - 1)
      ) {
        const prevBNode = prevNode[parentIndex - 1];
        const nextBNode = prevNode[parentIndex + 1];

        prevNode.splice(parentIndex, 1);

        const newNode = parentBNode.left
          .concat([parentBNode])
          .concat(parentBNode.right);
        parentBNode.left =
          parentBNode.left[parentBNode.left.length - 1]?.right || null;
        parentBNode.right = parentBNode.right[0]?.left || null;
        if (prevBNode) prevBNode.right = newNode;
        if (nextBNode) nextBNode.left = newNode;
        if (prevNode.length === 0) prevNode.push(...newNode);
        if (this.root.length === 0) this.root = newNode;
      } else {
        result = false;
      }
    }
    return result;
  }

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
