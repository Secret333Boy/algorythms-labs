'use strict';

const GUI = require('./GUI.js');

const gui = new GUI();
let logging, memory;
process.on('message', msg => {
  if (msg.name === 'start') {
    gui.clear();
    const guiCallback = () => {
      gui.sendMessage('Initial state:\n');
      gui.sendMessage(msg.initialState);

      if (memory) {
        gui.sendMessage(memory.rss / 1000000 + 'Mb');
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
      console.dir(msg.data.data.state, { depth: null });
    });
    process.exit();
  } else if (msg.name === 'memory') {
    memory = msg.data;
  }
});
