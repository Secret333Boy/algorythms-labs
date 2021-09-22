'use strict';

const GUI = require('./GUI.js');

const gui = new GUI();
let logging, memory, depth;
process.on('message', msg => {
  if (msg.name === 'start') {
    gui.clear();
    const guiCallback = () => {
      gui.sendMessage('Initial state:\n');
      gui.sendMessage(msg.initialState);

      if (memory) {
        gui.sendMessage('Memory: ' + memory / 1000 + 'Mb');
      }

      if (depth) {
        gui.sendMessage('Depth: ' + depth);
      }
    };
    gui.addElementCallback(guiCallback);
    logging = gui.addElementCallback(() => {
      console.timeLog('Solution');
    });
    setInterval(() => {
      gui.update();
    }, 100);
    console.time('Solution');
  } else if (msg.name === 'end') {
    gui.removeElementCallback(logging);
    console.timeEnd('Solution');
    gui.addElementCallback(() => {
      gui.sendMessage('Solution found!');
      gui.sendMessage(msg.data);
    });
    process.exit();
  } else if (msg.name === 'error') {
    gui.sendError(msg.data);
    process.exit();
  } else if (msg.name === 'data') {
    memory = msg.data.memory;
    depth = msg.data.depth;
  }
});
