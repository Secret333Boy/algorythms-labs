'use strict';
const Node = require('./Node.js');
const Queue = require('./Queue.js');

class PriorityQueue extends Queue {
  constructor(data, priority) {
    super(data);
    if (this.head) this.head.priority = priority;
  }

  push(data, priority) {
    const node = new Node(data, priority);

    if (this.head.priority < priority) {
      node.nextNode = this.head;
      this.head = node;
    } else if (this.lastNode.priority > priority) {
      this.lastNode.nextNode = node;
      this.lastNode = node;
    } else {
      let pointer = this.head;
      while (pointer.nextNode && pointer.nextNode.priority >= priority) {
        pointer = pointer.nextNode;
      }

      const buf = pointer.nextNode;
      pointer.nextNode = node;
      node.nextNode = buf;
    }
  }
}

module.exports = PriorityQueue;
