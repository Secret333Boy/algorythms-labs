'use strict';

process.on('message', msg => {
  if (msg === 'end') {
    console.timeEnd('Solution');
    process.exit();
  } else if (msg === 'start') {
    console.time('Solution');
    setInterval(() => {
      console.timeLog('Solution');
    }, 10);
  }
});
