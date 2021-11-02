'use strict';
const readline = require('readline');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const stdinput = (close = false) =>
  new Promise(
    resolve => {
      reader.on('line', line => {
        resolve(line);
        if (close) {
          reader.close();
        }
      });
    },
    reject => reject()
  );

module.exports = stdinput;
