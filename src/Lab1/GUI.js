'use strict';

class GUI {
  constructor(...callbacks) {
    this.clear();
    this.drawCallbacks = callbacks;
  }

  update() {
    this.clear();
    console.log('\x1b[35m');
    for (const callback of this.drawCallbacks) {
      callback();
    }
  }

  addElementCallback(callback) {
    if (typeof callback === 'function') {
      this.drawCallbacks.push(callback);
      this.update();
    } else {
      throw new TypeError(`Must be function, got ${typeof callback}`);
    }
    return this.drawCallbacks.length - 1;
  }

  removeElementCallback(id) {
    this.drawCallbacks.splice(id, 1);
  }

  clearElementCallbacks() {
    this.drawCallbacks = [];
    this.update();
  }

  clear() {
    console.log('\x1Bc');
  }

  sendMessage(message) {
    console.log('\x1b[35m');
    console.log(message);
  }
}

module.exports = GUI;
