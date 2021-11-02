'use strict';
const fs = require('fs');
const path = '/database.dat';

const letters = 'qwertyuiopasdfghjklzxcvbnm';

let i = 1000000;
for (i; i > 0; i--) {
  let res = '';
  for (let j = 0; j < 5; j++) {
    const index = Math.floor(Math.random() * letters.length);
    res += letters[index];
  }
  fs.appendFileSync(__dirname + path, res + '\n');
}
