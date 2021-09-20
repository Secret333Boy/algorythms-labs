'use strict';

let gui;
process.on('message', (msg, handle) => {
  if (msg === 'start') {
    console.time('Solution');
    gui.addElementCallback(() => {
      console.timeLog('Solution');
    });
  } else if (msg === 'end') {
    console.timeEnd('Solution');
    process.exit();
  } else if (msg === 'gui') {
    gui = handle;
  }
});
