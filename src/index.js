'use strict';

const labs = [
  require('./Lab1/Lab1.js'),
  require('./Lab2/Lab2.js'),
  require('./Lab3/Lab3.js'),
  require('./Lab4/Lab4.js'),
];
const stdinput = require('./stdinput.js');

console.log('What lab do you want to execute? [1-4]');

stdinput().then(line => {
  const num = +line;
  if (num > 0 && num <= labs.length) {
    const labInstance = new labs[num - 1]();
    labInstance.start();
  } else {
    console.error('Wrong number!');
  }
});
