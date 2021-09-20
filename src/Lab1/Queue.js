'use strict';

const Node = require('./Node.js');

class Queue {
  constructor(data = null) {
    this.head = data ? new Node(data) : data;
    this.lastNode = this.head;
  }

  push(data) {
    const node = new Node(data);
    this.lastNode.nextNode = node;
    this.lastNode = node;
  }

  pop() {
    const res = this.head.data;
    this.head = this.head.nextNode;
    return res;
  }

  clear() {
    while (this.head) {
      this.pop();
    }
  }
}

module.exports = Queue;
