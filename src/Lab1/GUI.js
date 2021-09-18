'use strict';

class GUI {
  constructor() {
    console.log('started!');
  }

  clear() {
    console.log('\u001B[2J\u001B[0;0f');
  }

  sendMessage(message) {
    console.log('\x1b[35m');
    console.log(message);
  }
}

module.exports = GUI;
