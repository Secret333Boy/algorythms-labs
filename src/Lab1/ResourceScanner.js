'use strict';

const GUI = require('./GUI.js');

const gui = new GUI();
let logging, memory, depth, debugInfo;
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

      if (debugInfo) {
        gui.sendMessage('Debug info:');
        for (const info of debugInfo) {
          console.log(info);
        }
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
    gui.addElementCallback(() => {
      gui.sendMessage('Solution found!');
      console.timeEnd('Solution');
      gui.sendMessage(msg.data);
    });
    process.exit();
  } else if (msg.name === 'error') {
    gui.sendError(msg.data);
    process.exit();
  } else if (msg.name === 'data') {
    memory = msg.data.memory;
    depth = msg.data.depth;
  } else if (msg.name === 'debug') {
    debugInfo = msg.data;
  }
});
