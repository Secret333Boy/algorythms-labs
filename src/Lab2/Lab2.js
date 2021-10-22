'use strict';

const BTree = require('./BTree.js');
const keys = require('./keys.js');

class Lab2 {
  start() {
    const t = 3;

    const btree = new BTree(t);
    for (const key of keys) {
      btree.insert(key);
    }

    console.dir(btree, { depth: null });
    console.log('======');
    const removeKeys = [
      15, 20, 16, 24, 7, 1, 2, 4, 6, 5, 3, 13, 11, 10, 12, 19, 14, 25, 22, 17,
      18, 21, 26,
    ];
    for (const key of removeKeys) {
      btree.remove(key);
    }
    console.dir(btree, { depth: null });
    console.log(
      'Allocated memory: ' + process.resourceUsage().maxRSS / 1000 + 'Mb'
    );

    for (const key of keys) {
      if (!removeKeys.includes(key)) console.log(`${key}: ${btree.find(key)}`);
    }
  }
}

module.exports = Lab2;
