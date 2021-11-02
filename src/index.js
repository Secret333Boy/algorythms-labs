'use strict';

const labs = [];
labs.push(require('./Lab1/Lab1.js'));
labs.push(require('./Lab2/Lab2.js'));
labs.push(require('./Lab3/Lab3.js'));
const stdinput = require('./stdinput.js');

console.log('What lab do you want to execute? [1, 2, 3]');

stdinput().then(line => {
  const num = +line;
  if (num > 0 && num <= labs.length) {
    const labInstance = new labs[num - 1]();
    labInstance.start();
  } else {
    console.error('Wrong number!');
  }
});
