'use strict';

const BTree = require('../../src/Lab2/BTree.js');
const keys = require('./keys.js');

const t = 3;

const btree = new BTree(t);
for (const key of keys) {
  btree.insert(key);
}

console.dir(btree, { depth: null });
console.log('======');
const removeKeys = [
  15, 20, 16, 24, 7, 1, 2, 4, 6, 5, 3, 13, 11, 10, 12, 19, 14, 25, 22, 17, 18,
  21, 26,
];
for (const key of removeKeys) {
  let c = 0;
  for (const key of keys) {
    if (btree.find(key)) {
      c++;
    }
  }
  console.log(c);
  btree.remove(key);
  console.log('=====');
}
console.dir(btree, { depth: null });
console.log(
  'Allocated memory: ' + process.resourceUsage().maxRSS / 1000 + 'Mb'
);
