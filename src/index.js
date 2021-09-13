'use strict';

const labs = [];
labs.push(require('./Lab1/index.js'));
const stdinput = require('./stdinput.js');

console.log('What lab do you want to execute? [1 - x]');

stdinput().then(line => {
  const num = +line;
  if (num >= 0 && num < 2) {
    const labInstance = new labs[num - 1]();
    labInstance.start();
  } else {
    console.error('Wrong number!');
  }
});
