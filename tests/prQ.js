'use strict';

const PQueue = require('../src/Lab1/PriorityQueue.js');

const pq = new PQueue(1, 0, true);
pq.push(4, 10);
pq.push(2, 0);
pq.push(3, 0);

for (let i = 0; i < 4; i++) {
  console.log(pq.pop());
}
