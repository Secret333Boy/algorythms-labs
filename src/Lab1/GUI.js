'use strict';

class GUI {
  constructor() {
    this.clear();
    this.drawCallbacks = [];
  }

  update() {
    this.clear();
    for (const callback of this.drawCallbacks) {
      callback();
    }
  }

  addElementCallback(...callbacks) {
    this.drawCallbacks.push(...callbacks);
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
