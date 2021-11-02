'use strict';

const DB = require('./DB.js');
const GUI = require('./GUI.js');
const stdinput = require('../stdinput.js');
const path = '/database.dat';

class Lab2 {
  async start() {
    const db = new DB();
    const gui = new GUI();

    db.loadFromFile(path);

    let flag = true;
    const loadGui = async () => {
      const drawCurrentDB = () => {
        gui.sendMessage(`Current db: ${db.path}`);
      };
      const drawMenu = () => {
        gui.sendMessage(
          '1 - Insert data\n2 - Remove data\n3 - Update data\n4 - Find data\n5 - Load data from file\n6 - Save to file and exit'
        );
      };
      const drawInsertData = () => {
        gui.sendMessage('Input data: ');
      };
      const drawInsertKey = () => {
        gui.sendMessage('Input key: ');
      };
      const drawInsertPath = () => {
        gui.sendMessage('Input path: ');
      };
      gui.addElementCallback(drawCurrentDB);
      let mainMenu = gui.addElementCallback(drawMenu);

      const getKey = async () => {
        gui.removeElementCallback(mainMenu);
        const keyInput = gui.addElementCallback(drawInsertKey);
        const result = await stdinput();
        mainMenu = gui.addElementCallback(drawMenu);
        gui.removeElementCallback(keyInput);
        if (result === '') return undefined;
        if (result === '0') return 0;
        return Number(result);
      };

      const getData = async () => {
        gui.removeElementCallback(mainMenu);
        const dataInput = gui.addElementCallback(drawInsertData);
        const result = await stdinput();
        mainMenu = gui.addElementCallback(drawMenu);
        gui.removeElementCallback(dataInput);
        return result;
      };

      const getPath = async () => {
        gui.removeElementCallback(mainMenu);
        const pathInput = gui.addElementCallback(drawInsertPath);
        const result = await stdinput();
        mainMenu = gui.addElementCallback(drawMenu);
        gui.removeElementCallback(pathInput);
        return result;
      };

      const data = await stdinput();

      switch (data) {
        case '1':
          db.insert(await getData(), await getKey());
          break;
        case '2':
          db.remove(await getKey());
          break;
        case '3':
          db.update(await getKey(), await getData());
          break;
        case '4':
          gui.sendMessage(db.find(await getKey()));
          gui.sendMessage('Press enter...');
          await stdinput();
          break;
        case '5':
          db.saveToFile();
          db.loadFromFile(await getPath());
          break;
        case '6':
          gui.sendMessage('Press enter...');
          await stdinput(true);
          flag = false;
          break;
        default:
          gui.sendError('Unexpected input');
          await stdinput();
          break;
      }
      gui.clearElementCallbacks();
      db.saveToFile();
      return flag;
    };

    while (flag) {
      flag = await loadGui();
    }
    gui.clear();
  }
}

module.exports = Lab2;
